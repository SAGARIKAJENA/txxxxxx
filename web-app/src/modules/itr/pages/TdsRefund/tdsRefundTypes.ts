export interface TdsIncomeTaxData {
  taxRegime?: 'new' | 'old' | null
  regime?: string | null
  salaryIncome: string
  grossSalary?: string
  otherIncome: string
  interestIncome: string
  rentalIncome?: boolean | null
  capitalGains?: boolean | null
  businessIncome?: boolean | null
  homeLoanInterest?: boolean | null
  taxDeductions?: boolean | null
  annualRent?: string
  propertyTaxes?: string
  stcg?: string
  ltcg?: string
  turnover?: string
  netProfit?: string
  homeLoanInterestAmount?: string
  deduction80C?: string
  sec80C?: string
  deduction80D?: string
  sec80D?: string
  totalTdsDeducted: string
  tdsDeducted?: string
  tcsAmount: string
  tcsCollected?: string
  advanceTax: string
  selfAssessmentTax: string
}
