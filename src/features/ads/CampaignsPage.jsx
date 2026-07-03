import { useNavigate } from 'react-router-dom'
import AdsManagerPrototype from './AdsManagerPrototype'

/* ═══════════════════════════════════════════════════════════
   CampaignsPage — Wraps AdManagerV3 with store connections
   ═══════════════════════════════════════════════════════════ */

const CampaignsPage = () => {
  const nav = useNavigate()

  const handleEditBrandConfig = () => {
    nav('../settings/brand-info')
  }

  return (
    <AdsManagerPrototype
      onEditBrandConfig={handleEditBrandConfig}
    />
  )
}

export default CampaignsPage
