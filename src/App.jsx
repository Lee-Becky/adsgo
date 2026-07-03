import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './router/router'
import useBrandStore from './stores/brandStore'
import useCampaignStore from './stores/campaignStore'
import CampaignAnalysisModal from './components/CampaignAnalysisModal'
import BudgetReasonModal from './components/BudgetReasonModal'
import BudgetEditModal from './components/BudgetEditModal'
import CreateBrandModal from './components/brand/CreateBrandModal'
import BrandSwitchLoading from './components/brand/BrandSwitchLoading'
import ZIndexObserver from './components/ZIndexObserver'
import { resetModalCounter } from './constants/zIndex'
import LunaChatPanel from './features/chat/LunaChatPanel'
import GlobalLunaBar from './components/luna/GlobalLunaBar'

/* ═══════════════════════════════════════════════════════════
   App — Thin shell: providers, global modals, router
   All page state lives in Zustand stores.
   All routing is declarative in src/router/router.jsx.
   ═══════════════════════════════════════════════════════════ */

function App() {
  const location = useLocation()

  /* ── Reset modal z-index on route change ────────────────── */
  useEffect(() => {
    resetModalCounter()
  }, [location.pathname])

  /* ── Store selectors for global modals ──────────────────── */
  const {
    brands, selectedBrand, isBrandSwitching,
    isCreateBrandModalOpen, setIsCreateBrandModalOpen,
    createBrand,
  } = useBrandStore()

  const {
    selectedCampaign, showCampaignAnalysis, showBudgetReason,
    budgetReasonData, showBudgetEdit,
    closeCampaignAnalysis, closeBudgetReason, closeBudgetEdit,
    saveBudget, updateBudgetStatus,
  } = useCampaignStore()

  return (
    <>
      <ZIndexObserver />

      {/* Declarative route tree */}
      <AppRoutes />

      {/* ── Global Modals ───────────────────────────────────── */}
      <CampaignAnalysisModal
        isOpen={showCampaignAnalysis}
        onClose={closeCampaignAnalysis}
        campaign={selectedCampaign}
      />

      <BudgetReasonModal
        isOpen={showBudgetReason}
        onClose={closeBudgetReason}
        campaign={selectedCampaign}
        reason={budgetReasonData}
      />

      <BudgetEditModal
        isOpen={showBudgetEdit}
        onClose={closeBudgetEdit}
        campaign={selectedCampaign}
        onSave={saveBudget}
        onUpdateBudgetStatus={updateBudgetStatus}
      />

      <CreateBrandModal
        isOpen={isCreateBrandModalOpen || brands.length === 0}
        isForceOpen={brands.length === 0}
        onClose={() => setIsCreateBrandModalOpen(false)}
        onCreate={createBrand}
      />

      {/* Brand switching overlay */}
      {isBrandSwitching && (
        <BrandSwitchLoading brandName={selectedBrand} />
      )}

      {/* Global Luna Chat Panel */}
      <LunaChatPanel />
      <GlobalLunaBar />
    </>
  )
}

export default App
