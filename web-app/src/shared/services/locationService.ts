import { normalizeIndianState } from './pincodeService'

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

interface NominatimAddress {
  house_number?: string
  building?: string
  road?: string
  suburb?: string
  neighbourhood?: string
  residential?: string
  commercial?: string
  city?: string
  town?: string
  village?: string
  city_district?: string
  county?: string
  state_district?: string
  state?: string
  postcode?: string
  country?: string
}

interface NominatimResponse {
  display_name?: string
  address?: NominatimAddress
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
 * Functional parser for reverse geocoding response.
 * Rule 2: Pure functions, no loops.
 */
const parseNominatimAddress = (
  address: NominatimAddress,
  source: 'gps' | 'ip'
): ReverseGeocodeResult => {
  const line1Parts = [
    address.house_number,
    address.building,
    address.road,
  ].filter(Boolean)

  const line1 = line1Parts.join(', ')

  const line2Parts = [
    address.residential,
    address.commercial,
    address.neighbourhood,
  ].filter(Boolean)

  const line2 = line2Parts.join(', ')

  const areaLocality = address.suburb || address.neighbourhood || ''

  const city =
    address.city ||
    address.town ||
    address.village ||
    address.city_district ||
    ''

  const district =
    address.state_district ||
    address.county ||
    address.city_district ||
    city

  const rawState = address.state || ''
  const state = normalizeIndianState(rawState)

  const rawPincode = (address.postcode || '').replace(/\D/g, '').slice(0, 6)

  return {
    success: true,
    addressLine1: line1,
    addressLine2: line2,
    areaLocality,
    city,
    district,
    state,
    pincode: rawPincode,
    source,
  }
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
 * Reverse geocode latitude and longitude using Nominatim or OpenStreetMap.
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
        return parseNominatimAddress(data.address, 'gps')
      }
    }
  } catch {
    // Fall back to IP or error
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
        timeout: 8000,
        maximumAge: 60000,
      }
    )
  })
}
