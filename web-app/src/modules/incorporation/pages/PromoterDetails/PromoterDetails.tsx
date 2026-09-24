import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { DirectorCard } from '../../components'
import { defaultDirectors } from '../../data/companyRegistrationData'
import { StepActionBar } from '@shared/components'
import { saveIncorporationDraft } from '../../utils/incorporationDraft'
import {
  isValidPan,
  isValidDin,
  isValidEmail,
  isValidMobile,
  isValidPincode,
} from '../../utils/validation'
import type { DirectorDetails } from '../../types/incorporation.types'
import './PromoterDetails.css'

export const PromoterDetails: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const companyType = location.state?.companyType || 'pvt_ltd'
  const isOpc = companyType === 'opc'
  const minDirectors = isOpc ? 1 : companyType === 'public' ? 3 : 2

  const [directors, setDirectors] = useState<DirectorDetails[]>(() => {
    if (location.state?.directors && location.state.directors.length > 0) {
      return location.state.directors
    }
    return defaultDirectors
  })
  const [error, setError] = useState<string>('')
  const [directorErrors, setDirectorErrors] = useState<Record<number, Record<string, string>>>({})

  const handleDirectorChange = (id: number, field: keyof DirectorDetails, value: any) => {
    setError('')
    setDirectorErrors((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: '' },
    }))
    setDirectors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    )
  }

  const handleAddDirector = () => {
    setError('')
    const nextId = directors.length > 0 ? Math.max(...directors.map((d) => d.id)) + 1 : 1
    const newDirector: DirectorDetails = {
      id: nextId,
      fullName: '',
      pan: '',
      din: '',
      dob: '',
      fatherName: '',
      gender: '',
      nationality: 'Indian',
      designation: 'Director',
      category: 'Director',
      email: '',
      mobile: '',
      isResident: true,
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      isSameAddress: true,
      equityShares: '',
      equityAmount: '',
      shareholdingPercent: '',
    }
    setDirectors((prev) => [...prev, newDirector])
  }

  const handleSaveDirector = (id: number) => {
    const director = directors.find((d) => d.id === id)
    alert(`Changes saved for ${director?.fullName || `Director #${id}`}!`)
  }

  const handleCancelDirector = (id: number) => {
    if (directors.length > 1) {
      setError('')
      setDirectorErrors((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      setDirectors((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const handleContinue = () => {
    let minDirectorsError = ''
    if (directors.length < minDirectors) {
      minDirectorsError =
        companyType === 'public'
          ? 'Public Limited Company requires at least 3 directors.'
          : isOpc
          ? 'One Person Company requires at least 1 director.'
          : 'A minimum of 2 directors/partners are required.'
    }
    setError(minDirectorsError)

    const allErrors: Record<number, Record<string, string>> = {}
    let hasAnyError = false

    for (let i = 0; i < directors.length; i++) {
      const d = directors[i]
      const dErrors: Record<string, string> = {}
      if (!d.fullName.trim()) dErrors.fullName = 'Full Name is required'
      if (!d.pan.trim()) {
        dErrors.pan = 'PAN Number is required'
      } else if (!isValidPan(d.pan)) {
        dErrors.pan = 'Valid 10-character PAN (e.g. ABCDE1234F) is required'
      }
      if (d.din && !isValidDin(d.din)) dErrors.din = 'DIN must be an 8-digit number'
      if (!d.dob) dErrors.dob = 'Date of Birth is required'
      if (!d.fatherName.trim()) dErrors.fatherName = "Father's Name is required"
      if (!d.gender) dErrors.gender = 'Please select gender'
      if (!d.nationality.trim()) dErrors.nationality = 'Nationality is required'
      if (!d.designation.trim()) dErrors.designation = 'Designation is required'
      if (!d.category.trim()) dErrors.category = 'Category is required'
      if (!d.email.trim()) {
        dErrors.email = 'Email Address is required'
      } else if (!isValidEmail(d.email)) {
        dErrors.email = 'Please enter a valid email address'
      }
      if (!d.mobile.trim()) {
        dErrors.mobile = 'Mobile Number is required'
      } else if (!isValidMobile(d.mobile)) {
        dErrors.mobile = 'Please enter a valid 10-digit mobile number'
      }
      if (!d.addressLine1.trim()) dErrors.addressLine1 = 'Address Line 1 is required'
      if (!d.city.trim()) dErrors.city = 'City is required'
      if (!d.district.trim()) dErrors.district = 'District is required'
      if (!d.state.trim()) dErrors.state = 'State is required'
      if (!d.pincode.trim()) {
        dErrors.pincode = 'PIN Code is required'
      } else if (!isValidPincode(d.pincode)) {
        dErrors.pincode = 'Please enter a valid 6-digit PIN code'
      }
      if (!d.equityShares || Number(d.equityShares) <= 0) dErrors.equityShares = 'Number of equity shares is required'
      if (!d.equityAmount || Number(d.equityAmount) <= 0) dErrors.equityAmount = 'Amount of equity shares is required'

      if (Object.keys(dErrors).length > 0) {
        allErrors[d.id] = dErrors
        hasAnyError = true
      }
    }

    setDirectorErrors(allErrors)

    if (minDirectorsError || hasAnyError) {
      return
    }

    setError('')
    setDirectorErrors({})
    navigate(routePaths.incorporation.capitalDetails, {
      state: { ...location.state, companyType, directors },
    })
  }

  return (
    <div className="promoter-details-page">
      {/* Step Progress Tracker */}
      <div className="promoter-details-stepbar">
        <span className="promoter-details-stepbar__badge">Step 4 of 11</span>
        <span className="promoter-details-stepbar__text">Promoter / Director Details</span>
        <div className="promoter-details-stepbar__line">
          <div className="promoter-details-stepbar__line-fill" />
        </div>
      </div>

      {/* Page Header */}
      <header className="promoter-details-header">
        <h1 className="promoter-details-header__title">Promoter / Director Details</h1>
        <p className="promoter-details-header__subtitle">
          Enter essential details of all promoters/directors for CA processing.
        </p>
      </header>

      {/* Directors List */}
      <main className="promoter-details-list">
        {directors.map((director, index) => (
          <DirectorCard
            key={director.id}
            director={director}
            index={index}
            onChange={handleDirectorChange}
            onSave={handleSaveDirector}
            onCancel={handleCancelDirector}
            errors={directorErrors[director.id]}
          />
        ))}

        {/* Add Director Button: Hidden for One Person Company */}
        {!isOpc && (
          <button
            type="button"
            className="promoter-details-btn-add"
            onClick={handleAddDirector}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            + Add Promoter / Director
          </button>
        )}
      </main>

      {/* Error Alert */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          margin: '1rem 0',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Footer Navigation */}
      <StepActionBar
        onBack={() => navigate(routePaths.incorporation.registeredOffice, { state: location.state })}
        onNext={handleContinue}
        onSaveDraft={() => {
          saveIncorporationDraft(4, 'Promoter Details', routePaths.incorporation.promoterDetails, { directors })
          navigate(routePaths.dashboard)
        }}
        nextDisabled={!Boolean(directors.length > 0 && directors.every(d => d.fullName?.trim() && d.pan?.trim()))}
        nextLabel="Continue"
      />
    </div>
  )
}

export default PromoterDetails
