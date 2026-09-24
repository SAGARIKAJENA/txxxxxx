import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { PropertyLoanData } from '../../types/propertyLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: PropertyLoanData
  updateFormData: (fields: Partial<PropertyLoanData>) => void
}

const PROPERTY_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'sale_deed',
    title: 'Registered Sale Deed / Title Deed',
    subtitle: 'Clear scanned PDF of primary ownership sale deed',
    isRequired: true,
  },
  {
    id: 'chain_documents',
    title: 'Prior Chain Title Deeds & Khata / Patta',
    subtitle: '13 to 30 years chain documents, mutation register or e-Khata extract',
    isRequired: true,
  },
  {
    id: 'property_tax_receipt',
    title: 'Latest Property Tax Paid Receipt',
    subtitle: 'Receipt proving municipal property taxes are paid up to date',
    isRequired: true,
  },
  {
    id: 'bank_statement_lap',
    title: '12 Months Bank Account Statement',
    subtitle: 'Operating bank statement reflecting monthly net income / revenue',
    isRequired: true,
  },
]

export const Documents: React.FC<DocumentsProps> = ({
  formData,
  updateFormData,
}) => {
  const handleUpload = (id: string, file: File) => {
    const doc = loanDocumentService.createUploadedDocument(file)
    updateFormData({
      uploadedDocs: {
        ...formData.uploadedDocs,
        [id]: doc,
      },
    })
  }

  const handleRemove = (id: string) => {
    const updated = { ...formData.uploadedDocs }
    delete updated[id]
    updateFormData({ uploadedDocs: updated })
  }

  return (
    <div className="property-loan-docs">
      <LoanDocumentSection
        title="Required Property Title & Mortgagor Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={PROPERTY_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
