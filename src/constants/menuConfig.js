// 统一的菜单配置文件
// 用于 Sidebar 和 Header 共享使用

export const MENU_ITEMS = [
  {
    key: 'overview',
    label: 'Dashboard',
    icon: 'Layout',
    title: 'Dashboard',
    subtitle: 'Ad campaign overview and real-time optimization'
  },
  {
    key: 'adManagerV3',
    label: 'Ad Manager',
    icon: 'Layers',
    title: 'ad manager',
    subtitle: 'AI-driven cross-channel ad management platform'
  },
  {
    key: 'insights',
    label: 'Ad Insights',
    icon: 'Lightbulb',
    title: 'Ad Insights',
    subtitle: 'Insights and recommendations for new campaigns to publish'
  },
  {
    key: 'autoRegeneration',
    label: 'Ad Regeneration',
    icon: 'RefreshCw',
    title: 'Ad Regeneration',
    subtitle: 'AI-driven campaign recommendations based on performance'
  },
  {
    key: 'drafts',
    label: 'Drafts',
    icon: 'FileText',
    title: 'Drafts',
    subtitle: 'Manage your draft ad campaigns'
  }
]

export const SETTINGS_MENU = {
  key: 'settings',
  label: 'Business Suite',
  icon: 'Target',
  title: 'Business Suite',
  subtitle: 'The business suite defines how the AI evaluates performance and optimizes your ads. All ads in the group share one optimization goal and one budget, and are optimized together by the AI.'
}

// 根据 pageKey 获取页面信息
export const getPageInfo = (pageKey) => {
  const allItems = [...MENU_ITEMS, SETTINGS_MENU]
  const page = allItems.find(item => item.key === pageKey)
  
  if (page) {
    return {
      title: page.title,
      subtitle: page.subtitle
    }
  }
  
  // 默认返回 Dashboard 信息
  return {
    title: 'Dashboard',
    subtitle: 'Ad campaign overview and real-time optimization'
  }
}
