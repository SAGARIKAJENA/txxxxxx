import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { WorkingCapitalLoanData } from '../../types/workingCapitalLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: WorkingCapitalLoanData
  updateFormData: (fields: Partial<WorkingCapitalLoanData>) => void
}

const REVENUE_RANGES = [
  '₹1 Crore - ₹5 Crores',
  '₹5 Crores - ₹15 Crores',
  '₹15 Crores - ₹50 Crores',
  '₹50 Crores - ₹100 Crores',
  '₹100 Crores+',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="working-capital-profile">
      {/* 1. Enterprise Profile & Financials */}
      <LoanFormSection
        title="Commercial Enterprise Profile"
        subtitle="Business operational figures used for calculating Drawing Power (DP)"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="working-capital-profile__grid">
          <div className="working-capital-profile__input-group">
            <label className="working-capital-profile__label">Registered Firm / Company Name</label>
            <input
              type="text"
              className="working-capital-profile__input"
              placeholder="e.g. Zenith Global Logistics Ltd"
              value={formData.businessName}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
            />
          </div>

          <div className="working-capital-profile__input-group">
            <label className="working-capital-profile__label">Annual Sales Turnover</label>
            <select
              className="working-capital-profile__select"
              value={formData.currentAnnualRevenue}
              onChange={(e) => updateFormData({ currentAnnualRevenue: e.target.value })}
            >
              <option value="">Select Annual Revenue Bracket</option>
              {REVENUE_RANGES.map((rng) => (
                <option key={rng} value={rng}>{rng}</option>
              ))}
            </select>
          </div>

          <div className="working-capital-profile__input-group">
            <label className="working-capital-profile__label">Average Stock / Inventory Value (₹)</label>
            <input
              type="text"
              className="working-capital-profile__input"
              placeholder="e.g. 85,00,000"
              value={formData.estimatedStockValue}
              onChange={(e) => updateFormData({ estimatedStockValue: e.target.value })}
            />
          </div>

          <div className="working-capital-profile__input-group">
            <label className="working-capital-profile__label">Sundry Debtors / Receivables (₹)</label>
            <input
              type="text"
              className="working-capital-profile__input"
              placeholder="e.g. 1,20,00,000"
              value={formData.estimatedDebtorsValue}
              onChange={(e) => updateFormData({ estimatedDebtorsValue: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
