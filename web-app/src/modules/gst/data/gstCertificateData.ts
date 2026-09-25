export interface CertificateRequestTypeOption {
  key: string
  label: string
}

export const GST_CERTIFICATE_CUSTOMER_RECORD = {
  gstin: '',
  registeredContact: '',
  mobile: '',
  email: '',
  businessName: '',
} as const

export const GST_CERTIFICATE_REQUEST_TYPES: CertificateRequestTypeOption[] = [
  {
    key: 'download_existing',
    label: 'Download Existing Certificate (Form REG-06)',
  },
  {
    key: 'request_reprint',
    label: 'Request Reprint / Duplicate Copy',
  },
  {
    key: 'verification_status',
    label: 'Certificate Verification & Status Check',
  },
]

export const GST_CERTIFICATE_META = {
  sectionTag: 'SECTION 6 · FORM 5 OF 5',
  title: 'GST Certificate',
  description: 'The lightest of the four — simply retrieving an already-issued certificate.',
  fieldNotes: {
    gstin: "Auto-filled from the customer's GST Registration",
    registeredContact: 'Used only to confirm identity before releasing the download',
    requestType: 'Download Existing Certificate or Request Reprint',
  },
} as const
