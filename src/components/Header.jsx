import { Bell, HelpCircle, Menu } from 'lucide-react'

const Header = ({ toggleSidebar, isMobile, currentPage }) => {
  const getPageInfo = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Ad Management',
          subtitle: '管理和优化您的广告活动'
        }
      case 'drafts':
        return {
          title: 'Drafts',
          subtitle: '管理您的草稿广告活动'
        }
      case 'settings':
        return {
          title: 'Settings',
          subtitle: '管理您的品牌和设置'
        }
      default:
        return {
          title: 'Ad Management',
          subtitle: '管理和优化您的广告活动'
        }
    }
  }

  const pageInfo = getPageInfo()

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
            <span>时区:</span>
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
