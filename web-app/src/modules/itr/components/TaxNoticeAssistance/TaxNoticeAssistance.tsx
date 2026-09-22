import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config/routePaths'
import { useAuthStore, useAppStore } from '@store/index'
import { userStorage } from '@core/storage/userStorage'
import { useDraftBlocker } from '@shared/hooks'
import { DraftConfirmModal } from '@shared/components'
import { NoticeInformation, NoticeDocument } from './NoticeInformation'
import { NoticeSummary } from './NoticeSummary'
import { SupportingDocuments } from './SupportingDocuments'
import { ReviewResponse } from './ReviewResponse'
import { NoticeStatus } from './NoticeStatus'
import { NoticeStepper } from './NoticeStepper'
import type { NoticeFormData } from './types'
import './TaxNoticeAssistance.css'

const DRAFT_SERVICE_ID = 'tax-notice-assistance'

export const TaxNoticeAssistance: React.FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<NoticeFormData>({
    pan: '',
    assessmentYear: '',
    noticeType: '',
    noticeDate: '',
    noticeReference: '',
    responseDueDate: '',
    explanation: '',
    documentFile: null,
    documentFileName: '',
    documentFileSize: '',
    supportingDocuments: {},
    remarks: '',
    responseConfirmed: false,
  })

  // Load existing draft if present
  useEffect(() => {
    const existingDraft = userStorage.getDraft(DRAFT_SERVICE_ID)
    if (existingDraft?.formData) {
      setFormData((prev) => ({
        ...prev,
        ...(existingDraft.formData as Partial<NoticeFormData>),
      }))
      if (existingDraft.currentStep && existingDraft.currentStep <= 5) {
        setStep(existingDraft.currentStep as 1 | 2 | 3 | 4 | 5)
      }
    }
  }, [])

  const handleUpdateFormData = (patch: Partial<NoticeFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }))
  }

  const getStepLabel = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return 'Notice Details'
      case 2:
        return 'Upload Notice'
      case 3:
        return 'Notice Summary'
      case 4:
        return 'Supporting Documents'
      case 5:
        return 'Review Response'
      default:
        return 'Notice Details'
    }
  }

  const pushToast = useAppStore((state) => state.pushToast)

  const handleSaveDraft = useCallback(() => {
    userStorage.saveDraft({
      serviceId: DRAFT_SERVICE_ID,
      serviceTitle: 'Tax Notice Assistance',
      currentStep: step,
      totalSteps: 5,
      stepLabel: getStepLabel(step),
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
  }, [step, formData])

  // Automatically keep draft updated
  useEffect(() => {
    if (step >= 1 && step <= 5) {
      handleSaveDraft()
    }
  }, [step, formData, handleSaveDraft])

  const shouldBlock = step >= 1 && step <= 5
  const {
    isModalOpen,
    openModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleKeepEditing,
  } = useDraftBlocker({
    shouldBlock,
    onSaveDraft: () => {
      handleSaveDraft()
      pushToast('Tax Notice Application saved as draft', 'success')
    },
    onDiscardDraft: () => {
      userStorage.deleteDraft(DRAFT_SERVICE_ID)
      pushToast('Draft discarded', 'info')
    },
    defaultExitRoute: routePaths.itr.root,
  })

  const handleSaveDraftAndExit = () => {
    openModal()
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 3) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 4) {
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 5) {
      setStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 1) {
      openModal()
    } else {
      navigate(routePaths.itr.root)
    }
  }

  const handleFinalApproveAndSubmit = async () => {
    setIsSubmitting(true)

    try {
      const year = new Date().getFullYear()
      const randomDigits = Math.floor(10000 + Math.random() * 90000)
      const applicationCode = `NOT-${year}-${randomDigits}`
      const ackNo = `ITR-${year}-${Math.floor(10000 + Math.random() * 90000)}`
      const submittedDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      // Save application to user applications
      userStorage.saveUserApplication({
        id: `notice-app-${Date.now()}`,
        code: applicationCode,
        title: `Tax Notice Assistance · ${formData.noticeType ? formData.noticeType.split(' - ')[0] : 'Section 143(1)(a)'}`,
        meta: `${formData.assessmentYear || 'AY 2025-26'} · Ack: ${ackNo}`,
        statusLabel: 'Response Submitted',
        statusTone: 'success',
        progress: 100,
        icon: 'document',
        to: `/applications/track/${applicationCode}`,
      })

      // Clean up saved draft
      userStorage.deleteDraft(DRAFT_SERVICE_ID)

      // Update state for Status Page
      setFormData((prev) => ({
        ...prev,
        applicationCode,
        acknowledgementNo: ackNo,
        submittedAt: submittedDate,
        assignedExecutive: 'Meera Iyer, Tax Executive',
      }))

      setIsSubmitting(false)
      setStep(6)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="tax-notice-page">
      <div className="tax-notice-card">
        {step >= 1 && step <= 5 && (
          <NoticeStepper
            currentStep={step}
            onStepClick={(targetStep) => {
              if (targetStep < step) {
                setStep(targetStep as 1 | 2 | 3 | 4 | 5)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          />
        )}

        {step === 1 && (
          <NoticeInformation
            formData={formData}
            onChange={handleUpdateFormData}
            onBack={handleBack}
            onSaveDraftAndExit={handleSaveDraftAndExit}
            onNext={() => {
              setStep(2)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {step === 2 && (
          <NoticeDocument
            formData={formData}
            onChange={handleUpdateFormData}
            onBack={() => {
              setStep(1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSaveDraftAndExit={handleSaveDraftAndExit}
            onNext={() => {
              setStep(3)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {step === 3 && (
          <NoticeSummary
            formData={formData}
            onBack={() => {
              setStep(2)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSaveDraftAndExit={handleSaveDraftAndExit}
            onNext={() => {
              setStep(4)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {step === 4 && (
          <SupportingDocuments
            formData={formData}
            onChange={handleUpdateFormData}
            onBack={() => {
              setStep(3)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSaveDraftAndExit={handleSaveDraftAndExit}
            onNext={() => {
              setStep(5)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {step === 5 && (
          <ReviewResponse
            formData={formData}
            userName={user?.name || 'Sagarika Jena'}
            onEditRequest={() => {
              setStep(1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onApproveAndSubmit={handleFinalApproveAndSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 6 && (
          <NoticeStatus
            formData={formData}
            onBackToTaxServices={() => navigate(routePaths.itr.root)}
          />
        )}
      </div>

      <DraftConfirmModal
        isOpen={isModalOpen}
        serviceTitle="Tax Notice Assistance"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onKeepEditing={handleKeepEditing}
      />
    </div>
  )
}

export default TaxNoticeAssistance
