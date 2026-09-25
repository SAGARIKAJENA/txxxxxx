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
  badgeLabel?: string
  badgeVariant?: 'required' | 'optional'
  category?: 'identity' | 'income' | 'additional' | 'property' | 'commercial' | 'legal' | string
  icon?: React.ReactNode
  iconBg?: string
  iconColor?: string
}
