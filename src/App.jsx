import { useState } from 'react'
import MainLayout from './components/MainLayout'
import FilterSection from './components/FilterSection'
import OverallAnalysis from './components/OverallAnalysis'
import OptimizePreferences from './components/OptimizePreferences'
import CampaignTable from './components/CampaignTable'
import CampaignAnalysisModal from './components/CampaignAnalysisModal'
import BudgetReasonModal from './components/BudgetReasonModal'
import BudgetEditModal from './components/BudgetEditModal'
import BrandManagement from './components/BrandManagement'
import Drafts from './components/Drafts'
import DataFetchingModal from './components/DataFetchingModal'
import Dashboard from './components/Dashboard'
import AdInsights from './components/AdInsights'
import { AutoRegeneration } from './components/autoRegeneration'
import AdManagerV2 from './components/adManagerV2/AdManagerV2'
import AdManagerV3 from './components/adManagerV3/AdManagerV3'

function App() {
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCampaignAnalysis, setShowCampaignAnalysis] = useState(false)
  const [showBudgetReason, setShowBudgetReason] = useState(false)
  const [budgetReasonData, setBudgetReasonData] = useState(null)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [budgetStatus, setBudgetStatus] = useState({})
  const [autoExecuteRecommendations, setAutoExecuteRecommendations] = useState(false)
  const [isOverviewConnected, setIsOverviewConnected] = useState(false) // Dashboard page connection state
  const [isOverviewDataFetching, setIsOverviewDataFetching] = useState(false) // Dashboard page data fetching state
  const [isDashboardConnected, setIsDashboardConnected] = useState(false) // Ad Manager page connection state
  const [isDashboardDataFetching, setIsDashboardDataFetching] = useState(false) // Ad Manager page data fetching state
  const [isInsightsConnected, setIsInsightsConnected] = useState(false) // Ad Insights page connection state
  const [isInsightsDataFetching, setIsInsightsDataFetching] = useState(false) // Ad Insights page data fetching state
  const [currentPage, setCurrentPage] = useState('overview') // 'overview', 'dashboard', 'drafts', 'insights', or 'settings'
  const [selectedBrand, setSelectedBrand] = useState('neopets')
  const [editingBrand, setEditingBrand] = useState(null)

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
    // TODO: Implement actual budget saving logic
    // If budgetData is a number, it's a campaign-level budget
    // If budgetData is an array, it's an adset-level budget
  }

  const handleUpdateBudgetStatus = (id, status) => {
    setBudgetStatus(prev => ({ ...prev, [id]: status }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleClearEditingBrand = () => {
    setEditingBrand(null)
  }

  const handleEditBrandConfig = () => {
    // Find the brand object based on selectedBrand name
    const brands = [
      {
        id: 1,
        name: 'neopets',
        logo: '🐾',
        industry: 'Gaming',
        dailyBudget: '$500',
        convGoal: 'Max conversions-purchase',
        kpi: 'ROAS > 400%',
        color: 'bg-purple-500'
      },
      {
        id: 2,
        name: 'gaming studio',
        logo: '🎮',
        industry: 'Gaming',
        dailyBudget: '$1,200',
        convGoal: 'Max conversions-signup',
        kpi: 'CPA <= 30.00 USD',
        color: 'bg-blue-500'
      },
      {
        id: 3,
        name: 'tech brand',
        logo: '💻',
        industry: 'Technology',
        dailyBudget: '$2,000',
        convGoal: 'Max leads',
        kpi: 'CPA <= 100.00 USD',
        color: 'bg-green-500'
      }
    ]
    
    const brand = brands.find(b => b.name === selectedBrand)
    if (brand) {
      setEditingBrand(brand)
      setCurrentPage('settings')
    }
  }

  return (
    <>
      <MainLayout
        showDemoOverlay={false}
        onDemoConnect={() => {}}
        onDemoCreate={() => {}}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
      >
      {/* Main Content Area - Scrollable */}
      {currentPage === 'overview' ? (
        <Dashboard 
          selectedBrand={selectedBrand} 
          onPageChange={handlePageChange} 
          onEditBrandConfig={handleEditBrandConfig}
        />
      ) : currentPage === 'dashboard' ? (
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
            autoExecuteRecommendations={autoExecuteRecommendations}
            onAutoExecuteToggle={setAutoExecuteRecommendations}
          />
        </div>
      </div>
      ) : currentPage === 'drafts' ? (
        <Drafts />
      ) : currentPage === 'insights' ? (
        <AdInsights onPageChange={handlePageChange} />
      ) : currentPage === 'autoRegeneration' ? (
        <AutoRegeneration onPageChange={handlePageChange} />
      ) : currentPage === 'adManagerV2' ? (
        <AdManagerV2 />
      ) : currentPage === 'adManagerV3' ? (
        <AdManagerV3 
          onEditBrandConfig={handleEditBrandConfig}
          selectedBrand={selectedBrand}
        />
      ) : (
        <BrandManagement editingBrand={editingBrand} onClearEditingBrand={handleClearEditingBrand} />
      )}


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

    </>
  )
}

export default App
