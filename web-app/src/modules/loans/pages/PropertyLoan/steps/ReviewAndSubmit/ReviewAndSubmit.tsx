import React from 'react'
import { LoanReviewSection } from '../../../../components/LoanReviewSection/LoanReviewSection'
import type { PropertyLoanData } from '../../types/propertyLoan.types'
import './ReviewAndSubmit.css'

export interface ReviewAndSubmitProps {
  formData: PropertyLoanData
  updateFormData: (fields: Partial<PropertyLoanData>) => void
  onNavigateToStep: (stepNumber: number) => void
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
  updateFormData,
  onNavigateToStep,
}) => {
  const docCount = Object.keys(formData.uploadedDocs || {}).length

  return (
    <div className="property-loan-review">
      {/* 1. Requirements */}
      <LoanReviewSection
        title="Loan Against Property Requirements"
        onEdit={() => onNavigateToStep(1)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
        items={[
          {
            label: 'Requested LAP Amount',
            value: `₹${(formData.loanAmount || 0).toLocaleString('en-IN')}`,
          },
          {
            label: 'Property Type',
            value: formData.propertyType || '—',
          },
          {
            label: 'Estimated Market Value',
            value: formData.estimatedMarketValue ? `₹${formData.estimatedMarketValue}` : '—',
          },
          {
            label: 'Property Location',
            value: formData.propertyLocationCity || '—',
          },
          {
            label: 'Repayment Tenure',
            value: `${formData.repaymentTenureYears} Years (${formData.repaymentTenureYears * 12} Months)`,
          },
        ]}
      />

      {/* 2. Income Profile */}
      <LoanReviewSection
        title="Applicant Income Profile"
        onEdit={() => onNavigateToStep(2)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
        items={[
          {
            label: 'Primary Income Source',
            value: formData.primaryIncomeSource || '—',
          },
          {
            label: 'Monthly Inflow',
            value: formData.monthlyHouseholdIncome || '—',
          },
          {
            label: 'Existing Mortgage Status',
            value: formData.hasExistingPropertyLoan
              ? `Active Mortgage (₹${formData.existingLoanAmount || '0'} balance)`
              : 'Clear / Unencumbered Title',
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
            label: 'Operating Bank',
            value: formData.operatingBank || '—',
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
            label: 'Mortgagor PAN',
            value: formData.panNumber || '—',
          },
          {
            label: 'ITR Status',
            value: formData.itrStatus === 'filed' ? 'Filed & Compliant' : 'Not Filed',
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
      <div className="property-loan-review__declaration">
        <input
          id="property-loan-terms-checkbox"
          type="checkbox"
          className="property-loan-review__checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
        />
        <label htmlFor="property-loan-terms-checkbox" className="property-loan-review__label">
          I confirm that the title deeds and property details provided are authentic, free from undisclosed litigation, and I agree to the{' '}
          <span className="property-loan-review__terms-link">Terms &amp; Conditions</span> for Property Loan appraisal.
        </label>
      </div>
    </div>
  )
}

export default ReviewAndSubmit
