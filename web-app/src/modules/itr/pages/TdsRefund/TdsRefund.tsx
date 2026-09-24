import React, { useState, useEffect, useCallback } from 'react'
import { routePaths } from '@core/config'
import { useAppStore, useAuthStore } from '@store/index'
import { userStorage } from '@core/storage/userStorage'
import { useDraftBlocker } from '@shared/hooks'
import { DraftConfirmModal } from '@shared/components'
import { DEFAULT_TDS_TAXPAYER } from './tdsRefund.constants'
import type { TdsBankDetails } from './TdsRefundBankSection'
import type { TdsIncomeTaxData } from './TdsRefundTaxDetailsSection'
import type { UploadedFileMeta } from './TdsRefundDocuments'
import { TdsRefundOverview } from './TdsRefundOverview'
import { TdsRefundCustomerIncome } from './TdsRefundCustomerIncome'
import { TdsRefundDocuments } from './TdsRefundDocuments'
import { TdsRefundReview } from './TdsRefundReview'
import { TdsRefundPayment } from './TdsRefundPayment'
import { TdsRefundStatus } from './TdsRefundStatus'
import './TdsRefund.css'

const EMPTY_PROFILE = {
  name: '', fullName: '', pan: '', aadhaar: '', dob: '', mobile: '',
  email: '', address: '', preliminaryRefund: '₹0', assessmentYear: 'AY 2026-27',
  defaultAccountHolder: '', defaultAccountNumber: '', defaultIfsc: '', defaultBankName: '',
}

const EMPTY_BANK: TdsBankDetails = {
  accountHolder: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '', branch: '', accountType: null,
}

const EMPTY_TAX: TdsIncomeTaxData = {
  taxRegime: null, salaryIncome: '', otherIncome: '', interestIncome: '', rentalIncome: null, capitalGains: null,
  businessIncome: null, homeLoanInterest: null, taxDeductions: null, annualRent: '', propertyTaxes: '',
  stcg: '', ltcg: '', turnover: '', netProfit: '', homeLoanInterestAmount: '', deduction80C: '', deduction80D: '',
  totalTdsDeducted: '', tcsAmount: '', advanceTax: '', selfAssessmentTax: '',
}

export const TdsRefund: React.FC = () => {
  const pushToast = useAppStore((s) => s.pushToast)
  const user = useAuthStore((s) => s.user)
  const [draft] = useState(() => userStorage.getDraft('tds-refund'))
  const [tdsRef] = useState(() => `TDS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`)

  const [currentStep, setCurrentStep] = useState<number>(() =>
    draft && draft.currentStep >= 1 && draft.currentStep <= 4 ? draft.currentStep : 0
  )
  const [profile, setProfile] = useState(() => (draft?.formData?.profile as typeof DEFAULT_TDS_TAXPAYER) || { ...EMPTY_PROFILE })
  const [bankDetails, setBankDetails] = useState<TdsBankDetails>(() => (draft?.formData?.bankDetails as TdsBankDetails) || { ...EMPTY_BANK })
  const [taxData, setTaxData] = useState<TdsIncomeTaxData>(() => (draft?.formData?.taxData as TdsIncomeTaxData) || { ...EMPTY_TAX })
  const [uploads, setUploads] = useState<Record<string, UploadedFileMeta>>(() => (draft?.formData?.uploads as Record<string, UploadedFileMeta>) || {})

  const saveCurrentDraft = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    const stepLabel = currentStep === 1 ? 'Customer & Income' : currentStep === 2 ? 'Upload Documents' : currentStep === 3 ? 'Review' : 'Payment'
    userStorage.saveDraft({
      serviceId: 'tds-refund', serviceTitle: 'TDS Refund', currentStep, totalSteps: 4, stepLabel,
      formData: { profile, bankDetails, taxData, uploads },
      savedAt: timeStr, savedTimestamp: Date.now(), resumeRoute: routePaths.itr.tdsRefund,
    })
  }, [currentStep, profile, bankDetails, taxData, uploads])

  useEffect(() => {
    if (currentStep > 1 && currentStep <= 4) saveCurrentDraft()
  }, [currentStep, profile, bankDetails, taxData, uploads, saveCurrentDraft])

  const { isModalOpen, openModal, handleSaveAndExit, handleDiscardAndExit, handleKeepEditing } = useDraftBlocker({
    shouldBlock: currentStep > 1 && currentStep <= 4,
    onSaveDraft: () => { saveCurrentDraft(); pushToast('Application saved as draft', 'success') },
    onDiscardDraft: () => { userStorage.deleteDraft('tds-refund'); pushToast('Draft discarded', 'info') },
    defaultExitRoute: routePaths.dashboard,
  })

  const handleFinishSubmission = () => {
    userStorage.deleteDraft('tds-refund')
    const refundClaim = Number(taxData.totalTdsDeducted || 0) + Number(taxData.tcsAmount || 0)
    userStorage.saveUserApplication({
      id: `app-tds-${Date.now()}`, code: tdsRef, title: 'TDS Refund',
      meta: `${profile.fullName || profile.name || user?.fullName || 'Taxpayer'} · ${refundClaim > 0 ? `₹${refundClaim.toLocaleString('en-IN')}` : 'Refund Claim'}`,
      statusLabel: 'Under Review', statusTone: 'info', progress: 25, icon: '💰', to: `/applications/track/${tdsRef}`,
    })
    setProfile({ ...EMPTY_PROFILE }); setBankDetails({ ...EMPTY_BANK }); setTaxData({ ...EMPTY_TAX }); setUploads({})
    setCurrentStep(5)
  }

  return (
    <>
      {currentStep === 0 && <TdsRefundOverview onStart={() => setCurrentStep(1)} />}
      {currentStep === 1 && (
        <TdsRefundCustomerIncome
          onBack={() => setCurrentStep(0)} onNext={() => setCurrentStep(2)} onSaveDraft={openModal}
          currentStep={1} initialProfile={profile} onProfileChange={setProfile}
          initialBankDetails={bankDetails} onBankChange={setBankDetails}
          initialTaxData={taxData} onTaxChange={setTaxData}
        />
      )}
      {currentStep === 2 && (
        <TdsRefundDocuments
          onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} onSaveDraft={openModal}
          initialUploads={uploads} onUploadsChange={setUploads}
        />
      )}
      {currentStep === 3 && (
        <TdsRefundReview
          onBack={() => setCurrentStep(2)} onEditStep1={() => setCurrentStep(1)} onEditStep2={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)} onSaveDraft={openModal}
          profile={profile} bankDetails={bankDetails} taxData={taxData} uploads={uploads}
        />
      )}
      {currentStep === 4 && (
        <TdsRefundPayment
          applicantName={profile.fullName || profile.name || user?.fullName || 'Taxpayer'}
          applicationRef={tdsRef} onBack={() => setCurrentStep(3)} onNext={handleFinishSubmission}
        />
      )}
      {currentStep === 5 && (
        <TdsRefundStatus applicationId={tdsRef} onBack={() => setCurrentStep(4)} onBackToDashboard={() => setCurrentStep(0)} />
      )}

      <DraftConfirmModal
        isOpen={isModalOpen} serviceTitle="TDS refund"
        onSaveAndExit={handleSaveAndExit} onDiscardAndExit={handleDiscardAndExit} onKeepEditing={handleKeepEditing}
      />
    </>
  )
}

export default TdsRefund
