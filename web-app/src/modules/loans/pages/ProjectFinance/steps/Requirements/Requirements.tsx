import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { ProjectFinanceData, ProjectSectorType } from '../../types/projectFinance.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: ProjectFinanceData
  updateFormData: (fields: Partial<ProjectFinanceData>) => void
}

const SECTORS: ProjectSectorType[] = [
  'Infrastructure & Roads',
  'Renewable Energy / Solar Power',
  'Commercial Real Estate Development',
  'Industrial Plant / Factory Setup',
  'Hospitality & Healthcare Projects',
  'Logistics & Warehousing Parks',
]

const PRESET_DEBT = [20000000, 50000000, 100000000, 250000000, 500000000]

const TENURE_OPTIONS = [7, 10, 15, 20]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="project-finance-requirements">
      {/* 1. Project Specifications */}
      <LoanFormSection
        title="Project & Capital Expenditure"
        subtitle="Capex requirements for long-term industrial or infrastructure initiatives"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" strokeDasharray="3 3" />
            <path d="m9 15 3-6 3 6" />
            <path d="M10 13h4" />
          </svg>
        }
      >
        <div className="project-finance-requirements__grid">
          <div className="project-finance-requirements__input-group">
            <label className="project-finance-requirements__label">Project Sector</label>
            <select
              className="project-finance-requirements__select"
              value={formData.projectSector}
              onChange={(e) => updateFormData({ projectSector: e.target.value as ProjectSectorType })}
            >
              <option value="">Select Project Sector</option>
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="project-finance-requirements__input-group">
            <label className="project-finance-requirements__label">Project Title / Name</label>
            <input
              type="text"
              className="project-finance-requirements__input"
              placeholder="e.g. 50MW Solar Photovoltaic Plant, Pavagada"
              value={formData.projectName}
              onChange={(e) => updateFormData({ projectName: e.target.value })}
            />
          </div>

          <div className="project-finance-requirements__input-group">
            <label className="project-finance-requirements__label">Total Project Outlay (₹)</label>
            <input
              type="text"
              className="project-finance-requirements__input"
              placeholder="e.g. 60,00,00,000"
              value={formData.totalProjectCost}
              onChange={(e) => updateFormData({ totalProjectCost: e.target.value })}
            />
          </div>

          <div className="project-finance-requirements__input-group">
            <label className="project-finance-requirements__label">Promoter Equity Contribution (%)</label>
            <input
              type="text"
              className="project-finance-requirements__input"
              placeholder="e.g. 30% Equity / 70% Debt"
              value={formData.promoterEquityContribution}
              onChange={(e) => updateFormData({ promoterEquityContribution: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Debt Sought */}
      <LoanFormSection
        title="Term Debt Sought"
        subtitle="Long-term project debt syndication through PSU / private bank consortium"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="project-finance-requirements__amount-pills">
          {PRESET_DEBT.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`project-finance-requirements__pill-btn ${
                formData.debtSoughtAmount === amt ? 'project-finance-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ debtSoughtAmount: amt })}
            >
              ₹{(amt / 10000000).toFixed(0)} Crores
            </button>
          ))}
        </div>

        <div className="project-finance-requirements__slider-wrap">
          <input
            type="range"
            min="10000000"
            max="1000000000"
            step="10000000"
            value={formData.debtSoughtAmount}
            onChange={(e) => updateFormData({ debtSoughtAmount: Number(e.target.value) })}
            className="project-finance-requirements__slider"
          />
          <div className="project-finance-requirements__slider-labels">
            <span>Min ₹1 Crore</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected Debt: ₹{(formData.debtSoughtAmount / 10000000).toFixed(1)} Crores
            </span>
            <span>Max ₹100 Crores</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 3. Repayment Horizon */}
      <LoanFormSection
        title="Project Debt Amortisation"
        subtitle="Tenure inclusive of construction grace period / moratorium"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="project-finance-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`project-finance-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'project-finance-requirements__tenure-card--active' : ''
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
