import React, { useRef, useState } from 'react'
import { StepActionBar } from '@shared/components'
import type { NoticeFormData } from './types'

interface NoticeStep2UploadProps {
  formData: NoticeFormData
  onChange: (patch: Partial<NoticeFormData>) => void
  onBack: () => void
  onSubmit: () => void
  onSaveDraftAndExit: () => void
  isSubmitting: boolean
}

export const NoticeStep2Upload: React.FC<NoticeStep2UploadProps> = ({
  formData,
  onChange,
  onBack,
  onSubmit,
  onSaveDraftAndExit,
  isSubmitting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.')
      return
    }

    setUploadError(null)
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    onChange({
      documentFile: file,
      documentFileName: file.name,
      documentFileSize: formattedSize,
    })
  }

  const handleRemoveFile = () => {
    onChange({
      documentFile: null,
      documentFileName: '',
      documentFileSize: '',
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Not Provided'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="notice-upload-container">
      {/* Step Progress Bar */}
      <div className="notice-progress">
        <div className="notice-progress__bars">
          <div className="notice-progress__bar notice-progress__bar--active" />
          <div className="notice-progress__bar notice-progress__bar--active" />
        </div>
        <span className="notice-progress__label">STEP 2 OF 2: UPLOAD NOTICE</span>
      </div>

      {/* Heading Section */}
      <div className="notice-form__intro">
        <h2 className="notice-form__heading">Upload your Income Tax notice</h2>
        <p className="notice-form__subheading">
          Upload the official notice PDF or clear photograph. Our team will cross-verify the document details with your information.
        </p>
      </div>

      {/* 2-Column Grid for Web View */}
      <div className="notice-step2-grid">
        <div className="notice-step2-col notice-step2-col--left">
          {/* Upload Card */}
          <div className="notice-upload-card">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="notice-upload-card__content">
              <div className="notice-upload-card__icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>

              <div className="notice-upload-card__meta">
                <span className="notice-upload-card__title">Notice Document</span>
                <span className="notice-upload-card__subtitle">
                  {formData.documentFileName
                    ? `${formData.documentFileName} (${formData.documentFileSize})`
                    : 'PDF, JPG or PNG • Up to 10 MB'}
                </span>
              </div>

              {formData.documentFileName ? (
                <button
                  type="button"
                  className="notice-upload-card__btn notice-upload-card__btn--remove"
                  onClick={handleRemoveFile}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="notice-upload-card__btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </button>
              )}
            </div>

            {uploadError && <span className="notice-upload-card__error">{uploadError}</span>}
          </div>

          {/* Confidentiality Callout Box */}
          <div className="notice-trust-card">
            <div className="notice-trust-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <p className="notice-trust-card__text">
              Your notice is kept strictly confidential and processed by certified tax experts under end-to-end encryption.
            </p>
          </div>
        </div>

        <div className="notice-step2-col notice-step2-col--right">
          {/* Summary Box (Entered Notice Information) */}
          <div className="notice-summary-card">
            <h3 className="notice-summary-card__title">Entered Notice Information</h3>

            <div className="notice-summary-card__rows">
              <div className="notice-summary-card__row">
                <span className="notice-summary-card__label">PAN:</span>
                <span className="notice-summary-card__value notice-summary-card__value--bold">
                  {formData.pan || '—'}
                </span>
              </div>

              <div className="notice-summary-card__row">
                <span className="notice-summary-card__label">Assessment Year:</span>
                <span className="notice-summary-card__value">{formData.assessmentYear}</span>
              </div>

              <div className="notice-summary-card__row">
                <span className="notice-summary-card__label">Notice Type:</span>
                <span className="notice-summary-card__value notice-summary-card__value--wrap">
                  {formData.noticeType}
                </span>
              </div>

              <div className="notice-summary-card__row">
                <span className="notice-summary-card__label">Notice Date:</span>
                <span className="notice-summary-card__value">{formatDateDisplay(formData.noticeDate)}</span>
              </div>

              <div className="notice-summary-card__row">
                <span className="notice-summary-card__label">Response Due Date:</span>
                <span className="notice-summary-card__value notice-summary-card__value--highlight">
                  {formatDateDisplay(formData.responseDueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Action Bar matching requested bottom section */}
      <StepActionBar
        onBack={onBack}
        onNext={onSubmit}
        backLabel="Back"
        nextLabel="Continue"
        isSubmitting={isSubmitting}
        extraActions={
          <button
            type="button"
            className="step-action-bar__btn step-action-bar__btn--save-draft"
            onClick={onSaveDraftAndExit}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Save Draft &amp; Exit</span>
          </button>
        }
      />
    </div>
  )
}
