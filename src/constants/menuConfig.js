// 统一的菜单配置文件
// 用于 Sidebar 和 Header 共享使用

export const MENU_ITEMS = [
  {
    key: 'overview',
    label: 'Home',
    shortLabel: 'Home',
    icon: 'Layout',
    title: 'Home',
    subtitle: 'Ad campaign overview and real-time optimization'
  },
  {
    key: 'homeNew',
    label: 'Home (New)',
    shortLabel: 'New',
    icon: 'Compass',
    title: 'Home (New)',
    subtitle: 'AI-powered campaign briefing and action center'
  },
  {
    key: 'campaignGenerator',
    label: 'New Campaign（旧）',
    shortLabel: '旧',
    icon: 'Wand2',
    title: 'New Campaign（旧）',
    subtitle: 'Generate and publish campaigns'
  },
  {
    key: 'batchGenerateAds',
    label: 'Campaign Generator',
    shortLabel: 'Gen',
    icon: 'Layers',
    title: 'Campaign Generator',
    subtitle: 'High-performance multi-product campaign architecture orchestration'
  },
  {
    key: 'aiOptimize',
    label: 'AI Optimize',
    shortLabel: 'Opt',
    icon: 'Zap',
    children: [
      {
        key: 'adManagerV3',
        label: 'Ad Manager',
        shortLabel: 'Ads',
        icon: 'Monitor',
        title: 'Ad Manager',
        subtitle: 'Unified management of cross-channel campaigns and AI-driven budget optimization'
      },
      {
        key: 'autoRegeneration',
        label: 'Draft & Recom.',
        shortLabel: 'Draft',
        icon: 'FileText',
        title: 'Draft & Recom.',
        subtitle: 'Management of unpublished drafts and AI-driven campaign recommendations based on performance'
      }
    ]
  },
  {
    key: 'creativeHub',
    label: 'Creative Hub',
    shortLabel: 'Hub',
    icon: 'Palette',
    children: [
      {
        key: 'aiGenerate',
        label: 'AI Generate',
        shortLabel: 'AIGC',
        icon: 'Sparkles',
        title: 'AI Generate',
        subtitle: 'Generate ad creatives using AI'
      },
      {
        key: 'generateVideo',
        label: 'Generate Video',
        shortLabel: 'Video',
        icon: 'Video',
        title: 'Generate Video',
        subtitle: 'Generate AI marketing videos from product info and scripts'
      },
      {
        key: 'creativeLibrary',
        label: 'Creative Library',
        shortLabel: 'Lib',
        icon: 'Image',
        title: 'Creative Library',
        subtitle: 'Browse and manage your creative assets'
      }
    ]
  },
  {
    key: 'analysis',
    label: 'Analysis',
    shortLabel: 'Anls',
    icon: 'BarChart3',
    children: [
      {
        key: 'insights360',
        label: '360° Insights',
        shortLabel: '360',
        icon: 'PieChart',
        title: '360° Insights',
        subtitle: 'Comprehensive 360-degree view of campaign insights'
      },
      {
        key: 'aiAnalysis',
        label: 'AI Analysis',
        shortLabel: 'Anal',
        icon: 'BrainCircuit',
        title: 'AI Analysis',
        subtitle: 'AI-powered campaign analysis and recommendations'
      },
      {
        key: 'audit360',
        label: '360° Audit',
        shortLabel: 'Audit',
        icon: 'PieChart',
        title: '360° Audit',
        subtitle: '360° Meta Audit — funnel metrics and insight tabs'
      }
    ]
  },
  {
    key: 'brandCenter',
    label: 'Brand Center',
    shortLabel: 'Brand',
    icon: 'ShieldCheck',
    children: [
      {
        key: 'brandProfile',
        label: 'Brand Profile',
        shortLabel: 'Prof',
        icon: 'Award',
        title: 'Brand Profile',
        subtitle: 'Comprehensive view of brand identity and market position'
      },
      {
        key: 'optimizeGoals',
        label: 'Optimize Goals',
        shortLabel: 'Goal',
        icon: 'Target',
        title: 'Optimize Goals',
        subtitle: 'Set and manage optimization goals'
      },
      {
        key: 'products',
        label: 'Products',
        shortLabel: 'Prod',
        icon: 'Package',
        title: 'Products',
        subtitle: 'Manage product information'
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
