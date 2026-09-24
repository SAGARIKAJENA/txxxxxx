import type {
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
} from '../validation/revisedItrValidation'

export const validateRevisedItrStep = (params: {
  step: 1 | 2 | 3 | 4 | 5
  ackNumber: string
  selectedAy: string
  selectedReason: RevisionReasonKey | null
  otherReasonText: string
  incomeCorrections: IncomeCorrectionState
  deductionCorrections: DeductionCorrectionState
  bankCorrections: BankCorrectionState
  uploadedDocuments: Partial<Record<DocumentTypeId, UploadedDocument>>
}): { isValid: boolean; errors: RevisedItrValidationErrors } => {
  const {
    step,
    ackNumber,
    selectedAy,
    selectedReason,
    otherReasonText,
    incomeCorrections,
    deductionCorrections,
    bankCorrections,
    uploadedDocuments,
  } = params

  if (step === 1) {
    const ackErr = validateAckNumber(ackNumber)
    const ayErr = validateAssessmentYear(selectedAy)
    if (ackErr || ayErr) {
      return { isValid: false, errors: { ackError: ackErr, ayError: ayErr } }
    }
    return { isValid: true, errors: {} }
  }

  if (step === 2) {
    const validation = validateRevisionReason(selectedReason, otherReasonText)
    if (validation.reasonError || validation.otherReasonError) {
      return {
        isValid: false,
        errors: {
          reasonError: validation.reasonError,
          otherReasonError: validation.otherReasonError,
        },
      }
    }
    return { isValid: true, errors: {} }
  }

  if (step === 3) {
    if (selectedReason === 'wrong_deduction') {
      const deductionValidation = validateDeductionCorrections(deductionCorrections)
      if (deductionValidation.taxableIncomeError) {
        return {
          isValid: false,
          errors: { taxableIncomeError: deductionValidation.taxableIncomeError },
        }
      }
    } else if (selectedReason === 'incorrect_bank') {
      const bankValidation = validateBankCorrections(bankCorrections)
      if (bankValidation.bankAccountError || bankValidation.ifscError) {
        return {
          isValid: false,
          errors: {
            bankAccountError: bankValidation.bankAccountError,
            ifscError: bankValidation.ifscError,
          },
        }
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
        return {
          isValid: false,
          errors: {
            salaryIncomeError: incomeValidation.salaryIncomeError,
            taxableIncomeError: incomeValidation.taxableIncomeError,
            bankAccountError: bankErrors.bankAccountError,
            ifscError: bankErrors.ifscError,
          },
        }
      }
    } else {
      const incomeValidation = validateIncomeCorrections(incomeCorrections)
      if (incomeValidation.salaryIncomeError || incomeValidation.taxableIncomeError) {
        return {
          isValid: false,
          errors: {
            salaryIncomeError: incomeValidation.salaryIncomeError,
            taxableIncomeError: incomeValidation.taxableIncomeError,
          },
        }
      }
    }
    return { isValid: true, errors: {} }
  }

  if (step === 4) {
    const docsError = validateRequiredDocuments(uploadedDocuments, selectedReason)
    if (docsError) {
      return { isValid: false, errors: { documentsError: docsError } }
    }
    return { isValid: true, errors: {} }
  }

  return { isValid: true, errors: {} }
}
