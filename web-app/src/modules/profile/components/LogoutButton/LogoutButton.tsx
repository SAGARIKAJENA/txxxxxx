import React from 'react'
import './LogoutButton.css'

export interface LogoutButtonProps {
  onClick: () => void
}

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
)

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  return (
    <button className="profile-logout-btn" onClick={onClick}>
      <span className="profile-logout-btn__icon">
        <LogoutIcon />
      </span>
      <span className="profile-logout-btn__text">Logout</span>
    </button>
  )
}
