import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { PersonalLoanData } from '../../types/personalLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: PersonalLoanData
  updateFormData: (fields: Partial<PersonalLoanData>) => void
}

const MANDATORY_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'pan_card',
    title: 'PAN Card',
    subtitle: 'Clear front photo or PDF copy of applicant PAN',
    isRequired: true,
  },
  {
    id: 'aadhaar_card',
    title: 'Aadhaar Card',
    subtitle: 'Front and back side for identity and address proof',
    isRequired: true,
  },
  {
    id: 'salary_slips',
    title: 'Latest 3 Months Salary Slips',
    subtitle: 'Generated salary statements showing gross & net pay',
    isRequired: true,
  },
  {
    id: 'bank_statement',
    title: '6 Months Salary Account Statement',
    subtitle: 'Downloaded e-statement or PDF with bank stamp',
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
    <div className="personal-loan-docs">
      <LoanDocumentSection
        title="Required Identification & Financial Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={MANDATORY_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
