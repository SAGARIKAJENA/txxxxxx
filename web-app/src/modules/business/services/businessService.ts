import {
  BUSINESS_SERVICES,
  BUSINESS_COMPLIANCE_CALENDAR,
  BUSINESS_STATS,
  SAMPLE_BUSINESS_APPLICATIONS,
} from '../data/businessData'
import type {
  BusinessServiceItem,
  BusinessComplianceItem,
  BusinessApplication,
  BusinessStats,
  BusinessCategory,
} from '../types/business.types'

/**
 * Service for business licensing, registrations, and corporate compliance.
 * Rule 2: Pure functional patterns, no loops.
 */
export const businessService = {
  getServices: (category: BusinessCategory = 'all'): BusinessServiceItem[] => {
    if (category === 'all') {
      return BUSINESS_SERVICES.slice()
    }
    return BUSINESS_SERVICES.filter((item) => item.category === category)
  },

  getServiceById: (id: string): BusinessServiceItem | undefined => {
    return BUSINESS_SERVICES.find((item) => item.id === id)
  },

  getComplianceCalendar: (): BusinessComplianceItem[] => {
    return BUSINESS_COMPLIANCE_CALENDAR.slice()
  },

  getStats: (): BusinessStats => {
    return { ...BUSINESS_STATS }
  },

  getApplications: (): BusinessApplication[] => {
    return SAMPLE_BUSINESS_APPLICATIONS.slice()
  },

  createApplication: (
    _serviceId: string,
    serviceName: string,
    businessName: string
  ): BusinessApplication => {
    return {
      id: `biz_app_${Date.now()}`,
      referenceNumber: `BIZ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      businessName,
      serviceName,
      status: 'PROCESSING',
      appliedOn: 'Today',
      estimatedApproval: '3 - 5 Business Days',
      department: 'Central Licensing Portal',
    }
  },
}
