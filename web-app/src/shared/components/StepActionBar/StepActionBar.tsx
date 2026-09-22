import React from 'react'
import './StepActionBar.css'

export interface StepActionBarProps {
  onBack?: () => void
  onNext?: () => void
  onSaveDraft?: () => void
  saveDraftLabel?: string
  backLabel?: string
  nextLabel?: string
  isSubmitting?: boolean
  nextDisabled?: boolean
  backDisabled?: boolean
  showBack?: boolean
  nextType?: 'button' | 'submit'
  backTestId?: string
  nextTestId?: string
  saveDraftTestId?: string
  extraActions?: React.ReactNode
  className?: string
}

export const StepActionBar: React.FC<StepActionBarProps> = ({
  onBack,
  onNext,
  onSaveDraft,
  saveDraftLabel = 'Save Draft & Exit',
  backLabel = 'Back',
  nextLabel = 'Continue',
  isSubmitting = false,
  nextDisabled = false,
  backDisabled = false,
  showBack = true,
  nextType = 'button',
  backTestId = 'step-back-btn',
  nextTestId = 'step-continue-btn',
  saveDraftTestId = 'step-save-draft-btn',
  extraActions,
  className = '',
}) => {
  return (
    <div className={`step-action-bar ${className}`} data-testid="step-action-bar">
      <div className="step-action-bar__left">
        {showBack && onBack && (
          <button
            type="button"
            className="step-action-bar__btn step-action-bar__btn--back"
            onClick={onBack}
            disabled={backDisabled || isSubmitting}
            data-testid={backTestId}
          >
            <svg
              className="step-action-bar__icon-arrow step-action-bar__icon-arrow--back"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>{backLabel}</span>
          </button>
        )}
      </div>

      <div className="step-action-bar__right">
        {onSaveDraft && (
          <button
            type="button"
            className="step-action-bar__btn step-action-bar__btn--save-draft"
            onClick={onSaveDraft}
            data-testid={saveDraftTestId}
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
            <span>{saveDraftLabel}</span>
          </button>
        )}

        {extraActions && <div className="step-action-bar__extra">{extraActions}</div>}

        <button
          type={nextType}
          className="step-action-bar__btn step-action-bar__btn--next"
          onClick={nextType === 'button' ? onNext : undefined}
          disabled={nextDisabled || isSubmitting}
          data-testid={nextTestId}
        >
          {isSubmitting ? (
            <>
              <span className="step-action-bar__spinner" aria-hidden="true" />
              <span>Processing...</span>
            </>
          ) : (
            <span>{nextLabel}</span>
          )}
        </button>
      </div>
    </div>
  )
}
