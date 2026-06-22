import React from 'react'
import { Rocket, ArrowRight, Radio, Sparkles, BarChart3, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    icon: Radio,
    text: 'Ads go live on Meta / Google within hours',
    color: 'text-blue-500',
  },
  {
    icon: Sparkles,
    text: 'AdsGo starts syncing performance data every hour',
    color: 'text-amber-500',
  },
  {
    icon: TrendingUp,
    text: 'AI optimizes budgets, pauses losers, scales winners',
    color: 'text-emerald-500',
  },
  {
    icon: BarChart3,
    text: 'Your dashboard populates with real-time insights',
    color: 'text-primary-500',
  },
]

export default function PrePublishView({ onPageChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] py-16 flex items-center justify-center">
      <div className="text-center max-w-lg px-6">
        {/* Hero icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <Rocket className="w-8 h-8 text-primary-500" />
        </div>

        <h2 className="text-xl font-bold text-neutral-900 mb-2">Launch your first campaign</h2>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          Your Media Plan will come to life once your ads are running.
          Create and publish a campaign — AdsGo will take it from there.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => onPageChange('batchGenerateAds')}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all inline-flex items-center gap-1.5"
        >
          Create Your First Campaign
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="my-8 border-t border-dashed border-neutral-200" />

        {/* What happens after */}
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          What happens after you publish
        </h3>
        <div className="space-y-3 text-left max-w-sm mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                </div>
                <span className="text-xs text-neutral-600 leading-relaxed">{step.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
