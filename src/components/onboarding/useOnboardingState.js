import { useState, useEffect, useMemo, useCallback } from 'react'

const getStorageKey = (brand) => `onboarding_completed_${brand}`

export function useOnboardingState(selectedBrand) {
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(selectedBrand))
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [showCongrats, setShowCongrats] = useState(false)

  // Reload state when brand changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(selectedBrand))
      setCompletedSteps(saved ? JSON.parse(saved) : [])
    } catch {
      setCompletedSteps([])
    }
    setShowCongrats(false)
  }, [selectedBrand])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(getStorageKey(selectedBrand), JSON.stringify(completedSteps))
  }, [completedSteps, selectedBrand])

  const allDone = completedSteps.length >= 3

  const currentStepIndex = useMemo(() => {
    for (let i = 0; i < 3; i++) {
      if (!completedSteps.includes(i)) return i
    }
    return null
  }, [completedSteps])

  const markStepCompleted = useCallback((index) => {
    setCompletedSteps(prev => {
      if (prev.includes(index)) return prev
      const next = [...prev, index]
      if (next.length >= 3) {
        setShowCongrats(true)
      }
      return next
    })
  }, [])

  // Auto-dismiss congrats after 3 seconds
  useEffect(() => {
    if (!showCongrats) return
    const timer = setTimeout(() => setShowCongrats(false), 3000)
    return () => clearTimeout(timer)
  }, [showCongrats])

  return { completedSteps, currentStepIndex, markStepCompleted, allDone, showCongrats }
}
