import React, { useState, useRef } from 'react'
import './GSTComplianceUploadFields.css'

interface GSTNoticeResponseFieldsProps {
  onPreviewDoc?: (file: File, title: string) => void
}

export const GSTNoticeResponseFields: React.FC<GSTNoticeResponseFieldsProps> = ({ onPreviewDoc }) => {
  const [noticeNumber, setNoticeNumber] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [noticeFile, setNoticeFile] = useState<File | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const issueDateInputRef = useRef<HTMLInputElement>(null)
  const dueDateInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNoticeFile(e.target.files[0])
    }
  }

  const openIssueDatePicker = () => {
    if (issueDateInputRef.current) {
      try {
        issueDateInputRef.current.showPicker()
      } catch {
        issueDateInputRef.current.focus()
      }
    }
  }

  const openDueDatePicker = () => {
    if (dueDateInputRef.current) {
      try {
        dueDateInputRef.current.showPicker()
      } catch {
        dueDateInputRef.current.focus()
      }
    }
  }

  const handleView = () => {
    if (!noticeFile) return
    if (onPreviewDoc) {
      onPreviewDoc(noticeFile, 'Department Notice Copy')
    } else {
      const url = URL.createObjectURL(noticeFile)
      window.open(url, '_blank')
    }
  }

  return (
    <div className="gst-notice-card">
      {/* Card Header */}
      <div className="gst-notice-header">
        <div className="gst-notice-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div>
          <h3 className="gst-notice-header-title">Notice Details &amp; Response</h3>
          <p className="gst-notice-header-sub">Provide the notice details and upload the required documents.</p>
        </div>
      </div>

      <div className="gst-notice-body">
        {/* Field 1: Notice Number */}
        <div className="gst-notice-field-group">
          <label className="gst-notice-label">
            Enter notice number <span className="req-asterisk">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter notice number"
            value={noticeNumber}
            onChange={(e) => setNoticeNumber(e.target.value)}
            className="gst-notice-input"
          />
        </div>

        {/* Field 2 & 3: Issue Date & Due Date (2-column row with right-aligned calendar icon) */}
        <div className="gst-notice-grid-row">
          <div className="gst-notice-field-group">
            <label className="gst-notice-label">
              Notice Issue Date <span className="req-asterisk">*</span>
            </label>
            <div className="gst-notice-date-wrapper" onClick={openIssueDatePicker}>
              <input
                ref={issueDateInputRef}
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="gst-notice-date-input"
              />
              <span className="gst-notice-date-icon" onClick={openIssueDatePicker}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
            </div>
          </div>

          <div className="gst-notice-field-group">
            <label className="gst-notice-label">
              Reply Due Date <span className="req-asterisk">*</span>
            </label>
            <div className="gst-notice-date-wrapper" onClick={openDueDatePicker}>
              <input
                ref={dueDateInputRef}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="gst-notice-date-input"
              />
              <span className="gst-notice-date-icon" onClick={openDueDatePicker}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Upload Notice Copy Card */}
        <div className="gst-notice-upload-section">
          <div className="gst-notice-upload-header">
            <div className="gst-notice-title-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="20" height="20">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="gst-notice-section-name">Upload Notice Copy</span>
            </div>
            <span className="badge-required-pill">REQUIRED</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg"
          />

          {!noticeFile ? (
            <div className="single-upload-wrapper">
              <label className="btn-upload-file-orange">
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg"
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
                  <span className="uploaded-filename">{noticeFile.name}</span>
                  <span className="uploaded-filesize">{(noticeFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
              <div className="uploaded-file-actions">
                <button
                  type="button"
                  className="btn-file-action btn-view"
                  onClick={handleView}
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
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
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
                  onClick={() => setNoticeFile(null)}
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
        </div>

        {/* Section 4: Additional Information */}
        <div className="gst-notice-field-group">
          <div className="gst-notice-title-box" style={{ marginBottom: '0.5rem' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="20" height="20">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="gst-notice-section-name">Additional Information</span>
          </div>
          <div className="gst-notice-textarea-wrapper">
            <textarea
              rows={4}
              maxLength={500}
              placeholder="Add any important information for our CA team..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="gst-notice-textarea"
            />
            <span className="gst-notice-char-counter">{additionalInfo.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  )
}


