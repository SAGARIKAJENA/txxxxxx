import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { MsmeLoanData, MsmeSchemeType, EnterpriseCategory } from '../../types/msmeLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: MsmeLoanData
  updateFormData: (fields: Partial<MsmeLoanData>) => void
}

const SCHEMES: MsmeSchemeType[] = [
  'CGTMSE Collateral-Free Scheme (up to ₹5 Cr)',
  'Pradhan Mantri MUDRA Yojana (Tarun / Kishore)',
  'Credit Linked Capital Subsidy (CLCSS)',
  'PM Employment Generation Programme (PMEGP)',
  'Stand-Up India Scheme (SC/ST/Women Entrepreneurs)',
]

const CATEGORIES: EnterpriseCategory[] = [
  'Micro Enterprise',
  'Small Enterprise',
  'Medium Enterprise',
]

const PRESET_AMOUNTS = [1000000, 2500000, 5000000, 10000000, 20000000, 50000000]

const TENURE_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="msme-loan-requirements">
      {/* 1. Government Scheme Selection */}
      <LoanFormSection
        title="MSME Scheme & Government Subsidy"
        subtitle="Select from active central and state subsidized MSME credit guarantee programs"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {SCHEMES.map((sch) => (
            <button
              key={sch}
              type="button"
              className={`msme-loan-requirements__pill-btn ${
                formData.schemeType === sch ? 'msme-loan-requirements__pill-btn--active' : ''
              }`}
              style={{ textAlign: 'left', borderRadius: '8px', padding: '0.75rem 1rem' }}
              onClick={() => updateFormData({ schemeType: sch })}
            >
              {sch}
            </button>
          ))}
        </div>
      </LoanFormSection>

      {/* 2. Enterprise Category & Udyam */}
      <LoanFormSection
        title="Enterprise Classification & Udyam Identity"
        subtitle="Details registered with the Ministry of Micro, Small and Medium Enterprises"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="msme-loan-requirements__grid">
          <div className="msme-loan-requirements__input-group">
            <label className="msme-loan-requirements__label">Enterprise Classification</label>
            <select
              className="msme-loan-requirements__select"
              value={formData.enterpriseCategory}
              onChange={(e) => updateFormData({ enterpriseCategory: e.target.value as EnterpriseCategory })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="msme-loan-requirements__input-group">
            <label className="msme-loan-requirements__label">Udyam Registration Number (URN)</label>
            <input
              type="text"
              className="msme-loan-requirements__input"
              placeholder="e.g. UDYAM-KR-03-0012345"
              value={formData.udyamRegistrationNumber}
              onChange={(e) => updateFormData({ udyamRegistrationNumber: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 3. Loan Amount */}
      <LoanFormSection
        title="Subsidized Financing Amount"
        subtitle="Funding up to ₹5 Crores with subsidized interest rates and CGTMSE guarantee cover"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="msme-loan-requirements__amount-pills">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`msme-loan-requirements__pill-btn ${
                formData.loanAmount === amt ? 'msme-loan-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ loanAmount: amt })}
            >
              {amt >= 10000000 ? `₹${(amt / 10000000).toFixed(0)} Crore` : `₹${(amt / 100000).toFixed(0)} Lakhs`}
            </button>
          ))}
        </div>

        <div className="msme-loan-requirements__slider-wrap">
          <input
            type="range"
            min="100000"
            max="50000000"
            step="500000"
            value={formData.loanAmount}
            onChange={(e) => updateFormData({ loanAmount: Number(e.target.value) })}
            className="msme-loan-requirements__slider"
          />
          <div className="msme-loan-requirements__slider-labels">
            <span>Min ₹1 Lakh</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.loanAmount.toLocaleString('en-IN')}
            </span>
            <span>Max ₹5 Crores</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 4. Tenure */}
      <LoanFormSection
        title="Repayment Tenure"
        subtitle="Repayment period with flexible interest subvention benefits"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="msme-loan-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`msme-loan-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'msme-loan-requirements__tenure-card--active' : ''
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
