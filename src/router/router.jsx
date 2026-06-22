import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import WorkspaceLayout from './WorkspaceLayout'
import { getV2Redirect } from './redirects'

/* ── Page Components ──────────────────────────────────────── */
import MediaPlan from '@components/mediaPlan/MediaPlan'
import AdManagerV3 from '@components/adManagerV3/AdManagerV3'
import { AutoRegeneration } from '@components/autoRegeneration'
import { CampaignGenerator } from '@components/campaignGenerator'
import BatchGenerateAds from '@components/batch_generate_campaign/BatchGenerateAds'
import BulkLaunchTool from '@components/bulk_launch_tool/BulkLaunchTool'
import AIGenerate from '@components/creativeHub/AIGenerate'
import GenerateVideo from '@components/creativeHub/generateVideo'
import CreativeLibrary from '@components/creativeHub/CreativeLibrary'
import { Analysis360, AIAnalysis, Audit360 } from '@components/analysis'
import AdInsights from '@components/AdInsights'
import BrandProfile from '@components/brand/BrandProfile'
import BasicInfo from '@components/BasicInfo'
import OptimizeGoals from '@components/brand/OptimizeGoals'
import { AdAccounts } from '@components/brand/adAccounts'
import { DatasetsPage } from '@components/brand/datasets'
import { ProductList, ProductDetails } from '@components/brand/products'
import { Competitors } from '@components/brand/competitors'
import BrandManagement from '@components/BrandManagement'
import Drafts from '@components/Drafts'
import Dashboard from '@components/Dashboard'
import ComingSoon from '@components/ComingSoon'
import DailyBrief from '@features/report/DailyBrief'
import PerformanceTable from '@features/report/PerformanceTable'
import StrategyCycle from '@features/plan/StrategyCycle'
import FeatureCampaignsPage from '@features/ads/CampaignsPage'
import FeatureDraftPage from '@features/create/DraftPage'
import FeatureGoalsPage from '@features/settings/GoalsPage'
import SkillsPage from '@features/settings/SkillsPage'
import AudiencePage from '@features/insight/AudiencePage'
import PageInsightsPage from '@features/insight/PageInsightsPage'
import CreativeInsightsPage from '@features/insight/CreativeInsightsPage'
import UserLayout from '@features/user/UserLayout'
import ClientsPage from '@features/user/ClientsPage'
import StatsPage from '@features/user/StatsPage'

/* ── Store hooks ──────────────────────────────────────────── */
import useBrandStore from '@stores/brandStore'
import useCampaignStore from '@stores/campaignStore'
import useFeatureFlagsStore from '@stores/featureFlagsStore'
import { useNavigate } from 'react-router-dom'

/* ── Page wrappers (connect stores to page props) ─────────── */
const MediaPlanPage = () => {
  const nav = useNavigate()
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const { autoExecuteRecommendations, setAutoExecuteRecommendations, autoRegenEnabled, setAutoRegenEnabled, publishedAt, goalConfigured } = useFeatureFlagsStore()
  return (
    <MediaPlan
      selectedBrand={selectedBrand}
      onPageChange={(p) => nav(`/${p}`)}
      autoExecuteRecommendations={autoExecuteRecommendations}
      onAutoExecuteChange={setAutoExecuteRecommendations}
      autoRegenEnabled={autoRegenEnabled}
      onAutoRegenChange={setAutoRegenEnabled}
      publishedAt={publishedAt}
      goalConfigured={goalConfigured}
    />
  )
}

const AdManagerPage = () => {
  const nav = useNavigate()
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const { setEditingBrand } = useBrandStore()
  const { autoExecuteRecommendations, setAutoExecuteRecommendations, confirmAutoOptimize } = useFeatureFlagsStore()
  const handleEditBrandConfig = () => {
    setEditingBrand({ id: 1, name: selectedBrand })
    nav('/settings')
  }
  return (
    <AdManagerV3
      onEditBrandConfig={handleEditBrandConfig}
      selectedBrand={selectedBrand}
      onPageChange={(p) => nav(`/${p}`)}
      autoExecuteRecommendations={autoExecuteRecommendations}
      onAutoExecuteChange={setAutoExecuteRecommendations}
      onOptimizeModeConfirmed={confirmAutoOptimize}
    />
  )
}

