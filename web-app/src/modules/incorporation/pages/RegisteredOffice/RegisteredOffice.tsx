import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { DocumentCard } from '@shared/components'
import { filterDigits, isValidMobile, isValidPincode, isValidEmail } from '../../utils/validation'
import './RegisteredOffice.css'

interface OfficeDocItem {
  id: string
  title: string
  subtitle?: string
  isRequired: boolean
  isUploaded: boolean
  fileName?: string
}

export const RegisteredOffice: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as Record<string, any> | null
  const companyType = locationState?.companyType || 'pvt_ltd'
  const [error, setError] = useState<string>('')

  const [addressData, setAddressData] = useState({
    addressLine1: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    ownershipStatus: '',
    email: '',
    mobile: '',
  })

  const [docs, setDocs] = useState<OfficeDocItem[]>([
    {
      id: 'doc-1',
      title: 'Office Address Proof / Utility Bill',
      subtitle: 'Utility bill should be recent (not older than 2 months).',
      isRequired: true,
      isUploaded: false,
    },
    {
      id: 'doc-2',
      title: 'Ownership / Rent / Lease Document',
      subtitle: 'Rent agreement or ownership deed.',
      isRequired: true,
      isUploaded: false,
    },
    {
      id: 'doc-3',
      title: 'Owner NOC',
      subtitle: 'Required only for rented/leased/third-party premises.',
      isRequired: true,
      isUploaded: false,
    },
  ])

  const ownershipOptions = ['Rented', 'Owned', 'Leased']

  const handleInputChange = (field: string, val: string) => {
    setError('')
    if (field === 'pincode') {
      setAddressData((prev) => ({ ...prev, pincode: filterDigits(val, 6) }))
      return
    }
    if (field === 'mobile') {
      setAddressData((prev) => ({ ...prev, mobile: filterDigits(val, 10) }))
      return
    }
    setAddressData((prev) => ({ ...prev, [field]: val }))
  }

  const handleUploadDoc = (id: string, file: File) => {
    setError('')
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isUploaded: true, fileName: file.name } : d))
    )
  }

  const handleRemoveDoc = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isUploaded: false, fileName: undefined } : d))
    )
  }

  const handleContinue = () => {
    if (!addressData.addressLine1.trim()) { setError('Please enter Premises Address Line.'); return }
    if (!addressData.city.trim()) { setError('Please enter City.'); return }
    if (!addressData.district.trim()) { setError('Please enter District.'); return }
    if (!addressData.state.trim()) { setError('Please enter State.'); return }
    if (!isValidPincode(addressData.pincode)) { setError('Please enter a valid 6-digit numeric PIN Code.'); return }
    if (!addressData.ownershipStatus) { setError('Please select Premises Ownership Status.'); return }
    if (!isValidEmail(addressData.email)) { setError('Please enter a valid Company Email address.'); return }
    if (!isValidMobile(addressData.mobile)) { setError('Please enter a valid 10-digit numeric Mobile Number.'); return }
    const unuploadedDoc = docs.find((d) => d.isRequired && !d.isUploaded)
    if (unuploadedDoc) {
      setError(`Please upload mandatory document: ${unuploadedDoc.title}`)
      return
    }
    setError('')
    navigate(routePaths.incorporation.promoterDetails, {
      state: { ...locationState, companyType, addressData, docs },
    })
  }

  const renderInput = (
    label: string,
    field: keyof typeof addressData,
    placeholder: string,
    type = 'text'
  ) => (
    <div className="reg-office-group">
      <label className="reg-office-label">{label}<span className="reg-office-required"> *</span></label>
      <input
        type={type}
        className="reg-office-input"
        placeholder={placeholder}
        value={addressData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
      />
    </div>
  )

  return (
    <div className="reg-office-page">
      {/* Step Progress Tracker */}
      <div className="reg-office-stepbar">
        <span className="reg-office-stepbar__badge">Step 3 of 11</span>
        <div className="reg-office-stepbar__line">
          <div className="reg-office-stepbar__line-fill" />
        </div>
      </div>

      {/* Page Header */}
      <header className="reg-office-header">
        <h1 className="reg-office-header__title">Registered Office Details</h1>
        <p className="reg-office-header__subtitle">
          Provide official communication address for MCA, ROC, and statutory authorities.
        </p>
      </header>

      {/* Address Form Section */}
      <section className="reg-office-section">
        {renderInput('Building / Premises Address Line', 'addressLine1', 'e.g. Plot No. 42, Tech Park Phase 2, HITEC City')}

        <div className="reg-office-row-2">
          {renderInput('City', 'city', 'e.g. Hyderabad')}
          {renderInput('District', 'district', 'e.g. Rangareddy')}
        </div>

        <div className="reg-office-row-2">
          {renderInput('State', 'state', 'e.g. Telangana')}
          {renderInput('PIN Code', 'pincode', 'e.g. 500081')}
        </div>

        <div className="reg-office-group">
          <label className="reg-office-label">
            Premises Ownership Status<span className="reg-office-required"> *</span>
          </label>
          <div className="reg-office-chips">
            {ownershipOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`reg-office-chip ${addressData.ownershipStatus === opt ? 'reg-office-chip--active' : ''}`}
                onClick={() => handleInputChange('ownershipStatus', opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="reg-office-info-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            Proof of address (Electricity Bill / Rent Agreement) is mandatory. If premises are rented, leased, or owned by a Director or third party, a No Objection Certificate (NOC) from the owner is strictly required.
          </span>
        </div>

        <div className="reg-office-row-2">
          {renderInput('Company Email', 'email', 'e.g. contact@taxedge.in', 'email')}
          {renderInput('Mobile', 'mobile', 'e.g. 9876543210', 'tel')}
        </div>
      </section>

      {/* Section: Mandatory Documents */}
      <section className="reg-office-section">
        <h2 className="reg-office-section__title">Mandatory Documents</h2>

        <div className="reg-office-docs-list">
          {docs.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              subtitle={doc.subtitle}
              isRequired={doc.isRequired}
              isUploaded={doc.isUploaded}
              fileName={doc.fileName}
              onUpload={(_, file) => handleUploadDoc(doc.id, file)}
              onRemove={() => handleRemoveDoc(doc.id)}
            />
          ))}
        </div>
      </section>

      {error && (
        <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #fecaca', fontSize: '0.88rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="reg-office-footer">
        <button
          type="button"
          className="reg-office-btn-back"
          onClick={() => navigate(routePaths.incorporation.companyDetails, { state: locationState })}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className="reg-office-btn-continue"
          onClick={handleContinue}
        >
          Continue &rarr;
        </button>
      </footer>
    </div>
  )
}

export default RegisteredOffice
