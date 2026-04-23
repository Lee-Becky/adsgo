import { useState, useEffect, useRef } from 'react'
import { Save, CheckCircle2 } from 'lucide-react'
import {
  BudgetKPISection,
  AssetSection,
  RulesLibrarySection,
  ObjectiveOverview
} from './optimizeGoals/index'
import { useOnboardingTour } from '../onboarding/useOnboardingTour'
import OnboardingSpotlight from '../onboarding/OnboardingSpotlight'

const OptimizeGoals = ({ onGoalSave }) => {
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
        unifiedBudget: '',
        splitBudgets: {},
        kpiType: 'ROAS',
        kpiMode: 'unified',
        unifiedKPI: '',
        splitKPIs: {}
      }
    ],
    adScopeAccounts: [],
    assetLoading: false,
    optimizePreferences: [
      { text: 'If ROAS is below 1.5 in the last 3 days, then reduce budget by 50% for the adset or campaign.', type: 'Rule' }
    ]
  })

  const [validation, setValidation] = useState({
    marketGroups: false,
    assets: false
  })

  const { isActive, tourSubStep: ctxSubStep, endTour } = useOnboardingTour(1)
  const budgetKPIRef = useRef(null)
  const saveButtonRef = useRef(null)
  // pageSubStep: 0 = spotlight on BudgetKPI, null = user filling freely, 1 = spotlight on Save Goal
  const [pageSubStep, setPageSubStep] = useState(0)
  // Gate in-page spotlights: only show after user dismissed the sidebar spotlight (ctxSubStep >= 1)
  const showPageTour = isActive && ctxSubStep >= 1

  const isReadyToSave = formData.marketGroups.every(g =>
    g.unifiedBudget?.toString().trim() && g.unifiedKPI?.toString().trim()
  )

  // Reset sub-step when tour activates
  useEffect(() => {
    if (isActive) setPageSubStep(0)
  }, [isActive])

  // Auto-advance spotlight to Save Goal once fields are filled
  useEffect(() => {
    if (isActive && isReadyToSave && pageSubStep !== 1) {
      setPageSubStep(1)
    }
  }, [isActive, isReadyToSave, pageSubStep])

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const updateFormDataDeep = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    if (!isReadyToSave) return
    console.log('Saving strategy...', formData)
    if (onGoalSave) onGoalSave()
    if (isActive) endTour()
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 relative pb-24">

      <main className="flex-1 max-w-6xl mx-auto w-full px-10 py-12">
        <div className="space-y-10">

          <ObjectiveOverview formData={formData} />

          <div ref={budgetKPIRef}>
            <BudgetKPISection
              formData={formData}
              updateFormData={updateFormData}
              updateFormDataDeep={updateFormDataDeep}
              validation={validation}
              setValidation={setValidation}
              isOnboarding={isActive}
            />
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative">
            <AssetSection
              formData={formData}
              updateFormData={updateFormData}
              validation={validation}
              setValidation={setValidation}
            />
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative">
            <RulesLibrarySection
              formData={formData}
              updateFormData={updateFormData}
            />
          </div>

          <div className="pt-4">
            <p className="text-[11px] font-bold text-slate-400 text-center tracking-widest">
              All configurations are processed by AdsGo AI engine
            </p>
          </div>
        </div>
      </main>

      {/* Sticky bottom save bar */}
      <div
        className="fixed bottom-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-slate-200 px-10 py-4 flex items-center justify-between"
        style={{ left: 'var(--sidebar-w, 0px)' }}
      >
        <div className="text-xs">
          {isReadyToSave ? (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle2 size={14} />
              配置已完成，可以保存
            </span>
          ) : (
            <span className="text-slate-400">
              请先填写市场组的预算（Budget）和目标（KPI）
            </span>
          )}
        </div>
        <button
          ref={saveButtonRef}
          onClick={handleSave}
          disabled={!isReadyToSave}
          className={`px-8 py-3 rounded-2xl font-black text-xs tracking-wider flex items-center gap-2 transition-all duration-200 ${
            isReadyToSave
              ? 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-2xl shadow-slate-900/20 border border-white/10'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save size={16} />
          Save Goal
        </button>
      </div>

      {showPageTour && pageSubStep === 0 && (
        <OnboardingSpotlight
          targetRef={budgetKPIRef}
          stepLabel="2/3"
          title="设置预算与目标"
          body="填写每日预算上限和 ROAS/CPA 目标，AI 将据此决策优化投放方向"
          onSkip={endTour}
          onNext={() => setPageSubStep(null)}
          nextText="好的，开始填写"
        />
      )}
      {showPageTour && pageSubStep === 1 && (
        <OnboardingSpotlight
          targetRef={saveButtonRef}
          stepLabel="3/3"
          title="保存配置"
          body="预算和目标已填写完成！点击 Save Goal 让 AI 开始使用这些参数优化投放"
          onSkip={endTour}
          onNext={endTour}
          nextText="好的，我去保存"
        />
      )}
    </div>
  )
}

export default OptimizeGoals
