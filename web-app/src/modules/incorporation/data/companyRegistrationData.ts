import type {
  CompanyRegistrationDetails,
  CompanyTypeOption,
  CompanyDetailsFormData,
  DirectorDetails,
} from '../types/incorporation.types'

export const companyRegistrationData: CompanyRegistrationDetails = {
  title: 'Company Registration',
  category: 'Business & Incorporation Category',
  description:
    'Incorporate your Private Limited, One Person Company (OPC), Section 8 (NGO), or Public Limited Company end-to-end with TaxEdge CA assistance.',
  overview: {
    heading: 'Service Overview',
    content:
      'TaxEdge Fin Solutions provides end-to-end corporate incorporation assistance for MCA, ROC, and statutory authorities. Our compliance team verifies director credentials, checks name availability, drafts e-MoA / e-AoA, and files SPICe+ Part A & Part B directly on the Ministry of Corporate Affairs portal.',
  },
  documents: {
    heading: 'Required Documents',
    subheading: 'You will need to upload digital copies of these documents during application:',
    items: [
      'PAN Card of all Directors / Promoters',
      'Aadhaar Card / Passport of all Directors',
      'Registered Office Ownership / Lease Proof',
      'Utility Bill (Electricity / Water not older than 2 months)',
      'Property Owner No Objection Certificate (NOC)',
    ],
  },
  benefits: {
    heading: 'Benefits & Advantages',
    subheading: 'Why choose TaxEdge Fin Solutions:',
    items: [
      '100% Digital MCA Incorporation & Government Portal Filing',
      'Includes RUN / SPICe+ Part A & Part B Submission',
      'Dedicated CA Expert & Compliance Verification Officer',
      'Free PAN, TAN, EPFO, ESIC & Corporate Bank Account Setup',
      'Transparent Itemized MCA Statutory Fee Breakdown',
    ],
  },
}

export const companyTypeOptions: CompanyTypeOption[] = [
  {
    id: 'pvt_ltd',
    title: 'Private Limited Company (Pvt Ltd)',
    description: 'Suitable for startups and growing businesses. Limited liability & easy funding.',
    badge: 'Min 2 Directors',
    icon: 'building',
  },
  {
    id: 'opc',
    title: 'One Person Company (OPC)',
    description: 'Ideal for solo entrepreneurs who want corporate identity with 100% ownership control.',
    badge: '1 Founder + 1 Nominee',
    icon: 'user',
  },
  {
    id: 'section_8',
    title: 'Section 8 Company (Non-Profit)',
    description: 'Formed for promoting commerce, art, science, sports, education, research, or charity.',
    badge: 'Min 2 Members',
    icon: 'trending',
  },
  {
    id: 'public_ltd',
    title: 'Public Limited Company',
    description: 'Suitable for large scale enterprises planning to list shares or issue public capital.',
    badge: 'Min 3 Directors',
    icon: 'briefcase',
  },
]

export const defaultCompanyDetails: CompanyDetailsFormData = {
  companyType: 'pvt_ltd',
  classOfCompany: '',
  categoryOfCompany: '',
  subCategoryOfCompany: '',
  primaryBusinessActivity: '',
  nicCode: '',
  secondaryBusinessActivity: '',
  firstPreferredName: '',
  secondPreferredName: '',
  mandatorySuffix: '',
}

export const defaultDirectors: DirectorDetails[] = [
  {
    id: 1,
    fullName: '',
    pan: '',
    din: '',
    dob: '',
    fatherName: '',
    gender: '',
    nationality: 'Indian',
    designation: 'Director',
    category: 'Promoter Director',
    email: '',
    mobile: '',
    isResident: true,
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    isSameAddress: true,
    equityShares: '',
    equityAmount: '',
    shareholdingPercent: '',
  },
]
