import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { HomeLoanData } from '../types/homeLoan.types'

export const homeLoanValidation = {
  validateStep1: (data: HomeLoanData): { isValid: boolean; error?: string } => {
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 500000, 100000000)) {
      return { isValid: false, error: 'Please specify a valid loan amount between ₹5 Lakhs and ₹10 Crores' }
    }
    if (!data.propertyIntent) {
      return { isValid: false, error: 'Please select your property intent' }
    }
    if (data.repaymentTenureYears < 5 || data.repaymentTenureYears > 35) {
      return { isValid: false, error: 'Tenure must be between 5 and 35 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: HomeLoanData): { isValid: boolean; error?: string } => {
    if (!data.occupation) {
      return { isValid: false, error: 'Please select your occupation' }
    }
    if (!data.monthlyIncomeRange) {
      return { isValid: false, error: 'Please select monthly household income' }
    }
    return { isValid: true }
  },

  validateStep3: (data: HomeLoanData): { isValid: boolean; error?: string } => {
    if (!data.bankName) {
      return { isValid: false, error: 'Please select your operating bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.accountNumber)) {
      return { isValid: false, error: 'Please enter a valid bank account number' }
    }
    if (!commonLoanValidation.isValidIfsc(data.ifscCode)) {
      return { isValid: false, error: 'Please enter a valid 11-digit IFSC code' }
    }
    return { isValid: true }
  },

  validateStep4: (_data: HomeLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
