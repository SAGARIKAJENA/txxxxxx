import React from 'react'
import { LoanReviewSection } from '../../../../components/LoanReviewSection/LoanReviewSection'
import type { WorkingCapitalLoanData } from '../../types/workingCapitalLoan.types'
import './ReviewAndSubmit.css'

export interface ReviewAndSubmitProps {
  formData: WorkingCapitalLoanData
  updateFormData: (fields: Partial<WorkingCapitalLoanData>) => void
  onNavigateToStep: (stepNumber: number) => void
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
  updateFormData,
  onNavigateToStep,
}) => {
  const docCount = Object.keys(formData.uploadedDocs || {}).length

  return (
    <div className="working-capital-review">
      {/* 1. Requirements */}
      <LoanReviewSection
        title="Credit Facility Details"
        onEdit={() => onNavigateToStep(1)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
        items={[
          {
            label: 'Facility Type',
            value: formData.facilityType || '—',
          },
          {
            label: 'Requested Limit',
            value: `₹${(formData.requestedLimit || 0).toLocaleString('en-IN')}`,
          },
          {
            label: 'Primary Security / Collateral',
            value: formData.primaryCollateralOffered || '—',
          },
        ]}
      />

      {/* 2. Commercial Profile */}
      <LoanReviewSection
        title="Commercial Enterprise Profile"
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
            value: formData.businessName || '—',
          },
          {
            label: 'Annual Turnover',
            value: formData.currentAnnualRevenue || '—',
          },
          {
            label: 'Stock Valuation',
            value: formData.estimatedStockValue ? `₹${formData.estimatedStockValue}` : '—',
          },
          {
            label: 'Book Receivables / Debtors',
            value: formData.estimatedDebtorsValue ? `₹${formData.estimatedDebtorsValue}` : '—',
          },
        ]}
      />

      {/* 3. Banking & Tax Compliance */}
      <LoanReviewSection
        title="Consortium Banking & GST"
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
            value: formData.primaryConsortiumBank || '—',
          },
          {
            label: 'Account Number',
            value: formData.currentAccountNumber ? `••••${formData.currentAccountNumber.slice(-4)}` : '—',
          },
          {
            label: 'Branch IFSC',
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
      <div className="working-capital-review__declaration">
        <input
          id="working-capital-terms-checkbox"
          type="checkbox"
          className="working-capital-review__checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
        />
        <label htmlFor="working-capital-terms-checkbox" className="working-capital-review__label">
          I declare that the book debts, inventory statements, and audited accounts submitted are authentic, and I agree to the{' '}
          <span className="working-capital-review__terms-link">Terms &amp; Conditions</span> for Working Capital Limit assessment.
        </label>
      </div>
    </div>
  )
}

export default ReviewAndSubmit
