import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepActionBar, DraftConfirmModal, FlowStepper } from '@shared/components'
import type { FlowStepItem } from '@shared/components'

import { LoanPageNavigation } from '../../components/LoanPageNavigation/LoanPageNavigation'
import { useLoanApplication } from '../../hooks/useLoanApplication'
import { loanApplicationService } from '../../services/loanApplicationService'
import type { WorkingCapitalLoanData } from './types/workingCapitalLoan.types'
import { workingCapitalLoanValidation } from './validation/workingCapitalLoanValidation'

import { Requirements } from './steps/Requirements/Requirements'
import { EmploymentAndIncome } from './steps/EmploymentAndIncome/EmploymentAndIncome'
import { BankingAndITR } from './steps/BankingAndITR/BankingAndITR'
import { Documents } from './steps/Documents/Documents'
import { ReviewAndSubmit } from './steps/ReviewAndSubmit/ReviewAndSubmit'

import './WorkingCapitalLoan.css'

const WORKING_CAPITAL_STEPS: FlowStepItem[] = [
  { stepNumber: 1, title: 'Facility Details', shortLabel: 'Facility' },
  { stepNumber: 2, title: 'Enterprise Profile', shortLabel: 'Profile' },
  { stepNumber: 3, title: 'Banking & GST', shortLabel: 'Banking' },
  { stepNumber: 4, title: 'Documents', shortLabel: 'Documents' },
  { stepNumber: 5, title: 'Review & Submit', shortLabel: 'Review' },
]

const INITIAL_WORKING_CAPITAL_DATA: WorkingCapitalLoanData = {
  facilityType: 'Cash Credit (CC) Facility',
  requestedLimit: 10000000,
  repaymentTenureYears: 1,
  primaryCollateralOffered: 'Hypothecation of Stocks, Raw Materials & Book Debts',
  businessName: 'Zenith Global Logistics Ltd',
  constitution: 'Public Limited Company',
  currentAnnualRevenue: '₹15 Crores - ₹50 Crores',
  estimatedStockValue: '85,00,000',
  estimatedDebtorsValue: '1,20,00,000',
  primaryConsortiumBank: 'State Bank of India (SBI)',
  currentAccountNumber: '310928471928',
  ifscCode: 'SBIN0000843',
  gstin: '29AABCS1429F1Z2',
  panNumber: 'AABCS1429F',
  uploadedDocs: {},
  termsAccepted: true,
}

export const WorkingCapitalLoan: React.FC = () => {
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
  } = useLoanApplication<WorkingCapitalLoanData>('working_capital_loan', INITIAL_WORKING_CAPITAL_DATA)

  const validateCurrentStep = (): boolean => {
    setStepError(null)
    if (currentStep === 1) {
      const res = workingCapitalLoanValidation.validateStep1(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill required fields in Step 1.')
        return false
      }
    } else if (currentStep === 2) {
      const res = workingCapitalLoanValidation.validateStep2(formData)
      if (!res.isValid) {
        setStepError(res.error || 'Please fill required fields in Step 2.')
        return false
      }
    } else if (currentStep === 3) {
      const res = workingCapitalLoanValidation.validateStep3(formData)
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
        const app = await loanApplicationService.submitApplication('working_capital_loan', {
          loanType: 'working_capital_loan',
          title: 'Working Capital Facility Application',
          category: 'Capital & Financing',
          requestedAmount: formData.requestedLimit,
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
    <div className="working-capital-page">
      <LoanPageNavigation title="Working Capital Loan" />

      <FlowStepper
        steps={WORKING_CAPITAL_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {stepError && (
        <div className="working-capital-page__error-banner" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{stepError}</span>
        </div>
      )}

      <div className="working-capital-page__card">
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
        serviceTitle="Working Capital Facility Application"
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

export default WorkingCapitalLoan
