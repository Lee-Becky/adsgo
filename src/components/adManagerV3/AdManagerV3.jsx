import React, { useState } from 'react'
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

const AdManagerV3 = ({ onEditBrandConfig, selectedBrand, onPageChange, autoExecuteRecommendations, onAutoExecuteChange }) => {
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
        <div className="p-5 border-b border-slate-100 bg-gray-50">
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
  )
}

export default AdManagerV3
