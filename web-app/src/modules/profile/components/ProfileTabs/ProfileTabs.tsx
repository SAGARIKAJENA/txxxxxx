import React from 'react'
import './ProfileTabs.css'

export interface TabItem {
  id: string
  label: string
}

export interface ProfileTabsProps {
  tabs: TabItem[]
  activeTabId: string
  onChangeTab: (tabId: string) => void
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs, activeTabId, onChangeTab }) => {
  return (
    <div className="profile-tabs__container">
      <div className="profile-tabs__scroll-area">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              className={`profile-tabs__btn ${isActive ? 'profile-tabs__btn--active' : ''}`}
              onClick={() => onChangeTab(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
