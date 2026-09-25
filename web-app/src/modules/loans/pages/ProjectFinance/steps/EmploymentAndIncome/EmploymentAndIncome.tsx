import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { ProjectFinanceData } from '../../types/projectFinance.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: ProjectFinanceData
  updateFormData: (fields: Partial<ProjectFinanceData>) => void
}

const NETWORTH_RANGES = [
  '₹10 Crores - ₹25 Crores',
  '₹25 Crores - ₹50 Crores',
  '₹50 Crores - ₹100 Crores',
  '₹100 Crores - ₹500 Crores',
  '₹500 Crores+',
]

const COMPLETED_PROJECTS = [
  'First Major Infrastructure Project',
  '1 - 3 Projects Commissioned',
  '4 - 10 Projects Commissioned',
  '10+ Flagship Projects Commissioned',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="project-finance-sponsor">
      {/* 1. Sponsor & Promoter Credentials */}
      <LoanFormSection
        title="Project Sponsor & Promoter Background"
        subtitle="Institutional track record and net worth backing the special purpose vehicle (SPV)"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="project-finance-sponsor__grid">
          <div className="project-finance-sponsor__input-group">
            <label className="project-finance-sponsor__label">Sponsor / Parent Company Name</label>
            <input
              type="text"
              className="project-finance-sponsor__input"
              placeholder="e.g. Apex Infraholdings Limited"
              value={formData.sponsorEntityName}
              onChange={(e) => updateFormData({ sponsorEntityName: e.target.value })}
            />
          </div>

          <div className="project-finance-sponsor__input-group">
            <label className="project-finance-sponsor__label">Corporate CIN / LLP Identification</label>
            <input
              type="text"
              className="project-finance-sponsor__input"
              placeholder="e.g. L45200KA2015PLC081928"
              value={formData.cinOrLlpNumber}
              onChange={(e) => updateFormData({ cinOrLlpNumber: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="project-finance-sponsor__input-group">
            <label className="project-finance-sponsor__label">Promoter Group Tangible Net Worth</label>
            <select
              className="project-finance-sponsor__select"
              value={formData.promoterGroupNetWorth}
              onChange={(e) => updateFormData({ promoterGroupNetWorth: e.target.value })}
            >
              <option value="">Select Net Worth Range</option>
              {NETWORTH_RANGES.map((rng) => (
                <option key={rng} value={rng}>{rng}</option>
              ))}
            </select>
          </div>

          <div className="project-finance-sponsor__input-group">
            <label className="project-finance-sponsor__label">Prior Projects Execution Experience</label>
            <select
              className="project-finance-sponsor__select"
              value={formData.priorCompletedProjects}
              onChange={(e) => updateFormData({ priorCompletedProjects: e.target.value })}
            >
              <option value="">Select Execution History</option>
              {COMPLETED_PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
