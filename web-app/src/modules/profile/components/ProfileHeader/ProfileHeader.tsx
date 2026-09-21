import React from 'react'
import type { AuthUser } from '@core/auth'
import './ProfileHeader.css'

export interface ProfileHeaderProps {
  user: AuthUser | null
  activeAppsCount?: number
  completedAppsCount?: number
  totalPaidAmount?: number
  onEditAvatar?: () => void
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  activeAppsCount = 0,
  completedAppsCount = 0,
  totalPaidAmount = 0,
  onEditAvatar
}) => {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const customerId = user?.id?.replace('usr_', 'CI').toUpperCase() || 'CI000000'
  const customerType = user?.customerType?.toUpperCase() || 'INDIVIDUAL'
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'U'

  return (
    <div className="profile-hero">
      <div className="profile-hero__bg-mesh" />
      <div className="profile-hero__container">
        
        {/* Left Section: User Identity */}
        <div className="profile-hero__identity">
          <div className="profile-hero__avatar-wrapper">
            <div className="profile-hero__avatar-circle">
              <span className="profile-hero__avatar-initials">{initials}</span>
            </div>
            <button className="profile-hero__edit-btn" onClick={onEditAvatar} aria-label="Edit avatar">
              <EditIcon />
            </button>
          </div>

          <div className="profile-hero__user-info">
            <h2 className="profile-hero__name">{user?.fullName || 'Guest User'}</h2>
            <p className="profile-hero__id">Customer ID: {customerId}</p>
            <div className="profile-hero__badges">
              <span className="profile-hero__badge profile-hero__badge--type">{customerType}</span>
              <span className="profile-hero__badge profile-hero__badge--verified">KYC Verified ✓</span>
            </div>
          </div>
        </div>

        {/* Right Section: Stats */}
        <div className="profile-hero__stats">
          <div className="profile-hero__stat-card">
            <span className="profile-hero__stat-label">Active Apps</span>
            <span className="profile-hero__stat-value profile-hero__stat-value--blue">{activeAppsCount}</span>
          </div>
          
          <div className="profile-hero__stat-card">
            <span className="profile-hero__stat-label">Completed</span>
            <span className="profile-hero__stat-value profile-hero__stat-value--green">{completedAppsCount}</span>
          </div>
          
          <div className="profile-hero__stat-card profile-hero__stat-card--highlight">
            <span className="profile-hero__stat-label">Total Paid</span>
            <span className="profile-hero__stat-value">{formatCurrency(totalPaidAmount)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
