import { useState } from 'react'
import { Layout, Image, Sparkles, BarChart3, Settings, Users, DollarSign, Search, FileText, ChevronDown, X, Plus, Lightbulb } from 'lucide-react'

const Sidebar = ({ isMobile, onClose, currentPage, onPageChange, selectedBrand, onBrandChange }) => {
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  
  const brands = ['neopets', 'gaming studio', 'tech brand']
  
  const menuItems = [
    { icon: Layout, label: 'Dashboard', active: currentPage === 'overview' },
    { icon: Image, label: 'Ad Management', active: currentPage === 'dashboard' },
    { icon: Lightbulb, label: 'Ad Insights', active: currentPage === 'insights' },
    { icon: FileText, label: 'Drafts', active: currentPage === 'drafts' },
  ]

  return (
    <div className="w-64 h-full bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">AdsGo</h1>
        <p className="text-sm text-gray-500 mt-1">广告管理平台</p>
      </div>

      {/* Brand Switcher */}
      <div className="px-4 py-3 border-b border-border relative">
        <button 
          onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-medium text-gray-900">{selectedBrand}</span>
          </div>
          <ChevronDown size={16} className={`text-gray-600 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Brand Dropdown */}
        {isBrandDropdownOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    onBrandChange(brand)
                    setIsBrandDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedBrand === brand ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <span className="text-xl">🐾</span>
                  <span className="font-medium">{brand}</span>
                </button>
              ))}
              <div className="border-t border-border my-2"></div>
              <button
                onClick={() => {
                  setIsBrandDropdownOpen(false)
                  // TODO: 实现创建新品牌的逻辑
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              >
                <Plus size={16} />
                <span className="font-medium">New brand</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => {
          let pageKey
          if (item.label === 'Dashboard') {
            pageKey = 'overview'
          } else if (item.label === 'Ad Management') {
            pageKey = 'dashboard'
          } else if (item.label === 'Ad Insights') {
            pageKey = 'insights'
          } else if (item.label === 'Drafts') {
            pageKey = 'drafts'
          } else {
            pageKey = 'settings'
          }
          
          return (
            <button
              key={index}
              onClick={() => onPageChange(pageKey)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Settings Menu - Just above User Profile */}
      <div className="px-4 py-2">
        <button
          onClick={() => onPageChange('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            currentPage === 'settings'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>

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
