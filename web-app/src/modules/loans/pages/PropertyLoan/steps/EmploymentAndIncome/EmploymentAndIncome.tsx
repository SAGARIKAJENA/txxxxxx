import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { PropertyLoanData } from '../../types/propertyLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: PropertyLoanData
  updateFormData: (fields: Partial<PropertyLoanData>) => void
}

const INCOME_SOURCES: PropertyLoanData['primaryIncomeSource'][] = [
  'Salaried',
  'Business Owner',
  'Professional Practice',
  'Rental & Investment',
]

const MONTHLY_INCOME_RANGES = [
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  '₹10,00,000+',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="property-loan-income">
      {/* 1. Primary Income Source */}
      <LoanFormSection
        title="Income Source & Cash Flow"
        subtitle="Specify applicant cash flow capability for servicing LAP repayments"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="property-loan-income__grid">
          <div className="property-loan-income__input-group">
            <label className="property-loan-income__label">Primary Income Category</label>
            <select
              className="property-loan-income__select"
              value={formData.primaryIncomeSource}
              onChange={(e) => updateFormData({ primaryIncomeSource: e.target.value as PropertyLoanData['primaryIncomeSource'] })}
            >
              <option value="">Select Category</option>
              {INCOME_SOURCES.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          <div className="property-loan-income__input-group">
            <label className="property-loan-income__label">Monthly Household / Business Inflow</label>
            <select
              className="property-loan-income__select"
              value={formData.monthlyHouseholdIncome}
              onChange={(e) => updateFormData({ monthlyHouseholdIncome: e.target.value })}
            >
              <option value="">Select Inflow Bracket</option>
              {MONTHLY_INCOME_RANGES.map((rng) => (
                <option key={rng} value={rng}>{rng}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Existing Property Mortgage / Topup */}
        <div style={{ marginTop: '1.25rem' }}>
          <label className="property-loan-income__label">Is there an active mortgage or home loan on this property?</label>
          <div className="property-loan-income__toggle-row">
            <button
              type="button"
              className={`property-loan-income__toggle-btn ${
                formData.hasExistingPropertyLoan ? 'property-loan-income__toggle-btn--active' : ''
              }`}
              onClick={() => updateFormData({ hasExistingPropertyLoan: true })}
            >
              Yes, active mortgage (Balance Transfer / Top-up)
            </button>
            <button
              type="button"
              className={`property-loan-income__toggle-btn ${
                !formData.hasExistingPropertyLoan ? 'property-loan-income__toggle-btn--active' : ''
              }`}
              onClick={() => updateFormData({ hasExistingPropertyLoan: false, existingLoanAmount: '' })}
            >
              No, unencumbered title
            </button>
          </div>

          {formData.hasExistingPropertyLoan && (
            <div className="property-loan-income__input-group" style={{ marginTop: '0.75rem', maxWidth: '340px' }}>
              <label className="property-loan-income__label">Outstanding Principal Balance (₹)</label>
              <input
                type="text"
                className="property-loan-income__input"
                placeholder="e.g. 35,00,000"
                value={formData.existingLoanAmount || ''}
                onChange={(e) => updateFormData({ existingLoanAmount: e.target.value })}
              />
            </div>
          )}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
