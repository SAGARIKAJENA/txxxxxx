import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { VehicleLoanData } from '../types/vehicleLoan.types'

export const vehicleLoanValidation = {
  validateStep1: (data: VehicleLoanData): { isValid: boolean; error?: string } => {
    if (!data.vehicleCategory) {
      return { isValid: false, error: 'Please select vehicle category' }
    }
    if (!data.vehicleMakeModel || data.vehicleMakeModel.trim().length < 2) {
      return { isValid: false, error: 'Please specify vehicle make & model name' }
    }
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 50000, 10000000)) {
      return { isValid: false, error: 'Vehicle loan amount must be between ₹50,000 and ₹1 Crore' }
    }
    if (data.repaymentTenureYears < 1 || data.repaymentTenureYears > 7) {
      return { isValid: false, error: 'Tenure must be between 1 and 7 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: VehicleLoanData): { isValid: boolean; error?: string } => {
    if (!data.employmentType) {
      return { isValid: false, error: 'Please select your employment type' }
    }
    if (!data.monthlyIncome) {
      return { isValid: false, error: 'Please select monthly income range' }
    }
    return { isValid: true }
  },

  validateStep3: (data: VehicleLoanData): { isValid: boolean; error?: string } => {
    if (!data.bankName) {
      return { isValid: false, error: 'Please select your bank' }
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

  validateStep4: (_data: VehicleLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
