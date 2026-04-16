import React, { useState, useEffect, useMemo } from 'react'
import { CalendarDays, ClipboardCheck, Lightbulb } from 'lucide-react'
import { MOCK_CAMPAIGNS } from '../adManagerV3/mockData'
import { CAMPAIGN_CARDS } from '../autoRegeneration/mockData'
import { STATUS_BAR_DATA, KPI_TREND_DATA, SPEND_DATA, WEEKLY_PLANS, DIMENSION_SCORES, CAMPAIGN_PHASE_DATA, HIGHLIGHTS_DATA, OPERATIONS_DATA } from './mockData'
import { getPhase, buildKPITrend } from './StatusBar'
import SummaryCard from './SummaryCard'
import WeeklyPlanCard from './WeeklyPlanCard'
import ScoreCard from './ScoreCard'
import AdsGoOperations, { aggregateBudgetSuggestions, formatBudgetSummary } from './AdsGoOperations'
import HighlightsCard from './HighlightsCard'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'
import DemoPhaseSwitch from './DemoPhaseSwitch'
import PrePublishView from './PrePublishView'
import JustLaunchedView from './JustLaunchedView'
import DormantView from './DormantView'


export default function MediaPlan({
  selectedBrand,
  onPageChange,
  autoExecuteRecommendations,
  onAutoExecuteChange,
  autoRegenEnabled,
  onAutoRegenChange,
  publishedAt,
  goalConfigured,
}) {
  const { kpiType, kpiTarget, dailyBudget } = STATUS_BAR_DATA
  const campaigns = MOCK_CAMPAIGNS

  const computed = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active')

    const todaySpend = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.spend, 0)
    const cappedSpend = Math.min(todaySpend, dailyBudget)

    let currentKPI = 0
    if (kpiType === 'ROAS') {
      const totalRevenue = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.revenue, 0)
      const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.spend, 0)
      currentKPI = totalSpend > 0 ? totalRevenue / totalSpend : 0
    } else {
      const totalConversions = activeCampaigns.reduce((sum, c) => {
        if (c.objective === 'Purchase') return sum + c.todayMetrics.purchases
        if (c.objective === 'Traffic') return sum + c.todayMetrics.clicks
        return sum + c.todayMetrics.event1s
      }, 0)
      const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.todayMetrics.spend, 0)
      currentKPI = totalConversions > 0 ? totalSpend / totalConversions : 0
    }

    const kpiAchievement = kpiType === 'ROAS'
      ? (kpiTarget > 0 ? currentKPI / kpiTarget : 0)
      : (currentKPI > 0 ? kpiTarget / currentKPI : 0)

    const phase = getPhase(kpiAchievement)
    const kpiTrend = buildKPITrend(activeCampaigns, kpiType)

    const budgetCounts = aggregateBudgetSuggestions(campaigns)
    const pendingBudgetCount = budgetCounts.increase + budgetCounts.decrease + budgetCounts.pause
    const budgetSummaryText = formatBudgetSummary(budgetCounts)

    const daysSinceLastCreative = Math.floor(
      (Date.now() - new Date(OPERATIONS_DATA.lastCreativeGenTime).getTime()) / (1000 * 60 * 60 * 24)
    )

    const draftCampaignCount = CAMPAIGN_CARDS.length
    const spendPercent = dailyBudget > 0 ? cappedSpend / dailyBudget : 0
    const activeCreativeCount = OPERATIONS_DATA.activeCreativeCount

    return {
      activeCampaigns,
      currentKPI,
      kpiAchievement,
      phase,
      kpiTrend,
      cappedSpend,
      pendingBudgetCount,
      budgetSummaryText,
      daysSinceLastCreative,
      draftCampaignCount,
      spendPercent,
      activeCreativeCount,
    }
  }, [campaigns, kpiType, kpiTarget, dailyBudget])

  const [demoPhase, setDemoPhase] = useState('new_user')

  // 数据驱动自动切换：publishedAt 被设置时从 new_user 自动推进到 just_launched
  useEffect(() => {
    if (publishedAt) {
      setDemoPhase(prev => prev === 'new_user' ? 'just_launched' : prev)
    }
  }, [publishedAt])

  // ── Pre-publish State ──
  if (demoPhase === 'new_user') {
    return (
      <div className="p-6">
        <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        <PrePublishView onPageChange={onPageChange} />
      </div>
    )
  }

  // ── Just Launched State (within 24h) ──
  if (demoPhase === 'just_launched') {
    const setupAllDone = goalConfigured && autoExecuteRecommendations && autoRegenEnabled
    return (
      <div className="p-6">
        <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        <JustLaunchedView
          autoExecuteRecommendations={autoExecuteRecommendations}
          autoRegenEnabled={autoRegenEnabled}
          onAutoExecuteChange={onAutoExecuteChange}
          onAutoRegenChange={onAutoRegenChange}
          onPageChange={onPageChange}
          goalConfigured={goalConfigured}
          setupAllDone={setupAllDone}
        />
      </div>
    )
  }

  // ── Dormant State ──
  if (demoPhase === 'dormant') {
    return (
      <div className="p-6">
        <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        <DormantView onPageChange={onPageChange} onRestart={(type) => {
          console.log('Restart type:', type)
          setDemoPhase('running')
        }} />
      </div>
    )
  }

  // ── Running State (24h+ with active campaigns) ──
  return (
    <div className="p-6 space-y-5">
      <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
      {/* Section 1: Summary */}
      <SummaryCard
        kpiTrend={computed.kpiTrend}
        kpiType={kpiType}
        currentKPI={computed.currentKPI}
        kpiTarget={kpiTarget}
        spendData={SPEND_DATA}
        currentWeekPlan={WEEKLY_PLANS.find(w => w.status === 'current')}
        topDimensions={DIMENSION_SCORES.slice().sort((a, b) => a.currentScore - b.currentScore).slice(0, 2)}
      />

      {/* Section 2: Weekly Strategy + Multi-dimensional Monitoring */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-4.5 h-4.5 text-primary-500" />
              Weekly Strategy
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 ml-6 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0" />
              每周基于过去表现及当前情况更新后续每周策略
            </p>
          </div>
          <DevGuideButton title="Weekly Strategy" content={DEV_GUIDES.weeklyPlan} />
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
          <WeeklyPlanCard hideTitle weeksData={WEEKLY_PLANS} onTodoToggle={(weekId, todoId) => {
            console.log('Todo toggled:', weekId, todoId)
          }} />

          <div className="pt-5" />

          <ScoreCard
            dimensionsData={DIMENSION_SCORES}
            phaseData={CAMPAIGN_PHASE_DATA}
            onDimensionSelect={(dimensionId) => {
              console.log('Dimension selected:', dimensionId)
            }}
          />
        </div>
      </div>

      {/* Section 3: Live Operations */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-4.5 h-4.5 text-primary-500" />
          Optimization Review
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
            <AdsGoOperations campaigns={campaigns} />
          </div>

          <HighlightsCard
            actionBenefits={HIGHLIGHTS_DATA.actionBenefits}
            highlights={HIGHLIGHTS_DATA.highlights}
          />
        </div>
      </div>
    </div>
  )
}
