import { describe, it, expect } from 'vitest'
import {
  getLocalitiesForCity,
  normalizeCityKey,
  CITY_LOCALITIES_MAP,
} from '../../src/shared/services/cityLocalitiesMaster'

describe('cityLocalitiesMaster', () => {
  describe('normalizeCityKey', () => {
    it('normalizes city names by removing non-alpha characters and common suffixes', () => {
      expect(normalizeCityKey('Pune City')).toBe('pune')
      expect(normalizeCityKey('Bengaluru Urban')).toBe('bengaluru')
      expect(normalizeCityKey('New Delhi')).toBe('newdelhi')
    })
  })

  describe('getLocalitiesForCity', () => {
    it('returns all pre-mapped areas covering Pune', () => {
      const puneAreas = getLocalitiesForCity('Pune')
      expect(puneAreas.length).toBeGreaterThan(15)
      expect(puneAreas).toContain('Shivajinagar')
      expect(puneAreas).toContain('Hinjawadi')
      expect(puneAreas).toContain('Kothrud')
      expect(puneAreas).toContain('Viman Nagar')
    })

    it('returns all areas covering Mumbai', () => {
      const mumbaiAreas = getLocalitiesForCity('Mumbai')
      expect(mumbaiAreas).toContain('Bandra Kurla Complex (BKC)')
      expect(mumbaiAreas).toContain('Andheri East')
      expect(mumbaiAreas).toContain('Nariman Point')
    })

    it('returns all areas covering Hyderabad', () => {
      const hydAreas = getLocalitiesForCity('Hyderabad')
      expect(hydAreas).toContain('Madhapur')
      expect(hydAreas).toContain('Gachibowli')
      expect(hydAreas).toContain('Hitec City')
    })

    it('merges live postal branch offices dynamically and removes duplicate offices', () => {
      const merged = getLocalitiesForCity('Pune', [
        'Shivajinagar S.O',
        'Kalyani Nagar B.O',
        'Custom Special Branch H.O',
      ])

      expect(merged).toContain('Shivajinagar')
      expect(merged).toContain('Kalyani Nagar')
      expect(merged).toContain('Custom Special Branch')
      expect(merged).toContain('Baner')
    })

    it('handles unknown cities gracefully with postal branches', () => {
      const customCityAreas = getLocalitiesForCity('UnmappedTown', [
        'Market Road S.O',
        'Station Road B.O',
      ])

      expect(customCityAreas).toEqual(['Market Road', 'Station Road'])
    })
  })
})
