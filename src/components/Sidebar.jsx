import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Layout, Image, Sparkles, BarChart3, Settings, Users, 
  DollarSign, Search, FileText, ChevronDown, X, Plus, 
  Lightbulb, Layers, Archive, ChevronRight, Target, 
  RefreshCw, Zap, Trash2, Palette, FolderOpen, Eye, 
  Brain, Building2, Info, Package, Box, Cog, Star, BookOpen,
  ChevronsUpDown, Check, LogOut, CreditCard, Link, HelpCircle
} from 'lucide-react'
import { MENU_ITEMS, SETTINGS_MENU } from '../constants/menuConfig'
const Sidebar = ({ isMobile, onClose, selectedBrand, onBrandChange, onCreateBrand, brands = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  // 获取路径的最后一部分作为页面 key
  const path = location.pathname.slice(1) || 'overview'
  const parts = path.split('/')
  const currentPage = parts[parts.length - 1] || 'overview'
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(['aiOptimize'])
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // 根据当前页面自动展开父菜单
  useEffect(() => {
    // 查找当前页面所属的父菜单
    const findParentKey = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) return null
        if (item.children && item.children.some(child => child.key === targetKey)) {
          return item.key
        }
        if (item.children) {
          const found = findParentKey(item.children, targetKey)
          if (found) return found
        }
      }
      return null
    }

    const parentKey = findParentKey(MENU_ITEMS, currentPage)
    if (parentKey && !expandedKeys.includes(parentKey)) {
      setExpandedKeys(prev => [...prev, parentKey])
    }
  }, [currentPage])

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])
  
  const iconMap = {
    Layout, Layers, Lightbulb, RefreshCw, FileText, Target,
    Sparkles, Zap, Trash2, BarChart3, Palette, FolderOpen,
    Eye, Brain, Building2, Info, Package, Box, Users
  }

  // 构建完整路径
  const buildPath = (menuItem, parentKey = null) => {
    return parentKey ? `/${parentKey}/${menuItem.key}` : `/${menuItem.key}`
  }

  const renderMenuItem = (menuItem, depth = 0, isWithinAbandon = false, parentKey = null) => {
    const ItemIcon = iconMap[menuItem.icon]
    const isItemActive = currentPage === menuItem.key
    const itemHasChildren = menuItem.children && menuItem.children.length > 0
    const itemIsExpanded = expandedKeys.includes(menuItem.key)
    const isAbandon = menuItem.key === 'abandon' || isWithinAbandon

    return (
      <div key={menuItem.key} className="w-full">
        <button
          onClick={() => {
            if (itemHasChildren) {
              setExpandedKeys(prev =>
                prev.includes(menuItem.key)
                  ? prev.filter(k => k !== menuItem.key)
                  : [...prev, menuItem.key]
              )
            } else {
              navigate(buildPath(menuItem, parentKey))
            }
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
            isItemActive
              ? (isAbandon ? 'bg-red-100 text-red-700 shadow-sm' : 'bg-slate-900 text-white shadow-md shadow-slate-200')
              : (isAbandon ? 'bg-red-50/50 text-red-400 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50')
          }`}
          style={{ marginLeft: `${depth * 4}px`, width: `calc(100% - ${depth * 4}px)` }}
        >
          {depth > 0 && isItemActive && (
            <div className={`absolute left-1.5 w-1 h-1 rounded-full ${isAbandon ? 'bg-red-500' : 'bg-white'}`} />
          )}
          
          {ItemIcon && (
            <ItemIcon 
              size={depth === 0 ? 19 : 17} 
              className={`shrink-0 transition-colors duration-200 ${
                isItemActive 
                  ? (isAbandon ? 'text-red-600' : 'text-white') 
                  : (isAbandon ? 'text-red-300 group-hover:text-red-400' : 'text-slate-400 group-hover:text-slate-600')
              }`} 
            />
          )}
          
          <span className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
            depth > 0 ? 'text-[13px]' : 'text-[14px]'
          } ${isAbandon ? 'line-through' : ''}`}>
            {menuItem.label}
          </span>
          
          {itemHasChildren && (
            <ChevronRight 
              size={14} 
              className={`ml-auto shrink-0 transition-transform duration-200 ${
                itemIsExpanded ? 'rotate-90' : ''
              } ${isItemActive ? (isAbandon ? 'text-red-500' : 'text-white/70') : (isAbandon ? 'text-red-200' : 'text-slate-300 group-hover:text-slate-400')}`} 
            />
          )}
        </button>
        
        {itemHasChildren && itemIsExpanded && (
          <div className="mt-1 flex flex-col gap-0.5 border-l border-slate-100 ml-5 pl-1">
            {menuItem.children.map(child => renderMenuItem(child, depth + 1, isAbandon, menuItem.key))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col font-sans select-none">
      {/* Logo Section - Height matched to Header (exact 72px) */}
      <div className="h-[72px] px-6 flex items-center justify-center border-b border-slate-100 shrink-0">
        <img 
          src="https://www.adsgo.ai/_next/static/media/logo.ecc9c90c.svg"
          alt="AdsGo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Brand Switcher */}
      <div className="px-4 py-4 shrink-0">
        <div className="relative">
          <button 
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-slate-200 transition-colors">
                <span className="text-lg">🐾</span>
              </div>
              <span className="font-bold text-slate-800 text-[14px] truncate">{selectedBrand}</span>
            </div>
            <ChevronsUpDown 
              size={14} 
              className="text-slate-400 shrink-0" 
            />
          </button>
          
          {isBrandDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    onBrandChange(brand)
                    setIsBrandDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all ${
                    selectedBrand === brand ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-sm ${selectedBrand === brand ? 'bg-primary/20' : 'bg-slate-100'}`}>🐾</div>
                  <span className="font-semibold text-sm">{brand}</span>
                  {selectedBrand === brand && <Check size={14} className="ml-auto text-primary" strokeWidth={3} />}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-1.5 mx-2" />
              <div className="px-2 pb-1">
                <button
                  onClick={() => {
                    setIsBrandDropdownOpen(false)
                    onCreateBrand()
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-primary text-primary rounded-xl hover:bg-primary/5 transition-all group"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-bold text-sm">New Brand</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar text-sm">
        {MENU_ITEMS.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto px-3 py-4 flex flex-col gap-1 border-t border-slate-50">
        {/* Brand Management button hidden */}
        
        <div className="h-px bg-slate-100 my-2 mx-1" />

        <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-200 text-slate-600 hover:bg-slate-50 group">
          <Star size={17} className="text-amber-400 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium text-[13px]">What's New</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-200 text-slate-600 hover:bg-slate-50 group">
          <BookOpen size={17} className="text-sky-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium text-[13px]">Getting Started</span>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-3 border-t border-slate-100 relative" ref={userMenuRef}>
        {/* User Floating Menu */}
        {isUserMenuOpen && (
          <div className="absolute left-full bottom-0 ml-2 w-64 bg-[#0F0F1A] text-slate-300 rounded-2xl shadow-2xl z-[100] overflow-hidden border border-white/10 animate-in fade-in slide-in-from-left-2 duration-200 pt-3 pb-3">
            <div className="flex flex-col gap-2 relative">
              {/* Menu Close Header - Integrated to save space */}
              <div className="absolute top-0 right-2 z-10">
                <button 
                  onClick={() => setIsUserMenuOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Manage Group */}
              <div className="space-y-1">
                <p className="px-4 py-1 text-[11px] font-bold text-slate-500 tracking-wider">Manage My AdsGo</p>
                <div className="border-l-4 border-slate-800 ml-1 pl-1 space-y-0.5">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-200 hover:text-white group text-left">
                    <Link size={16} className="text-slate-500 group-hover:text-white shrink-0" />
                    <span className="truncate">Ad Account Connect</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-200 hover:text-white group text-left">
                    <CreditCard size={16} className="text-slate-500 group-hover:text-white shrink-0" />
                    <span className="truncate">Subscriptions</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-200 hover:text-white group text-left">
                    <Users size={16} className="text-slate-500 group-hover:text-white shrink-0" />
                    <span className="truncate">User Profile</span>
                  </button>
                </div>
              </div>

              {/* Help Group */}
              <div className="space-y-1">
                <p className="px-4 py-1 text-[11px] font-bold text-slate-500 tracking-wider">Get Help</p>
                <div className="border-l-4 border-slate-800 ml-1 pl-1 space-y-0.5">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-200 hover:text-white group text-left">
                    <HelpCircle size={16} className="text-slate-500 group-hover:text-white shrink-0" />
                    <span className="truncate">Help center</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-200 hover:text-white group text-left">
                    <BookOpen size={16} className="text-slate-500 group-hover:text-white shrink-0" />
                    <span className="truncate">Getting started</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-slate-200 hover:text-white group text-left">
                    <Star size={16} className="text-slate-500 group-hover:text-white shrink-0" />
                    <span className="truncate">What's New</span>
                  </button>
                </div>
              </div>

              {/* Logout */}
              <div className="pt-2 border-t border-white/10 mt-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/20 transition-all text-sm font-bold text-red-400 hover:text-red-300 group text-left">
                  <LogOut size={18} className="text-red-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 group cursor-pointer ${isUserMenuOpen ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-50'}`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-slate-50 group-hover:ring-slate-100 transition-all">
                U
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate leading-tight">User</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">Professional Plan</p>
            </div>
            <ChevronsUpDown size={14} className="text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}} />
    </div>
  )
}

export default Sidebar
