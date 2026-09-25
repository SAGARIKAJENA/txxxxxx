import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type PropertyType =
  | 'Residential House / Villa'
  | 'Residential Apartment / Flat'
  | 'Commercial Office Space'
  | 'Commercial Retail Shop'
  | 'Industrial Plot / Shed'

export interface PropertyLoanData {
  // Step 1: Requirements & Property Info
  loanAmount: number
  propertyType: PropertyType
  estimatedMarketValue: string
  propertyLocationCity: string
  repaymentTenureYears: number

  // Step 2: Income Profile
  primaryIncomeSource: 'Salaried' | 'Business Owner' | 'Professional Practice' | 'Rental & Investment'
  monthlyHouseholdIncome: string
  hasExistingPropertyLoan: boolean
  existingLoanAmount?: string

  // Step 3: Banking & Tax
  operatingBank: string
  accountNumber: string
  ifscCode: string
  panNumber: string
  itrStatus: 'filed' | 'not-filed'

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
