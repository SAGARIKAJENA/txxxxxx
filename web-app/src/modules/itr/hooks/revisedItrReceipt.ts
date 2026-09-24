import type { DocumentTypeId, UploadedDocument } from '../types/revisedItr.types'

export const downloadRevisedItrReceipt = (params: {
  applicationId: string
  ackNumber: string
  selectedAy: string
  uploadedDocuments: Partial<Record<DocumentTypeId, UploadedDocument>>
}) => {
  const { applicationId, ackNumber, selectedAy, uploadedDocuments } = params
  const docCount = Object.keys(uploadedDocuments).length
  const content = [
    '==================================================',
    '           TAXEDGE REVISED ITR RECEIPT             ',
    '==================================================',
    '',
    `Application ID   : ${applicationId}`,
    `Original Ack No  : ${ackNumber || '987656789876789'}`,
    `Assessment Year  : ${selectedAy || 'AY 2025-26'}`,
    `Return Form      : Revised ITR (ITR-1)`,
    `Income Sources   : Revised Return Filing`,
    `Tax Regime       : New Tax Regime`,
    `Documents        : ${docCount} of 6 received`,
    `Refund Bank      : HDFC Bank ···· 1234`,
    `Filing Fee Paid  : ₹999 (Inclusive of 18% GST)`,
    `Submitted At     : ${new Date().toLocaleString('en-IN')}`,
    '',
    '--------------------------------------------------',
    'CURRENT STAGE: Stage 3 of 6 (CA Verification)',
    'Certified CA verifying original filing and revised declaration.',
    'SLA: 4-Hour CA Review with Notice Protection',
    '--------------------------------------------------',
    '',
    'Thank you for filing with TaxEdge.',
    'Support: support@taxedge.in | 1800-TAX-EDGE',
    '==================================================',
  ].join('\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `TaxEdge_Revised_ITR_${applicationId}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
