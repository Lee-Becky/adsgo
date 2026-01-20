import { Bell, HelpCircle, Menu } from 'lucide-react'
import { getPageInfo } from '../constants/menuConfig'

const Header = ({ toggleSidebar, isMobile, currentPage }) => {
  const pageInfo = getPageInfo(currentPage)

  return (
    <div className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageInfo.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{pageInfo.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            <span>Timezone:</span>
            <span className="font-medium">UTC+8</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
