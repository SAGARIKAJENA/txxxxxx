/**
 * Public surface of the GST module. Other modules import from here only.
 */
export { gstRoutes } from './routes'
export {
  GSTAmendmentHeader,
  GSTAmendmentForm,
  GSTAmendmentSubmitted,
} from './pages/GSTAmendment'
export {
  GSTCertificateHeader,
  GSTCertificateForm,
  GSTCertificateSubmitted,
} from './pages/GSTCertificate'
export { useGstApplication } from './hooks/useGstApplication'
export { useGstReturns } from './hooks/useGstReturns'
export { gstService } from './services/gstService'
export type {
  GstApplication,
  GstReturn,
  GstReturnType,
  GstAmendmentPayload,
  GstAmendmentRecord,
  GstAmendmentFieldKey,
  GstCertificatePayload,
  GstCertificateRecord,
} from './types/gst.types'
