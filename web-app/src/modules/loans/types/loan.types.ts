export type LoanType =
  | 'home-loan'
  | 'personal-loan'
  | 'business-loan'
  | 'property-loan'
  | 'vehicle-loan'
  | 'working-capital'
  | 'machinery-loan'
  | 'project-finance'
  | 'msme-loan'

export type OccupationType = 'salaried' | 'self-employed' | 'business-owner'
export type PropertyIntentType =
  | 'purchase'
  | 'under-construction'
  | 'plot-construction'
  | 'renovation'
  | 'balance-transfer'
  | 'others'

export type ItrStatusType = 'filed' | 'not-filed' | 'exempt'

export interface HomeLoanFormData {
  // Step 1: Requirements
  loanAmount: number
  propertyIntent: string
  repaymentTenureYears: number

  // Step 2: Employment & Income
  occupation: OccupationType
  monthlyIncomeRange: string
  exactMonthlyIncome?: string
  hasExistingEmis: boolean
  existingEmiAmount?: string

  // Step 3: Banking & ITR
  bankName: string
  accountNumber: string
  ifscCode: string
  itrStatus: ItrStatusType
  itrAckNumber?: string
  annualIncomeAsPerItr?: string

  // Step 4: Documents
  uploadedDocs: Record<string, { name: string; size: string; file?: File; uploadedAt: string }>

  // Step 5: Declaration
  termsAccepted: boolean
}

export interface LoanMilestone {
  id: string
  title: string
  timestamp?: string
  status: 'completed' | 'current' | 'pending'
}

export interface LoanApplicationResult {
  applicationId: string
  refNumber: string
  loanType: string
  loanAmount: number
  lenderNetwork: string
  caseAdvisor: string
  submittedAt: string
  statusLabel: string
  milestones: LoanMilestone[]
}
