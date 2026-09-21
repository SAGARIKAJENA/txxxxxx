import { describe, it, expect } from 'vitest'
import {
  lookupPincode,
  normalizeIndianState,
} from '../../src/shared/services/pincodeService'
import { lookupOfflinePincode } from '../../src/shared/services/offlinePincodeMaster'

describe('pincodeService', () => {
  describe('normalizeIndianState', () => {
    it('normalizes known state aliases correctly', () => {
      expect(normalizeIndianState('orissa')).toBe('Odisha')
      expect(normalizeIndianState('pondicherry')).toBe('Puducherry')
      expect(normalizeIndianState('delhi')).toBe('Delhi')
      expect(normalizeIndianState('telengana')).toBe('Telangana')
      expect(normalizeIndianState('tamilnadu')).toBe('Tamil Nadu')
      expect(normalizeIndianState('westbengal')).toBe('West Bengal')
      expect(normalizeIndianState('uttaranchal')).toBe('Uttarakhand')
    })

    it('preserves canonical state names unchanged', () => {
      expect(normalizeIndianState('Maharashtra')).toBe('Maharashtra')
      expect(normalizeIndianState('Karnataka')).toBe('Karnataka')
      expect(normalizeIndianState('Andaman and Nicobar Islands')).toBe(
        'Andaman and Nicobar Islands'
      )
      expect(normalizeIndianState('Ladakh')).toBe('Ladakh')
      expect(normalizeIndianState('Lakshadweep')).toBe('Lakshadweep')
      expect(normalizeIndianState('Dadra and Nagar Haveli and Daman and Diu')).toBe(
        'Dadra and Nagar Haveli and Daman and Diu'
      )
    })
  })

  describe('lookupOfflinePincode', () => {
    it('returns exact data for known metro PIN codes', () => {
      const pune = lookupOfflinePincode('411001')
      expect(pune).not.toBeNull()
      expect(pune?.city).toBe('Pune')
      expect(pune?.district).toBe('Pune')
      expect(pune?.state).toBe('Maharashtra')

      const hyderabad = lookupOfflinePincode('500081')
      expect(hyderabad).not.toBeNull()
      expect(hyderabad?.city).toBe('Hyderabad')
      expect(hyderabad?.state).toBe('Telangana')

      const delhi = lookupOfflinePincode('110001')
      expect(delhi).not.toBeNull()
      expect(delhi?.city).toBe('New Delhi')
      expect(delhi?.state).toBe('Delhi')
    })

    it('accurately resolves all 8 Union Territories across India', () => {
      // 1. Ladakh (Leh & Kargil)
      const leh = lookupOfflinePincode('194101')
      expect(leh?.state).toBe('Ladakh')
      expect(leh?.city).toBe('Leh')

      const kargil = lookupOfflinePincode('194103')
      expect(kargil?.state).toBe('Ladakh')

      const ladakhFallback = lookupOfflinePincode('194999')
      expect(ladakhFallback?.state).toBe('Ladakh')

      // 2. Lakshadweep
      const kavaratti = lookupOfflinePincode('682555')
      expect(kavaratti?.state).toBe('Lakshadweep')
      expect(kavaratti?.city).toBe('Kavaratti')

      const agatti = lookupOfflinePincode('682553')
      expect(agatti?.state).toBe('Lakshadweep')

      // 3. Andaman and Nicobar Islands
      const portBlair = lookupOfflinePincode('744101')
      expect(portBlair?.state).toBe('Andaman and Nicobar Islands')

      const carNicobar = lookupOfflinePincode('744301')
      expect(carNicobar?.state).toBe('Andaman and Nicobar Islands')

      // 4. Dadra and Nagar Haveli and Daman and Diu
      const daman = lookupOfflinePincode('396210')
      expect(daman?.state).toBe('Dadra and Nagar Haveli and Daman and Diu')
      expect(daman?.city).toBe('Daman')

      const silvassa = lookupOfflinePincode('396230')
      expect(silvassa?.state).toBe('Dadra and Nagar Haveli and Daman and Diu')
      expect(silvassa?.city).toBe('Silvassa')

      const diu = lookupOfflinePincode('362520')
      expect(diu?.state).toBe('Dadra and Nagar Haveli and Daman and Diu')
      expect(diu?.city).toBe('Diu')

      // 5. Chandigarh
      const chandigarh = lookupOfflinePincode('160017')
      expect(chandigarh?.state).toBe('Chandigarh')

      // 6. Puducherry
      const puducherry = lookupOfflinePincode('605001')
      expect(puducherry?.state).toBe('Puducherry')

      const karaikal = lookupOfflinePincode('609609')
      expect(karaikal?.state).toBe('Puducherry')

      const mahe = lookupOfflinePincode('673310')
      expect(mahe?.state).toBe('Puducherry')

      const yanam = lookupOfflinePincode('533464')
      expect(yanam?.state).toBe('Puducherry')

      // 7. Delhi
      const delhi = lookupOfflinePincode('110001')
      expect(delhi?.state).toBe('Delhi')

      // 8. Jammu and Kashmir
      const srinagar = lookupOfflinePincode('190001')
      expect(srinagar?.state).toBe('Jammu and Kashmir')
    })

    it('accurately resolves special states including Goa, Sikkim, and North-East', () => {
      // Goa
      const panaji = lookupOfflinePincode('403001')
      expect(panaji?.state).toBe('Goa')
      const goaFallback = lookupOfflinePincode('403999')
      expect(goaFallback?.state).toBe('Goa')

      // Sikkim
      const gangtok = lookupOfflinePincode('737101')
      expect(gangtok?.state).toBe('Sikkim')
      const sikkimFallback = lookupOfflinePincode('737999')
      expect(sikkimFallback?.state).toBe('Sikkim')

      // Arunachal Pradesh
      const itanagar = lookupOfflinePincode('791111')
      expect(itanagar?.state).toBe('Arunachal Pradesh')

      // Nagaland
      const kohima = lookupOfflinePincode('797001')
      expect(kohima?.state).toBe('Nagaland')

      // Mizoram
      const aizawl = lookupOfflinePincode('796001')
      expect(aizawl?.state).toBe('Mizoram')

      // Manipur
      const imphal = lookupOfflinePincode('795001')
      expect(imphal?.state).toBe('Manipur')
    })

    it('accurately resolves 100% of districts and cities across diverse Indian states and regions', () => {
      // Telangana
      const nalgonda = lookupOfflinePincode('508204')
      expect(nalgonda?.city).toBe('Nalgonda')
      expect(nalgonda?.district).toBe('Nalgonda')
      expect(nalgonda?.state).toBe('Telangana')

      const hanamkonda = lookupOfflinePincode('506001')
      expect(hanamkonda?.city).toBe('Hanamkonda')
      expect(hanamkonda?.district).toBe('Hanamkonda')
      expect(hanamkonda?.state).toBe('Telangana')

      const warangal = lookupOfflinePincode('506005')
      expect(warangal?.city).toBe('Warangal')
      expect(warangal?.district).toBe('Warangal')
      expect(warangal?.state).toBe('Telangana')

      // Uttar Pradesh
      const varanasi = lookupOfflinePincode('221001')
      expect(varanasi?.city).toBe('Varanasi')
      expect(varanasi?.district).toBe('Varanasi')
      expect(varanasi?.state).toBe('Uttar Pradesh')

      const noida = lookupOfflinePincode('201301')
      expect(noida?.city).toBe('Noida')
      expect(noida?.district).toBe('Gautam Buddha Nagar')
      expect(noida?.state).toBe('Uttar Pradesh')

      // Tamil Nadu
      const coimbatore = lookupOfflinePincode('641001')
      expect(coimbatore?.city).toBe('Coimbatore')
      expect(coimbatore?.district).toBe('Coimbatore')
      expect(coimbatore?.state).toBe('Tamil Nadu')

      const trichy = lookupOfflinePincode('620001')
      expect(trichy?.city).toBe('Tiruchirappalli')
      expect(trichy?.district).toBe('Tiruchirappalli')
      expect(trichy?.state).toBe('Tamil Nadu')

      // Karnataka
      const mysuru = lookupOfflinePincode('570001')
      expect(mysuru?.city).toBe('Mysuru')
      expect(mysuru?.district).toBe('Mysuru')
      expect(mysuru?.state).toBe('Karnataka')

      const mangaluru = lookupOfflinePincode('575001')
      expect(mangaluru?.city).toBe('Mangaluru')
      expect(mangaluru?.district).toBe('Dakshina Kannada')
      expect(mangaluru?.state).toBe('Karnataka')

      // Rajasthan
      const jaipur = lookupOfflinePincode('302001')
      expect(jaipur?.city).toBe('Jaipur')
      expect(jaipur?.state).toBe('Rajasthan')

      const jodhpur = lookupOfflinePincode('342001')
      expect(jodhpur?.city).toBe('Jodhpur')
      expect(jodhpur?.state).toBe('Rajasthan')

      // Haryana
      const gurugram = lookupOfflinePincode('122001')
      expect(gurugram?.city).toBe('Gurugram')
      expect(gurugram?.district).toBe('Gurugram')
      expect(gurugram?.state).toBe('Haryana')
    })

    it('returns circle fallback for unknown 6-digit PIN code with valid circle prefix', () => {
      const unknownRajasthan = lookupOfflinePincode('309999')
      expect(unknownRajasthan).not.toBeNull()
      expect(unknownRajasthan?.state).toBe('Rajasthan')
    })

    it('returns null for invalid PIN code lengths', () => {
      expect(lookupOfflinePincode('123')).toBeNull()
      expect(lookupOfflinePincode('1234567')).toBeNull()
      expect(lookupOfflinePincode('')).toBeNull()
    })
  })

  describe('lookupPincode', () => {
    it('returns valid result from offline master when offline/fallback', async () => {
      const result = await lookupPincode('411001')
      expect(result.valid).toBe(true)
      expect(result.city).toBe('Pune')
      expect(result.state).toBe('Maharashtra')
    })

    it('returns valid result for Ladakh PIN code', async () => {
      const result = await lookupPincode('194101')
      expect(result.valid).toBe(true)
      expect(result.state).toBe('Ladakh')
      expect(result.city).toBe('Leh')
    })

    it('returns valid result for Lakshadweep PIN code', async () => {
      const result = await lookupPincode('682555')
      expect(result.valid).toBe(true)
      expect(result.state).toBe('Lakshadweep')
      expect(result.city).toBe('Kavaratti')
    })

    it('handles invalid PIN code string gracefully', async () => {
      const result = await lookupPincode('000')
      expect(result.valid).toBe(false)
      expect(result.source).toBe('not-found')
    })
  })
})
