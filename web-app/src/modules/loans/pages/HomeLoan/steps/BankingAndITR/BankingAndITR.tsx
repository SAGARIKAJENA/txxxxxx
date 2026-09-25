import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { HomeLoanData } from '../../types/homeLoan.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  data: HomeLoanData
  onChange: (fields: Partial<HomeLoanData>) => void
}

const POPULAR_BANKS = [
  'HDFC Bank',
  'State Bank of India',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
]

const ITR_STATUS_OPTIONS: { id: 'filed' | 'not-filed' | 'exempt'; label: string }[] = [
  { id: 'filed', label: 'Filed' },
  { id: 'not-filed', label: 'Not Filed' },
  { id: 'exempt', label: 'Exempt' },
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({ data, onChange }) => {
  return (
    <div className="home-loan-bank">
      {/* 1. Primary Operating & Disbursement Bank */}
      <LoanFormSection
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
        title="Primary Operating &amp; Disbursement Bank"
        subtitle="Specify the account for loan disbursement and setting up auto-debit EMI repayments."
      >
        <div className="home-loan-form-group">
          <label htmlFor="home-bank-select" className="home-loan-label">
            Bank Name <span className="home-loan-label__req">*</span>
          </label>
          <select
            id="home-bank-select"
            className="home-loan-select"
            value={data.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
          >
            <option value="">Select bank</option>
            {POPULAR_BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="home-loan-grid-2">
          <div className="home-loan-form-group">
            <label htmlFor="home-bank-acc" className="home-loan-label">
              Bank Account Number <span className="home-loan-label__req">*</span>
            </label>
            <input
              id="home-bank-acc"
              type="text"
              className="home-loan-input"
              placeholder="Enter account number"
              value={data.accountNumber}
              onChange={(e) => onChange({ accountNumber: e.target.value })}
            />
          </div>

          <div className="home-loan-form-group">
            <label htmlFor="home-bank-ifsc" className="home-loan-label">
              Bank IFSC Code <span className="home-loan-label__req">*</span>
            </label>
            <input
              id="home-bank-ifsc"
              type="text"
              maxLength={11}
              className="home-loan-input"
              placeholder="Enter 11-digit IFSC code (e.g. SBIN0001234)"
              value={data.ifscCode}
              onChange={(e) => onChange({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </LoanFormSection>

      {/* 2. Income Tax Return (ITR) Compliance */}
      <LoanFormSection
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        }
        title="Income Tax Return (ITR) Compliance"
        subtitle="Select your recent assessment year income tax filing status and declared income."
      >
        <div className="home-loan-form-group">
          <label className="home-loan-label">
            Last Assessment Year Filing Status <span className="home-loan-label__req">*</span>
          </label>
          <div className="home-loan-itr-status-grid">
            {ITR_STATUS_OPTIONS.map((opt) => {
              const isSelected = data.itrStatus === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`home-loan-itr-btn ${isSelected ? 'home-loan-itr-btn--active' : ''}`}
                  onClick={() => onChange({ itrStatus: opt.id })}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {data.itrStatus === 'filed' && (
          <div className="home-loan-grid-2">
            <div className="home-loan-form-group">
              <label htmlFor="home-itr-ack" className="home-loan-label">
                ITR Acknowledgement Number (15 Digits) (Optional)
              </label>
              <input
                id="home-itr-ack"
                type="text"
                maxLength={15}
                className="home-loan-input"
                placeholder="Enter 15-digit ITR acknowledgement number"
                value={data.itrAckNumber || ''}
                onChange={(e) => onChange({ itrAckNumber: e.target.value })}
              />
            </div>

            <div className="home-loan-form-group">
              <label htmlFor="home-itr-income" className="home-loan-label">
                Gross Total Annual Income as per ITR (₹)
              </label>
              <input
                id="home-itr-income"
                type="text"
                className="home-loan-input"
                placeholder="Enter gross total annual income (₹)"
                value={data.annualIncomeAsPerItr || ''}
                onChange={(e) => onChange({ annualIncomeAsPerItr: e.target.value })}
              />
            </div>
          </div>
        )}
      </LoanFormSection>
    </div>
  )
}

export default BankingAndITR