const DashboardPage = () => {
  const nav = useNavigate()
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const { setEditingBrand } = useBrandStore()
  return (
    <Dashboard
      selectedBrand={selectedBrand}
      onPageChange={(p) => nav(`/${p}`)}
      onEditBrandConfig={() => {
        setEditingBrand({ id: 1, name: selectedBrand })
        nav('/settings')
      }}
    />
  )
}

const AutoRegenPage = () => {
  const nav = useNavigate()
  const { autoRegenEnabled, setAutoRegenEnabled } = useFeatureFlagsStore()
  return (
    <AutoRegeneration
      onPageChange={(p) => nav(`/${p}`)}
      autoRegenEnabled={autoRegenEnabled}
      onAutoRegenChange={setAutoRegenEnabled}
    />
  )
}

const CampaignGenPage = () => {
  const nav = useNavigate()
  const { hasGeneratedCampaign, setHasGeneratedCampaign, firstGeneratedUrl, setFirstGeneratedUrl, savedConfig, setSavedConfig } = useCampaignStore()
  return (
    <CampaignGenerator
      hasGenerated={hasGeneratedCampaign}
      setHasGenerated={setHasGeneratedCampaign}
      firstGeneratedUrl={firstGeneratedUrl}
      setFirstGeneratedUrl={setFirstGeneratedUrl}
      savedConfig={savedConfig}
      setSavedConfig={setSavedConfig}
      onPageChange={(p) => nav(`/${p}`)}
    />
  )
}

const BatchGenPage = () => {
  const nav = useNavigate()
  const { markPublished } = useFeatureFlagsStore()
  return <BatchGenerateAds onPageChange={(p) => nav(`/${p}`)} onPublishSuccess={markPublished} />
}

const BulkLaunchPage = () => {
  const nav = useNavigate()
  const { markPublished } = useFeatureFlagsStore()
  return <BulkLaunchTool onPageChange={(p) => nav(`/${p}`)} onPublishSuccess={markPublished} />
}

const InsightsPage = () => {
  const nav = useNavigate()
  return <AdInsights onPageChange={(p) => nav(`/${p}`)} />
}

const Analysis360Page = () => {
  const nav = useNavigate()
  return <Analysis360 onPageChange={(p) => nav(`/${p}`)} />
}

const AIAnalysisPage = () => {
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const brandDetails = useBrandStore((s) => s.brandDetails)
  const updateBrandDetail = useBrandStore((s) => s.updateBrandDetail)
  return (
    <AIAnalysis
      selectedBrand={selectedBrand}
      brandDetail={brandDetails[selectedBrand] || { url: '', isAnalyzed: false }}
      onUpdateDetail={(details) => updateBrandDetail(selectedBrand, details)}
    />
  )
}

const GoalsPage = () => {
  const { markGoalConfigured } = useFeatureFlagsStore()
  return <OptimizeGoals onGoalSave={markGoalConfigured} />
}

const SettingsPage = () => {
  const { editingBrand, clearEditingBrand } = useBrandStore()
  return <BrandManagement editingBrand={editingBrand} onClearEditingBrand={clearEditingBrand} />
}

const ProductsPage = () => {
  const nav = useNavigate()
  const { setSelectedProduct } = useCampaignStore()
  return (
    <ProductList
      onProductClick={(product) => {
        setSelectedProduct(product)
        nav('/productDetails')
      }}
    />
  )
}

const ProductDetailsPage = () => {
  const nav = useNavigate()
  const selectedProduct = useCampaignStore((s) => s.selectedProduct)
  return <ProductDetails product={selectedProduct} onBack={() => nav(-1)} />
}

const DraftPage = () => {
  const nav = useNavigate()
  const { autoRegenEnabled, setAutoRegenEnabled } = useFeatureFlagsStore()
  return (
    <AutoRegeneration
      onPageChange={(p) => nav(`/${p}`)}
      autoRegenEnabled={autoRegenEnabled}
      onAutoRegenChange={setAutoRegenEnabled}
    />
  )
}

/* ── V1 Redirect Component ────────────────────────────────── */
const V1Redirect = () => {
  const location = useLocation()
  const redirect = getV2Redirect(location.pathname)
  if (redirect) return <Navigate to={redirect} replace />
  return <Navigate to="/workspace/default/plan/media-plan" replace />
}

/* ═══════════════════════════════════════════════════════════
   AppRoutes — declarative route tree
   ═══════════════════════════════════════════════════════════ */
