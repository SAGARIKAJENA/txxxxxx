import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { MachineryLoanData, MachineryIndustryType } from '../../types/machineryLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: MachineryLoanData
  updateFormData: (fields: Partial<MachineryLoanData>) => void
}

const MACHINERY_SECTORS: MachineryIndustryType[] = [
  'Manufacturing & CNC Engineering',
  'Textile & Garment Processing',
  'Printing & Packaging Machinery',
  'Medical & Diagnostic Equipment',
  'Food Processing & Cold Storage',
  'Construction & Earthmoving Plant',
]

const PRESET_AMOUNTS = [1000000, 2500000, 5000000, 10000000, 25000000]

const TENURE_OPTIONS = [2, 3, 4, 5, 6, 7]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="machinery-loan-requirements">
      {/* 1. Machinery Information */}
      <LoanFormSection
        title="Machinery & Plant Specifications"
        subtitle="Provide technical and commercial equipment procurement details"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="m4.93 4.93 2.83 2.83" />
            <path d="m16.24 16.24 2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      >
        <div className="machinery-loan-requirements__grid">
          <div className="machinery-loan-requirements__input-group">
            <label className="machinery-loan-requirements__label">Machinery Sector</label>
            <select
              className="machinery-loan-requirements__select"
              value={formData.machineryType}
              onChange={(e) => updateFormData({ machineryType: e.target.value as MachineryIndustryType })}
            >
              <option value="">Select Industry / Equipment Sector</option>
              {MACHINERY_SECTORS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="machinery-loan-requirements__input-group">
            <label className="machinery-loan-requirements__label">Machine Make &amp; Model</label>
            <input
              type="text"
              className="machinery-loan-requirements__input"
              placeholder="e.g. Haas 5-Axis CNC Milling Center VF-2"
              value={formData.machineNameModel}
              onChange={(e) => updateFormData({ machineNameModel: e.target.value })}
            />
          </div>

          <div className="machinery-loan-requirements__input-group">
            <label className="machinery-loan-requirements__label">Supplier / OEM Manufacturer</label>
            <input
              type="text"
              className="machinery-loan-requirements__input"
              placeholder="e.g. Haas Automation India Pvt Ltd"
              value={formData.supplierManufacturerName}
              onChange={(e) => updateFormData({ supplierManufacturerName: e.target.value })}
            />
          </div>

          <div className="machinery-loan-requirements__input-group">
            <label className="machinery-loan-requirements__label">Total Equipment Cost (₹)</label>
            <input
              type="text"
              className="machinery-loan-requirements__input"
              placeholder="e.g. 65,00,000"
              value={formData.totalEquipmentCost}
              onChange={(e) => updateFormData({ totalEquipmentCost: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Loan Amount */}
      <LoanFormSection
        title="Required Term Loan Funding"
        subtitle="Up to 85% equipment finance with competitive asset depreciation tenures"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="machinery-loan-requirements__amount-pills">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`machinery-loan-requirements__pill-btn ${
                formData.loanAmount === amt ? 'machinery-loan-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ loanAmount: amt })}
            >
              {amt >= 10000000 ? `₹${(amt / 10000000).toFixed(0)} Crore` : `₹${(amt / 100000).toFixed(0)} Lakhs`}
            </button>
          ))}
        </div>

        <div className="machinery-loan-requirements__slider-wrap">
          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={formData.loanAmount}
            onChange={(e) => updateFormData({ loanAmount: Number(e.target.value) })}
            className="machinery-loan-requirements__slider"
          />
          <div className="machinery-loan-requirements__slider-labels">
            <span>Min ₹5 Lakhs</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.loanAmount.toLocaleString('en-IN')}
            </span>
            <span>Max ₹5 Crores+</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 3. Repayment Tenure */}
      <LoanFormSection
        title="Equipment Repayment Tenure"
        subtitle="Select loan tenure aligned with machine economic life"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="machinery-loan-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`machinery-loan-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'machinery-loan-requirements__tenure-card--active' : ''
              }`}
              onClick={() => updateFormData({ repaymentTenureYears: yrs })}
            >
              <div style={{ fontSize: '1.125rem' }}>{yrs} Y</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{yrs * 12}M</div>
            </div>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default Requirements
