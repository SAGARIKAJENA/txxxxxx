import { useState, useMemo, useCallback } from 'react'
import { incorporationService } from '../services/incorporationService'
import type { IncorporationEntityType } from '../types/incorporation.types'

export const useIncorporation = (initialFilter: IncorporationEntityType | 'all' = 'all') => {
  const [selectedType, setSelectedType] = useState<IncorporationEntityType | 'all'>(initialFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const [nameCheckQuery, setNameCheckQuery] = useState('')
  const [nameCheckResult, setNameCheckResult] = useState<{ available: boolean; message: string; suggestions: string[] } | null>(null)

  const allServices = useMemo(() => incorporationService.getServices(), [])
  const processSteps = useMemo(() => incorporationService.getProcessSteps(), [])
  const stats = useMemo(() => incorporationService.getStats(), [])
  const applications = useMemo(() => incorporationService.getApplications(), [])

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesType = selectedType === 'all' || service.entityType === selectedType
      const matchesQuery =
        !searchQuery.trim() ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesQuery
    })
  }, [allServices, selectedType, searchQuery])

  const handleCheckName = useCallback(() => {
    if (!nameCheckQuery.trim()) return
    const result = incorporationService.checkNameAvailability(nameCheckQuery)
    setNameCheckResult(result)
  }, [nameCheckQuery])

  const clearNameCheck = useCallback(() => {
    setNameCheckQuery('')
    setNameCheckResult(null)
  }, [])

  return {
    services: filteredServices,
    allServices,
    processSteps,
    stats,
    applications,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    nameCheckQuery,
    setNameCheckQuery,
    nameCheckResult,
    handleCheckName,
    clearNameCheck,
  }
}
