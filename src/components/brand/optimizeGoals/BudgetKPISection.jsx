import { useState, useEffect, useRef } from 'react'
import { Globe, DollarSign, CheckCircle2, Search, Plus, X, Zap, Target, Trash2, Copy, LayoutGrid, PlusCircle, Settings2, Info, ArrowRight, MoreVertical, Layers, Sparkles, ChevronRight, ChevronLeft, Monitor, Phone } from 'lucide-react'
import { campaignObjectives, getAdsetGoals, allEvents } from './ObjectiveSection'

const COUNTRY_CODES = [
  { code: '+1', country: 'United States', iso: 'us' },
  { code: '+86', country: 'China', iso: 'cn' },
  { code: '+44', country: 'United Kingdom', iso: 'uk' },
  { code: '+49', country: 'Germany', iso: 'de' },
  { code: '+33', country: 'France', iso: 'fr' },
  { code: '+81', country: 'Japan', iso: 'jp' },
  { code: '+82', country: 'South Korea', iso: 'kr' },
  { code: '+61', country: 'Australia', iso: 'au' },
  { code: '+65', country: 'Singapore', iso: 'sg' },
  { code: '+91', country: 'India', iso: 'in' },
  { code: '+55', country: 'Brazil', iso: 'br' },
  { code: '+52', country: 'Mexico', iso: 'mx' },
  { code: '+971', country: 'United Arab Emirates', iso: 'ae' }
]

