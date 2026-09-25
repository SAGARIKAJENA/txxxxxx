import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { BusinessLoanData } from '../types/businessLoan.types'

export const businessLoanValidation = {
  validateStep1: (data: BusinessLoanData): { isValid: boolean; error?: string } => {
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 100000, 5000000)) {
      return { isValid: false, error: 'Business loan amount must be between ₹1 Lakh and ₹50 Lakhs' }
    }
    if (!data.businessPurpose) {
      return { isValid: false, error: 'Please specify business loan purpose' }
    }
    if (data.repaymentTenureYears < 1 || data.repaymentTenureYears > 7) {
      return { isValid: false, error: 'Repayment tenure must be between 1 and 7 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: BusinessLoanData): { isValid: boolean; error?: string } => {
    if (!data.businessName || data.businessName.trim().length < 2) {
      return { isValid: false, error: 'Please enter enterprise / firm trade name' }
    }
    if (!data.constitution) {
      return { isValid: false, error: 'Please select business legal constitution' }
    }
    if (!data.yearsInBusiness) {
      return { isValid: false, error: 'Please select business vintage' }
    }
    if (!data.annualTurnover) {
      return { isValid: false, error: 'Please select annual turnover' }
    }
    if (data.gstRegistered && (!data.gstin || !commonLoanValidation.isValidGst(data.gstin))) {
      return { isValid: false, error: 'Please enter a valid 15-character GSTIN' }
    }
    return { isValid: true }
  },

  validateStep3: (data: BusinessLoanData): { isValid: boolean; error?: string } => {
    if (!data.primaryCurrentBank) {
      return { isValid: false, error: 'Please select primary current account bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.currentAccountNumber)) {
      return { isValid: false, error: 'Please enter a valid current account number' }
    }
    if (!commonLoanValidation.isValidIfsc(data.ifscCode)) {
      return { isValid: false, error: 'Please enter an 11-digit IFSC code' }
    }
    if (!commonLoanValidation.isValidPan(data.panNumber)) {
      return { isValid: false, error: 'Please enter a valid 10-character PAN' }
    }
    return { isValid: true }
  },

  validateStep4: (_data: BusinessLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
