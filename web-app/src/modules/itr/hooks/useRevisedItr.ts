import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import type {
  OriginalReturnDetails,
  RevisionReasonKey,
  IncomeCorrectionState,
  DeductionCorrectionState,
  BankCorrectionState,
  DocumentTypeId,
  UploadedDocument,
  RevisedItrValidationErrors,
} from '../types/revisedItr.types'
import {
  validateAckNumber,
  validateAssessmentYear,
  validateRevisionReason,
  validateIncomeCorrections,
  validateDeductionCorrections,
  validateBankCorrections,
  validateRequiredDocuments,
  formatFileSize,
  sanitizeAckNumberInput,
  sanitizeNumericAmount,
  isNumericKeyAllowed,
} from '../validation/revisedItrValidation'
import { revisedItrService } from '../services/revisedItrService'

export const useRevisedItr = () => {
  const navigate = useNavigate()

  // Navigation / Step State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [showPayment, setShowPayment] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('ITR-2026-50983')

  // Step 1 State
  const [ackNumber, setAckNumber] = useState('')
  const [selectedAy, setSelectedAy] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isReturnFound, setIsReturnFound] = useState(false)
  const [returnDetails, setReturnDetails] = useState<OriginalReturnDetails | null>(null)

  // Step 2 State
  const [selectedReason, setSelectedReason] = useState<RevisionReasonKey | null>(null)
  const [otherReasonText, setOtherReasonText] = useState('')

  // Step 3 State
  const [incomeCorrections, setIncomeCorrections] = useState<IncomeCorrectionState>({
    salaryIncome: '',
    otherIncome: '',
    taxableIncome: '',
  })
  const [deductionCorrections, setDeductionCorrections] = useState<DeductionCorrectionState>({
    section80c: '',
    section80d: '',
    homeLoanInterest: '',
    taxableIncome: '',
  })
  const [bankCorrections, setBankCorrections] = useState<BankCorrectionState>({
    accountNumber: '',
    ifsc: '',
  })

  // Step 4 State (Uploaded Documents)
  const [uploadedDocuments, setUploadedDocuments] = useState<Partial<Record<DocumentTypeId, UploadedDocument>>>({})

  // Shared UI / Async State
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<RevisedItrValidationErrors>({})

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Input & Keydown handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isNumericKeyAllowed(e.key, e.ctrlKey || e.metaKey)) {
      e.preventDefault()
    }
  }, [])

  const handleAckChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = sanitizeAckNumberInput(e.target.value)
    setAckNumber(cleanVal)
    setErrors((prev) => ({ ...prev, ackError: null }))
    setIsReturnFound(false)
  }, [])

  const handleSelectAy = useCallback((ay: string) => {
    setSelectedAy(ay)
    setIsDropdownOpen(false)
    setErrors((prev) => ({ ...prev, ayError: null }))
    setIsReturnFound(false)
  }, [])

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev)
  }, [])

  const handleCloseDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  // Step 2 reason selection
  const handleSelectReason = useCallback((reason: RevisionReasonKey) => {
    setSelectedReason(reason)
    setErrors((prev) => ({ ...prev, reasonError: null }))
    if (reason !== 'other') {
      setErrors((prev) => ({ ...prev, otherReasonError: null }))
    }
  }, [])

  const handleOtherReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReasonText(e.target.value)
    setErrors((prev) => ({ ...prev, otherReasonError: null }))
  }, [])

  // Step 3 income correction handler
  const handleIncomeChange = useCallback((field: keyof IncomeCorrectionState, val: string) => {
    const cleanNumeric = sanitizeNumericAmount(val)
    setIncomeCorrections((prev) => ({
      ...prev,
      [field]: cleanNumeric,
    }))

    if (field === 'salaryIncome') {
      setErrors((prev) => ({ ...prev, salaryIncomeError: null }))
    } else if (field === 'taxableIncome') {
      setErrors((prev) => ({ ...prev, taxableIncomeError: null }))
    }
  }, [])

  // Step 3 deduction correction handler (for wrong_deduction)
  const handleDeductionChange = useCallback((field: keyof DeductionCorrectionState, val: string) => {
    const cleanNumeric = sanitizeNumericAmount(val)
    setDeductionCorrections((prev) => ({
      ...prev,
      [field]: cleanNumeric,
    }))

    if (field === 'taxableIncome') {
      setErrors((prev) => ({ ...prev, taxableIncomeError: null }))
    }
  }, [])

  // Step 3 bank correction handler (for incorrect_bank)
  const handleBankChange = useCallback((field: keyof BankCorrectionState, val: string) => {
    let cleanVal = val
    if (field === 'accountNumber') {
      cleanVal = val.replace(/\D/g, '').slice(0, 20)
    } else if (field === 'ifsc') {
      cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)
    }
    setBankCorrections((prev) => ({
      ...prev,
      [field]: cleanVal,
    }))

    if (field === 'accountNumber') {
      setErrors((prev) => ({ ...prev, bankAccountError: null }))
    } else if (field === 'ifsc') {
      setErrors((prev) => ({ ...prev, ifscError: null }))
    }
  }, [])

  // Step 4 document upload handlers
  const handleFileUpload = useCallback((docId: DocumentTypeId, file: File) => {
    const newDoc: UploadedDocument = {
      id: docId,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleTimeString(),
      file,
    }
    setUploadedDocuments((prev) => ({
      ...prev,
      [docId]: newDoc,
    }))
    setErrors((prev) => ({ ...prev, documentsError: null }))
  }, [])

  const handleFileRemove = useCallback((docId: DocumentTypeId) => {
    setUploadedDocuments((prev) => {
      const copy = { ...prev }
      delete copy[docId]
      return copy
    })
  }, [])

  // Navigation handlers  // Back / Cancel action
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

    if (step === 1 && isReturnFound) {
      setIsReturnFound(false)
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(routePaths.itr.root)
    }
  }, [step, isReturnFound, showPayment, isSubmitted, navigate])

  const handlePaymentSuccess = useCallback((result?: { paymentId?: string }) => {
    setShowPayment(false)
    setIsSubmitted(true)
    if (result?.paymentId) {
      setApplicationId('ITR-2026-' + result.paymentId.replace(/[^0-9]/g, '').slice(-5).padStart(5, '50983'))
    } else {
      setApplicationId('ITR-2026-50983')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleDownloadReceipt = useCallback(() => {
    const docCount = Object.keys(uploadedDocuments).length
    const content = [
      '==================================================',
      '           TAXEDGE REVISED ITR RECEIPT             ',
      '==================================================',
      '',
      `Application ID   : ${applicationId}`,
      `Original Ack No  : ${ackNumber || '987656789876789'}`,
      `Assessment Year  : ${selectedAy || 'AY 2025-26'}`,
      `Return Form      : Revised ITR (ITR-1)`,
      `Income Sources   : Revised Return Filing`,
      `Tax Regime       : New Tax Regime`,
      `Documents        : ${docCount} of 6 received`,
      `Refund Bank      : HDFC Bank ···· 1234`,
      `Filing Fee Paid  : ₹999 (Inclusive of 18% GST)`,
      `Submitted At     : ${new Date().toLocaleString('en-IN')}`,
      '',
      '--------------------------------------------------',
      'CURRENT STAGE: Stage 3 of 6 (CA Verification)',
      'Certified CA verifying original filing and revised declaration.',
      'SLA: 4-Hour CA Review with Notice Protection',
      '--------------------------------------------------',
      '',
      'Thank you for filing with TaxEdge.',
      'Support: support@taxedge.in | 1800-TAX-EDGE',
      '==================================================',
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `TaxEdge_Revised_ITR_${applicationId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [applicationId, ackNumber, selectedAy, uploadedDocuments])

  const goToStep = useCallback((targetStep: 1 | 2 | 3 | 4 | 5) => {
    setStep(targetStep)
    setShowPayment(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Continue action
  const handleContinue = useCallback(async () => {
    if (step === 1) {
      const ackErr = validateAckNumber(ackNumber)
      const ayErr = validateAssessmentYear(selectedAy)

      if (ackErr || ayErr) {
        setErrors({ ackError: ackErr, ayError: ayErr })
        return
      }

      setErrors({})

      if (!isReturnFound) {
        setIsLoading(true)
        try {
          const details = await revisedItrService.findOriginalReturn({
            ackNumber,
            assessmentYear: selectedAy,
          })
          setReturnDetails(details)
          setIsReturnFound(true)
        } finally {
          setIsLoading(false)
        }
        return
      }

      // If return already found, proceed to Step 2
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 2) {
      const validation = validateRevisionReason(selectedReason, otherReasonText)
      if (validation.reasonError || validation.otherReasonError) {
        setErrors({
          reasonError: validation.reasonError,
          otherReasonError: validation.otherReasonError,
        })
        return
      }

      setErrors({})
      // Proceed to Step 3
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 3) {
      if (selectedReason === 'wrong_deduction') {
        const deductionValidation = validateDeductionCorrections(deductionCorrections)
        if (deductionValidation.taxableIncomeError) {
          setErrors({
            taxableIncomeError: deductionValidation.taxableIncomeError,
          })
          return
        }
      } else if (selectedReason === 'incorrect_bank') {
        const bankValidation = validateBankCorrections(bankCorrections)
        if (bankValidation.bankAccountError || bankValidation.ifscError) {
          setErrors({
            bankAccountError: bankValidation.bankAccountError,
            ifscError: bankValidation.ifscError,
          })
          return
        }
      } else if (selectedReason === 'other') {
        const incomeValidation = validateIncomeCorrections(incomeCorrections)
        let bankErrors: { bankAccountError?: string | null; ifscError?: string | null } = {}
        if (bankCorrections.accountNumber.trim() || bankCorrections.ifsc.trim()) {
          bankErrors = validateBankCorrections(bankCorrections)
        }
        if (
          incomeValidation.salaryIncomeError ||
          incomeValidation.taxableIncomeError ||
          bankErrors.bankAccountError ||
          bankErrors.ifscError
        ) {
          setErrors({
            salaryIncomeError: incomeValidation.salaryIncomeError,
            taxableIncomeError: incomeValidation.taxableIncomeError,
            bankAccountError: bankErrors.bankAccountError,
            ifscError: bankErrors.ifscError,
          })
          return
        }
      } else {
        const incomeValidation = validateIncomeCorrections(incomeCorrections)
        if (incomeValidation.salaryIncomeError || incomeValidation.taxableIncomeError) {
          setErrors({
            salaryIncomeError: incomeValidation.salaryIncomeError,
            taxableIncomeError: incomeValidation.taxableIncomeError,
          })
          return
        }
      }

      setErrors({})
      // Proceed to Step 4
      setStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 4) {
      const docsError = validateRequiredDocuments(uploadedDocuments, selectedReason)
      if (docsError) {
        setErrors({ documentsError: docsError })
        return
      }

      setErrors({})
      // Proceed to Step 5: Review Revised ITR
      setStep(5)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 5) {
      // Proceed to Payment
      setShowPayment(true)
    }
  }, [step, ackNumber, selectedAy, isReturnFound, selectedReason, otherReasonText, incomeCorrections, deductionCorrections, bankCorrections, uploadedDocuments])

  return {
    step,
    showPayment,
    setShowPayment,
    isSubmitted,
    setIsSubmitted,
    applicationId,
    ackNumber,
    selectedAy,
    isDropdownOpen,
    isReturnFound,
    returnDetails,
    selectedReason,
    otherReasonText,
    incomeCorrections,
    deductionCorrections,
    bankCorrections,
    uploadedDocuments,
    isLoading,
    errors,
    dropdownRef,
    handleKeyDown,
    handleAckChange,
    handleSelectAy,
    handleToggleDropdown,
    handleCloseDropdown,
    handleSelectReason,
    handleOtherReasonChange,
    handleIncomeChange,
    handleDeductionChange,
    handleBankChange,
    handleFileUpload,
    handleFileRemove,
    handleBack,
    handleContinue,
    handlePaymentSuccess,
    handleDownloadReceipt,
    goToStep,
  }
}
