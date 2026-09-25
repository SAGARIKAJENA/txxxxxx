import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { VehicleLoanData } from '../../types/vehicleLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: VehicleLoanData
  updateFormData: (fields: Partial<VehicleLoanData>) => void
}

const EMPLOYMENT_TYPES: VehicleLoanData['employmentType'][] = [
  'Salaried',
  'Self Employed',
  'Business / Fleet Operator',
]

const INCOME_RANGES = [
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000+',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="vehicle-loan-employment">
      {/* 1. Employment & Inflow */}
      <LoanFormSection
        title="Income Profile & Dealership"
        subtitle="Employment and dealer quotation details"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="vehicle-loan-employment__grid">
          <div className="vehicle-loan-employment__input-group">
            <label className="vehicle-loan-employment__label">Employment Type</label>
            <select
              className="vehicle-loan-employment__select"
              value={formData.employmentType}
              onChange={(e) => updateFormData({ employmentType: e.target.value as VehicleLoanData['employmentType'] })}
            >
              <option value="">Select Employment Type</option>
              {EMPLOYMENT_TYPES.map((et) => (
                <option key={et} value={et}>{et}</option>
              ))}
            </select>
          </div>

          <div className="vehicle-loan-employment__input-group">
            <label className="vehicle-loan-employment__label">Monthly Net Inflow / Salary</label>
            <select
              className="vehicle-loan-employment__select"
              value={formData.monthlyIncome}
              onChange={(e) => updateFormData({ monthlyIncome: e.target.value })}
            >
              <option value="">Select Income Bracket</option>
              {INCOME_RANGES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="vehicle-loan-employment__input-group" style={{ gridColumn: 'span 2' }}>
            <label className="vehicle-loan-employment__label">Authorized Automobile Dealership Name &amp; City</label>
            <input
              type="text"
              className="vehicle-loan-employment__input"
              placeholder="e.g. Advaith Hyundai, Residency Road, Bengaluru"
              value={formData.dealerNameCity}
              onChange={(e) => updateFormData({ dealerNameCity: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
