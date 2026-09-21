import { describe, it, expect } from 'vitest'
import {
  resolveUpdatedApTsDistrict,
  ANDHRA_PRADESH_26_DISTRICTS,
  TELANGANA_33_DISTRICTS,
} from '../../src/shared/services/apTelanganaDistrictMaster'
import { lookupOfflinePincode } from '../../src/shared/services/offlinePincodeMaster'

describe('apTelanganaDistrictMaster', () => {
  it('contains the canonical 26 AP districts and 33 Telangana districts', () => {
    expect(ANDHRA_PRADESH_26_DISTRICTS.length).toBe(26)
    expect(TELANGANA_33_DISTRICTS.length).toBe(33)

    // Verify key new AP districts exist
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('NTR')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Tirupati')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Bapatla')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Palnadu')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Eluru')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Dr. B.R. Ambedkar Konaseema')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Alluri Sitharama Raju')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Anakapalli')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Annamayya')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Sri Sathya Sai')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Nandyal')
    expect(ANDHRA_PRADESH_26_DISTRICTS).toContain('Parvathipuram Manyam')

    // Verify key new TS districts exist
    expect(TELANGANA_33_DISTRICTS).toContain('Hanamkonda')
    expect(TELANGANA_33_DISTRICTS).toContain('Suryapet')
    expect(TELANGANA_33_DISTRICTS).toContain('Yadadri Bhuvanagiri')
    expect(TELANGANA_33_DISTRICTS).toContain('Medchal-Malkajgiri')
    expect(TELANGANA_33_DISTRICTS).toContain('Jagtial')
    expect(TELANGANA_33_DISTRICTS).toContain('Peddapalli')
    expect(TELANGANA_33_DISTRICTS).toContain('Rajanna Sircilla')
    expect(TELANGANA_33_DISTRICTS).toContain('Mancherial')
    expect(TELANGANA_33_DISTRICTS).toContain('Kumuram Bheem Asifabad')
    expect(TELANGANA_33_DISTRICTS).toContain('Bhadradri Kothagudem')
    expect(TELANGANA_33_DISTRICTS).toContain('Jogulamba Gadwal')
    expect(TELANGANA_33_DISTRICTS).toContain('Nagarkurnool')
  })

  describe('resolveUpdatedApTsDistrict - Andhra Pradesh Reorganized Districts', () => {
    it('correctly maps Vijayawada PINs to NTR district', () => {
      const result = resolveUpdatedApTsDistrict('520001', 'Krishna', 'Vijayawada')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('NTR')
      expect(result?.city).toBe('Vijayawada')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Tirupati PINs to Tirupati district instead of old Chittoor', () => {
      const result = resolveUpdatedApTsDistrict('517501', 'Chittoor', 'Tirupati')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('Tirupati')
      expect(result?.city).toBe('Tirupati')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Puttaparthi and Hindupur to Sri Sathya Sai district instead of old Anantapur', () => {
      const result = resolveUpdatedApTsDistrict('515134', 'Anantapur', 'Puttaparthi')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('Sri Sathya Sai')
      expect(result?.city).toBe('Puttaparthi')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Chirala and Bapatla to Bapatla district instead of old Guntur/Prakasam', () => {
      const result = resolveUpdatedApTsDistrict('522113', 'Prakasam', 'Chirala')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('Bapatla')
      expect(result?.city).toBe('Chirala')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Narasaraopet to Palnadu district instead of old Guntur', () => {
      const result = resolveUpdatedApTsDistrict('522601', 'Guntur', 'Narasaraopet')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('Palnadu')
      expect(result?.city).toBe('Narasaraopet')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Amalapuram to Dr. B.R. Ambedkar Konaseema instead of old East Godavari', () => {
      const result = resolveUpdatedApTsDistrict('533201', 'East Godavari', 'Amalapuram')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('Dr. B.R. Ambedkar Konaseema')
      expect(result?.city).toBe('Amalapuram')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Rajahmundry to East Godavari with HQ Rajamahendravaram', () => {
      const result = resolveUpdatedApTsDistrict('533101', 'East Godavari', 'Rajahmundry')
      expect(result).not.toBeNull()
      expect(result?.district).toBe('East Godavari')
      expect(result?.city).toBe('Rajamahendravaram')
      expect(result?.state).toBe('Andhra Pradesh')
    })

    it('correctly maps Bhimavaram to West Godavari and Eluru to Eluru district', () => {
      const bhimavaram = resolveUpdatedApTsDistrict('534201', 'West Godavari', 'Bhimavaram')
      expect(bhimavaram?.district).toBe('West Godavari')

      const eluru = resolveUpdatedApTsDistrict('534001', 'West Godavari', 'Eluru')
      expect(eluru?.district).toBe('Eluru')
    })

    it('correctly maps Paderu to Alluri Sitharama Raju and Anakapalli to Anakapalli', () => {
      const paderu = resolveUpdatedApTsDistrict('531024', 'Visakhapatnam', 'Paderu')
      expect(paderu?.district).toBe('Alluri Sitharama Raju')

      const anakapalli = resolveUpdatedApTsDistrict('531001', 'Visakhapatnam', 'Anakapalli')
      expect(anakapalli?.district).toBe('Anakapalli')
    })

    it('correctly maps Rayachoti to Annamayya and Nandyal to Nandyal district', () => {
      const rayachoti = resolveUpdatedApTsDistrict('516269', 'Cuddapah', 'Rayachoti')
      expect(rayachoti?.district).toBe('Annamayya')

      const nandyal = resolveUpdatedApTsDistrict('518501', 'Kurnool', 'Nandyal')
      expect(nandyal?.district).toBe('Nandyal')
    })
  })

  describe('resolveUpdatedApTsDistrict - Telangana Reorganized Districts', () => {
    it('correctly maps Kukatpally and Medchal to Medchal-Malkajgiri', () => {
      const kukatpally = resolveUpdatedApTsDistrict('500072', 'Ranga Reddy', 'Kukatpally')
      expect(kukatpally?.district).toBe('Medchal-Malkajgiri')
      expect(kukatpally?.city).toBe('Kukatpally')
      expect(kukatpally?.state).toBe('Telangana')
    })

    it('correctly maps Madhapur, Gachibowli, and Shamshabad to Ranga Reddy', () => {
      const madhapur = resolveUpdatedApTsDistrict('500081', 'Hyderabad', 'Madhapur')
      expect(madhapur?.district).toBe('Ranga Reddy')
      expect(madhapur?.city).toBe('Madhapur')
      expect(madhapur?.state).toBe('Telangana')
    })

    it('correctly maps Hanamkonda and Warangal separately', () => {
      const hanamkonda = resolveUpdatedApTsDistrict('506001', 'Warangal', 'Hanamkonda')
      expect(hanamkonda?.district).toBe('Hanamkonda')

      const warangal = resolveUpdatedApTsDistrict('506005', 'Warangal', 'Warangal')
      expect(warangal?.district).toBe('Warangal')
    })

    it('correctly maps Suryapet and Yadadri Bhuvanagiri instead of old Nalgonda', () => {
      const suryapet = resolveUpdatedApTsDistrict('508213', 'Nalgonda', 'Suryapet')
      expect(suryapet?.district).toBe('Suryapet')

      const bhongir = resolveUpdatedApTsDistrict('508115', 'Nalgonda', 'Bhuvanagiri')
      expect(bhongir?.district).toBe('Yadadri Bhuvanagiri')
    })

    it('correctly maps Jagtial, Peddapalli, and Rajanna Sircilla instead of old Karimnagar', () => {
      const jagtial = resolveUpdatedApTsDistrict('505327', 'Karimnagar', 'Jagtial')
      expect(jagtial?.district).toBe('Jagtial')

      const peddapalli = resolveUpdatedApTsDistrict('505172', 'Karimnagar', 'Peddapalli')
      expect(peddapalli?.district).toBe('Peddapalli')

      const sircilla = resolveUpdatedApTsDistrict('505301', 'Karimnagar', 'Sircilla')
      expect(sircilla?.district).toBe('Rajanna Sircilla')
    })

    it('correctly maps Mancherial, Nirmal, and Asifabad instead of old Adilabad', () => {
      const mancherial = resolveUpdatedApTsDistrict('504208', 'Adilabad', 'Mancherial')
      expect(mancherial?.district).toBe('Mancherial')

      const nirmal = resolveUpdatedApTsDistrict('504106', 'Adilabad', 'Nirmal')
      expect(nirmal?.district).toBe('Nirmal')

      const asifabad = resolveUpdatedApTsDistrict('504293', 'Adilabad', 'Asifabad')
      expect(asifabad?.district).toBe('Kumuram Bheem Asifabad')
    })

    it('correctly maps Kothagudem to Bhadradri Kothagudem instead of old Khammam', () => {
      const kothagudem = resolveUpdatedApTsDistrict('507101', 'Khammam', 'Kothagudem')
      expect(kothagudem?.district).toBe('Bhadradri Kothagudem')
    })

    it('correctly maps Gadwal, Nagarkurnool, and Wanaparthy instead of old Mahabubnagar', () => {
      const gadwal = resolveUpdatedApTsDistrict('509125', 'Mahabubnagar', 'Gadwal')
      expect(gadwal?.district).toBe('Jogulamba Gadwal')

      const nagarkurnool = resolveUpdatedApTsDistrict('509209', 'Mahabubnagar', 'Nagarkurnool')
      expect(nagarkurnool?.district).toBe('Nagarkurnool')

      const wanaparthy = resolveUpdatedApTsDistrict('509103', 'Mahabubnagar', 'Wanaparthy')
      expect(wanaparthy?.district).toBe('Wanaparthy')
    })
  })

  describe('lookupOfflinePincode integration with AP & TS districts', () => {
    it('returns exact updated districts from offline lookup', () => {
      const vijayawada = lookupOfflinePincode('520001')
      expect(vijayawada?.district).toBe('NTR')
      expect(vijayawada?.city).toBe('Vijayawada')

      const tirupati = lookupOfflinePincode('517501')
      expect(tirupati?.district).toBe('Tirupati')

      const suryapet = lookupOfflinePincode('508213')
      expect(suryapet?.district).toBe('Suryapet')

      const hanamkonda = lookupOfflinePincode('506001')
      expect(hanamkonda?.district).toBe('Hanamkonda')
    })
  })
})
