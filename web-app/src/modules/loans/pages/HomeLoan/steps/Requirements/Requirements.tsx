import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { HomeLoanData } from '../../types/homeLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  data: HomeLoanData
  onChange: (fields: Partial<HomeLoanData>) => void
}

const AMOUNT_PRESETS = [
  { label: '₹25 Lakhs', value: 2500000 },
  { label: '₹50 Lakhs', value: 5000000 },
  { label: '₹75 Lakhs', value: 7500000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹2 Crores', value: 20000000 },
]

const PROPERTY_INTENTS = [
  'Purchase Ready-to-Move Property',
  'Under-Construction Property',
  'Plot Purchase + Construction',
  'Home Renovation / Extension',
  'Balance Transfer & Top-up',
  'Others',
]

const TENURE_PRESETS = [
  { label: '10 Yrs (120 M)', value: 10 },
  { label: '15 Yrs (180 M)', value: 15 },
  { label: '20 Yrs (240 M)', value: 20 },
  { label: '25 Yrs (300 M)', value: 25 },
  { label: '30 Yrs (360 M)', value: 30 },
]

export const Requirements: React.FC<RequirementsProps> = ({ data, onChange }) => {
  return (
    <div className="home-loan-requirements">
      {/* 1. Required Home Loan Amount */}
      <LoanFormSection
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
        }
        title="Required Home Loan Amount"
        subtitle="Enter your required loan amount or select one of the quick presets below."
      >
        <div className="home-loan-form-group">
          <label htmlFor="req-amount-select" className="home-loan-label">
            Loan Amount (₹) <span className="home-loan-label__req">*</span>
          </label>
          <select
            id="req-amount-select"
            className="home-loan-select"
            value={data.loanAmount}
            onChange={(e) => onChange({ loanAmount: Number(e.target.value) })}
          >
            {AMOUNT_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                ₹{p.value.toLocaleString('en-IN')} ({p.label})
              </option>
            ))}
          </select>
        </div>

        <div className="home-loan-pill-grid">
          {AMOUNT_PRESETS.map((preset) => {
            const isSelected = data.loanAmount === preset.value
            return (
              <button
                key={preset.value}
                type="button"
                className={`home-loan-pill ${isSelected ? 'home-loan-pill--active' : ''}`}
                onClick={() => onChange({ loanAmount: preset.value })}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      </LoanFormSection>

      {/* 2. Property Intent / Purpose */}
      <LoanFormSection
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
        title="Property Intent / Purpose"
        subtitle="Select the housing requirement. Select 'Others' if your specific property purpose is not listed."
      >
        <div className="home-loan-form-group">
          <label htmlFor="req-intent-select" className="home-loan-label">
            Select Intent / Purpose <span className="home-loan-label__req">*</span>
          </label>
          <select
            id="req-intent-select"
            className="home-loan-select"
            value={data.propertyIntent}
            onChange={(e) => onChange({ propertyIntent: e.target.value })}
          >
            {PROPERTY_INTENTS.map((intent) => (
              <option key={intent} value={intent}>
                {intent}
              </option>
            ))}
          </select>
        </div>
      </LoanFormSection>

      {/* 3. Repayment Tenure */}
      <LoanFormSection
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
        title="Repayment Tenure"
        subtitle="Select your intended loan tenure. Longer tenure lowers monthly EMI burden."
      >
        <div className="home-loan-pill-grid">
          {TENURE_PRESETS.map((t) => {
            const isSelected = data.repaymentTenureYears === t.value
            return (
              <button
                key={t.value}
                type="button"
                className={`home-loan-pill ${isSelected ? 'home-loan-pill--active' : ''}`}
                onClick={() => onChange({ repaymentTenureYears: t.value })}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default Requirements
