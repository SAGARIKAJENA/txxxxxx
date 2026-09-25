import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepActionBar, DraftConfirmModal, FlowStepper } from '@shared/components'
import type { FlowStepItem } from '@shared/components'

import { LoanPageNavigation } from '../../components/LoanPageNavigation/LoanPageNavigation'
import { useLoanApplication } from '../../hooks/useLoanApplication'
import { loanApplicationService } from '../../services/loanApplicationService'
import type { HomeLoanData } from './types/homeLoan.types'
import { homeLoanValidation } from './validation/homeLoanValidation'

import { Requirements } from './steps/Requirements/Requirements'
import { EmploymentAndIncome } from './steps/EmploymentAndIncome/EmploymentAndIncome'
import { BankingAndITR } from './steps/BankingAndITR/BankingAndITR'
import { Documents } from './steps/Documents/Documents'
import { ReviewAndSubmit } from './steps/ReviewAndSubmit/ReviewAndSubmit'

import './HomeLoan.css'

const HOME_LOAN_STEPS: FlowStepItem[] = [
  { stepNumber: 1, title: 'Requirements', shortLabel: 'Requirements' },
  { stepNumber: 2, title: 'Employment & Income', shortLabel: 'Employment' },
  { stepNumber: 3, title: 'Banking & ITR', shortLabel: 'Banking' },
  { stepNumber: 4, title: 'Documents', shortLabel: 'Documents' },
  { stepNumber: 5, title: 'Review & Submit', shortLabel: 'Review' },
]

const INITIAL_HOME_LOAN_DATA: HomeLoanData = {
  loanAmount: 5000000,
  propertyIntent: 'Purchase Ready-to-Move Property',
  repaymentTenureYears: 20,
  occupation: 'salaried',
  monthlyIncomeRange: '₹30,000 - ₹50,000',
  hasExistingEmis: false,
  bankName: 'HDFC Bank',
  accountNumber: '50100492817291',
  ifscCode: 'HDFC0001234',
  itrStatus: 'filed',
  itrAckNumber: '928471928471928',
  annualIncomeAsPerItr: '8,50,000',
  uploadedDocs: {
    pan_card: { name: 'PAN_Card_Applicant.pdf', size: '1.24 MB', uploadedAt: new Date().toISOString() },
    aadhaar_card: { name: 'Aadhaar_Front_Back.pdf', size: '2.10 MB', uploadedAt: new Date().toISOString() },
    address_proof: { name: 'Electricity_Bill_Aug2026.pdf', size: '0.85 MB', uploadedAt: new Date().toISOString() },
    passport_photo: { name: 'Applicant_Photo.jpg', size: '0.45 MB', uploadedAt: new Date().toISOString() },
  },
  termsAccepted: true,
}

export const HomeLoan: React.FC = () => {
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
  } = useLoanApplication<HomeLoanData>('home_loan', INITIAL_HOME_LOAN_DATA)

  const validateCurrentStep = (): boolean => {
    setStepError(null)
    if (currentStep === 1) {
      const res = homeLoanValidation.validateStep1(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill in required fields.')
        return false
      }
    } else if (currentStep === 2) {
      const res = homeLoanValidation.validateStep2(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill in required fields.')
        return false
      }
    } else if (currentStep === 3) {
      const res = homeLoanValidation.validateStep3(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill in required fields.')
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
      // Step 5 Submit
      if (!formData.termsAccepted) {
        setStepError('Please accept the Terms & Conditions before submitting.')
        return
      }

      setIsSubmitting(true)
      try {
        const app = await loanApplicationService.submitApplication('home_loan', {
          loanType: 'home_loan',
          title: 'Home Loan Application',
          category: 'Capital & Financing',
          requestedAmount: formData.loanAmount,
          tenureMonths: formData.repaymentTenureYears * 12,
          details: formData,
        })
        navigate(`/loans/status/${app.referenceNumber}`, {
          state: { formData, refNumber: app.referenceNumber },
        })
      } catch (err: unknown) {
        setStepError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
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
    <div className="home-loan-page">
      <LoanPageNavigation title="Home Loan" />

      <FlowStepper
        steps={HOME_LOAN_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {stepError && (
        <div className="home-loan-page__error-banner" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{stepError}</span>
        </div>
      )}

      <div className="home-loan-page__card">
        {currentStep === 1 && (
          <Requirements data={formData} onChange={updateFormData} />
        )}
        {currentStep === 2 && (
          <EmploymentAndIncome data={formData} onChange={updateFormData} />
        )}
        {currentStep === 3 && (
          <BankingAndITR data={formData} onChange={updateFormData} />
        )}
        {currentStep === 4 && (
          <Documents data={formData} onChange={updateFormData} />
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
        serviceTitle="Home Loan Application"
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

export default HomeLoan
