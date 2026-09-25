import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { MsmeLoanData } from '../../types/msmeLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: MsmeLoanData
  updateFormData: (fields: Partial<MsmeLoanData>) => void
}

const MSME_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'udyam_certificate',
    title: 'Udyam Registration Certificate',
    subtitle: 'Official government Udyam certificate downloaded from udyamregistration.gov.in',
    isRequired: true,
  },
  {
    id: 'promoter_kyc',
    title: 'Promoter / Proprietor Aadhaar & PAN',
    subtitle: 'Self-attested identity proof of chief promoter or authorized partners',
    isRequired: true,
  },
  {
    id: 'msme_bank_statement',
    title: '12 Months Current Account Statement',
    subtitle: 'Bank statement verifying consistent business activity and banking inflows',
    isRequired: true,
  },
  {
    id: 'project_activity_report',
    title: 'MSME Project Report / Activity Profile',
    subtitle: 'Brief writeup on enterprise products, machinery cost, and revenue projection',
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
    <div className="msme-loan-docs">
      <LoanDocumentSection
        title="Required MSME Subsidy & Compliance Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={MSME_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
