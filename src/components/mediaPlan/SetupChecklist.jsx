import React from 'react'
import { DollarSign, Layers, Upload, Target, CheckCircle, ArrowRight } from 'lucide-react'

const CHECKLIST_ITEMS = [
  {
    id: 'auto_budget',
    icon: DollarSign,
    title: 'Enable AI Budget Optimization',
    description: 'Let AI automatically adjust budgets 24/7 for best results.',
    enabledTitle: 'AI Budget Optimization',
    enabledDescription: 'AI is now managing budgets automatically.',
    type: 'toggle',
    autoKey: 'autoExecuteRecommendations',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'auto_publish',
    icon: Layers,
    title: 'Enable Auto Campaign Publish',
    description: 'Let AI launch recommended campaigns when ready.',
    enabledTitle: 'Auto Campaign Publish',
    enabledDescription: 'AI will auto-publish recommended campaigns.',
    type: 'toggle',
    autoKey: 'autoRegenEnabled',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'upload_creatives',
    icon: Upload,
    title: 'Upload More Creatives',
    description: 'More creative variants help AI find winning combinations faster.',
    type: 'navigate',
    targetPage: 'creativeLibrary',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'review_goals',
    icon: Target,
    title: 'Review Goals & Budget',
    description: 'Make sure your KPI targets and daily budget are set correctly.',
    type: 'navigate',
    targetPage: 'optimizeGoals',
    color: 'bg-emerald-100 text-emerald-600',
  },
]

export default function SetupChecklist({
  autoExecuteRecommendations,
  autoRegenEnabled,
  onAutoExecuteChange,
  onAutoRegenChange,
  onPageChange,
}) {
  const getToggleState = (key) => {
    if (key === 'autoExecuteRecommendations') return autoExecuteRecommendations
    if (key === 'autoRegenEnabled') return autoRegenEnabled
    return false
  }

  const handleToggle = (key) => {
    if (key === 'autoExecuteRecommendations') onAutoExecuteChange(true)
    else if (key === 'autoRegenEnabled') onAutoRegenChange(true)
  }

  const completedCount = CHECKLIST_ITEMS.filter(
    (item) => item.type === 'toggle' && getToggleState(item.autoKey)
  ).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">Complete Your Setup</h4>
        <span className="text-[10px] text-gray-400 font-medium">
          {completedCount}/{CHECKLIST_ITEMS.filter(i => i.type === 'toggle').length} enabled
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHECKLIST_ITEMS.map((item) => {
          const Icon = item.icon
          const isEnabled = item.type === 'toggle' && getToggleState(item.autoKey)

          if (isEnabled) {
            return (
              <div
                key={item.id}
                className="bg-emerald-50/60 rounded-lg border border-emerald-200/50 p-4"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-emerald-700">{item.enabledTitle}</span>
                </div>
                <p className="text-xs text-emerald-600 leading-relaxed">{item.enabledDescription}</p>
              </div>
            )
          }

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-md ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-gray-800">{item.title}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.description}</p>
              <button
                onClick={() => {
                  if (item.type === 'toggle') handleToggle(item.autoKey)
                  else onPageChange(item.targetPage)
                }}
                className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5 transition-colors"
              >
                {item.type === 'toggle' ? 'Enable' : 'Go'}
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
