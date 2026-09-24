import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type MachineryIndustryType =
  | 'Manufacturing & CNC Engineering'
  | 'Textile & Garment Processing'
  | 'Printing & Packaging Machinery'
  | 'Medical & Diagnostic Equipment'
  | 'Food Processing & Cold Storage'
  | 'Construction & Earthmoving Plant'

export interface MachineryLoanData {
  // Step 1: Requirements
  machineryType: MachineryIndustryType
  machineNameModel: string
  supplierManufacturerName: string
  totalEquipmentCost: string
  loanAmount: number
  repaymentTenureYears: number

  // Step 2: Factory & Business Profile
  enterpriseName: string
  factoryUnitLocation: string
  annualTurnover: string
  yearsInOperation: string

  // Step 3: Banking & GST
  primaryCurrentBank: string
  accountNumber: string
  ifscCode: string
  gstin: string
  panNumber: string

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
