import { normalizeIndianState } from './pincodeService'
import { resolveUpdatedApTsDistrict } from './apTelanganaDistrictMaster'

export interface ReverseGeocodeResult {
  success: boolean
  addressLine1: string
  addressLine2: string
  areaLocality: string
  city: string
  district: string
  state: string
  pincode: string
  source: 'gps' | 'ip'
  error?: string
}

export interface NominatimAddress {
  house_number?: string
  house_name?: string
  building?: string
  flats?: string
  office?: string
  amenity?: string
  shop?: string
  place?: string
  road?: string
  pedestrian?: string
  street?: string
  footway?: string
  path?: string
  suburb?: string
  neighbourhood?: string
  residential?: string
  commercial?: string
  industrial?: string
  quarter?: string
  subdistrict?: string
  village?: string
  hamlet?: string
  isolated_dwelling?: string
  town?: string
  city?: string
  city_district?: string
  county?: string
  state_district?: string
  state?: string
  postcode?: string
  country?: string
}

export interface NominatimResponse {
  display_name?: string
  address?: NominatimAddress
}

interface BigDataCloudAdmin {
  name: string
  description?: string
  order?: number
}

interface BigDataCloudResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
  postcode?: string
  localityInfo?: {
    administrative?: BigDataCloudAdmin[]
    informative?: BigDataCloudAdmin[]
  }
}

interface IpLocationResponse {
  city?: string
  region?: string
  region_code?: string
  postal?: string
  latitude?: number
  longitude?: number
  error?: boolean
  reason?: string
}

/**
 * Strips administrative noise such as "Ward 104 Kondapur" -> "Kondapur",
 * ignores municipal corporation bodies, and removes trailing "Mandal"/"Taluk".
 */
