import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { WorkingCapitalLoanData, WorkingCapitalFacility } from '../../types/workingCapitalLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: WorkingCapitalLoanData
  updateFormData: (fields: Partial<WorkingCapitalLoanData>) => void
}

const FACILITIES: WorkingCapitalFacility[] = [
  'Cash Credit (CC) Facility',
  'Overdraft (OD) against Stock/Debtors',
  'Letter of Credit (LC) / Bank Guarantee',
  'Invoice Discounting / Factoring',
  'Combined Fund & Non-Fund Limits',
]

const PRESET_LIMITS = [2500000, 5000000, 10000000, 25000000, 50000000]

const COLLATERAL_OPTIONS = [
  'Hypothecation of Stocks, Raw Materials & Book Debts',
  'Commercial / Industrial Real Estate Mortgage',
  'Residential Property / Director Personal Guarantee',
  'Fixed Deposits / Liquid Securities Lien',
  'CGTMSE Scheme (Collateral-Free up to ₹5 Cr)',
]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="working-capital-requirements">
      {/* 1. Facility Type */}
      <LoanFormSection
        title="Working Capital Credit Facility"
        subtitle="Select the trade or liquidity facility required by your enterprise"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {FACILITIES.map((f) => (
            <button
              key={f}
              type="button"
              className={`working-capital-requirements__pill-btn ${
                formData.facilityType === f ? 'working-capital-requirements__pill-btn--active' : ''
              }`}
              style={{ textAlign: 'left', borderRadius: '8px', padding: '0.75rem 1rem' }}
              onClick={() => updateFormData({ facilityType: f })}
            >
              {f}
            </button>
          ))}
        </div>
      </LoanFormSection>

      {/* 2. Sanction Limit */}
      <LoanFormSection
        title="Requested Credit Limit"
        subtitle="Revolving credit limit renewed annually on operational review"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="working-capital-requirements__amount-pills">
          {PRESET_LIMITS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`working-capital-requirements__pill-btn ${
                formData.requestedLimit === amt ? 'working-capital-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ requestedLimit: amt })}
            >
              {amt >= 10000000 ? `₹${(amt / 10000000).toFixed(0)} Crore` : `₹${(amt / 100000).toFixed(0)} Lakhs`}
            </button>
          ))}
        </div>

        <div className="working-capital-requirements__slider-wrap">
          <input
            type="range"
            min="1000000"
            max="100000000"
            step="1000000"
            value={formData.requestedLimit}
            onChange={(e) => updateFormData({ requestedLimit: Number(e.target.value) })}
            className="working-capital-requirements__slider"
          />
          <div className="working-capital-requirements__slider-labels">
            <span>Min ₹10 Lakhs</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.requestedLimit.toLocaleString('en-IN')}
            </span>
            <span>Max ₹10 Crores+</span>
          </div>
        </div>

        <div className="working-capital-requirements__input-group" style={{ marginTop: '1.25rem' }}>
          <label className="working-capital-requirements__label">Primary Security / Collateral Offered</label>
          <select
            className="working-capital-requirements__select"
            value={formData.primaryCollateralOffered}
            onChange={(e) => updateFormData({ primaryCollateralOffered: e.target.value })}
          >
            <option value="">Select Primary Security</option>
            {COLLATERAL_OPTIONS.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default Requirements
