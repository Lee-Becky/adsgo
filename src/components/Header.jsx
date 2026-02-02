import { Bell, HelpCircle, Menu, Globe, Clock, ChevronDown } from 'lucide-react'
import { getPageInfo } from '../constants/menuConfig'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Header = ({ toggleSidebar, isMobile }) => {
  const location = useLocation()
  // 获取路径的最后一部分作为页面 key
  const path = location.pathname.slice(1) || 'overview'
  const parts = path.split('/')
  const currentPage = parts[parts.length - 1] || 'overview'
  const pageInfo = getPageInfo(currentPage)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const languages = ['English', '中文', 'Español', 'Français', 'Deutsch', '日本語']

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 active:scale-95"
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {pageInfo.title}
              </h1>
              <p className="hidden text-[13px] font-medium text-slate-500 sm:block mt-0.5">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timezone */}
            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 cursor-pointer sm:flex group">
              <Clock size={15} className="text-slate-400 group-hover:text-slate-600" />
              <span>UTC+8</span>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 group"
              >
                <Globe size={15} className="text-slate-400 group-hover:text-slate-600" />
                <span className="hidden sm:inline">{selectedLanguage}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-slate-400 ${
                    languageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[160px] origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-bold transition-all ${
                        selectedLanguage === lang
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>

            {/* Notification */}
            <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-slate-50 active:scale-95">
              <Bell size={20} className="text-slate-500 transition-colors group-hover:text-slate-900" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
              </span>
            </button>

            {/* Help Center */}
            <button className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-slate-50 active:scale-95">
              <HelpCircle size={20} className="text-slate-500 transition-colors group-hover:text-slate-900" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
