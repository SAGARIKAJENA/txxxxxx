import { userStorage } from '@core/storage/userStorage'

export const saveIncorporationDraft = (
  stepNumber: number,
  stepLabel: string,
  resumeRoute: string,
  formData: Record<string, unknown> = {}
) => {
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
  userStorage.saveDraft({
    serviceId: 'incorporation',
    serviceTitle: 'Company Incorporation',
    currentStep: stepNumber,
    totalSteps: 8,
    stepLabel,
    formData,
    savedAt: timeStr,
    savedTimestamp: Date.now(),
    resumeRoute,
  })
}
