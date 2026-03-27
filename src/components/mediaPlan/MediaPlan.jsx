import React, { useMemo } from 'react'
import { Rocket } from 'lucide-react'
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

export default function MediaPlan({
  selectedBrand,
  onPageChange,
  autoExecuteRecommendations,
  onAutoExecuteChange,
  autoRegenEnabled,
  onAutoRegenChange,
}) {
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

  const hasActiveCampaigns = computed.activeCampaigns.length > 0

  // ── Empty State ──
  if (!hasActiveCampaigns) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-[20px] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No active campaigns yet</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your Media Plan will come to life once your first ads are running.
              Create a campaign to get started — AdsGo will handle the rest.
            </p>
            <button
              onClick={() => onPageChange('batchGenerateAds')}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            >
              Create Your First Campaign
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Content ──
  return (
    <div className="p-6 space-y-5">
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
