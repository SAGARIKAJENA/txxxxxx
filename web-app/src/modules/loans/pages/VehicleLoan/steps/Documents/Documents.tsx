import React from 'react'
import { LoanDocumentSection } from '../../../../components/LoanDocumentSection/LoanDocumentSection'
import { loanDocumentService } from '../../../../documents/loanDocumentService'
import type { LoanDocumentDefinition } from '../../../../documents/loanDocument.types'
import type { VehicleLoanData } from '../../types/vehicleLoan.types'
import './Documents.css'

export interface DocumentsProps {
  formData: VehicleLoanData
  updateFormData: (fields: Partial<VehicleLoanData>) => void
}

const VEHICLE_DOCS: LoanDocumentDefinition[] = [
  {
    id: 'proforma_invoice',
    title: 'Vehicle Proforma Invoice / Quotation',
    subtitle: 'Official dealership proforma with chassis/variant breakdown',
    isRequired: true,
  },
  {
    id: 'driving_license',
    title: 'Driving License / Applicant KYC',
    subtitle: 'Front and back side copy of valid driving license or PAN/Aadhaar',
    isRequired: true,
  },
  {
    id: 'bank_statement_vehicle',
    title: '6 Months Bank Account Statement',
    subtitle: 'Primary operational bank statement showing salary/business cashflow',
    isRequired: true,
  },
  {
    id: 'income_proof_vehicle',
    title: 'Latest 3 Months Salary Slips or ITR-V',
    subtitle: 'Document verifying borrower monthly financial capability',
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
    <div className="vehicle-loan-docs">
      <LoanDocumentSection
        title="Required Vehicle Financing Documents"
        badgeLabel="Mandatory (4 Documents)"
        isRequiredBadge
        documents={VEHICLE_DOCS}
        uploadedDocs={formData.uploadedDocs || {}}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Documents
