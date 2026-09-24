import type { UploadedLoanDocument } from '../../../documents/loanDocument.types'

export type VehicleCategory =
  | 'Passenger Car / SUV'
  | 'Two Wheeler / Bike'
  | 'Commercial Cargo / Transport'
  | 'Electric Vehicle (EV)'
  | 'Construction / Fleet Vehicle'

export type VehicleCondition = 'Brand New' | 'Pre-Owned / Used'

export interface VehicleLoanData {
  // Step 1: Requirements
  vehicleCategory: VehicleCategory
  vehicleCondition: VehicleCondition
  vehicleMakeModel: string
  onRoadPrice: string
  loanAmount: number
  repaymentTenureYears: number

  // Step 2: Income & Employment
  employmentType: 'Salaried' | 'Self Employed' | 'Business / Fleet Operator'
  monthlyIncome: string
  dealerNameCity: string

  // Step 3: Banking & Identity
  bankName: string
  accountNumber: string
  ifscCode: string
  panNumber: string
  drivingLicenseNumber: string

  // Step 4: Documents
  uploadedDocs: Record<string, UploadedLoanDocument>

  // Step 5: Terms
  termsAccepted: boolean
}
