
import { useAuthStore } from '@store/index'
import { authStorage } from '@core/auth'
import { DetailCard } from '../../components/DetailCard/DetailCard'
import './ProfileDetails.css'

export const PersonalInformation = () => {
  const storeUser = useAuthStore((state) => state.user)
  const user = storeUser || authStorage.getUser()

  if (!user) {
    return (
      <div className="profile-details-page">
        <div className="profile-details-page__content">
          <p>User not found. Please log in again.</p>
        </div>
      </div>
    )
  }

  const personalItems = [
    { label: 'Full Name', value: user.fullName },
    { label: 'Email Address', value: user.email },
    { label: 'Mobile Number', value: user.mobile ? `+91 ${user.mobile}` : null },
    { label: 'Customer Type', value: user.customerType },
    { label: 'Gender', value: user.gender },
    { label: 'Date of Birth', value: user.dob },
    { label: 'Father/Spouse Name', value: user.fatherSpouseName },
  ]

  const addressItems = [
    { label: 'Address Line 1', value: user.addressLine1, isFullWidth: true },
    { label: 'Address Line 2', value: user.addressLine2, isFullWidth: true },
    { label: 'Area / Locality', value: user.areaLocality },
    { label: 'City / Town', value: user.city },
    { label: 'District', value: user.district },
    { label: 'State', value: user.state },
    { label: 'PIN Code', value: user.pincode },
  ]

  return (
    <div className="profile-details-page">
      <div className="profile-details-page__header">
        <h1 className="profile-details-page__title">Personal Information</h1>
      </div>

      <div className="profile-details-page__content">
        <DetailCard
          title="Basic Details"
          items={personalItems}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          }
        />

        <DetailCard
          title="Residential Address"
          items={addressItems}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          }
        />
      </div>
    </div>
  )
}

export default PersonalInformation
