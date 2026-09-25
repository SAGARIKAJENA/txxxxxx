import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { MsmeLoanData } from '../types/msmeLoan.types'

export const msmeLoanValidation = {
  validateStep1: (data: MsmeLoanData): { isValid: boolean; error?: string } => {
    if (!data.schemeType) {
      return { isValid: false, error: 'Please select an MSME subsidized government scheme' }
    }
    if (!data.enterpriseCategory) {
      return { isValid: false, error: 'Please select MSME enterprise category' }
    }
    if (!data.udyamRegistrationNumber || data.udyamRegistrationNumber.trim().length < 5) {
      return { isValid: false, error: 'Please enter valid Udyam Registration Number' }
    }
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 100000, 50000000)) {
      return { isValid: false, error: 'MSME loan amount must be between ₹1 Lakh and ₹5 Crores' }
    }
    if (data.repaymentTenureYears < 1 || data.repaymentTenureYears > 7) {
      return { isValid: false, error: 'Repayment tenure must be between 1 and 7 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: MsmeLoanData): { isValid: boolean; error?: string } => {
    if (!data.enterpriseName || data.enterpriseName.trim().length < 2) {
      return { isValid: false, error: 'Please enter registered enterprise name' }
    }
    if (!data.businessActivity) {
      return { isValid: false, error: 'Please select primary business activity' }
    }
    if (!data.annualTurnover) {
      return { isValid: false, error: 'Please select annual turnover' }
    }
    return { isValid: true }
  },

  validateStep3: (data: MsmeLoanData): { isValid: boolean; error?: string } => {
    if (!data.primaryCurrentBank) {
      return { isValid: false, error: 'Please select operating current account bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.accountNumber)) {
      return { isValid: false, error: 'Please enter a valid bank account number' }
    }
    if (!commonLoanValidation.isValidIfsc(data.ifscCode)) {
      return { isValid: false, error: 'Please enter an 11-digit IFSC code' }
    }
    if (!commonLoanValidation.isValidPan(data.panNumber)) {
      return { isValid: false, error: 'Please enter a valid 10-character PAN' }
    }
    return { isValid: true }
  },

  validateStep4: (_data: MsmeLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
