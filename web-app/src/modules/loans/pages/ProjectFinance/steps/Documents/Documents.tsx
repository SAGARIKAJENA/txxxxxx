import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { ProjectFinanceData } from '../../types/projectFinance.types'
import './Documents.css'

export interface DocumentsProps {
  formData: ProjectFinanceData
  updateFormData: (fields: Partial<ProjectFinanceData>) => void
}

const PROJECT_FINANCE_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'detailed_project_report',
    title: 'Detailed Project Report (DPR) & Financial Model',
    subtitle: 'Comprehensive business model with projected DSCR, IRR, and cashflows',
    isRequired: true,
  },
  {
    id: 'tev_study_report',
    title: 'Techno-Economic Viability (TEV) Study',
    subtitle: 'Independent consultant review certifying technical & economic viability',
    isRequired: true,
  },
  {
    id: 'clearances_concessions',
    title: 'Regulatory Approvals / Concession Agreement / Land Lease',
    subtitle: 'Government approvals, pollution control boards clearances, or PPA/EPC contracts',
    isRequired: true,
  },
  {
    id: 'sponsor_financials_3yrs',
    title: '3 Years Audited Financials of Parent Sponsor',
    subtitle: 'Consolidated balance sheets, profit & loss statements, and annual reports',
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
    <div className="project-finance-docs">
      <LoanDocumentSection
        title="Required Project Syndication & Feasibility Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={PROJECT_FINANCE_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
