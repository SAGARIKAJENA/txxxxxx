import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { BusinessLoanData } from '../../types/businessLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: BusinessLoanData
  updateFormData: (fields: Partial<BusinessLoanData>) => void
}

const PRESET_AMOUNTS = [500000, 1000000, 1500000, 2500000, 3500000, 5000000]

const BUSINESS_PURPOSES = [
  'Business Expansion & Growth',
  'Working Capital & Inventory',
  'Raw Material Procurement',
  'Office / Retail Renovation',
  'Marketing & Market Expansion',
  'Supplier & Vendor Payments',
]

const TENURE_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="business-loan-requirements">
      {/* 1. Loan Amount */}
      <LoanFormSection
        title="Required Business Capital"
        subtitle="Unsecured collateral-free funding from ₹1 Lakh up to ₹50 Lakhs"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="business-loan-requirements__amount-pills">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`business-loan-requirements__pill-btn ${
                formData.loanAmount === amt ? 'business-loan-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ loanAmount: amt })}
            >
              ₹{(amt / 100000).toFixed(0)} Lakhs
            </button>
          ))}
        </div>

        <div className="business-loan-requirements__slider-wrap">
          <input
            type="range"
            min="100000"
            max="5000000"
            step="50000"
            value={formData.loanAmount}
            onChange={(e) => updateFormData({ loanAmount: Number(e.target.value) })}
            className="business-loan-requirements__slider"
          />
          <div className="business-loan-requirements__slider-labels">
            <span>Min ₹1 Lakh</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.loanAmount.toLocaleString('en-IN')}
            </span>
            <span>Max ₹50 Lakhs</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Business Purpose */}
      <LoanFormSection
        title="End-Use Purpose"
        subtitle="Select the primary business purpose for obtaining this unsecured loan"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {BUSINESS_PURPOSES.map((purpose) => (
            <button
              key={purpose}
              type="button"
              className={`business-loan-requirements__pill-btn ${
                formData.businessPurpose === purpose ? 'business-loan-requirements__pill-btn--active' : ''
              }`}
              style={{ textAlign: 'left', borderRadius: '8px', padding: '0.75rem 1rem' }}
              onClick={() => updateFormData({ businessPurpose: purpose })}
            >
              {purpose}
            </button>
          ))}
        </div>
      </LoanFormSection>

      {/* 3. Repayment Tenure */}
      <LoanFormSection
        title="Repayment Tenure"
        subtitle="Select loan tenure in years (custom monthly EMI amortisation)"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="business-loan-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`business-loan-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'business-loan-requirements__tenure-card--active' : ''
              }`}
              onClick={() => updateFormData({ repaymentTenureYears: yrs })}
            >
              <div style={{ fontSize: '1.125rem' }}>{yrs} Y</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{yrs * 12}M</div>
            </div>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default Requirements
