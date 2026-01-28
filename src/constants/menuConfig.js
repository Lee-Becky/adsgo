// 统一的菜单配置文件
// 用于 Sidebar 和 Header 共享使用

export const MENU_ITEMS = [
  {
    key: 'overview',
    label: 'Home',
    icon: 'Layout',
    title: 'Home',
    subtitle: 'Ad campaign overview and real-time optimization'
  },
  {
    key: 'campaignGenerator',
    label: 'Campaign Generator',
    icon: 'Sparkles',
    title: 'Campaign Generator',
    subtitle: 'Generate and publish campaigns'
  },
  {
    key: 'aiOptimize',
    label: 'AI Optimize',
    icon: 'Zap',
    children: [
      {
        key: 'adManagerV3',
        label: 'Ad Manager',
        icon: 'Layers',
        title: 'Ad Manager',
        subtitle: 'AI-driven cross-channel ad management platform'
      },
      {
        key: 'autoRegeneration',
        label: 'Ad Regeneration',
        icon: 'RefreshCw',
        title: 'Ad Regeneration',
        subtitle: 'AI-driven campaign recommendations based on performance'
      }
    ]
  },
  {
    key: 'creativeHub',
    label: 'Creative Hub',
    icon: 'Palette',
    children: [
      {
        key: 'aiGenerate',
        label: 'AI Generate',
        icon: 'Sparkles',
        title: 'AI Generate',
        subtitle: 'Generate ad creatives using AI'
      },
      {
        key: 'creativeLibrary',
        label: 'Creative Library',
        icon: 'FolderOpen',
        title: 'Creative Library',
        subtitle: 'Browse and manage your creative assets'
      }
    ]
  },
  {
    key: 'analysis',
    label: 'Analysis',
    icon: 'BarChart3',
    children: [
      {
        key: 'insights360',
        label: '360° Insights',
        icon: 'Eye',
        title: '360° Insights',
        subtitle: 'Comprehensive 360-degree view of campaign insights'
      },
      {
        key: 'aiAnalysis',
        label: 'AI Analysis',
        icon: 'Brain',
        title: 'AI Analysis',
        subtitle: 'AI-powered campaign analysis and recommendations'
      }
    ]
  },
  {
    key: 'brandCenter',
    label: 'Brand Center',
    icon: 'Building2',
    children: [
      {
        key: 'optimizeGoals',
        label: 'Optimize Goals',
        icon: 'Target',
        title: 'Optimize Goals',
        subtitle: 'Set and manage optimization goals'
      },
      {
        key: 'basicInfo',
        label: 'Brand Info',
        icon: 'Info',
        title: 'Brand Info',
        subtitle: 'Manage basic brand information'
      },
      {
        key: 'brandKits',
        label: 'Brand Kits',
        icon: 'Sparkles',
        title: 'Brand Kits',
        subtitle: 'Manage your brand\'s visual identity and communication guidelines'
      },
      {
        key: 'products',
        label: 'Products',
        icon: 'Box',
        title: 'Products',
        subtitle: 'Manage product information'
      },
      {
        key: 'competitors',
        label: 'Competitors',
        icon: 'Users',
        title: 'Competitors',
        subtitle: 'Track and analyze competitors'
      }
    ]
  },
  {
    key: 'abandon',
    label: 'Abandon',
    icon: 'Trash2',
    children: [
      {
        key: 'insights',
        label: 'Ad Insights',
        icon: 'Lightbulb',
        title: 'Ad Insights',
        subtitle: 'Insights and recommendations for new campaigns to publish'
      },
      {
        key: 'drafts',
        label: 'Drafts',
        icon: 'FileText',
        title: 'Drafts',
        subtitle: 'Manage your draft ad campaigns'
      }
    ]
  }
]

export const SETTINGS_MENU = {
  key: 'settings',
  label: 'Brand Management',
  icon: 'Cog',
  title: 'Brand Management',
  subtitle: 'The business suite defines how the AI evaluates performance and optimizes your ads. All ads in the group share one optimization goal and one budget, and are optimized together by the AI.'
}

// 根据 pageKey 获取页面信息
export const getPageInfo = (pageKey) => {
  const findPage = (items) => {
    for (const item of items) {
      if (item.key === pageKey) return item;
      if (item.children) {
        const found = findPage(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const allItems = [...MENU_ITEMS, SETTINGS_MENU]
  const page = findPage(allItems)
  
  if (page) {
    return {
      title: page.title,
      subtitle: page.subtitle
    }
  }

  // 特殊处理详情页映射
  if (pageKey === 'productDetails') {
    const productsPage = findPage(allItems.filter(i => i.key === 'brandCenter'))?.children?.find(c => c.key === 'products');
    return {
      title: productsPage?.title || 'Products',
      subtitle: productsPage?.subtitle || 'Manage product information'
    }
  }
  
  // 默认返回 Home 信息
  return {
    title: 'Home',
    subtitle: 'Ad campaign overview and real-time optimization'
  }
}
