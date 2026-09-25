import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { MachineryLoanData } from '../../types/machineryLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: MachineryLoanData
  updateFormData: (fields: Partial<MachineryLoanData>) => void
}

const MACHINERY_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'machinery_quotation',
    title: 'OEM Machinery Proforma Invoice / Quotation',
    subtitle: 'Detailed equipment quotation with warranty and delivery terms',
    isRequired: true,
  },
  {
    id: 'factory_proof',
    title: 'Factory Shed Lease Agreement / Electricity Bill',
    subtitle: 'Industrial electricity bill or registered lease agreement of site',
    isRequired: true,
  },
  {
    id: 'financials_2yrs',
    title: '2 Years Audited Balance Sheet & P&L',
    subtitle: 'Audited accounts with depreciation schedules & tax audit report',
    isRequired: true,
  },
  {
    id: 'bank_statement_plant',
    title: '12 Months Current Account Statement',
    subtitle: 'Operational current account statements showing transaction velocity',
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
    <div className="machinery-loan-docs">
      <LoanDocumentSection
        title="Required Equipment & Factory Verification Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={MACHINERY_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
