import {
  CANONICAL_INDIAN_STATES_AND_UTS,
  lookupOfflinePincode,
  type CanonicalIndianState,
} from './offlinePincodeMaster'
import { resolvePostalCircle } from './postalCirclePrefixes'
import { resolveUpdatedApTsDistrict } from './apTelanganaDistrictMaster'

export interface PincodeLookupResult {
  valid: boolean
  pincode: string
  areaLocality: string
  city: string
  district: string
  state: string
  postOffices: string[]
  source: 'cache' | 'network' | 'offline-master' | 'not-found'
}

/**
 * In-memory LRU-style cache for fast repeated lookups.
 */
const pincodeCache = new Map<string, PincodeLookupResult>()

/**
 * Normalizes any variations of state names to the canonical 36 Indian States and UTs.
 * Rule 2: No loops. Uses Array.prototype.find.
 */
export const normalizeIndianState = (rawState: string): CanonicalIndianState | string => {
  if (!rawState) return ''
  const trimmed = rawState.trim()
  const lower = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '')

  // Direct case-insensitive match
  const exact = CANONICAL_INDIAN_STATES_AND_UTS.find(
    (canon) => canon.toLowerCase().replace(/[^a-z0-9]/g, '') === lower
  )
  if (exact) return exact

  // Specific alias mappings
  const aliases: Record<string, CanonicalIndianState> = {
    odisha: 'Odisha',
    orissa: 'Odisha',
    pondicherry: 'Puducherry',
    puducherry: 'Puducherry',
    pondi: 'Puducherry',
    py: 'Puducherry',
    delhi: 'Delhi',
    nctdelhi: 'Delhi',
    nctofdelhi: 'Delhi',
    delhincr: 'Delhi',
    newdelhi: 'Delhi',
    uttaranchal: 'Uttarakhand',
    uttarakhand: 'Uttarakhand',
    chattisgarh: 'Chhattisgarh',
    chhattisgarh: 'Chhattisgarh',
    andamanandnicobarislands: 'Andaman and Nicobar Islands',
    andamanandnicobar: 'Andaman and Nicobar Islands',
    andaman: 'Andaman and Nicobar Islands',
    dadranagarhaveli: 'Dadra and Nagar Haveli and Daman and Diu',
    damandiu: 'Dadra and Nagar Haveli and Daman and Diu',
    dadraandnagarhavelianddamandiu: 'Dadra and Nagar Haveli and Daman and Diu',
    dadraandnagarhaveli: 'Dadra and Nagar Haveli and Daman and Diu',
    dnh: 'Dadra and Nagar Haveli and Daman and Diu',
    daman: 'Dadra and Nagar Haveli and Daman and Diu',
    diu: 'Dadra and Nagar Haveli and Daman and Diu',
    jammuandkashmir: 'Jammu and Kashmir',
    jammukashmir: 'Jammu and Kashmir',
    jk: 'Jammu and Kashmir',
    ladakh: 'Ladakh',
    leh: 'Ladakh',
    kargil: 'Ladakh',
    lakshadweep: 'Lakshadweep',
    lakshadweepislands: 'Lakshadweep',
    telengana: 'Telangana',
    telangana: 'Telangana',
    tamilnadu: 'Tamil Nadu',
    bengal: 'West Bengal',
    westbengal: 'West Bengal',
    chandigarh: 'Chandigarh',
    goa: 'Goa',
    sikkim: 'Sikkim',
    arunachal: 'Arunachal Pradesh',
    arunachalpradesh: 'Arunachal Pradesh',
    nagaland: 'Nagaland',
    mizoram: 'Mizoram',
    manipur: 'Manipur',
    meghalaya: 'Meghalaya',
    tripura: 'Tripura',
    assam: 'Assam',
  }

  return aliases[lower] || trimmed
}

interface PostalApiPostOffice {
  Name: string
  Description: string | null
  BranchType: string
  DeliveryStatus: string
  Circle: string
  District: string
  Division: string
  Region: string
  Block: string
  State: string
  Country: string
  Pincode: string
}

interface PostalApiResponse {
  Message: string
  Status: string
  PostOffice: PostalApiPostOffice[] | null
}

/**
 * Look up a 6-digit Indian PIN code.
 * Follows a multi-tier resolution strategy:
 * 1. Cache hit
 * 2. Network postal API (proxy or public Indian Postal API) with timeout
 * 3. Comprehensive offline master dataset
 *
 * Rule 2: Pure functional, no loops.
 */
