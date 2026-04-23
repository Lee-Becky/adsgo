import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOnboardingContext } from './onboarding/OnboardingContext'
import OnboardingSpotlight from './onboarding/OnboardingSpotlight'

const STEP_SIDEBAR_CONFIG = {
  0: {
    key: 'batchGenerateAds',
    title: '这里是 Campaign Generator',
    body: '通过 AI 快速生成多平台广告 Campaign，一键完成发布。以后可以从左侧菜单直接进入',
    endOnClick: true,
    stepLabel: null,
  },
  1: {
    key: 'optimizeGoals',
    title: '这里是 Optimize Goals',
    body: '设定 ROAS/CPA 目标和每日预算上限，AI 将以此为基准决策优化方向',
    endOnClick: false,
    stepLabel: '1/3',
  },
  2: {
    key: 'adManagerV3',
    title: '这里是 Ad Manager',
    body: '查看 AI 推荐并开启 Recommend 或 Auto 任一功能，让 AI 接管关键优化动作',
    endOnClick: false,
    stepLabel: '1/4',
  },
  3: {
    key: 'autoRegeneration',
    title: '这里是 Draft & Recom.',
    body: '了解 AI 如何管理广告草稿并自动选择最佳时机发布新 Campaign',
    endOnClick: false,
    stepLabel: '1/3',
  },
  5: {
    key: 'mediaPlan',
    title: '这里是 Media Plan',
    body: '查看广告发布后 24 小时内的进度追踪、AI 设置清单和投放预期',
    endOnClick: true,
    stepLabel: null,
  },
}
import { 
  Layout, Image, Sparkles, BarChart3, Settings, Users, 
  DollarSign, Search, FileText, ChevronDown, X, Plus, 
  Lightbulb, Layers, Archive, ChevronRight, Target, 
  RefreshCw, Zap, Trash2, Palette, FolderOpen, Eye, 
  Brain, Building2, Info, Package, Box, Cog, Star, BookOpen,
  ChevronsUpDown, Check, LogOut, CreditCard, Link, HelpCircle,
  ChevronLeft, Wand2, Monitor, PieChart, BrainCircuit, ShieldCheck,
  Fingerprint, Swords, Award, Video, Compass, LayoutDashboard
} from 'lucide-react'
import { MENU_ITEMS, SETTINGS_MENU } from '../constants/menuConfig'

const MINI_LOGO = "data:image/png;base64,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"

