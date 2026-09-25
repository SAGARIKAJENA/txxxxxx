import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { WorkingCapitalLoanData } from '../../types/workingCapitalLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: WorkingCapitalLoanData
  updateFormData: (fields: Partial<WorkingCapitalLoanData>) => void
}

const WORKING_CAPITAL_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'audited_financials_2yrs',
    title: '2 Years Audited Balance Sheet & P&L',
    subtitle: 'Full statutory audit report with notes, depreciation & schedules',
    isRequired: true,
  },
  {
    id: 'stock_debtors_statement',
    title: 'Latest Stock & Book Debt Statement',
    subtitle: 'Inventory ageing & receivable statement certified by CA/Management',
    isRequired: true,
  },
  {
    id: 'gstr_returns_12m',
    title: '12 Months GST Returns (GSTR-3B)',
    subtitle: 'Consolidated filing receipts confirming monthly sales consistency',
    isRequired: true,
  },
  {
    id: 'bank_statements_cc',
    title: '12 Months Current / CC Account Statement',
    subtitle: 'Primary cash credit / current account operations statements',
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
    <div className="working-capital-docs">
      <LoanDocumentSection
        title="Required Commercial Working Capital Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={WORKING_CAPITAL_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
