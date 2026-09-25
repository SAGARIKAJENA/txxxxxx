import React from 'react'
import { LoanReviewSection } from '../../../../components/LoanReviewSection/LoanReviewSection'
import type { VehicleLoanData } from '../../types/vehicleLoan.types'
import './ReviewAndSubmit.css'

export interface ReviewAndSubmitProps {
  formData: VehicleLoanData
  updateFormData: (fields: Partial<VehicleLoanData>) => void
  onNavigateToStep: (stepNumber: number) => void
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
  updateFormData,
  onNavigateToStep,
}) => {
  const docCount = Object.keys(formData.uploadedDocs || {}).length

  return (
    <div className="vehicle-loan-review">
      {/* 1. Requirements */}
      <LoanReviewSection
        title="Vehicle & Loan Requirements"
        onEdit={() => onNavigateToStep(1)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="12" x="3" y="4" rx="2" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
            <path d="M7 16h10" />
          </svg>
        }
        items={[
          {
            label: 'Vehicle Model',
            value: formData.vehicleMakeModel || '—',
          },
          {
            label: 'Category & Condition',
            value: `${formData.vehicleCategory || '—'} (${formData.vehicleCondition || 'Brand New'})`,
          },
          {
            label: 'On-Road Price',
            value: formData.onRoadPrice ? `₹${formData.onRoadPrice}` : '—',
          },
          {
            label: 'Financing Amount',
            value: `₹${(formData.loanAmount || 0).toLocaleString('en-IN')}`,
          },
          {
            label: 'Repayment Tenure',
            value: `${formData.repaymentTenureYears} Years (${formData.repaymentTenureYears * 12} Months)`,
          },
        ]}
      />

      {/* 2. Employment & Income */}
      <LoanReviewSection
        title="Income & Dealership Profile"
        onEdit={() => onNavigateToStep(2)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
        items={[
          {
            label: 'Employment Nature',
            value: formData.employmentType || '—',
          },
          {
            label: 'Monthly Net Inflow',
            value: formData.monthlyIncome || '—',
          },
          {
            label: 'Authorized Dealer',
            value: formData.dealerNameCity || '—',
          },
        ]}
      />

      {/* 3. Banking & Identity */}
      <LoanReviewSection
        title="Banking & Driving Credentials"
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
            value: formData.bankName || '—',
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
            label: 'PAN Number',
            value: formData.panNumber || '—',
          },
          {
            label: 'Driving License',
            value: formData.drivingLicenseNumber || '—',
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
      <div className="vehicle-loan-review__declaration">
        <input
          id="vehicle-loan-terms-checkbox"
          type="checkbox"
          className="vehicle-loan-review__checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
        />
        <label htmlFor="vehicle-loan-terms-checkbox" className="vehicle-loan-review__label">
          I confirm that the proforma quotation and applicant credentials submitted are authentic, and I agree to the{' '}
          <span className="vehicle-loan-review__terms-link">Terms &amp; Conditions</span> for Vehicle Loan auto-finance.
        </label>
      </div>
    </div>
  )
}

export default ReviewAndSubmit
