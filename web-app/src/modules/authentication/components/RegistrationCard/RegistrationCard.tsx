import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { authService } from '@core/auth'
import { useAuthStore } from '@store/index'
import { authFlowService } from '../../services/authFlowService'
import { CUSTOMER_TYPE_OPTIONS } from '@modules/customerType/data/customerTypeOptions'
import { CustomerTypeCard } from '@modules/customerType/components/CustomerTypeCard/CustomerTypeCard'
import type { CustomerTypeId } from '@modules/customerType/types/customerType.types'
import { RegistrationForm } from '../RegistrationForm/RegistrationForm'
import './RegistrationCard.css'

export const RegistrationCard: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerTypeId | null>('individual')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { returnTo?: string } | null
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const handleStep1Complete = () => {
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCompleteRegistration = async () => {
    if (!selectedCustomerType) return
    setIsSubmitting(true)
    setError(null)

    try {
      const currentUser = user || authService.getUser()
      const userMobile = currentUser?.mobile || ''

      if (userMobile) {
        await authFlowService.completeRegistration(userMobile, selectedCustomerType)
      }

      if (currentUser) {
        const completedUser = {
          ...currentUser,
          customerType: selectedCustomerType,
          isProfileComplete: true,
        }
        setUser(completedUser)
        authService.startSession({
          user: completedUser,
          tokens: {
            accessToken: authService.getAccessToken() || 'mock.access.token',
            refreshToken: authService.getRefreshToken() || 'mock.refresh.token',
          },
        })
      }

      const destination = locationState?.returnTo || routePaths.dashboard
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete registration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="reg-card">
      <div className="reg-card__accent-line" aria-hidden="true" />

      {step === 1 ? (
        <>
          <header className="reg-card__header">
            <div className="reg-card__step-badge">Step 1 of 2</div>
            <h2 className="reg-card__title">Create Account</h2>
            <p className="reg-card__subtitle">Fill in your personal details to get started.</p>
          </header>

          <RegistrationForm onStep1Success={handleStep1Complete} />
        </>
      ) : (
        <>
          <div className="reg-card__step-nav">
            <button
              type="button"
              className="reg-card__back-btn"
              onClick={() => setStep(1)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="reg-card__back-icon">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Step 1</span>
            </button>
            <span className="reg-card__step-badge reg-card__step-badge--step2">Step 2 of 2</span>
          </div>

          <header className="reg-card__header">
            <h2 className="reg-card__title">What describes you best?</h2>
            <p className="reg-card__subtitle">
              Select your customer or entity type. Your tax checklists and filing forms will adapt automatically.
            </p>
          </header>

          {error && (
            <div className="reg-card__error-banner" role="alert">
              <span>{error}</span>
            </div>
          )}

          <div className="reg-card__customer-type-grid" role="radiogroup" aria-label="Customer Type Selection">
            {CUSTOMER_TYPE_OPTIONS.map((option) => (
              <CustomerTypeCard
                key={option.id}
                id={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                isSelected={selectedCustomerType === option.id}
                onSelect={(id) => setSelectedCustomerType(id)}
              />
            ))}
          </div>

          <footer className="reg-card__step2-footer">
            <button
              type="button"
              className={`reg-card__submit-btn ${
                selectedCustomerType && !isSubmitting
                  ? 'reg-card__submit-btn--active'
                  : 'reg-card__submit-btn--disabled'
              }`}
              disabled={!selectedCustomerType || isSubmitting}
              onClick={handleCompleteRegistration}
            >
              <span>{isSubmitting ? 'Finalizing Profile...' : 'Complete Registration'}</span>
            </button>
          </footer>
        </>
      )}
    </div>
  )
}

export default RegistrationCard
