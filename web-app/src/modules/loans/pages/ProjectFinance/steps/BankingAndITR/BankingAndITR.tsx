import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { ProjectFinanceData } from '../../types/projectFinance.types'
import './BankingAndITR.css'

export interface BankingAndITRProps {
  formData: ProjectFinanceData
  updateFormData: (fields: Partial<ProjectFinanceData>) => void
}

const SYNDICATION_BANKS = [
  'State Bank of India (SBI) - Project Finance Division',
  'Power Finance Corporation (PFC) / REC',
  'HDFC Bank - Wholesale Banking Group',
  'ICICI Bank - Project Advisory Group',
  'Bank of Baroda - Infrastructure Desk',
  'Punjab National Bank',
  'Other Financial Institution / NBFC',
]

export const BankingAndITR: React.FC<BankingAndITRProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="project-finance-banking">
      {/* 1. Lead Syndication Bank & Escrow */}
      <LoanFormSection
        title="Lead Syndication & Project Escrow Account"
        subtitle="Nominated lead bank or financial institution for debt underwriting and Trust & Retention Account (TRA)"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="project-finance-banking__grid">
          <div className="project-finance-banking__input-group">
            <label className="project-finance-banking__label">Preferred Lead Lender / Bank</label>
            <select
              className="project-finance-banking__select"
              value={formData.leadBankName}
              onChange={(e) => updateFormData({ leadBankName: e.target.value })}
            >
              <option value="">Select Institution</option>
              {SYNDICATION_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="project-finance-banking__input-group">
            <label className="project-finance-banking__label">Project Escrow / Current Account</label>
            <input
              type="text"
              className="project-finance-banking__input"
              placeholder="Enter Account Number"
              value={formData.currentAccountNumber}
              onChange={(e) => updateFormData({ currentAccountNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div className="project-finance-banking__input-group">
            <label className="project-finance-banking__label">Branch IFSC Code</label>
            <input
              type="text"
              className="project-finance-banking__input"
              placeholder="e.g. SBIN0004130"
              maxLength={11}
              value={formData.ifscCode}
              onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="project-finance-banking__input-group">
            <label className="project-finance-banking__label">Special Purpose Vehicle (SPV) PAN</label>
            <input
              type="text"
              className="project-finance-banking__input"
              placeholder="e.g. AABCS1234F"
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
