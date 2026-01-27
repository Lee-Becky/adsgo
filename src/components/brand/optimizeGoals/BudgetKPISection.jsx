import { useState, useEffect } from 'react'
import { DollarSign, CheckCircle2 } from 'lucide-react'

const BudgetKPISection = ({ formData, updateFormData, updateFormDataDeep, validation, setValidation }) => {
  const [batchBudgetValue, setBatchBudgetValue] = useState('')
  const [batchKPIValue, setBatchKPIValue] = useState('')

  const applyBatchBudget = () => {
    if (!batchBudgetValue) return
    const newSplitBudgets = {}
    formData.targetLocations.forEach(location => {
      newSplitBudgets[location.value] = batchBudgetValue
    })
    updateFormDataDeep({ splitBudgets: newSplitBudgets })
    setBatchBudgetValue('')
  }

  const applyBatchKPI = () => {
    if (!batchKPIValue) return
    const newSplitKPIs = {}
    formData.targetLocations.forEach(location => {
      newSplitKPIs[location.value] = batchKPIValue
    })
    updateFormDataDeep({ splitKPIs: newSplitKPIs })
    setBatchKPIValue('')
  }

  const updateLocationBudget = (locationValue, value) => {
    updateFormDataDeep({
      splitBudgets: { ...formData.splitBudgets, [locationValue]: value }
    })
  }

  const updateLocationKPI = (locationValue, value) => {
    updateFormDataDeep({
      splitKPIs: { ...formData.splitKPIs, [locationValue]: value }
    })
  }

  useEffect(() => {
    let budgetValid = false
    let kpiValid = false

    if (formData.budgetMode === 'unified') {
      budgetValid = !!formData.unifiedBudget
    } else {
      budgetValid = formData.targetLocations.length > 0 && formData.targetLocations.every(loc => formData.splitBudgets[loc.value])
    }

    if (formData.kpiMode === 'unified') {
      kpiValid = !!formData.unifiedKPI
    } else {
      kpiValid = formData.targetLocations.length > 0 && formData.targetLocations.every(loc => formData.splitKPIs[loc.value])
    }

    setValidation(prev => ({ ...prev, budget: budgetValid, kpi: kpiValid }))
  }, [formData, setValidation])

  const canShowSplitMode = formData.targetLocations.length > 0

  return (
    <div className="animate-in fade-in duration-700">
      {/* Daily Budget Section */}
      <header className="px-10 py-6 bg-emerald-50/50 border-b border-emerald-100/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign size={20} className="text-emerald-600" />
          <h2 className="text-sm font-black text-slate-900">Daily Budget</h2>
        </div>
        {validation.budget && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-10 space-y-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-400">Mode</h3>
            <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button
                onClick={() => updateFormData('budgetMode', 'unified')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  formData.budgetMode === 'unified' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                }`}
              >
                Unified for all locations
              </button>
              <button
                onClick={() => updateFormData('budgetMode', 'split')}
                disabled={!canShowSplitMode}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  formData.budgetMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                } ${!canShowSplitMode ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                Split by selected locations
              </button>
            </div>
          </div>

          {formData.budgetMode === 'unified' ? (
            <div className="relative group max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</span>
              <input
                type="number"
                value={formData.unifiedBudget}
                onChange={(e) => updateFormData('unifiedBudget', e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                <span className="text-[10px] font-bold text-slate-500 min-w-max">Batch Setting</span>
                <input
                  type="number"
                  value={batchBudgetValue}
                  onChange={(e) => setBatchBudgetValue(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold focus:outline-none"
                />
                <button onClick={applyBatchBudget} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black hover:bg-emerald-700 transition-all">Apply</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {formData.targetLocations.map(loc => (
                  <div key={loc.value} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{loc.label}</span>
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">$</span>
                      <input
                        type="number"
                        value={formData.splitBudgets[loc.value] || ''}
                        onChange={(e) => updateLocationBudget(loc.value, e.target.value)}
                        className="w-full pl-5 pr-2 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold text-right focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance KPI Section */}
      <header className="px-10 py-6 bg-indigo-50/50 border-y border-indigo-100/50 flex items-center justify-between mt-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center text-indigo-600">
            <CheckCircle2 size={20} />
          </div>
          <h2 className="text-sm font-black text-slate-900">Performance KPI</h2>
        </div>
        {validation.kpi && (
          <div className="text-emerald-500 animate-in zoom-in duration-500">
            <CheckCircle2 size={24} />
          </div>
        )}
      </header>

      <div className="p-10 space-y-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-bold text-slate-400">KPI Type</h3>
              <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                {['ROAS', 'CPA'].map(type => (
                  <button
                    key={type}
                    onClick={() => updateFormData('kpiType', type)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                      formData.kpiType === type ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-bold text-slate-400">Mode</h3>
              <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                <button
                  onClick={() => updateFormData('kpiMode', 'unified')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    formData.kpiMode === 'unified' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Unified for all locations
                </button>
                <button
                  onClick={() => updateFormData('kpiMode', 'split')}
                  disabled={!canShowSplitMode}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    formData.kpiMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                  } ${!canShowSplitMode ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  Split by selected locations
                </button>
              </div>
            </div>
          </div>

          {formData.kpiMode === 'unified' ? (
            <div className="space-y-4 max-w-md">
              <span className="text-[10px] font-bold text-slate-400 px-1">Target KPI</span>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">
                  {formData.kpiType === 'ROAS' ? '%' : '$'}
                </span>
                <input
                  type="number"
                  value={formData.unifiedKPI}
                  onChange={(e) => updateFormData('unifiedKPI', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                <span className="text-[10px] font-bold text-slate-500 min-w-max">Batch Setting</span>
                <input
                  type="number"
                  value={batchKPIValue}
                  onChange={(e) => setBatchKPIValue(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold focus:outline-none"
                />
                <button onClick={applyBatchKPI} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-all">Apply</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {formData.targetLocations.map(loc => (
                  <div key={loc.value} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{loc.label}</span>
                    <div className="relative w-24 text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase mr-1">{formData.kpiType}</span>
                      <input
                        type="number"
                        value={formData.splitKPIs[loc.value] || ''}
                        onChange={(e) => updateLocationKPI(loc.value, e.target.value)}
                        className="w-16 px-2 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold text-right focus:ring-2 focus:ring-indigo-500/20"
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
  )
}

export default BudgetKPISection
