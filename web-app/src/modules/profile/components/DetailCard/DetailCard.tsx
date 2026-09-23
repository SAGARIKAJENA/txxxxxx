import React from 'react'
import './DetailCard.css'

export interface DetailCardProps {
  title: string
  items: {
    label: string
    value: string | number | undefined | null
    isFullWidth?: boolean
  }[]
  icon?: React.ReactNode
}

export const DetailCard: React.FC<DetailCardProps> = ({ title, items, icon }) => {
  return (
    <div className="profile-detail-card">
      <div className="profile-detail-card__header">
        {icon && <div className="profile-detail-card__icon">{icon}</div>}
        <h3 className="profile-detail-card__title">{title}</h3>
      </div>
      <div className="profile-detail-card__body">
        {items.map((item, index) => (
          <div
            key={index}
            className={`profile-detail-card__item ${
              item.isFullWidth ? 'profile-detail-card__item--full' : ''
            }`}
          >
            <span className="profile-detail-card__label">{item.label}</span>
            <span className="profile-detail-card__value">
              {item.value || <span className="profile-detail-card__empty">Not provided</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
