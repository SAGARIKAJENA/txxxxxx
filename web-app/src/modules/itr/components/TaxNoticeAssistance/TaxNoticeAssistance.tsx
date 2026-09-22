import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config/routePaths'
import { useAuthStore } from '@store/auth/authStore'
import { userStorage } from '@core/storage/userStorage'
import { NoticeHeader } from './NoticeHeader'
import { NoticeStep1Details } from './NoticeStep1Details'
import { NoticeStep2Upload } from './NoticeStep2Upload'
import type { NoticeFormData } from './types'
import './TaxNoticeAssistance.css'

const DRAFT_SERVICE_ID = 'tax-notice-assistance'

export const TaxNoticeAssistance: React.FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [step, setStep] = useState<1 | 2>(1)
  const [draftSaved, setDraftSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)

  const [formData, setFormData] = useState<NoticeFormData>({
    pan: user?.pan || 'CASPJ4743E',
    assessmentYear: 'AY 2025-26',
    noticeType: 'Section 143(1)(a) - Proposed Adjustment',
    noticeDate: '',
    noticeReference: '',
    responseDueDate: '',
    explanation: '',
    documentFile: null,
    documentFileName: '',
    documentFileSize: '',
  })

  // Load existing draft if present
  useEffect(() => {
    const existingDraft = userStorage.getDraft(DRAFT_SERVICE_ID)
    if (existingDraft?.formData) {
      setFormData((prev) => ({
        ...prev,
        ...(existingDraft.formData as Partial<NoticeFormData>),
      }))
      if (existingDraft.currentStep === 2) {
        setStep(2)
      }
    }
  }, [])

  const handleUpdateFormData = (patch: Partial<NoticeFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }))
  }

  const handleSaveDraft = () => {
    userStorage.saveDraft({
      serviceId: DRAFT_SERVICE_ID,
      serviceTitle: 'Tax Notice Assistance',
      currentStep: step,
      totalSteps: 2,
      stepLabel: step === 1 ? 'Notice Details' : 'Upload Tax Notice',
      formData: {
        ...formData,
        documentFile: null, // Don't serialize File object to JSON
      },
      savedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      savedTimestamp: Date.now(),
      resumeRoute: routePaths.itr.taxNoticeAssistance,
    })

    setDraftSaved(true)
    setTimeout(() => {
      setDraftSaved(false)
    }, 2500)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(routePaths.itr.root)
    }
  }

  const handleSubmitStaffReview = async () => {
    setIsSubmitting(true)

    try {
      const year = new Date().getFullYear()
      const randomDigits = Math.floor(10000 + Math.random() * 90000)
      const applicationCode = `NOT-${year}-${randomDigits}`

      // Save application to user applications
      userStorage.saveUserApplication({
        id: `notice-app-${Date.now()}`,
        code: applicationCode,
        title: `Tax Notice Assistance · ${formData.noticeType.split(' - ')[0]}`,
        meta: `${formData.assessmentYear} · Ref: ${formData.noticeReference || 'DIN Pending'}`,
        statusLabel: 'Under Verification',
        statusTone: 'warning',
        progress: 25,
        icon: 'document',
        to: `/applications/track/${applicationCode}`,
      })

      // Clean up saved draft
      userStorage.deleteDraft(DRAFT_SERVICE_ID)

      setSubmittedCode(applicationCode)
    } catch {
      setIsSubmitting(false)
    }
  }

  if (submittedCode) {
    return (
      <div className="tax-notice-page">
        <div className="tax-notice-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Notice Submitted for Review
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
            Your Tax Notice details and documentation have been securely routed to our Legal Tax Executives.
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Application Reference Number
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ff6a00', letterSpacing: '0.05em' }}>
              {submittedCode}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="button"
              className="notice-action-bar__btn notice-action-bar__btn--primary"
              onClick={() => navigate(routePaths.applications)}
            >
              <span>View in Applications</span>
            </button>
            <button
              type="button"
              className="notice-action-bar__btn notice-action-bar__btn--secondary"
              onClick={() => navigate(routePaths.dashboard)}
            >
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tax-notice-page">
      <div className="tax-notice-card">
        <NoticeHeader
          subtitle={step === 1 ? 'Notice Details' : 'Upload Tax Notice'}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          draftSaved={draftSaved}
        />

        {step === 1 ? (
          <NoticeStep1Details
            formData={formData}
            onChange={handleUpdateFormData}
            onNext={() => {
              setStep(2)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        ) : (
          <NoticeStep2Upload
            formData={formData}
            onChange={handleUpdateFormData}
            onBack={() => {
              setStep(1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSubmit={handleSubmitStaffReview}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}

export default TaxNoticeAssistance
