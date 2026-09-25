import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { PersonalLoanData, PersonalLoanPurpose } from '../../types/personalLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: PersonalLoanData
  updateFormData: (fields: Partial<PersonalLoanData>) => void
}

const PRESET_AMOUNTS = [100000, 300000, 500000, 1000000, 1500000, 2500000]

const LOAN_PURPOSES: PersonalLoanPurpose[] = [
  'Medical Emergency',
  'Wedding & Family Function',
  'Home Renovation',
  'Higher Education',
  'Travel & Vacation',
  'Debt Consolidation',
  'Other Personal Needs',
]

const TENURE_OPTIONS = [1, 2, 3, 4, 5]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="personal-loan-requirements">
      {/* 1. Loan Amount */}
      <LoanFormSection
        title="Required Loan Amount"
        subtitle="Choose from presets or slide to adjust required personal funds"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="personal-loan-requirements__amount-pills">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`personal-loan-requirements__pill-btn ${
                formData.loanAmount === amt ? 'personal-loan-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ loanAmount: amt })}
            >
              ₹{(amt / 100000).toFixed(amt % 100000 === 0 ? 0 : 1)} Lakh{amt >= 100000 ? 's' : ''}
            </button>
          ))}
        </div>

        <div className="personal-loan-requirements__slider-wrap">
          <input
            type="range"
            min="50000"
            max="2500000"
            step="25000"
            value={formData.loanAmount}
            onChange={(e) => updateFormData({ loanAmount: Number(e.target.value) })}
            className="personal-loan-requirements__slider"
          />
          <div className="personal-loan-requirements__slider-labels">
            <span>Min ₹50,000</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.loanAmount.toLocaleString('en-IN')}
            </span>
            <span>Max ₹25 Lakhs</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Loan Purpose */}
      <LoanFormSection
        title="Purpose of Personal Loan"
        subtitle="Specifying your purpose helps in getting instant customized bank approvals"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 8 8 12 12 16 16 12 12 8" />
          </svg>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {LOAN_PURPOSES.map((purpose) => (
            <button
              key={purpose}
              type="button"
              className={`personal-loan-requirements__pill-btn ${
                formData.loanPurpose === purpose ? 'personal-loan-requirements__pill-btn--active' : ''
              }`}
              style={{ textAlign: 'left', borderRadius: '8px', padding: '0.75rem 1rem' }}
              onClick={() => updateFormData({ loanPurpose: purpose })}
            >
              {purpose}
            </button>
          ))}
        </div>
      </LoanFormSection>

      {/* 3. Repayment Tenure */}
      <LoanFormSection
        title="Repayment Tenure"
        subtitle="Select preferred loan duration in years"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="personal-loan-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`personal-loan-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'personal-loan-requirements__tenure-card--active' : ''
              }`}
              onClick={() => updateFormData({ repaymentTenureYears: yrs })}
            >
              <div style={{ fontSize: '1.125rem' }}>{yrs} Year{yrs > 1 ? 's' : ''}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{yrs * 12} Months</div>
            </div>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default Requirements
