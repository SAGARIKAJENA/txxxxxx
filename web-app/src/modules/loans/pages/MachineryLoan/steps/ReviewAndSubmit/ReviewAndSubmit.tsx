import React from 'react'
import { LoanReviewSection } from '../../../../components/LoanReviewSection/LoanReviewSection'
import type { MachineryLoanData } from '../../types/machineryLoan.types'
import './ReviewAndSubmit.css'

export interface ReviewAndSubmitProps {
  formData: MachineryLoanData
  updateFormData: (fields: Partial<MachineryLoanData>) => void
  onNavigateToStep: (stepNumber: number) => void
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
  updateFormData,
  onNavigateToStep,
}) => {
  const docCount = Object.keys(formData.uploadedDocs || {}).length

  return (
    <div className="machinery-loan-review">
      {/* 1. Requirements */}
      <LoanReviewSection
        title="Machinery & Finance Requirements"
        onEdit={() => onNavigateToStep(1)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
        items={[
          {
            label: 'Machine Make & Model',
            value: formData.machineNameModel || '—',
          },
          {
            label: 'Machinery Sector',
            value: formData.machineryType || '—',
          },
          {
            label: 'Supplier / OEM',
            value: formData.supplierManufacturerName || '—',
          },
          {
            label: 'Total Cost',
            value: formData.totalEquipmentCost ? `₹${formData.totalEquipmentCost}` : '—',
          },
          {
            label: 'Term Loan Amount',
            value: `₹${(formData.loanAmount || 0).toLocaleString('en-IN')}`,
          },
          {
            label: 'Tenure',
            value: `${formData.repaymentTenureYears} Years (${formData.repaymentTenureYears * 12} Months)`,
          },
        ]}
      />

      {/* 2. Factory Profile */}
      <LoanReviewSection
        title="Industrial Site & Enterprise Profile"
        onEdit={() => onNavigateToStep(2)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
        items={[
          {
            label: 'Enterprise Name',
            value: formData.enterpriseName || '—',
          },
          {
            label: 'Operating Track Record',
            value: formData.yearsInOperation || '—',
          },
          {
            label: 'Annual Turnover',
            value: formData.annualTurnover || '—',
          },
          {
            label: 'Plant Location',
            value: formData.factoryUnitLocation || '—',
          },
        ]}
      />

      {/* 3. Banking & Tax Compliance */}
      <LoanReviewSection
        title="Banking & Tax Identity"
        onEdit={() => onNavigateToStep(3)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
        items={[
          {
            label: 'Primary Bank',
            value: formData.primaryCurrentBank || '—',
          },
          {
            label: 'Account Number',
            value: formData.accountNumber ? `••••${formData.accountNumber.slice(-4)}` : '—',
          },
          {
            label: 'IFSC Code',
            value: formData.ifscCode || '—',
          },
          {
            label: 'GSTIN',
            value: formData.gstin || '—',
          },
          {
            label: 'Entity PAN',
            value: formData.panNumber || '—',
          },
        ]}
      />

      {/* 4. Uploaded Documents */}
      <LoanReviewSection
        title={`Uploaded Documents (${docCount})`}
        onEdit={() => onNavigateToStep(4)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
        items={[
          {
            label: 'Documents Attached',
            value: docCount > 0 ? `${docCount} documents attached` : 'No documents uploaded',
          },
        ]}
      />

      {/* Declaration */}
      <div className="machinery-loan-review__declaration">
        <input
          id="machinery-loan-terms-checkbox"
          type="checkbox"
          className="machinery-loan-review__checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
        />
        <label htmlFor="machinery-loan-terms-checkbox" className="machinery-loan-review__label">
          I declare that the equipment specifications, proforma invoice, and industrial unit documentation provided are accurate, and I agree to the{' '}
          <span className="machinery-loan-review__terms-link">Terms &amp; Conditions</span> for Machinery Loan appraisal.
        </label>
      </div>
    </div>
  )
}

export default ReviewAndSubmit
