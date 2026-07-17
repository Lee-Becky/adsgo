import { useEffect } from 'react'
import { useParams, Outlet } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'
import MainLayout from '@components/MainLayout'
import useMarketingOpsStore from '@stores/marketingOpsStore'

/* ═══════════════════════════════════════════════════════════
   WorkspaceLayout — reads :brandId URL param,
   syncs to brandStore, wraps children in MainLayout.
   Hosts the global Luna Chat panel (portal-rendered).
   ═══════════════════════════════════════════════════════════ */

const WorkspaceLayout = () => {
  const { brandId } = useParams()
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const switchBrand = useBrandStore((s) => s.switchBrand)
  const brands = useBrandStore((s) => s.brands)
  const setActiveOpsBrand = useMarketingOpsStore((s) => s.setActiveBrand)

  // Sync URL brandId to store (if it differs)
  useEffect(() => {
    if (brandId && brandId !== 'default') {
      // Decode URL-encoded brand names
      const decoded = decodeURIComponent(brandId)
      if (decoded !== selectedBrand && brands.includes(decoded)) {
        switchBrand(decoded)
      }
    }
  }, [brandId])

  useEffect(() => {
    setActiveOpsBrand(selectedBrand || 'LumaFit')
  }, [selectedBrand, setActiveOpsBrand])

  return (
    <MainLayout
      showDemoOverlay={false}
      onDemoConnect={() => {}}
      onDemoCreate={() => {}}
    >
      <Outlet />
    </MainLayout>
  )
}

export default WorkspaceLayout
