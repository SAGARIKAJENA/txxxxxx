import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import './FeesPayment.css'

export const FeesPayment: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as Record<string, any>

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | null>(null)
  const [error, setError] = useState<string>('')

  const professionalFee = 4999
  const gst = 900
  const mcaCharges = 1500
  const totalAmount = professionalFee + gst + mcaCharges

  const handlePayAndSubmit = () => {
    if (!selectedMethod) {
      setError('Please select a payment method before proceeding.')
      return
    }

    const applicationId = state.applicationId || 'INC-2026-89421'
    const transactionId = state.transactionId || 'TXN-96771922'
    navigate(routePaths.incorporation.submissionSuccess, {
      state: {
        ...state,
        paymentMethod: selectedMethod,
        paymentCompleted: true,
        applicationId,
        transactionId,
        paidAmount: totalAmount,
      },
    })
  }

  const handleSelectMethod = (method: 'upi' | 'card' | 'netbanking') => {
    setError('')
    setSelectedMethod(method)
  }

  const paymentMethods: { id: 'upi' | 'card' | 'netbanking'; name: string; icon: React.ReactNode }[] = [
    {
      id: 'upi',
      name: 'UPI (GPay / PhonePe / Paytm / BHIM)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h2v2h-2z" />
          <path d="M18 14h3v3h-3z" />
          <path d="M14 18h3v3h-3z" />
        </svg>
      ),
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      id: 'netbanking',
      name: 'Net Banking (All Indian Banks)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="fees-pay-page">
      {/* Progress Tracker */}
      <div className="fees-pay-stepbar">
        <span className="fees-pay-stepbar__badge">Step 9 of 11</span>
        <span className="fees-pay-stepbar__text">Fees & Payment Breakdown</span>
        <div className="fees-pay-stepbar__line">
          <div className="fees-pay-stepbar__line-fill" />
        </div>
      </div>

      {/* Header */}
      <div className="fees-pay-header">
        <h1 className="fees-pay-header__title">Fees & Payment Breakdown</h1>
        <p className="fees-pay-header__subtitle">
          Review itemized MCA government filing fees and TaxEdge professional charges.
        </p>
      </div>

      {/* Fees Breakdown Card */}
      <section className="fees-breakdown-card">
        <div className="fees-breakdown-row">
          <span className="fees-breakdown-row__label">TaxEdge Professional Fee</span>
          <span className="fees-breakdown-row__value">₹4,999</span>
        </div>
        <div className="fees-breakdown-row">
          <span className="fees-breakdown-row__label">GST (18%)</span>
          <span className="fees-breakdown-row__value">₹900</span>
        </div>
        <div className="fees-breakdown-row">
          <span className="fees-breakdown-row__label">Estimated / Applicable MCA Statutory Charges</span>
          <span className="fees-breakdown-row__value">₹1,500</span>
        </div>

        <div className="fees-breakdown-divider" />

        <div className="fees-breakdown-row fees-breakdown-row--total">
          <span className="fees-breakdown-row__label">Total Payable Amount</span>
          <span className="fees-breakdown-row__value">₹7,399</span>
        </div>
      </section>

      {/* Note */}
      <p className="fees-note">
        * ₹1,500 represents estimated / applicable MCA government filing fee and stamp duty charges.
      </p>

      {/* Select Payment Method */}
      <section className="fees-payment-methods">
        <h2 className="fees-payment-methods__title">Select Payment Method</h2>
        <div className="fees-methods-list">
          {paymentMethods.map((m) => (
            <div
              key={m.id}
              className={`fees-method-item ${selectedMethod === m.id ? 'fees-method-item--selected' : ''}`}
              onClick={() => handleSelectMethod(m.id)}
              role="radio"
              aria-checked={selectedMethod === m.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelectMethod(m.id)
                }
              }}
            >
              <div className="fees-method-item__left">
                <div className="fees-method-item__icon">{m.icon}</div>
                <span className="fees-method-item__name">{m.name}</span>
              </div>
              <div className="fees-radio">
                {selectedMethod === m.id && <div className="fees-radio__inner" />}
              </div>
            </div>
          ))}
        </div>
      </section>

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
      <footer className="fees-pay-footer">
        <button
          type="button"
          className="fees-pay-btn-back"
          onClick={() => navigate(routePaths.incorporation.reviewApplication, { state })}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className="fees-pay-btn-submit"
          onClick={handlePayAndSubmit}
        >
          {`Pay ₹${totalAmount.toLocaleString('en-IN')} & Submit`}
        </button>
      </footer>
    </div>
  )
}
export default FeesPayment
