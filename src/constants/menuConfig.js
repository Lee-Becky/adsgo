// AdsGo 2.0 Menu Configuration
// Used by Sidebar and Header — workspace-relative paths

import {
  MessageCircle, LayoutDashboard, FileBarChart, Monitor,
  Zap, Layers, FileText, Palette, Sparkles, Image,
  BarChart3, PieChart, BrainCircuit, Users, Eye,
  ShieldCheck, Award, Target, Link2, Database, Settings, BellRing, TableProperties, Activity, Workflow, PackageSearch, ScanSearch,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   MENU_ITEMS_V2 — 2.0 information architecture
   Each item has a `path` (workspace-relative) used for navigation.
   Groups use `children` for nested items.
   ═══════════════════════════════════════════════════════════ */

export const MENU_ITEMS_V2 = [
  {
    key: 'chat',
    label: '今日工作台',
    shortLabel: 'Luna',
    icon: 'MessageCircle',
    path: 'chat',
    title: '今日工作台',
    subtitle: '集中处理异常、建议、执行、验证与交付事项',
    isLuna: true,
    isLunaWorkspace: true,
  },
  {
    key: 'plan',
    label: '计划与策略',
    icon: 'LayoutDashboard',
    path: 'plan/media-plan',
    title: '媒体计划与策略',
    subtitle: '月度全球计划、周次闭环与人机协同',
    isNew: true,
  },
  {
    key: 'ads',
    label: '广告运营',
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
      {
        key: 'draft',
        label: '草稿中心',
        shortLabel: '草稿',
        icon: 'FileText',
        path: 'create/draft',
        title: '草稿中心',
        subtitle: '暂存人工创编、AI 推荐及其他来源的待发布 Campaign',
      },
      {
        key: 'bulk-launch',
        label: '创编与发布工具',
        shortLabel: '发布',
        icon: 'Zap',
        path: 'create/bulk-launch',
        title: '广告创编与发布',
        subtitle: '从零创建或编辑广告结构，并完成发布前检查',
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
    label: '分析与复盘',
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
      {
        key: 'multidimensional',
        label: '多维分析',
        shortLabel: '分析',
        icon: 'TableProperties',
        path: 'insight/multidimensional',
        title: '多维分析',
        subtitle: '使用已保存视图进行维度拆解与指标对比',
        isNew: true,
      },
      {
        key: 'market-competitor',
        label: '市场与竞品',
        shortLabel: '市场',
        icon: 'ScanSearch',
        path: 'insight/market-competitor',
        title: '市场与竞品',
        subtitle: '市场趋势、竞品动态与应对策略',
        isNew: true,
      },
      {
        key: 'reports',
        label: '报告',
        shortLabel: '报告',
        icon: 'FileBarChart',
        path: 'insight/reports',
        title: '报告',
        subtitle: '模板化生成、定时发送与报告历史',
        isNew: true,
      },
      {
        key: 'operations-closure',
        label: '效果与复盘',
        shortLabel: '复盘',
        icon: 'Activity',
        path: 'insight/operations-closure',
        title: '效果与复盘',
        subtitle: '动作效果验证、经验沉淀与活动记录',
        isNew: true,
      },
    ],
  },
  {
    key: 'brand-foundation',
    label: '品牌基础配置',
    icon: 'Settings',
    children: [
      {
        key: 'brand-info',
        label: '品牌信息',
        shortLabel: '品牌',
        icon: 'Award',
        path: 'settings/brand-info',
        title: '品牌信息',
        subtitle: '维护品牌定位、受众、调性、核心价值与稳定红线',
      },
      {
        key: 'products',
        label: '产品库',
        shortLabel: '产品',
        icon: 'PackageSearch',
        path: 'settings/products',
        title: '产品库',
        subtitle: '管理品牌产品、卖点、市场与目标受众',
        isNew: true,
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
        subtitle: '管理广告、素材、离线与归因数据源',
      },
    ],
  },
  {
    key: 'brand-capability',
    label: '能力与协作配置',
    icon: 'BrainCircuit',
    children: [
      {
        key: 'automation-config',
        label: '自动化配置',
        shortLabel: '自动化',
        icon: 'Workflow',
        path: 'settings/automation',
        title: '自动化配置',
        subtitle: '统一管理定时任务与预警规则',
      },
      {
        key: 'skills',
        label: 'Skill 与知识库',
        shortLabel: '认知',
        icon: 'BrainCircuit',
        path: 'settings/skills',
        title: 'Skill 与知识库',
        subtitle: '管理品牌能力与四层知识体系',
        isNew: true,
        requiresManageBrand: true,
      },
      {
        key: 'members',
        label: '成员管理',
        shortLabel: '成员',
        icon: 'Users',
        path: 'settings/members',
        title: '成员管理',
        subtitle: '管理品牌成员、角色与操作权限',
        requiresManageBrand: true,
      },
      {
        key: 'skill-admin',
        label: 'Skill 管理后台',
        icon: 'Settings',
        path: 'settings/skill-admin',
        title: 'Skill 管理后台',
        subtitle: '平台管理员维护行业 Skill',
        hiddenInSidebar: true,
      },
    ],
  },
]

/* ── Icon lookup map ────────────────────────────────────────── */
export const ICON_MAP = {
  MessageCircle, LayoutDashboard, FileBarChart, Monitor,
  Zap, Layers, FileText, Palette, Sparkles, Image,
  BarChart3, PieChart, BrainCircuit, Users, Eye,
  ShieldCheck, Award, Target, Link2, Database, Settings, BellRing, TableProperties, Activity, Workflow, PackageSearch, ScanSearch,
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

  const findPage = (items, parentLabel = '日常运营') => {
    for (const item of items) {
      // Match by key or path
      if (item.key === normalizedKey || item.path === normalizedKey) return { ...item, section: parentLabel }
      // Match by last segment of path (e.g. 'media-plan' matches path 'plan/media-plan')
      if (item.path && item.path.split('/').pop() === normalizedKey) return { ...item, section: parentLabel }
      if (item.path && item.path === pageKey) return { ...item, section: parentLabel }
      if (item.path && item.path.split('/').pop() === pageKey) return { ...item, section: parentLabel }
      if (item.children) {
        const found = findPage(item.children, item.label)
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
      section: page.section || '日常运营',
    }
  }

  // Fallback
  return {
    title: '首页',
    subtitle: '今日异常、预算动作、素材换新',
    section: '日常运营',
  }
}
