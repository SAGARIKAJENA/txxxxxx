import type {
  RevisionReasonKey,
  IncomeCorrectionState,
  DeductionCorrectionState,
  BankCorrectionState,
  DocumentTypeId,
  UploadedDocument,
} from '../types/revisedItr.types'

/**
 * Validates Original ITR Acknowledgement Number
 * Must be non-empty and exactly 15 numeric digits.
 */
export const validateAckNumber = (val: string): string | null => {
  const trimmed = val.trim()
  if (!trimmed) {
    return 'Original ITR Acknowledgement Number is required.'
  }
  if (!/^\d{15}$/.test(trimmed)) {
    return `Acknowledgement number must be exactly 15 digits (${trimmed.length}/15 entered).`
  }
  return null
}

/**
 * Validates Assessment Year selection
 */
export const validateAssessmentYear = (val: string): string | null => {
  if (!val || !val.trim()) {
    return 'Please select an Assessment Year.'
  }
  return null
}

/**
 * Sanitizes input string to contain only digits, capped at 15 characters.
 */
export const sanitizeAckNumberInput = (val: string): string => {
  return val.replace(/\D/g, '').slice(0, 15)
}

/**
 * Sanitizes currency input to contain only numeric digits
 */
export const sanitizeNumericAmount = (val: string): string => {
  return val.replace(/\D/g, '')
}

/**
 * Formats byte count to readable string (e.g. "1.2 MB" or "450 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Keypress filter to prevent non-digit input.
 */
export const isNumericKeyAllowed = (key: string, isCtrlOrMeta: boolean): boolean => {
  const allowedControlKeys = [
    'Backspace',
    'Tab',
    'Enter',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]
  if (allowedControlKeys.includes(key) || isCtrlOrMeta) {
    return true
  }
  return /^\d$/.test(key)
}

/**
 * Validates Revision Reason selection and conditional "other" reason field
 */
export const validateRevisionReason = (
  reason: RevisionReasonKey | null,
  otherText: string
): { reasonError?: string | null; otherReasonError?: string | null } => {
  if (!reason) {
    return { reasonError: 'Please select a reason for revising your ITR.', otherReasonError: null }
  }

  if (reason === 'other') {
    if (!otherText.trim()) {
      return { reasonError: null, otherReasonError: 'Please specify your reason for revision.' }
    }
  }

  return { reasonError: null, otherReasonError: null }
}

/**
 * Validates Step 3 Income Correction required fields:
 * - Salary / Business income * is required
 * - Taxable income * is required
 */
export const validateIncomeCorrections = (
  values: IncomeCorrectionState
): { salaryIncomeError?: string | null; taxableIncomeError?: string | null } => {
  let salaryIncomeError: string | null = null
  let taxableIncomeError: string | null = null

  if (!values.salaryIncome || !values.salaryIncome.trim()) {
    salaryIncomeError = 'Salary / Business income is required.'
  }

  if (!values.taxableIncome || !values.taxableIncome.trim()) {
    taxableIncomeError = 'Taxable income is required.'
  }

  return { salaryIncomeError, taxableIncomeError }
}

/**
 * Validates Step 3 Deduction Correction required fields:
 * - Taxable income * is required
 */
export const validateDeductionCorrections = (
  values: DeductionCorrectionState
): { taxableIncomeError?: string | null } => {
  let taxableIncomeError: string | null = null

  if (!values.taxableIncome || !values.taxableIncome.trim()) {
    taxableIncomeError = 'Taxable income is required.'
  }

  return { taxableIncomeError }
}

/**
 * Validates Step 3 Bank Details Correction:
 * - Bank account number * is required
 * - IFSC * is required
 */
export const validateBankCorrections = (
  values: BankCorrectionState
): { bankAccountError?: string | null; ifscError?: string | null } => {
  let bankAccountError: string | null = null
  let ifscError: string | null = null

  if (!values.accountNumber || !values.accountNumber.trim()) {
    bankAccountError = 'Bank account number is required.'
  }

  const trimmedIfsc = values.ifsc?.trim() || ''
  if (!trimmedIfsc) {
    ifscError = 'IFSC is required.'
  } else if (!/^[A-Z0-9]{11}$/i.test(trimmedIfsc)) {
    ifscError = 'Please enter a valid 11-character IFSC code.'
  }

  return { bankAccountError, ifscError }
}

