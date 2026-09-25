import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepActionBar, DraftConfirmModal, FlowStepper } from '@shared/components'
import type { FlowStepItem } from '@shared/components'

import { LoanPageNavigation } from '../../components/LoanPageNavigation/LoanPageNavigation'
import { useLoanApplication } from '../../hooks/useLoanApplication'
import { loanApplicationService } from '../../services/loanApplicationService'
import type { MsmeLoanData } from './types/msmeLoan.types'
import { msmeLoanValidation } from './validation/msmeLoanValidation'

import { Requirements } from './steps/Requirements/Requirements'
import { EmploymentAndIncome } from './steps/EmploymentAndIncome/EmploymentAndIncome'
import { BankingAndITR } from './steps/BankingAndITR/BankingAndITR'
import { Documents } from './steps/Documents/Documents'
import { ReviewAndSubmit } from './steps/ReviewAndSubmit/ReviewAndSubmit'

import './MSMELoan.css'

const MSME_LOAN_STEPS: FlowStepItem[] = [
  { stepNumber: 1, title: 'Scheme Details', shortLabel: 'Scheme' },
  { stepNumber: 2, title: 'Enterprise Activity', shortLabel: 'Enterprise' },
  { stepNumber: 3, title: 'Banking & GST', shortLabel: 'Banking' },
  { stepNumber: 4, title: 'Documents', shortLabel: 'Documents' },
  { stepNumber: 5, title: 'Review & Submit', shortLabel: 'Review' },
]

const INITIAL_MSME_LOAN_DATA: MsmeLoanData = {
  schemeType: 'CGTMSE Collateral-Free Scheme (up to ₹5 Cr)',
  enterpriseCategory: 'Small Enterprise',
  udyamRegistrationNumber: 'UDYAM-KR-03-0012345',
  loanAmount: 2500000,
  repaymentTenureYears: 5,
  enterpriseName: 'Kaveri Agro Processors',
  businessActivity: 'Manufacturing',
  annualTurnover: '₹50 Lakhs - ₹5 Crores (Micro/Small)',
  existingEmployeesCount: '18',
  primaryCurrentBank: 'State Bank of India (SBI) - MSME Hub',
  accountNumber: '310928471928',
  ifscCode: 'SBIN0001842',
  panNumber: 'AABCK1234F',
  gstin: '29AABCK1234F1Z3',
  uploadedDocs: {},
  termsAccepted: true,
}

export const MSMELoan: React.FC = () => {
  const navigate = useNavigate()
  const [stepError, setStepError] = useState<string | null>(null)

  const {
    formData,
    updateFormData,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isDraftModalOpen,
    setIsDraftModalOpen,
    isSubmitting,
    setIsSubmitting,
    saveDraft,
    discardDraft,
  } = useLoanApplication<MsmeLoanData>('msme_loan', INITIAL_MSME_LOAN_DATA)

  const validateCurrentStep = (): boolean => {
    setStepError(null)
    if (currentStep === 1) {
      const res = msmeLoanValidation.validateStep1(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill required fields in Step 1.')
        return false
      }
    } else if (currentStep === 2) {
      const res = msmeLoanValidation.validateStep2(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill required fields in Step 2.')
        return false
      }
    } else if (currentStep === 3) {
      const res = msmeLoanValidation.validateStep3(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill required fields in Step 3.')
        return false
      }
    }
    return true
  }

  const handleNext = async () => {
    if (!validateCurrentStep()) return

    if (currentStep < 5) {
      nextStep()
    } else {
      if (!formData.termsAccepted) {
        setStepError('Please accept the Terms & Conditions before submitting.')
        return
      }

      setIsSubmitting(true)
      try {
        const app = await loanApplicationService.submitApplication('msme_loan', {
          loanType: 'msme_loan',
          title: 'MSME Scheme Loan Application',
          category: 'Capital & Financing',
          requestedAmount: formData.loanAmount,
          tenureMonths: formData.repaymentTenureYears * 12,
          details: formData,
        })
        navigate(`/loans/status/${app.referenceNumber}`, {
          state: { formData, refNumber: app.referenceNumber },
        })
      } catch (err: unknown) {
        setStepError(err instanceof Error ? err.message : 'Submission failed.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setStepError(null)
      goToStep(stepNumber)
    } else if (stepNumber === currentStep + 1 && validateCurrentStep()) {
      goToStep(stepNumber)
    }
  }

  return (
    <div className="msme-loan-page">
      <LoanPageNavigation title="MSME Loan" />

      <FlowStepper
        steps={MSME_LOAN_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {stepError && (
        <div className="msme-loan-page__error-banner" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{stepError}</span>
        </div>
      )}

      <div className="msme-loan-page__card">
        {currentStep === 1 && (
          <Requirements formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 2 && (
          <EmploymentAndIncome formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 3 && (
          <BankingAndITR formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 4 && (
          <Documents formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 5 && (
          <ReviewAndSubmit
            formData={formData}
            updateFormData={updateFormData}
            onNavigateToStep={goToStep}
          />
        )}
      </div>

      <StepActionBar
        showBack={currentStep > 1}
        onBack={() => {
          setStepError(null)
          prevStep()
        }}
        onNext={handleNext}
        onSaveDraft={() => setIsDraftModalOpen(true)}
        saveDraftLabel="Save Draft"
        nextLabel={currentStep === 5 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Continue'}
        nextDisabled={isSubmitting || (currentStep === 5 && !formData.termsAccepted)}
      />

      <DraftConfirmModal
        isOpen={isDraftModalOpen}
        serviceTitle="MSME Loan Application"
        onSaveAndExit={() => {
          saveDraft()
          navigate('/loans')
        }}
        onDiscardAndExit={() => {
          discardDraft()
          navigate('/loans')
        }}
        onKeepEditing={() => setIsDraftModalOpen(false)}
      />
    </div>
  )
}

export default MSMELoan
