import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { PropertyLoanData, PropertyType } from '../../types/propertyLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: PropertyLoanData
  updateFormData: (fields: Partial<PropertyLoanData>) => void
}

const PRESET_AMOUNTS = [2500000, 5000000, 10000000, 20000000, 50000000]

const PROPERTY_TYPES: PropertyType[] = [
  'Residential House / Villa',
  'Residential Apartment / Flat',
  'Commercial Office Space',
  'Commercial Retail Shop',
  'Industrial Plot / Shed',
]

const TENURE_OPTIONS = [5, 10, 15, 20]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="property-loan-requirements">
      {/* 1. Loan Amount */}
      <LoanFormSection
        title="Loan Against Property (LAP) Limit"
        subtitle="Uncapped high-value funding against mortgaged residential or commercial property"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="property-loan-requirements__amount-pills">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`property-loan-requirements__pill-btn ${
                formData.loanAmount === amt ? 'property-loan-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ loanAmount: amt })}
            >
              {amt >= 10000000 ? `₹${(amt / 10000000).toFixed(0)} Crore` : `₹${(amt / 100000).toFixed(0)} Lakhs`}
            </button>
          ))}
        </div>

        <div className="property-loan-requirements__slider-wrap">
          <input
            type="range"
            min="1000000"
            max="50000000"
            step="500000"
            value={formData.loanAmount}
            onChange={(e) => updateFormData({ loanAmount: Number(e.target.value) })}
            className="property-loan-requirements__slider"
          />
          <div className="property-loan-requirements__slider-labels">
            <span>Min ₹10 Lakhs</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.loanAmount.toLocaleString('en-IN')}
            </span>
            <span>Max ₹5 Crores+</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Mortgaged Property Details */}
      <LoanFormSection
        title="Mortgaged Property Details"
        subtitle="Collateral property specifications and approximate market assessment"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
      >
        <div className="property-loan-requirements__grid">
          <div className="property-loan-requirements__input-group">
            <label className="property-loan-requirements__label">Property Type</label>
            <select
              className="property-loan-requirements__select"
              value={formData.propertyType}
              onChange={(e) => updateFormData({ propertyType: e.target.value as PropertyType })}
            >
              <option value="">Select Property Type</option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>

          <div className="property-loan-requirements__input-group">
            <label className="property-loan-requirements__label">Estimated Market Value (₹)</label>
            <input
              type="text"
              className="property-loan-requirements__input"
              placeholder="e.g. 1,50,00,000"
              value={formData.estimatedMarketValue}
              onChange={(e) => updateFormData({ estimatedMarketValue: e.target.value })}
            />
          </div>

          <div className="property-loan-requirements__input-group" style={{ gridColumn: 'span 2' }}>
            <label className="property-loan-requirements__label">Property City &amp; Locality</label>
            <input
              type="text"
              className="property-loan-requirements__input"
              placeholder="e.g. Indiranagar, Bengaluru, Karnataka"
              value={formData.propertyLocationCity}
              onChange={(e) => updateFormData({ propertyLocationCity: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 3. Repayment Tenure */}
      <LoanFormSection
        title="Repayment Tenure"
        subtitle="Select long-term repayment horizon in years"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="property-loan-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`property-loan-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'property-loan-requirements__tenure-card--active' : ''
              }`}
              onClick={() => updateFormData({ repaymentTenureYears: yrs })}
            >
              <div style={{ fontSize: '1.125rem' }}>{yrs} Years</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{yrs * 12} Months</div>
            </div>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default Requirements
