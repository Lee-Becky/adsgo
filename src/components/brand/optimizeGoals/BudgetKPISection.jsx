import { useState, useEffect, useRef } from 'react'
import { Globe, DollarSign, CheckCircle2, Search, Plus, X, Zap, Target, Trash2, Copy, LayoutGrid, PlusCircle, Settings2, Info, ArrowRight, MoreVertical, Layers } from 'lucide-react'

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

const BudgetKPISection = ({ formData, updateFormData, updateFormDataDeep, validation, setValidation }) => {
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
      let budgetValid = group.budgetMode === 'unified' ? !!group.unifiedBudget : (locValid && group.targetLocations.every(loc => group.splitBudgets[loc.value]))
      // KPI is optional now
      return locValid && budgetValid
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
          <h2 className="text-sm font-black text-slate-900">Budget & Performance KPI <span className="text-rose-500 ml-1">*</span></h2>
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
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
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
                      {group.targetLocations.map((location) => (
                        <span key={location.value} className="px-3 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm animate-in zoom-in">
                          {location.label}
                          <X size={12} className="cursor-pointer hover:text-rose-500" onClick={() => removeLocation(group.id, location.value)} />
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

                  {/* Daily Budget Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <DollarSign size={18} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">Daily Budget</h4>
                      </div>
                      <div className="inline-flex p-0.5 bg-slate-50 rounded-lg border border-slate-200">
                        <button
                          onClick={() => updateGroup(group.id, { budgetMode: 'unified' })}
                          className={`px-4 py-2 rounded-md text-[11px] font-black transition-all ${
                            group.budgetMode === 'unified' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          Same for all locations
                        </button>
                        <button
                          onClick={() => updateGroup(group.id, { budgetMode: 'split' })}
                          className={`px-4 py-2 rounded-md text-[11px] font-black transition-all ${
                            group.budgetMode === 'split' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          Split by location
                        </button>
                      </div>
                    </div>

                    {group.budgetMode === 'unified' ? (
                      <UnitFollowInput
                        value={group.unifiedBudget}
                        unit="$"
                        onChange={(e) => updateGroup(group.id, { unifiedBudget: e.target.value })}
                        placeholder="0.00"
                        className="w-full pr-12 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
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
                          <Target size={18} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">KPI</h4>
                      </div>
                      <div className="inline-flex p-0.5 bg-slate-50 rounded-lg border border-slate-200">
                        <button
                          onClick={() => updateGroup(group.id, { kpiMode: 'unified' })}
                          className={`px-4 py-2 rounded-md text-[11px] font-black transition-all ${
                            group.kpiMode === 'unified' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          Same for all locations
                        </button>
                        <button
                          onClick={() => updateGroup(group.id, { kpiMode: 'split' })}
                          className={`px-4 py-2 rounded-md text-[11px] font-black transition-all ${
                            group.kpiMode === 'split' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          Split by location
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 pl-2">
                      <span className="text-sm font-black text-slate-500">KPI Type</span>
                      <div className="flex items-center gap-8">
                        {['ROAS', 'CPA'].map(type => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer group/radio">
                            <div 
                              onClick={() => updateGroup(group.id, { kpiType: type })}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                group.kpiType === type ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white group-hover/radio:border-indigo-400'
                              }`}
                            >
                              {group.kpiType === type && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-200" />}
                            </div>
                            <span className={`text-sm font-black transition-colors ${group.kpiType === type ? 'text-slate-900' : 'text-slate-400'}`}>
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {group.kpiMode === 'unified' ? (
                      <UnitFollowInput
                        value={group.unifiedKPI}
                        unit={group.kpiType === 'ROAS' ? 'x' : '$'}
                        onChange={(e) => updateGroup(group.id, { unifiedKPI: e.target.value })}
                        placeholder={`Target ${group.kpiType}`}
                        className="w-full pr-12 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    ) : (
                      <div className="space-y-2">
                         <div className="flex gap-2 p-1 bg-emerald-50/50 rounded-xl">
                          <UnitFollowInput
                            value={batchSettings[group.id]?.kpi || ''}
                            unit={group.kpiType === 'ROAS' ? 'x' : '$'}
                            onChange={(e) => setBatchSettings(prev => ({ ...prev, [group.id]: { ...prev[group.id], kpi: e.target.value } }))}
                            placeholder="Batch set..."
                            containerClassName="flex-1"
                            className="w-full py-2 bg-white border-none rounded-lg text-sm font-bold focus:outline-none"
                          />
                          <button onClick={() => applyBatchKPI(group.id)} className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg text-[11px] font-black hover:bg-indigo-50 transition-all">
                            Apply
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <button 
          onClick={addGroup}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-2.5 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-[0.99] group"
        >
          <PlusCircle size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-black tracking-tight">Add another strategy group</span>
        </button>
      </div>
    </div>
  )
}

export default BudgetKPISection
