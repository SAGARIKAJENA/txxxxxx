import React, { useRef, useState } from 'react'
import { StepActionBar } from '@shared/components'
import {
  type NoticeFormData,
  SUPPORTING_DOCUMENT_LIST,
  type SupportingDocumentItem,
} from '../types'
import './SupportingDocuments.css'

export interface SupportingDocumentsProps {
  formData: NoticeFormData
  onChange: (patch: Partial<NoticeFormData>) => void
  onNext: () => void
  onBack: () => void
  onSaveDraftAndExit: () => void
}

export const SupportingDocuments: React.FC<SupportingDocumentsProps> = ({
  formData,
  onChange,
  onNext,
  onBack,
  onSaveDraftAndExit,
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Initialize uploaded docs map from formData
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; fileSize: string }>>(() => {
    const initial: Record<string, { fileName: string; fileSize: string }> = {
      ...(formData.supportingDocuments || {}),
    }
    // Pre-populate tax-notice if uploaded in step 2
    if (formData.documentFileName && !initial['tax-notice']) {
      initial['tax-notice'] = {
        fileName: formData.documentFileName,
        fileSize: formData.documentFileSize || '2.4 MB',
      }
    }
    return initial
  })

  const [remarks, setRemarks] = useState(formData.remarks || '')

  const handleFileUpload = (docId: string, file: File) => {
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    const fileUrl = URL.createObjectURL(file)
    const updated = {
      ...uploadedDocs,
      [docId]: {
        fileName: file.name,
        fileSize: formattedSize,
        fileUrl,
      },
    }
    setUploadedDocs(updated)
    onChange({ supportingDocuments: updated })
  }

  const handleRemoveDocument = (docId: string) => {
    const updated = { ...uploadedDocs }
    delete updated[docId]
    setUploadedDocs(updated)
    onChange({ supportingDocuments: updated })
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]!.value = ''
    }
  }

  const handleViewDocument = (docId: string) => {
    const doc = uploadedDocs[docId]
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank')
    } else {
      alert(`Viewing ${doc?.fileName || 'document'}`)
    }
  }

  const handleReplaceDocument = (docId: string) => {
    fileInputRefs.current[docId]?.click()
  }

  const getDocColor = (id: string) => {
    switch (id) {
      case 'tax-notice':
      case 'previous-itr':
        return 'blue'
      case 'itr-ack':
      case 'form-16':
        return 'purple'
      case 'ais':
      case 'tis':
        return 'indigo'
      case 'bank-statements':
        return 'blue'
      case 'supporting-income':
      case 'supporting-expense':
        return 'orange'
      default:
        return 'blue'
    }
  }

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 500)
    setRemarks(val)
    onChange({ remarks: val })
  }

  const uploadedCount = Object.keys(uploadedDocs).length
  const totalCount = SUPPORTING_DOCUMENT_LIST.length
  const progressPercent = Math.min(100, Math.round((uploadedCount / totalCount) * 100))

  const requiredDocs = SUPPORTING_DOCUMENT_LIST.filter((d) => d.required)
  const missingRequiredDocs = requiredDocs.filter((d) => !uploadedDocs[d.id])
  const canProceed = missingRequiredDocs.length === 0

  const handleNextClick = () => {
    if (!canProceed) return
    onNext()
  }

  const getDocIcon = (id: string) => {
    switch (id) {
      case 'tax-notice':
      case 'form-16':
      case 'itr-ack':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      case 'ais':
      case 'supporting-income':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        )
      case 'bank-statements':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
          </svg>
        )
      case 'tis':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="16" y1="14" x2="16" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
        )
      case 'supporting-expense':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        )
      case 'previous-responses':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )
    }
  }

  return (
    <div className="supporting-docs-container">
      {/* Header Introduction */}
      <div className="notice-form__intro">
        <h2 className="notice-form__heading">Upload Supporting Documents</h2>
        <p className="notice-form__subheading">
          Upload the documents relevant to this notice. This enables our Tax Executive to verify figures and formulate your legal response.
        </p>
      </div>

      {/* Tracker Counter Bar */}
      <div className="supporting-docs-tracker">
        <div className="supporting-docs-tracker__header">
          <span>{uploadedCount} of {totalCount} documents uploaded</span>
          <span className="supporting-docs-tracker__count">{progressPercent}%</span>
        </div>
        <div className="supporting-docs-tracker__bar-track">
          <div
            className="supporting-docs-tracker__bar-fill"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Responsive 2-Column Grid of Document Items */}
      <div className="supporting-docs-list">
        {SUPPORTING_DOCUMENT_LIST.map((doc) => {
          const isUploaded = !!uploadedDocs[doc.id]
          const uploadInfo = uploadedDocs[doc.id]

          return (
            <div key={doc.id} className={`supporting-doc-item ${isUploaded ? 'supporting-doc-item--uploaded' : ''}`}>
              <input
                ref={(el) => {
                  fileInputRefs.current[doc.id] = el
                }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(doc.id, file)
                }}
              />

              {/* Main Card Content */}
              <div className="supporting-doc-item__main">
                <div className="supporting-doc-item__left">
                  <div className={`supporting-doc-item__icon-box supporting-doc-item__icon-box--${getDocColor(doc.id)}`}>
                    {getDocIcon(doc.id)}
                  </div>

                  <div className="supporting-doc-item__meta">
                    <span className="supporting-doc-item__title">
                      {doc.title} {doc.required && <span className="supporting-doc-item__required">*</span>}
                    </span>
                    <span className="supporting-doc-item__subtitle">{doc.subtitle}</span>
                    {isUploaded && (
                      <span className="supporting-doc-item__filename">
                        {uploadInfo.fileName} ({uploadInfo.fileSize})
                      </span>
                    )}
                  </div>
                </div>

                {isUploaded ? (
                  <div className="supporting-doc-item__uploaded-badge">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="supporting-doc-item__upload-btn"
                    onClick={() => fileInputRefs.current[doc.id]?.click()}
                  >
                    <svg className="supporting-doc-item__cloud-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                      <polyline points="9 14 12 11 15 14" />
                      <line x1="12" y1="11" x2="12" y2="17" />
                    </svg>
                    <span>Upload File</span>
                  </button>
                )}
              </div>

              {/* Uploaded Actions Footer Bar: View Document | Replace | Trash */}
              {isUploaded && (
                <>
                  <div className="supporting-doc-item__divider" />
                  <div className="supporting-doc-item__bottom-bar">
                    <button
                      type="button"
                      className="supporting-doc-item__action-link supporting-doc-item__action-link--view"
                      onClick={() => handleViewDocument(doc.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>View Document</span>
                    </button>

                    <span className="supporting-doc-item__divider-vertical" aria-hidden="true" />

                    <button
                      type="button"
                      className="supporting-doc-item__action-link supporting-doc-item__action-link--replace"
                      onClick={() => handleReplaceDocument(doc.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                      <span>Replace</span>
                    </button>

                    <span className="supporting-doc-item__divider-vertical" aria-hidden="true" />

                    <button
                      type="button"
                      className="supporting-doc-item__trash-btn"
                      onClick={() => handleRemoveDocument(doc.id)}
                      title="Delete document"
                      aria-label="Delete document"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Remarks / Special Instructions (Optional) */}
      <div className="supporting-docs-remarks">
        <label htmlFor="notice-remarks" className="supporting-docs-remarks__label">
          Remarks / Special Instructions (Optional)
        </label>
        <div className="supporting-docs-remarks__box">
          <textarea
            id="notice-remarks"
            className="supporting-docs-remarks__textarea"
            rows={3}
            placeholder="Add any additional context, transaction details, or explanation for our Tax Executive..."
            value={remarks}
            onChange={handleRemarksChange}
          />
          <span className="supporting-docs-remarks__counter">
            {remarks.length}/500
          </span>
        </div>
      </div>

      {/* Warning banner when required documents are missing */}
      {missingRequiredDocs.length > 0 && (
        <div className="supporting-docs-warning" role="alert">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Please upload all mandatory documents (*) to proceed ({missingRequiredDocs.length} remaining).
          </span>
        </div>
      )}

      {/* Bottom Step Action Bar */}
      <StepActionBar
        onBack={onBack}
        onSaveDraft={onSaveDraftAndExit}
        onNext={handleNextClick}
        backLabel="Back"
        nextLabel="Submit Documents & Review Response"
        nextDisabled={!canProceed}
      />
    </div>
  )
}

export default SupportingDocuments
