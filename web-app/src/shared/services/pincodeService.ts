import {
  CANONICAL_INDIAN_STATES_AND_UTS,
  lookupOfflinePincode,
  type CanonicalIndianState,
} from './offlinePincodeMaster'

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
    delhi: 'Delhi',
    nctdelhi: 'Delhi',
    nctofdelhi: 'Delhi',
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
    jammuandkashmir: 'Jammu and Kashmir',
    jammukashmir: 'Jammu and Kashmir',
    jk: 'Jammu and Kashmir',
    telengana: 'Telangana',
    telangana: 'Telangana',
    tamilnadu: 'Tamil Nadu',
    bengal: 'West Bengal',
    westbengal: 'West Bengal',
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

        // Extract post office names using Array.prototype.map
        const officeNames = offices.map((po) => po.Name).filter(Boolean)

        // Select the most representative office (Head Office or first non-empty)
        const headOffice = offices.find((po) => po.BranchType?.includes('Head') || po.Name?.includes('H.O')) || offices[0]

        const rawDistrict = headOffice.District || offices[0].District || ''
        const rawState = headOffice.State || offices[0].State || ''
        const normalizedState = normalizeIndianState(rawState)

        // City in Indian postal hierarchy is standardly the District (or Division if district is unavailable)
        const primaryCity = rawDistrict || headOffice.Division?.replace(/ Division$/i, '') || ''

        const areaLocality = officeNames.slice(0, 3).join(', ')

        const result: PincodeLookupResult = {
          valid: true,
          pincode: clean,
          areaLocality,
          city: primaryCity || rawDistrict,
          district: rawDistrict,
          state: normalizedState,
          postOffices: officeNames,
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
    const result: PincodeLookupResult = {
      valid: true,
      pincode: clean,
      areaLocality: offlineMatch.areaLocality,
      city: offlineMatch.city,
      district: offlineMatch.district,
      state: offlineMatch.state,
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
