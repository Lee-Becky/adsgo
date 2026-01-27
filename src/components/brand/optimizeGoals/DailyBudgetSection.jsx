import { useState, useEffect } from 'react'
import { DollarSign, CheckCircle2 } from 'lucide-react'

const DailyBudgetSection = ({ formData, updateFormData, updateFormDataDeep, validation, setValidation }) => {
  const [batchBudgetValue, setBatchBudgetValue] = useState('')

  const applyBatchBudget = () => {
    if (!batchBudgetValue) return
    const newSplitBudgets = {}
    formData.targetLocations.forEach(location => {
      newSplitBudgets[location.value] = batchBudgetValue
    })
    updateFormDataDeep({ splitBudgets: newSplitBudgets })
    setBatchBudgetValue('')
  }

  const updateLocationBudget = (locationValue, value) => {
    updateFormDataDeep({
      splitBudgets: { ...formData.splitBudgets, [locationValue]: value }
    })
  }

  useEffect(() => {
    let budgetValid = false
    if (formData.budgetMode === 'unified') {
      budgetValid = !!formData.unifiedBudget
    } else {
      budgetValid = formData.targetLocations.length > 0 && formData.targetLocations.every(loc => formData.splitBudgets[loc.value])
    }
    setValidation(prev => ({ ...prev, budget: budgetValid }))
  }, [formData.budgetMode, formData.unifiedBudget, formData.targetLocations, formData.splitBudgets, setValidation])

  const canShowSplitMode = formData.targetLocations.length > 0

  return (
    <div className="animate-in fade-in duration-700">
      <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <DollarSign size={20} className="text-slate-900" />
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
            <h3 className="text-sm font-bold text-slate-500">Mode</h3>
            <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200">
              <button
                onClick={() => updateFormData('budgetMode', 'unified')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  formData.budgetMode === 'unified' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'
                }`}
              >
                Unified for all locations
              </button>
              <button
                onClick={() => updateFormData('budgetMode', 'split')}
                disabled={!canShowSplitMode}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  formData.budgetMode === 'split' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'
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
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                <span className="text-sm font-bold text-slate-500 min-w-max">Batch Setting</span>
                <input
                  type="number"
                  value={batchBudgetValue}
                  onChange={(e) => setBatchBudgetValue(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                />
                <button onClick={applyBatchBudget} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-black transition-all">Apply</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {formData.targetLocations.map(loc => (
                  <div key={loc.value} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-indigo-200 transition-all">
                    <span className="text-xs font-black text-slate-900">{loc.label}</span>
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">$</span>
                      <input
                        type="number"
                        value={formData.splitBudgets[loc.value] || ''}
                        onChange={(e) => updateLocationBudget(loc.value, e.target.value)}
                        className="w-full pl-5 pr-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right focus:ring-2 focus:ring-indigo-500/20"
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

export default DailyBudgetSection
