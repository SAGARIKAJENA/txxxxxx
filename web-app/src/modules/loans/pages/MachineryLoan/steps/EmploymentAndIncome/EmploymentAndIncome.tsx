import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { MachineryLoanData } from '../../types/machineryLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: MachineryLoanData
  updateFormData: (fields: Partial<MachineryLoanData>) => void
}

const TURNOVER_RANGES = [
  '₹50 Lakhs - ₹2 Crores',
  '₹2 Crores - ₹5 Crores',
  '₹5 Crores - ₹20 Crores',
  '₹20 Crores - ₹50 Crores',
  '₹50 Crores+',
]

const VINTAGE_OPTIONS = [
  '1 to 3 Years',
  '3 to 5 Years',
  '5 to 10 Years',
  '10+ Years',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="machinery-loan-factory">
      {/* 1. Manufacturing Facility & Operations */}
      <LoanFormSection
        title="Manufacturing Facility & Operational Profile"
        subtitle="Industrial site where machinery will be installed and commissioned"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="machinery-loan-factory__grid">
          <div className="machinery-loan-factory__input-group">
            <label className="machinery-loan-factory__label">Enterprise / Company Name</label>
            <input
              type="text"
              className="machinery-loan-factory__input"
              placeholder="e.g. Paramount Precision Castings Pvt Ltd"
              value={formData.enterpriseName}
              onChange={(e) => updateFormData({ enterpriseName: e.target.value })}
            />
          </div>

          <div className="machinery-loan-factory__input-group">
            <label className="machinery-loan-factory__label">Years in Manufacturing (Vintage)</label>
            <select
              className="machinery-loan-factory__select"
              value={formData.yearsInOperation}
              onChange={(e) => updateFormData({ yearsInOperation: e.target.value })}
            >
              <option value="">Select Operational Track Record</option>
              {VINTAGE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="machinery-loan-factory__input-group">
            <label className="machinery-loan-factory__label">Annual Gross Turnover</label>
            <select
              className="machinery-loan-factory__select"
              value={formData.annualTurnover}
              onChange={(e) => updateFormData({ annualTurnover: e.target.value })}
            >
              <option value="">Select Turnover Range</option>
              {TURNOVER_RANGES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="machinery-loan-factory__input-group">
            <label className="machinery-loan-factory__label">Factory / Industrial Shed City &amp; State</label>
            <input
              type="text"
              className="machinery-loan-factory__input"
              placeholder="e.g. Peenya Industrial Area, Bengaluru, Karnataka"
              value={formData.factoryUnitLocation}
              onChange={(e) => updateFormData({ factoryUnitLocation: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
