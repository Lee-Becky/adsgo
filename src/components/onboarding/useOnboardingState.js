import { useState, useEffect, useCallback, useRef } from 'react'

const TOTAL_STEPS = 6

export function useOnboardingState({
  selectedBrand,
  publishedAt,
  goalConfigured,
  isAutopilotEnabled,
  isAutoPublishEnabled,
  autoOptimizeConfirmed,
}) {
  const [completedSteps, setCompletedSteps] = useState([])
  const [dismissed, setDismissed] = useState(false)
  const prevLengthRef = useRef(0)

  const markStepCompleted = useCallback((index) => {
    setCompletedSteps(prev => {
      // 顺序完成：前置步骤未完成时不允许标记
      for (let i = 0; i < index; i++) {
        if (!prev.includes(i)) return prev
      }
      return prev.includes(index) ? prev : [...prev, index]
    })
  }, [])

  const dismiss = useCallback(() => setDismissed(true), [])

  useEffect(() => {
    setCompletedSteps([])
    setDismissed(false)
  }, [selectedBrand])

  // Step 0: publish campaign
  useEffect(() => {
    if (publishedAt) markStepCompleted(0)
  }, [publishedAt, markStepCompleted])

  // Step 1: configure optimize goals
  useEffect(() => {
    if (goalConfigured) markStepCompleted(1)
  }, [goalConfigured, markStepCompleted])

  // Step 2: enable recommend/auto or confirm any optimize mode
  useEffect(() => {
    if (isAutopilotEnabled || isAutoPublishEnabled || autoOptimizeConfirmed) markStepCompleted(2)
  }, [isAutopilotEnabled, isAutoPublishEnabled, autoOptimizeConfirmed, markStepCompleted])

  const allDone = completedSteps.length >= TOTAL_STEPS

  const isStep1Done = completedSteps.includes(0)

  const currentStep = (() => {
    for (let i = 0; i < TOTAL_STEPS; i++) {
      if (!completedSteps.includes(i)) return i
    }
    return TOTAL_STEPS
  })()

  const justCompleted = completedSteps.length > prevLengthRef.current
  useEffect(() => {
    prevLengthRef.current = completedSteps.length
  }, [completedSteps.length])

  return {
    completedSteps,
    markStepCompleted,
    allDone,
    dismissed,
    dismiss,
    currentStep,
    isStep1Done,
    justCompleted,
    totalSteps: TOTAL_STEPS,
  }
}
