import React, { useState, useRef, useEffect } from 'react'
import DashboardInsightsHeader from './DashboardInsightsHeader'
import CrossChannelAISummary from './CrossChannelAISummary'
import RuleConfigModal from './RuleConfigModal'
import FilterSection from './FilterSection'
import CampaignTable from './CampaignTable'
import BudgetEditModal from './BudgetEditModal'
import BudgetReasonModal from './BudgetReasonModal'
import BrandDataOverlay from './BrandDataOverlay'
import RunSettingModal from './RunSettingModal'
import { MOCK_GOALS } from './mockData'
import { useOnboardingTour } from '../onboarding/useOnboardingTour'
import OnboardingSpotlight from '../onboarding/OnboardingSpotlight'

function ModeSelectionActions({ onSelectDaily, onSelectAutopilot, currentMode, onSkip }) {
  return (
    <div className="space-y-2 mt-1">
      <button
        onClick={onSelectDaily}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
          currentMode !== 'autopilot'
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-100 hover:border-blue-200 bg-white'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">📅 Daily Analysis</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
              AI 生成建议，你逐条审批<br />保持对每笔预算的完全控制
            </p>
          </div>
          <span className="text-[10px] text-blue-600 font-bold mt-0.5 shrink-0">选择 →</span>
        </div>
      </button>
      <button
        onClick={onSelectAutopilot}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
          currentMode === 'autopilot'
            ? 'border-slate-700 bg-slate-900'
            : 'border-slate-100 hover:border-slate-400 bg-white'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-xs font-bold ${currentMode === 'autopilot' ? 'text-white' : 'text-slate-800'}`}>
              🤖 AI Autopilot
            </p>
            <p className={`text-[10px] mt-0.5 leading-relaxed ${currentMode === 'autopilot' ? 'text-slate-300' : 'text-slate-500'}`}>
              7×24h 全自动执行，无需人工干预<br />AI 自主决策，效率最高
            </p>
          </div>
          <span className={`text-[10px] font-bold mt-0.5 shrink-0 ${currentMode === 'autopilot' ? 'text-slate-300' : 'text-slate-500'}`}>
            选择 →
          </span>
        </div>
      </button>
      <p className="text-[10px] text-slate-400 text-center pt-1">你可以随时在此页面切换模式</p>
      <div className="pt-1 border-t border-gray-100">
        <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          跳过引导
        </button>
      </div>
    </div>
  )
}

const AdManagerV3 = ({ onEditBrandConfig, selectedBrand, onPageChange, autoExecuteRecommendations, onAutoExecuteChange, onOptimizeModeConfirmed }) => {
  // Brand data status: 'no-accounts' | 'fetching' | 'no-data' | 'success'
  const [brandDataStatus, setBrandDataStatus] = useState('no-accounts')
  const [budgetStatus, setBudgetStatus] = useState({})
  const [lastUpdated, setLastUpdated] = useState('2026-01-15 13:29')
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCampaignAnalysis, setShowCampaignAnalysis] = useState(false)
  const [showBudgetReason, setShowBudgetReason] = useState(false)
  const [budgetReasonData, setBudgetReasonData] = useState(null)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [goals] = useState(MOCK_GOALS)
  const [campaigns, setCampaigns] = useState([])
  const [activeTab, setActiveTab] = useState('meta')
  const [showRunSetting, setShowRunSetting] = useState(false)
  const [runSettings, setRunSettings] = useState({
    frequency: 'daily',
    customDays: null,
    timeSlots: ['11:00 PM – 12:00 AM'],
  })

  const { isActive, tourSubStep: ctxSubStep, endTour } = useOnboardingTour(2)
  const aiAnalysisRef = useRef(null)
  const controlCenterRef = useRef(null)
  const campaignTableRef = useRef(null)
  const [pageSubStep, setPageSubStep] = useState(0)
  const showPageTour = isActive && ctxSubStep >= 1

  useEffect(() => {
    if (isActive) {
      setPageSubStep(0)
      if (activeTab === 'google') setActiveTab('meta')
    }
  }, [isActive])

  const handleSelectDailyAnalysis = () => {
    if (onOptimizeModeConfirmed) onOptimizeModeConfirmed()
    endTour()
  }

  const handleSelectAutopilot = () => {
    onAutoExecuteChange(true)
    endTour()
  }

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign)
    setShowCampaignAnalysis(true)
  }

  const handleBudgetReasonClick = (campaign) => {
    setSelectedCampaign(campaign)
    setBudgetReasonData(campaign.budgetReason)
    setShowBudgetReason(true)
  }

  const handleBudgetEditClick = (campaign) => {
    setSelectedCampaign(campaign)
    setShowBudgetEdit(true)
  }

  const handleMoreInsights = (campaign) => {
    setSelectedCampaign(campaign)
    setBudgetReasonData(campaign.budgetReason)
    setShowBudgetReason(true)
  }

  const handleBudgetSave = (campaignId, newBudget, editMode) => {
    console.log('Saving budget:', campaignId, newBudget, editMode)
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(c => 
        c.id === campaignId ? { ...c, dailyBudget: newBudget } : c
      )
    )
  }

  const handleUpdateBudgetStatus = (id, status) => {
    setBudgetStatus(prev => ({ ...prev, [id]: status }))
  }

  const handleRuleSave = (rules) => {
    console.log('Saved rules:', rules)
    // 可以在这里保存规则到状态或发送到后端
  }

  // Handle connect account
  const handleConnectAccount = () => {
    // TODO: Implement connect account logic
    console.log('Connect account clicked')
    // For demo, simulate fetching
    setBrandDataStatus('fetching')
  }

  // Handle create campaign
  const handleCreateCampaign = () => {
    // TODO: Implement create campaign logic
    console.log('Create campaign clicked')
    // For demo, simulate fetching
    setBrandDataStatus('fetching')
  }

  // Handle retry data fetch
  const handleRetry = () => {
    console.log('Retry data fetch')
    setBrandDataStatus('fetching')
    // Simulate data fetch
    setTimeout(() => {
      setBrandDataStatus('success')
    }, 2000)
  }

  // Handle view demo (normal state)
  const handleViewDemo = () => {
    console.log('View demo clicked')
    setBrandDataStatus('success')
  }

  // Handle view error
  const handleViewError = () => {
    console.log('View error clicked')
    setBrandDataStatus('no-data')
  }

  return (
    <>
    <div className="p-6">
      {/* Dashboard Insights Header - Independent Component */}
      <DashboardInsightsHeader
        onCollapseToggle={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
        isCollapsed={isSummaryCollapsed}
        onActiveTabChange={setActiveTab}
        activeTab={activeTab}
      />

      {/* Cross-Channel AI Summary - with margin - Show when activeTab is 'all' or 'meta' */}
      {activeTab !== 'google' && (
        <div className="mt-4">
          <CrossChannelAISummary
            totalSpend={125000}
            totalEvent1s={3200}
            avgCpaEvent1={39.06}
            avgRoas={3.8}
            onRuleLibraryClick={() => setShowConfigModal(true)}
            autoApply={autoExecuteRecommendations}
            onAutoApplyToggle={() => onAutoExecuteChange(!autoExecuteRecommendations)}
            goals={goals}
            onEditBrandConfig={onEditBrandConfig}
            brandName={selectedBrand}
            campaigns={campaigns}
            onCampaignsChange={setCampaigns}
            lastUpdated={lastUpdated}
            onUpdateLastUpdated={setLastUpdated}
            isCollapsed={isSummaryCollapsed}
            activeTab={activeTab}
            onPageChange={onPageChange}
            runSettings={runSettings}
            onRunSettingClick={() => setShowRunSetting(true)}
            aiAnalysisRef={aiAnalysisRef}
            controlCenterRef={controlCenterRef}
          />
        </div>
      )}

      {/* Rule Config Modal */}
      <RuleConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleRuleSave}
      />

      {/* Budget Edit Modal */}
      <BudgetEditModal
        isOpen={showBudgetEdit}
        onClose={() => setShowBudgetEdit(false)}
        campaign={selectedCampaign}
        onSave={handleBudgetSave}
        onUpdateBudgetStatus={handleUpdateBudgetStatus}
      />

      {/* Budget Reason Modal (Drawer) */}
      <BudgetReasonModal
        isOpen={showBudgetReason}
        onClose={() => setShowBudgetReason(false)}
        campaign={selectedCampaign}
        reason={budgetReasonData}
      />

      {/* Run Setting Modal */}
      <RunSettingModal
        isOpen={showRunSetting}
        onClose={() => setShowRunSetting(false)}
        onSave={(settings) => setRunSettings(settings)}
      />

      {/* Filter and Data Section - Connected visually - Add margin when CrossChannelAISummary is hidden */}
      <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${activeTab === 'all' || activeTab === 'google' ? 'mt-4' : ''}`}>
        {/* Filter Section - Light background for visual differentiation */}
        <div ref={campaignTableRef} className="p-5 border-b border-slate-100 bg-gray-50">
          <FilterSection activeTab={activeTab} />
        </div>

        {/* Campaign Table - White background */}
        <CampaignTable 
          budgetStatus={budgetStatus}
          onBudgetStatusChange={setBudgetStatus}
          onCampaignClick={handleCampaignClick}
          onBudgetReasonClick={handleBudgetReasonClick}
          onBudgetEditClick={handleBudgetEditClick}
          onMoreInsights={handleMoreInsights}
          autoExecuteRecommendations={autoExecuteRecommendations}
          campaigns={campaigns}
          onCampaignsChange={setCampaigns}
          lastUpdated={lastUpdated}
          activeTab={activeTab}
        />
      </div>
    </div>

      {showPageTour && pageSubStep === 0 && (
        <OnboardingSpotlight
          targetRef={aiAnalysisRef}
          stepLabel="2/4"
          title="AI 分析报告"
          body="每日 AI 深度扫描账户数据，分析 ROAS/CPA 趋势和关键异常，标记机会与风险，为优化建议提供数据支撑"
          onSkip={endTour}
          onNext={() => setPageSubStep(1)}
          nextText="下一步"
        />
      )}
      {showPageTour && pageSubStep === 1 && (
        <OnboardingSpotlight
          targetRef={campaignTableRef}
          stepLabel="3/4"
          title="Campaign 推荐管理"
          body="AI 对每条 Campaign 生成预算调整建议：增加、减少、暂停或维持。Daily Analysis 模式下你可逐条审批，点击「Why」查看推荐理由"
          onSkip={endTour}
          onNext={() => setPageSubStep(2)}
          nextText="下一步"
        />
      )}
      {showPageTour && pageSubStep === 2 && (
        <OnboardingSpotlight
          targetRef={controlCenterRef}
          stepLabel="4/4"
          title="选择你的优化模式"
          body="右侧是 AI 优化控制中心：推荐统计、运行计划，以及最关键的——AI 如何执行你的广告优化"
          width={340}
          onSkip={endTour}
          renderActions={() => (
            <ModeSelectionActions
              onSelectDaily={handleSelectDailyAnalysis}
              onSelectAutopilot={handleSelectAutopilot}
              currentMode={autoExecuteRecommendations ? 'autopilot' : 'daily'}
              onSkip={endTour}
            />
          )}
        />
      )}
    </>
  )
}

export default AdManagerV3
