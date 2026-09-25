import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { WorkingCapitalLoanData } from '../types/workingCapitalLoan.types'

export const workingCapitalLoanValidation = {
  validateStep1: (data: WorkingCapitalLoanData): { isValid: boolean; error?: string } => {
    if (!data.facilityType) {
      return { isValid: false, error: 'Please select working capital facility type' }
    }
    if (!commonLoanValidation.isValidAmount(data.requestedLimit, 1000000, 200000000)) {
      return { isValid: false, error: 'Working capital facility limit must be between ₹10 Lakhs and ₹20 Crores' }
    }
    if (!data.primaryCollateralOffered) {
      return { isValid: false, error: 'Please specify primary collateral or security offered' }
    }
    return { isValid: true }
  },

  validateStep2: (data: WorkingCapitalLoanData): { isValid: boolean; error?: string } => {
    if (!data.businessName || data.businessName.trim().length < 2) {
      return { isValid: false, error: 'Please enter registered enterprise name' }
    }
    if (!data.currentAnnualRevenue) {
      return { isValid: false, error: 'Please select annual sales turnover' }
    }
    if (!data.estimatedStockValue) {
      return { isValid: false, error: 'Please provide average paid stock valuation' }
    }
    return { isValid: true }
  },

  validateStep3: (data: WorkingCapitalLoanData): { isValid: boolean; error?: string } => {
    if (!data.primaryConsortiumBank) {
      return { isValid: false, error: 'Please select operating current account bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.currentAccountNumber)) {
      return { isValid: false, error: 'Please enter a valid current account number' }
    }
    if (!commonLoanValidation.isValidIfsc(data.ifscCode)) {
      return { isValid: false, error: 'Please enter an 11-digit IFSC code' }
    }
    if (!commonLoanValidation.isValidGst(data.gstin)) {
      return { isValid: false, error: 'Please enter a valid 15-character GSTIN' }
    }
    if (!commonLoanValidation.isValidPan(data.panNumber)) {
      return { isValid: false, error: 'Please enter a valid 10-character PAN' }
    }
    return { isValid: true }
  },

  validateStep4: (_data: WorkingCapitalLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
