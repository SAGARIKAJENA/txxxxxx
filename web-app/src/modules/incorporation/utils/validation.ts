/**
 * Incorporation Form Validation Utilities
 */

// Mobile Number: exactly 10 digits, numeric only
export const isValidMobile = (val: string): boolean => /^\d{10}$/.test(val.trim())

// Clean input to digits only, optionally limiting length
export const filterDigits = (val: string, maxLen?: number): string => {
  const digits = val.replace(/\D/g, '')
  return maxLen ? digits.slice(0, maxLen) : digits
}

// Aadhaar: exactly 12 digits, numeric only
export const isValidAadhaar = (val: string): boolean => /^\d{12}$/.test(val.trim())

// PAN Number: 5 uppercase letters, 4 digits, 1 uppercase letter
export const isValidPan = (val: string): boolean =>
  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val.trim().toUpperCase())

// Auto-format PAN input to uppercase and max 10 chars
export const filterPan = (val: string): string =>
  val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)

// PIN Code: exactly 6 digits numeric only
export const isValidPincode = (val: string): boolean => /^\d{6}$/.test(val.trim())

// Email: standard email format
export const isValidEmail = (val: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

// DIN (Director Identification Number): 8 digits numeric only (optional or 8 digits)
export const isValidDin = (val: string): boolean =>
  !val.trim() || /^\d{8}$/.test(val.trim())

// NIC 5-digit code: exactly 5 digits numeric only
export const isValidNicCode = (val: string): boolean => /^\d{5}$/.test(val.trim())

// Positive numeric check
export const isPositiveNumber = (val: string | number): boolean => {
  const n = typeof val === 'number' ? val : Number(val)
  return !isNaN(n) && n > 0
}
