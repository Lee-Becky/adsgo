import React, { useState, useMemo } from 'react'
import { MOCK_CAMPAIGNS } from '../adManagerV3/mockData'
import { CAMPAIGN_CARDS } from '../autoRegeneration/mockData'
import { STATUS_BAR_DATA, OPERATIONS_DATA } from './mockData'
import StatusBar, { getPhase, buildKPITrend } from './StatusBar'
import PlanRoadmap from './PlanRoadmap'
import Forecast from './Forecast'
import AdsGoOperations, { aggregateBudgetSuggestions, formatBudgetSummary } from './AdsGoOperations'
import YourActionItems from './YourActionItems'
import SafetyControl from './SafetyControl'
import DevGuideButton from './DevGuideButton'
import { DEV_GUIDES } from './devGuideContent'
import DemoPhaseSwitch from './DemoPhaseSwitch'
import PrePublishView from './PrePublishView'
import JustLaunchedView from './JustLaunchedView'

export default function MediaPlan({
  selectedBrand,
  onPageChange,
  autoExecuteRecommendations,
  onAutoExecuteChange,
  autoRegenEnabled,
  onAutoRegenChange,
}) {
  const [demoPhase, setDemoPhase] = useState('new_user')
  const { kpiType, kpiTarget, dailyBudget } = STATUS_BAR_DATA
  const campaigns = MOCK_CAMPAIGNS

  // ── Core computed values (shared across modules) ──
  const computed = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active')

    // KPI aggregation
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

    // Budget suggestions
    const budgetCounts = aggregateBudgetSuggestions(campaigns)
    const pendingBudgetCount = budgetCounts.increase + budgetCounts.decrease + budgetCounts.pause
    const budgetSummaryText = formatBudgetSummary(budgetCounts)

    // Creative timing
    const daysSinceLastCreative = Math.floor(
      (Date.now() - new Date(OPERATIONS_DATA.lastCreativeGenTime).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Draft campaigns
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

  // ── Pre-publish State ──
  if (demoPhase === 'new_user') {
    return (
      <div className="p-6">
        <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        <PrePublishView onPageChange={onPageChange} />
      </div>
    )
  }

  // ── Just Launched State ──
  if (demoPhase === 'just_launched') {
    return (
      <div className="p-6">
        <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />
        <JustLaunchedView
          autoExecuteRecommendations={autoExecuteRecommendations}
          autoRegenEnabled={autoRegenEnabled}
          onAutoExecuteChange={onAutoExecuteChange}
          onAutoRegenChange={onAutoRegenChange}
          onPageChange={onPageChange}
        />
      </div>
    )
  }

  // ── Running State (existing dashboard) ──
  return (
    <div className="p-6 space-y-5">
      <DemoPhaseSwitch value={demoPhase} onChange={setDemoPhase} />

      {/* Status Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <StatusBar
            campaigns={campaigns}
            kpiType={kpiType}
            kpiTarget={kpiTarget}
            dailyBudget={dailyBudget}
          />
        </div>
        <DevGuideButton title="Status Bar" content={DEV_GUIDES.statusBar} />
      </div>

      {/* Section 1: The Plan */}
      <PlanRoadmap currentPhaseId={computed.phase.id} />

      {/* Section 2: Forecast */}
      <Forecast
        kpiTrend={computed.kpiTrend}
        kpiType={kpiType}
        currentKPI={computed.currentKPI}
        kpiTarget={kpiTarget}
      />

      {/* Section 3: Live Operations */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Live Operations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: AdsGo Operations */}
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
            <AdsGoOperations campaigns={campaigns} />
          </div>

          {/* Right: Your Actions */}
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
            <YourActionItems
              autoExecuteRecommendations={autoExecuteRecommendations}
              autoRegenEnabled={autoRegenEnabled}
              onAutoExecuteChange={onAutoExecuteChange}
              onAutoRegenChange={onAutoRegenChange}
              pendingBudgetCount={computed.pendingBudgetCount}
              budgetSummaryText={computed.budgetSummaryText}
              draftCampaignCount={computed.draftCampaignCount}
              daysSinceLastCreative={computed.daysSinceLastCreative}
              kpiAchievement={computed.kpiAchievement}
              kpiType={kpiType}
              currentKPI={computed.currentKPI}
              kpiTarget={kpiTarget}
              spendPercent={computed.spendPercent}
              activeCreativeCount={computed.activeCreativeCount}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Safety & Control */}
      <SafetyControl
        cappedSpend={computed.cappedSpend}
        dailyBudget={dailyBudget}
        autoExecuteRecommendations={autoExecuteRecommendations}
        autoRegenEnabled={autoRegenEnabled}
      />
    </div>
  )
}
