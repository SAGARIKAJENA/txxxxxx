import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { MsmeLoanData } from '../../types/msmeLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: MsmeLoanData
  updateFormData: (fields: Partial<MsmeLoanData>) => void
}

const ACTIVITIES: MsmeLoanData['businessActivity'][] = [
  'Manufacturing',
  'Service Provider',
  'Trading',
]

const TURNOVER_RANGES = [
  'Up to ₹50 Lakhs (Micro)',
  '₹50 Lakhs - ₹5 Crores (Micro/Small)',
  '₹5 Crores - ₹25 Crores (Small)',
  '₹25 Crores - ₹100 Crores (Medium)',
  '₹100 Crores - ₹250 Crores (Medium)',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="msme-loan-business">
      {/* 1. MSME Operational Details */}
      <LoanFormSection
        title="Enterprise Activity & Scale"
        subtitle="Operational nature of enterprise as recognized under the MSMED Act"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="msme-loan-business__grid">
          <div className="msme-loan-business__input-group">
            <label className="msme-loan-business__label">Registered Unit / Enterprise Name</label>
            <input
              type="text"
              className="msme-loan-business__input"
              placeholder="e.g. Kaveri Agro Processors"
              value={formData.enterpriseName}
              onChange={(e) => updateFormData({ enterpriseName: e.target.value })}
            />
          </div>

          <div className="msme-loan-business__input-group">
            <label className="msme-loan-business__label">Major Activity Sector</label>
            <select
              className="msme-loan-business__select"
              value={formData.businessActivity}
              onChange={(e) => updateFormData({ businessActivity: e.target.value as MsmeLoanData['businessActivity'] })}
            >
              <option value="">Select Activity</option>
              {ACTIVITIES.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div className="msme-loan-business__input-group">
            <label className="msme-loan-business__label">Annual Sales Turnover Bracket</label>
            <select
              className="msme-loan-business__select"
              value={formData.annualTurnover}
              onChange={(e) => updateFormData({ annualTurnover: e.target.value })}
            >
              <option value="">Select Turnover</option>
              {TURNOVER_RANGES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="msme-loan-business__input-group">
            <label className="msme-loan-business__label">Number of Employees (Direct Employment)</label>
            <input
              type="text"
              className="msme-loan-business__input"
              placeholder="e.g. 18"
              value={formData.existingEmployeesCount}
              onChange={(e) => updateFormData({ existingEmployeesCount: e.target.value.replace(/\D/g, '') })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
