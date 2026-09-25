import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type PersonalLoanPurpose =
  | 'Medical Emergency'
  | 'Wedding & Family Function'
  | 'Home Renovation'
  | 'Higher Education'
  | 'Travel & Vacation'
  | 'Debt Consolidation'
  | 'Other Personal Needs'

export type PersonalLoanOccupation = 'salaried' | 'self-employed-professional' | 'consultant'

export interface PersonalLoanData {
  // Step 1: Requirements
  loanAmount: number
  loanPurpose: PersonalLoanPurpose
  repaymentTenureYears: number

  // Step 2: Employment & Income
  occupation: PersonalLoanOccupation
  employerName: string
  monthlyTakeHomeSalary: string
  hasExistingEmis: boolean
  existingEmiAmount?: string

  // Step 3: Banking & ITR
  salaryBankName: string
  accountNumber: string
  ifscCode: string
  itrStatus: 'filed' | 'not-filed' | 'exempt'
  panNumber: string

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
