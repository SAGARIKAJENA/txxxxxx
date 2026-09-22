import React, { useState } from 'react'
import { StepActionBar } from '@shared/components'
import {
  type NoticeFormData,
  ASSESSMENT_YEAR_OPTIONS,
  NOTICE_TYPE_OPTIONS,
} from './types'

interface NoticeStep1DetailsProps {
  formData: NoticeFormData
  onChange: (patch: Partial<NoticeFormData>) => void
  onNext: () => void
  onBack: () => void
  onSaveDraftAndExit: () => void
}

export const NoticeStep1Details: React.FC<NoticeStep1DetailsProps> = ({
  formData,
  onChange,
  onNext,
  onBack,
  onSaveDraftAndExit,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const panValid = !formData.pan || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.trim().toUpperCase())
  const hasPan = formData.pan.trim().length === 10 && panValid
  const hasNoticeDate = formData.noticeDate.trim().length > 0
  const hasNoticeRef = formData.noticeReference.trim().length > 0
  const hasDueDate = formData.responseDueDate.trim().length > 0
  const hasExplanation = formData.explanation.trim().length > 0

  const canProceed = hasPan && hasNoticeDate && hasNoticeRef && hasDueDate && hasExplanation

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      pan: true,
      noticeDate: true,
      noticeReference: true,
      responseDueDate: true,
      explanation: true,
    })

    if (canProceed) {
      onNext()
    }
  }

  return (
    <form className="notice-form" onSubmit={handleSubmit} noValidate>
      {/* Step Progress Bar */}
      <div className="notice-progress">
        <div className="notice-progress__bars">
          <div className="notice-progress__bar notice-progress__bar--active" />
          <div className="notice-progress__bar" />
        </div>
        <span className="notice-progress__label">STEP 1 OF 2: NOTICE DETAILS</span>
      </div>

      {/* Heading Section */}
      <div className="notice-form__intro">
        <h2 className="notice-form__heading">Enter Notice Information</h2>
        <p className="notice-form__subheading">
          Provide details from your notice. This helps our Tax Executive analyze the legal sections and prepare your defense.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div className="notice-form__grid">
        {/* PAN Field */}
        <div className="notice-field">
          <label htmlFor="notice-pan" className="notice-field__label">
            Permanent Account Number (PAN) <span className="notice-field__required">*</span>
          </label>
        <input
          id="notice-pan"
          type="text"
          maxLength={10}
          className={`notice-field__input ${touched.pan && !hasPan ? 'notice-field__input--error' : ''}`}
          placeholder="e.g. CASPJ4743E"
          value={formData.pan}
          onChange={(e) => onChange({ pan: e.target.value.toUpperCase() })}
          onBlur={() => handleBlur('pan')}
          autoCapitalize="characters"
        />
        {touched.pan && !hasPan && (
          <span className="notice-field__error">Please enter a valid 10-character PAN (e.g. ABCDE1234F).</span>
        )}
      </div>

      {/* Assessment Year Field */}
      <div className="notice-field">
        <label htmlFor="notice-ay" className="notice-field__label">
          Assessment Year (AY) <span className="notice-field__required">*</span>
        </label>
        <div className="notice-field__select-wrapper">
          <select
            id="notice-ay"
            className="notice-field__select"
            value={formData.assessmentYear}
            onChange={(e) => onChange({ assessmentYear: e.target.value })}
          >
            {ASSESSMENT_YEAR_OPTIONS.map((ay) => (
              <option key={ay} value={ay}>
                {ay}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="notice-field__select-icon">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Notice Type / Section Field */}
      <div className="notice-field">
        <label htmlFor="notice-type" className="notice-field__label">
          Notice Type / Section <span className="notice-field__required">*</span>
        </label>
        <div className="notice-field__select-wrapper">
          <select
            id="notice-type"
            className="notice-field__select"
            value={formData.noticeType}
            onChange={(e) => onChange({ noticeType: e.target.value })}
          >
            {NOTICE_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="notice-field__select-icon">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Notice Date Field */}
      <div className="notice-field">
        <label htmlFor="notice-date" className="notice-field__label">
          Notice Date <span className="notice-field__required">*</span>
        </label>
        <div className="notice-field__date-wrapper">
          <input
            id="notice-date"
            type="date"
            className={`notice-field__input notice-field__input--date ${
              touched.noticeDate && !hasNoticeDate ? 'notice-field__input--error' : ''
            }`}
            value={formData.noticeDate}
            onChange={(e) => onChange({ noticeDate: e.target.value })}
            onBlur={() => handleBlur('noticeDate')}
          />
        </div>
        <span className="notice-field__help-text">
          Date of issuance stated on the top right of your notice
        </span>
      </div>

      {/* Notice Reference Number / DIN */}
      <div className="notice-field">
        <label htmlFor="notice-ref" className="notice-field__label">
          Notice Reference Number / DIN <span className="notice-field__required">*</span>
        </label>
        <input
          id="notice-ref"
          type="text"
          className={`notice-field__input ${
            touched.noticeReference && !hasNoticeRef ? 'notice-field__input--error' : ''
          }`}
          placeholder="e.g. CPC/2526/A3/284419260 or DIN"
          value={formData.noticeReference}
          onChange={(e) => onChange({ noticeReference: e.target.value })}
          onBlur={() => handleBlur('noticeReference')}
        />
        <span className="notice-field__help-text">
          Document Identification Number (DIN) or CPC Communication number
        </span>
      </div>

      {/* Response Due Date Field */}
      <div className="notice-field">
        <label htmlFor="notice-due-date" className="notice-field__label">
          Response Due Date <span className="notice-field__required">*</span>
        </label>
        <div className="notice-field__date-wrapper">
          <input
            id="notice-due-date"
            type="date"
            className={`notice-field__input notice-field__input--date ${
              touched.responseDueDate && !hasDueDate ? 'notice-field__input--error' : ''
            }`}
            value={formData.responseDueDate}
            onChange={(e) => onChange({ responseDueDate: e.target.value })}
            onBlur={() => handleBlur('responseDueDate')}
          />
        </div>
        <span className="notice-field__help-text">
          Last date allowed by the IT Department to file response (typically 15-30 days)
        </span>
      </div>

      {/* Explanation Field */}
      <div className="notice-field notice-field--full">
        <label htmlFor="notice-explanation" className="notice-field__label">
          Your Explanation / Background <span className="notice-field__required">*</span>
        </label>
        <textarea
          id="notice-explanation"
          rows={3}
          className={`notice-field__textarea ${
            touched.explanation && !hasExplanation ? 'notice-field__input--error' : ''
          }`}
          placeholder="Describe your case, income sources, reason for discrepancy, or if you already paid taxes..."
          value={formData.explanation}
          onChange={(e) => onChange({ explanation: e.target.value })}
          onBlur={() => handleBlur('explanation')}
        />
      </div>

      {/* Info Callout Card */}
      <div className="notice-info-card notice-info-card--full">
        <div className="notice-info-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <p className="notice-info-card__text">
          You can find the DIN, notice date, and assessment year on the top portion of your Income Tax communication.
        </p>
      </div>
    </div>

      {/* Step Action Bar matching requested bottom section */}
      <StepActionBar
        onBack={onBack}
        backLabel="Back"
        nextLabel="Continue"
        nextType="submit"
        nextDisabled={!canProceed}
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
    </form>
  )
}
