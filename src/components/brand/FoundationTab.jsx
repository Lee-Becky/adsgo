import { useState, useRef, useEffect } from 'react'
import { 
  Upload, X, Plus, Globe, Briefcase, MapPin, Layers, Sparkles, 
  MessageSquare, UserSquare2, Megaphone, Check, ChevronDown, Fingerprint,
  Building2, Target, Quote, Search, BarChart3, Phone, Mail, Palette, Type,
  Ban, Heart, Languages, Edit3
} from 'lucide-react'

// --- Custom Searchable Select Component ---
const CustomSearchSelect = ({ value, options, onChange, icon: Icon, placeholder = "Search...", searchable = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  
  const selectedOption = options.find(o => o.value === value)
  const filteredOptions = options.filter(o => 
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-2xl border border-neutral-100 transition-all hover:bg-white hover:shadow-md min-w-[140px]"
      >
        {Icon && <Icon size={14} className="text-neutral-400" />}
        <span className="text-sm font-bold text-neutral-700">{selectedOption?.label || 'Select...'}</span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white border border-neutral-100 rounded-2xl shadow-2xl z-[200] p-2 animate-in fade-in zoom-in-95 duration-200">
          {searchable && (
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/10"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${value === opt.value ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-50 text-neutral-600'}`}
              >
                {opt.label}
                {value === opt.value && <Check size={14} />}
              </button>
            )) : (
              <div className="py-4 text-center text-xs text-neutral-400 font-medium">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const FoundationTab = ({ data = {}, onChange }) => {
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(0)
  
  const defaultData = {
    name: '',
    logos: ['🚀'],
    domain: '',
    phone: '',
    email: '',
    businessType: 'online_shopping',
    subIndustry: '',
    businessScale: '',
    slogan: '',
    description: '',
    businessModel: [],
    nicheMarket: '',
    brandFeatures: [],
    audienceTags: [],
    brandLocation: 'cn',
    mediaPlatforms: [],
    // Brand Kits default fields
    colors: [
      { id: 1, hex: '#5C3A21', label: 'Primary' },
      { id: 2, hex: '#A08E7E', label: 'Secondary 1' },
      { id: 3, hex: '#E5B27F', label: 'Secondary 2' }
    ],
    fonts: ['Noto Sans Display', 'Noto Serif Japanese', 'Jost', 'Arial'],
    visualStyle: 'Heritage-inspired designs with modern comfort',
    tone: 'Direct and informative, focusing on practical details',
    forbiddenWords: ['cheap', 'low quality'],
    preferredPhrases: ['Heritage', 'Timeless aesthetics', 'Functional clothing'],
    languagePreference: ['English (US)']
  }
  
  const brandData = { ...defaultData, ...data }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file && brandData.logos.length < 5) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onChange('logos', [...brandData.logos, event.target.result])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoSelect = (index) => setSelectedLogoIndex(index)

  const handleLogoRemove = (index) => {
    const newLogos = brandData.logos.filter((_, idx) => idx !== index)
    onChange('logos', newLogos)
    if (selectedLogoIndex >= newLogos.length) {
      setSelectedLogoIndex(Math.max(0, newLogos.length - 1))
    }
  }

  const businessTypes = [
    { value: 'online_shopping', label: 'Online Shopping' },
    { value: 'local_store', label: 'Local Store & Service' },
    { value: 'solution_service', label: 'Solution & Online Service' },
    { value: 'app', label: 'App' }
  ]

  const regions = [
    { value: 'us', label: 'United States' },
    { value: 'cn', label: 'China' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'eu', label: 'European Union' },
    { value: 'global', label: 'Global' }
  ]

  const platforms = [
    { id: 'meta', label: 'Meta', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
    { id: 'google', label: 'Google', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' },
    { id: 'tiktok', label: 'TikTok', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256' },
    { id: 'bing', label: 'Bing', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256' }
  ]

  const togglePlatform = (id) => {
    const current = brandData.mediaPlatforms || []
    onChange('mediaPlatforms', current.includes(id) ? current.filter(p => p !== id) : [...current, id])
  }

  // Brand Kits Handlers
  const handleColorChange = (id, hex) => {
    onChange('colors', brandData.colors.map(c => c.id === id ? { ...c, hex } : c));
  };

  const addColor = () => {
    if (brandData.colors.length >= 3) return;
    const newId = Date.now();
    onChange('colors', [...brandData.colors, { id: newId, hex: '#4F46E5', label: `Secondary ${brandData.colors.length}` }]);
  };

  const removeColor = (id) => {
    if (brandData.colors.length <= 1) return;
    onChange('colors', brandData.colors.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-8 space-y-10 animate-in fade-in duration-1000 text-neutral-900 selection:bg-primary-100">
      
      {/* 1. Brand Identity Card */}
      <section className="relative group z-[100]">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-8 shadow-sm">
          
          <div className="flex items-start gap-10 relative z-10">
            {/* Logo Section */}
            <div className="shrink-0 space-y-4 w-32">
              <div className="relative group/main">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                <label 
                  htmlFor="logo-upload"
                  className={`w-32 h-32 bg-white border border-neutral-100 rounded-xl flex items-center justify-center text-5xl shadow-xl relative cursor-pointer transition-all hover:scale-[1.02] ${selectedLogoIndex !== -1 ? 'ring-2 ring-primary-500/20' : ''}`}
                >
                  {brandData.logos[selectedLogoIndex] || brandData.logos[0] || '🚀'}
                  <div className="absolute inset-0 bg-black/5 rounded-xl opacity-0 group-hover/main:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={20} className="text-white drop-shadow-md" />
                  </div>
                </label>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 px-0.5">
                {brandData.logos.map((logo, i) => (
                  <div 
                    key={i} 
                    className={`relative group/sub w-9 h-9 bg-white border rounded-lg flex items-center justify-center text-base shadow-sm cursor-pointer transition-all ${i === selectedLogoIndex ? 'border-primary-500 ring-2 ring-primary-500/10 scale-105' : 'border-neutral-100 hover:border-primary-200'}`}
                    onClick={() => handleLogoSelect(i)}
                  >
                    {logo}
                    <button 
                      className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity shadow-lg"
                      onClick={(e) => { e.stopPropagation(); handleLogoRemove(i); }}
                    >
                      <X size={8} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                {brandData.logos.length < 5 && (
                  <label htmlFor="logo-upload" className="w-9 h-9 border-2 border-dashed border-neutral-100 rounded-lg flex items-center justify-center text-neutral-300 hover:text-primary-400 hover:border-primary-200 hover:bg-primary-50 transition-all cursor-pointer">
                    <Plus size={14} />
                  </label>
                )}
              </div>
            </div>

            {/* Core Info */}
            <div className="flex-1 space-y-5">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  <input 
                    className="text-4xl font-black tracking-tight bg-transparent border-none outline-none focus:ring-0 text-neutral-900 placeholder:text-neutral-200 w-full" 
                    value={brandData.name} 
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Brand name"
                  />
                  <div className="flex items-center gap-2 group/domain">
                    <Globe size={14} className="text-neutral-400" />
                    <input 
                      className="text-base font-bold text-neutral-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-full placeholder:text-neutral-200" 
                      value={brandData.domain} 
                      onChange={(e) => onChange('domain', e.target.value)} 
                      placeholder="Official domain (e.g. domain.com)" 
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group/phone">
                      <Phone size={14} className="text-neutral-400" />
                      <input 
                        className="text-sm font-bold text-neutral-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-32 placeholder:text-neutral-200" 
                        value={brandData.phone} 
                        onChange={(e) => onChange('phone', e.target.value)} 
                      />
                    </div>
                    <div className="flex items-center gap-2 group/email">
                      <Mail size={14} className="text-neutral-400" />
                      <input 
                        className="text-sm font-bold text-neutral-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-48 placeholder:text-neutral-200" 
                        value={brandData.email} 
                        onChange={(e) => onChange('email', e.target.value)} 
                        placeholder="Email address" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Single Sub-industry Tag in Identity Card */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-xl transition-all hover:bg-white hover:shadow-sm">
                    <Building2 size={12} className="text-primary-500" />
                    <input 
                      className="text-xs font-bold text-neutral-600 bg-transparent border-none outline-none focus:ring-0 p-0 w-32 placeholder:text-neutral-300"
                      value={brandData.subIndustry}
                      onChange={(e) => onChange('subIndustry', e.target.value)}
                      placeholder="Sub-industry"
                    />
                  </div>
                </div>
              </div>

              <div className="relative py-1 group/slogan">
                <Quote size={18} className="absolute -left-6 top-0 text-primary-100 rotate-180" />
                <input 
                  className="text-xl font-semibold text-primary-600/80 bg-transparent border-none outline-none w-full focus:ring-0 italic tracking-tight placeholder:text-primary-100" 
                  value={brandData.slogan}
                  onChange={(e) => onChange('slogan', e.target.value)}
                  placeholder="Brand slogan"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
                <CustomSearchSelect 
                  value={brandData.businessType} 
                  options={businessTypes} 
                  onChange={(val) => onChange('businessType', val)} 
                  icon={Briefcase} 
                  searchable={false}
                />
                <CustomSearchSelect 
                  value={brandData.brandLocation} 
                  options={regions} 
                  onChange={(val) => onChange('brandLocation', val)} 
                  icon={MapPin} 
                  placeholder="Search location..." 
                  searchable={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Logic & Market Card Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Business Scale & Niche Market Card */}
        <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-col gap-8">
          <Field label="Business scale" icon={BarChart3}>
            <input 
              className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-neutral-700 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-inner"
              value={brandData.businessScale}
              onChange={(e) => onChange('businessScale', e.target.value)}
              placeholder="Business scale..."
            />
          </Field>
          <Field label="Niche market" icon={Target}>
            <TagCloud tags={brandData.nicheMarket} onTagsChange={(t) => onChange('nicheMarket', t)} color="indigo" placeholder="+ Niche" />
          </Field>
        </div>
        
        {/* Business Model & Brand Description Card */}
        <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-col gap-8">
          <Field label="Business model" icon={Layers}>
            <TagCloud tags={brandData.businessModel} onTagsChange={(t) => onChange('businessModel', t)} color="indigo" placeholder="+ Model" />
          </Field>
          <Field label="Brand description" icon={MessageSquare}>
            <textarea 
              className="w-full h-full min-h-[100px] bg-neutral-50 border-none rounded-xl p-5 text-sm font-medium leading-relaxed text-neutral-600 focus:ring-4 focus:ring-primary-500/5 transition-all resize-none shadow-inner"
              value={brandData.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Tell us about your brand mission..."
            />
          </Field>
        </div>
      </div>

      {/* 3. Tags & Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-0">
        <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm space-y-8 flex flex-col">
          <Field label="Brand features" icon={Sparkles}>
            <TagCloud tags={brandData.brandFeatures} onTagsChange={(t) => onChange('brandFeatures', t)} color="indigo" placeholder="+ Feature" />
          </Field>
          <div className="mt-4 flex-1">
            <Field label="Audience tags" icon={UserSquare2}>
              <TagCloud tags={brandData.audienceTags} onTagsChange={(t) => onChange('audienceTags', t)} color="purple" placeholder="+ Audience" />
            </Field>
          </div>
        </div>

        <div className="p-8 bg-primary-900 rounded-2xl shadow-xl text-white space-y-6">
          <div className="flex items-center gap-3">
            <Megaphone size={18} className="text-primary-300" />
            <h3 className="text-sm font-bold">Audience engagement platforms</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {platforms.map(platform => {
              const isActive = brandData.mediaPlatforms?.includes(platform.id)
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 border ${isActive ? 'bg-white text-primary-900 border-white shadow-lg' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white/60'}`}
                >
                  <img src={platform.icon} alt={platform.label} className={`w-7 h-7 rounded-full shadow-sm ${isActive ? '' : 'grayscale opacity-40'}`} />
                  <span className="font-bold text-xs">{platform.label}</span>
                  {isActive && <Check size={14} className="ml-auto text-primary-600" />}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-primary-300/50 leading-relaxed font-medium pt-2">
          Platforms where your brand audience is frequently active.
          </p>
        </div>
      </div>

      {/* 4. Brand Kits Content - MIGRATED FROM BrandKits.jsx */}
      <div className="space-y-10">
        {/* 4.1 Visual Identity & Standards Unified Card */}
        <div className="grid grid-cols-1 relative z-10">
          <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Brand Colors Section */}
              <Field label="Brand colors" icon={Palette}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {brandData.colors.map((color) => (
                    <div key={color.id} className="group relative flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-2xl transition-all hover:bg-white hover:shadow-md">
                      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl shadow-inner border border-black/5">
                        <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Edit3 size={16} className="text-white drop-shadow-sm" />
                          <input 
                            type="color" 
                            value={color.hex} 
                            onChange={(e) => handleColorChange(color.id, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-neutral-400 truncate">{color.label}</div>
                        <div className="text-sm font-mono font-bold text-neutral-700 uppercase select-none">
                          {color.hex}
                        </div>
                      </div>
                      {brandData.colors.length > 1 && (
                        <button 
                          onClick={() => removeColor(color.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-300 hover:text-rose-500 transition-all"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {brandData.colors.length < 3 && (
                    <button 
                      onClick={addColor}
                      className="flex items-center justify-center gap-2 h-[74px] border-2 border-dashed border-neutral-100 rounded-2xl text-neutral-300 hover:text-primary-400 hover:border-primary-200 hover:bg-primary-50 transition-all"
                    >
                      <Plus size={18} />
                      <span className="text-xs font-bold">Add Color</span>
                    </button>
                  )}
                </div>
              </Field>

              {/* Typography & Language Section */}
              <div className="flex flex-col gap-10">
                <Field label="Typography" icon={Type}>
                  <TagCloud 
                    tags={brandData.fonts} 
                    onTagsChange={(t) => onChange('fonts', t)} 
                    color="indigo" 
                    placeholder="+ Font" 
                  />
                </Field>

                <Field label="Marketing language preference" icon={Languages}>
                  <TagCloud 
                    tags={brandData.languagePreference} 
                    onTagsChange={(t) => onChange('languagePreference', t)} 
                    color="indigo" 
                    placeholder="+ Language" 
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* 4.2 Style & Tone Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Visual Style Card */}
          <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-col gap-8">
            <Field label="Brand visual style" icon={Sparkles}>
              <textarea 
                className="w-full h-full min-h-[100px] bg-neutral-50 border-none rounded-xl p-5 text-sm font-medium leading-relaxed text-neutral-600 focus:ring-4 focus:ring-primary-500/5 transition-all resize-none shadow-inner"
                value={brandData.visualStyle}
                onChange={(e) => onChange('visualStyle', e.target.value)}
                placeholder="Describe your brand's visual style type..."
              />
            </Field>
          </div>
          
          {/* Brand Tone Card */}
          <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm flex flex-col gap-8">
            <Field label="Brand voice & tone" icon={MessageSquare}>
              <textarea 
                className="w-full h-full min-h-[100px] bg-neutral-50 border-none rounded-xl p-5 text-sm font-medium leading-relaxed text-neutral-600 focus:ring-4 focus:ring-primary-500/5 transition-all resize-none shadow-inner"
                value={brandData.tone}
                onChange={(e) => onChange('tone', e.target.value)}
                placeholder="How does your brand communicate?"
              />
            </Field>
          </div>
        </div>

        {/* 4.3 Preference & Taboos Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Brand Preference Card */}
          <div className="p-8 bg-white border border-neutral-100 rounded-2xl shadow-sm space-y-8 flex flex-col">
            <Field label="Brand preference" icon={Heart}>
              <TagCloud 
                tags={brandData.preferredPhrases} 
                onTagsChange={(t) => onChange('preferredPhrases', t)} 
                color="indigo" 
                placeholder="+ Content" 
              />
            </Field>
          </div>

          {/* Brand Taboos Card */}
          <div className="p-8 bg-rose-50 border border-rose-100/50 rounded-2xl space-y-8 flex flex-col">
            <Field label="Brand taboos" icon={Ban}>
              <div className="space-y-4">
                <TagCloud 
                  tags={brandData.forbiddenWords} 
                  onTagsChange={(t) => onChange('forbiddenWords', t)} 
                  color="rose" 
                  placeholder="+ Content" 
                />
                <p className="text-[10px] text-rose-400 font-bold leading-relaxed">
                  Content and concepts that must not appear in any brand marketing materials.
                </p>
              </div>
            </Field>
          </div>
        </div>
      </div>

      <footer className="pt-8 pb-4 flex flex-col items-center gap-2 opacity-10">
        <Fingerprint size={24} />
        <p className="text-[10px] font-bold">Digital identity signature v6.3 pro</p>
      </footer>
    </div>
  )
}

// --- Helper Components ---

const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-primary-400" />}
      <h3 className="text-[11px] font-bold text-neutral-400 tracking-tight">{label}</h3>
    </div>
    <div className="relative">{children}</div>
  </div>
)

const TagCloud = ({ tags = [], onTagsChange, color = "indigo", placeholder }) => {
  const [val, setVal] = useState('')
  const colors = {
    indigo: "bg-primary-50 border-primary-100 text-primary-700 hover:bg-primary-100",
    purple: "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100",
    rose: "bg-white border-rose-100 text-rose-700 hover:bg-rose-50"
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t, i) => (
        <span key={i} className={`pl-3 pr-2 py-1 border rounded-xl text-[12px] font-bold flex items-center gap-1.5 group/tag transition-all hover:shadow-sm ${colors[color]}`}>
          {t}
          <button onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-500 transition-all"><X size={10} strokeWidth={3} /></button>
        </span>
      ))}
      <input 
        className="text-[12px] font-bold bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1 outline-none w-24 placeholder:text-neutral-300 focus:border-primary-300 focus:bg-white transition-all shadow-inner"
        placeholder={placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && val) {
            e.preventDefault()
            onTagsChange([...tags, val])
            setVal('')
          }
        }}
      />
    </div>
  )
}

export default FoundationTab
