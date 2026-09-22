import React from 'react'

interface NoticeHeaderProps {
  subtitle: string
  onBack: () => void
  onSaveDraft: () => void
  draftSaved: boolean
}

export const NoticeHeader: React.FC<NoticeHeaderProps> = ({
  subtitle,
  onBack,
  onSaveDraft,
  draftSaved,
}) => {
  return (
    <header className="notice-header">
      <button
        type="button"
        className="notice-header__back-btn"
        onClick={onBack}
        aria-label="Go back"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="notice-header__back-icon"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="notice-header__titles">
        <h1 className="notice-header__title">Tax Notice Assistance</h1>
        <span className="notice-header__subtitle">{subtitle}</span>
      </div>

      <button
        type="button"
        className={`notice-header__draft-btn ${draftSaved ? 'notice-header__draft-btn--saved' : ''}`}
        onClick={onSaveDraft}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="notice-header__draft-icon"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>{draftSaved ? 'Saved' : 'Draft'}</span>
      </button>
    </header>
  )
}
