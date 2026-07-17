import { Bell, Menu, Globe, ChevronDown, Sparkles, AlertTriangle, CheckCircle2, Clock3, X } from 'lucide-react'
import { getPageInfo } from '../constants/menuConfig'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useLunaStore from '@stores/lunaStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'

const Header = ({ toggleSidebar, isMobile }) => {
  const location = useLocation()
  const navigate = useNavigate()
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
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationFilter, setNotificationFilter] = useState('all')
  const notifications = useMarketingOpsStore((state) => state.notifications)
  const markNotificationRead = useMarketingOpsStore((state) => state.markNotificationRead)
  const markAllNotificationsRead = useMarketingOpsStore((state) => state.markAllNotificationsRead)
  const deleteNotification = useMarketingOpsStore((state) => state.deleteNotification)
  const unreadCount = notifications.filter(item => !item.read).length
  const visibleNotifications = notifications.filter(item => notificationFilter === 'all' || (notificationFilter === 'unread' ? !item.read : item.category === 'alert'))

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
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:block">
                {pageInfo.section}
              </p>
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
            <button
              onClick={() => navigate(`/workspace/${rawPath.split('/')[2] || 'default'}/chat`)}
              className="hidden min-w-0 max-w-[min(440px,36vw)] cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-neutral-50 md:flex"
              title={globalBriefing}
            >
              <span className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                今日待办
              </span>
              <p className="truncate text-xs text-neutral-500">{globalBriefing}</p>
            </button>

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

            {/* Notification center */}
            <div className="relative">
              <button
                aria-label={`通知中心，${unreadCount} 条未读`}
                aria-expanded={notificationOpen}
                onClick={() => setNotificationOpen(open => !open)}
                className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-all duration-fast hover:bg-neutral-50 hover:text-neutral-700 active:scale-95"
              >
                <Bell size={18} className="transition-colors duration-fast" />
                {unreadCount > 0 && <span className="absolute right-0.5 top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">{unreadCount}</span>}
              </button>
              {notificationOpen && (
                <>
                  <button aria-label="关闭通知中心" className="fixed inset-0 z-[540] cursor-default" onClick={() => setNotificationOpen(false)} />
                  <section className="fixed left-3 right-3 top-16 z-[550] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[390px]">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                      <div><h2 className="text-sm font-bold text-neutral-900">通知中心</h2><p className="mt-0.5 text-xs text-neutral-500">{unreadCount} 条未读预警</p></div>
                      <button onClick={markAllNotificationsRead} className="cursor-pointer text-xs font-medium text-primary-600 hover:text-primary-700">全部已读</button>
                    </div>
                    <div className="flex gap-1 border-b border-neutral-100 px-4 py-2">
                      {[['all','全部'],['unread','未读'],['alert','预警']].map(([id,label]) => <button key={id} onClick={() => setNotificationFilter(id)} className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium ${notificationFilter === id ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>{label}</button>)}
                    </div>
                    <div className="max-h-[min(62vh,440px)] overflow-y-auto">
                      {visibleNotifications.map(item => (
                        <div
                          key={item.id}
                          className={`flex w-full cursor-pointer gap-3 border-b border-neutral-100 px-5 py-4 text-left transition-colors last:border-0 hover:bg-neutral-50 ${item.read ? 'bg-white' : 'bg-primary-50/35'}`}
                        >
                          <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${item.level === 'high' ? 'bg-danger-50 text-danger-600' : item.level === 'medium' ? 'bg-warning-50 text-warning-600' : 'bg-primary-50 text-primary-600'}`}>
                            {item.read ? <CheckCircle2 size={17}/> : <AlertTriangle size={17}/>}
                          </span>
                          <button onClick={() => markNotificationRead(item.id)} className="min-w-0 flex-1 cursor-pointer text-left"><span className="flex items-start justify-between gap-3"><strong className="text-sm text-neutral-900">{item.title}</strong>{!item.read && <i className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-danger-500"/>}</span><span className="mt-1 block text-xs leading-5 text-neutral-500">{item.detail}</span><span className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-400"><Clock3 size={11}/>{item.time}</span></button>
                          <button onClick={() => deleteNotification(item.id)} aria-label={`删除${item.title}`} className="h-8 w-8 shrink-0 cursor-pointer rounded-lg text-neutral-300 hover:bg-danger-50 hover:text-danger-600"><X size={14} className="mx-auto"/></button>
                        </div>
                      ))}
                      {visibleNotifications.length === 0 && <p className="py-10 text-center text-xs text-neutral-400">暂无此类通知</p>}
                    </div>
                    <div className="border-t border-neutral-100 bg-neutral-50/80 p-3">
                      <button onClick={() => { setNotificationOpen(false); navigate(`/workspace/${rawPath.split('/')[2] || 'default'}/notifications`) }} className="w-full cursor-pointer rounded-lg py-2 text-xs font-semibold text-neutral-600 hover:bg-white hover:text-neutral-900">查看全部通知</button>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
