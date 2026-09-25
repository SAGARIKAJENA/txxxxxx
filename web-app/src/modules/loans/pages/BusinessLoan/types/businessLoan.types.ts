import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type BusinessConstitution =
  | 'Proprietorship'
  | 'Partnership Firm'
  | 'Private Limited Company'
  | 'Limited Liability Partnership (LLP)'
  | 'One Person Company (OPC)'

export interface BusinessLoanData {
  // Step 1: Requirements
  loanAmount: number
  businessPurpose: string
  repaymentTenureYears: number

  // Step 2: Business Profile & Revenue
  businessName: string
  constitution: BusinessConstitution
  yearsInBusiness: string
  annualTurnover: string
  gstRegistered: boolean
  gstin?: string

  // Step 3: Banking & Tax
  primaryCurrentBank: string
  currentAccountNumber: string
  ifscCode: string
  panNumber: string
  itrFiledYears: '1 Year' | '2 Years' | '3+ Years'

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
