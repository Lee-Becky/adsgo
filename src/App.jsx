import { useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import MainLayout from './components/MainLayout'
import FilterSection from './components/FilterSection'
import OverallAnalysis from './components/OverallAnalysis'
import OptimizePreferences from './components/OptimizePreferences'
import CampaignTable from './components/CampaignTable'
import CampaignAnalysisModal from './components/CampaignAnalysisModal'
import BudgetReasonModal from './components/BudgetReasonModal'
import BudgetEditModal from './components/BudgetEditModal'

function App() {
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCampaignAnalysis, setShowCampaignAnalysis] = useState(false)
  const [showBudgetReason, setShowBudgetReason] = useState(false)
  const [budgetReasonData, setBudgetReasonData] = useState(null)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [budgetStatus, setBudgetStatus] = useState({})
  const [isConnected, setIsConnected] = useState(false) // Demo mode: false = preview, true = connected

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

  const handleBudgetSave = (campaignId, budgetData) => {
    console.log('Saving budget:', campaignId, budgetData)
    // TODO: 实际的预算保存逻辑
    // 如果 budgetData 是数字，说明是 campaign 层预算
    // 如果 budgetData 是数组，说明是 adset 层预算
  }

  const handleUpdateBudgetStatus = (id, status) => {
    setBudgetStatus(prev => ({ ...prev, [id]: status }))
  }

  return (
    <>
      <MainLayout
        showDemoOverlay={!isConnected}
        onDemoConnect={() => setIsConnected(true)}
        onDemoCreate={() => setIsConnected(true)}
      >
      {/* Main Content Area - Scrollable */}
      <div className="p-6">
        {/* Overall Analysis and Optimize Preferences - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Overview - Takes 2/3 of the space */}
          <div className="lg:col-span-2 h-full">
            <OverallAnalysis />
          </div>

          {/* Optimize Preferences - Takes 1/3 of the space */}
          <div className="lg:col-span-1 h-full">
            <OptimizePreferences />
          </div>
        </div>

        {/* Filter and Data Section - Connected visually */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Filter Section - Light background for visual differentiation */}
          <div className="p-5 border-b border-border bg-gray-50">
            <FilterSection />
          </div>

          {/* Campaign Table - White background */}
          <CampaignTable 
            budgetStatus={budgetStatus}
            onBudgetStatusChange={setBudgetStatus}
            onCampaignClick={handleCampaignClick}
            onBudgetReasonClick={handleBudgetReasonClick}
            onBudgetEditClick={handleBudgetEditClick}
            onMoreInsights={handleMoreInsights}
          />
        </div>
      </div>


      {/* Campaign Analysis Modal */}
      <CampaignAnalysisModal
        isOpen={showCampaignAnalysis}
        onClose={() => setShowCampaignAnalysis(false)}
        campaign={selectedCampaign}
      />

      {/* Budget Reason Modal */}
      <BudgetReasonModal
        isOpen={showBudgetReason}
        onClose={() => setShowBudgetReason(false)}
        campaign={selectedCampaign}
        reason={budgetReasonData}
      />

      {/* Budget Edit Modal */}
      <BudgetEditModal
        isOpen={showBudgetEdit}
        onClose={() => setShowBudgetEdit(false)}
        campaign={selectedCampaign}
        onSave={handleBudgetSave}
        onUpdateBudgetStatus={handleUpdateBudgetStatus}
      />
      </MainLayout>

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </>
  )
}

export default App
