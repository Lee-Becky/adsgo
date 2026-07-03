import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import WorkspaceLayout from './WorkspaceLayout'
import { getV2Redirect } from './redirects'
import PlanWorkspacePage from '@features/plan/PlanWorkspacePage'
import BulkLaunchTool from '@components/bulk_launch_tool/BulkLaunchTool'
import AIGenerate from '@components/creativeHub/AIGenerate'
import ReportDashboardPage from '@features/report/ReportDashboardPage'
import FeatureCampaignsPage from '@features/ads/CampaignsPage'
import FeatureDraftPage from '@features/create/DraftPage'
import CreativeLibraryPrototype from '@features/creative/CreativeLibraryPrototype'
import BusinessModulePage from '@features/prototype/BusinessModulePage'
import InsightDashboardPage from '@features/insight/InsightDashboardPage'
import BrandProfile from '@components/brand/BrandProfile'
import { AdAccounts } from '@components/brand/adAccounts'
import { DatasetsPage } from '@components/brand/datasets'
import FeatureGoalsPage from '@features/settings/GoalsPage'
import SkillsPage from '@features/settings/SkillsPage'
import UserLayout from '@features/user/UserLayout'
import ClientsPage from '@features/user/ClientsPage'
import StatsPage from '@features/user/StatsPage'
import useFeatureFlagsStore from '@stores/featureFlagsStore'
import { useNavigate } from 'react-router-dom'

const PlanPage = () => <PlanWorkspacePage />

const BulkLaunchPage = () => {
  const nav = useNavigate()
  const { markPublished } = useFeatureFlagsStore()
  return <BulkLaunchTool onPageChange={(page) => nav(`/${page}`)} onPublishSuccess={markPublished} />
}

/* ── V1 Redirect Component ────────────────────────────────── */
const V1Redirect = () => {
  const location = useLocation()
  const redirect = getV2Redirect(location.pathname)
  if (redirect) return <Navigate to={redirect} replace />
  return <Navigate to="/workspace/default/ads/campaigns" replace />
}

/* ═══════════════════════════════════════════════════════════
   AppRoutes — declarative route tree
   ═══════════════════════════════════════════════════════════ */
const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    <Route path="/" element={<Navigate to="/workspace/default/ads/campaigns" replace />} />

    {/* Workspace routes */}
    <Route path="/workspace/:brandId" element={<WorkspaceLayout />}>
      {/* Plan */}
      <Route path="plan/media-plan" element={<PlanPage />} />
      <Route path="plan/strategy-cycle" element={<PlanPage />} />

      {/* Report */}
      <Route path="report/daily-brief" element={<ReportDashboardPage />} />
      <Route path="report/performance" element={<ReportDashboardPage />} />

      {/* Ads */}
      <Route path="ads/campaigns" element={<FeatureCampaignsPage />} />
      <Route path="ads/adsets" element={<FeatureCampaignsPage />} />
      <Route path="ads/ads" element={<FeatureCampaignsPage />} />

      {/* Create */}
      <Route path="create/campaign-gen" element={<Navigate to="../bulk-launch" replace />} />
      <Route path="create/bulk-launch" element={<BulkLaunchPage />} />
      <Route path="create/draft" element={<FeatureDraftPage />} />

      {/* Creative */}
      <Route path="creative/library" element={<CreativeLibraryPrototype />} />
      <Route path="creative/ai-gen" element={<AIGenerate />} />

      {/* Insight */}
      <Route path="insight/dashboard" element={<InsightDashboardPage />} />
      <Route path="insight/audience" element={<InsightDashboardPage />} />
      <Route path="insight/page" element={<InsightDashboardPage />} />
      <Route path="insight/creative" element={<InsightDashboardPage />} />
      <Route path="insight/ai-analysis" element={<InsightDashboardPage />} />

      {/* Settings */}
      <Route path="settings/brand-info" element={<BrandProfile />} />
      <Route path="settings/accounts" element={<AdAccounts />} />
      <Route path="settings/goals" element={<FeatureGoalsPage />} />
      <Route path="settings/datasets" element={<DatasetsPage />} />
      <Route path="settings/skills" element={<SkillsPage />} />

      {/* Chat (Phase 3) */}
      <Route path="chat" element={<BusinessModulePage type="performance" />} />

      {/* Workspace index */}
      <Route index element={<Navigate to="ads/campaigns" replace />} />
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
    <Route path="*" element={<Navigate to="/workspace/default/ads/campaigns" replace />} />
  </Routes>
)

export default AppRoutes
