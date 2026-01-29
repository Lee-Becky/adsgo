import { useState, useEffect } from 'react'
import { Globe, DollarSign, CheckCircle2, Search, Plus, X, Zap, Target, Trash2, Copy, LayoutGrid, PlusCircle, Settings2, Info, ArrowRight, MoreVertical, Layers } from 'lucide-react'

const BudgetKPISection = ({ formData, updateFormData, updateFormDataDeep, validation, setValidation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchGroupId, setActiveSearchGroupId] = useState(null)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [batchSettings, setBatchSettings] = useState({}) 

  const availableLocations = [
    { value: 'us', label: 'United States', region: 'North America' },
    { value: 'ca', label: 'Canada', region: 'North America' },
    { value: 'uk', label: 'United Kingdom', region: 'Europe' },
    { value: 'de', label: 'Germany', region: 'Europe' },
    { value: 'fr', label: 'France', region: 'Europe' },
    { value: 'au', label: 'Australia', region: 'Oceania' },
    { value: 'jp', label: 'Japan', region: 'Asia' },
    { value: 'kr', label: 'South Korea', region: 'Asia' },
    { value: 'sg', label: 'Singapore', region: 'Asia' },
    { value: 'cn', label: 'China', region: 'Asia' },
    { value: 'in', label: 'India', region: 'Asia' },
    { value: 'br', label: 'Brazil', region: 'South America' },
    { value: 'mx', label: 'Mexico', region: 'North America' },
    { value: 'ae', label: 'United Arab Emirates', region: 'Middle East' }
  ]

  const filteredLocations = availableLocations.filter(loc => 
    loc.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchQuery.toLowerCase())
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
      let kpiValid = group.kpiMode === 'unified' ? !!group.unifiedKPI : (locValid && group.targetLocations.every(loc => group.splitKPIs[loc.value]))
      return locValid && budgetValid && kpiValid
    })
    setValidation(prev => ({ ...prev, marketGroups: allGroupsValid }))
  }, [formData.marketGroups, setValidation])

  const colors = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500'
  ]

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative z-10 overflow-hidden animate-in fade-in duration-700">
      
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-slate-900" />
          <h2 className="text-sm font-black text-slate-900">Budget & Performance KPI</h2>
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
            <div key={group.id} className={`relative rounded-3xl border border-slate-100 transition-all ${index > 0 ? 'mt-10' : ''}`}>
              <div className="flex flex-col lg:flex-row overflow-hidden rounded-[28px] border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all h-auto">
                
                <div className="lg:w-[35%] bg-slate-50/30 border-r border-slate-100 p-6 flex flex-col h-auto">
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
                        <div className="absolute z-[110] mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in zoom-in-95 duration-200">
                          {filteredLocations.map((location) => {
                            const isSelected = group.targetLocations.find(l => l.value === location.value)
                            const isUsedElsewhere = formData.marketGroups.some(g => g.id !== group.id && g.targetLocations.find(l => l.value === location.value))
                            return (
                              <button
                                key={location.value}
                                onClick={() => addLocation(group.id, location)}
                                disabled={isSelected || isUsedElsewhere}
                                className={`w-full p-3.5 text-left hover:bg-slate-50 transition-all flex items-center justify-between border-b border-slate-50 last:border-0 ${
                                  isSelected || isUsedElsewhere ? 'bg-slate-50/50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div>
                                  <p className={`text-sm font-bold ${isSelected || isUsedElsewhere ? 'text-slate-300' : 'text-slate-900'}`}>{location.label}</p>
                                  <p className="text-[11px] text-slate-400">{location.region}</p>
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

                <div className="flex-1 p-8 flex flex-col space-y-10 relative h-auto">
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

                  <div className="space-y-5">
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
                            group.budgetMode === 'unified' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          Same for all locations
                        </button>
                        <button
                          onClick={() => updateGroup(group.id, { budgetMode: 'split' })}
                          className={`px-4 py-2 rounded-md text-[11px] font-black transition-all ${
                            group.budgetMode === 'split' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          Split by location
                        </button>
                      </div>
                    </div>

                    {group.budgetMode === 'unified' ? (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg font-black">$</span>
                        <input
                          type="number"
                          value={group.unifiedBudget}
                          onChange={(e) => updateGroup(group.id, { unifiedBudget: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-9 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                         <div className="flex gap-2 p-2 bg-indigo-50/50 rounded-xl">
                          <input
                            type="number"
                            value={batchSettings[group.id]?.budget || ''}
                            onChange={(e) => setBatchSettings(prev => ({ ...prev, [group.id]: { ...prev[group.id], budget: e.target.value } }))}
                            placeholder="Batch set..."
                            className="flex-1 px-4 py-2 bg-white border-none rounded-lg text-sm font-bold focus:outline-none"
                          />
                          <button onClick={() => applyBatchBudget(group.id)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-black hover:bg-black">
                            Apply
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {group.targetLocations.map(loc => (
                            <div key={loc.value} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-600 truncate mr-1">{loc.label}</span>
                              <div className="relative w-20">
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-300">$</span>
                                <input
                                  type="number"
                                  value={group.splitBudgets[loc.value] || ''}
                                  onChange={(e) => updateGroup(group.id, { splitBudgets: { ...group.splitBudgets, [loc.value]: e.target.value } })}
                                  className="w-full pl-5 pr-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-right"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
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
                            group.kpiMode === 'unified' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          Same for all locations
                        </button>
                        <button
                          onClick={() => updateGroup(group.id, { kpiMode: 'split' })}
                          className={`px-4 py-2 rounded-md text-[11px] font-black transition-all ${
                            group.kpiMode === 'split' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
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
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg font-black">
                          {group.kpiType === 'ROAS' ? '%' : '$'}
                        </span>
                        <input
                          type="number"
                          value={group.unifiedKPI}
                          onChange={(e) => updateGroup(group.id, { unifiedKPI: e.target.value })}
                          placeholder={`Target ${group.kpiType}`}
                          className="w-full pl-9 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                         <div className="flex gap-2 p-1.5 bg-emerald-50/50 rounded-xl">
                          <input
                            type="number"
                            value={batchSettings[group.id]?.kpi || ''}
                            onChange={(e) => setBatchSettings(prev => ({ ...prev, [group.id]: { ...prev[group.id], kpi: e.target.value } }))}
                            placeholder="Batch set..."
                            className="flex-1 px-4 py-2 bg-white border-none rounded-lg text-sm font-bold focus:outline-none"
                          />
                          <button onClick={() => applyBatchKPI(group.id)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-black hover:bg-black">
                            Apply
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {group.targetLocations.map(loc => (
                            <div key={loc.value} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-600 truncate mr-1">{loc.label}</span>
                              <div className="relative w-20">
                                 <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-300">
                                  {group.kpiType === 'ROAS' ? '%' : '$'}
                                 </span>
                                <input
                                  type="number"
                                  value={group.splitKPIs[loc.value] || ''}
                                  onChange={(e) => updateGroup(group.id, { splitKPIs: { ...group.splitKPIs, [loc.value]: e.target.value } })}
                                  className="w-full pl-5 pr-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-right"
                                />
                              </div>
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
          className="w-full py-5 border-none rounded-2xl flex items-center justify-center gap-2.5 bg-slate-900 text-white hover:bg-black transition-all active:scale-[0.99] group shadow-xl shadow-slate-200"
        >
          <PlusCircle size={20} className="text-white/80 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-black tracking-tight">Add another strategy group</span>
        </button>
      </div>
    </div>
  )
}

export default BudgetKPISection
