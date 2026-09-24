import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { MachineryLoanData } from '../../types/machineryLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: MachineryLoanData
  updateFormData: (fields: Partial<MachineryLoanData>) => void
}

const TOP_BANKS = [
  'HDFC Bank',
  'State Bank of India (SBI)',
  'ICICI Bank',
  'Bank of Baroda',
  'Axis Bank',
  'Canara Bank',
  'Punjab National Bank',
  'Small Industries Development Bank of India (SIDBI)',
  'Other Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="machinery-loan-banking">
      {/* 1. Operating Current Account */}
      <LoanFormSection
        title="Primary Operating Bank Account"
        subtitle="Current account used for vendor settlements & plant operations"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="machinery-loan-banking__grid">
          <div className="machinery-loan-banking__input-group">
            <label className="machinery-loan-banking__label">Primary Bank Name</label>
            <select
              className="machinery-loan-banking__select"
              value={formData.primaryCurrentBank}
              onChange={(e) => updateFormData({ primaryCurrentBank: e.target.value })}
            >
              <option value="">Select Bank</option>
              {TOP_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="machinery-loan-banking__input-group">
            <label className="machinery-loan-banking__label">Current Account Number</label>
            <input
              type="text"
              className="machinery-loan-banking__input"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData({ accountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="machinery-loan-banking__input-group">
            <label className="machinery-loan-banking__label">Branch IFSC Code</label>
            <input
              type="text"
              className="machinery-loan-banking__input"
              placeholder="e.g. HDFC0001234"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="machinery-loan-banking__input-group">
            <label className="machinery-loan-banking__label">GSTIN of Operating Plant</label>
            <input
              type="text"
              className="machinery-loan-banking__input"
              placeholder="e.g. 29AABCP1429F1Z2"
              maxLength={15}
              value={formData.gstin}
              onChange={(e) => updateFormData({ gstin: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="machinery-loan-banking__input-group" style={{ gridColumn: 'span 2' }}>
            <label className="machinery-loan-banking__label">Company / Firm PAN Number</label>
            <input
              type="text"
              className="machinery-loan-banking__input"
              placeholder="e.g. AABCP1429F"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
