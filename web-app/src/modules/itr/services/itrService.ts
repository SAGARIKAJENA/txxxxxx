import { env } from '@core/config'
import { userStorage } from '@core/storage/userStorage'

import { itrApi } from '../api/itrApi'
import type { ItrFilters, ItrItem } from '../types/itr.types'

export const itrService = {
  async list(filters?: ItrFilters): Promise<ItrItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const userApps = userStorage.getUserApplications().filter((a) => a.title.toLowerCase().includes('itr'))
      return userApps.map((a) => ({
        id: a.id,
        reference: a.code || a.id,
        title: a.title,
        status: (a.statusLabel.toUpperCase().replace(/\s+/g, '_') as any) || 'SUBMITTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    }
    const response = await itrApi.list(filters)
    return response.data
  },
}
