import { useState, useEffect, useCallback } from 'react'

export function useOnboardingState(selectedBrand) {
  const [completedSteps, setCompletedSteps] = useState([])
  const [dismissed, setDismissed] = useState(false)

  // Reset when brand changes
  useEffect(() => {
    setCompletedSteps([])
    setDismissed(false)
  }, [selectedBrand])

  const allDone = completedSteps.length >= 3

  const markStepCompleted = useCallback((index) => {
    setCompletedSteps(prev => prev.includes(index) ? prev : [...prev, index])
  }, [])

  const dismiss = useCallback(() => setDismissed(true), [])

  return { completedSteps, markStepCompleted, allDone, dismissed, dismiss }
}
