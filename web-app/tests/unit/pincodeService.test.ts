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

      const portBlair = lookupOfflinePincode('744101')
      expect(portBlair).not.toBeNull()
      expect(portBlair?.city).toBe('Port Blair')
      expect(portBlair?.state).toBe('Andaman and Nicobar Islands')
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

    it('handles invalid PIN code string gracefully', async () => {
      const result = await lookupPincode('000')
      expect(result.valid).toBe(false)
      expect(result.source).toBe('not-found')
    })
  })
})
