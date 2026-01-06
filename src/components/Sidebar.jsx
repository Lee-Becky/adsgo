import { Layout, Image, Sparkles, BarChart3, Settings, Users, DollarSign, Search, FileText } from 'lucide-react'

const Sidebar = ({ isMobile, onClose }) => {
  const menuItems = [
    { icon: Image, label: 'Ad Management', active: true },
  ]

  return (
    <div className="w-64 h-full bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">AdsGo</h1>
        <p className="text-sm text-gray-500 mt-1">广告管理平台</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              item.active
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        {isMobile && (
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-3"
          >
            <X size={20} />
            <span className="text-sm">关闭菜单</span>
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">用户</p>
            <p className="text-sm text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
