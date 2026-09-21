import React from 'react'
import './ProfileSection.css'

export interface ProfileSectionProps {
  title: string
  children: React.ReactNode
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <section className="profile-section">
      <h3 className="profile-section__title">{title}</h3>
      <div className="profile-section__card">
        {children}
      </div>
    </section>
  )
}
