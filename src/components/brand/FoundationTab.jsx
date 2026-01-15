import { useState } from 'react'
import { 
  Upload, X, Plus, Globe, Briefcase, MapPin, Layers, Sparkles, 
  MessageSquare, UserSquare2, Megaphone, Check, ChevronDown, Fingerprint
} from 'lucide-react'

const FoundationTab = ({ data = {}, onChange }) => {
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(0)
  
  const defaultData = {
    name: '',                    // Brand Name
    logos: ['🚀'],              // Logo array (supports up to 5)
    domain: '',                 // Domain  
    businessType: 'online_shopping',  // Business Type
    subIndustry: '',            // Industry Vertical
    businessScale: '',          // Business Scale
    websiteLanguage: [],        // Website Language (Now Tags)
    slogan: '',                 // Slogan
    description: '',            // Brand Description
    businessModel: [],          // Business Model (Now Tags)
    nicheMarket: '',            // Niche Market
    brandFeatures: [],          // Brand Features
    audienceTags: [],           // Audience Tags
    mediaPlatforms: [],         // Media Platforms (Now Tags)
    brandLocation: 'cn'         // Geographic Location
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

  const handleLogoSelect = (index) => {
    setSelectedLogoIndex(index)
  }

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

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 space-y-24 animate-in fade-in duration-1000 text-slate-900 selection:bg-indigo-100">
      
      {/* 1. Identity Signature Card - Brand Identity Zone */}
      <section className="relative group">
        <div className="relative bg-purple-100/70 backdrop-blur-sm border border-purple-200/50 rounded-[40px] p-12 shadow-[0_4px_32px_rgba(168,85,247,0.12)] overflow-hidden">
          
          <div className="flex items-start gap-12 relative z-10">
            {/* Enhanced Logo Gallery - Left Side */}
            <div className="shrink-0 space-y-5">
              {/* Primary Logo Display - Larger */}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label 
                  htmlFor="logo-upload"
                  className={`w-36 h-36 bg-white/90 border-2 border-white rounded-[32px] flex items-center justify-center text-6xl shadow-lg relative group/logo cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-200 ${selectedLogoIndex !== -1 ? 'ring-3 ring-purple-400 ring-offset-3' : ''}`}
                >
                  {brandData.logos[selectedLogoIndex] || brandData.logos[0] || '🚀'}
                  <div className="absolute inset-0 bg-purple-600/5 rounded-[32px] opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <Upload size={20} className="text-purple-600" />
                  </div>
                </label>
              </div>
              
              {/* Secondary Logos Gallery - Enhanced */}
              <div className="bg-white/50 rounded-2xl p-3 shadow-sm border border-white/60">
                <div className="flex gap-2 justify-center flex-wrap max-w-[150px]">
                  {brandData.logos.map((logo, i) => (
                    <div 
                      key={i} 
                      className={`relative group/sub w-9 h-9 bg-white/80 border border-white rounded-xl flex items-center justify-center text-base shadow-sm hover:scale-110 transition-transform cursor-pointer ${i === selectedLogoIndex ? 'ring-2 ring-purple-400 ring-offset-1' : ''}`}
                      onClick={() => handleLogoSelect(i)}
                    >
                      {logo}
                      <X 
                        size={10} 
                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full opacity-0 group-hover/sub:opacity-100 shadow-sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLogoRemove(i)
                        }} 
                      />
                    </div>
                  ))}
                  {brandData.logos.length < 5 && (
                    <label htmlFor="logo-upload" className="w-9 h-9 border-2 border-dashed border-purple-300/50 bg-white/60 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all hover:scale-110 cursor-pointer shadow-sm">
                      <Plus size={14} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Identity Zone - Right Side */}
            <div className="flex-1 space-y-8 pt-1">
              {/* Zone 1: Brand Name with Domain Badge */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    className="text-5xl font-black tracking-tightest bg-transparent border-none outline-none focus:ring-0 text-slate-900 placeholder:text-indigo-200/50 shrink-0 w-auto min-w-[150px]" 
                    style={{ width: brandData.name ? `${brandData.name.length + 1}ch` : '250px' }}
                    value={brandData.name} 
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Brand Name"
                  />
                  
                  {/* Domain Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl border border-purple-200/50 shadow-sm">
                    <Globe size={14} className="text-purple-600" />
                    <input 
                      className="text-sm font-bold text-purple-700 bg-transparent border-none outline-none focus:ring-0 p-0 w-48 placeholder:text-purple-400/70" 
                      value={brandData.domain} 
                      onChange={(e) => onChange('domain', e.target.value)} 
                      placeholder="official-domain.com" 
                    />
                  </div>
                </div>
              </div>

              {/* Zone 2: Slogan */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-full" />
                <input 
                  className="text-xl font-medium text-slate-500 bg-transparent border-none outline-none w-full focus:ring-0 italic tracking-tight pl-4 truncate" 
                  value={brandData.slogan}
                  onChange={(e) => onChange('slogan', e.target.value)}
                  placeholder="brand mission or tagline..."
                />
              </div>

              {/* Zone 3: Business Info Tags */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <Briefcase size={14} className="text-slate-500" />
                  <select className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer appearance-none" value={brandData.businessType} onChange={(e) => onChange('businessType', e.target.value)}>
                    {businessTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <Layers size={14} className="text-slate-500" />
                  <input className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none focus:ring-0 p-0 w-28 placeholder:text-slate-400" value={brandData.subIndustry} onChange={(e) => onChange('subIndustry', e.target.value)} placeholder="Vertical" />
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <MapPin size={14} className="text-slate-500" />
                  <select className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer appearance-none" value={brandData.brandLocation} onChange={(e) => onChange('brandLocation', e.target.value)}>
                    {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Positioning */}
      <section className="space-y-12">
        <header className="flex items-center gap-4 px-4">
          <div className="w-1 h-8 bg-indigo-600 rounded-full" />
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Strategic Positioning</h2>
        </header>
        
        <div className="grid grid-cols-12 gap-20 px-4">
          <div className="col-span-5 space-y-12">
            <Field label="Business Scale">
              <input 
                className="w-full text-base font-bold text-slate-700 bg-transparent border-b border-slate-100 py-2 focus:border-indigo-500 outline-none transition-colors placeholder:font-normal placeholder:text-slate-200"
                value={brandData.businessScale}
                onChange={(e) => onChange('businessScale', e.target.value)}
                placeholder="Ex: 500+ Employees / $10M ARR"
              />
            </Field>
            <Field label="Revenue Architecture">
              <TagCloud tags={brandData.businessModel} onTagsChange={(t) => onChange('businessModel', t)} color="indigo" placeholder="+ Add Model" />
            </Field>
          </div>
          <div className="col-span-7">
            <Field label="Niche Market Definition">
              <textarea 
                className="w-full h-40 bg-slate-50 border-none rounded-[32px] p-6 text-[15px] font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none placeholder:text-slate-300 shadow-inner"
                value={brandData.nicheMarket}
                onChange={(e) => onChange('nicheMarket', e.target.value)}
                placeholder="Define your specific sector and core competitive advantage..."
              />
            </Field>
          </div>
        </div>
      </section>

      {/* 3. Brand Expression */}
      <section className="space-y-12">
        <header className="flex items-center gap-4 px-4">
          <div className="w-1 h-8 bg-indigo-600 rounded-full" />
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Brand Expression</h2>
        </header>

        <div className="space-y-16 px-4">
          <Field label="Brand Story & Mission">
            <textarea 
              className="w-full h-56 bg-slate-50 border-none rounded-[40px] p-10 text-[16px] font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner"
              value={brandData.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Tell the unique narrative of your brand..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-20">
            <Field label="Key Personality Tags" icon={Sparkles}>
              <TagCloud tags={brandData.brandFeatures} onTagsChange={(t) => onChange('brandFeatures', t)} color="indigo" placeholder="+ Personality" />
            </Field>
            <Field label="Ideal Audience Personas" icon={UserSquare2}>
              <TagCloud tags={brandData.audienceTags} onTagsChange={(t) => onChange('audienceTags', t)} color="purple" placeholder="+ Persona" />
            </Field>
          </div>
        </div>
      </section>

      {/* 4. Connectivity */}
      <section className="space-y-12">
        <header className="flex items-center gap-4 px-4">
          <div className="w-1 h-8 bg-indigo-600 rounded-full" />
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Market Connectivity</h2>
        </header>

        <div className="grid grid-cols-2 gap-20 px-4 pb-12">
          <Field label="Communication Languages" icon={Globe}>
            <TagCloud tags={brandData.websiteLanguage} onTagsChange={(t) => onChange('websiteLanguage', t)} color="indigo" placeholder="+ Language" />
          </Field>
          <Field label="Core Engagement Platforms" icon={Megaphone}>
            <TagCloud tags={brandData.mediaPlatforms} onTagsChange={(t) => onChange('mediaPlatforms', t)} color="purple" placeholder="+ Platform" />
          </Field>
        </div>
      </section>

      <footer className="pt-16 pb-12 border-t border-slate-50 flex flex-col items-center gap-4 opacity-10">
        <Fingerprint size={28} />
        <p className="text-[11px] font-black uppercase tracking-[0.6em]">Digital Identity Signature v5.2 Premium</p>
      </footer>
    </div>
  )
}

// --- Ultra Minimalist Internal Components ---

const MetadataItem = ({ icon: Icon, children, color }) => (
  <div className="flex items-center gap-2.5">
    <div className={`shrink-0 w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center shadow-sm border border-white`}>
      <Icon size={12} className={color} />
    </div>
    <div>{children}</div>
  </div>
)

const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-indigo-400" />}
      <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400">{label}</h3>
    </div>
    <div className="relative">{children}</div>
  </div>
)

const TagCloud = ({ tags = [], onTagsChange, color = "indigo", placeholder }) => {
  const [val, setVal] = useState('')
  const colors = {
    indigo: "bg-indigo-50 border-indigo-100/50 text-indigo-700",
    purple: "bg-purple-50 border-purple-100/50 text-purple-700"
  }
  
  return (
    <div className="flex flex-wrap gap-2.5">
      {tags.map((t, i) => (
        <span key={i} className={`px-4 py-1.5 border rounded-2xl text-[13px] font-bold flex items-center gap-3 group/tag transition-all hover:shadow-lg hover:shadow-indigo-500/5 ${colors[color]}`}>
          {t}
          <button onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-500 transition-all"><X size={12} /></button>
        </span>
      ))}
      <div className="relative">
        <input 
          className="text-[13px] font-bold bg-white/40 border border-slate-100 rounded-2xl px-4 py-1.5 outline-none w-32 placeholder:text-slate-300 focus:border-indigo-300 focus:bg-white focus:shadow-xl transition-all"
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && val) {
              onTagsChange([...tags, val])
              setVal('')
            }
          }}
        />
      </div>
    </div>
  )
}

export default FoundationTab
