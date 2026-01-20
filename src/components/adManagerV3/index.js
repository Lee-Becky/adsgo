// Ad Manager V3 组件统一导出文件
// 所有组件都在同一文件夹内，无跨文件夹引用

// 主组件
export { default as AdManagerV3 } from './AdManagerV3'

// 子组件
export { default as DashboardInsightsHeader } from './DashboardInsightsHeader'
export { default as CrossChannelAISummary } from './CrossChannelAISummary'
export { default as FilterSection } from './FilterSection'
export { default as CampaignTable } from './CampaignTable'

// 模态框组件
export { default as BudgetEditModal } from './BudgetEditModal'
export { default as BudgetReasonModal } from './BudgetReasonModal'
export { default as FeedbackModal } from './FeedbackModal'
export { default as RuleConfigModal } from './RuleConfigModal'
export { default as AdsetDetailModal } from './AdsetDetailModal'

// 覆盖层组件
export { default as BrandDataOverlay } from './BrandDataOverlay'

// Mock数据
export {
  MOCK_CAMPAIGNS,
  MOCK_GOALS,
  MOCK_RULES,
  GLOBAL_FUNNEL,
  Platform
} from './mockData'
