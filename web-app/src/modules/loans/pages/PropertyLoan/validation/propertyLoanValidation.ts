import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { PropertyLoanData } from '../types/propertyLoan.types'

export const propertyLoanValidation = {
  validateStep1: (data: PropertyLoanData): { isValid: boolean; error?: string } => {
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 1000000, 100000000)) {
      return { isValid: false, error: 'Loan against property amount must be between ₹10 Lakhs and ₹10 Crores' }
    }
    if (!data.propertyType) {
      return { isValid: false, error: 'Please select mortgaged property type' }
    }
    if (!data.estimatedMarketValue || data.estimatedMarketValue.trim().length === 0) {
      return { isValid: false, error: 'Please enter estimated property market value' }
    }
    if (!data.propertyLocationCity || data.propertyLocationCity.trim().length < 2) {
      return { isValid: false, error: 'Please enter city where property is located' }
    }
    if (data.repaymentTenureYears < 5 || data.repaymentTenureYears > 20) {
      return { isValid: false, error: 'Tenure must be between 5 and 20 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: PropertyLoanData): { isValid: boolean; error?: string } => {
    if (!data.primaryIncomeSource) {
      return { isValid: false, error: 'Please select your primary income source' }
    }
    if (!data.monthlyHouseholdIncome) {
      return { isValid: false, error: 'Please select monthly household income' }
    }
    return { isValid: true }
  },

  validateStep3: (data: PropertyLoanData): { isValid: boolean; error?: string } => {
    if (!data.operatingBank) {
      return { isValid: false, error: 'Please select your operating bank' }
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

  validateStep4: (_data: PropertyLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