/**
 * Calculates the difference between revised and original income values.
 */
export const calculateIncomeChange = (
  original: number,
  revisedStr: string
): { changeText: string; tone: 'positive' | 'negative' | 'neutral' } => {
  if (!revisedStr || !revisedStr.trim()) {
    return { changeText: '—', tone: 'neutral' }
  }

  const revisedNum = Number(revisedStr)
  if (isNaN(revisedNum)) {
    return { changeText: '—', tone: 'neutral' }
  }

  const diff = revisedNum - original
  if (diff === 0) {
    return { changeText: '₹ 0', tone: 'neutral' }
  }

  const formattedAbs = new Intl.NumberFormat('en-IN').format(Math.abs(diff))
  if (diff > 0) {
    return { changeText: `+₹ ${formattedAbs}`, tone: 'positive' }
  }

  return { changeText: `-₹ ${formattedAbs}`, tone: 'negative' }
}

/**
 * Validates Step 4 Document Uploads based on revision reason:
 * - For wrong_deduction: PAN Card, Aadhaar Card, and Investment Proofs are required.
 * - For incorrect_bank: PAN Card, Aadhaar Card, and Bank Statements are required.
 * - For missed_income and other: PAN Card, Aadhaar Card, Form 16, and AIS/TIS are required.
 */
export const validateRequiredDocuments = (
  uploads: Partial<Record<DocumentTypeId, UploadedDocument>>,
  selectedReason?: RevisionReasonKey | null
): string | null => {
  const requiredIds: { id: DocumentTypeId; label: string }[] =
    selectedReason === 'wrong_deduction'
      ? [
          { id: 'pan', label: 'PAN Card' },
          { id: 'aadhaar', label: 'Aadhaar Card' },
          { id: 'investment_proof', label: 'Investment Proofs' },
        ]
      : selectedReason === 'incorrect_bank'
      ? [
          { id: 'pan', label: 'PAN Card' },
          { id: 'aadhaar', label: 'Aadhaar Card' },
          { id: 'bank_statement', label: 'Bank Statements' },
        ]
      : selectedReason === 'other'
      ? [
          { id: 'pan', label: 'PAN Card' },
          { id: 'aadhaar', label: 'Aadhaar Card' },
        ]
      : [
          { id: 'pan', label: 'PAN Card' },
          { id: 'aadhaar', label: 'Aadhaar Card' },
          { id: 'form16', label: 'Form 16 / Form 16A' },
          { id: 'ais_tis', label: 'AIS and TIS Statement' },
        ]

  const missing = requiredIds.filter(({ id }) => !uploads[id])
  if (missing.length > 0) {
    return `Please upload all required documents: ${missing.map((m) => m.label).join(', ')}.`
  }

  return null
}

/**
 * Calculates progressive Indian Income Tax + 4% Cess based on taxable income.
 * Incorporates standard progressive slabs with statutory 4% Health & Education Cess
 * and surcharge on high income brackets.
 */
export const calculateTaxLiability = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0

  let baseTax = 0
  if (taxableIncome <= 250000) {
    baseTax = 0
  } else if (taxableIncome <= 500000) {
    baseTax = (taxableIncome - 250000) * 0.05
  } else if (taxableIncome <= 1000000) {
    baseTax = 12500 + (taxableIncome - 500000) * 0.20
  } else {
    baseTax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30
  }

  // Surcharge for High Net Worth Incomes
  let surcharge = 0
  if (taxableIncome > 50000000) {
    surcharge = baseTax * 0.25 // > 5 Crore
  } else if (taxableIncome > 20000000) {
    surcharge = baseTax * 0.25 // > 2 Crore
  } else if (taxableIncome > 10000000) {
    surcharge = baseTax * 0.15 // > 1 Crore
  } else if (taxableIncome > 5000000) {
    surcharge = baseTax * 0.10 // > 50 Lakhs
  }

  const totalWithSurcharge = baseTax + surcharge
  const cess = totalWithSurcharge * 0.04

  return Math.round(totalWithSurcharge + cess)
}
