export type CompanyRegistrationTab = 'overview' | 'documents' | 'benefits'

export type CompanyEntityType = 'pvt_ltd' | 'opc' | 'section_8' | 'public_ltd'

export interface CompanyTypeOption {
  id: CompanyEntityType
  title: string
  description: string
  badge: string
  icon: 'building' | 'user' | 'trending' | 'briefcase'
}

export interface CompanyRegistrationDetails {
  title: string
  category: string
  description: string
  overview: {
    heading: string
    content: string
  }
  documents: {
    heading: string
    subheading: string
    items: string[]
  }
  benefits: {
    heading: string
    subheading: string
    items: string[]
  }
}

export interface CompanyDetailsFormData {
  companyType: CompanyEntityType
  classOfCompany: string
  categoryOfCompany: string
  subCategoryOfCompany: string
  primaryBusinessActivity: string
  nicCode: string
  secondaryBusinessActivity: string
  firstPreferredName: string
  secondPreferredName: string
  mandatorySuffix: string
}

export interface DirectorDetails {
  id: number
  fullName: string
  pan: string
  din: string
  dob: string
  fatherName: string
  gender: string
  nationality: string
  designation: string
  category: string
  email: string
  mobile: string
  isResident: boolean
  idProofType?: string
  citizenship?: string
  addressLine1: string
  addressLine2: string
  city: string
  district: string
  state: string
  pincode: string
  isSameAddress: boolean
  equityShares: string
  equityAmount: string
  shareholdingPercent: string
}
