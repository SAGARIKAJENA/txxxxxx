import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import './LinkedRegistrations.css'

interface RegistrationItem {
  id: string
  title: string
  description: string
  checked: boolean
}

export const LinkedRegistrations: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const companyType = location.state?.companyType || 'pvt_ltd'
  const [error, setError] = useState<string>('')

  const [registrations, setRegistrations] = useState<RegistrationItem[]>(() => {
    if (location.state?.linkedRegistrations) {
      return location.state.linkedRegistrations
    }
    return [
      {
        id: 'pan',
        title: 'Company PAN Card Issuance',
        description: 'Automatic PAN allotment via SPICe+ Part B (Mandatory)',
        checked: false,
      },
      {
        id: 'tan',
        title: 'Company TAN Allotment',
        description: 'Tax Deduction Account Number for TDS compliance (Mandatory)',
        checked: false,
      },
      {
        id: 'gstin',
        title: 'GSTIN Registration (AGILE-PRO-S)',
        description: 'Goods & Services Tax registration',
        checked: false,
      },
      {
        id: 'epfo',
        title: 'EPFO Registration',
        description: 'Employees Provident Fund Organisation registration',
        checked: false,
      },
      {
        id: 'esic',
        title: 'ESIC Registration',
        description: 'Employees State Insurance Corporation registration',
        checked: false,
      },
      {
        id: 'ptax',
        title: 'Professional Tax Registration (P-Tax)',
        description: 'State Professional Tax registration',
        checked: false,
      },
      {
        id: 'bank-acc',
        title: 'Zero Balance Corporate Bank Account Opening',
        description: 'Pre-approved corporate account opening with partner banks',
        checked: false,
      },
    ]
  })

  const toggleRegistration = (id: string) => {
    setError('')
    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const handleContinue = () => {
    const hasPan = registrations.find((r) => r.id === 'pan')?.checked
    const hasTan = registrations.find((r) => r.id === 'tan')?.checked

    if (!hasPan || !hasTan) {
      setError(
        'Company PAN Card and TAN Allotment are mandatory under SPICe+ Part B. Please select both to proceed.'
      )
      return
    }

    setError('')
    navigate(routePaths.incorporation.reviewApplication, {
      state: {
        ...location.state,
        companyType,
        linkedRegistrations: registrations,
      },
    })
  }

  return (
    <div className="linked-reg-page">
      {/* Step Bar */}
      <div className="linked-reg-stepbar">
        <span className="linked-reg-stepbar__badge">Step 7 of 11</span>
        <span className="linked-reg-stepbar__text">Linked Mandatory & Optional Registrations</span>
        <div className="linked-reg-stepbar__line">
          <div className="linked-reg-stepbar__line-fill" />
        </div>
      </div>

      {/* Header */}
      <div className="linked-reg-header">
        <h1 className="linked-reg-header__title">Linked Mandatory & Optional Registrations</h1>
        <p className="linked-reg-header__subtitle">
          Select government Registrations bundled directly with SPICe+ AGILE-PRO-S filing.
        </p>
      </div>

      {/* List */}
      <div className="linked-reg-list">
        {registrations.map((item) => (
          <div
            key={item.id}
            className={`linked-reg-item ${item.checked ? 'linked-reg-item--checked' : ''}`}
            onClick={() => toggleRegistration(item.id)}
            role="checkbox"
            aria-checked={item.checked}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleRegistration(item.id)
              }
            }}
          >
            <div className="linked-reg-item__content">
              <span className="linked-reg-item__title">{item.title}</span>
              <span className="linked-reg-item__desc">{item.description}</span>
            </div>
            <div className="linked-reg-item__checkbox">
              {item.checked && (
                <svg
                  className="linked-reg-item__check-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          margin: '1rem 0',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Footer Actions */}
      <footer className="linked-reg-footer">
        <button
          type="button"
          className="linked-reg-btn-back"
          onClick={() => navigate(routePaths.incorporation.documentsKyc, { state: location.state })}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className="linked-reg-btn-continue"
          onClick={handleContinue}
        >
          Continue &rarr;
        </button>
      </footer>
    </div>
  )
}

export default LinkedRegistrations