export const cleanAdministrativeNoise = (name?: string): string => {
  if (!name) return ''
  const trimmed = name.trim()
  if (!trimmed) return ''

  // Ignore government / municipal corporation administrative zones
  if (
    /municipal\s+corporation/i.test(trimmed) ||
    /mahanagara\s+palike/i.test(trimmed) ||
    /development\s+authority/i.test(trimmed) ||
    /\bzone\b/i.test(trimmed)
  ) {
    return ''
  }

  // Extract name if prefixed by "Ward \d+" e.g. "Ward 104 Kondapur" -> "Kondapur"
  const wardCleaned = trimmed.replace(/^ward\s+\d+[\s\-_]*/i, '')
  if (wardCleaned) {
    return wardCleaned
      .replace(/\s+(mandal|taluk|taluka|tehsil)$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  return trimmed
}

/**
 * Accurately extracts fine-grained and descriptive area / locality.
 * Prioritizes:
 * 1. Combination of fine-grained place (quarter, sector, phase, neighbourhood, hamlet)
 *    with parent suburb or village (e.g. "Phase 3, KPHB Colony", "Sector 4, HSR Layout", "Gummalavai, Wattimarthy").
 * 2. Single specific village, suburb, or neighbourhood.
 * 3. Fallback to mandal/taluk or display_name tokens.
 * Discards any candidate that merely duplicates the city or district name.
 */
export const extractAccurateAreaLocality = (
  address: NominatimAddress,
  city: string,
  district: string,
  state: string,
  displayName?: string
): string => {
  const cityLower = city.trim().toLowerCase()
  const distLower = district.trim().toLowerCase()
  const stateLower = state.trim().toLowerCase()

  const isRedundant = (val: string): boolean => {
    if (!val) return true
    const l = val.toLowerCase()
    return (
      l === cityLower ||
      l === distLower ||
      l === stateLower ||
      l === 'india' ||
      l.includes('district')
    )
  }

  // 1. Fine-grained localities (micro-areas, sectors, phases, colonies, hamlets)
  const hamlet = cleanAdministrativeNoise(address.hamlet || address.isolated_dwelling)
  const quarterOrSector = cleanAdministrativeNoise(address.quarter)
  const neighbourhood = cleanAdministrativeNoise(
    address.neighbourhood || address.residential || address.commercial || address.industrial
  )
  const fineCandidate = [hamlet, quarterOrSector, neighbourhood].find((c) => c && !isRedundant(c)) || ''

  // 2. Broader localities (suburb, village)
  const village = cleanAdministrativeNoise(address.village)
  const suburb = cleanAdministrativeNoise(address.suburb)
  const broadCandidate = [village, suburb].find((c) => c && !isRedundant(c)) || ''

  // 3. If both fine-grained and broader exist, intelligently combine them
  if (fineCandidate && broadCandidate) {
    const fineL = fineCandidate.toLowerCase()
    const broadL = broadCandidate.toLowerCase()

    if (fineL.includes(broadL)) return fineCandidate
    if (broadL.includes(fineL)) return broadCandidate

    // For rural areas: combine hamlet + village (e.g. Gummalavai, Wattimarthy)
    if (hamlet && village && hamlet.toLowerCase() !== village.toLowerCase()) {
      return `${hamlet}, ${village}`
    }

    // If fineCandidate is a specific colony, society, layout, nagar, or enclave
    // (e.g. "Ayyappa Society Colony", "Ayyappa Society", "Silicon Valley", "Mithila Nagar"),
    // prioritize the exact colony/society over broad corporate zones or suburbs like "HITEC City"
    const isNamedColonyOrSociety =
      /colony|society|layout|nagar|enclave|vihar|hills|town|puram|pally|guda|bagh|bazaar/i.test(
        fineCandidate
      )
    if (isNamedColonyOrSociety) {
      return fineCandidate
    }

    return `${fineCandidate}, ${broadCandidate}`
  }

  // 4. If only one exists, return it
  if (fineCandidate) return fineCandidate
  if (broadCandidate) return broadCandidate

  // 5. Fallback to subdistrict / county (e.g. "Thullur", "Chityal")
  const subdistrict = cleanAdministrativeNoise(address.subdistrict || address.county || address.city_district)
  if (subdistrict && !isRedundant(subdistrict)) {
    return subdistrict
  }

  // 6. High-precision fallback: parse tokens from display_name
  if (displayName) {
    const tokens = displayName
      .split(',')
      .map((t) => cleanAdministrativeNoise(t.trim()))
      .filter((t) => t && !isRedundant(t) && !/\d{6}/.test(t))

    if (tokens.length >= 3) {
      return tokens[2]
    }
    if (tokens.length > 0) {
      return tokens[0]
    }
  }

  return ''
}

/**
 * Functional parser for reverse geocoding response.
 * Rule 2: Pure functions, no loops.
 * Accurately extracts Address Line 1 (building/road), Address Line 2 (landmark/sector),
 * Village/Locality into Area, City/District, and PIN Code.
 */
export const parseNominatimAddress = (
  address: NominatimAddress,
  source: 'gps' | 'ip',
  displayName?: string
): ReverseGeocodeResult => {
  // 1. Identify building or premise (flat, building, office, house name, junction)
  const premise =
    address.house_name ||
    address.building ||
    address.flats ||
    address.office ||
    address.junction ||
    ''

  // 2. Identify street, road, or pathway
  const road =
    address.road ||
    address.pedestrian ||
    address.street ||
    address.footway ||
    address.path ||
    ''

  const houseNumber = address.house_number || ''

  // Build Address Line 1: [House No, Premise/Building, Road]
  const premiseWithNumber = [houseNumber, premise].filter(Boolean).join(', ')
  let line1 = [premiseWithNumber || houseNumber, road].filter(Boolean).join(', ')

  // If Line 1 is still empty (common in rural OSM), use amenity, shop, place, or display name prefix
  if (!line1) {
    const fallbackPremise =
      address.amenity ||
      address.shop ||
      address.place ||
      address.residential ||
      address.commercial ||
      address.quarter ||
      ''
    line1 = fallbackPremise

    // If still blank, extract first non-state segment from display_name
    if (!line1 && displayName) {
      const parts = displayName.split(',').map((p) => p.trim()).filter(Boolean)
      if (parts.length > 0) {
        line1 = parts.slice(0, 2).join(', ')
      }
    }
  }

  // 3. City resolution: town, municipality, city, or taluk/tehsil
  const village = address.village || address.hamlet || ''
  const city =
    address.city ||
    address.town ||
    address.city_district ||
    address.county ||
    address.state_district ||
    village ||
    ''

  // 4. District resolution
  const district =
    address.state_district ||
    address.county ||
    address.city_district ||
    city

  const rawState = address.state || ''
  const state = normalizeIndianState(rawState)
  let rawPincode = (address.postcode || '').replace(/\D/g, '').slice(0, 6)

  // Fix common OpenStreetMap typographical errors where Hyderabad 500xxx was entered as 800xxx
  if (
    rawPincode.startsWith('800') &&
    (state === 'Telangana' || /hyderabad|cyberabad|ranga reddy/i.test(city + ' ' + district))
  ) {
    rawPincode = '500' + rawPincode.slice(3)
  }

  let finalDistrict = district
  let finalCity = city
  let finalState = state

  // Apply updated reorganized districts for Andhra Pradesh (26) and Telangana (33)
  const apTsResolved = resolveUpdatedApTsDistrict(
    rawPincode,
    district,
    city || address.town || village,
    address.subdistrict || ''
  )
  if (apTsResolved) {
    finalDistrict = apTsResolved.district
    finalCity = city || apTsResolved.city || finalCity
    finalState = apTsResolved.state
  }

  // 5. Accurate Area / Locality Extraction
  const areaLocality = extractAccurateAreaLocality(
    address,
    finalCity,
    finalDistrict,
    finalState,
    displayName
  )

  // 6. Build Address Line 2: Landmark, Colony, Sector, or Block reference
  const landmark = address.amenity || address.shop || address.place || ''
  const subLocality = address.residential || address.commercial || address.industrial || ''
  const sectorOrColony = address.suburb || address.neighbourhood || address.quarter || ''

  const line2Candidates: string[] = []
  if (landmark && !line1.includes(landmark)) {
    line2Candidates.push(`Near ${landmark}`)
  }
  if (subLocality && !line1.includes(subLocality) && !areaLocality.includes(subLocality)) {
    line2Candidates.push(subLocality)
  }
  if (sectorOrColony && !line1.includes(sectorOrColony) && !areaLocality.includes(sectorOrColony)) {
    line2Candidates.push(sectorOrColony)
  }
  if (village && !line1.includes(village) && address.subdistrict) {
    line2Candidates.push(`${address.subdistrict} Block`)
  }

  const line2 = line2Candidates.slice(0, 2).join(', ')

  return {
    success: true,
    addressLine1: line1,
    addressLine2: line2,
    areaLocality,
    city: finalCity,
    district: finalDistrict,
    state: finalState,
    pincode: rawPincode,
    source,
  }
}

/**
 * Secondary reverse geocode fallback using BigDataCloud free client reverse geocoding API.
 * High uptime, fast, and extracts detailed administrative localities.
 */
export const fetchBigDataCloudFallback = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data: BigDataCloudResponse = await res.json()
      const state = normalizeIndianState(data.principalSubdivision || '')
      const rawPincode = (data.postcode || '').replace(/\D/g, '').slice(0, 6)

      const city = data.city || data.locality || ''
      
      // Extract high-resolution administrative locality from localityInfo
      const adminList = data.localityInfo?.administrative || []
      const candidateAdmins = adminList.filter((item) => {
        const l = item.name.toLowerCase()
        return (
          l !== 'india' &&
          !l.includes('corporation') &&
          !l.includes('zone') &&
          !l.includes('metropolitan') &&
          item.name !== state &&
          item.name !== data.principalSubdivision &&
          item.name !== (data.city || '')
        )
      })

      const mostSpecificAdmin = candidateAdmins.length > 0 ? candidateAdmins[candidateAdmins.length - 1].name : ''
      const cleanedAdmin = cleanAdministrativeNoise(mostSpecificAdmin)
      const rawLocality = cleanAdministrativeNoise(data.locality || '')

      let area = cleanedAdmin || rawLocality
      if (cleanedAdmin && rawLocality && cleanedAdmin.toLowerCase() !== rawLocality.toLowerCase()) {
        area = `${cleanedAdmin}, ${rawLocality}`
      }

      let finalDistrict = city || area
      let finalCity = city || area
      let finalState = state

      const apTsResolved = resolveUpdatedApTsDistrict(rawPincode, finalDistrict, finalCity)
      if (apTsResolved) {
        finalDistrict = apTsResolved.district
        finalCity = apTsResolved.city || finalCity
        finalState = apTsResolved.state
      }

      if (finalCity || finalState) {
        return {
          success: true,
          addressLine1: area ? `${area}` : '',
          addressLine2: finalCity && finalCity !== area ? `Near ${finalCity}` : '',
          areaLocality: area,
          city: finalCity,
          district: finalDistrict,
          state: finalState,
          pincode: rawPincode,
          source: 'gps',
        }
      }
    }
  } catch {
    // Non-critical fallback failure
  }
  return null
}

