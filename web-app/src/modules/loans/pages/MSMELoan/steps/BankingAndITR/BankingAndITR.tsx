import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { MsmeLoanData } from '../../types/msmeLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: MsmeLoanData
  updateFormData: (fields: Partial<MsmeLoanData>) => void
}

const MSME_LENDER_BANKS = [
  'State Bank of India (SBI) - MSME Hub',
  'Punjab National Bank (PNB) - MSME Branch',
  'Bank of Baroda - Baroda MSME',
  'Canara Bank - MSME Wing',
  'Union Bank of India',
  'Small Industries Development Bank of India (SIDBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Other Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="msme-loan-banking">
      {/* 1. Operating Current Account */}
      <LoanFormSection
        title="MSME Operating Bank Account"
        subtitle="Where business sales revenue is received and subsidy is credited"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="msme-loan-banking__grid">
          <div className="msme-loan-banking__input-group">
            <label className="msme-loan-banking__label">Primary Bank</label>
            <select
              className="msme-loan-banking__select"
              value={formData.primaryCurrentBank}
              onChange={(e) => updateFormData({ primaryCurrentBank: e.target.value })}
            >
              <option value="">Select Bank</option>
              {MSME_LENDER_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="msme-loan-banking__input-group">
            <label className="msme-loan-banking__label">Bank Account Number</label>
            <input
              type="text"
              className="msme-loan-banking__input"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData({ accountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="msme-loan-banking__input-group">
            <label className="msme-loan-banking__label">Branch IFSC Code</label>
            <input
              type="text"
              className="msme-loan-banking__input"
              placeholder="e.g. SBIN0001842"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="msme-loan-banking__input-group">
            <label className="msme-loan-banking__label">Proprietor / Enterprise PAN</label>
            <input
              type="text"
              className="msme-loan-banking__input"
              placeholder="e.g. AABCK1234F"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="msme-loan-banking__input-group" style={{ gridColumn: 'span 2' }}>
            <label className="msme-loan-banking__label">GSTIN (Optional for Composition/Exempt Units)</label>
            <input
              type="text"
              className="msme-loan-banking__input"
              placeholder="e.g. 29AABCK1234F1Z3"
              maxLength={15}
              value={formData.gstin || ''}
              onChange={(e) => updateFormData({ gstin: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
