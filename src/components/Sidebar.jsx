import React, { useState } from 'react'
import { Layout, Image, Sparkles, BarChart3, Settings, Users, DollarSign, Search, FileText, ChevronDown, X, Plus, Lightbulb, Layers, Archive, ChevronRight, Target, RefreshCw } from 'lucide-react'
import { MENU_ITEMS, SETTINGS_MENU } from '../constants/menuConfig'

const Sidebar = ({ isMobile, onClose, currentPage, onPageChange, selectedBrand, onBrandChange }) => {
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  
  const brands = ['neopets', 'gaming studio', 'tech brand']
  
  const [isDeprecatedOpen, setIsDeprecatedOpen] = useState(false)
  
  // 图标映射
  const iconMap = {
    Layout,
    Layers,
    Lightbulb,
    RefreshCw,
    FileText,
    Target
  }
  
  const deprecatedItems = [
    { icon: Image, label: 'Ad Manager V1.0', pageKey: 'dashboard' },
  ]

  return (
    <div className="w-64 h-full bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <img 
          src="https://www.adsgo.ai/_next/static/media/logo.ecc9c90c.svg"
          alt="AdsGo"
          className="h-19 w-auto"
        />
        <p className="text-sm text-gray-500 mt-1">24H AI Advertising Expert</p>
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
                  // TODO: Implement logic to create new Business Suite
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              >
                <Plus size={16} />
                <span className="font-medium">New Business Suite</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const IconComponent = iconMap[item.icon]
          const isActive = currentPage === item.key
          
          return (
            <button
              key={item.key}
              onClick={() => onPageChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <IconComponent size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
        
        {/* Deprecated Pages - Hidden */}
        {/* <div className="mt-4">
          <button
            onClick={() => setIsDeprecatedOpen(!isDeprecatedOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isDeprecatedOpen
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Archive size={20} />
            <span className="font-medium">Deprecated Pages</span>
            <ChevronRight size={16} className={`ml-auto transition-transform ${isDeprecatedOpen ? 'rotate-90' : ''}`} />
          </button>
          
          {isDeprecatedOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {deprecatedItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onPageChange(item.pageKey)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    currentPage === item.pageKey
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div> */}
      </nav>

      {/* Business Suite Menu - Just above User Profile */}
      <div className="px-4 py-2">
        <button
          onClick={() => onPageChange(SETTINGS_MENU.key)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            currentPage === SETTINGS_MENU.key
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Target size={20} />
          <span className="font-medium">{SETTINGS_MENU.label}</span>
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
            <span className="text-sm">Close Menu</span>
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">User</p>
            <p className="text-sm text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
