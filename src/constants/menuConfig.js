// AdsGo 2.0 Menu Configuration
// Used by Sidebar and Header — workspace-relative paths

import {
  MessageCircle, LayoutDashboard, FileBarChart, Monitor,
  Zap, Layers, FileText, Palette, Sparkles, Image,
  BarChart3, PieChart, BrainCircuit, Users, Eye,
  ShieldCheck, Award, Target, Link2, Database, Settings,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   MENU_ITEMS_V2 — 2.0 information architecture
   Each item has a `path` (workspace-relative) used for navigation.
   Groups use `children` for nested items.
   ═══════════════════════════════════════════════════════════ */

export const MENU_ITEMS_V2 = [
  {
    key: 'chat',
    label: 'Luna Chat',
    shortLabel: 'Luna',
    icon: 'MessageCircle',
    path: 'chat',
    title: 'Luna Chat',
    subtitle: 'AI-powered advertising assistant',
    isLuna: true,
  },
  {
    key: 'plan',
    label: 'Plan',
    icon: 'LayoutDashboard',
    children: [
      {
        key: 'media-plan',
        label: 'Media Plan',
        shortLabel: 'Plan',
        icon: 'LayoutDashboard',
        path: 'plan/media-plan',
        title: 'Media Plan',
        subtitle: 'Your advertising command center',
      },
      {
        key: 'strategy-cycle',
        label: 'Strategy Cycle',
        shortLabel: 'PDCA',
        icon: 'Target',
        path: 'plan/strategy-cycle',
        title: 'Strategy Cycle',
        subtitle: 'Weekly PDCA strategy cycle',
        isNew: true,
      },
    ],
  },
  {
    key: 'report',
    label: 'Data Reports',
    icon: 'FileBarChart',
    children: [
      {
        key: 'daily-brief',
        label: "Today's Brief",
        shortLabel: 'Brief',
        icon: 'FileBarChart',
        path: 'report/daily-brief',
        title: "Today's Brief",
        subtitle: 'AI-generated daily performance summary',
        isNew: true,
      },
      {
        key: 'performance',
        label: 'Performance',
        shortLabel: 'Perf',
        icon: 'BarChart3',
        path: 'report/performance',
        title: 'Performance',
        subtitle: 'Detailed performance data table',
        isNew: true,
      },
    ],
  },
  {
    key: 'ads',
    label: 'Ads',
    icon: 'Monitor',
    children: [
      {
        key: 'campaigns',
        label: 'Ad Manage',
        shortLabel: 'AdMgr',
        icon: 'Monitor',
        path: 'ads/campaigns',
        title: 'Ad Manage',
        subtitle: 'Unified management of cross-channel campaigns and AI-driven budget optimization',
      },
    ],
  },
  {
    key: 'create',
    label: 'Create',
    icon: 'Zap',
    children: [
      {
        key: 'campaign-gen',
        label: 'Campaign Generator',
        shortLabel: 'Gen',
        icon: 'Layers',
        path: 'create/campaign-gen',
        title: 'Campaign Generator',
        subtitle: 'High-performance multi-product campaign architecture orchestration',
      },
      {
        key: 'bulk-launch',
        label: 'Bulk Launch',
        shortLabel: 'Bulk',
        icon: 'Zap',
        path: 'create/bulk-launch',
        title: 'Bulk Launch',
        subtitle: 'High-performance multi-product campaign architecture orchestration',
      },
      {
        key: 'draft',
        label: 'Drafts & Preview',
        shortLabel: 'Draft',
        icon: 'FileText',
        path: 'create/draft',
        title: 'Drafts & Preview',
        subtitle: 'Management of unpublished drafts and AI-driven campaign recommendations',
      },
    ],
  },
  {
    key: 'creative',
    label: 'Creative',
    icon: 'Palette',
    children: [
      {
        key: 'library',
        label: 'Library',
        shortLabel: 'Lib',
        icon: 'Image',
        path: 'creative/library',
        title: 'Library',
        subtitle: 'Browse and manage your creative assets',
      },
      {
        key: 'ai-gen',
        label: 'AI Generate',
        shortLabel: 'Aigc',
        icon: 'Sparkles',
        path: 'creative/ai-gen',
        title: 'AI Generate',
        subtitle: 'Generate ad creatives using AI',
      },
    ],
  },
  {
    key: 'insight',
    label: 'Insight',
    icon: 'BarChart3',
    children: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        shortLabel: 'Dash',
        icon: 'PieChart',
        path: 'insight/dashboard',
        title: 'Dashboard',
        subtitle: 'Comprehensive 360-degree view of campaign insights',
      },
      {
        key: 'audience',
        label: 'Audience',
        shortLabel: 'Audn',
        icon: 'Users',
        path: 'insight/audience',
        title: 'Audience',
        subtitle: 'Audience insights and analysis',
      },
      {
        key: 'page',
        label: 'Page',
        shortLabel: 'Page',
        icon: 'Eye',
        path: 'insight/page',
        title: 'Page',
        subtitle: 'Landing page insights',
      },
      {
        key: 'creative-insight',
        label: 'Creative',
        shortLabel: 'Crtv',
        icon: 'Sparkles',
        path: 'insight/creative',
        title: 'Creative',
        subtitle: 'Creative performance insights',
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'Settings',
    children: [
      {
        key: 'brand-info',
        label: 'Brand Info',
        shortLabel: 'Info',
        icon: 'Award',
        path: 'settings/brand-info',
        title: 'Brand Info',
        subtitle: 'Comprehensive view of brand identity and market position',
      },
      {
        key: 'accounts',
        label: 'Ad Accounts',
        shortLabel: 'Acct',
        icon: 'Link2',
        path: 'settings/accounts',
        title: 'Ad Accounts',
        subtitle: 'Manage connected ad accounts across platforms',
      },
      {
        key: 'goals',
        label: 'Goals & Red Lines',
        shortLabel: 'Goal',
        icon: 'Target',
        path: 'settings/goals',
        title: 'Goals & Red Lines',
        subtitle: 'Set optimization goals and alert thresholds',
      },
      {
        key: 'datasets',
        label: 'Datasets',
        shortLabel: 'Data',
        icon: 'Database',
        path: 'settings/datasets',
        title: 'Datasets',
        subtitle: 'Configure and manage data sources for AI optimization',
      },
      {
        key: 'skills',
        label: 'Skills & AI Config',
        shortLabel: 'Skill',
        icon: 'BrainCircuit',
        path: 'settings/skills',
        title: 'Skills & AI Config',
        subtitle: 'Configure Luna AI capabilities and automation',
        isNew: true,
      },
    ],
  },
]

/* ── Icon lookup map ────────────────────────────────────────── */
export const ICON_MAP = {
  MessageCircle, LayoutDashboard, FileBarChart, Monitor,
  Zap, Layers, FileText, Palette, Sparkles, Image,
  BarChart3, PieChart, BrainCircuit, Users, Eye,
  ShieldCheck, Award, Target, Link2, Database, Settings,
}

/* ── Legacy compat: SETTINGS_MENU (used by older code paths) ── */
export const SETTINGS_MENU = {
  key: 'settings',
  label: 'Brand Management',
  icon: 'Settings',
  title: 'Brand Management',
  subtitle: 'The business suite defines how the AI evaluates performance and optimizes your ads.',
}

/* ── Keep legacy MENU_ITEMS as alias for any remaining consumers ── */
export const MENU_ITEMS = MENU_ITEMS_V2

/* ═══════════════════════════════════════════════════════════
   getPageInfo — resolve page title/subtitle from menu config
   Accepts a route segment key (e.g. 'media-plan', 'campaigns')
   or a full path segment (e.g. 'plan/media-plan').
   ═══════════════════════════════════════════════════════════ */
export const getPageInfo = (pageKey) => {
  const findPage = (items) => {
    for (const item of items) {
      // Match by key or path
      if (item.key === pageKey || item.path === pageKey) return item
      // Match by last segment of path (e.g. 'media-plan' matches path 'plan/media-plan')
      if (item.path && item.path.split('/').pop() === pageKey) return item
      if (item.children) {
        const found = findPage(item.children)
        if (found) return found
      }
    }
    return null
  }

  const page = findPage(MENU_ITEMS_V2)

  if (page) {
    return {
      title: page.title || page.label,
      subtitle: page.subtitle || '',
    }
  }

  // Fallback
  return {
    title: 'Home',
    subtitle: 'Ad campaign overview and real-time optimization',
  }
}
