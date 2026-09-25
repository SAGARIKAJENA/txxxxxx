import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { BusinessLoanData } from '../../types/businessLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: BusinessLoanData
  updateFormData: (fields: Partial<BusinessLoanData>) => void
}

const TOP_BANKS = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India (SBI)',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Bank of Baroda',
  'Punjab National Bank',
  'Canara Bank',
  'IndusInd Bank',
  'Other Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="business-loan-banking">
      {/* 1. Operating Current Account */}
      <LoanFormSection
        title="Primary Business Current Account"
        subtitle="Account where operational revenues and sales receipts are credited"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="business-loan-banking__grid">
          <div className="business-loan-banking__input-group">
            <label className="business-loan-banking__label">Primary Bank Name</label>
            <select
              className="business-loan-banking__select"
              value={formData.primaryCurrentBank}
              onChange={(e) => updateFormData({ primaryCurrentBank: e.target.value })}
            >
              <option value="">Select Bank</option>
              {TOP_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="business-loan-banking__input-group">
            <label className="business-loan-banking__label">Current Account Number</label>
            <input
              type="text"
              className="business-loan-banking__input"
              placeholder="Enter Current Account Number"
              value={formData.currentAccountNumber}
              onChange={(e) => updateFormData({ currentAccountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="business-loan-banking__input-group">
            <label className="business-loan-banking__label">Branch IFSC Code</label>
            <input
              type="text"
              className="business-loan-banking__input"
              placeholder="e.g. HDFC0001234"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="business-loan-banking__input-group">
            <label className="business-loan-banking__label">Business PAN Number</label>
            <input
              type="text"
              className="business-loan-banking__input"
              placeholder="e.g. AABCA1234F"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Tax Compliance & Returns */}
      <LoanFormSection
        title="Income Tax Returns Compliance"
        subtitle="Number of consecutive assessment years ITR has been filed for the entity"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(['1 Year', '2 Years', '3+ Years'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              className="business-loan-banking__input"
              style={{
                padding: '0.625rem 1.5rem',
                cursor: 'pointer',
                borderColor: formData.itrFiledYears === opt ? '#2563eb' : '#cbd5e1',
                background: formData.itrFiledYears === opt ? '#eff6ff' : '#ffffff',
                color: formData.itrFiledYears === opt ? '#1d4ed8' : '#334155',
                fontWeight: formData.itrFiledYears === opt ? 600 : 400,
              }}
              onClick={() => updateFormData({ itrFiledYears: opt })}
            >
              {opt} Filed
            </button>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
