import { Bell, HelpCircle, Menu, Globe, Clock, ChevronDown } from 'lucide-react'
import { getPageInfo } from '../constants/menuConfig'
import { useState } from 'react'

const Header = ({ toggleSidebar, isMobile, currentPage }) => {
  const pageInfo = getPageInfo(currentPage)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const languages = ['English', '中文', 'Español', 'Français', 'Deutsch', '日本語']

  return (
    <div className="bg-white border-b border-slate-100 px-6 h-[72px] flex items-center">
      <div className="flex items-center justify-between w-full">
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
        <div className="flex items-center gap-3">
          {/* Timezone */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <Clock size={16} />
            <span className="font-medium">UTC+8</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Globe size={16} />
              <span className="font-medium">{selectedLanguage}</span>
              <ChevronDown size={14} className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {languageDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden min-w-[150px]">
                <div className="p-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang)
                        setLanguageDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedLanguage === lang ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <span className="font-medium text-sm">{lang}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Help Center */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
