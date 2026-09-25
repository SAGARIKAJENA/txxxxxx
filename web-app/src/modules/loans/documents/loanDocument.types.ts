export interface UploadedLoanDocument {
  id?: string
  name: string
  size: string
  file?: File
  uploadedAt: string
}

export interface LoanDocumentDefinition {
  id: string
  title: string
  subtitle: string
  isRequired: boolean
  category?: 'identity' | 'income' | 'additional' | 'property' | 'commercial' | 'legal' | string
}
