import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { PersonalLoanData } from '../types/personalLoan.types'

export const personalLoanValidation = {
  validateStep1: (data: PersonalLoanData): { isValid: boolean; error?: string } => {
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 50000, 2500000)) {
      return { isValid: false, error: 'Personal loan amount must be between ₹50,000 and ₹25 Lakhs' }
    }
    if (!data.loanPurpose) {
      return { isValid: false, error: 'Please select loan purpose' }
    }
    if (data.repaymentTenureYears < 1 || data.repaymentTenureYears > 5) {
      return { isValid: false, error: 'Repayment tenure must be between 1 and 5 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: PersonalLoanData): { isValid: boolean; error?: string } => {
    if (!data.occupation) {
      return { isValid: false, error: 'Please select occupation type' }
    }
    if (!data.employerName || data.employerName.trim().length < 2) {
      return { isValid: false, error: 'Please enter company or organization name' }
    }
    if (!data.monthlyTakeHomeSalary) {
      return { isValid: false, error: 'Please provide monthly take-home salary' }
    }
    return { isValid: true }
  },

  validateStep3: (data: PersonalLoanData): { isValid: boolean; error?: string } => {
    if (!data.salaryBankName) {
      return { isValid: false, error: 'Please select salary account bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.accountNumber)) {
      return { isValid: false, error: 'Please enter a valid bank account number' }
    }
    if (!commonLoanValidation.isValidIfsc(data.ifscCode)) {
      return { isValid: false, error: 'Please enter an 11-digit IFSC code' }
    }
    if (!commonLoanValidation.isValidPan(data.panNumber)) {
      return { isValid: false, error: 'Please enter a valid 10-character PAN number' }
    }
    return { isValid: true }
  },

  validateStep4: (_data: PersonalLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
