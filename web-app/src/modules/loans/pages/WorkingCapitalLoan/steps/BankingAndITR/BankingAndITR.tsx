import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { WorkingCapitalLoanData } from '../../types/workingCapitalLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: WorkingCapitalLoanData
  updateFormData: (fields: Partial<WorkingCapitalLoanData>) => void
}

const CONSORTIUM_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'Bank of Baroda',
  'Punjab National Bank',
  'ICICI Bank',
  'Canara Bank',
  'Union Bank of India',
  'Axis Bank',
  'Other Scheduled Commercial Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="working-capital-banking">
      {/* 1. Consortium / Operational Banking */}
      <LoanFormSection
        title="Primary Consortium & Current Banking"
        subtitle="Where cash credit or current operations are primarily cleared"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="working-capital-banking__grid">
          <div className="working-capital-banking__input-group">
            <label className="working-capital-banking__label">Primary Banking Partner</label>
            <select
              className="working-capital-banking__select"
              value={formData.primaryConsortiumBank}
              onChange={(e) => updateFormData({ primaryConsortiumBank: e.target.value })}
            >
              <option value="">Select Bank</option>
              {CONSORTIUM_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="working-capital-banking__input-group">
            <label className="working-capital-banking__label">Operational Account Number</label>
            <input
              type="text"
              className="working-capital-banking__input"
              placeholder="Enter Account Number"
              value={formData.currentAccountNumber}
              onChange={(e) => updateFormData({ currentAccountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="working-capital-banking__input-group">
            <label className="working-capital-banking__label">Branch IFSC Code</label>
            <input
              type="text"
              className="working-capital-banking__input"
              placeholder="e.g. SBIN0000843"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="working-capital-banking__input-group">
            <label className="working-capital-banking__label">GSTIN of Operating Unit</label>
            <input
              type="text"
              className="working-capital-banking__input"
              placeholder="e.g. 29AABCS1429F1Z2"
              maxLength={15}
              value={formData.gstin}
              onChange={(e) => updateFormData({ gstin: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="working-capital-banking__input-group" style={{ gridColumn: 'span 2' }}>
            <label className="working-capital-banking__label">Enterprise PAN</label>
            <input
              type="text"
              className="working-capital-banking__input"
              placeholder="e.g. AABCS1429F"
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
