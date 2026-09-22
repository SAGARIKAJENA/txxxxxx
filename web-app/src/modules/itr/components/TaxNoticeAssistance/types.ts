export interface NoticeFormData {
  pan: string
  assessmentYear: string
  noticeType: string
  noticeDate: string
  noticeReference: string
  responseDueDate: string
  explanation: string
  documentFile: File | null
  documentFileName: string
  documentFileSize: string
}

export const ASSESSMENT_YEAR_OPTIONS = [
  'AY 2026-27',
  'AY 2025-26',
  'AY 2024-25',
  'AY 2023-24',
  'AY 2022-23',
]

export const NOTICE_TYPE_OPTIONS = [
  'Section 143(1)(a) - Proposed Adjustment',
  'Section 139(9) - Defective Return',
  'Section 142(1) - Inquiry Before Assessment',
  'Section 148 - Income Escaping Assessment',
  'Section 156 - Notice of Demand',
  'Section 245 - Intimation for Adjustment of Refund',
  'Section 143(2) - Scrutiny Assessment',
  'Other Notice / IT Communication',
]
