import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { companyTypeOptions } from '../../data/companyRegistrationData'
import type { CompanyEntityType } from '../../types/incorporation.types'
import './SelectCompanyType.css'

export const SelectCompanyType: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { companyType?: CompanyEntityType } | null
  const [selectedType, setSelectedType] = useState<CompanyEntityType | null>(
    locationState?.companyType || null
  )
  const [error, setError] = useState<string>('')

  const handleContinue = () => {
    if (!selectedType) {
      setError('Please select a company type before proceeding.')
      return
    }
    navigate(routePaths.incorporation.companyDetails, {
      state: { companyType: selectedType },
    })
  }

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'building':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <rect x="3" y="9" width="8" height="12" rx="1" />
            <rect x="13" y="4" width="8" height="17" rx="1" />
            <line x1="6" y1="12" x2="8" y2="12" />
            <line x1="6" y1="15" x2="8" y2="15" />
            <line x1="6" y1="18" x2="8" y2="18" />
            <line x1="16" y1="8" x2="18" y2="8" />
            <line x1="16" y1="12" x2="18" y2="12" />
            <line x1="16" y1="16" x2="18" y2="16" />
          </svg>
        )
      case 'user':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      case 'trending':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        )
      case 'briefcase':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="select-type-page">
      {/* Step Progress Bar */}
      <div className="select-type-stepbar">
        <span className="select-type-stepbar__badge">Step 1 of 11</span>
        <div className="select-type-stepbar__line">
          <div className="select-type-stepbar__line-fill" />
        </div>
      </div>

      {/* Page Header */}
      <header className="select-type-header">
        <h1 className="select-type-header__title">Select Company Type</h1>
        <p className="select-type-header__subtitle">
          Choose the corporate legal entity structure for your incorporation.
        </p>
      </header>

      {/* Entity Selection Cards Grid */}
      <main className="select-type-grid">
        {companyTypeOptions.map((opt) => {
          const isSelected = selectedType === opt.id
          return (
            <div
              key={opt.id}
              className={`select-type-card ${isSelected ? 'select-type-card--selected' : ''}`}
              onClick={() => {
                setSelectedType(opt.id)
                setError('')
              }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedType(opt.id)
                  setError('')
                }
              }}
            >
              <div className="select-type-card__top">
                <div className="select-type-card__left">
                  <div className="select-type-card__icon-box">
                    {renderIcon(opt.icon)}
                  </div>
                  <h2 className="select-type-card__title">{opt.title}</h2>
                </div>
                <div className="select-type-card__radio">
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              <p className="select-type-card__desc">{opt.description}</p>
              <span className="select-type-card__badge">{opt.badge}</span>
            </div>
          )
        })}
      </main>

      {error && (
        <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #fecaca', fontSize: '0.88rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="select-type-footer">
        <button
          type="button"
          className="select-type-btn-cancel"
          onClick={() => navigate(routePaths.incorporation.root)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="select-type-btn-continue"
          onClick={handleContinue}
        >
          Continue &rarr;
        </button>
      </footer>
    </div>
  )
}

export default SelectCompanyType
