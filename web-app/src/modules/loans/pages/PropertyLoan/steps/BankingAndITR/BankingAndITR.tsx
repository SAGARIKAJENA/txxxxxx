import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { PropertyLoanData } from '../../types/propertyLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: PropertyLoanData
  updateFormData: (fields: Partial<PropertyLoanData>) => void
}

const TOP_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Bank of Baroda',
  'Punjab National Bank',
  'Kotak Mahindra Bank',
  'Canara Bank',
  'Union Bank of India',
  'Other Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="property-loan-banking">
      {/* 1. Operating Bank */}
      <LoanFormSection
        title="Primary Operating Bank Account"
        subtitle="Where business receipts or primary earnings are transacted"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="property-loan-banking__grid">
          <div className="property-loan-banking__input-group">
            <label className="property-loan-banking__label">Operating Bank</label>
            <select
              className="property-loan-banking__select"
              value={formData.operatingBank}
              onChange={(e) => updateFormData({ operatingBank: e.target.value })}
            >
              <option value="">Select Bank</option>
              {TOP_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="property-loan-banking__input-group">
            <label className="property-loan-banking__label">Account Number</label>
            <input
              type="text"
              className="property-loan-banking__input"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData({ accountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="property-loan-banking__input-group">
            <label className="property-loan-banking__label">Branch IFSC Code</label>
            <input
              type="text"
              className="property-loan-banking__input"
              placeholder="e.g. SBIN0001842"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="property-loan-banking__input-group">
            <label className="property-loan-banking__label">Primary Mortgagor PAN Number</label>
            <input
              type="text"
              className="property-loan-banking__input"
              placeholder="e.g. ABCDE1234F"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Tax Compliance */}
      <LoanFormSection
        title="Income Tax Returns Compliance"
        subtitle="Mandatory for mortgage credit appraisal"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(['filed', 'not-filed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              className="property-loan-banking__input"
              style={{
                padding: '0.625rem 1.5rem',
                cursor: 'pointer',
                borderColor: formData.itrStatus === st ? '#2563eb' : '#cbd5e1',
                background: formData.itrStatus === st ? '#eff6ff' : '#ffffff',
                color: formData.itrStatus === st ? '#1d4ed8' : '#334155',
                fontWeight: formData.itrStatus === st ? 600 : 400,
                textTransform: 'capitalize',
              }}
              onClick={() => updateFormData({ itrStatus: st })}
            >
              {st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
