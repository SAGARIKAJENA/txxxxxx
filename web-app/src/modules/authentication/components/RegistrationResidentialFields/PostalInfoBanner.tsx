import React from 'react'
import { InfoCircleIcon } from '../RegistrationIcons/RegistrationIcons'
import './PostalInfoBanner.css'

export interface PostalInfoBannerProps {
  onDismiss?: () => void
  message?: string
}

export const PostalInfoBanner: React.FC<PostalInfoBannerProps> = ({
  onDismiss,
  message = 'Address details autofilled from postal directory. Please confirm your specific flat/house number before submitting.',
}) => {
  return (
    <div className="postal-info-banner" role="status" aria-live="polite">
      <span className="postal-info-banner__icon">
        <InfoCircleIcon size={16} color="#2563EB" />
      </span>
      <p className="postal-info-banner__content">
        <span className="postal-info-banner__highlight">Address details autofilled: </span>
        {message.replace(/^Address details autofilled( from postal directory)?[.:]?\s*/i, '')}
      </p>
      {onDismiss && (
        <button
          type="button"
          className="postal-info-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss notice"
        >
          ×
        </button>
      )}
    </div>
  )
}
