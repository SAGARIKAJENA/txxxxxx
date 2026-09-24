export const commonLoanValidation = {
  isValidAmount: (val: number, min = 100000, max = 500000000): boolean => {
    return !isNaN(val) && val >= min && val <= max
  },

  isValidIfsc: (ifsc: string): boolean => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())
  },

  isValidAccountNumber: (acc: string): boolean => {
    return /^\d{9,18}$/.test(acc.trim())
  },

  isValidPan: (pan: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase())
  },

  isValidAadhaar: (aadhaar: string): boolean => {
    const cleaned = aadhaar.replace(/\s+/g, '')
    return /^\d{12}$/.test(cleaned)
  },

  isValidGst: (gst: string): boolean => {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst.trim().toUpperCase())
  },
}
