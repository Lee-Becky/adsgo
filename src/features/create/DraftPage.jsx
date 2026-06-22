import { useNavigate } from 'react-router-dom'
import useFeatureFlagsStore from '@stores/featureFlagsStore'
import { AutoRegeneration } from '@components/autoRegeneration'

/* ═══════════════════════════════════════════════════════════
   DraftPage — Wraps AutoRegeneration (drafts + AI recommendations)
   ═══════════════════════════════════════════════════════════ */

const DraftPage = () => {
  const nav = useNavigate()
  const { autoRegenEnabled, setAutoRegenEnabled } = useFeatureFlagsStore()

  return (
    <AutoRegeneration
      onPageChange={(p) => nav(`/${p}`)}
      autoRegenEnabled={autoRegenEnabled}
      onAutoRegenChange={setAutoRegenEnabled}
    />
  )
}

export default DraftPage
