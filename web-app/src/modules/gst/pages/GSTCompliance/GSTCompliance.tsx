import React, { useState } from 'react'
import { useAppStore } from '@store/index'
import { GSTNoticeResponseFields } from '../../components/compliance/GSTComplianceCard/GSTNoticeResponseFields'
import { ComplianceDocPreviewModal } from '../../components/compliance/GSTComplianceCard/GSTComplianceDocPreviewModal'
import { GSTSubmitConfirmModal } from '../../components/compliance/GSTSubmitConfirmModal'
import { GSTSuccessView } from '../../components/compliance/GSTSuccessView'
import './GSTCompliance.css'

export type ComplianceRequestOption = 'Reconciliation Support' | 'Notice Response'

export const GSTCompliance: React.FC = () => {
  const pushToast = useAppStore((state) => state.pushToast)

  const [gstin, setGstin] = useState('')
  const [financialYear, setFinancialYear] = useState('')
  const [requestType, setRequestType] = useState<ComplianceRequestOption | ''>('')
  
  // Reconciliation fields state
  const [purchaseFile, setPurchaseFile] = useState<File | null>(null)
  const [salesFile, setSalesFile] = useState<File | null>(null)
  const [gstr2bRef, setGstr2bRef] = useState('')
  const [notes, setNotes] = useState('')

  // Document preview & confirmation modal state
  const [previewDoc, setPreviewDoc] = useState<{ file: File; title: string } | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const [errors, setErrors] = useState<{ gstin?: string; financialYear?: string; requestType?: string; purchaseFile?: string; salesFile?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')

  const handleGstinChange = (value: string) => {
    const uppercaseVal = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15)
    setGstin(uppercaseVal)
    if (errors.gstin) {
      setErrors((prev) => ({ ...prev, gstin: undefined }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const cleanGstin = gstin.trim()

    if (!cleanGstin) {
      newErrors.gstin = 'GSTIN is required'
    } else if (cleanGstin.length !== 15 && cleanGstin.length !== 10) {
      newErrors.gstin = 'Must be a 15-character GSTIN or 10-character PAN'
    }

    if (!financialYear) {
      newErrors.financialYear = 'Financial Year is required'
    }

    if (!requestType) {
      newErrors.requestType = 'Request Type is required'
    }

    if (requestType === 'Reconciliation Support') {
      if (!purchaseFile) newErrors.purchaseFile = 'Purchase Register file is required'
      if (!salesFile) newErrors.salesFile = 'Sales Register file is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsConfirmModalOpen(true)
  }

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false)
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const generatedId = `GST-${Math.floor(100000 + Math.random() * 900000)}`
      setApplicationId(generatedId)
      setIsSubmitted(true)
      pushToast(`GST Compliance request (${requestType}) submitted successfully!`, 'success')
    }, 600)
  }

  const handleReset = () => {
    setGstin('')
    setFinancialYear('')
    setRequestType('')
    setPurchaseFile(null)
    setSalesFile(null)
    setGstr2bRef('')
    setNotes('')
    setErrors({})
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <div className="gst-compliance-page">
        <div className="gst-compliance-wrapper">
          <GSTSuccessView
            applicationId={applicationId}
            requestType={requestType}
            gstin={gstin}
            onReset={handleReset}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="gst-compliance-page">
      <div className="gst-compliance-wrapper">
        {/* Header */}
        <div className="gst-compliance-header">
          <h1 className="gst-title">GST Compliance</h1>
          <p className="gst-subtitle">
            Submit your request for GST compliance. Our CA team will review and contact you.
          </p>
        </div>

        <div className="gst-compliance-grid">
          {/* Left Column: Form / Success */}
          <div className="gst-left-column">
            {/* Blue Alert Box */}
            <div className="gst-info-banner">
              <div className="info-banner-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="none" />
                  <path d="M12 16v-4m0-4h.01" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="info-banner-text">
                Need help with GST compliance? Select your request type and upload the required documents. Our CA team will review and contact you.
              </div>
            </div>

            {/* Form Container */}
            <div className="gst-form-container">
                <div className="gst-form-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#2563eb" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="card-title">Business &amp; Filing Details</h2>
                      <p className="card-subtitle">Provide your GST and filing information to proceed.</p>
                    </div>
                  </div>

                  <form id="gst-compliance-form" onSubmit={handleSubmit} noValidate className="gst-form">
                    {/* GSTIN Field */}
                    <div className="form-group">
                      <label htmlFor="gstin-input" className="form-label">
                        GSTIN <span className="req-asterisk">*</span>
                      </label>
                      <input
                        id="gstin-input"
                        type="text"
                        className={`form-input ${errors.gstin ? 'has-error' : ''}`}
                        placeholder="Enter 15-character GSTIN"
                        value={gstin}
                        onChange={(e) => handleGstinChange(e.target.value)}
                        maxLength={15}
                      />
                      {errors.gstin && <span className="form-error">{errors.gstin}</span>}
                    </div>

                    {/* Financial Year Field */}
                    <div className="form-group">
                      <label htmlFor="fy-select" className="form-label">
                        Financial Year <span className="req-asterisk">*</span>
                      </label>
                      <select
                        id="fy-select"
                        className={`form-select ${errors.financialYear ? 'has-error' : ''}`}
                        value={financialYear}
                        onChange={(e) => {
                          setFinancialYear(e.target.value)
                          if (errors.financialYear) {
                            setErrors((prev) => ({ ...prev, financialYear: undefined }))
                          }
                        }}
                      >
                        <option value="">Select Financial Year</option>
                        <option value="FY 2026-27">FY 2026-27</option>
                        <option value="FY 2025-26">FY 2025-26</option>
                        <option value="FY 2024-25">FY 2024-25</option>
                        <option value="FY 2023-24">FY 2023-24</option>
                      </select>
                      {errors.financialYear && <span className="form-error">{errors.financialYear}</span>}
                    </div>

                    {/* Request Type Field */}
                    <div className="form-group">
                      <label htmlFor="req-type-select" className="form-label">
                        Request Type <span className="req-asterisk">*</span>
                      </label>
                      <select
                        id="req-type-select"
                        className={`form-select ${errors.requestType ? 'has-error' : ''}`}
                        value={requestType}
                        onChange={(e) => {
                          const val = e.target.value as ComplianceRequestOption
                          setRequestType(val)
                          if (errors.requestType) {
                            setErrors((prev) => ({ ...prev, requestType: undefined }))
                          }
                        }}
                      >
                        <option value="">Select Request Type</option>
                        <option value="Reconciliation Support">Reconciliation Support</option>
                        <option value="Notice Response">Notice Response</option>
                      </select>
                      {errors.requestType && <span className="form-error">{errors.requestType}</span>}
                    </div>
                  </form>
                </div>

                {/* Dynamic Reconciliation Documents Section */}
                {requestType === 'Reconciliation Support' && (
                  <div className="recon-docs-container">
                    <h3 className="recon-section-title">Reconciliation Documents</h3>

                    {/* Purchase Register Card */}
                    <div className={`recon-doc-card ${errors.purchaseFile ? 'has-error' : ''}`}>
                      <div className="recon-doc-header">
                        <div className="recon-doc-title-box">
                          <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="20" height="20">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="recon-doc-name">Purchase Register</span>
                        </div>
                        <span className="badge-required">REQUIRED</span>
                      </div>

                      {!purchaseFile ? (
                        <div className="single-upload-wrapper">
                          <label className="btn-upload-file-orange">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setPurchaseFile(e.target.files[0])
                                  setErrors((prev) => ({ ...prev, purchaseFile: undefined }))
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                              <path d="M12 13v7" />
                              <polyline points="9 16 12 13 15 16" />
                            </svg>
                            <span>Upload File</span>
                          </label>
                        </div>
                      ) : (
                        <div className="uploaded-file-card">
                          <div className="uploaded-file-info">
                            <span className="file-check-badge">✓</span>
                            <span className="file-type-icon">📄</span>
                            <div className="file-details">
                              <span className="uploaded-filename">{purchaseFile.name}</span>
                              <span className="uploaded-filesize">{(purchaseFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <div className="uploaded-file-actions">
                            <button
                              type="button"
                              className="btn-file-action btn-view"
                              onClick={() => setPreviewDoc({ file: purchaseFile, title: 'Purchase Register' })}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View
                            </button>
                            <label className="btn-file-action btn-replace">
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setPurchaseFile(e.target.files[0])
                                  }
                                }}
                                style={{ display: 'none' }}
                              />
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                              </svg>
                              Replace
                            </label>
                            <button
                              type="button"
                              className="btn-file-action btn-delete"
                              onClick={() => setPurchaseFile(null)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                      {errors.purchaseFile && <span className="form-error">{errors.purchaseFile}</span>}
                    </div>

                    {/* Sales Register Card */}
                    <div className={`recon-doc-card ${errors.salesFile ? 'has-error' : ''}`}>
                      <div className="recon-doc-header">
                        <div className="recon-doc-title-box">
                          <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="20" height="20">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="recon-doc-name">Sales Register</span>
                        </div>
                        <span className="badge-required">REQUIRED</span>
                      </div>

                      {!salesFile ? (
                        <div className="single-upload-wrapper">
                          <label className="btn-upload-file-orange">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setSalesFile(e.target.files[0])
                                  setErrors((prev) => ({ ...prev, salesFile: undefined }))
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                              <path d="M12 13v7" />
                              <polyline points="9 16 12 13 15 16" />
                            </svg>
                            <span>Upload File</span>
                          </label>
                        </div>
                      ) : (
                        <div className="uploaded-file-card">
                          <div className="uploaded-file-info">
                            <span className="file-check-badge">✓</span>
                            <span className="file-type-icon">📄</span>
                            <div className="file-details">
                              <span className="uploaded-filename">{salesFile.name}</span>
                              <span className="uploaded-filesize">{(salesFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <div className="uploaded-file-actions">
                            <button
                              type="button"
                              className="btn-file-action btn-view"
                              onClick={() => setPreviewDoc({ file: salesFile, title: 'Sales Register' })}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View
                            </button>
                            <label className="btn-file-action btn-replace">
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setSalesFile(e.target.files[0])
                                  }
                                }}
                                style={{ display: 'none' }}
                              />
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                              </svg>
                              Replace
                            </label>
                            <button
                              type="button"
                              className="btn-file-action btn-delete"
                              onClick={() => setSalesFile(null)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                      {errors.salesFile && <span className="form-error">{errors.salesFile}</span>}
                    </div>

                    {/* GSTR-2B ARN input */}
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter GSTR-2B reference or ARN"
                        value={gstr2bRef}
                        onChange={(e) => setGstr2bRef(e.target.value)}
                      />
                    </div>

                    {/* CA Notes textarea */}
                    <div className="form-group">
                      <textarea
                        className="form-textarea"
                        rows={4}
                        placeholder="Tell us anything our CA should know..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Notice Response Section */}
                {requestType === 'Notice Response' && (
                  <GSTNoticeResponseFields
                    onPreviewDoc={(file, title) => setPreviewDoc({ file, title })}
                  />
                )}

                {/* Submit Request Button */}
                <div className="submit-btn-wrapper">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                    className="gst-btn-submit-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            </div>

          {/* Right Column: Helpful Info & Need Help */}
          <div className="gst-right-column">
            {/* Helpful Information Card */}
            <div className="side-card helpful-info-card">
              <div className="side-card-header">
                <span className="bulb-icon">💡</span>
                <h3 className="side-card-title">Helpful Information</h3>
              </div>
              <p className="helpful-subtitle">You can request support for:</p>
              <ul className="helpful-list">
                <li>
                  <span className="check-badge">✓</span>
                  <span>GST Return Filing Assistance</span>
                </li>
                <li>
                  <span className="check-badge">✓</span>
                  <span>Reconciliation Support</span>
                </li>
                <li>
                  <span className="check-badge">✓</span>
                  <span>Notice &amp; Reply Support</span>
                </li>
                <li>
                  <span className="check-badge">✓</span>
                  <span>Amendments / Corrections</span>
                </li>
                <li>
                  <span className="check-badge">✓</span>
                  <span>General GST Compliance Queries</span>
                </li>
              </ul>
              <p className="helpful-footer">
                Our CA team will review your request and get in touch with you.
              </p>
            </div>

            {/* Need Help Card */}
            <div className="side-card need-help-card">
              <div className="side-card-header">
                <span className="headset-icon">🎧</span>
                <h3 className="side-card-title">Need Help?</h3>
              </div>
              <p className="help-subtitle">
                Not sure which request type to select? Our CA team is here to guide you.
              </p>
              <button
                type="button"
                className="btn-contact-support"
                onClick={() => pushToast('Redirecting to CA Support team...', 'info')}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <ComplianceDocPreviewModal
          file={previewDoc.file}
          title={previewDoc.title}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Confirmation Modal */}
      <GSTSubmitConfirmModal
        isOpen={isConfirmModalOpen}
        requestType={requestType}
        gstin={gstin}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default GSTCompliance




