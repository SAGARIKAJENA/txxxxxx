import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { StepActionBar } from '@shared/components'
import { saveIncorporationDraft } from '../../utils/incorporationDraft'
import './ReviewApplication.css'

const ReviewSection: React.FC<{
  title: string
  onEdit: () => void
  children: React.ReactNode
}> = ({ title, onEdit, children }) => (
  <section className="review-card">
    <div className="review-card__header">
      <h2 className="review-card__title">{title}</h2>
      <button type="button" className="review-card__edit-btn" onClick={onEdit}>
        Edit
      </button>
    </div>
    <div className="review-card__body">{children}</div>
  </section>
)

const ReviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="review-row">
    <span className="review-row__label">{label}</span>
    <span className="review-row__value">{value}</span>
  </div>
)

export const ReviewApplication: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as Record<string, any>

  const companyType = state.companyType || 'pvt_ltd'

  const entityTypeMap: Record<string, string> = {
    opc: 'One Person Company (OPC)',
    pvt_ltd: 'Private Limited Company',
    public: 'Public Limited Company',
    public_ltd: 'Public Limited Company',
    llp: 'Limited Liability Partnership (LLP)',
    section_8: 'Section 8 Company (NGO)',
    nidhi: 'Nidhi Company',
    producer: 'Producer Company',
  }

  const entityTypeLabel = entityTypeMap[companyType] || 'Private Limited Company'

  const classCategory =
    state.companyDetails?.classOfCompany && state.companyDetails?.categoryOfCompany
      ? `${state.companyDetails.classOfCompany} · ${state.companyDetails.categoryOfCompany}`
      : 'Not specified'

  const primaryActivity =
    state.companyDetails?.primaryBusinessActivity || 'Not specified'

  const nicCode = state.companyDetails?.nicCode || 'Not specified'

  const firstPreferredName =
    state.companyDetails?.firstPreferredName || 'Not specified'

  const secondPreferredName =
    state.companyDetails?.secondPreferredName || 'Not specified'

  const address = state.addressData
    ? `${state.addressData.addressLine1 || ''}${state.addressData.city ? `, ${state.addressData.city}` : ''}`
    : 'Not specified'

  const stateAndPin = state.addressData
    ? `${state.addressData.state || ''} ${state.addressData.pincode ? `- ${state.addressData.pincode}` : ''}`.trim() || 'Not specified'
    : 'Not specified'

  const isOpc = companyType === 'opc'
  const directors = state.directors || []
  const primaryDirectorName = directors[0]?.fullName || 'Not specified'

  const authorisedCap = state.capitalDetails?.authorisedCapital
    ? `₹${Number(state.capitalDetails.authorisedCapital).toLocaleString('en-IN')}`
    : 'Not specified'

  const getLinkedRegText = () => {
    if (state.linkedRegistrations && Array.isArray(state.linkedRegistrations)) {
      const regMap: Record<string, string> = {
        pan: 'PAN',
        tan: 'TAN',
        gstin: 'GST',
        esic: 'ESIC',
        epfo: 'EPFO',
        ptax: 'PROFESSIONAL TAX',
        'bank-acc': 'BANK ACCOUNT',
      }
      const checkedKeys = state.linkedRegistrations
        .filter((r: any) => r.checked)
        .map((r: any) => regMap[r.id] || r.id.toUpperCase())
      if (checkedKeys.length > 0) return checkedKeys.join(', ')
    }
    return 'None selected'
  }

  return (
    <div className="review-app-page">
      {/* Progress Tracker */}
      <div className="review-app-stepbar">
        <span className="review-app-stepbar__badge">Step 8 of 11</span>
        <span className="review-app-stepbar__text">Review Application</span>
        <div className="review-app-stepbar__line">
          <div className="review-app-stepbar__line-fill" />
        </div>
      </div>

      {/* Header */}
      <div className="review-app-header">
        <h1 className="review-app-header__title">Review Application</h1>
        <p className="review-app-header__subtitle">
          Review your application details thoroughly before proceeding to payment.
        </p>
      </div>

      {/* Cards List */}
      <div className="review-app-list">
        <ReviewSection title="Company Type & Classification" onEdit={() => navigate(routePaths.incorporation.selectType, { state })}>
          <ReviewRow label="Entity Type" value={entityTypeLabel} />
          <ReviewRow label="Class / Category" value={classCategory} />
        </ReviewSection>

        <ReviewSection title="Business Activity & NIC" onEdit={() => navigate(routePaths.incorporation.companyDetails, { state })}>
          <ReviewRow label="Primary Activity" value={primaryActivity} />
          <ReviewRow label="NIC Code" value={nicCode} />
        </ReviewSection>

        <ReviewSection title="Proposed Company Names" onEdit={() => navigate(routePaths.incorporation.companyDetails, { state })}>
          <ReviewRow label="1st Preference" value={firstPreferredName} />
          <ReviewRow label="2nd Preference" value={secondPreferredName} />
        </ReviewSection>

        <ReviewSection title="Registered Office" onEdit={() => navigate(routePaths.incorporation.registeredOffice, { state })}>
          <ReviewRow label="Address" value={address} />
          <ReviewRow label="State & PIN" value={stateAndPin} />
        </ReviewSection>

        <ReviewSection title="Promoters & Shareholding" onEdit={() => navigate(routePaths.incorporation.capitalDetails, { state })}>
          {isOpc ? (
            <ReviewRow label={`1. ${primaryDirectorName}`} value="100% Shareholding" />
          ) : (
            directors.map((dir: any, idx: number) => (
              <ReviewRow
                key={dir.id || idx}
                label={`${idx + 1}. ${dir.fullName || `Director #${idx + 1}`}`}
                value={dir.shareholdingPercent || '50% Shareholding'}
              />
            ))
          )}
          <ReviewRow label="Authorised Capital" value={authorisedCap} />
        </ReviewSection>

        <ReviewSection title="Linked Registrations" onEdit={() => navigate(routePaths.incorporation.linkedRegistrations, { state })}>
          <div className="review-linked-reg-text">{getLinkedRegText()}</div>
        </ReviewSection>
      </div>

      {/* Footer Navigation */}
      <StepActionBar
        onBack={() => navigate(routePaths.incorporation.linkedRegistrations, { state })}
        onNext={() => navigate(routePaths.incorporation.feesPayment, { state })}
        onSaveDraft={() => {
          saveIncorporationDraft(8, 'Review Application', routePaths.incorporation.reviewApplication, { state })
          navigate(routePaths.dashboard)
        }}
        nextLabel="Continue to Payment"
      />
    </div>
  )
}

export default ReviewApplication
