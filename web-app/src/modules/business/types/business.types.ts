export type BusinessCategory = 'all' | 'registrations' | 'licenses' | 'ip' | 'compliance'

export interface BusinessServiceItem {
  id: string
  category: 'registrations' | 'licenses' | 'ip' | 'compliance'
  title: string
  subtitle: string
  description: string
  price: string
  turnaroundTime: string
  validity: string
  badge?: string
  features: string[]
  documentsRequired: string[]
  icon: string
}

export interface BusinessComplianceItem {
  id: string
  title: string
  formName: string
  dueDate: string
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual'
  applicableTo: string
  penaltyDetails: string
}

export interface BusinessApplication {
  id: string
  referenceNumber: string
  businessName: string
  serviceName: string
  status: 'PENDING_DOCS' | 'PROCESSING' | 'GOVT_SUBMITTED' | 'APPROVED'
  appliedOn: string
  estimatedApproval: string
  department: string
}

export interface BusinessStats {
  activeLicensesManaged: number
  msmeRegistrationsIssued: number
  annualCompliancesFiled: number
  expertConsultationRating: string
}
