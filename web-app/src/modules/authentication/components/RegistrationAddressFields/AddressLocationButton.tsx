import React from 'react'
import { LocationTargetIcon, SpinnerIcon } from '../RegistrationIcons/RegistrationIcons'
import './AddressLocationButton.css'

export interface AddressLocationButtonProps {
  isLoading: boolean
  onClick: () => void
  disabled?: boolean
}

export const AddressLocationButton: React.FC<AddressLocationButtonProps> = ({
  isLoading,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className="addr-location-btn"
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      aria-label="Use current location"
    >
      <span className="addr-location-btn__icon">
        {isLoading ? (
          <SpinnerIcon size={15} color="#EA580C" />
        ) : (
          <LocationTargetIcon size={15} color="#EA580C" />
        )}
      </span>
      <span className="addr-location-btn__label">
        {isLoading ? 'Detecting location...' : 'Use current location'}
      </span>
    </button>
  )
}
