import { env } from '@core/config'

import { profileApi } from '../api/profileApi'
import type { ProfileFilters, ProfileItem } from '../types/profile.types'

export const profileService = {
  async list(filters?: ProfileFilters): Promise<ProfileItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return []
    }
    const response = await profileApi.list(filters)
    return response.data
  },
}
