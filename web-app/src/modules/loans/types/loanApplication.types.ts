export type LoanApplicationStatusType =
  | 'draft'
  | 'submitted'
  | 'in-progress'
  | 'agent-review'
  | 'under-review'
  | 'sanctioned'
  | 'disbursed'
  | 'rejected'

export interface LoanMilestoneItem {
  id: string
  title: string
  timestamp?: string
  status: 'completed' | 'current' | 'pending'
}

export interface LoanApplicationBase {
  id: string
  refNumber: string
  referenceNumber?: string
  loanType: string
  loanCategory: string
  applicantName?: string
  loanAmount: number
  tenureYears: number
  status: LoanApplicationStatusType
  statusLabel: string
  createdAt: string
  updatedAt: string
  milestones: LoanMilestoneItem[]
}
