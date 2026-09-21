import { useCallback, useEffect, useState } from 'react'
import { customerSupportService } from '../services/customerSupportService'
import type { SupportExecutive } from '../types/customerSupport.types'

export const useCustomerSupportExecutives = () => {
  const [executives, setExecutives] = useState<SupportExecutive[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadExecutives = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await customerSupportService.getExecutives()
      setExecutives(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load executives')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadExecutives()
  }, [loadExecutives])

  return {
    executives,
    isLoading,
    error,
    reload: loadExecutives,
  }
}
