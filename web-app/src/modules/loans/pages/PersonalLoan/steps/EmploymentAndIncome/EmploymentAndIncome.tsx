import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { PersonalLoanData, PersonalLoanOccupation } from '../../types/personalLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: PersonalLoanData
  updateFormData: (fields: Partial<PersonalLoanData>) => void
}

const OCCUPATION_OPTIONS: { id: PersonalLoanOccupation; label: string; desc: string }[] = [
  { id: 'salaried', label: 'Salaried Professional', desc: 'Working at Private Ltd, MNC, PSU or Govt' },
  { id: 'self-employed-professional', label: 'Doctor / CA / Lawyer', desc: 'Registered licensed professional' },
  { id: 'consultant', label: 'Independent Consultant', desc: 'Freelance or contractual expert' },
]

const SALARY_RANGES = [
  '₹25,000 - ₹40,000',
  '₹40,000 - ₹75,000',
  '₹75,000 - ₹1,50,000',
  '₹1,50,000 - ₹3,00,000',
  '₹3,00,000+',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="personal-loan-employment">
      {/* 1. Employment Nature */}
      <LoanFormSection
        title="Employment Status"
        subtitle="Select your current job classification"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {OCCUPATION_OPTIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => updateFormData({ occupation: occ.id })}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: `1.5px solid ${formData.occupation === occ.id ? '#2563eb' : '#e2e8f0'}`,
                background: formData.occupation === occ.id ? '#f0f7ff' : '#ffffff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600, color: formData.occupation === occ.id ? '#1d4ed8' : '#1e293b' }}>
                {occ.label}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                {occ.desc}
              </div>
            </div>
          ))}
        </div>
      </LoanFormSection>

      {/* 2. Employer & Monthly Income */}
      <LoanFormSection
        title="Income & Workplace Details"
        subtitle="Details about your current monthly remuneration and workplace"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="personal-loan-employment__input-group">
            <label className="personal-loan-employment__label">Company / Employer Name</label>
            <input
              type="text"
              className="personal-loan-employment__input"
              placeholder="e.g. Infosys, TCS, Deloitte"
              value={formData.employerName}
              onChange={(e) => updateFormData({ employerName: e.target.value })}
            />
          </div>

          <div className="personal-loan-employment__input-group">
            <label className="personal-loan-employment__label">Monthly Take-Home Salary</label>
            <select
              className="personal-loan-employment__select"
              value={formData.monthlyTakeHomeSalary}
              onChange={(e) => updateFormData({ monthlyTakeHomeSalary: e.target.value })}
            >
              <option value="">Select Monthly Salary Range</option>
              {SALARY_RANGES.map((rng) => (
                <option key={rng} value={rng}>{rng}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Existing EMIs */}
        <div style={{ marginTop: '1.25rem' }}>
          <label className="personal-loan-employment__label">Do you currently have ongoing loans or EMIs?</label>
          <div className="personal-loan-employment__toggle-row">
            <button
              type="button"
              className={`personal-loan-employment__toggle-btn ${
                formData.hasExistingEmis ? 'personal-loan-employment__toggle-btn--active' : ''
              }`}
              onClick={() => updateFormData({ hasExistingEmis: true })}
            >
              Yes, I pay EMIs
            </button>
            <button
              type="button"
              className={`personal-loan-employment__toggle-btn ${
                !formData.hasExistingEmis ? 'personal-loan-employment__toggle-btn--active' : ''
              }`}
              onClick={() => updateFormData({ hasExistingEmis: false, existingEmiAmount: '' })}
            >
              No other EMIs
            </button>
          </div>

          {formData.hasExistingEmis && (
            <div className="personal-loan-employment__input-group" style={{ marginTop: '0.75rem', maxWidth: '320px' }}>
              <label className="personal-loan-employment__label">Total Monthly EMI Amount (₹)</label>
              <input
                type="number"
                className="personal-loan-employment__input"
                placeholder="e.g. 15000"
                value={formData.existingEmiAmount || ''}
                onChange={(e) => updateFormData({ existingEmiAmount: e.target.value })}
              />
            </div>
          )}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
