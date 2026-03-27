import React from 'react'
import { Rocket, Target, Sparkles, ArrowRight, Radio, TrendingUp, BarChart3, Layers } from 'lucide-react'

const SETUP_STEPS = [
  {
    step: 1,
    icon: Target,
    title: 'Set up your goals & budget',
    description: 'Define your KPI targets and daily budget so AI knows what to optimize for.',
    targetPage: 'optimizeGoals',
    buttonLabel: 'Set Up Goals',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    step: 2,
    icon: Sparkles,
    title: 'Create & publish your first campaign',
    description: 'AI will generate ads based on your brand, products, and goals.',
    targetPage: 'batchGenerateAds',
    buttonLabel: 'Create Campaign',
    color: 'bg-primary-50 text-primary-600',
  },
]

const AFTER_PUBLISH = [
  { icon: Radio, text: 'Sync performance data every hour' },
  { icon: Layers, text: 'Test audience and creative combinations' },
  { icon: TrendingUp, text: 'Optimize budgets automatically' },
  { icon: BarChart3, text: 'Generate new campaign recommendations' },
]

export default function PrePublishHome({ onPageChange }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Welcome header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-7 h-7 text-primary-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome to AdsGo</h1>
            <p className="text-sm text-gray-500">Let's get your ads running.</p>
          </div>

          {/* Setup steps */}
          <div className="max-w-lg mx-auto space-y-3 mb-8">
            {SETUP_STEPS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="bg-gray-50/80 rounded-xl border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Step {item.step}</span>
                      <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 ml-11">{item.description}</p>
                  <div className="ml-11">
                    <button
                      onClick={() => onPageChange(item.targetPage)}
                      className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5 transition-colors"
                    >
                      {item.buttonLabel}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* After you publish */}
          <div className="border-t border-dashed border-gray-200 pt-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">
              After you publish, AdsGo will
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {AFTER_PUBLISH.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