const PLATFORMS = [
  { id: 'meta', label: 'Meta', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
  { id: 'google', label: 'Google', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' },
  { id: 'tiktok', label: 'Tik Tok', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256' },
  { id: 'bing', label: 'Bing', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256' },
  { id: 'applovin', label: 'Applovin', icon: 'https://www.google.com/s2/favicons?domain=applovin.com&sz=128' }
]

const COLLECTED_INFO_OPTIONS = [
  { id: 'full_name', label: 'Full name' },
  { id: 'email', label: 'Email' },
  { id: 'phone_number', label: 'Phone number' }
]

// Component for Input with Dynamic Unit Follow and Validation
const UnitFollowInput = ({ value, onChange, placeholder, unit, className = '', containerClassName = '', align = 'left' }) => {
  const spanRef = useRef(null)
  const [textWidth, setTextWidth] = useState(0)

  useEffect(() => {
    if (spanRef.current) {
      setTextWidth(spanRef.current.offsetWidth)
    }
  }, [value])

  const handleValueChange = (e) => {
    let val = e.target.value
    if (val !== '' && parseFloat(val) < 0) return
    if (val.includes('.')) {
      const parts = val.split('.')
      if (parts[1].length > 2) return
    }
    onChange(e)
  }

  return (
    <div className={`relative flex items-center ${containerClassName}`}>
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Ghost span to measure text width */}
      <span 
        ref={spanRef} 
        className="absolute invisible whitespace-pre pointer-events-none"
        style={{ font: 'inherit', letterSpacing: 'inherit' }}
      >
        {value || ''}
      </span>

      {!value && (
        <span className={`absolute ${align === 'right' ? 'right-2' : 'left-4'} text-slate-300 font-black pointer-events-none animate-in fade-in duration-300`}>
          {unit}
        </span>
      )}

      <input
        type="number"
        value={value}
        onChange={handleValueChange}
        onWheel={(e) => e.target.blur()}
        placeholder={placeholder}
        className={`${className} ${!value ? (align === 'right' ? 'pr-6' : 'pl-9') : (align === 'right' ? 'pr-8' : 'pl-4')}`}
      />

      {value && (
        <span 
          className="absolute text-slate-400 font-black pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-left-1 flex items-center h-full"
          style={{ 
            left: align === 'right' ? 'auto' : `${textWidth + 26}px`,
            right: align === 'right' ? '8px' : 'auto',
            fontSize: 'inherit',
            top: 0
          }}
        >
          {unit}
        </span>
      )}
    </div>
  )
}

const CollectedInfoSelector = ({ group, updateGroup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedInfo = group.collectedInfo || ['full_name', 'email', 'phone_number']

  const toggleInfo = (id) => {
    const next = selectedInfo.includes(id)
      ? selectedInfo.filter(item => item !== id)
      : [...selectedInfo, id]
    updateGroup(group.id, { collectedInfo: next })
  }

  const selectedLabels = selectedInfo.map(id => COLLECTED_INFO_OPTIONS.find(o => o.id === id)?.label).join(', ')

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-4 h-10 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-all hover:bg-white hover:border-indigo-200 ${
          isOpen ? 'border-indigo-500 bg-white shadow-sm' : ''
        }`}
      >
        <div className="flex flex-col truncate">
          <span className="text-[11px] font-black text-slate-900 truncate">
            {selectedInfo.length > 0 ? selectedLabels : 'Select info...'}
          </span>
        </div>
        <ChevronRight size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[120] mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 gap-0.5">
            {COLLECTED_INFO_OPTIONS.map(opt => {
              const isSelected = selectedInfo.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleInfo(opt.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                    isSelected ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-bold">{opt.label}</span>
                  {isSelected && <CheckCircle2 size={14} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const PhoneNumberInput = ({ group, updateGroup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  const selectedCode = group.phoneCountryCode || '+1'
  const filteredCodes = COUNTRY_CODES.filter(c => 
    c.country.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
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
    <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
      <div className="relative w-[84px] shrink-0" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white hover:border-indigo-200 transition-all"
        >
          <span className="text-xs font-black text-slate-900">{selectedCode}</span>
          <ChevronRight size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-[130] mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mb-2">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border-none rounded-lg text-[10px] font-bold focus:ring-1 focus:ring-indigo-500/20"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
              {filteredCodes.map(c => (
                <button
                  key={c.iso}
                  onClick={() => {
                    updateGroup(group.id, { phoneCountryCode: c.code })
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-between transition-colors ${
                    selectedCode === c.code ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="truncate mr-2">{c.country}</span>
                  <span className="text-slate-400 font-medium">{c.code}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
        <input 
          type="tel"
          placeholder="Phone number"
          value={group.phoneNumber || ''}
          onChange={(e) => updateGroup(group.id, { phoneNumber: e.target.value })}
          className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
        />
      </div>
    </div>
  )
}

const PlatformSelector = ({ group, updateGroup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedPlatforms = group.platforms || []

  const togglePlatform = (id) => {
    const next = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter(p => p !== id)
      : [...selectedPlatforms, id]
    updateGroup(group.id, { platforms: next })
  }

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-6 py-3.5 bg-slate-50 border-2 rounded-2xl cursor-pointer transition-all ${
          isOpen ? 'border-indigo-500 bg-white shadow-lg' : 'border-slate-100 hover:border-indigo-100 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {selectedPlatforms.length > 0 ? (
                <div className="flex -space-x-1.5">
                  {selectedPlatforms.map(id => {
                    const p = PLATFORMS.find(item => item.id === id)
                    return (
                      <div key={id} className="w-5 h-5 rounded-full border border-white overflow-hidden bg-white shadow-sm">
                        <img src={p?.icon} alt={id} className="w-full h-full object-cover" />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <span className="text-[13px] font-black text-slate-900">Choose Ad Platforms</span>
              )}
            </div>
            {selectedPlatforms.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                {selectedPlatforms.length} Platforms selected
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={16} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[120] mt-2 w-full bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {PLATFORMS.map(p => {
              const isSelected = selectedPlatforms.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isSelected ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-100 p-0.5">
                      <img src={p.icon} alt={p.id} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold">{p.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={16} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const ObjectiveSelector = ({ group, updateGroup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState('objective') // 'objective', 'goal', 'event'
  const [eventSearch, setEventSearch] = useState('')

  const adsetGoals = getAdsetGoals(group.campaignObjective)
  const currentObjective = campaignObjectives.find(o => o.value === group.campaignObjective)
  const currentGoal = adsetGoals.find(g => g.value === group.adsetGoal)
  const filteredEvents = allEvents.filter(ev => ev.toLowerCase().includes(eventSearch.toLowerCase()))

  const handleObjectiveSelect = (obj) => {
    const goals = getAdsetGoals(obj.value)
    updateGroup(group.id, {
      campaignObjective: obj.value,
      adsetGoal: goals[0]?.value || '',
      event: goals[0]?.needsEvent ? 'Purchase' : ''
    })
    setStage('goal')
  }

  const handleGoalSelect = (goal) => {
    const updates = {
      adsetGoal: goal.value,
      event: goal.needsEvent ? (group.event || 'Purchase') : ''
    }
    
    if (goal.value === 'instant_form_leads') {
      updates.collectedInfo = ['full_name', 'email', 'phone_number']
    }
    
    updateGroup(group.id, updates)
    
    if (goal.needsEvent) {
      setStage('event')
    } else {
      setIsOpen(false)
    }
  }

  const handleEventSelect = (ev) => {
    updateGroup(group.id, { event: ev })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div 
        onClick={() => {
          setIsOpen(!isOpen)
          setStage('objective')
        }}
        className={`flex items-center justify-between px-6 py-3.5 bg-slate-50 border-2 rounded-2xl cursor-pointer transition-all ${
          isOpen ? 'border-indigo-500 bg-white shadow-lg' : 'border-slate-100 hover:border-indigo-100 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[13px] font-black text-slate-900">
              {group.event || currentGoal?.label || 'Select Objective'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {group.event ? (
                <>
                  <span className="text-[10px] font-bold text-slate-400">
                    {currentObjective?.label}
                  </span>
                  <ChevronRight size={8} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400">
                    {currentGoal?.label}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">
                  {currentObjective?.label || 'None'}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronRight size={16} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[110] mt-2 w-full bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 animate-in fade-in zoom-in-95 duration-200">
          {stage === 'objective' && (
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2 px-2">1. Campaign Objective</p>
              <div className="grid grid-cols-1 gap-1">
                {campaignObjectives.map(obj => (
                  <button
                    key={obj.value}
                    onClick={() => handleObjectiveSelect(obj)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                      group.campaignObjective === obj.value ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${group.campaignObjective === obj.value ? 'bg-indigo-500 text-white' : `${obj.bg} ${obj.color}`}`}>
                      <obj.icon size={14} />
                    </div>
                    <span>{obj.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'goal' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2 px-1">
                <button onClick={() => setStage('objective')} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
                  <ChevronLeft size={14} />
                </button>
                <p className="text-[10px] font-black text-slate-400 tracking-widest">2. Conversion Goal</p>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {adsetGoals.map(goal => (
                  <button
                    key={goal.value}
                    onClick={() => handleGoalSelect(goal)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                      group.adsetGoal === goal.value ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{goal.label}</span>
                    {goal.needsEvent ? <ArrowRight size={12} className="opacity-30 group-hover:opacity-100" /> : (group.adsetGoal === goal.value && <CheckCircle2 size={12} />)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'event' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <button onClick={() => setStage('goal')} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
                  <ChevronLeft size={14} />
                </button>
                <p className="text-[10px] font-black text-slate-400 tracking-widest">3. Pixel Event</p>
              </div>
              <div className="relative px-1">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
                {filteredEvents.map(ev => (
                  <button
                    key={ev}
                    onClick={() => handleEventSelect(ev)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${
                      group.event === ev ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {ev}
                    {group.event === ev && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const BudgetKPISection = ({ formData, updateFormData, updateFormDataDeep, validation, setValidation, isOnboarding }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchGroupId, setActiveSearchGroupId] = useState(null)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [batchSettings, setBatchSettings] = useState({}) 

  const availableLocations = [
    { value: 'us', label: 'United States', locationGroup: 'North America' },
    { value: 'ca', label: 'Canada', locationGroup: 'North America' },
    { value: 'uk', label: 'United Kingdom', locationGroup: 'Europe' },
    { value: 'de', label: 'Germany', locationGroup: 'Europe' },
    { value: 'fr', label: 'France', locationGroup: 'Europe' },
    { value: 'au', label: 'Australia', locationGroup: 'Oceania' },
    { value: 'jp', label: 'Japan', locationGroup: 'Asia' },
    { value: 'kr', label: 'South Korea', locationGroup: 'Asia' },
    { value: 'sg', label: 'Singapore', locationGroup: 'Asia' },
    { value: 'cn', label: 'China', locationGroup: 'Asia' },
    { value: 'in', label: 'India', locationGroup: 'Asia' },
    { value: 'br', label: 'Brazil', locationGroup: 'South America' },
    { value: 'mx', label: 'Mexico', locationGroup: 'North America' },
    { value: 'ae', label: 'United Arab Emirates', locationGroup: 'Middle East' }
  ]

  const filteredLocations = availableLocations.filter(loc => 
    loc.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.locationGroup.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateGroup = (groupId, updates) => {
    const newGroups = formData.marketGroups.map(g => 
      g.id === groupId ? { ...g, ...updates } : g
    )
    updateFormData('marketGroups', newGroups)
  }

  const addGroup = () => {
    const newId = crypto.randomUUID()
    const newGroup = {
      id: newId,
      targetLocations: [],
      platforms: ['meta', 'google'],
      campaignObjective: 'sales_conversions',
      adsetGoal: 'in_web_actions',
      event: 'Purchase',
      phoneNumber: '',
      phoneCountryCode: '+1',
      collectedInfo: ['full_name', 'email', 'phone_number'],
      budgetMode: 'unified',
      unifiedBudget: '',
      splitBudgets: {},
      kpiType: 'ROAS',
      kpiMode: 'unified',
      unifiedKPI: '',
      splitKPIs: {}
    }
    updateFormData('marketGroups', [...formData.marketGroups, newGroup])
  }

  const duplicateGroup = (groupToCopy) => {
    const newId = crypto.randomUUID()
    const newGroup = {
      ...JSON.parse(JSON.stringify(groupToCopy)),
      id: newId
    }
    updateFormData('marketGroups', [...formData.marketGroups, newGroup])
  }

  const removeGroup = (groupId) => {
    if (formData.marketGroups.length <= 1) return
    const newGroups = formData.marketGroups.filter(g => g.id !== groupId)
    updateFormData('marketGroups', newGroups)
  }

  const addLocation = (groupId, location) => {
    const group = formData.marketGroups.find(g => g.id === groupId)
    if (!group.targetLocations.find(l => l.value === location.value)) {
      updateGroup(groupId, {
        targetLocations: [...group.targetLocations, location]
      })
    }
    setShowLocationDropdown(false)
    setSearchQuery('')
    setActiveSearchGroupId(null)
  }

  const removeLocation = (groupId, locationValue) => {
    const group = formData.marketGroups.find(g => g.id === groupId)
    updateGroup(groupId, {
      targetLocations: group.targetLocations.filter(l => l.value !== locationValue)
    })
  }

  const applyBatchBudget = (groupId) => {
    const val = batchSettings[groupId]?.budget
    if (!val) return
    const group = formData.marketGroups.find(g => g.id === groupId)
    const newSplitBudgets = {}
    group.targetLocations.forEach(location => {
      newSplitBudgets[location.value] = val
    })
    updateGroup(groupId, { splitBudgets: newSplitBudgets })
    setBatchSettings(prev => ({ ...prev, [groupId]: { ...prev[groupId], budget: '' } }))
  }

  const applyBatchKPI = (groupId) => {
    const val = batchSettings[groupId]?.kpi
    if (!val) return
    const group = formData.marketGroups.find(g => g.id === groupId)
    const newSplitKPIs = {}
    group.targetLocations.forEach(location => {
      newSplitKPIs[location.value] = val
    })
    updateGroup(groupId, { splitKPIs: newSplitKPIs })
    setBatchSettings(prev => ({ ...prev, [groupId]: { ...prev[groupId], kpi: '' } }))
  }

  useEffect(() => {
    const allGroupsValid = formData.marketGroups.length > 0 && formData.marketGroups.every(group => {
      const locValid = group.targetLocations.length > 0
      const platformsValid = (group.platforms || []).length > 0
      let budgetValid = group.budgetMode === 'unified' ? !!group.unifiedBudget : (locValid && group.targetLocations.every(loc => group.splitBudgets[loc.value]))
      
      const adsetGoals = getAdsetGoals(group.campaignObjective)
      const currentGoal = adsetGoals.find(g => g.value === group.adsetGoal)
      const objectiveValid = !!(group.campaignObjective && group.adsetGoal && (!currentGoal?.needsEvent || group.event))
      
      const phoneValid = (group.adsetGoal === 'calls' || group.adsetGoal === 'instant_form_leads') ? !!group.phoneNumber : true
      const infoValid = group.adsetGoal === 'instant_form_leads' ? (group.collectedInfo || []).length > 0 : true
      
      return locValid && platformsValid && budgetValid && objectiveValid && phoneValid && infoValid
    })
    setValidation(prev => ({ ...prev, marketGroups: allGroupsValid }))
  }, [formData.marketGroups, setValidation])

  const colors = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500'
  ]

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative z-10 overflow-visible animate-in fade-in duration-700">
      
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-slate-900" />
          <h2 className="text-sm font-black text-slate-900">Budget & Performance KPI Group <span className="text-rose-500 ml-1">*</span></h2>
        </div>
        {validation.marketGroups && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-8 space-y-10">
        {formData.marketGroups.map((group, index) => {
          const locValid = group.targetLocations.length > 0
          const accentColor = colors[index % colors.length]
          
          return (
            <div key={group.id} className={`relative rounded-3xl border border-slate-100 transition-all ${index > 0 ? 'mt-10' : ''} overflow-visible`}>
              <div className="flex flex-col lg:flex-row rounded-[28px] border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all h-auto overflow-visible">
                
                <div className="lg:w-[35%] bg-slate-50/30 border-r border-slate-100 p-6 flex flex-col h-auto overflow-visible relative z-[50]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-6 rounded-full ${accentColor}`} />
                      <div>
                        <h3 className="text-base font-black text-slate-900">Strategy {index + 1}</h3>
                        <p className="text-[11px] font-bold text-slate-400">Budget and KPI based on locations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => duplicateGroup(group)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Duplicate Strategy"
                      >
                        <Copy size={16} />
                      </button>
                      {formData.marketGroups.length > 1 && (
                        <button 
                          onClick={() => removeGroup(group.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Remove Strategy"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="relative group/search">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        value={activeSearchGroupId === group.id ? searchQuery : ''}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setActiveSearchGroupId(group.id)
                          setShowLocationDropdown(true)
                        }}
                        onFocus={() => {
                          setActiveSearchGroupId(group.id)
                          setShowLocationDropdown(true)
                        }}
                        placeholder="Add locations..."
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm ${isOnboarding && !locValid ? 'border-red-400 bg-red-50/20' : 'border-slate-200'}`}
                      />
                      
                      {showLocationDropdown && activeSearchGroupId === group.id && (
                        <div className="absolute z-[100] mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-h-60 overflow-y-auto animate-in zoom-in-95 duration-200">
                          {filteredLocations.map((location) => {
                            const isSelected = group.targetLocations.find(l => l.value === location.value)
                            const isUsedElsewhere = formData.marketGroups.some(g => g.id !== group.id && g.targetLocations.find(l => l.value === location.value))
                            return (
                              <button
                                key={location.value}
                                onClick={() => addLocation(group.id, location)}
                                disabled={isSelected || isUsedElsewhere}
                                className={`w-full p-4 text-left hover:bg-slate-50 transition-all flex items-center justify-between border-b border-slate-50 last:border-0 ${
                                  isSelected || isUsedElsewhere ? 'bg-slate-50/50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-bold ${isSelected || isUsedElsewhere ? 'text-slate-300' : 'text-slate-900'}`}>{location.label}</p>
                                    {isUsedElsewhere && <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-black">Occupied</span>}
                                  </div>
                                </div>
                                {isSelected && <CheckCircle2 size={16} className="text-emerald-500" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.targetLocations.map((location, locIdx) => (
                        <span key={location.value || `${location}-${locIdx}`} className="px-3 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm animate-in zoom-in">
                          {location.label || location}
                          <X size={12} className="cursor-pointer hover:text-rose-500" onClick={() => removeLocation(group.id, location.value || location)} />
                        </span>
                      ))}
                      {!locValid && (
                        <div className="w-full py-10 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-white/50 space-y-2">
                          <Globe size={24} className="text-slate-200" />
                          <p className="text-[11px] font-bold text-slate-300">No locations added</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 flex flex-col space-y-6 relative h-auto overflow-visible">
                  {!locValid && (
                    <div className="absolute inset-0 z-10 bg-white flex items-center justify-center rounded-r-[28px]">
                      <div className="text-center space-y-3 px-10">
                        <div className="w-14 h-14 rounded-full bg-slate-50 text-indigo-500 flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                          <Layers size={28} />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-400 mt-1">Please select target locations on the left to configure budgets and KPI goals for this strategy</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Platforms & Objective Selection Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Monitor size={18} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">Ad Platforms</h4>
                      </div>
                      <PlatformSelector group={group} updateGroup={updateGroup} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <Target size={18} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">Promote Objective</h4>
                      </div>
                      <ObjectiveSelector group={group} updateGroup={updateGroup} />
                    </div>
                  </div>

                  {/* Dynamic Fields Row: Phone for Calls, or Collected Info + Phone for Lead Form */}
                  {(group.adsetGoal === 'calls' || group.adsetGoal === 'instant_form_leads') && (
                    <div className="p-4 bg-slate-50/80 rounded-[20px] border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {group.adsetGoal === 'calls' ? (
                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-400 tracking-widest px-1">Contact Phone <span className="text-rose-500">*</span></span>
                            <PhoneNumberInput group={group} updateGroup={updateGroup} />
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-slate-400 tracking-widest px-1">Collected Info <span className="text-rose-500">*</span></span>
                              <CollectedInfoSelector group={group} updateGroup={updateGroup} />
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-slate-400 tracking-widest px-1">Contact Phone <span className="text-rose-500">*</span></span>
                              <PhoneNumberInput group={group} updateGroup={updateGroup} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Row for Budget and KPI */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Budget Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <DollarSign size={18} />
                          </div>
                          <h4 className="text-sm font-black text-slate-900">Daily Budget</h4>
                        </div>
                      </div>

                      {group.budgetMode === 'unified' ? (
                        <UnitFollowInput
                          value={group.unifiedBudget}
                          unit="$"
                          onChange={(e) => updateGroup(group.id, { unifiedBudget: e.target.value })}
                          placeholder="0.00"
                          className={`w-full pr-12 py-2.5 bg-slate-50 border rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-indigo-500 transition-all ${isOnboarding && !group.unifiedBudget ? 'border-red-400 bg-red-50/20' : 'border-slate-100'}`}
                        />
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2 p-1 bg-indigo-50/50 rounded-xl">
                            <UnitFollowInput
                              value={batchSettings[group.id]?.budget || ''}
                              unit="$"
                              onChange={(e) => setBatchSettings(prev => ({ ...prev, [group.id]: { ...prev[group.id], budget: e.target.value } }))}
                              placeholder="Batch set..."
                              containerClassName="flex-1"
                              className="w-full py-2 bg-white border-none rounded-lg text-sm font-bold focus:outline-none"
                            />
                            <button onClick={() => applyBatchBudget(group.id)} className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg text-[11px] font-black hover:bg-indigo-50 transition-all">
                              Apply
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {group.targetLocations.map(loc => (
                              <div key={loc.value} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-600 truncate mr-1">{loc.label}</span>
                                <UnitFollowInput
                                  value={group.splitBudgets[loc.value] || ''}
                                  unit="$"
                                  align="right"
                                  onChange={(e) => updateGroup(group.id, { splitBudgets: { ...group.splitBudgets, [loc.value]: e.target.value } })}
                                  containerClassName="w-24"
                                  className="w-full py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-right"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* KPI Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Zap size={18} />
                          </div>
                          <h4 className="text-sm font-black text-slate-900">Performance KPI</h4>
                        </div>
                      </div>

                      {group.kpiMode === 'unified' ? (
                        <div className={`flex items-center rounded-2xl h-12 overflow-hidden border focus-within:border-emerald-500 transition-all ${isOnboarding && !group.unifiedKPI ? 'border-red-400 bg-red-50/20' : 'border-slate-200'}`}>
                          <div className="flex items-center bg-slate-100 self-stretch px-1.5 gap-0.5 border-r border-slate-200">
                            {['ROAS', 'CPA'].map(type => (
                              <button
                                key={type}
                                onClick={() => updateGroup(group.id, { kpiType: type })}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide transition-all ${
                                  group.kpiType === type
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-500'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          <UnitFollowInput
                            value={group.unifiedKPI}
                            unit={group.kpiType === 'ROAS' ? 'x' : '$'}
                            onChange={(e) => updateGroup(group.id, { unifiedKPI: e.target.value })}
                            placeholder={`Target ${group.kpiType}`}
                            containerClassName="flex-1 bg-white"
                            className="w-full pr-12 py-2.5 bg-transparent border-none text-base font-black text-slate-900 focus:outline-none h-full"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center bg-slate-100/60 rounded-xl p-0.5 self-start w-fit">
                            {['ROAS', 'CPA'].map(type => (
                              <button
                                key={type}
                                onClick={() => updateGroup(group.id, { kpiType: type })}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide transition-all ${
                                  group.kpiType === type
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-500'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2 p-1 bg-emerald-50/50 rounded-xl h-12 items-center">
                            <UnitFollowInput
                              value={batchSettings[group.id]?.kpi || ''}
                              unit={group.kpiType === 'ROAS' ? 'x' : '$'}
                              onChange={(e) => setBatchSettings(prev => ({ ...prev, [group.id]: { ...prev[group.id], kpi: e.target.value } }))}
                              placeholder="Batch set..."
                              containerClassName="flex-1"
                              className="w-full py-2 bg-transparent border-none text-sm font-bold focus:outline-none"
                            />
                            <button onClick={() => applyBatchKPI(group.id)} className="px-3 h-8 border-2 border-indigo-600 text-indigo-600 rounded-lg text-[11px] font-black hover:bg-indigo-50 transition-all">
                              Apply
                            </button>
                          </div>
                        </div>
                      )}

                      {group.kpiType === 'ROAS' && group.unifiedKPI && group.kpiMode === 'unified' && (
                        <p className="text-xs text-orange-500 font-medium mt-1.5 ml-1">
                          Hoping to earn ${group.unifiedKPI} per $1 ad spent
                        </p>
                      )}

                      {group.kpiMode !== 'unified' && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {group.targetLocations.map(loc => (
                            <div key={loc.value} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-600 truncate mr-1">{loc.label}</span>
                              <UnitFollowInput
                                value={group.splitKPIs[loc.value] || ''}
                                unit={group.kpiType === 'ROAS' ? 'x' : '$'}
                                align="right"
                                onChange={(e) => updateGroup(group.id, { splitKPIs: { ...group.splitKPIs, [loc.value]: e.target.value } })}
                                containerClassName="w-20"
                                className="w-full py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-right"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )
        })}

        {!isOnboarding && (
          <button
            onClick={addGroup}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-2.5 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-[0.99] group"
          >
            <PlusCircle size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black tracking-tight">Add another strategy group</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default BudgetKPISection
