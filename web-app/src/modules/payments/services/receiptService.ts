import { authStorage } from '@core/auth'
import { userStorage } from '@core/storage/userStorage'
import type { TaxReceipt } from '../types/payments.types'

export const receiptService = {
  async getReceipt(idOrRef?: string): Promise<TaxReceipt> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const user = authStorage.getUser()
    const userApps = userStorage.getUserApplications()
    const app = idOrRef ? userApps.find((a) => a.id === idOrRef || a.code === idOrRef) : userApps[0]

    const todayDate = new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date())

    const ref = app?.code || idOrRef || `TE-${Date.now().toString().slice(-5)}`
    const title = app?.title || 'Tax Advisory & Compliance Service'
    const customerId = user?.id ? user.id.slice(0, 12).toUpperCase() : 'TE-CUS'
    const userName = user?.fullName || 'Assessee'
    const entityName = user?.businessName || user?.fullName || 'Registered Client'
    const stateName = user?.state || 'Maharashtra'

    return {
      id: `receipt_${ref}`,
      receiptNumber: `TE/26-27/R-${ref.replace(/\D/g, '').slice(-4) || '1001'}`,
      companyName: 'TaxEdge Fin Solutions',
      companyGstin: 'GSTIN 27AAKCT9182F1ZR - Pune, Maharashtra',
      billedTo: {
        name: userName,
        tradeName: entityName,
        addressLines: [
          user?.addressLine1 || 'Registered Address on File',
          user?.city ? `${user.city}, ${stateName} ${user.pincode || ''}` : `${stateName}, India`,
        ],
        gstin: user?.pan ? `PAN: ${user.pan}` : undefined,
      },
      invoiceDetails: {
        date: todayDate,
        customerId,
        applicationId: ref,
        placeOfSupply: `${stateName}`,
      },
      lineItems: [
        {
          id: 'line_1',
          title: `${title} Filing`,
          subtitle: `Professional fee for preparation and processing of ${title}`,
          sac: '998231',
          amount: '₹2,500',
          amountNumeric: 2500,
        },
      ],
      taxBreakdown: {
        taxableValue: '₹2,500',
        cgstRate: 'CGST @ 9%',
        cgstAmount: '₹225',
        sgstRate: 'SGST @ 9%',
        sgstAmount: '₹225',
        totalPaid: '₹2,950',
      },
      paymentDetails: {
        method: 'Online Payment',
        accountRef: user?.email || 'Verified Account',
        transactionId: `TXN${Date.now().toString().slice(-10)}`,
        status: 'Paid in full',
      },
      amountInWords: 'Two thousand nine hundred fifty rupees only.',
    }
  },
}
