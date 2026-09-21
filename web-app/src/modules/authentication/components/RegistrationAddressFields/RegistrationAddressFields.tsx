import React from 'react'
import {
  HomeIcon,
  BuildingIcon,
  PinIcon,
  MapIcon,
  SpinnerIcon,
  CheckCircleIcon,
} from '../RegistrationIcons/RegistrationIcons'
import { RegistrationSelect } from '../RegistrationSelect/RegistrationSelect'
import { AddressLocationButton } from './AddressLocationButton'
import { AreaLocalitySelect } from './AreaLocalitySelect'
import { CANONICAL_INDIAN_STATES_AND_UTS } from '@shared/services'
import './RegistrationAddressFields.css'

export interface RegistrationAddressValues {
  addressLine1: string
  addressLine2: string
  pincode: string
  areaLocality: string
  city: string
  district: string
  state: string
}

export interface RegistrationAddressErrors {
  addressLine1?: string
  addressLine2?: string
  pincode?: string
  areaLocality?: string
  city?: string
  district?: string
  state?: string
}

export interface RegistrationAddressFieldsProps {
  values: RegistrationAddressValues
  errors: RegistrationAddressErrors
  isDetectingLocation?: boolean
  locationError?: string | null
  onClearLocationError?: () => void
  onUseCurrentLocation?: () => void
  pincodeStatus?: 'idle' | 'verifying' | 'valid' | 'invalid'
  showPostalBanner?: boolean
  onDismissPostalBanner?: () => void
  availablePostOffices?: string[]
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const RegistrationAddressFields: React.FC<RegistrationAddressFieldsProps> = ({
  values,
  errors,
  isDetectingLocation = false,
  locationError,
  onClearLocationError,
  onUseCurrentLocation,
  pincodeStatus = 'idle',
  showPostalBanner = false,
  onDismissPostalBanner,
  availablePostOffices = [],
  onChange,
  onBlur,
}) => {
  const isPincodeFilled = values.pincode.length === 6

  return (
    <div className="reg-address-section">
      {/* Section Header with "Use current location" Pill Button */}
      <div className="reg-address-section__header">
        <div className="reg-address-section__title-group">
          <h3 className="reg-address-section__title">Current Address</h3>
        </div>

        {onUseCurrentLocation && (
          <AddressLocationButton
            isLoading={isDetectingLocation}
            onClick={onUseCurrentLocation}
          />
        )}
      </div>

      {/* Dismissible Location Detection Error Alert */}
      {locationError && (
        <div className="reg-address-section__location-error" role="alert">
          <span>{locationError}</span>
          {onClearLocationError && (
            <button
              type="button"
              className="reg-address-section__location-error-close"
              onClick={onClearLocationError}
              aria-label="Dismiss location error"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Address Line 1 (Full Width) */}
      <div className="reg-field">
        <label className="reg-field__label" htmlFor="reg-addressLine1">
          Address Line 1 <span className="reg-field__required">*</span>
        </label>
        <div
          className={`reg-field__control ${
            errors.addressLine1 ? 'reg-field__control--error' : ''
          }`}
        >
          <span className="reg-field__icon">
            <HomeIcon />
          </span>
          <input
            id="reg-addressLine1"
            name="addressLine1"
            type="text"
            className="reg-field__input"
            placeholder="House / building, street"
            value={values.addressLine1}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="address-line1"
          />
        </div>
        {errors.addressLine1 && (
          <p className="reg-field__error">{errors.addressLine1}</p>
        )}
      </div>

      {/* Row 2: 2 Columns (Address Line 2 + PIN Code) */}
      <div className="reg-address-section__two-col">
        {/* Address Line 2 */}
        <div className="reg-field">
          <label className="reg-field__label" htmlFor="reg-addressLine2">
            Address Line 2 (Optional)
          </label>
          <div
            className={`reg-field__control ${
              errors.addressLine2 ? 'reg-field__control--error' : ''
            }`}
          >
            <span className="reg-field__icon">
              <BuildingIcon />
            </span>
            <input
              id="reg-addressLine2"
              name="addressLine2"
              type="text"
              className="reg-field__input"
              placeholder="Landmark, suite (optional)"
              value={values.addressLine2}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="address-line2"
            />
          </div>
          {errors.addressLine2 && (
            <p className="reg-field__error">{errors.addressLine2}</p>
          )}
        </div>

        {/* PIN Code with Counter and Status */}
        <div className="reg-field">
          <label className="reg-field__label" htmlFor="reg-pincode">
            PIN Code <span className="reg-field__required">*</span>
          </label>
          <div className="reg-pincode-control-wrapper">
            <div
              className={`reg-field__control ${
                errors.pincode ? 'reg-field__control--error' : ''
              }`}
              style={{ width: '100%', paddingRight: '64px' }}
            >
              <span className="reg-field__icon">
                <PinIcon />
              </span>
              <input
                id="reg-pincode"
                name="pincode"
                type="text"
                inputMode="numeric"
                className="reg-field__input"
                placeholder="6-digit PIN code"
                maxLength={6}
                value={values.pincode}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete="postal-code"
              />
            </div>

            <div className="reg-pincode-status-box">
              <span
                className={`reg-pincode-counter ${
                  isPincodeFilled ? 'reg-pincode-counter--complete' : ''
                }`}
              >
                {values.pincode.length}/6
              </span>
              {pincodeStatus === 'verifying' && (
                <span className="reg-pincode-badge">
                  <SpinnerIcon size={14} color="#FB923C" />
                </span>
              )}
              {pincodeStatus === 'valid' && (
                <span className="reg-pincode-badge">
                  <CheckCircleIcon size={14} color="#16A34A" />
                </span>
              )}
            </div>
          </div>
          {errors.pincode && (
            <p className="reg-field__error">{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* Row 3: 2 Columns (Area / Locality + City) */}
      <div className="reg-address-section__two-col">
        {/* Area / Locality Dropdown covering the City */}
        <div className="reg-field">
          <label className="reg-field__label" htmlFor="reg-areaLocality">
            Area / Locality
          </label>
          <AreaLocalitySelect
            id="reg-areaLocality"
            name="areaLocality"
            value={values.areaLocality}
            cityName={values.city}
            postalBranches={availablePostOffices}
            hasError={Boolean(errors.areaLocality)}
            placeholder="Select area in city"
            onChange={onChange}
            onBlur={onBlur}
          />
          {errors.areaLocality && (
            <p className="reg-field__error">{errors.areaLocality}</p>
          )}
        </div>

        {/* City */}
        <div className="reg-field">
          <label className="reg-field__label" htmlFor="reg-city">
            City <span className="reg-field__required">*</span>
          </label>
          <div
            className={`reg-field__control ${
              errors.city ? 'reg-field__control--error' : ''
            }`}
          >
            <span className="reg-field__icon">
              <BuildingIcon />
            </span>
            <input
              id="reg-city"
              name="city"
              type="text"
              className="reg-field__input"
              placeholder="e.g. Portblair, Chityal, Pune"
              value={values.city}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="address-level2"
            />
          </div>
          {errors.city && <p className="reg-field__error">{errors.city}</p>}
        </div>
      </div>

      {/* Row 4: 2 Columns (District + State / UT) */}
      <div className="reg-address-section__two-col">
        {/* District */}
        <div className="reg-field">
          <label className="reg-field__label" htmlFor="reg-district">
            District <span className="reg-field__required">*</span>
          </label>
          <div
            className={`reg-field__control ${
              errors.district ? 'reg-field__control--error' : ''
            }`}
          >
            <span className="reg-field__icon">
              <BuildingIcon />
            </span>
            <input
              id="reg-district"
              name="district"
              type="text"
              className="reg-field__input"
              placeholder="e.g. South Andaman, Warangal, Pur"
              value={values.district}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="address-level2"
            />
          </div>
          {errors.district && (
            <p className="reg-field__error">{errors.district}</p>
          )}
        </div>

        {/* State / UT */}
        <div className="reg-field">
          <label className="reg-field__label" htmlFor="reg-state">
            State / UT <span className="reg-field__required">*</span>
          </label>
          <RegistrationSelect
            id="reg-state"
            name="state"
            value={values.state}
            placeholder="Select your State / UT"
            options={CANONICAL_INDIAN_STATES_AND_UTS}
            icon={<MapIcon />}
            hasError={Boolean(errors.state)}
            align="right"
            searchable={true}
            onChange={onChange}
          />
          {errors.state && <p className="reg-field__error">{errors.state}</p>}
        </div>
      </div>
    </div>
  )
}
