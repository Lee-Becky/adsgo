import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import GlobalDemoOverlay from './GlobalDemoOverlay'

const MainLayout = ({ children, showDemoOverlay, onDemoConnect, onDemoCreate, selectedBrand, onBrandChange, onCreateBrand, brands = [] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('sidebarPinned')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    localStorage.setItem('sidebarPinned', JSON.stringify(isPinned))
  }, [isPinned])

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[600]
          bg-white border-r border-border flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${!isMobile ? (isPinned ? 'w-64' : 'w-[72px] hover:w-64 group/sidebar shadow-xl hover:shadow-2xl') : 'w-64'}
        `}
      >
        <Sidebar 
          isMobile={isMobile} 
          isPinned={isPinned}
          onTogglePinned={() => setIsPinned(!isPinned)}
          onClose={toggleSidebar} 
          selectedBrand={selectedBrand} 
          onBrandChange={onBrandChange} 
          onCreateBrand={onCreateBrand}
          brands={brands}
        />
      </aside>

      {/* Main Content Wrapper */}
      <div 
        className={`
          flex-1 flex flex-col h-full relative min-w-0 transition-all duration-300
          ${!isMobile ? (isPinned ? 'ml-64' : 'ml-[72px]') : ''}
        `}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Content Area with Overlay Scope */}
        <div className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto scroll-smooth p-6">
            {children}
          </main>
          
          {/* Demo Overlay - Placed here to cover content area only */}
          {showDemoOverlay && (
            <GlobalDemoOverlay 
              onConnect={onDemoConnect}
              onCreate={onDemoCreate}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
