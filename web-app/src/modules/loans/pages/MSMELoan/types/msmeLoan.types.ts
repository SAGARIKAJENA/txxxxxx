import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type MsmeSchemeType =
  | 'CGTMSE Collateral-Free Scheme (up to ₹5 Cr)'
  | 'Pradhan Mantri MUDRA Yojana (Tarun / Kishore)'
  | 'Credit Linked Capital Subsidy (CLCSS)'
  | 'PM Employment Generation Programme (PMEGP)'
  | 'Stand-Up India Scheme (SC/ST/Women Entrepreneurs)'

export type EnterpriseCategory = 'Micro Enterprise' | 'Small Enterprise' | 'Medium Enterprise'

export interface MsmeLoanData {
  // Step 1: Requirements & Scheme Selection
  schemeType: MsmeSchemeType
  enterpriseCategory: EnterpriseCategory
  udyamRegistrationNumber: string
  loanAmount: number
  repaymentTenureYears: number

  // Step 2: MSME Business Activity
  enterpriseName: string
  businessActivity: 'Manufacturing' | 'Service Provider' | 'Trading'
  annualTurnover: string
  existingEmployeesCount: string

  // Step 3: Banking & GST
  primaryCurrentBank: string
  accountNumber: string
  ifscCode: string
  panNumber: string
  gstin?: string

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
