import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { MapIcon, ChevronDownIcon } from '../RegistrationIcons/RegistrationIcons'
import { getLocalitiesForCity } from '@shared/services'
import './AreaLocalitySelect.css'

export interface AreaLocalitySelectProps {
  id: string
  name: string
  value: string
  cityName: string
  postalBranches?: string[]
  hasError?: boolean
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const AreaLocalitySelect: React.FC<AreaLocalitySelectProps> = ({
  id,
  name,
  value,
  cityName,
  postalBranches = [],
  hasError = false,
  placeholder = 'Select or search area / locality',
  onChange,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Dynamically resolve all areas covering the active city
  const cityLocalities = useMemo(() => {
    return getLocalitiesForCity(cityName, postalBranches)
  }, [cityName, postalBranches])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearchQuery('')
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (selectedValue: string) => {
    const syntheticEvent = {
      target: { name, value: selectedValue },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    onChange(syntheticEvent)
    handleClose()
  }

  // Filter options based on search query (functional filtering)
  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return cityLocalities
    return cityLocalities.filter((item) => item.toLowerCase().includes(query))
  }, [cityLocalities, searchQuery])

  // Check if search query matches any listed item exactly
  const isExactMatch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return cityLocalities.some((item) => item.toLowerCase() === query)
  }, [cityLocalities, searchQuery])

  return (
    <div className="area-select" ref={containerRef}>
      {/* Hidden input for form standard serialization */}
      <input type="hidden" id={id} name={name} value={value} />

      {/* Trigger Button */}
      <button
        type="button"
        className={`area-select__trigger ${isOpen ? 'area-select__trigger--open' : ''} ${
          hasError ? 'area-select__trigger--error' : ''
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={() => {
          if (onBlur) {
            const syntheticBlur = {
              target: { name, value },
            } as unknown as React.FocusEvent<HTMLInputElement>
            onBlur(syntheticBlur)
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="area-select__icon">
          <MapIcon size={18} color="#F97316" />
        </span>
        <span className={`area-select__value ${!value ? 'area-select__value--placeholder' : ''}`}>
          {value || (cityName ? `Select area in ${cityName}` : placeholder)}
        </span>
        <span className={`area-select__chevron ${isOpen ? 'area-select__chevron--open' : ''}`}>
          <ChevronDownIcon size={15} />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="area-select__menu" role="listbox">
          {/* Search bar inside dropdown */}
          <div className="area-select__search-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              className="area-select__search-input"
              placeholder={cityName ? `Search areas in ${cityName}...` : 'Search or type area name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {cityName && (
            <div className="area-select__header-badge">
              Areas covering {cityName} ({cityLocalities.length})
            </div>
          )}

          <ul className="area-select__list">
            {/* Custom entered area option */}
            {searchQuery.trim().length >= 2 && !isExactMatch && (
              <li
                className="area-select__item area-select__item--custom"
                onClick={() => handleSelect(searchQuery.trim())}
                role="option"
                aria-selected={false}
              >
                <span>+ Use &quot;{searchQuery.trim()}&quot; as custom locality</span>
              </li>
            )}

            {filteredOptions.length === 0 && searchQuery.trim().length === 0 ? (
              <li className="area-select__empty">
                {cityName
                  ? `No preset areas for ${cityName}. Type above to add.`
                  : 'Enter PIN Code or City to load areas, or type above.'}
              </li>
            ) : (
              filteredOptions.map((item) => (
                <li
                  key={item}
                  className={`area-select__item ${item === value ? 'area-select__item--selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  role="option"
                  aria-selected={item === value}
                >
                  <span>{item}</span>
                  {item === value && (
                    <svg className="area-select__check" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
