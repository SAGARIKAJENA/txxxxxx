import {
  INCORPORATION_SERVICES,
  INCORPORATION_STEPS,
  INCORPORATION_STATS,
  SAMPLE_INCORPORATION_APPLICATIONS,
} from '../data/incorporationData'
import type {
  IncorporationServiceItem,
  IncorporationProcessStep,
  IncorporationApplication,
  IncorporationStats,
  IncorporationEntityType,
} from '../types/incorporation.types'

/**
 * Service for incorporation workflows and data fetching.
 * Rule 2: Pure functional patterns, no loops.
 */
export const incorporationService = {
  getServices: (): IncorporationServiceItem[] => {
    return INCORPORATION_SERVICES.slice()
  },

  getServiceById: (id: string): IncorporationServiceItem | undefined => {
    return INCORPORATION_SERVICES.find((item) => item.id === id)
  },

  getServicesByType: (type: IncorporationEntityType): IncorporationServiceItem[] => {
    return INCORPORATION_SERVICES.filter((item) => item.entityType === type)
  },

  getProcessSteps: (): IncorporationProcessStep[] => {
    return INCORPORATION_STEPS.slice()
  },

  getStats: (): IncorporationStats => {
    return { ...INCORPORATION_STATS }
  },

  getApplications: (): IncorporationApplication[] => {
    return SAMPLE_INCORPORATION_APPLICATIONS.slice()
  },

  /**
   * Functional name availability check simulator
   */
  checkNameAvailability: (name: string): { available: boolean; message: string; suggestions: string[] } => {
    const clean = name.trim().toLowerCase()
    if (!clean || clean.length < 3) {
      return {
        available: false,
        message: 'Please enter at least 3 characters for the proposed company name.',
        suggestions: [],
      }
    }

    const restrictedWords = ['national', 'bharat', 'reserve', 'bank', 'ministry', 'state', 'federal']
    const hasRestricted = restrictedWords.some((w) => clean.includes(w))

    if (hasRestricted) {
      return {
        available: false,
        message: 'Name contains restricted government words under the Emblems and Names Act.',
        suggestions: [`${name} Technologies`, `${name} Solutions`, `${name} Enterprises`],
      }
    }

    return {
      available: true,
      message: 'Name looks unique and compliant with MCA guidelines!',
      suggestions: [`${name} Private Limited`, `${name} LLP`, `${name} Technologies Pvt Ltd`],
    }
  },
}
