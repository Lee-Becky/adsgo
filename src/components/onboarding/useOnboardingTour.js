import { useOnboardingContext } from './OnboardingContext'

export function useOnboardingTour(stepIndex) {
  const { activeTourStep, tourSubStep, endTour, advanceTourSubStep } = useOnboardingContext()
  const isActive = activeTourStep === stepIndex
  return { isActive, tourSubStep, endTour, advanceTourSubStep }
}
