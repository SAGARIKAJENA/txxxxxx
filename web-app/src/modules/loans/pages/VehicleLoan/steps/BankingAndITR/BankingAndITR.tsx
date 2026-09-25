import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { VehicleLoanData } from '../../types/vehicleLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: VehicleLoanData
  updateFormData: (fields: Partial<VehicleLoanData>) => void
}

const TOP_BANKS = [
  'HDFC Bank',
  'State Bank of India (SBI)',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Bank of Baroda',
  'IndusInd Bank',
  'Canara Bank',
  'Other Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="vehicle-loan-banking">
      {/* 1. Operating Account */}
      <LoanFormSection
        title="Primary Bank Account"
        subtitle="Account from which auto-debit NACH / e-mandate EMIs will be deducted"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="vehicle-loan-banking__grid">
          <div className="vehicle-loan-banking__input-group">
            <label className="vehicle-loan-banking__label">Bank Name</label>
            <select
              className="vehicle-loan-banking__select"
              value={formData.bankName}
              onChange={(e) => updateFormData({ bankName: e.target.value })}
            >
              <option value="">Select Bank</option>
              {TOP_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="vehicle-loan-banking__input-group">
            <label className="vehicle-loan-banking__label">Bank Account Number</label>
            <input
              type="text"
              className="vehicle-loan-banking__input"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData({ accountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="vehicle-loan-banking__input-group">
            <label className="vehicle-loan-banking__label">IFSC Code</label>
            <input
              type="text"
              className="vehicle-loan-banking__input"
              placeholder="e.g. HDFC0001234"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="vehicle-loan-banking__input-group">
            <label className="vehicle-loan-banking__label">PAN Card Number</label>
            <input
              type="text"
              className="vehicle-loan-banking__input"
              placeholder="e.g. ABCDE1234F"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="vehicle-loan-banking__input-group" style={{ gridColumn: 'span 2' }}>
            <label className="vehicle-loan-banking__label">Driving License Number</label>
            <input
              type="text"
              className="vehicle-loan-banking__input"
              placeholder="e.g. KA01 20180012345"
              value={formData.drivingLicenseNumber}
              onChange={(e) => updateFormData({ drivingLicenseNumber: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
