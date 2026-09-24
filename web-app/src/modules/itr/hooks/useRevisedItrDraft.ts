import { useCallback, useEffect } from 'react'
import { routePaths } from '@core/config'
import { userStorage } from '@core/storage/userStorage'
import { useDraftBlocker } from '@shared/hooks'
import { useAppStore } from '@store/index'
import type { RevisedItrDraftData } from './useRevisedItrState'

interface UseRevisedItrDraftProps {
  step: 1 | 2 | 3 | 4 | 5
  isSubmitted: boolean
  draftData: RevisedItrDraftData
}

export const useRevisedItrDraft = ({ step, isSubmitted, draftData }: UseRevisedItrDraftProps) => {
  const pushToast = useAppStore((state) => state.pushToast)

  const saveCurrentDraft = useCallback(() => {
    if (isSubmitted) return
    const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    const stepLabels: Record<number, string> = {
      1: 'Original Return',
      2: 'Reason for Revision',
      3: 'Correction Details',
      4: 'Supporting Documents',
      5: 'Review Revision',
    }
    userStorage.saveDraft({
      serviceId: 'revised-itr',
      serviceTitle: 'Revised ITR Filing',
      currentStep: step,
      totalSteps: 5,
      stepLabel: stepLabels[step] || 'Revision Details',
      formData: draftData as unknown as Record<string, unknown>,
      savedAt: timeStr,
      savedTimestamp: Date.now(),
      resumeRoute: routePaths.itr.revisedItr,
    })
  }, [isSubmitted, step, draftData])

  useEffect(() => {
    if (!isSubmitted && step > 1) {
      saveCurrentDraft()
    }
  }, [step, isSubmitted, saveCurrentDraft])

  const shouldBlock = !isSubmitted && step > 1
  const draftBlocker = useDraftBlocker({
    shouldBlock,
    onSaveDraft: () => {
      saveCurrentDraft()
      pushToast('Revised ITR draft saved', 'success')
    },
    onDiscardDraft: () => {
      userStorage.deleteDraft('revised-itr')
      pushToast('Draft discarded', 'info')
    },
    defaultExitRoute: routePaths.itr.root,
  })

  return {
    ...draftBlocker,
    saveCurrentDraft,
  }
}
