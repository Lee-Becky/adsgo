import React from 'react'
import { Target, ArrowRight, Check, Sparkles } from 'lucide-react'

export default function OptimizeGoalsSpotlight({ goalConfigured, onPageChange }) {
  if (goalConfigured) {
    return (
      <div className="bg-emerald-50/60 rounded-xl border border-emerald-200/50 px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Check className="w-4.5 h-4.5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-emerald-800">优化目标已配置</h4>
          <p className="text-xs text-emerald-600 mt-0.5">AI 正在基于你的 KPI 目标和预算自动优化投放</p>
        </div>
        <button
          onClick={() => onPageChange('optimizeGoals')}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 flex-shrink-0 transition-colors"
        >
          查看
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-5 shadow-lg shadow-indigo-500/20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
          <Target className="w-5.5 h-5.5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-white">配置你的优化目标</h4>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              推荐
            </span>
          </div>
          <p className="text-xs text-indigo-100/80 leading-relaxed mb-3">
            设定 KPI 目标和每日预算上限，让 AI 知道你的投放方向。这是所有自动优化功能的基础。
          </p>
          <button
            onClick={() => onPageChange('optimizeGoals')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
          >
            去配置目标
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
