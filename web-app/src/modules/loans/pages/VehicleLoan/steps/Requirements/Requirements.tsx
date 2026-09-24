import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { VehicleLoanData, VehicleCategory, VehicleCondition } from '../../types/vehicleLoan.types'
import './Requirements.css'

export interface RequirementsProps {
  formData: VehicleLoanData
  updateFormData: (fields: Partial<VehicleLoanData>) => void
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  'Passenger Car / SUV',
  'Two Wheeler / Bike',
  'Commercial Cargo / Transport',
  'Electric Vehicle (EV)',
  'Construction / Fleet Vehicle',
]

const CONDITIONS: VehicleCondition[] = ['Brand New', 'Pre-Owned / Used']

const PRESET_AMOUNTS = [300000, 600000, 1000000, 1500000, 2500000]

const TENURE_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

export const Requirements: React.FC<RequirementsProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="vehicle-loan-requirements">
      {/* 1. Vehicle Information */}
      <LoanFormSection
        title="Vehicle Specifications"
        subtitle="Provide details of the vehicle you are financing"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="12" x="3" y="4" rx="2" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
            <path d="M7 16h10" />
          </svg>
        }
      >
        <div className="vehicle-loan-requirements__grid">
          <div className="vehicle-loan-requirements__input-group">
            <label className="vehicle-loan-requirements__label">Vehicle Category</label>
            <select
              className="vehicle-loan-requirements__select"
              value={formData.vehicleCategory}
              onChange={(e) => updateFormData({ vehicleCategory: e.target.value as VehicleCategory })}
            >
              <option value="">Select Category</option>
              {VEHICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="vehicle-loan-requirements__input-group">
            <label className="vehicle-loan-requirements__label">Condition</label>
            <select
              className="vehicle-loan-requirements__select"
              value={formData.vehicleCondition}
              onChange={(e) => updateFormData({ vehicleCondition: e.target.value as VehicleCondition })}
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          <div className="vehicle-loan-requirements__input-group">
            <label className="vehicle-loan-requirements__label">Make &amp; Model Variant</label>
            <input
              type="text"
              className="vehicle-loan-requirements__input"
              placeholder="e.g. Hyundai Creta SX (O) Diesel"
              value={formData.vehicleMakeModel}
              onChange={(e) => updateFormData({ vehicleMakeModel: e.target.value })}
            />
          </div>

          <div className="vehicle-loan-requirements__input-group">
            <label className="vehicle-loan-requirements__label">On-Road / Quotation Price (₹)</label>
            <input
              type="text"
              className="vehicle-loan-requirements__input"
              placeholder="e.g. 18,50,000"
              value={formData.onRoadPrice}
              onChange={(e) => updateFormData({ onRoadPrice: e.target.value })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Loan Amount */}
      <LoanFormSection
        title="Required Loan Funding"
        subtitle="Up to 100% on-road funding available from partner banks"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="vehicle-loan-requirements__amount-pills">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`vehicle-loan-requirements__pill-btn ${
                formData.loanAmount === amt ? 'vehicle-loan-requirements__pill-btn--active' : ''
              }`}
              onClick={() => updateFormData({ loanAmount: amt })}
            >
              ₹{(amt / 100000).toFixed(0)} Lakhs
            </button>
          ))}
        </div>

        <div className="vehicle-loan-requirements__slider-wrap">
          <input
            type="range"
            min="50000"
            max="10000000"
            step="50000"
            value={formData.loanAmount}
            onChange={(e) => updateFormData({ loanAmount: Number(e.target.value) })}
            className="vehicle-loan-requirements__slider"
          />
          <div className="vehicle-loan-requirements__slider-labels">
            <span>Min ₹50,000</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              Selected: ₹{formData.loanAmount.toLocaleString('en-IN')}
            </span>
            <span>Max ₹1 Crore</span>
          </div>
        </div>
      </LoanFormSection>

      {/* 3. Repayment Tenure */}
      <LoanFormSection
        title="Repayment Tenure"
        subtitle="Choose loan period in years"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        <div className="vehicle-loan-requirements__tenure-row">
          {TENURE_OPTIONS.map((yrs) => (
            <div
              key={yrs}
              className={`vehicle-loan-requirements__tenure-card ${
                formData.repaymentTenureYears === yrs ? 'vehicle-loan-requirements__tenure-card--active' : ''
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
