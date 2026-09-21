import type {
  FindOriginalReturnPayload,
  OriginalReturnDetails,
  RevisionReasonOption,
} from '../types/revisedItr.types'

export const REVISION_REASONS: RevisionReasonOption[] = [
  {
    key: 'missed_income',
    title: 'Missed Income',
    subtitle: 'Income not included in the original return',
    icon: 'income',
  },
  {
    key: 'wrong_deduction',
    title: 'Wrong Deduction',
    subtitle: 'Incorrect or missed deduction',
    icon: 'deduction',
  },
  {
    key: 'incorrect_bank',
    title: 'Incorrect Bank Details',
    subtitle: 'Refund account needs correction',
    icon: 'bank',
  },
  {
    key: 'other',
    title: 'Other',
    subtitle: 'Something else',
    icon: 'other',
  },
]

export const revisedItrService = {
  /**
   * Simulates verification of original ITR from IT Portal
   */
  async findOriginalReturn(payload: FindOriginalReturnPayload): Promise<OriginalReturnDetails> {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 350))

    return {
      status: 'Verified from IT Portal',
      assessmentYear: payload.assessmentYear,
      itrForm: 'ITR-1',
      grossTotalIncome: '₹8,12,400',
      salaryOriginal: 812400,
      otherOriginal: 0,
      taxableOriginal: 492400,
      personalInfo: {
        fullName: 'Sagarika Jena',
        pan: 'XXXXX4743E',
        dob: '02-02-2000',
        mobile: '7008138785',
        email: 'jenasagarika5211@gmail.com',
        address: 'Ameerpet, Hyderabad, Telangana - 500018',
      },
    }
  },

  /**
   * Fetches supported reasons for revision
   */
  getRevisionReasons(): RevisionReasonOption[] {
    return REVISION_REASONS
  },
}
