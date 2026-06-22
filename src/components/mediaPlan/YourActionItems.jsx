import React, { useMemo } from 'react'
import { DollarSign, Layers, Sparkles, TrendingUp, ArrowRight, CheckCircle, Lightbulb, Upload, Wand2, Wallet } from 'lucide-react'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'

const ICON_MAP = { DollarSign, Layers, Sparkles, TrendingUp, Wallet }

const PRIORITY_STYLES = {
  high: 'border-l-amber-500',
  medium: 'border-l-info-400',
  low: 'border-l-neutral-300',
}

function generateActions({
  autoExecuteRecommendations,
  autoRegenEnabled,
  pendingBudgetCount,
  budgetSummaryText,
  draftCampaignCount,
  daysSinceLastCreative,
  kpiAchievement,
  kpiType,
  currentKPI,
  kpiTarget,
  spendPercent,
  activeCreativeCount,
}) {
  const actions = []

  // ── 条件 1: 有待处理预算建议 且 auto-apply 关闭 ──
  if (pendingBudgetCount > 0 && !autoExecuteRecommendations) {
    actions.push({
      id: 'budget_review',
      priority: 'high',
      icon: 'DollarSign',
      title: `Review ${pendingBudgetCount} budget suggestions`,
      description: budgetSummaryText,
      targetPage: 'adManagerV3',
      autoGuideText: 'Enable auto-apply to let AI handle budget adjustments',
      autoGuideKey: 'autoExecuteRecommendations',
    })
  }

  // ── 条件 2: 有推荐 campaign 且 auto-publish 关闭 ──
  if (draftCampaignCount > 0 && !autoRegenEnabled) {
    actions.push({
      id: 'campaign_review',
      priority: 'high',
      icon: 'Layers',
      title: `Review ${draftCampaignCount} recommended campaigns`,
      description: 'AI-generated campaigns ready for your review',
      targetPage: 'autoRegeneration',
      autoGuideText: 'Enable auto-publish to let AI launch recommended campaigns',
      autoGuideKey: 'autoRegenEnabled',
    })
  }

  // ── 条件 3: 超过 7 天没有新创意 ──
  if (daysSinceLastCreative >= 7) {
    actions.push({
      id: 'creative_refresh',
      priority: 'medium',
      icon: 'Sparkles',
      title: 'Consider refreshing creatives',
      description: `No new creatives in ${daysSinceLastCreative} days. AI can generate branded creatives matching your brand colors, product features, and tone — typically 5 ads in ~4 minutes.`,
      targetPage: 'aiGenerate',
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  // ── 条件 4: KPI 接近目标 → 建议调整 ──
  if (kpiAchievement >= 0.9 && kpiTarget > 0) {
    const kpiFormatted = kpiType === 'ROAS' ? `${currentKPI.toFixed(1)}x` : `$${currentKPI.toFixed(0)}`
    const targetFormatted = kpiType === 'ROAS' ? `${kpiTarget}x` : `$${kpiTarget}`
    const direction = kpiType === 'ROAS' ? 'raising' : 'lowering'

    actions.push({
      id: 'kpi_review',
      priority: 'low',
      icon: 'TrendingUp',
      title: 'Review KPI targets',
      description: `Current ${kpiType} ${kpiFormatted} is approaching your ${targetFormatted} target — consider ${direction} it`,
      targetPage: 'optimizeGoals',
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  // ── 条件 5: 预算利用率高 → 建议增加 daily budget ──
  if (spendPercent >= 0.85) {
    actions.push({
      id: 'increase_budget',
      priority: 'medium',
      icon: 'Wallet',
      title: 'Increase brand daily budget',
      description: `Current spend is at ${Math.round(spendPercent * 100)}% of daily budget. Increasing the budget gives AI more room to scale winning campaigns and test new audiences.`,
      targetPage: 'optimizeGoals',
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  // ── 条件 6: 可测试素材不足 → 建议上传或 AIGC ──
  if (activeCreativeCount < 15) {
    actions.push({
      id: 'more_creatives',
      priority: 'medium',
      icon: 'Sparkles',
      title: 'Provide more creatives for testing',
      description: `Only ${activeCreativeCount} active creatives. More creative variants help the AI find winning combinations faster — upload your own or let AI generate them.`,
      buttons: [
        { label: 'Upload', icon: 'Upload', targetPage: 'creativeLibrary' },
        { label: 'AIGC', icon: 'Wand2', targetPage: 'aiGenerate' },
      ],
      autoGuideText: null,
      autoGuideKey: null,
    })
  }

  return actions
}

export default function YourActionItems({
  autoExecuteRecommendations,
  autoRegenEnabled,
  onAutoExecuteChange,
  onAutoRegenChange,
  pendingBudgetCount,
  budgetSummaryText,
  draftCampaignCount,
  daysSinceLastCreative,
  kpiAchievement,
  kpiType,
  currentKPI,
  kpiTarget,
  spendPercent,
  activeCreativeCount,
  onPageChange,
}) {
  const actions = useMemo(() => generateActions({
    autoExecuteRecommendations,
    autoRegenEnabled,
    pendingBudgetCount,
    budgetSummaryText,
    draftCampaignCount,
    daysSinceLastCreative,
    kpiAchievement,
    kpiType,
    currentKPI,
    kpiTarget,
    spendPercent,
    activeCreativeCount,
  }), [
    autoExecuteRecommendations, autoRegenEnabled, pendingBudgetCount,
    budgetSummaryText, draftCampaignCount, daysSinceLastCreative,
    kpiAchievement, kpiType, currentKPI, kpiTarget,
    spendPercent, activeCreativeCount,
  ])

  const handleAutoEnable = (key) => {
    if (key === 'autoExecuteRecommendations') onAutoExecuteChange(true)
    else if (key === 'autoRegenEnabled') onAutoRegenChange(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-neutral-900">Your Actions</h4>
        <DevGuideButton title="Your Actions" content={DEV_GUIDES.yourActions} />
      </div>

      {actions.length === 0 ? (
        <div className="bg-success-50/60 rounded-lg px-5 py-8 text-center">
          <CheckCircle className="w-8 h-8 text-success-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-success-700">All caught up</p>
          <p className="text-xs text-success-600 mt-0.5">AdsGo is handling everything.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {actions.map((action) => {
            const Icon = ICON_MAP[action.icon]
            return (
              <div
                key={action.id}
                className={`bg-white rounded-lg border border-neutral-200 border-l-4 ${PRIORITY_STYLES[action.priority]} overflow-hidden`}
              >
                <div className="px-4 py-3">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-neutral-800 truncate">{action.title}</span>
                    </div>
                    {action.buttons ? (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {action.buttons.map((btn) => {
                          const BtnIcon = btn.icon === 'Upload' ? Upload : Wand2
                          return (
                            <button
                              key={btn.label}
                              onClick={() => onPageChange(btn.targetPage)}
                              className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5 transition-colors"
                            >
                              <BtnIcon className="w-3 h-3" />
                              {btn.label}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <button
                        onClick={() => onPageChange(action.targetPage)}
                        className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5 flex-shrink-0 transition-colors"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{action.description}</p>

                  {/* Auto guide */}
                  {action.autoGuideText && (
                    <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex items-center gap-2">
                      <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span className="text-[11px] text-neutral-500 flex-1">{action.autoGuideText}</span>
                      <button
                        onClick={() => handleAutoEnable(action.autoGuideKey)}
                        className="text-[11px] font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5 flex-shrink-0 transition-colors"
                      >
                        Enable
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
