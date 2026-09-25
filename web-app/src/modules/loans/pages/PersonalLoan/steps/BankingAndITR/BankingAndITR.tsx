import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { PersonalLoanData } from '../../types/personalLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: PersonalLoanData
  updateFormData: (fields: Partial<PersonalLoanData>) => void
}

const TOP_BANKS = [
  'HDFC Bank',
  'State Bank of India (SBI)',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Bank of Baroda',
  'Punjab National Bank',
  'IndusInd Bank',
  'Federal Bank',
  'Other Bank',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="personal-loan-banking">
      {/* 1. Bank Account Details */}
      <LoanFormSection
        title="Primary Salary Account"
        subtitle="Where your monthly remuneration is credited and loan will be disbursed"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="personal-loan-banking__grid">
          <div className="personal-loan-banking__input-group">
            <label className="personal-loan-banking__label">Salary Bank Name</label>
            <select
              className="personal-loan-banking__select"
              value={formData.salaryBankName}
              onChange={(e) => updateFormData({ salaryBankName: e.target.value })}
            >
              <option value="">Select Bank</option>
              {TOP_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="personal-loan-banking__input-group">
            <label className="personal-loan-banking__label">Bank Account Number</label>
            <input
              type="text"
              className="personal-loan-banking__input"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData({ accountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="personal-loan-banking__input-group">
            <label className="personal-loan-banking__label">Bank IFSC Code</label>
            <input
              type="text"
              className="personal-loan-banking__input"
              placeholder="e.g. HDFC0001234"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="personal-loan-banking__input-group">
            <label className="personal-loan-banking__label">PAN Card Number</label>
            <input
              type="text"
              className="personal-loan-banking__input"
              placeholder="e.g. ABCDE1234F"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. ITR Status */}
      <LoanFormSection
        title="Income Tax Return (ITR)"
        subtitle="ITR filing records speed up sanction without additional guarantor"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(['filed', 'not-filed', 'exempt'] as const).map((status) => (
            <button
              key={status}
              type="button"
              className="personal-loan-banking__input"
              style={{
                padding: '0.625rem 1.25rem',
                cursor: 'pointer',
                borderColor: formData.itrStatus === status ? '#2563eb' : '#cbd5e1',
                background: formData.itrStatus === status ? '#eff6ff' : '#ffffff',
                color: formData.itrStatus === status ? '#1d4ed8' : '#334155',
                fontWeight: formData.itrStatus === status ? 600 : 400,
                textTransform: 'capitalize',
              }}
              onClick={() => updateFormData({ itrStatus: status })}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