const Sidebar = ({ isMobile, isPinned, onTogglePinned, onClose, selectedBrand, onBrandChange, onCreateBrand, brands = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const isCollapsed = !isMobile && !isPinned && !isHovered

  // 获取路径的最后一部分作为页面 key
  const path = location.pathname.slice(1) || 'overview'
  const parts = path.split('/')
  const currentPage = parts[parts.length - 1] || 'overview'
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const libraryMenuRef = useRef(null)
  const aiGenerateMenuRef = useRef(null)
  const batchGenerateAdsRef = useRef(null)
  const optimizeGoalsRef = useRef(null)
  const adManagerV3Ref = useRef(null)
  const autoRegenerationRef = useRef(null)
  const mediaPlanRef = useRef(null)
  const { activeTourStep, tourSubStep, endTour, advanceTourSubStep } = useOnboardingContext()

  const SIDEBAR_REFS = {
    batchGenerateAds: batchGenerateAdsRef,
    optimizeGoals: optimizeGoalsRef,
    adManagerV3: adManagerV3Ref,
    autoRegeneration: autoRegenerationRef,
    mediaPlan: mediaPlanRef,
    creativeLibrary: libraryMenuRef,
    aiGenerate: aiGenerateMenuRef,
  }

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
    Eye, Brain, Building2, Info, Package, Box, Users,
    Wand2, Monitor, PieChart, BrainCircuit, ShieldCheck,
    Fingerprint, Swords, Image, Award, Video, Compass, LayoutDashboard
  }

  // 构建完整路径
  const buildPath = (menuItem, parentKey = null) => {
    return parentKey ? `/${parentKey}/${menuItem.key}` : `/${menuItem.key}`
  }

  const renderMenuItem = (menuItem, parentKey = null, itemRef = null) => {
    const ItemIcon = iconMap[menuItem.icon]
    const isItemActive = currentPage === menuItem.key &&
      !(activeTourStep === 4 && tourSubStep === 2 && menuItem.key === 'creativeLibrary')
    const isSubItem = !!parentKey

    return (
      <button
        ref={itemRef}
        key={menuItem.key}
        onClick={() => {
          if (activeTourStep !== null) {
            if (activeTourStep === 4) {
              if (menuItem.key === 'creativeLibrary' && tourSubStep === 0) advanceTourSubStep()
              else if (menuItem.key === 'aiGenerate' && tourSubStep === 2) advanceTourSubStep()
            } else if (tourSubStep === 0) {
              const config = STEP_SIDEBAR_CONFIG[activeTourStep]
              if (config && menuItem.key === config.key) {
                config.endOnClick ? endTour() : advanceTourSubStep()
              }
            }
          }
          navigate(buildPath(menuItem, parentKey))
          if (isMobile) onClose()
        }}
        className={`w-full flex items-center rounded-xl transition-all duration-200 group relative text-left ${
          isItemActive
            ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
            : 'text-slate-600 hover:bg-slate-50'
        } ${isCollapsed ? 'justify-center px-0 py-2' : 'gap-3 px-4 py-2'} ${isSubItem && !isCollapsed ? 'ml-1' : ''}`}
      >
        {isSubItem && isItemActive && (
          <div className={`absolute w-[2px] bg-slate-900 rounded-full ${isCollapsed ? '-left-px h-6' : '-left-[10px] h-4'}`} />
        )}
        
        <div className={`flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${isCollapsed ? 'w-full' : 'w-5'}`}>
          {ItemIcon && (
            <ItemIcon 
              size={isSubItem ? 16 : 18} 
              className={`transition-colors duration-200 ${
                isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              }`} 
            />
          )}
          {isCollapsed && menuItem.shortLabel && (
            <span className={`text-[9px] font-bold mt-1 leading-none transition-all duration-300 scale-90 ${
              isItemActive ? 'text-white/90' : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              {menuItem.shortLabel}
            </span>
          )}
        </div>
        
        {!isCollapsed && (
          <span className={`font-bold whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 opacity-100 w-auto ${
            isSubItem ? 'text-[12.5px]' : 'text-[13.5px]'
          }`}>
            {menuItem.label}
          </span>
        )}
      </button>
    )
  }

  const renderNavSection = (item) => {
    if (item.hidden) return null
    if (item.children) {
      const visibleChildren = item.children.filter(child => !child.hidden)
      return (
        <div key={item.key} className={`space-y-0.5 transition-all duration-300 ${isCollapsed ? 'mb-0.5' : 'mb-2'}`}>
          {!isCollapsed && (
            <p className="px-4 py-1 text-[11px] font-bold text-slate-400 tracking-wider transition-all duration-300 opacity-100">
              {item.label}
            </p>
          )}
          <div className={`border-slate-100 space-y-0.5 transition-all duration-300 ${isCollapsed ? 'border-l-0 ml-0' : 'border-l-2 ml-4'}`}>
            {visibleChildren.map(child => renderMenuItem(
              child,
              item.key,
              SIDEBAR_REFS[child.key] || null
            ))}
          </div>
        </div>
      )
    }
    return (
      <div key={item.key} className="mb-0.5">
        {renderMenuItem(item, null, SIDEBAR_REFS[item.key] || null)}
      </div>
    )
  }

  return (
    <>
    <div
      className={`h-full bg-white border-r border-slate-200 flex flex-col font-sans select-none relative transition-all duration-300 ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Pin/Toggle Button (Ear) */}
      {!isMobile && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onTogglePinned()
          }}
          className={`
            absolute -right-3 top-1/2 -translate-y-1/2 
            w-6 h-6 bg-slate-900 border border-slate-800 
            text-white rounded-full flex items-center justify-center 
            shadow-lg hover:bg-slate-800 hover:scale-110
            transition-all z-[60] group/ear opacity-100
          `}
          title={isPinned ? "折叠侧边栏" : "固定侧边栏"}
        >
          {isPinned ? (
            <ChevronLeft size={14} className="group-hover/ear:-translate-x-0.5 transition-transform" />
          ) : (
            <ChevronRight size={14} className="group-hover/ear:translate-x-0.5 transition-transform" />
          )}
        </button>
      )}

      {/* Logo Section */}
      <div className={`h-[72px] px-4 flex items-center justify-center border-b border-slate-100 shrink-0 transition-all duration-300 ${isCollapsed ? 'overflow-hidden' : ''}`}>
        <img 
          src={isCollapsed ? MINI_LOGO : "https://www.adsgo.ai/_next/static/media/logo.ecc9c90c.svg"}
          alt="AdsGo"
          className={`h-12 w-auto object-contain transition-all duration-300 ${isCollapsed ? 'scale-75' : 'scale-100'}`}
        />
      </div>

      {/* Brand Switcher */}
      <div className="px-4 py-3 shrink-0">
        <div className="relative">
          <button 
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-slate-200 transition-colors shrink-0">
                <span className="text-lg">🐾</span>
              </div>
              <span className={`font-bold text-slate-800 text-[14px] truncate transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {selectedBrand}
              </span>
            </div>
            {!isCollapsed && (
              <ChevronsUpDown 
                size={14} 
                className="text-slate-400 shrink-0" 
              />
            )}
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
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-all ${
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
                    navigate('/brandCenter/brandProfile', { state: { newBrand: true } })
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-primary text-primary rounded-xl hover:bg-primary/5 transition-all group"
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
      <nav className="flex-1 px-3 py-1 flex flex-col overflow-y-auto custom-scrollbar text-sm">
        {MENU_ITEMS.map((item) => renderNavSection(item))}
      </nav>

      {/* User Profile Section */}
      <div className="p-2 border-t border-slate-100 relative" ref={userMenuRef}>
        {/* User Floating Menu */}
        {isUserMenuOpen && (
          <div className="absolute left-full bottom-0 ml-2 w-64 bg-[#0F0F1A] text-slate-300 rounded-2xl shadow-2xl z-[100] overflow-hidden border border-white/10 animate-in fade-in slide-in-from-left-2 duration-200 pt-3 pb-3">
            <div className="flex flex-col gap-2 relative">
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
            className={`w-full flex items-center gap-3 p-1.5 rounded-2xl transition-all duration-200 group cursor-pointer ${isUserMenuOpen ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-50'}`}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-slate-50 group-hover:ring-slate-100 transition-all">
                U
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className={`flex-1 text-left min-w-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-3'}`}>
              <p className="font-bold text-slate-900 text-[13px] truncate leading-tight">User</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">Professional Plan</p>
            </div>
            {!isCollapsed && <ChevronsUpDown size={14} className="text-slate-400 shrink-0" />}
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

    {Object.entries(STEP_SIDEBAR_CONFIG).map(([sIdx, config]) => {
      const stepNum = parseInt(sIdx)
      if (activeTourStep !== stepNum || tourSubStep !== 0) return null
      return (
        <OnboardingSpotlight
          key={stepNum}
          targetRef={SIDEBAR_REFS[config.key]}
          stepLabel={config.stepLabel}
          title={config.title}
          body={config.body}
          onSkip={endTour}
          onNext={() => config.endOnClick ? endTour() : advanceTourSubStep()}
          nextText={config.endOnClick ? '知道了' : '下一步'}
        />
      )
    })}

    {activeTourStep === 4 && tourSubStep === 0 && (
      <OnboardingSpotlight
        targetRef={libraryMenuRef}
        stepLabel="1/4"
        title="这里是 Library"
        body="创意素材库入口，在这里可以上传广告素材或查看已有素材"
        onSkip={endTour}
        onNext={advanceTourSubStep}
        nextText="下一步"
      />
    )}

    {activeTourStep === 4 && tourSubStep === 2 && (
      <OnboardingSpotlight
        targetRef={aiGenerateMenuRef}
        stepLabel="3/4"
        title="这里是 AI Generate"
        body="通过 AI 对话生成广告素材的入口，快速产出新的创意变体"
        onSkip={endTour}
        onNext={advanceTourSubStep}
        nextText="下一步"
      />
    )}
    </>
  )
}

export default Sidebar
