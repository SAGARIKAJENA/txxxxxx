import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { userStorage } from '@core/storage/userStorage'
import { revisedItrService } from '../services/revisedItrService'
import { downloadRevisedItrReceipt } from './revisedItrReceipt'
import { validateRevisedItrStep } from './revisedItrStepValidation'
import { useRevisedItrState, type RevisedItrDraftData } from './useRevisedItrState'
import { useRevisedItrDraft } from './useRevisedItrDraft'

export const useRevisedItr = () => {
  const navigate = useNavigate()
  const [existingDraft] = useState(() => userStorage.getDraft('revised-itr'))

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    if (existingDraft && existingDraft.currentStep >= 1 && existingDraft.currentStep <= 5) {
      return existingDraft.currentStep as 1 | 2 | 3 | 4 | 5
    }
    return 1
  })
  const [showPayment, setShowPayment] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('ITR-2026-50983')

  const state = useRevisedItrState(existingDraft as { formData?: RevisedItrDraftData } | null)

  const draftData: RevisedItrDraftData = {
    ackNumber: state.ackNumber,
    selectedAy: state.selectedAy,
    isReturnFound: state.isReturnFound,
    returnDetails: state.returnDetails || undefined,
    selectedReason: state.selectedReason || undefined,
    otherReasonText: state.otherReasonText,
    incomeCorrections: state.incomeCorrections,
    deductionCorrections: state.deductionCorrections,
    bankCorrections: state.bankCorrections,
    uploadedDocuments: state.uploadedDocuments,
  }

  const {
    isModalOpen,
    openModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleKeepEditing,
  } = useRevisedItrDraft({
    step,
    isSubmitted,
    draftData,
  })

  const handleBack = useCallback(() => {
    if (isSubmitted) {
      navigate(routePaths.itr.root)
      return
    }
    if (showPayment) {
      setShowPayment(false)
      return
    }
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (step === 1) {
      if (state.isReturnFound || Boolean(state.ackNumber)) {
        openModal()
        return
      }
      navigate(routePaths.itr.root)
      return
    }
  }, [step, state.isReturnFound, state.ackNumber, showPayment, isSubmitted, openModal, navigate])

  const handlePaymentSuccess = useCallback(
    (result?: { paymentId?: string }) => {
      setShowPayment(false)
      setIsSubmitted(true)
      const finalAppId = result?.paymentId
        ? 'ITR-2026-' + result.paymentId.replace(/[^0-9]/g, '').slice(-5).padStart(5, '50983')
        : 'ITR-2026-50983'
      setApplicationId(finalAppId)

      userStorage.deleteDraft('revised-itr')
      userStorage.saveUserApplication({
        id: `app-rev-itr-${Date.now()}`,
        code: finalAppId,
        title: 'Revised ITR Filing',
        meta: `${state.returnDetails?.personalInfo?.fullName || 'Taxpayer'} · ${state.selectedAy || 'AY 2025-26'}`,
        statusLabel: 'Under Verification',
        statusTone: 'info',
        progress: 30,
        icon: '📄',
        to: `/applications/track/${finalAppId}`,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [state.returnDetails, state.selectedAy]
  )

  const handleDownloadReceipt = useCallback(() => {
    downloadRevisedItrReceipt({
      applicationId,
      ackNumber: state.ackNumber,
      selectedAy: state.selectedAy,
      uploadedDocuments: state.uploadedDocuments,
    })
  }, [applicationId, state.ackNumber, state.selectedAy, state.uploadedDocuments])

  const goToStep = useCallback((targetStep: 1 | 2 | 3 | 4 | 5) => {
    setStep(targetStep)
    setShowPayment(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleContinue = useCallback(async () => {
    const result = validateRevisedItrStep({
      step,
      ackNumber: state.ackNumber,
      selectedAy: state.selectedAy,
      selectedReason: state.selectedReason,
      otherReasonText: state.otherReasonText,
      incomeCorrections: state.incomeCorrections,
      deductionCorrections: state.deductionCorrections,
      bankCorrections: state.bankCorrections,
      uploadedDocuments: state.uploadedDocuments,
    })

    if (!result.isValid) {
      state.setErrors(result.errors)
      return
    }

    state.setErrors({})

    if (step === 1) {
      if (!state.isReturnFound) {
        state.setIsLoading(true)
        try {
          const details = await revisedItrService.findOriginalReturn({
            ackNumber: state.ackNumber,
            assessmentYear: state.selectedAy,
          })
          state.setReturnDetails(details)
          state.setIsReturnFound(true)
        } finally {
          state.setIsLoading(false)
        }
        return
      }
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 2) {
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 3) {
      setStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 4) {
      setStep(5)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 5) {
      setShowPayment(true)
    }
  }, [step, state])

  return {
    step,
    showPayment,
    setShowPayment,
    isSubmitted,
    setIsSubmitted,
    applicationId,
    ...state,
    handleBack,
    handleContinue,
    handlePaymentSuccess,
    handleDownloadReceipt,
    goToStep,
    isModalOpen,
    openModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleKeepEditing,
  }
}
