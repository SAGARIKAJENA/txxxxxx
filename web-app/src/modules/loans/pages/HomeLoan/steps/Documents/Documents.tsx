import React from 'react'
import { DocumentTracker } from '@shared/components'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { HomeLoanData } from '../../types/homeLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData?: HomeLoanData
  updateFormData?: (fields: Partial<HomeLoanData>) => void
  data?: HomeLoanData
  onChange?: (fields: Partial<HomeLoanData>) => void
}

const IDENTITY_DOCS: LoanDocumentDefinition[] = [
  { id: 'pan_card', title: 'PAN Card', subtitle: 'Clear photo or PDF copy of PAN card.', isRequired: true, category: 'identity' },
  { id: 'aadhaar_card', title: 'Aadhaar Card', subtitle: 'Front & Back copy with readable QR code.', isRequired: true, category: 'identity' },
  { id: 'address_proof', title: 'Address Proof', subtitle: 'Utility bill / Rent Agreement (not older than 3 months).', isRequired: true, category: 'identity' },
  { id: 'passport_photo', title: 'Passport Size Photograph', subtitle: 'Recent color photo of the applicant.', isRequired: true, category: 'identity' },
]

const INCOME_DOCS: LoanDocumentDefinition[] = [
  { id: 'bank_statement', title: 'Bank Statements', subtitle: 'Last 6 to 12 months statement in PDF.', isRequired: true, category: 'income' },
  { id: 'salary_slips', title: 'Salary Slips', subtitle: 'Last 3-6 months payslips.', isRequired: true, category: 'income' },
  { id: 'form_16', title: 'Form 16', subtitle: 'Part A & Part B / Computation statement.', isRequired: true, category: 'income' },
]

const ADDITIONAL_DOCS: LoanDocumentDefinition[] = [
  { id: 'building_plan', title: 'Approved Building Plan & Sanction Map', subtitle: 'Municipal / RERA sanctioned building plan and NOC.', isRequired: false, category: 'additional' },
  { id: 'title_deed', title: 'Title Deed / Chain of Deeds', subtitle: 'Proof of ownership and prior title documents.', isRequired: false, category: 'additional' },
  { id: 'encumbrance_cert', title: 'Encumbrance Certificate & Tax Receipts', subtitle: 'Form 15/16 EC and latest property tax paid receipts.', isRequired: false, category: 'additional' },
  { id: 'down_payment_proof', title: 'Own Contribution / Down Payment Proof', subtitle: 'Bank debits / Builder receipts of customer margin paid.', isRequired: false, category: 'additional' },
]

const PROPERTY_DOCS: LoanDocumentDefinition[] = [
  { id: 'agreement_to_sell', title: 'Agreement to Sell / Allotment Letter', subtitle: 'Executed BBA, Allotment Letter or Agreement to Sell copy.', isRequired: false, category: 'property' },
  { id: 'builder_noc', title: 'Builder NOC', subtitle: 'No Objection Certificate from builder (if applicable).', isRequired: false, category: 'property' },
]

const ALL_DOCS = [...IDENTITY_DOCS, ...INCOME_DOCS, ...ADDITIONAL_DOCS, ...PROPERTY_DOCS]

export const Documents: React.FC<DocumentsProps> = ({ data, onChange, formData, updateFormData }) => {
  const currentData = formData || data || { uploadedDocs: {} } as HomeLoanData
  const updateData = updateFormData || onChange || (() => {})
  const uploadedCount = Object.keys(currentData.uploadedDocs || {}).length

  const handleUpload = (id: string, file: File) => {
    const entry = loanDocumentService.createDocumentEntry(id, file)
    updateData({
      uploadedDocs: {
        ...currentData.uploadedDocs,
        [id]: entry,
      },
    })
  }

  const handleRemove = (id: string) => {
    const next = { ...currentData.uploadedDocs }
    delete next[id]
    updateData({ uploadedDocs: next })
  }

  return (
    <div className="home-loan-docs">
      <section className="home-loan-docs__header-card">
        <h2 className="home-loan-docs__title">Document Checklist (Initial)</h2>
        <p className="home-loan-docs__subtitle">
          Supported formats: PDF, JPG, PNG, Word (.docx), Excel (.xlsx) | Max 10MB per file
        </p>
        <DocumentTracker
          totalCount={ALL_DOCS.length}
          uploadedCount={uploadedCount}
          label={`${uploadedCount} of ${ALL_DOCS.length} documents uploaded`}
        />
      </section>

      <LoanDocumentSection
        title="Identity &amp; Address Documents"
        badgeLabel="Required"
        isRequiredBadge
        documents={IDENTITY_DOCS}
        uploadedDocs={currentData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />

      <LoanDocumentSection
        title="Income &amp; Banking Documents"
        badgeLabel="Required"
        isRequiredBadge
        documents={INCOME_DOCS}
        uploadedDocs={currentData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />

      <LoanDocumentSection
        title="Additional Documents (Optional)"
        badgeLabel="Optional"
        documents={ADDITIONAL_DOCS}
        uploadedDocs={currentData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />

      <LoanDocumentSection
        title="Property &amp; Collateral (Optional)"
        badgeLabel="Optional"
        documents={PROPERTY_DOCS}
        uploadedDocs={currentData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
