import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import GlobalDemoOverlay from './GlobalDemoOverlay'

const MainLayout = ({ children, showDemoOverlay, onDemoConnect, onDemoCreate, currentPage, onPageChange, selectedBrand, onBrandChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-border flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        <Sidebar isMobile={isMobile} onClose={toggleSidebar} currentPage={currentPage} onPageChange={onPageChange} selectedBrand={selectedBrand} onBrandChange={onBrandChange} />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} currentPage={currentPage} />

        {/* Content Area with Overlay Scope */}
        <div className="flex-1 relative overflow-hidden">
          {/* Scrollable Page Content */}
          <main className="absolute inset-0 overflow-y-auto">
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
