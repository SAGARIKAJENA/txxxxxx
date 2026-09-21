import { describe, it, expect } from 'vitest'
import {
  parseNominatimAddress,
  type NominatimAddress,
} from '../../src/shared/services/locationService'

describe('locationService - parseNominatimAddress', () => {
  it('correctly extracts village into areaLocality and constructs accurate address lines for rural locations', () => {
    const ruralAddress: NominatimAddress = {
      village: 'Chityala',
      county: 'Nalgonda District',
      state: 'Telangana',
      road: 'Main Gram Panchayat Road',
      amenity: 'Primary Health Centre',
      subdistrict: 'Chityal Mandal',
      postcode: '508114',
      country: 'India',
    }

    const result = parseNominatimAddress(ruralAddress, 'gps')

    expect(result.success).toBe(true)
    // Village must be populated in areaLocality
    expect(result.areaLocality).toBe('Chityala')
    // Address Line 1 has the road
    expect(result.addressLine1).toBe('Main Gram Panchayat Road')
    // Address Line 2 has landmark / subdistrict block
    expect(result.addressLine2).toContain('Near Primary Health Centre')
    expect(result.state).toBe('Telangana')
    expect(result.pincode).toBe('508114')
    expect(result.city).toBe('Nalgonda District')
  })

  it('correctly parses urban address with house number, building, road, and landmark into Address Line 1 and Line 2', () => {
    const urbanAddress: NominatimAddress = {
      house_number: 'Flat 402',
      building: 'Orchid Towers',
      road: 'Baner Road',
      amenity: 'Jupiter Hospital',
      suburb: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
      postcode: '411045',
      country: 'India',
    }

    const result = parseNominatimAddress(urbanAddress, 'gps')

    expect(result.success).toBe(true)
    // Address Line 1 has house number, building, and road
    expect(result.addressLine1).toBe('Flat 402, Orchid Towers, Baner Road')
    // Address Line 2 has the landmark
    expect(result.addressLine2).toBe('Near Jupiter Hospital')
    expect(result.areaLocality).toBe('Baner')
    expect(result.city).toBe('Pune')
    expect(result.state).toBe('Maharashtra')
    expect(result.pincode).toBe('411045')
  })

  it('extracts hamlet and isolated dwelling in remote areas into areaLocality', () => {
    const remoteAddress: NominatimAddress = {
      hamlet: 'Shey Gompa Hamlet',
      town: 'Leh',
      state: 'Ladakh',
      postcode: '194101',
    }

    const result = parseNominatimAddress(remoteAddress, 'gps')

    expect(result.success).toBe(true)
    expect(result.areaLocality).toBe('Shey Gompa Hamlet')
    expect(result.state).toBe('Ladakh')
    expect(result.city).toBe('Leh')
    expect(result.pincode).toBe('194101')
  })

  it('uses display_name fallback for Address Line 1 when road/house is unavailable', () => {
    const sparseAddress: NominatimAddress = {
      village: 'Rampur',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      postcode: '221001',
    }

    const displayName = 'Plot 12 Ganga View, Rampur, Varanasi, Uttar Pradesh, 221001, India'
    const result = parseNominatimAddress(sparseAddress, 'gps', displayName)

    expect(result.success).toBe(true)
    expect(result.areaLocality).toBe('Rampur')
    expect(result.addressLine1).toBe('Plot 12 Ganga View, Rampur')
    expect(result.city).toBe('Varanasi')
    expect(result.state).toBe('Uttar Pradesh')
  })

  it('accurately combines fine-grained sector/phase/neighbourhood with parent suburb into areaLocality', () => {
    // Bangalore: Sector 4 + HSR Layout
    const bangaloreAddress: NominatimAddress = {
      house_number: '251A',
      road: '19th Main Road',
      quarter: 'Sector 4',
      suburb: 'HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      postcode: '560102',
    }
    const bResult = parseNominatimAddress(bangaloreAddress, 'gps')
    expect(bResult.areaLocality).toBe('Sector 4, HSR Layout')

    // Hyderabad: Phase 3 + KPHB Colony
    const hydAddress: NominatimAddress = {
      neighbourhood: 'Phase 3',
      suburb: 'KPHB Colony',
      city: 'Hyderabad',
      state: 'Telangana',
      postcode: '500072',
    }
    const hResult = parseNominatimAddress(hydAddress, 'gps')
    expect(hResult.areaLocality).toBe('Phase 3, KPHB Colony')
  })

  it('accurately combines hamlet and village for rural precision', () => {
    const ruralHamletAddress: NominatimAddress = {
      hamlet: 'Gummalavai',
      village: 'Wattimarthy',
      county: 'Chityal mandal',
      city: 'Chityala',
      state: 'Telangana',
      postcode: '508254',
    }
    const result = parseNominatimAddress(ruralHamletAddress, 'gps')
    expect(result.areaLocality).toBe('Gummalavai, Wattimarthy')
  })

  it('cleans administrative ward noise and ignores municipal corporation zones', () => {
    const wardAddress: NominatimAddress = {
      road: 'HITEC City Road',
      quarter: 'Ward 104 Kondapur',
      city_district: 'Greater Hyderabad Municipal Corporation West Zone',
      city: 'Hyderabad',
      state: 'Telangana',
      postcode: '500081',
    }
    const result = parseNominatimAddress(wardAddress, 'gps')
    expect(result.areaLocality).toBe('Kondapur')
  })

  it('prioritizes exact residential society/colony (Ayyappa Society Colony) over broad tech park (HITEC City) and corrects OSM postcode typo', () => {
    const kclinkAddress: NominatimAddress = {
      office: 'Kclink Technologies Pvt.Ltd',
      road: 'Ayyappa Society Main Road',
      neighbourhood: 'Ayyappa Society Colony',
      suburb: 'HITEC City',
      city_district: 'Greater Hyderabad Municipal Corporation West Zone',
      city: 'Hyderabad',
      county: 'Serilingampalle mandal',
      state_district: 'Ranga Reddy',
      state: 'Telangana',
      postcode: '800081', // OSM typo for 500081
    }
    const result = parseNominatimAddress(kclinkAddress, 'gps')
    expect(result.success).toBe(true)
    expect(result.areaLocality).toBe('Ayyappa Society Colony')
    expect(result.pincode).toBe('500081')
    expect(result.addressLine1).toBe('Kclink Technologies Pvt.Ltd, Ayyappa Society Main Road')
    expect(result.city).toBe('Hyderabad')
    expect(result.district).toBe('Ranga Reddy')
    expect(result.state).toBe('Telangana')
  })
})
