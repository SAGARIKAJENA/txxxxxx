import React from 'react'
import { LoanReviewSection } from '../../../../components/LoanReviewSection/LoanReviewSection'
import type { MsmeLoanData } from '../../types/msmeLoan.types'
import './ReviewAndSubmit.css'

export interface ReviewAndSubmitProps {
  formData: MsmeLoanData
  updateFormData: (fields: Partial<MsmeLoanData>) => void
  onNavigateToStep: (stepNumber: number) => void
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
  updateFormData,
  onNavigateToStep,
}) => {
  const docCount = Object.keys(formData.uploadedDocs || {}).length

  return (
    <div className="msme-loan-review">
      {/* 1. Requirements */}
      <LoanReviewSection
        title="MSME Scheme & Financing Requirements"
        onEdit={() => onNavigateToStep(1)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        }
        items={[
          {
            label: 'Selected Government Scheme',
            value: formData.schemeType || '—',
          },
          {
            label: 'Enterprise Category',
            value: formData.enterpriseCategory || '—',
          },
          {
            label: 'Udyam Registration No.',
            value: formData.udyamRegistrationNumber || '—',
          },
          {
            label: 'Requested Funding',
            value: `₹${(formData.loanAmount || 0).toLocaleString('en-IN')}`,
          },
          {
            label: 'Repayment Tenure',
            value: `${formData.repaymentTenureYears} Years (${formData.repaymentTenureYears * 12} Months)`,
          },
        ]}
      />

      {/* 2. Business Activity */}
      <LoanReviewSection
        title="Enterprise Activity & Scale"
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
            label: 'Sector Activity',
            value: formData.businessActivity || '—',
          },
          {
            label: 'Annual Turnover',
            value: formData.annualTurnover || '—',
          },
          {
            label: 'Employees Count',
            value: formData.existingEmployeesCount ? `${formData.existingEmployeesCount} Employees` : '—',
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
            label: 'Primary Current Bank',
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
            label: 'Proprietor / Enterprise PAN',
            value: formData.panNumber || '—',
          },
          {
            label: 'GSTIN',
            value: formData.gstin || 'Not Applicable / Exempt',
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
      <div className="msme-loan-review__declaration">
        <input
          id="msme-loan-terms-checkbox"
          type="checkbox"
          className="msme-loan-review__checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
        />
        <label htmlFor="msme-loan-terms-checkbox" className="msme-loan-review__label">
          I declare that the enterprise is eligible under the notified MSME scheme guidelines and that all provided Udyam and financial details are authentic, and I agree to the{' '}
          <span className="msme-loan-review__terms-link">Terms &amp; Conditions</span> for MSME Loan application.
        </label>
      </div>
    </div>
  )
}

export default ReviewAndSubmit