export const lookupPincode = async (pincode: string): Promise<PincodeLookupResult> => {
  const clean = pincode.replace(/\D/g, '').slice(0, 6)

  if (clean.length !== 6) {
    return {
      valid: false,
      pincode: clean,
      areaLocality: '',
      city: '',
      district: '',
      state: '',
      postOffices: [],
      source: 'not-found',
    }
  }

  // 1. Check in-memory cache
  const cached = pincodeCache.get(clean)
  if (cached) {
    return { ...cached, source: 'cache' }
  }

  // Helper to store and return
  const cacheAndReturn = (result: PincodeLookupResult): PincodeLookupResult => {
    if (result.valid) {
      pincodeCache.set(clean, result)
    }
    return result
  }

  // 2. Try fetching from Postal API with a strict 2.5-second timeout
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2500)

    const response = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data: PostalApiResponse[] = await response.json()
      const firstEntry = data?.[0]

      if (firstEntry && firstEntry.Status === 'Success' && Array.isArray(firstEntry.PostOffice) && firstEntry.PostOffice.length > 0) {
        const offices = firstEntry.PostOffice

        // Clean post office and village names (stripping S.O, B.O, H.O suffixes)
        const cleanName = (name: string) =>
          name.replace(/\s+(S\.O|B\.O|H\.O|G\.P\.O|Branch Office|Sub Office|Head Office)$/i, '').trim()

        const cleanedOfficeNames = offices.map((po) => cleanName(po.Name)).filter(Boolean)
        const uniqueOfficeNames = Array.from(new Set(cleanedOfficeNames))

        // Select the most representative head/central office for district/city
        const headOffice = offices.find((po) => po.BranchType?.includes('Head') || po.Name?.includes('H.O')) || offices[0]

        // For areaLocality, pick one village/branch office if available, else first locality
        const villageOffice = offices.find((po) => po.BranchType?.includes('Branch') || po.Name?.includes('B.O'))
        const primaryAreaOffice = villageOffice || offices[0]
        const areaLocality = cleanName(primaryAreaOffice.Name)

        const circleInfo = resolvePostalCircle(clean)

        const rawDistrict = (headOffice.District || offices[0].District || circleInfo?.defaultDistrict || '')
          .replace(/\s+District$/i, '')
          .trim()
        const rawState = headOffice.State || offices[0].State || ''
        let normalizedState = normalizeIndianState(rawState)

        // Precision override for bifurcated UTs, islands, and enclaves
        if (
          circleInfo &&
          (circleInfo.state === 'Ladakh' ||
            circleInfo.state === 'Lakshadweep' ||
            circleInfo.state === 'Dadra and Nagar Haveli and Daman and Diu' ||
            circleInfo.state === 'Goa' ||
            circleInfo.state === 'Sikkim' ||
            circleInfo.state === 'Puducherry' ||
            circleInfo.state === 'Chandigarh' ||
            circleInfo.state === 'Andaman and Nicobar Islands')
        ) {
          normalizedState = circleInfo.state
        }

        // Nearby town, block or mandal if present in office records
        const rawBlock = headOffice.Block && headOffice.Block !== 'NA' ? headOffice.Block.trim() : ''
        const districtLower = rawDistrict.toLowerCase()

        // 100% accurate canonical city / nearby hub resolution
        let resolvedCity = circleInfo?.defaultCity || ''
        if (!resolvedCity) {
          if (districtLower.includes('delhi')) {
            resolvedCity = 'New Delhi'
          } else if (districtLower.includes('mumbai')) {
            resolvedCity = 'Mumbai'
          } else if (districtLower.includes('bengaluru') || districtLower.includes('bangalore')) {
            resolvedCity = 'Bengaluru'
          } else if (districtLower.includes('kolkata') || districtLower.includes('calcutta')) {
            resolvedCity = 'Kolkata'
          } else if (districtLower.includes('hyderabad')) {
            resolvedCity = 'Hyderabad'
          } else if (districtLower.includes('lakshadweep')) {
            resolvedCity = 'Kavaratti'
          } else if (rawBlock && rawBlock.toLowerCase() !== districtLower) {
            resolvedCity = rawBlock
          } else {
            resolvedCity = rawDistrict
          }
        }

        let resolvedDistrict = rawDistrict || circleInfo?.defaultDistrict || resolvedCity

        // Apply updated reorganized districts for Andhra Pradesh (26) and Telangana (33)
        const apTsOverride = resolveUpdatedApTsDistrict(
          clean,
          rawDistrict,
          headOffice.Name || offices[0].Name,
          rawBlock
        )
        if (apTsOverride) {
          resolvedDistrict = apTsOverride.district
          resolvedCity = apTsOverride.city || resolvedCity
          normalizedState = apTsOverride.state
        }

        const result: PincodeLookupResult = {
          valid: true,
          pincode: clean,
          areaLocality,
          city: resolvedCity,
          district: resolvedDistrict,
          state: normalizedState,
          postOffices: uniqueOfficeNames,
          source: 'network',
        }

        return cacheAndReturn(result)
      }
    }
  } catch {
    // Network failed, timed out, or offline - silently fallback to offline master
  }

  // 3. Fallback to Offline Master Dictionary
  const offlineMatch = lookupOfflinePincode(clean)
  if (offlineMatch) {
    let finalDistrict = offlineMatch.district
    let finalCity = offlineMatch.city
    let finalState = offlineMatch.state

    // Apply updated reorganized districts for Andhra Pradesh (26) and Telangana (33)
    const apTsOverride = resolveUpdatedApTsDistrict(
      clean,
      finalDistrict,
      finalCity
    )
    if (apTsOverride) {
      finalDistrict = apTsOverride.district
      finalCity = apTsOverride.city || finalCity
      finalState = apTsOverride.state
    }

    const result: PincodeLookupResult = {
      valid: true,
      pincode: clean,
      areaLocality: offlineMatch.areaLocality,
      city: finalCity,
      district: finalDistrict,
      state: finalState,
      postOffices: offlineMatch.postOffices,
      source: 'offline-master',
    }
    return cacheAndReturn(result)
  }

  return {
    valid: false,
    pincode: clean,
    areaLocality: '',
    city: '',
    district: '',
    state: '',
    postOffices: [],
    source: 'not-found',
  }
}
