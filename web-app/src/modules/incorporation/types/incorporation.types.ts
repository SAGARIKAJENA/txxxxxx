export type IncorporationEntityType =
  | 'pvt_ltd'
  | 'llp'
  | 'opc'
  | 'section_8'
  | 'public_ltd'
  | 'proprietorship'

export interface IncorporationServiceItem {
  id: string
  entityType: IncorporationEntityType
  title: string
  subtitle: string
  description: string
  price: string
  governmentFeesIncluded: boolean
  turnaroundTime: string
  minMembers: string
  foreignInvestmentAllowed: boolean
  badge?: string
  features: string[]
  recommendedFor: string
  icon: string
}

export interface IncorporationProcessStep {
  stepNumber: number
  title: string
  description: string
  duration: string
  deliverables: string[]
}

export interface IncorporationApplication {
  id: string
  referenceNumber: string
  proposedName: string
  entityType: IncorporationEntityType
  status: 'SUBMITTED' | 'IN_REVIEW' | 'NAME_APPROVED' | 'INCORPORATED' | 'ACTION_REQUIRED'
  submittedDate: string
  targetCompletionDate: string
  currentStep: string
  directorsCount: number
}

export interface IncorporationStats {
  totalEntitiesRegistered: number
  avgTurnaroundDays: number
  rocApprovalRate: string
  activeSupportHours: string
}
