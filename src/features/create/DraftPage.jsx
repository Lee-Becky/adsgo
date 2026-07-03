import { useNavigate } from 'react-router-dom'
import useFeatureFlagsStore from '@stores/featureFlagsStore'
import { AutoRegeneration } from '@components/autoRegeneration'

/* ═══════════════════════════════════════════════════════════
   DraftPage — AI 推荐 Top3 卡片 + 草稿表格 + 结构审核
   ═══════════════════════════════════════════════════════════ */

const DraftPage = () => {
  const nav = useNavigate()
  const { autoRegenEnabled, setAutoRegenEnabled } = useFeatureFlagsStore()

  return (
    <div className="-mx-6 min-h-[100dvh] bg-background">
      <AutoRegeneration
        onPageChange={(p) => nav(`/${p}`)}
        autoRegenEnabled={autoRegenEnabled}
        onAutoRegenChange={setAutoRegenEnabled}
      />
    </div>
  )
}

export default DraftPage
