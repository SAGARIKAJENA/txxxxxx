import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { DirectorCard } from '../../components'
import { defaultDirectors } from '../../data/companyRegistrationData'
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

  const handleDirectorChange = (id: number, field: keyof DirectorDetails, value: any) => {
    setError('')
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
      setDirectors((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const handleContinue = () => {
    if (directors.length < minDirectors) {
      setError(
        companyType === 'public'
          ? 'Public Limited Company requires at least 3 directors.'
          : isOpc
          ? 'One Person Company requires at least 1 director.'
          : 'A minimum of 2 directors/partners are required.'
      )
      return
    }

    for (let i = 0; i < directors.length; i++) {
      const d = directors[i]
      const label = `Director #${i + 1}${d.fullName ? ` (${d.fullName})` : ''}`
      if (!d.fullName.trim()) {
        setError(`${label}: Full Name is required.`)
        return
      }
      if (!isValidPan(d.pan)) {
        setError(`${label}: Valid 10-character PAN (e.g. ABCDE1234F) is required.`)
        return
      }
      if (d.din && !isValidDin(d.din)) {
        setError(`${label}: DIN must be an 8-digit number if provided.`)
        return
      }
      if (!d.dob) {
        setError(`${label}: Date of Birth is required.`)
        return
      }
      if (!d.fatherName.trim()) {
        setError(`${label}: Father's Name is required.`)
        return
      }
      if (!d.gender) {
        setError(`${label}: Gender is required.`)
        return
      }
      if (!isValidEmail(d.email)) {
        setError(`${label}: Valid Email Address is required.`)
        return
      }
      if (!isValidMobile(d.mobile)) {
        setError(`${label}: Valid 10-digit Mobile Number is required.`)
        return
      }
      if (!d.addressLine1.trim()) {
        setError(`${label}: Address Line 1 is required.`)
        return
      }
      if (!d.city.trim()) {
        setError(`${label}: City is required.`)
        return
      }
      if (!d.district.trim()) {
        setError(`${label}: District is required.`)
        return
      }
      if (!d.state.trim()) {
        setError(`${label}: State is required.`)
        return
      }
      if (!isValidPincode(d.pincode)) {
        setError(`${label}: Valid 6-digit PIN Code is required.`)
        return
      }
    }

    setError('')
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
      <footer className="promoter-details-footer">
        <button
          type="button"
          className="promoter-details-btn-back"
          onClick={() => navigate(routePaths.incorporation.registeredOffice, { state: location.state })}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className="promoter-details-btn-continue"
          onClick={handleContinue}
        >
          Continue &rarr;
        </button>
      </footer>
    </div>
  )
}

export default PromoterDetails
