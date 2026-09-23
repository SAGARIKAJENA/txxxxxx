import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { defaultCompanyDetails } from '../../data/companyRegistrationData'
import type { CompanyDetailsFormData, CompanyEntityType } from '../../types/incorporation.types'
import { filterDigits, isValidNicCode } from '../../utils/validation'
import './CompanyDetails.css'

export const CompanyDetails: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { companyType?: CompanyEntityType } | null
  const selectedCompanyType = locationState?.companyType || 'pvt_ltd'
  const [error, setError] = useState<string>('')

  const getSuffix = (type: CompanyEntityType) => {
    if (type === 'public_ltd') return 'Legal Suffix: Limited'
    if (type === 'opc') return 'Legal Suffix: (OPC) Private Limited'
    if (type === 'section_8') return 'Legal Suffix: Foundation / Section 8'
    return 'Legal Suffix: Private Limited'
  }

  const [formData, setFormData] = useState<CompanyDetailsFormData>(() => ({
    ...defaultCompanyDetails,
    companyType: selectedCompanyType,
    mandatorySuffix: getSuffix(selectedCompanyType),
  }))

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      companyType: selectedCompanyType,
      mandatorySuffix: getSuffix(selectedCompanyType),
    }))
  }, [selectedCompanyType])

  const classOptions = selectedCompanyType === 'public_ltd' ? ['Public'] : selectedCompanyType === 'section_8' ? ['Private', 'Public'] : ['Private']
  const categoryOptions = selectedCompanyType === 'opc' ? ['Company limited by Shares'] : selectedCompanyType === 'section_8' ? ['Company limited by Guarantee', 'Company limited by Shares'] : ['Company limited by Shares', 'Company limited by Guarantee', 'Unlimited Company']
  const subCategoryOptions = selectedCompanyType === 'opc' ? ['Indian Non-Government Company'] : ['Indian Non-Government Company', 'State Government Company', 'Central Government Company']
  const showNicCode = selectedCompanyType === 'opc' || selectedCompanyType === 'section_8'

  const handleInputChange = (field: keyof CompanyDetailsFormData, value: string) => {
    setError('')
    if (field === 'nicCode') {
      setFormData((prev) => ({ ...prev, nicCode: filterDigits(value, 5) }))
      return
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const renderChipGroup = (
    label: string,
    field: 'classOfCompany' | 'categoryOfCompany' | 'subCategoryOfCompany',
    options: string[]
  ) => (
    <div className="company-details-group">
      <label className="company-details-label">
        {label}<span className="company-details-required"> *</span>
      </label>
      <div className="company-details-chips">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`company-details-chip ${formData[field] === opt ? 'company-details-chip--active' : ''}`}
            onClick={() => handleInputChange(field, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  const handleContinue = () => {
    if (!formData.classOfCompany) { setError('Please select Class of Company.'); return }
    if (!formData.categoryOfCompany) { setError('Please select Category of Company.'); return }
    if (!formData.subCategoryOfCompany) { setError('Please select Sub-Category of Company.'); return }
    if (!formData.primaryBusinessActivity.trim()) { setError('Please enter Primary Business Activity.'); return }
    if (showNicCode && (!formData.nicCode || !isValidNicCode(formData.nicCode))) {
      setError('Please enter a valid 5-digit numeric NIC code.')
      return
    }
    if (!formData.firstPreferredName.trim()) { setError('Please enter First Preferred Name.'); return }
    if (!formData.secondPreferredName.trim()) { setError('Please enter Second Preferred Name.'); return }
    setError('')
    navigate(routePaths.incorporation.registeredOffice, {
      state: { companyType: selectedCompanyType, companyDetails: formData },
    })
  }

  return (
    <div className="company-details-page">
      {/* Step Progress Bar */}
      <div className="company-details-stepbar">
        <span className="company-details-stepbar__badge">Step 2 of 11</span>
        <div className="company-details-stepbar__line">
          <div className="company-details-stepbar__line-fill" />
        </div>
      </div>

      {/* Section 1: Company Classification */}
      <section className="company-details-section">
        <div className="company-details-section__header">
          <h1 className="company-details-section__title">Company Classification</h1>
          <p className="company-details-section__subtitle">
            Specify MCA statutory classification details for incorporation filing.
          </p>
        </div>

        {renderChipGroup('Class of Company', 'classOfCompany', classOptions)}
        {renderChipGroup('Category of Company', 'categoryOfCompany', categoryOptions)}
        {renderChipGroup('Sub-Category of Company', 'subCategoryOfCompany', subCategoryOptions)}

        {/* Info Callout */}
        <div className="company-details-info-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Standard commercial startups default to Indian Non-Government Company limited by shares.</span>
        </div>
      </section>

      {/* Section 2: Business Activity / NIC */}
      <section className="company-details-section">
        <div className="company-details-section__header">
          <h2 className="company-details-section__title">Business Activity / NIC</h2>
          <p className="company-details-section__subtitle">
            Define the main objective and National Industrial Classification code of your company.
          </p>
        </div>

        <div className="company-details-group">
          <label className="company-details-label">
            Primary Business Activity<span className="company-details-required"> *</span>
          </label>
          <input
            type="text"
            className="company-details-input"
            placeholder="e.g. Information Technology & Software Consultancy"
            value={formData.primaryBusinessActivity}
            onChange={(e) => handleInputChange('primaryBusinessActivity', e.target.value)}
          />
          <p className="company-details-helper">Used for Main Objects in MoA Memorandum of Association.</p>
        </div>

        {showNicCode && (
          <div className="company-details-group">
            <label className="company-details-label">
              NIC 5-Digit Code<span className="company-details-required"> *</span>
            </label>
            <input
              type="text"
              className="company-details-input"
              placeholder="e.g. 62011"
              value={formData.nicCode}
              onChange={(e) => handleInputChange('nicCode', e.target.value)}
            />
            <p className="company-details-helper">National Industrial Classification code (e.g. 62011 for software development).</p>
          </div>
        )}

        <div className="company-details-group">
          <label className="company-details-label">Secondary Business Activity (Optional)</label>
          <input
            type="text"
            className="company-details-input"
            placeholder="e.g. IT Enabled Services & Data Processing (Optional)"
            value={formData.secondaryBusinessActivity}
            onChange={(e) => handleInputChange('secondaryBusinessActivity', e.target.value)}
          />
        </div>
      </section>

      {/* Section 3: Proposed Company Names */}
      <section className="company-details-section">
        <div className="company-details-section__header">
          <h2 className="company-details-section__title">Proposed Company Names</h2>
          <p className="company-details-section__subtitle">
            Provide up to 2 preferred names for SPICe+ Part A name reservation / incorporation.
          </p>
        </div>

        <div className="company-details-group">
          <label className="company-details-label">
            First Preferred Name<span className="company-details-required"> *</span>
          </label>
          <input
            type="text"
            className="company-details-input"
            placeholder="e.g. TaxEdge Innovations"
            value={formData.firstPreferredName}
            onChange={(e) => handleInputChange('firstPreferredName', e.target.value)}
          />
        </div>

        <div className="company-details-group">
          <label className="company-details-label">
            Second Preferred Name<span className="company-details-required"> *</span>
          </label>
          <input
            type="text"
            className="company-details-input"
            placeholder="e.g. TaxEdge Technologies"
            value={formData.secondPreferredName}
            onChange={(e) => handleInputChange('secondPreferredName', e.target.value)}
          />
        </div>

        {/* Mandatory Suffix */}
        <div className="company-details-group">
          <label className="company-details-label">Mandatory Suffix</label>
          <span className="company-details-suffix-badge">{formData.mandatorySuffix}</span>
        </div>

        {/* Preliminary Name Check */}
        <div className="company-details-success-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" width="20" height="20" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <h3 className="company-details-success-box__title">Preliminary Name Check</h3>
            <p className="company-details-success-box__desc">
              Preliminary name check passed — final approval is subject to MCA name availability and applicable naming/trademark rules.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #fecaca', fontSize: '0.88rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="company-details-footer">
        <button
          type="button"
          className="company-details-btn-back"
          onClick={() => navigate(routePaths.incorporation.selectType, { state: { companyType: selectedCompanyType } })}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className="company-details-btn-continue"
          onClick={handleContinue}
        >
          Continue &rarr;
        </button>
      </footer>
    </div>
  )
}

export default CompanyDetails
