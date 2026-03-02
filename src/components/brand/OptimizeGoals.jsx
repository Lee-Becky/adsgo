import { useState } from 'react'
import { Save } from 'lucide-react'
import { 
  BudgetKPISection, 
  AssetSection, 
  RulesLibrarySection,
  ObjectiveOverview 
} from './optimizeGoals/index'

const OptimizeGoals = () => {
  const [formData, setFormData] = useState({
    marketGroups: [
      {
        id: crypto.randomUUID(),
        targetLocations: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' }
        ],
        platforms: ['meta', 'google'],
        campaignObjective: 'sales_conversions',
        adsetGoal: 'in_web_actions',
        event: 'Purchase',
        budgetMode: 'unified',
        unifiedBudget: '500',
        splitBudgets: {},
        kpiType: 'ROAS',
        kpiMode: 'unified',
        unifiedKPI: '3.5',
        splitKPIs: {}
      }
    ],
    adScopeAccounts: [],
    assetLoading: false,
    optimizePreferences: []
  })

  const [validation, setValidation] = useState({
    marketGroups: false,
    assets: false
  })

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const updateFormDataDeep = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    console.log('Saving strategy...', formData)
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 relative">
      
      {/* Action Bar Container - Sticky with blur to prevent content overlap */}
      <div className="sticky top-0 z-10 w-full flex justify-end px-10 py-4 pointer-events-none">
        <button 
          onClick={handleSave}
          className="pointer-events-auto bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs tracking-wider hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center gap-2 border border-white/10"
        >
          <Save size={16} />
          Save Goal
        </button>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-10 py-12">
        <div className="space-y-10">
          
          <ObjectiveOverview formData={formData} />

          {/* Section 2: Market Strategy Groups (Directly listed without heavy container) */}
          <BudgetKPISection 
            formData={formData}
            updateFormData={updateFormData}
            updateFormDataDeep={updateFormDataDeep}
            validation={validation}
            setValidation={setValidation}
          />

          {/* Section 5: Asset Scope */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative">
            <AssetSection 
              formData={formData}
              updateFormData={updateFormData}
              validation={validation}
              setValidation={setValidation}
            />
          </div>

          {/* Section 6: Rules Library */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative">
            <RulesLibrarySection 
              formData={formData}
              updateFormData={updateFormData}
            />
          </div>

          <div className="pt-8 pb-20">
            <p className="text-[11px] font-bold text-slate-400 text-center tracking-widest">
              All configurations are processed by AdsGo AI engine
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OptimizeGoals
