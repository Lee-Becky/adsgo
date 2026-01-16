import React, { useState } from 'react'
import DashboardInsightsHeader from './DashboardInsightsHeader'
import CrossChannelAISummary from './CrossChannelAISummary'
import RuleConfigModal from './RuleConfigModal'
import FilterSection from './FilterSection'
import CampaignTable from './CampaignTable'
import BudgetEditModal from './BudgetEditModal'
import BudgetReasonModal from './BudgetReasonModal'
import { MOCK_GOALS } from '../../services/adManager/mockData'

const AdManagerV3 = ({ onEditBrandConfig, selectedBrand }) => {
  const [budgetStatus, setBudgetStatus] = useState({})
  const [lastUpdated, setLastUpdated] = useState('2026-01-15 13:29')
  const [autoExecuteRecommendations, setAutoExecuteRecommendations] = useState(false)
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

  return (
    <div className="p-6">
      {/* Dashboard Insights Header - Independent Component */}
      <DashboardInsightsHeader
        onRuleLibraryClick={() => setShowConfigModal(true)}
        onEditBrandConfig={onEditBrandConfig}
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
            onAutoApplyToggle={() => setAutoExecuteRecommendations(!autoExecuteRecommendations)}
            goals={goals}
            onEditBrandConfig={onEditBrandConfig}
            brandName={selectedBrand}
            campaigns={campaigns}
            onCampaignsChange={setCampaigns}
            lastUpdated={lastUpdated}
            onUpdateLastUpdated={setLastUpdated}
            isCollapsed={isSummaryCollapsed}
            activeTab={activeTab}
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