/**
 * IP-based location fallback if GPS is denied or unavailable.
 * Rule 2: Pure functions, no loops.
 */
export const fetchIpLocationFallback = async (): Promise<ReverseGeocodeResult> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data: IpLocationResponse = await response.json()
      if (!data.error && (data.city || data.region)) {
        const state = normalizeIndianState(data.region || '')
        const cleanPincode = (data.postal || '').replace(/\D/g, '').slice(0, 6)

        return {
          success: true,
          addressLine1: '',
          addressLine2: '',
          areaLocality: '',
          city: data.city || '',
          district: data.city || '',
          state,
          pincode: cleanPincode,
          source: 'ip',
        }
      }
    }
  } catch {
    // Network or parse failure on IP fallback
  }

  return {
    success: false,
    addressLine1: '',
    addressLine2: '',
    areaLocality: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    source: 'ip',
    error: 'Unable to detect approximate location. Please enter address manually.',
  }
}

/**
 * Reverse geocode latitude and longitude using Nominatim with BigDataCloud fallback.
 */
export const reverseGeocodeCoordinates = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en-IN,en',
      },
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data: NominatimResponse = await res.json()
      if (data.address) {
        return parseNominatimAddress(data.address, 'gps', data.display_name)
      }
    }
  } catch {
    // Fall back to secondary geocoder or IP
  }

  // Try secondary high-reliability client reverse geocode
  const secondaryResult = await fetchBigDataCloudFallback(latitude, longitude)
  if (secondaryResult && secondaryResult.success) {
    return secondaryResult
  }

  // Graceful fallback to IP location if reverse geocoding API was unreachable
  return fetchIpLocationFallback()
}

/**
 * High-level service method to retrieve current location on Web.
 * Uses navigator.geolocation if allowed, else falls back to IP-based location.
 * Rule 2: Pure functions, no loops.
 */
export const detectCurrentLocation = async (): Promise<ReverseGeocodeResult> => {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return fetchIpLocationFallback()
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const result = await reverseGeocodeCoordinates(latitude, longitude)
        resolve(result)
      },
      async (error) => {
        // Permission denied (1), Position unavailable (2), Timeout (3)
        // Gracefully attempt IP-based fallback
        const ipResult = await fetchIpLocationFallback()
        if (ipResult.success) {
          resolve(ipResult)
        } else {
          const userMessage =
            error.code === 1
              ? 'Location permission was denied. You can enter your address manually or enable location in your browser.'
              : 'Could not acquire precise GPS signal. Please enter your address manually.'

          resolve({
            success: false,
            addressLine1: '',
            addressLine2: '',
            areaLocality: '',
            city: '',
            district: '',
            state: '',
            pincode: '',
            source: 'gps',
            error: userMessage,
          })
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    )
  })
}
