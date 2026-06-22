import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import GlobalDemoOverlay from './GlobalDemoOverlay'
// import OnboardingWidget from './onboarding/OnboardingWidget'
// import { OnboardingProvider } from './onboarding/OnboardingContext'
import SupportBubble from './support/SupportBubble'
import useBrandStore from '@stores/brandStore'
import useFeatureFlagsStore from '@stores/featureFlagsStore'

const MainLayout = ({ children, showDemoOverlay, onDemoConnect, onDemoCreate,
  /* Legacy props — still accepted for backward compat but stores are preferred */
  selectedBrand: propBrand, onBrandChange: propBrandChange, onCreateBrand: propCreateBrand,
  brands: propBrands, autoExecuteRecommendations: propAutoExec, autoRegenEnabled: propAutoRegen,
  publishedAt: propPublished, goalConfigured: propGoal, autoOptimizeConfirmed: propAutoOpt,
}) => {
  const navigate = useNavigate()

  /* ── Read from stores (preferred over props) ────────────── */
  const storeBrand = useBrandStore((s) => s.selectedBrand)
  const storeBrands = useBrandStore((s) => s.brands)
  const switchBrand = useBrandStore((s) => s.switchBrand)
  const setCreateModal = useBrandStore((s) => s.setIsCreateBrandModalOpen)
  const storeAutoExec = useFeatureFlagsStore((s) => s.autoExecuteRecommendations)
  const storeAutoRegen = useFeatureFlagsStore((s) => s.autoRegenEnabled)
  const storePublished = useFeatureFlagsStore((s) => s.publishedAt)
  const storeGoal = useFeatureFlagsStore((s) => s.goalConfigured)
  const storeAutoOpt = useFeatureFlagsStore((s) => s.autoOptimizeConfirmed)

  // Resolve: use store values, fall back to props
  const selectedBrand = storeBrand || propBrand
  const brands = storeBrands?.length > 0 ? storeBrands : (propBrands || [])
  const autoExecuteRecommendations = storeAutoExec ?? propAutoExec
  const autoRegenEnabled = storeAutoRegen ?? propAutoRegen
  const publishedAt = storePublished ?? propPublished
  const goalConfigured = storeGoal ?? propGoal
  const autoOptimizeConfirmed = storeAutoOpt ?? propAutoOpt

  const handleBrandChange = (brand) => {
    if (propBrandChange) propBrandChange(brand)
    else {
      switchBrand(brand)
      navigate('/mediaPlan')
    }
  }

  const handleCreateBrand = () => {
    if (propCreateBrand) propCreateBrand()
    else setCreateModal(true)
  }

  /* ── Sidebar state ──────────────────────────────────────── */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('sidebarPinned')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    localStorage.setItem('sidebarPinned', JSON.stringify(isPinned))
  }, [isPinned])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false)
  }, [isMobile])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    // <OnboardingProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-900/50 backdrop-blur-md z-[500] lg:hidden transition-opacity duration-normal"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[600]
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${!isMobile ? (isPinned ? 'w-64' : 'w-[68px]') : 'w-64'}
        `}
      >
        <Sidebar
          isMobile={isMobile}
          isPinned={isPinned}
          onTogglePinned={() => setIsPinned(!isPinned)}
          onClose={toggleSidebar}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
          onCreateBrand={handleCreateBrand}
          brands={brands}
        />
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`
          flex-1 flex flex-col h-full relative min-w-0 transition-all duration-300
          ${!isMobile ? (isPinned ? 'ml-64' : 'ml-[68px]') : ''}
        `}
        style={{ '--sidebar-w': !isMobile ? (isPinned ? '256px' : '68px') : '0px' }}
      >
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        <div className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto scroll-smooth px-6 py-5">
            {children}
          </main>

          {showDemoOverlay && (
            <GlobalDemoOverlay
              onConnect={onDemoConnect}
              onCreate={onDemoCreate}
            />
          )}
        </div>

        {/* <OnboardingWidget
          selectedBrand={selectedBrand}
          publishedAt={publishedAt}
          goalConfigured={goalConfigured}
          isAutopilotEnabled={autoExecuteRecommendations}
          isAutoPublishEnabled={autoRegenEnabled}
          autoOptimizeConfirmed={autoOptimizeConfirmed}
        /> */}

        <SupportBubble />
      </div>
    </div>
    // </OnboardingProvider>
  )
}

export default MainLayout
