import { apiClient } from '@core/api'
import type { ApiResponse } from '@shared/types'

import type {
  SendMessagePayload,
  SupportConversation,
  SupportExecutive,
  SupportFilters,
  SupportItem,
  SupportMessage,
} from '../types/customerSupport.types'

export const customerSupportApi = {
  list(filters?: SupportFilters): Promise<ApiResponse<SupportItem[]>> {
    return apiClient.get('/support', { params: filters })
  },

  getExecutives(): Promise<SupportExecutive[]> {
    return apiClient.get('/support/executives').then((res: any) => res.data)
  },

  getConversation(applicationId: string): Promise<SupportConversation> {
    return apiClient.get(`/support/conversations/${applicationId}`).then((res: any) => res.data)
  },

  sendMessage(payload: SendMessagePayload): Promise<SupportMessage> {
    return apiClient.post('/support/messages', payload).then((res: any) => res.data)
  },
}
