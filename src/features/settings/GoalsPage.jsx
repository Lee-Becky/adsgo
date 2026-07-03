import useFeatureFlagsStore from '@stores/featureFlagsStore'
import OptimizeGoals from '@components/brand/OptimizeGoals'

/* ═══════════════════════════════════════════════════════════
   GoalsPage — OptimizeGoals + Red Line thresholds
   ═══════════════════════════════════════════════════════════ */

const GoalsPage = () => {
  const { markGoalConfigured } = useFeatureFlagsStore()

  return (
    <div className="space-y-8">
      <OptimizeGoals onGoalSave={markGoalConfigured} />
    </div>
  )
}

export default GoalsPage
