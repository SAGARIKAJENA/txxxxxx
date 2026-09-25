import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '@core/auth'
import { routePaths } from '@core/config'
import { useAuthStore } from '@store/index'

import { BrandPanel } from '../BrandPanel/BrandPanel'
import { BackButton } from '../BackButton/BackButton'
import { CustomerTypeList } from '../CustomerTypeList/CustomerTypeList'
import { CreateAccountButton } from '../CreateAccountButton/CreateAccountButton'
import { CUSTOMER_TYPE_OPTIONS } from '../../data/customerTypeOptions'
import { useCustomerType } from '../../hooks/useCustomerType'
import { authFlowService } from '@modules/authentication/services/authFlowService'
import './CustomerTypePage.css'

export const CustomerTypePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { returnTo?: string } | null
  const { selectedId, setSelectedId } = useCustomerType(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const handleBack = () => {
    navigate(-1)
  }

  const handleCreateAccount = async () => {
    if (!selectedId) return

    setIsSubmitting(true)
    try {
      const currentUser = user || authService.getUser()
      const userMobile = currentUser?.mobile || ''

      if (userMobile) {
        await authFlowService.completeRegistration(userMobile, selectedId)
      }

      if (currentUser) {
        const completedUser = {
          ...currentUser,
          customerType: selectedId,
          isProfileComplete: true,
        }
        setUser(completedUser)
        authService.startSession({
          user: completedUser,
          tokens: {
            accessToken: authService.getAccessToken() || `tok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
            refreshToken: authService.getRefreshToken() || `ref_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          },
        })
      }

      // Complete registration and enter requested service or dashboard
      const destination = locationState?.returnTo || routePaths.dashboard
      navigate(destination, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="customer-type-page">
      {/* 1. Left Fixed Brand Panel (Desktop & Tablet) */}
      <BrandPanel />

      {/* 2. Right Vertically Scrollable Content Panel */}
      <main className="customer-type-page__content-panel">
        <div className="customer-type-page__scroll-container">
          {/* Top Navigation */}
          <div className="customer-type-page__top-nav">
            <BackButton onClick={handleBack} />
          </div>

          {/* Heading & Subtitle */}
          <header className="customer-type-page__header">
            <h1 className="customer-type-page__title">What describes you best?</h1>
            <p className="customer-type-page__subtitle">Step 2 of 2 — customer type.</p>
          </header>

          {/* Customer Type Selection Cards List */}
          <section className="customer-type-page__list-section" aria-label="Customer Type Selection">
            <CustomerTypeList
              options={CUSTOMER_TYPE_OPTIONS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>

          {/* Bottom Action CTA */}
          <footer className="customer-type-page__footer">
            <CreateAccountButton
              onClick={handleCreateAccount}
              isLoading={isSubmitting}
              disabled={!selectedId}
            />
          </footer>
        </div>
      </main>
    </div>
  )
}

export default CustomerTypePage
