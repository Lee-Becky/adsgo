import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
// import { useOnboardingContext } from './onboarding/OnboardingContext'
// import OnboardingSpotlight from './onboarding/OnboardingSpotlight'
import useLunaStore from '@stores/lunaStore'

/* ── Onboarding tour: sidebar step → menu key mapping (disabled) ── */
// const STEP_SIDEBAR_CONFIG = {
//   1: { key: 'goals', title: '这里是目标与阶段', body: '...', endOnClick: false, stepLabel: '1/3' },
//   2: { key: 'campaigns', title: '这里是 Campaigns', body: '...', endOnClick: false, stepLabel: '1/4' },
//   3: { key: 'draft', title: '这里是 Drafts & Preview', body: '...', endOnClick: false, stepLabel: '1/3' },
//   5: { key: 'media-plan', title: '这里是 Media Plan', body: '...', endOnClick: true, stepLabel: null },
// }

import {
  Sparkles, Users,
  X, Plus, ChevronRight, ChevronLeft,
  ChevronsUpDown, Check, LogOut, CreditCard, Link, HelpCircle,
  BookOpen, Star,
} from 'lucide-react'
import { MENU_ITEMS_V2, ICON_MAP } from '../constants/menuConfig'

const MINI_LOGO = "data:image/png;base64,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"

