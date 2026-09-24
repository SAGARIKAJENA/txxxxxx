import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { MachineryLoanData } from '../types/machineryLoan.types'

export const machineryLoanValidation = {
  validateStep1: (data: MachineryLoanData): { isValid: boolean; error?: string } => {
    if (!data.machineryType) {
      return { isValid: false, error: 'Please select machinery or equipment sector' }
    }
    if (!data.machineNameModel || data.machineNameModel.trim().length < 2) {
      return { isValid: false, error: 'Please enter machinery make and model' }
    }
    if (!data.supplierManufacturerName || data.supplierManufacturerName.trim().length < 2) {
      return { isValid: false, error: 'Please enter supplier or OEM manufacturer name' }
    }
    if (!commonLoanValidation.isValidAmount(data.loanAmount, 500000, 100000000)) {
      return { isValid: false, error: 'Machinery loan amount must be between ₹5 Lakhs and ₹10 Crores' }
    }
    if (data.repaymentTenureYears < 2 || data.repaymentTenureYears > 7) {
      return { isValid: false, error: 'Repayment tenure must be between 2 and 7 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: MachineryLoanData): { isValid: boolean; error?: string } => {
    if (!data.enterpriseName || data.enterpriseName.trim().length < 2) {
      return { isValid: false, error: 'Please enter manufacturing enterprise name' }
    }
    if (!data.factoryUnitLocation || data.factoryUnitLocation.trim().length < 2) {
      return { isValid: false, error: 'Please enter factory or plant location' }
    }
    if (!data.annualTurnover) {
      return { isValid: false, error: 'Please select annual turnover' }
    }
    return { isValid: true }
  },

  validateStep3: (data: MachineryLoanData): { isValid: boolean; error?: string } => {
    if (!data.primaryCurrentBank) {
      return { isValid: false, error: 'Please select primary current account bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.accountNumber)) {
      return { isValid: false, error: 'Please enter a valid bank account number' }
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

  validateStep4: (_data: MachineryLoanData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
