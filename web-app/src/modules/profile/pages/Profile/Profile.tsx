import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import { authStorage } from '@core/auth'
import { routePaths } from '@core/config'

import { ProfileHeader } from '../../components/ProfileHeader/ProfileHeader'
import { ProfileTabs } from '../../components/ProfileTabs/ProfileTabs'
import type { TabItem } from '../../components/ProfileTabs/ProfileTabs'
import { AccountTab } from '../../components/AccountTab/AccountTab'
import { ServicesTab } from '../../components/ServicesTab/ServicesTab'
import './Profile.css'

const PROFILE_TABS: TabItem[] = [
  { id: 'account', label: 'Account' },
  { id: 'services', label: 'Services' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'security', label: 'Security' },
  { id: 'support', label: 'Support' },
]

export const Profile = () => {
  const navigate = useNavigate()
  const storeUser = useAuthStore((state) => state.user)
  const user = storeUser || authStorage.getUser()

  const [activeTabId, setActiveTabId] = useState<string>('account')
  const [activeAppsCount] = useState(0)
  const [completedAppsCount] = useState(0)
  const [totalPaidAmount] = useState(0)

  const handleLogout = async () => {
    useAuthStore.getState().signOut()
    navigate(routePaths.auth.login, { replace: true })
  }

  const handleEditAvatar = () => {
    // Empty for now
  }

  const renderTabContent = () => {
    switch (activeTabId) {
      case 'account':
        return <AccountTab user={user} />
      case 'services':
        return <ServicesTab />
      case 'preferences':
      case 'security':
      case 'support':
        return (
          <div className="profile-page-view__placeholder">
            <p>This tab is under construction.</p>
            <button className="profile-page-view__logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="profile-page-view">
      <ProfileHeader
        user={user}
        activeAppsCount={activeAppsCount}
        completedAppsCount={completedAppsCount}
        totalPaidAmount={totalPaidAmount}
        onEditAvatar={handleEditAvatar}
      />
      
      <ProfileTabs
        tabs={PROFILE_TABS}
        activeTabId={activeTabId}
        onChangeTab={setActiveTabId}
      />

      <div className="profile-page-view__content">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default Profile
