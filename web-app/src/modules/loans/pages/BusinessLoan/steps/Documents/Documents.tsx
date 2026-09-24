import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { BusinessLoanData } from '../../types/businessLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: BusinessLoanData
  updateFormData: (fields: Partial<BusinessLoanData>) => void
}

const BUSINESS_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'business_registration',
    title: 'Business Registration / GST Certificate',
    subtitle: 'Certificate of Incorporation, Partnership Deed, or GST Registration',
    isRequired: true,
  },
  {
    id: 'pan_promoter',
    title: 'Entity PAN & Promoter KYC',
    subtitle: 'Company/Firm PAN along with Aadhaar of Managing Director / Partner',
    isRequired: true,
  },
  {
    id: 'bank_statement_12m',
    title: '12 Months Current Account Statement',
    subtitle: 'Bank statement of the operational current account in PDF format',
    isRequired: true,
  },
  {
    id: 'financials_itr',
    title: '2 Years ITR & Audited Financials',
    subtitle: 'ITR-V, Balance Sheet, and Profit & Loss statement with schedules',
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
    <div className="business-loan-docs">
      <LoanDocumentSection
        title="Required Business & Commercial Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={BUSINESS_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
