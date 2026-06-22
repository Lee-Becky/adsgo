import { useState } from 'react'
import { 
  ArrowLeft, Save, ChevronRight, LayoutGrid, Palette, Target, Package, TrendingUp, Sparkles
} from 'lucide-react'
import FoundationTab from './brand/FoundationTab'
import IdentityTab from './brand/IdentityTab'

const BrandDetailEdit = ({ brand, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('base')
  
  const [formData, setFormData] = useState({
    base: {
      name: brand.name || 'Neopets',
      logos: [brand.logo || '🐾', '🎨', '🚀'], 
      domain: 'neopets.com',
      businessType: 'E-commerce',
      subIndustry: 'Virtual Pets & Gaming',
      businessScale: '51-200 employees',
      slogan: 'Care, Play, and Discover!',
      description: 'Neopets is an immersive virtual world where users create and care for virtual pets.',
      businessModel: ['Freemium', 'Virtual Goods'],
      nicheMarket: 'Millennial Nostalgia & Kids',
      brandFeatures: ['Family-friendly', 'Collectible-driven', 'Community-centric'],
      audienceTags: ['Gamers', 'Collectors', 'Nostalgia Seekers'],
      mediaPlatforms: ['Meta', 'TikTok', 'Instagram'],
      brandLocation: 'United States'
    },
    kits: { primaryColor: '#7C3AED', auxColors: [] },
    optimization: { accounts: [], kpi: { type: 'ROAS', target: 0 } },
    products: [],
    competitors: []
  })

  const tabs = [
    { id: 'base', label: 'Foundation', icon: LayoutGrid },
    { id: 'kits', label: 'Identity', icon: Palette },
    { id: 'ops', label: 'Strategy', icon: Target },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'competitors', label: 'Market', icon: TrendingUp }
  ]

  const handleBaseChange = (field, value) => {
    setFormData(prev => ({ ...prev, base: { ...prev.base, [field]: value } }))
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Precision Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100 shrink-0">
        <div className="max-w-[1400px] mx-auto w-full px-10">
          {/* Breadcrumbs & Action Bar */}
          <div className="h-14 flex items-center justify-between border-b border-neutral-50">
            <div className="flex items-center gap-4">
              <button onClick={onCancel} className="p-1 hover:bg-neutral-100 rounded-md transition-colors text-neutral-400 hover:text-neutral-900"><ArrowLeft size={18} /></button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 tracking-tight">Business Suite</span>
                <ChevronRight size={12} className="text-neutral-300" />
                <span className="text-xs font-bold text-neutral-900 tracking-tight">{formData.base.name}</span>
              </div>
            </div>
            <button onClick={() => onSave(formData)} className="bg-neutral-900 text-white px-5 py-1.5 rounded-lg font-bold text-[12px] hover:bg-black transition-all active:scale-95 shadow-sm">
              Save Assets
            </button>
          </div>

          {/* Horizontal Tab Bar */}
          <div className="flex items-center gap-8 h-12">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative h-full flex items-center gap-2 px-1 transition-all duration-300 group`}
                >
                  <Icon size={14} className={isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'} />
                  <span className={`text-[13px] font-bold transition-colors ${isActive ? 'text-primary-600' : 'text-neutral-500 group-hover:text-neutral-900'}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-10 py-12">
          {activeTab === 'base' && (
            <FoundationTab data={formData.base} onChange={handleBaseChange} />
          )}
          {activeTab === 'kits' && (
            <IdentityTab data={formData.kits} onChange={() => {}} />
          )}
          {activeTab !== 'base' && activeTab !== 'kits' && (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-200 gap-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 shadow-inner">
                <Sparkles size={32} />
              </div>
              <p className="text-xs font-black tracking-widest">Section Syncing...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default BrandDetailEdit