const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    <Route path="/" element={<Navigate to="/workspace/default/plan/media-plan" replace />} />

    {/* Workspace routes */}
    <Route path="/workspace/:brandId" element={<WorkspaceLayout />}>
      {/* Plan */}
      <Route path="plan/media-plan" element={<MediaPlanPage />} />
      <Route path="plan/strategy-cycle" element={<StrategyCycle />} />

      {/* Report */}
      <Route path="report/daily-brief" element={<DailyBrief />} />
      <Route path="report/performance" element={<PerformanceTable />} />

      {/* Ads */}
      <Route path="ads/campaigns" element={<FeatureCampaignsPage />} />
      <Route path="ads/adsets" element={<ComingSoon title="Ad Sets" subtitle="Ad set management" />} />
      <Route path="ads/ads" element={<ComingSoon title="Ads" subtitle="Ad management" />} />

      {/* Create */}
      <Route path="create/campaign-gen" element={<BatchGenPage />} />
      <Route path="create/bulk-launch" element={<BulkLaunchPage />} />
      <Route path="create/draft" element={<FeatureDraftPage />} />

      {/* Creative */}
      <Route path="creative/library" element={<CreativeLibrary />} />
      <Route path="creative/ai-gen" element={<AIGenerate />} />

      {/* Insight */}
      <Route path="insight/dashboard" element={<Analysis360Page />} />
      <Route path="insight/audience" element={<AudiencePage />} />
      <Route path="insight/page" element={<PageInsightsPage />} />
      <Route path="insight/creative" element={<CreativeInsightsPage />} />
      <Route path="insight/ai-analysis" element={<AIAnalysisPage />} />

      {/* Settings */}
      <Route path="settings/brand-info" element={<BrandProfile />} />
      <Route path="settings/accounts" element={<AdAccounts />} />
      <Route path="settings/goals" element={<FeatureGoalsPage />} />
      <Route path="settings/datasets" element={<DatasetsPage />} />
      <Route path="settings/skills" element={<SkillsPage />} />

      {/* Chat (Phase 3) */}
      <Route path="chat" element={<ComingSoon title="Luna Chat" subtitle="AI-powered advertising assistant" />} />

      {/* Workspace index */}
      <Route index element={<Navigate to="plan/media-plan" replace />} />
    </Route>

    {/* User management (independent layout) */}
    <Route path="/user" element={<UserLayout />}>
      <Route path="clients" element={<ClientsPage />} />
      <Route path="stats" element={<StatsPage />} />
      <Route index element={<Navigate to="clients" replace />} />
    </Route>

    {/* ── V1 backward compat redirects ─────────────────────── */}
    <Route path="/mediaPlan" element={<V1Redirect />} />
    <Route path="/overview" element={<V1Redirect />} />
    <Route path="/adManagerV3" element={<V1Redirect />} />
    <Route path="/autoRegeneration" element={<V1Redirect />} />
    <Route path="/drafts" element={<V1Redirect />} />
    <Route path="/batchGenerateAds" element={<V1Redirect />} />
    <Route path="/campaignGenerator" element={<V1Redirect />} />
    <Route path="/bulkLaunchTool" element={<V1Redirect />} />
    <Route path="/aiGenerate" element={<V1Redirect />} />
    <Route path="/generateVideo" element={<V1Redirect />} />
    <Route path="/creativeLibrary" element={<V1Redirect />} />
    <Route path="/insights360" element={<V1Redirect />} />
    <Route path="/insights" element={<V1Redirect />} />
    <Route path="/aiAnalysis" element={<V1Redirect />} />
    <Route path="/audit360" element={<V1Redirect />} />
    <Route path="/settings" element={<V1Redirect />} />
    <Route path="/basicInfo" element={<V1Redirect />} />
    <Route path="/brandProfile" element={<V1Redirect />} />
    <Route path="/optimizeGoals" element={<V1Redirect />} />
    <Route path="/adAccounts" element={<V1Redirect />} />
    <Route path="/datasets" element={<V1Redirect />} />
    <Route path="/products" element={<V1Redirect />} />
    <Route path="/competitors" element={<V1Redirect />} />
    <Route path="/productDetails" element={<V1Redirect />} />
    <Route path="/dashboard" element={<V1Redirect />} />
    <Route path="/brandCenter/*" element={<V1Redirect />} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/workspace/default/plan/media-plan" replace />} />
  </Routes>
)

export default AppRoutes
