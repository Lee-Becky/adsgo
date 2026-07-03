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
    label: 'Luna',
    shortLabel: 'Luna',
    icon: 'MessageCircle',
    path: 'chat',
    title: 'Luna',
    subtitle: '账户异常、预算建议、素材换新、客户报告',
    isLuna: true,
  },
  {
    key: 'plan',
    label: '媒体计划与策略',
    icon: 'LayoutDashboard',
    path: 'plan/media-plan',
    title: '媒体计划与策略',
    subtitle: '月度全球计划、周次闭环与人机协同',
    isNew: true,
  },
  {
    key: 'report',
    label: '数据报告与洞察',
    icon: 'FileBarChart',
    children: [
      {
        key: 'daily-brief',
        label: '客户日报',
        shortLabel: '日报',
        icon: 'FileBarChart',
        path: 'report/daily-brief',
        title: '客户日报',
        subtitle: '可直接分享给客户的投放日报',
        isNew: true,
      },
    ],
  },
  {
    key: 'ads',
    label: '广告管理',
    icon: 'Monitor',
    children: [
      {
        key: 'campaigns',
        label: '广告管理',
        shortLabel: '广告',
        icon: 'Monitor',
        path: 'ads/campaigns',
        title: '广告管理',
        subtitle: 'Campaign、AdSet、Ad 预算处理',
      },
    ],
  },
  {
    key: 'create',
    label: '广告创编与批量发布',
    icon: 'Zap',
    children: [
      {
        key: 'bulk-launch',
        label: '批量发布',
        shortLabel: '发布',
        icon: 'Zap',
        path: 'create/bulk-launch',
        title: '批量发布',
        subtitle: '字段检查、预算校验、发布前审核',
      },
      {
        key: 'draft',
        label: '草稿中心',
        shortLabel: '草稿',
        icon: 'FileText',
        path: 'create/draft',
        title: '草稿中心',
        subtitle: '换新素材、投放结构、发布审核',
      },
    ],
  },
  {
    key: 'creative',
    label: '创意库',
    icon: 'Palette',
    children: [
      {
        key: 'library',
        label: '素材库',
        shortLabel: '素材',
        icon: 'Image',
        path: 'creative/library',
        title: '素材库',
        subtitle: '疲劳素材、稳定素材、待换新草稿',
      },
      {
        key: 'ai-gen',
        label: '素材生成',
        shortLabel: '生成',
        icon: 'Sparkles',
        path: 'creative/ai-gen',
        title: '素材生成',
        subtitle: 'UGC Hook、卖点角度、素材变体',
      },
    ],
  },
  {
    key: 'insight',
    label: '核心数据趋势及洞察',
    icon: 'BarChart3',
    children: [
      {
        key: 'dashboard',
        label: '数据洞察看板',
        shortLabel: '看板',
        icon: 'PieChart',
        path: 'insight/dashboard',
        title: '数据洞察看板',
        subtitle: '优化师自用 · 趋势、维度拆解与 Luna 深度分析',
      },
    ],
  },
  {
    key: 'settings',
    label: '品牌配置中心',
    icon: 'Settings',
    children: [
      {
        key: 'brand-info',
        label: '品牌信息',
        shortLabel: '品牌',
        icon: 'Award',
        path: 'settings/brand-info',
        title: '品牌信息',
        subtitle: '品牌、市场、竞品、投放约束',
      },
      {
        key: 'accounts',
        label: '广告账号',
        shortLabel: '账号',
        icon: 'Link2',
        path: 'settings/accounts',
        title: '广告账号',
        subtitle: '平台账号、投放市场、连接状态',
      },
      {
        key: 'goals',
        label: '目标与阶段',
        shortLabel: '目标',
        icon: 'Target',
        path: 'settings/goals',
        title: '目标与阶段',
        subtitle: 'ROAS/CPA 目标、预算边界与策略阶段',
      },
      {
        key: 'datasets',
        label: '数据集',
        shortLabel: '数据',
        icon: 'Database',
        path: 'settings/datasets',
        title: '数据集',
        subtitle: '广告表现、素材表现、订单字段',
      },
      {
        key: 'skills',
        label: 'Luna 配置',
        shortLabel: '配置',
        icon: 'BrainCircuit',
        path: 'settings/skills',
        title: 'Luna 配置',
        subtitle: '预算建议、素材检查、报告口径',
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
  label: '品牌配置',
  icon: 'Settings',
  title: '品牌配置',
  subtitle: '目标、预算红线、市场、素材规则',
}

/* ── Keep legacy MENU_ITEMS as alias for any remaining consumers ── */
export const MENU_ITEMS = MENU_ITEMS_V2

/* ═══════════════════════════════════════════════════════════
   getPageInfo — resolve page title/subtitle from menu config
   Accepts a route segment key (e.g. 'media-plan', 'campaigns')
   or a full path segment (e.g. 'plan/media-plan').
   ═══════════════════════════════════════════════════════════ */
export const getPageInfo = (pageKey) => {
  const normalizedKey = pageKey === 'strategy-cycle' || pageKey === 'plan/strategy-cycle'
    ? 'plan/media-plan'
    : pageKey

  const findPage = (items) => {
    for (const item of items) {
      // Match by key or path
      if (item.key === normalizedKey || item.path === normalizedKey) return item
      // Match by last segment of path (e.g. 'media-plan' matches path 'plan/media-plan')
      if (item.path && item.path.split('/').pop() === normalizedKey) return item
      if (item.path && item.path === pageKey) return item
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
    title: '首页',
    subtitle: '今日异常、预算动作、素材换新',
  }
}
