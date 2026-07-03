import { Bell, Menu, Globe, ChevronDown, Sparkles } from 'lucide-react'
import { getPageInfo } from '../constants/menuConfig'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useLunaStore from '@stores/lunaStore'

const Header = ({ toggleSidebar, isMobile }) => {
  const location = useLocation()
  const toggleLuna = useLunaStore((s) => s.toggleChat)
  const lunaIsOpen = useLunaStore((s) => s.isOpen)
  const hasPendingSync = useLunaStore((s) => Object.keys(s.pendingSync).length > 0)
  // Extract workspace-relative path for page info lookup
  const rawPath = location.pathname
  const workspacePath = rawPath.replace(/^\/workspace\/[^/]+\//, '')
  const lastSegment = workspacePath.split('/').pop() || 'media-plan'
  const pageInfo = getPageInfo(workspacePath) || getPageInfo(lastSegment)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const globalBriefing = '美国 ROAS 1.82，3 个 Campaign 待处理，1 条素材待换新。'

  const languages = [
    { name: 'English', code: 'en' },
    { name: '中文', code: 'zh-CN' },
    { name: 'Español', code: 'es' },
    { name: 'Français', code: 'fr' },
    { name: 'Deutsch', code: 'de' },
    { name: '日本語', code: 'ja' }
  ]

  // 初始化语言状态，从 Cookie 读取 Google 翻译状态
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const langCode = googtrans.split('/').pop();
      const matchedLang = languages.find(l => l.code === langCode);
      if (matchedLang) setSelectedLanguage(matchedLang.name);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang.name)
    setLanguageDropdownOpen(false)

    // Google 翻译 Cookie 切换逻辑 (格式: /源语言/目标语言)
    const cookieValue = lang.code === 'en' ? '' : `/en/${lang.code}`;

    // 写入 Cookie，确保全路径生效
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;

    // 保存当前路由，reload 后自动恢复
    sessionStorage.setItem('adsgo_lang_redirect', location.pathname + location.search)
    window.location.reload();
  }

  // reload 后恢复路由
  useEffect(() => {
    const savedPath = sessionStorage.getItem('adsgo_lang_redirect')
    if (savedPath && savedPath !== location.pathname) {
      sessionStorage.removeItem('adsgo_lang_redirect')
    }
  }, [])

  return (
    <header className="sticky top-0 z-[500] w-full bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 transition-all duration-300">
      <div className="px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left side — hamburger + page title */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 transition-all hover:bg-neutral-100 active:scale-95"
              >
                <Menu size={18} />
              </button>
            )}
            <div>
              <h1 className="font-heading text-lg font-semibold text-neutral-900 leading-tight">
                {pageInfo.title}
              </h1>
              <p className="hidden text-caption text-neutral-500 sm:block mt-0.5">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="hidden min-w-0 max-w-[min(440px,36vw)] items-center gap-2 md:flex"
              title={globalBriefing}
            >
              <span className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                今日待办
              </span>
              <p className="truncate text-xs text-neutral-500">{globalBriefing}</p>
            </div>

            {/* Luna AI Toggle */}
            <button
              onClick={toggleLuna}
              className={`hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-normal active:scale-95 relative ${
                lunaIsOpen
                  ? 'text-white shadow-lg'
                  : 'bg-luna-bg text-luna-violet border border-luna-border hover:shadow-luna'
              }`}
              style={lunaIsOpen ? { background: 'var(--luna-gradient)' } : undefined}
            >
              <Sparkles size={16} />
              <span>Luna</span>
              {hasPendingSync && !lunaIsOpen && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-luna-amber opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-luna-amber border-2 border-white" />
                </span>
              )}
            </button>


            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1.5 text-caption font-medium text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 group"
              >
                <Globe size={14} className="text-neutral-400 group-hover:text-neutral-600" />
                <span className="hidden sm:inline">{selectedLanguage}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 text-neutral-400 ${
                    languageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[160px] origin-top-right rounded-lg border border-neutral-200 bg-surface p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-caption font-medium transition-all ${
                        selectedLanguage === lang.name
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification */}
            <button className="group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-fast text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 active:scale-95">
              <Bell size={18} className="transition-colors duration-fast" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