const Sidebar = ({ isMobile, isPinned, onTogglePinned, onClose, selectedBrand, onBrandChange, onCreateBrand, brands = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { brandId } = useParams()
  const isCollapsed = !isMobile && !isPinned

  // Luna store for Chat entry styling
  const lunaIsOpen = useLunaStore((s) => s.isOpen)
  const toggleLuna = useLunaStore((s) => s.toggleChat)
  const hasPendingSync = useLunaStore((s) => Object.keys(s.pendingSync).length > 0)
  const pendingSync = useLunaStore((s) => s.pendingSync)
  const menuHasLunaSync = (path) => path && !!pendingSync[path?.split('?')[0]]

  // Extract current path segment for active detection
  // e.g. /workspace/default/plan/media-plan → plan/media-plan
  const workspacePath = location.pathname.replace(/^\/workspace\/[^/]+\//, '')

  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Refs for onboarding spotlights
  const itemRefs = useRef({})
  const getRef = (key) => {
    if (!itemRefs.current[key]) {
      itemRefs.current[key] = React.createRef()
    }
    return itemRefs.current[key]
  }

  // const { activeTourStep, tourSubStep, endTour, advanceTourSubStep } = useOnboardingContext()
  const activeTourStep = null, tourSubStep = 0, endTour = () => {}, advanceTourSubStep = () => {}

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

  // Build full workspace path
  const buildWorkspacePath = (relativePath) => {
    const bid = brandId || 'default'
    return `/workspace/${encodeURIComponent(bid)}/${relativePath}`
  }

  // Check if a menu item is active
  const isActive = (item) => {
    if (item.path) {
      return workspacePath === item.path
    }
    return false
  }

  const handleMenuClick = (item) => {
    // Handle onboarding tour interactions
    if (activeTourStep !== null) {
      if (activeTourStep === 4) {
        if (item.key === 'library' && tourSubStep === 0) advanceTourSubStep()
        else if (item.key === 'ai-gen' && tourSubStep === 2) advanceTourSubStep()
      } else if (tourSubStep === 0) {
        const config = STEP_SIDEBAR_CONFIG[activeTourStep]
        if (config && item.key === config.key) {
          config.endOnClick ? endTour() : advanceTourSubStep()
        }
      }
    }

    // Luna Chat: toggle panel instead of navigating
    if (item.isLuna) {
      toggleLuna()
      return
    }

    navigate(buildWorkspacePath(item.path))
    if (isMobile) onClose()
  }

  /* ── Render a single menu item ──────────────────────────── */
  const renderMenuItem = (item, isSubItem = false) => {
    const ItemIcon = ICON_MAP[item.icon] || Sparkles
    const itemActive = isActive(item) ||
      (item.isLuna && lunaIsOpen) // Luna Chat shows active when panel is open
    const ref = getRef(item.key)

    // Skip highlight during tour step 4 sub-step 2 on library
    const tourOverride = activeTourStep === 4 && tourSubStep === 2 && item.key === 'library'

    return (
      <button
        ref={ref}
        key={item.key}
        onClick={() => handleMenuClick(item)}
        className={`w-full flex items-center rounded-lg transition-all duration-normal ease-default group relative text-left ${
          item.isLuna
            ? (lunaIsOpen
              ? 'bg-primary-50 text-luna-violet'
              : 'text-neutral-700 hover:text-luna-violet hover:bg-neutral-100')
            : (itemActive && !tourOverride)
              ? 'bg-neutral-100 text-primary-700 shadow-sm'
              : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
        } ${isCollapsed ? 'justify-center px-0 py-2' : 'gap-3 px-4 py-2'} ${isSubItem && !isCollapsed ? 'ml-1' : ''}`}
      >
        {/* Active accent bar */}
        {(itemActive && !tourOverride && !item.isLuna) && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full ${isCollapsed ? 'h-6' : 'h-4'}`} style={{ background: 'linear-gradient(180deg, var(--primary-300), var(--primary-500))' }} />
        )}

        {/* Luna accent bar */}
        {item.isLuna && lunaIsOpen && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full ${isCollapsed ? 'h-6' : 'h-4'}`} style={{ background: 'var(--luna-gradient)' }} />
        )}

        <div className={`flex flex-col items-center justify-center shrink-0 transition-all duration-normal ${isCollapsed ? 'w-full' : 'w-5'}`}>
          <ItemIcon
            size={isSubItem ? 16 : 18}
            className={`transition-colors duration-fast ${
              item.isLuna
                ? (lunaIsOpen ? 'text-luna-violet' : 'text-neutral-400 group-hover:text-luna-violet')
                : (itemActive && !tourOverride) ? 'text-primary-300' : 'text-neutral-400 group-hover:text-neutral-900'
            }`}
          />
          {isCollapsed && item.shortLabel && (
            <span className={`text-[9px] font-semibold mt-1 leading-none transition-all duration-normal scale-90 ${
              itemActive ? 'text-primary-700' : 'text-neutral-700 group-hover:text-neutral-900'
            }`}>
              {item.shortLabel}
            </span>
          )}
        </div>

        {!isCollapsed && (
          <>
            <span className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-normal opacity-100 w-auto ${
              isSubItem ? 'text-[12.5px]' : 'text-[13.5px]'
            }`}>
              {item.label}
            </span>

            {/* New badge */}
            {item.isNew && (
              <span className="ml-auto shrink-0 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-primary-50 text-primary-600 border border-primary-500/30 leading-none">
                New
              </span>
            )}

            {/* Luna pending sync dot */}
            {item.isLuna && hasPendingSync && !lunaIsOpen && (
              <span className="ml-auto shrink-0 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-luna-amber opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-luna-amber" />
              </span>
            )}

            {/* Module pending Luna sync */}
            {!item.isLuna && menuHasLunaSync(item.path) && (
              <span className="ml-auto shrink-0 h-2 w-2 rounded-full bg-luna-violet" title="Luna 有待处理建议" />
            )}
          </>
        )}
      </button>
    )
  }

  /* ── Render a nav section (group or standalone item) ────── */
  const renderNavSection = (item) => {
    if (item.children) {
      return (
        <div key={item.key} className={`transition-all duration-normal ${isCollapsed ? 'mb-0.5' : 'mb-1 mt-4 first:mt-0'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-4 mb-1.5">
              <p className="text-[11px] font-semibold text-neutral-400 tracking-wider transition-all duration-normal">
                {item.label}
              </p>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
          )}
          {isCollapsed && (
            <div className="h-px bg-neutral-200 mx-2 mb-1" />
          )}
          <div className="space-y-0.5">
            {item.children.map(child => renderMenuItem(child, !isCollapsed))}
          </div>
        </div>
      )
    }

    // Luna Chat — special card-style button
    if (item.isLuna) {
      const LunaIcon = ICON_MAP[item.icon] || Sparkles
      const ref = getRef(item.key)
      return (
        <div key={item.key} className="mb-3 px-1">
          <button
            ref={ref}
            onClick={() => handleMenuClick(item)}
            className={`w-full flex items-center gap-3 rounded-xl transition-all duration-normal group relative overflow-hidden ${
              isCollapsed ? 'justify-center p-2' : 'px-3 py-2.5'
            } ${
              lunaIsOpen
                ? 'border border-luna-violet/50 text-luna-violet shadow-luna'
                : 'border border-neutral-200 text-neutral-800 hover:border-luna-violet/30 hover:text-luna-violet-light'
            }`}
            style={{
              background: lunaIsOpen
                ? 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.10) 50%, rgba(245,158,11,0.08) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(139,92,246,0.04) 100%)'
            }}
          >
            <div className="relative shrink-0">
              <LunaIcon size={18} className={lunaIsOpen ? 'text-luna-violet' : 'text-neutral-700 group-hover:text-luna-violet'} />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[13.5px]">Luna AI</span>
                <p className="text-[10px] text-neutral-400 mt-0.5 leading-none">AI assistant</p>
              </div>
            )}
            {!isCollapsed && hasPendingSync && !lunaIsOpen && (
              <span className="shrink-0 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-luna-amber opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-luna-amber" />
              </span>
            )}
          </button>
        </div>
      )
    }

    // Other standalone items
    return (
      <div key={item.key} className="mb-0.5">
        {renderMenuItem(item)}
      </div>
    )
  }

  return (
    <>
    <div
      className={`h-full flex flex-col font-body select-none relative transition-all duration-normal ease-default bg-white border-r border-neutral-200 ${isCollapsed ? 'w-[68px]' : 'w-64'}`}
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
            w-6 h-6 bg-white border border-neutral-200
            text-neutral-500 rounded-full flex items-center justify-center
            shadow-sm hover:bg-neutral-100 hover:text-neutral-900 hover:scale-110
            transition-all duration-fast z-[60] group/ear opacity-100
          `}
          title={isPinned ? "Collapse sidebar" : "Pin sidebar"}
        >
          {isPinned ? (
            <ChevronLeft size={14} className="group-hover/ear:-translate-x-0.5 transition-transform" />
          ) : (
            <ChevronRight size={14} className="group-hover/ear:translate-x-0.5 transition-transform" />
          )}
        </button>
      )}

      {/* Logo Section */}
      <div className={`h-16 px-4 flex items-center justify-center border-b border-neutral-200 shrink-0 transition-all duration-normal sidebar-logo-divider ${isCollapsed ? 'overflow-hidden' : ''}`}>
        <img
          src={isCollapsed ? MINI_LOGO : "https://www.adsgo.ai/_next/static/media/logo.ecc9c90c.svg"}
          alt="AdsGo"
          className={`h-10 w-auto object-contain transition-all duration-normal ${isCollapsed ? 'scale-75' : 'scale-100'}`}
        />
      </div>

      {/* Brand Switcher */}
      <div className="px-3 py-3 shrink-0">
        <div className="relative">
          <button
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-all duration-fast group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {selectedBrand?.charAt(0)?.toUpperCase() || 'B'}
              </div>
              <span className={`font-semibold text-neutral-800 text-[14px] truncate transition-all duration-normal ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {selectedBrand}
              </span>
            </div>
            {!isCollapsed && (
              <ChevronsUpDown
                size={14}
                className="text-neutral-400 shrink-0"
              />
            )}
          </button>

          {isBrandDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    onBrandChange(brand)
                    setIsBrandDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-all duration-fast ${
                    selectedBrand === brand ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${selectedBrand === brand ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700'}`}>{brand?.charAt(0)?.toUpperCase() || 'B'}</div>
                  <span className="font-semibold text-sm">{brand}</span>
                  {selectedBrand === brand && <Check size={14} className="ml-auto text-primary-400" strokeWidth={3} />}
                </button>
              ))}
              <div className="h-px bg-neutral-200 my-1.5 mx-2" />
              <div className="px-2 pb-1">
                <button
                  onClick={() => {
                    setIsBrandDropdownOpen(false)
                    navigate(buildWorkspacePath('settings/brand-info'), { state: { newBrand: true } })
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-primary-400 text-primary-400 rounded-lg hover:bg-primary-500/10 transition-all duration-fast group"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-normal" />
                  <span className="font-semibold text-sm">New Brand</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-1 flex flex-col overflow-y-auto sidebar-light-scrollbar text-sm">
        {MENU_ITEMS_V2.map((item) => renderNavSection(item))}
      </nav>

      {/* User Profile Section */}
      <div className="p-2 border-t border-neutral-200 relative" ref={userMenuRef}>
        {/* User Floating Menu */}
        {isUserMenuOpen && (
          <div className="absolute left-full bottom-0 ml-2 w-64 bg-white text-neutral-700 rounded-2xl shadow-2xl z-[100] overflow-hidden border border-neutral-200 animate-in fade-in slide-in-from-left-2 duration-200 pt-3 pb-3">
            <div className="flex flex-col gap-2 relative">
              <div className="absolute top-0 right-2 z-10">
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="p-1 hover:bg-neutral-100 rounded-lg transition-colors duration-fast text-neutral-400 hover:text-neutral-900"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Manage Group */}
              <div className="space-y-1">
                <p className="px-4 py-1 text-[11px] font-semibold text-neutral-400 tracking-wide">Manage My AdsGo</p>
                <div className="border-l-4 border-neutral-200 ml-1 pl-1 space-y-0.5">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-fast text-sm font-semibold text-neutral-700 hover:text-neutral-900 group text-left">
                    <Link size={16} className="text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                    <span className="truncate">Ad Account Connect</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-fast text-sm font-semibold text-neutral-700 hover:text-neutral-900 group text-left">
                    <CreditCard size={16} className="text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                    <span className="truncate">Subscriptions</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-fast text-sm font-semibold text-neutral-700 hover:text-neutral-900 group text-left">
                    <Users size={16} className="text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                    <span className="truncate">User Profile</span>
                  </button>
                </div>
              </div>

              {/* Help Group */}
              <div className="space-y-1">
                <p className="px-4 py-1 text-[11px] font-semibold text-neutral-400 tracking-wide">Get Help</p>
                <div className="border-l-4 border-neutral-200 ml-1 pl-1 space-y-0.5">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-fast text-sm font-semibold text-neutral-700 hover:text-neutral-900 group text-left">
                    <HelpCircle size={16} className="text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                    <span className="truncate">Help center</span>
                  </button>
                  {/* <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-fast text-sm font-semibold text-neutral-700 hover:text-neutral-900 group text-left">
                    <BookOpen size={16} className="text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                    <span className="truncate">Getting started</span>
                  </button> */}
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-fast text-sm font-semibold text-neutral-700 hover:text-neutral-900 group text-left">
                    <Star size={16} className="text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                    <span className="truncate">What's New</span>
                  </button>
                </div>
              </div>

              {/* Logout */}
              <div className="pt-2 border-t border-neutral-200 mt-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-danger-500/20 transition-all duration-fast text-sm font-semibold text-danger-400 hover:text-danger-300 group text-left">
                  <LogOut size={18} className="text-danger-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center gap-3 p-1.5 rounded-lg transition-all duration-fast group cursor-pointer ${isUserMenuOpen ? 'bg-neutral-100 shadow-sm' : 'hover:bg-neutral-100'}`}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white group-hover:ring-neutral-200 transition-all">
                U
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className={`flex-1 text-left min-w-0 transition-all duration-normal ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-1'}`}>
              <p className="font-semibold text-neutral-800 text-[13px] truncate leading-tight">优化师</p>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-medium">{selectedBrand} 今日值班</p>
            </div>
            {!isCollapsed && <ChevronsUpDown size={14} className="text-neutral-400 shrink-0" />}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-light-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-light-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-light-scrollbar::-webkit-scrollbar-thumb {
          background: var(--neutral-300);
          border-radius: 20px;
        }
        .sidebar-light-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--neutral-400);
        }
      `}} />
    </div>

    {/* Onboarding spotlights (disabled) */}
    {/* {Object.entries(STEP_SIDEBAR_CONFIG).map(([sIdx, config]) => {
      const stepNum = parseInt(sIdx)
      if (activeTourStep !== stepNum || tourSubStep !== 0) return null
      const ref = getRef(config.key)
      return (
        <OnboardingSpotlight
          key={stepNum}
          targetRef={ref}
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
        targetRef={getRef('library')}
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
        targetRef={getRef('ai-gen')}
        stepLabel="3/4"
        title="这里是 AI Generate"
        body="通过 AI 对话生成广告素材的入口，快速产出新的创意变体"
        onSkip={endTour}
        onNext={advanceTourSubStep}
        nextText="下一步"
      />
    )} */}
    </>
  )
}

export default Sidebar
