import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type WorkingCapitalFacility =
  | 'Cash Credit (CC) Facility'
  | 'Overdraft (OD) against Stock/Debtors'
  | 'Letter of Credit (LC) / Bank Guarantee'
  | 'Invoice Discounting / Factoring'
  | 'Combined Fund & Non-Fund Limits'

export interface WorkingCapitalLoanData {
  // Step 1: Requirements
  facilityType: WorkingCapitalFacility
  requestedLimit: number
  repaymentTenureYears: number
  primaryCollateralOffered: string

  // Step 2: Commercial Profile
  businessName: string
  constitution: string
  currentAnnualRevenue: string
  estimatedStockValue: string
  estimatedDebtorsValue: string

  // Step 3: Banking & GST
  primaryConsortiumBank: string
  currentAccountNumber: string
  ifscCode: string
  gstin: string
  panNumber: string

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
