import { useState, useMemo } from 'react'
import type {
  BusinessCategory,
  BusinessServiceItem,
  BusinessApplication,
} from '../types/business.types'
import {
  BUSINESS_SERVICES,
  BUSINESS_STATS,
  BUSINESS_COMPLIANCE_CALENDAR,
} from '../data/businessData'
import { businessService } from '../services/businessService'

export const useBusiness = () => {
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [applications, setApplications] = useState<BusinessApplication[]>([])

  const filteredServices = useMemo<BusinessServiceItem[]>(() => {
    return BUSINESS_SERVICES.filter((svc: BusinessServiceItem) => {
      const matchesCategory =
        selectedCategory === 'all' || svc.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (svc.badge && svc.badge.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const handleApply = (serviceId: string) => {
    const service = BUSINESS_SERVICES.find((s: BusinessServiceItem) => s.id === serviceId)
    if (!service) return

    const newApp = businessService.createApplication(
      serviceId,
      service.title,
      'My Enterprise Pvt Ltd'
    )
    setApplications((prev: BusinessApplication[]) => [newApp, ...prev])
  }

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredServices,
    stats: BUSINESS_STATS,
    applications,
    complianceCalendar: BUSINESS_COMPLIANCE_CALENDAR,
    handleApply,
  }
}
