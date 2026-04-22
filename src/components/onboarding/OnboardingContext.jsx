import { createContext, useContext, useState, useCallback } from 'react'

const OnboardingContext = createContext(null)

export function OnboardingProvider({ children }) {
  const [activeTourStep, setActiveTourStep] = useState(null)
  const [tourSubStep, setTourSubStep] = useState(0)

  const startTour = useCallback((stepIndex) => {
    setActiveTourStep(stepIndex)
    setTourSubStep(0)
  }, [])

  const endTour = useCallback(() => {
    setActiveTourStep(null)
    setTourSubStep(0)
  }, [])

  const advanceTourSubStep = useCallback(() => {
    setTourSubStep(prev => prev + 1)
  }, [])

  return (
    <OnboardingContext.Provider value={{ activeTourStep, tourSubStep, startTour, endTour, advanceTourSubStep }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboardingContext must be used within OnboardingProvider')
  return ctx
}
