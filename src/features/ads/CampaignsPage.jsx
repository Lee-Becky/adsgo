import { useNavigate } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'
import useFeatureFlagsStore from '@stores/featureFlagsStore'
import AdManagerV3 from '@components/adManagerV3/AdManagerV3'

/* ═══════════════════════════════════════════════════════════
   CampaignsPage — Wraps AdManagerV3 with store connections
   ═══════════════════════════════════════════════════════════ */

const CampaignsPage = () => {
  const nav = useNavigate()
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const { setEditingBrand } = useBrandStore()
  const { autoExecuteRecommendations, setAutoExecuteRecommendations, confirmAutoOptimize } = useFeatureFlagsStore()

  const handleEditBrandConfig = () => {
    setEditingBrand({ id: 1, name: selectedBrand })
    nav('/settings')
  }

  return (
    <AdManagerV3
      onEditBrandConfig={handleEditBrandConfig}
      selectedBrand={selectedBrand}
      onPageChange={(p) => nav(`/${p}`)}
      autoExecuteRecommendations={autoExecuteRecommendations}
      onAutoExecuteChange={setAutoExecuteRecommendations}
      onOptimizeModeConfirmed={confirmAutoOptimize}
    />
  )
}

export default CampaignsPage
