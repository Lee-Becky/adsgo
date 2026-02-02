import { useState, useMemo } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import FilterSection from './components/FilterSection'
import OverallAnalysis from './components/OverallAnalysis'
import OptimizePreferences from './components/OptimizePreferences'
import CampaignTable from './components/CampaignTable'
import CampaignAnalysisModal from './components/CampaignAnalysisModal'
import BudgetReasonModal from './components/BudgetReasonModal'
import BudgetEditModal from './components/BudgetEditModal'
import BrandManagement from './components/BrandManagement'
import BasicInfo from './components/BasicInfo'
import BrandKits from './components/brand/BrandKits'
import OptimizeGoals from './components/brand/OptimizeGoals'
import Drafts from './components/Drafts'
import DataFetchingModal from './components/DataFetchingModal'
import Dashboard from './components/Dashboard'
import AdInsights from './components/AdInsights'
import { AutoRegeneration } from './components/autoRegeneration'
import { CampaignGenerator } from './components/campaignGenerator'
import { Analysis360 } from './components/analysis'
import AdManagerV3 from './components/adManagerV3/AdManagerV3'
import { ProductList, ProductDetails } from './components/brand/products'
import { Competitors } from './components/brand/competitors'
import CreateBrandModal from './components/brand/CreateBrandModal'
import BrandSwitchLoading from './components/brand/BrandSwitchLoading'
import ComingSoon from './components/ComingSoon'
import { getPageInfo } from './constants/menuConfig'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPage = useMemo(() => {
    const path = location.pathname.slice(1) || 'overview'
    // 获取路径的最后一部分作为页面 key
    const parts = path.split('/')
    return parts[parts.length - 1] || 'overview'
  }, [location.pathname])

  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCampaignAnalysis, setShowCampaignAnalysis] = useState(false)
  const [showBudgetReason, setShowBudgetReason] = useState(false)
  const [budgetReasonData, setBudgetReasonData] = useState(null)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [budgetStatus, setBudgetStatus] = useState({})
  const [autoExecuteRecommendations, setAutoExecuteRecommendations] = useState(false)
  const [isOverviewConnected, setIsOverviewConnected] = useState(false) // Home page connection state
  const [isOverviewDataFetching, setIsOverviewDataFetching] = useState(false) // Home page data fetching state
  const [isDashboardConnected, setIsDashboardConnected] = useState(false) // Ad Manager page connection state
  const [isDashboardDataFetching, setIsDashboardDataFetching] = useState(false) // Ad Manager page data fetching state
  const [isInsightsConnected, setIsInsightsConnected] = useState(false) // Ad Insights page connection state
  const [isInsightsDataFetching, setIsInsightsDataFetching] = useState(false) // Ad Insights page data fetching state
  const [brands, setBrands] = useState(['Default Brand'])
  const [selectedBrand, setSelectedBrand] = useState('Default Brand')
  const [isBrandSwitching, setIsBrandSwitching] = useState(false)
  const [isCreateBrandModalOpen, setIsCreateBrandModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [hasGeneratedCampaign, setHasGeneratedCampaign] = useState(false)
  const [firstGeneratedUrl, setFirstGeneratedUrl] = useState('')
  const [savedConfig, setSavedConfig] = useState({
    objective: '',
    adsetGoal: '',
    event: '',
    locations: [],
    dailyLimit: ''
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
    console.log('Page change requested:', page)
    navigate(`/${page}`)
  }

  const handleBrandChange = (brand) => {
    setIsBrandSwitching(true)
    setSelectedBrand(brand)
    navigate('/overview')
    
    // Simulate loading/syncing time
    setTimeout(() => {
      setIsBrandSwitching(false)
    }, 1500)
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
      navigate('/settings')
    }
  }

  const renderContent = () => {
    const pageInfo = getPageInfo(currentPage)

    switch (currentPage) {
      case 'overview':
        return (
          <Dashboard
            selectedBrand={selectedBrand}
            onPageChange={handlePageChange}
            onEditBrandConfig={handleEditBrandConfig}
          />
        )
      case 'adManagerV3':
        return (
          <AdManagerV3
            onEditBrandConfig={handleEditBrandConfig}
            selectedBrand={selectedBrand}
            onPageChange={handlePageChange}
          />
        )
      case 'autoRegeneration':
        return <AutoRegeneration onPageChange={handlePageChange} />
      case 'campaignGenerator':
        return (
          <CampaignGenerator 
            hasGenerated={hasGeneratedCampaign} 
            setHasGenerated={setHasGeneratedCampaign} 
            firstGeneratedUrl={firstGeneratedUrl}
            setFirstGeneratedUrl={setFirstGeneratedUrl}
            savedConfig={savedConfig}
            setSavedConfig={setSavedConfig}
            onPageChange={handlePageChange}
          />
        )
      case 'insights':
        return <AdInsights onPageChange={handlePageChange} />
      case 'insights360':
        return <Analysis360 onPageChange={handlePageChange} />
      case 'drafts':
        return <Drafts />
      case 'settings':
        return <BrandManagement editingBrand={editingBrand} onClearEditingBrand={handleClearEditingBrand} />
      case 'basicInfo':
        console.log('Rendering BasicInfo component')
        return <BasicInfo onSave={() => {}} onCancel={() => handlePageChange('overview')} />
      case 'brandKits':
        return <BrandKits />
      case 'optimizeGoals':
        return <OptimizeGoals />
      case 'products':
        return (
          <ProductList 
            onProductClick={(product) => {
              setSelectedProduct(product)
              handlePageChange('productDetails')
            }} 
          />
        )
      case 'competitors':
        return <Competitors />
      case 'productDetails':
        return (
          <ProductDetails 
            product={selectedProduct} 
            onBack={() => handlePageChange('products')} 
          />
        )
      case 'dashboard': // 保持兼容旧路由
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 h-full">
                <OverallAnalysis />
              </div>
              <div className="lg:col-span-1 h-full">
                <OptimizePreferences />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border bg-gray-50">
                <FilterSection />
              </div>
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
        )
      default:
        return (
          <ComingSoon
            title={pageInfo?.title}
            subtitle={pageInfo?.subtitle}
          />
        )
    }
  }

  return (
    <>
      <Routes>
        <Route path="/*" element={
          <MainLayout
            showDemoOverlay={false}
            onDemoConnect={() => {}}
            onDemoCreate={() => {}}
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
            onCreateBrand={() => setIsCreateBrandModalOpen(true)}
            brands={brands}
          >
            {/* Main Content Area - Scrollable */}
            {renderContent()}

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

            {/* Create Brand Modal */}
            <CreateBrandModal 
              isOpen={isCreateBrandModalOpen}
              onClose={() => setIsCreateBrandModalOpen(false)}
              onCreate={(newBrand) => {
                console.log('New Brand Created:', newBrand);
                const brandName = newBrand.name;
                setBrands(prev => [...prev, brandName]);
                handleBrandChange(brandName);
              }}
            />
          </MainLayout>
        } />
      </Routes>

      {isBrandSwitching && (
        <BrandSwitchLoading brandName={selectedBrand} />
      )}
    </>
  )
}

export default App
