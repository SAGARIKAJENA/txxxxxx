import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type ProjectSectorType =
  | 'Infrastructure & Roads'
  | 'Renewable Energy / Solar Power'
  | 'Commercial Real Estate Development'
  | 'Industrial Plant / Factory Setup'
  | 'Hospitality & Healthcare Projects'
  | 'Logistics & Warehousing Parks'

export interface ProjectFinanceData {
  // Step 1: Requirements & Project Outline
  projectSector: ProjectSectorType
  projectName: string
  totalProjectCost: string
  promoterEquityContribution: string
  debtSoughtAmount: number
  moratoriumGracePeriodYears: number
  repaymentTenureYears: number

  // Step 2: Sponsor & Promoter Track Record
  sponsorEntityName: string
  promoterGroupNetWorth: string
  priorCompletedProjects: string
  cinOrLlpNumber: string

  // Step 3: Banking & Consortia
  leadBankName: string
  currentAccountNumber: string
  ifscCode: string
  panNumber: string

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
