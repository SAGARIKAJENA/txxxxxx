import { commonLoanValidation } from '../../../validation/commonLoanValidation'
import type { ProjectFinanceData } from '../types/projectFinance.types'

export const projectFinanceValidation = {
  validateStep1: (data: ProjectFinanceData): { isValid: boolean; error?: string } => {
    if (!data.projectSector) {
      return { isValid: false, error: 'Please select project industry sector' }
    }
    if (!data.projectName || data.projectName.trim().length < 2) {
      return { isValid: false, error: 'Please enter official project name' }
    }
    if (!data.totalProjectCost) {
      return { isValid: false, error: 'Please enter total capital expenditure (CAPEX) cost' }
    }
    if (!commonLoanValidation.isValidAmount(data.debtSoughtAmount, 10000000, 1000000000)) {
      return { isValid: false, error: 'Project debt sought must be between ₹1 Crore and ₹100 Crores' }
    }
    if (data.repaymentTenureYears < 5 || data.repaymentTenureYears > 20) {
      return { isValid: false, error: 'Tenure must be between 5 and 20 years' }
    }
    return { isValid: true }
  },

  validateStep2: (data: ProjectFinanceData): { isValid: boolean; error?: string } => {
    if (!data.sponsorEntityName || data.sponsorEntityName.trim().length < 2) {
      return { isValid: false, error: 'Please enter project sponsor / parent company name' }
    }
    if (!data.promoterGroupNetWorth) {
      return { isValid: false, error: 'Please enter estimated promoter group net worth' }
    }
    return { isValid: true }
  },

  validateStep3: (data: ProjectFinanceData): { isValid: boolean; error?: string } => {
    if (!data.leadBankName) {
      return { isValid: false, error: 'Please select preferred lead syndication bank' }
    }
    if (!commonLoanValidation.isValidAccountNumber(data.currentAccountNumber)) {
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

  validateStep4: (_data: ProjectFinanceData): { isValid: boolean; error?: string } => {
    return { isValid: true }
  },
}
