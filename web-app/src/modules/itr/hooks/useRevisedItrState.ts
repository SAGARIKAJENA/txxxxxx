import { useState, useCallback, useRef, useEffect } from 'react'
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
  formatFileSize,
  sanitizeAckNumberInput,
  sanitizeNumericAmount,
  isNumericKeyAllowed,
} from '../validation/revisedItrValidation'

export interface RevisedItrDraftData {
  ackNumber?: string
  selectedAy?: string
  isReturnFound?: boolean
  returnDetails?: OriginalReturnDetails
  selectedReason?: RevisionReasonKey
  otherReasonText?: string
  incomeCorrections?: IncomeCorrectionState
  deductionCorrections?: DeductionCorrectionState
  bankCorrections?: BankCorrectionState
  uploadedDocuments?: Partial<Record<DocumentTypeId, UploadedDocument>>
}

export const useRevisedItrState = (existingDraft?: { formData?: RevisedItrDraftData } | null) => {
  // Step 1 State
  const [ackNumber, setAckNumber] = useState<string>(
    () => (existingDraft?.formData?.ackNumber as string) || ''
  )
  const [selectedAy, setSelectedAy] = useState<string>(
    () => (existingDraft?.formData?.selectedAy as string) || ''
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isReturnFound, setIsReturnFound] = useState<boolean>(
    () => Boolean(existingDraft?.formData?.isReturnFound)
  )
  const [returnDetails, setReturnDetails] = useState<OriginalReturnDetails | null>(
    () => (existingDraft?.formData?.returnDetails as OriginalReturnDetails) || null
  )

  // Step 2 State
  const [selectedReason, setSelectedReason] = useState<RevisionReasonKey | null>(
    () => (existingDraft?.formData?.selectedReason as RevisionReasonKey) || null
  )
  const [otherReasonText, setOtherReasonText] = useState<string>(
    () => (existingDraft?.formData?.otherReasonText as string) || ''
  )

  // Step 3 State
  const [incomeCorrections, setIncomeCorrections] = useState<IncomeCorrectionState>(
    () =>
      (existingDraft?.formData?.incomeCorrections as IncomeCorrectionState) || {
        salaryIncome: '',
        otherIncome: '',
        taxableIncome: '',
      }
  )
  const [deductionCorrections, setDeductionCorrections] = useState<DeductionCorrectionState>(
    () =>
      (existingDraft?.formData?.deductionCorrections as DeductionCorrectionState) || {
        section80c: '',
        section80d: '',
        homeLoanInterest: '',
        taxableIncome: '',
      }
  )
  const [bankCorrections, setBankCorrections] = useState<BankCorrectionState>(
    () =>
      (existingDraft?.formData?.bankCorrections as BankCorrectionState) || {
        accountNumber: '',
        ifsc: '',
      }
  )

  // Step 4 State
  const [uploadedDocuments, setUploadedDocuments] = useState<Partial<Record<DocumentTypeId, UploadedDocument>>>(
    () =>
      (existingDraft?.formData?.uploadedDocuments as Partial<Record<DocumentTypeId, UploadedDocument>>) || {}
  )

  // Shared UI / Async State
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<RevisedItrValidationErrors>({})

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleIncomeChange = useCallback((field: keyof IncomeCorrectionState, val: string) => {
    const cleanNumeric = sanitizeNumericAmount(val)
    setIncomeCorrections((prev) => ({ ...prev, [field]: cleanNumeric }))
    if (field === 'salaryIncome') {
      setErrors((prev) => ({ ...prev, salaryIncomeError: null }))
    } else if (field === 'taxableIncome') {
      setErrors((prev) => ({ ...prev, taxableIncomeError: null }))
    }
  }, [])

  const handleDeductionChange = useCallback((field: keyof DeductionCorrectionState, val: string) => {
    const cleanNumeric = sanitizeNumericAmount(val)
    setDeductionCorrections((prev) => ({ ...prev, [field]: cleanNumeric }))
    if (field === 'taxableIncome') {
      setErrors((prev) => ({ ...prev, taxableIncomeError: null }))
    }
  }, [])

  const handleBankChange = useCallback((field: keyof BankCorrectionState, val: string) => {
    let cleanVal = val
    if (field === 'accountNumber') {
      cleanVal = val.replace(/\D/g, '').slice(0, 20)
    } else if (field === 'ifsc') {
      cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)
    }
    setBankCorrections((prev) => ({ ...prev, [field]: cleanVal }))
    if (field === 'accountNumber') {
      setErrors((prev) => ({ ...prev, bankAccountError: null }))
    } else if (field === 'ifsc') {
      setErrors((prev) => ({ ...prev, ifscError: null }))
    }
  }, [])

  const handleFileUpload = useCallback((docId: DocumentTypeId, file: File) => {
    const newDoc: UploadedDocument = {
      id: docId,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleTimeString(),
      file,
    }
    setUploadedDocuments((prev) => ({ ...prev, [docId]: newDoc }))
    setErrors((prev) => ({ ...prev, documentsError: null }))
  }, [])

  const handleFileRemove = useCallback((docId: DocumentTypeId) => {
    setUploadedDocuments((prev) => {
      const copy = { ...prev }
      delete copy[docId]
      return copy
    })
  }, [])

  return {
    ackNumber,
    selectedAy,
    isDropdownOpen,
    isReturnFound,
    setIsReturnFound,
    returnDetails,
    setReturnDetails,
    selectedReason,
    otherReasonText,
    incomeCorrections,
    deductionCorrections,
    bankCorrections,
    uploadedDocuments,
    isLoading,
    setIsLoading,
    errors,
    setErrors,
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
  }
}
