import React from 'react'
import { LoanFormSection } from '../../../../components/LoanFormSection/LoanFormSection'
import type { BusinessLoanData, BusinessConstitution } from '../../types/businessLoan.types'
import './EmploymentAndIncome.css'

export interface EmploymentAndIncomeProps {
  formData: BusinessLoanData
  updateFormData: (fields: Partial<BusinessLoanData>) => void
}

const CONSTITUTIONS: BusinessConstitution[] = [
  'Proprietorship',
  'Partnership Firm',
  'Private Limited Company',
  'Limited Liability Partnership (LLP)',
  'One Person Company (OPC)',
]

const VINTAGE_OPTIONS = [
  'Less than 1 Year',
  '1 to 3 Years',
  '3 to 5 Years',
  '5+ Years',
]

const TURNOVER_RANGES = [
  '₹20 Lakhs - ₹50 Lakhs',
  '₹50 Lakhs - ₹1 Crore',
  '₹1 Crore - ₹3 Crores',
  '₹3 Crores - ₹10 Crores',
  '₹10 Crores+',
]

export const EmploymentAndIncome: React.FC<EmploymentAndIncomeProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="business-loan-profile">
      {/* 1. Legal Entity & Vintage */}
      <LoanFormSection
        title="Business Profile & Legal Entity"
        subtitle="Provide registered enterprise information"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        <div className="business-loan-profile__grid">
          <div className="business-loan-profile__input-group">
            <label className="business-loan-profile__label">Registered Business / Firm Name</label>
            <input
              type="text"
              className="business-loan-profile__input"
              placeholder="e.g. Apex Enterprises Pvt Ltd"
              value={formData.businessName}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
            />
          </div>

          <div className="business-loan-profile__input-group">
            <label className="business-loan-profile__label">Constitution of Business</label>
            <select
              className="business-loan-profile__select"
              value={formData.constitution}
              onChange={(e) => updateFormData({ constitution: e.target.value as BusinessConstitution })}
            >
              <option value="">Select Constitution</option>
              {CONSTITUTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="business-loan-profile__input-group">
            <label className="business-loan-profile__label">Years in Business (Vintage)</label>
            <select
              className="business-loan-profile__select"
              value={formData.yearsInBusiness}
              onChange={(e) => updateFormData({ yearsInBusiness: e.target.value })}
            >
              <option value="">Select Business Vintage</option>
              {VINTAGE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="business-loan-profile__input-group">
            <label className="business-loan-profile__label">Annual Gross Turnover</label>
            <select
              className="business-loan-profile__select"
              value={formData.annualTurnover}
              onChange={(e) => updateFormData({ annualTurnover: e.target.value })}
            >
              <option value="">Select Annual Turnover</option>
              {TURNOVER_RANGES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GST Registration */}
        <div style={{ marginTop: '1.25rem' }}>
          <div className="business-loan-profile__checkbox-row">
            <input
              id="gst-checkbox"
              type="checkbox"
              style={{ width: '1.125rem', height: '1.125rem', cursor: 'pointer' }}
              checked={formData.gstRegistered}
              onChange={(e) => updateFormData({ gstRegistered: e.target.checked })}
            />
            <label htmlFor="gst-checkbox" className="business-loan-profile__label" style={{ cursor: 'pointer' }}>
              Business is registered under Goods and Services Tax (GST)
            </label>
          </div>

          {formData.gstRegistered && (
            <div className="business-loan-profile__input-group" style={{ marginTop: '0.75rem', maxWidth: '380px' }}>
              <label className="business-loan-profile__label">GST Identification Number (GSTIN)</label>
              <input
                type="text"
                className="business-loan-profile__input"
                placeholder="e.g. 27ABCDE1234F1Z5"
                maxLength={15}
                value={formData.gstin || ''}
                onChange={(e) => updateFormData({ gstin: e.target.value.toUpperCase() })}
              />
            </div>
          )}
        </div>
      </LoanFormSection>
    </div>
  )
}

export default EmploymentAndIncome
