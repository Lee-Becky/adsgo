import { useState, useEffect, useRef } from 'react'
import { Globe, DollarSign, CheckCircle2, Search, X, Zap, Target, Trash2, Copy, PlusCircle, Layers, ChevronRight, ChevronLeft, Monitor, ArrowRight, Smartphone, TrendingUp, ShieldAlert } from 'lucide-react'
import { campaignObjectives, getAdsetGoals, allEvents } from './ObjectiveSection'

const PLATFORMS = [
  { id: 'meta', label: 'Meta', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
  { id: 'google', label: 'Google', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' },
  { id: 'tiktok', label: 'Tik Tok', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256' },
  { id: 'bing', label: 'Bing', icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256' },
  { id: 'applovin', label: 'Applovin', icon: 'https://www.google.com/s2/favicons?domain=applovin.com&sz=128' }
]

const OS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
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

// Operator label (display only, not configurable)
const OperatorLabel = ({ op }) => (
  <span className="px-2.5 py-2 bg-slate-100 border-r border-slate-200 text-xs font-black text-slate-500 rounded-l-xl flex items-center justify-center w-10 shrink-0">
    {op}
  </span>
)

const PlatformSelector = ({ group, updateGroup }) => {
  const selectedPlatforms = group.platforms || []

  const togglePlatform = (id) => {
    const next = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter(p => p !== id)
      : [...selectedPlatforms, id]
    updateGroup(group.id, { platforms: next })
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {PLATFORMS.map(p => {
        const isSelected = selectedPlatforms.includes(p.id)
        return (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
              isSelected
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-slate-100 bg-white text-slate-400 hover:border-indigo-200'
            }`}
          >
            <div className="w-4 h-4 rounded-sm overflow-hidden bg-white">
              <img src={p.icon} alt={p.id} className="w-full h-full object-contain" />
            </div>
            {p.label}
            {isSelected && <CheckCircle2 size={11} className="text-indigo-500" />}
          </button>
        )
      })}
    </div>
  )
}

const ObjectiveSelector = ({ group, updateGroup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState('objective')
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
    updateGroup(group.id, {
      adsetGoal: goal.value,
      event: goal.needsEvent ? (group.event || 'Purchase') : ''
    })
    if (goal.needsEvent) setStage('event')
    else setIsOpen(false)
  }

  const handleEventSelect = (ev) => {
    updateGroup(group.id, { event: ev })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div
        onClick={() => { setIsOpen(!isOpen); setStage('objective') }}
        className={`flex items-center justify-between px-4 py-3 bg-white border rounded-xl cursor-pointer transition-all ${
          isOpen ? 'border-indigo-500 shadow-lg' : 'border-slate-200 hover:border-indigo-200'
        }`}
      >
        <div className="flex flex-col">
          <span className="text-[12px] font-black text-slate-900">
            {group.event || currentGoal?.label || 'Select Objective'}
          </span>
          {currentObjective && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-bold text-slate-400">{currentObjective.label}</span>
              {group.event && <>
                <ChevronRight size={8} className="text-slate-300" />
                <span className="text-[10px] font-bold text-slate-400">{currentGoal?.label}</span>
              </>}
            </div>
          )}
        </div>
        <ChevronRight size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[110] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 animate-in fade-in zoom-in-95 duration-200">
          {stage === 'objective' && (
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 mb-2 px-2">1. Campaign Objective</p>
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
          )}

          {stage === 'goal' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2 px-1">
                <button onClick={() => setStage('objective')} className="p-1 hover:bg-slate-100 rounded-md text-slate-400"><ChevronLeft size={14} /></button>
                <p className="text-[10px] font-black text-slate-400">2. Conversion Goal</p>
              </div>
              {adsetGoals.map(goal => (
                <button
                  key={goal.value}
                  onClick={() => handleGoalSelect(goal)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    group.adsetGoal === goal.value ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{goal.label}</span>
                  {goal.needsEvent ? <ArrowRight size={12} className="opacity-30" /> : (group.adsetGoal === goal.value && <CheckCircle2 size={12} />)}
                </button>
              ))}
            </div>
          )}

          {stage === 'event' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <button onClick={() => setStage('goal')} className="p-1 hover:bg-slate-100 rounded-md text-slate-400"><ChevronLeft size={14} /></button>
                <p className="text-[10px] font-black text-slate-400">3. Pixel Event</p>
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
              <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                {filteredEvents.map(ev => (
                  <button
                    key={ev}
                    onClick={() => handleEventSelect(ev)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
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
    const newGroup = {
      id: crypto.randomUUID(),
      targetLocations: [],
      platforms: ['meta', 'google'],
      os: 'all',
      campaignObjective: 'sales_conversions',
      adsetGoal: 'in_web_actions',
      event: 'Purchase',
      budget: '',
      roasTarget: '',
      roasRedline: '',
      cpaTarget: '',
      cpaRedline: '',
    }
    updateFormData('marketGroups', [...formData.marketGroups, newGroup])
  }

  const duplicateGroup = (groupToCopy) => {
    const newGroup = {
      ...JSON.parse(JSON.stringify(groupToCopy)),
      id: crypto.randomUUID()
    }
    updateFormData('marketGroups', [...formData.marketGroups, newGroup])
  }

  const removeGroup = (groupId) => {
    if (formData.marketGroups.length <= 1) return
    updateFormData('marketGroups', formData.marketGroups.filter(g => g.id !== groupId))
  }

  const addLocation = (groupId, location) => {
    const group = formData.marketGroups.find(g => g.id === groupId)
    if (!group.targetLocations.find(l => l.value === location.value)) {
      updateGroup(groupId, { targetLocations: [...group.targetLocations, location] })
    }
    setShowLocationDropdown(false)
    setSearchQuery('')
    setActiveSearchGroupId(null)
  }

  const removeLocation = (groupId, locationValue) => {
    const group = formData.marketGroups.find(g => g.id === groupId)
    updateGroup(groupId, { targetLocations: group.targetLocations.filter(l => l.value !== locationValue) })
  }

  useEffect(() => {
    const allGroupsValid = formData.marketGroups.length > 0 && formData.marketGroups.every(group => {
      const locValid = group.targetLocations.length > 0
      const platformsValid = (group.platforms || []).length > 0
      const budgetValid = !!(group.budget || group.unifiedBudget)
      const adsetGoals = getAdsetGoals(group.campaignObjective)
      const currentGoal = adsetGoals.find(g => g.value === group.adsetGoal)
      const objectiveValid = !!(group.campaignObjective && group.adsetGoal && (!currentGoal?.needsEvent || group.event))
      return locValid && platformsValid && budgetValid && objectiveValid
    })
    setValidation(prev => ({ ...prev, marketGroups: allGroupsValid }))
  }, [formData.marketGroups, setValidation])

  const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500']

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative z-10 overflow-visible animate-in fade-in duration-700">

      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-slate-900" />
          <h2 className="text-sm font-black text-slate-900">Strategy Group <span className="text-rose-500 ml-1">*</span></h2>
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
              {/* Group header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-slate-100 rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-6 rounded-full ${accentColor}`} />
                  <h3 className="text-sm font-black text-slate-900">Strategy {index + 1}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => duplicateGroup(group)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Duplicate">
                    <Copy size={14} />
                  </button>
                  {formData.marketGroups.length > 1 && (
                    <button onClick={() => removeGroup(group.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Remove">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row rounded-b-3xl border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all overflow-visible">
                {/* ===== LEFT SIDE: Group Definition ===== */}
                <div className="lg:w-[42%] bg-slate-50/30 border-r border-slate-100 p-6 flex flex-col space-y-5 overflow-visible relative z-[50]">

                  {/* 1. Ad Platforms */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Monitor size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 ">Ad Platforms</span>
                    </div>
                    <PlatformSelector group={group} updateGroup={updateGroup} />
                  </div>

                  {/* 2. Locations */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 ">Locations</span>
                    </div>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="text"
                        value={activeSearchGroupId === group.id ? searchQuery : ''}
                        onChange={(e) => { setSearchQuery(e.target.value); setActiveSearchGroupId(group.id); setShowLocationDropdown(true) }}
                        onFocus={() => { setActiveSearchGroupId(group.id); setShowLocationDropdown(true) }}
                        placeholder="Add locations..."
                        className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all ${
                          isOnboarding && !locValid ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {showLocationDropdown && activeSearchGroupId === group.id && (
                        <div className="absolute z-[100] mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-h-52 overflow-y-auto animate-in zoom-in-95 duration-200">
                          {filteredLocations.map(location => {
                            const isSelected = group.targetLocations.find(l => l.value === location.value)
                            const isUsedElsewhere = formData.marketGroups.some(g => g.id !== group.id && g.targetLocations.find(l => l.value === location.value))
                            return (
                              <button
                                key={location.value}
                                onClick={() => addLocation(group.id, location)}
                                disabled={isSelected || isUsedElsewhere}
                                className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-all flex items-center justify-between border-b border-slate-50 last:border-0 ${
                                  isSelected || isUsedElsewhere ? 'bg-slate-50/50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <p className={`text-xs font-bold ${isSelected || isUsedElsewhere ? 'text-slate-300' : 'text-slate-900'}`}>{location.label}</p>
                                  {isUsedElsewhere && <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-black">Occupied</span>}
                                </div>
                                {isSelected && <CheckCircle2 size={14} className="text-emerald-500" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.targetLocations.map((location, locIdx) => (
                        <span key={location.value || `${location}-${locIdx}`} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                          {location.label || location}
                          <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => removeLocation(group.id, location.value || location)} />
                        </span>
                      ))}
                      {!locValid && (
                        <div className="w-full py-6 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-white/50 space-y-1">
                          <Globe size={20} className="text-slate-200" />
                          <p className="text-[10px] font-bold text-slate-300">No locations added</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Device Type */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 ">Device Type</span>
                    </div>
                    <div className="flex items-center bg-slate-100/60 rounded-xl p-0.5 w-fit">
                      {OS_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updateGroup(group.id, { os: opt.id })}
                          className={`px-4 py-2 rounded-lg text-[11px] font-black tracking-wide transition-all ${
                            (group.os || 'all') === opt.id
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Promote Objective */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 ">Promote Objective</span>
                    </div>
                    <ObjectiveSelector group={group} updateGroup={updateGroup} />
                  </div>
                </div>

                {/* ===== RIGHT SIDE: Targets & Redlines ===== */}
                <div className="flex-1 p-6 flex flex-col space-y-6 relative overflow-visible">
                  {!locValid && (
                    <div className="absolute inset-0 z-10 bg-white/95 flex items-center justify-center rounded-br-3xl backdrop-blur-sm">
                      <div className="text-center space-y-2 px-8">
                        <Layers size={28} className="text-indigo-300 mx-auto" />
                        <p className="text-xs font-medium text-slate-400">Select target locations to configure targets</p>
                      </div>
                    </div>
                  )}

                  {/* Daily Budget */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-500 ">Daily Budget</span>
                    </div>
                    <UnitFollowInput
                      value={group.budget ?? group.unifiedBudget ?? ''}
                      unit="$"
                      onChange={(e) => updateGroup(group.id, { budget: e.target.value })}
                      placeholder="0.00"
                      className={`w-full pr-12 py-3 bg-slate-50 border rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-indigo-500 transition-all ${
                        isOnboarding && !(group.budget || group.unifiedBudget) ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                  </div>

                  {/* ROAS */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-500 ">ROAS</span>
                      <span className="text-[9px] font-bold text-slate-300 ml-1">Optional</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Target: ≥ */}
                      <div>
                        <span className="text-[9px] font-bold text-emerald-500 mb-1 block">Target</span>
                        <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-emerald-500 transition-all">
                          <OperatorLabel op="≥" />
                          <UnitFollowInput
                            value={group.roasTarget || ''}
                            unit="x"
                            onChange={(e) => updateGroup(group.id, { roasTarget: e.target.value })}
                            placeholder="e.g. 3.0"
                            containerClassName="flex-1"
                            className="w-full py-2.5 bg-white border-none text-sm font-black text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* Redline: ≤ */}
                      <div>
                        <span className="text-[9px] font-bold text-rose-500 mb-1 block flex items-center gap-1">
                          <ShieldAlert size={10} />
                          Redline
                        </span>
                        <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-rose-400 transition-all">
                          <OperatorLabel op="≤" />
                          <UnitFollowInput
                            value={group.roasRedline || ''}
                            unit="x"
                            onChange={(e) => updateGroup(group.id, { roasRedline: e.target.value })}
                            placeholder="e.g. 1.5"
                            containerClassName="flex-1"
                            className="w-full py-2.5 bg-white border-none text-sm font-black text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CPA */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-slate-500 ">CPA</span>
                      <span className="text-[9px] font-bold text-slate-300 ml-1">Optional</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Target: ≤ */}
                      <div>
                        <span className="text-[9px] font-bold text-emerald-500 mb-1 block">Target</span>
                        <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-emerald-500 transition-all">
                          <OperatorLabel op="≤" />
                          <UnitFollowInput
                            value={group.cpaTarget || ''}
                            unit="$"
                            onChange={(e) => updateGroup(group.id, { cpaTarget: e.target.value })}
                            placeholder="e.g. 25.00"
                            containerClassName="flex-1"
                            className="w-full py-2.5 bg-white border-none text-sm font-black text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* Redline: ≥ */}
                      <div>
                        <span className="text-[9px] font-bold text-rose-500 mb-1 block flex items-center gap-1">
                          <ShieldAlert size={10} />
                          Redline
                        </span>
                        <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-rose-400 transition-all">
                          <OperatorLabel op="≥" />
                          <UnitFollowInput
                            value={group.cpaRedline || ''}
                            unit="$"
                            onChange={(e) => updateGroup(group.id, { cpaRedline: e.target.value })}
                            placeholder="e.g. 50.00"
                            containerClassName="flex-1"
                            className="w-full py-2.5 bg-white border-none text-sm font-black text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
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
