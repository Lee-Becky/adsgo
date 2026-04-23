import { useCallback, useState } from 'react'

const seenSteps = new Set()

export function useTourSeen() {
  const [, forceUpdate] = useState(0)

  const hasSeen = useCallback((stepIndex) => seenSteps.has(stepIndex), [])

  const markSeen = useCallback((stepIndex) => {
    if (!seenSteps.has(stepIndex)) {
      seenSteps.add(stepIndex)
      forceUpdate(n => n + 1)
    }
  }, [])

  return { hasSeen, markSeen }
}
