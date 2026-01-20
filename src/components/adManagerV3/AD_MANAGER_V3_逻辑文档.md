# Ad Manager V3 详细逻辑文档

> 本文档面向前端工程师，详细说明 Ad Manager V3 页面的所有功能、数据流、状态管理和交互逻辑。

---

## 目录

1. [页面概述](#页面概述)
2. [组件架构](#组件架构)
3. [数据结构](#数据结构)
4. [状态管理](#状态管理)
5. [核心功能模块](#核心功能模块)
6. [交互流程](#交互流程)
7. [API 交互](#api-交互)
8. [样式规范](#样式规范)

---

## 页面概述

Ad Manager V3 是一个跨渠道广告优化管理平台，支持 Meta、Google、TikTok 等多个广告平台的广告活动管理、预算优化和 AI 智能分析。

### 主要功能

- **多平台广告管理**：支持 Meta、Google、TikTok 等平台的广告活动统一管理
- **AI 智能优化**：基于数据分析提供预算调整建议
- **实时数据监控**：展示广告活动的关键指标和趋势
- **预算优化建议**：自动分析并提供预算增减建议
- **自动化执行**：支持手动审批和自动执行两种模式
- **详细数据分析**：提供 14 天历史数据、趋势分析、漏斗对比等深度洞察

---

## 组件架构

```
AdManagerV3 (主容器)
├── DashboardInsightsHeader (顶部导航栏)
├── CrossChannelAISummary (AI 分析摘要面板)
├── FilterSection (筛选区域)
├── CampaignTable (广告活动表格)
│   └── AdsetDetailModal (广告组详情弹窗)
│   └── FeedbackModal (反馈弹窗)
├── BudgetEditModal (预算编辑弹窗)
├── BudgetReasonModal (预算原因详情抽屉)
├── RuleConfigModal (规则配置弹窗)
└── BrandDataOverlay (品牌数据覆盖层)
```

---

## 数据结构

### 1. Campaign (广告活动) 对象

```javascript
{
  id: number,                    // 广告活动唯一标识
  enabled: boolean,              // 是否启用
  platform: 'Meta' | 'Google' | 'TikTok',  // 平台类型
  campaign: string,              // 广告活动名称
  adAccount: string,             // 广告账户
  status: 'Active' | 'Paused',  // 状态
  budgetLevel: 'campaign' | 'adset',  // 预算层级
  dailyBudget: number,           // 当前日预算
  suggestedBudget: number,       // AI 建议预算
  budgetReason: {                // 预算调整原因
    type: 'increase' | 'decrease' | 'maintain' | 'pause',
    reasons: string[],           // 原因列表
    detailedReason: string,      // 详细原因
    metrics: {
      roi: number,
      change: string,
      costChange: string
    }
  },
  spend: number,                 // 花费
  impressions: number,           // 展示次数
  cpm: number,                   // 千次展示成本
  clicks: number,                // 点击次数
  cpc: number,                   // 单次点击成本
  ctr: number,                   // 点击率
  event1s: number,               // 事件1次数
  cpaEvent1: number,             // 事件1 CPA
  cvrEvent1: number,             // 事件1 转化率
  event2s: number,               // 事件2次数
  cpaEvent2: number,             // 事件2 CPA
  cvrEvent2: number,             // 事件2 转化率
  purchases: number,             // 购买次数
  cpaPurchase: number,           // 购买 CPA
  cvrPurchase: number,           // 购买转化率
  purchaseValue: number,         // 购买价值
  roas: number,                  // 投资回报率
  expanded: boolean,             // 是否展开显示广告组
  adsets: Adset[]                // 广告组列表
}
```

### 2. Adset (广告组) 对象

```javascript
{
  id: string,                    // 广告组唯一标识
  name: string,                  // 广告组名称
  enabled: boolean,              // 是否启用
  status: 'Active' | 'Paused',  // 状态
  dailyBudget: number,           // 当前日预算
  suggestedBudget: number,       // AI 建议预算
  budgetReason: BudgetReason,    // 预算调整原因（同 Campaign）
  locations: string[],           // 定位地区
  spend: number,                 // 花费
  impressions: number,           // 展示次数
  cpm: number,                   // 千次展示成本
  clicks: number,                // 点击次数
  cpc: number,                   // 单次点击成本
  ctr: number,                   // 点击率
  event1s: number,               // 事件1次数
  cpaEvent1: number,             // 事件1 CPA
  cvrEvent1: number,             // 事件1 转化率
  event2s: number,               // 事件2次数
  cpaEvent2: number,             // 事件2 CPA
  cvrEvent2: number,             // 事件2 转化率
  purchases: number,             // 购买次数
  cpaPurchase: number,           // 购买 CPA
  cvrPurchase: number,           // 购买转化率
  purchaseValue: number,         // 购买价值
  roas: number                   // 投资回报率
}
```

### 3. BudgetStatus (预算状态) 对象

```javascript
{
  [campaignId]: 'pending' | 'approved' | 'rejected' | 'auto_applied' | 'invalid_modified'
}
```

**状态说明：**
- `pending`：待处理（初始状态）
- `approved`：已批准（手动批准）
- `rejected`：已拒绝（手动拒绝）
- `auto_applied`：自动应用（AI 自动执行模式）
- `invalid_modified`：无效修改（用户手动修改了预算，与建议不符）

---

## 状态管理

### AdManagerV3 主组件状态

```javascript
// 品牌数据状态
brandDataStatus: 'no-accounts' | 'fetching' | 'no-data' | 'success'

// 预算状态映射
budgetStatus: BudgetStatus

// 最后更新时间
lastUpdated: string

// 自动执行推荐开关
autoExecuteRecommendations: boolean

// 摘要面板折叠状态
isSummaryCollapsed: boolean

// 选中的广告活动
selectedCampaign: Campaign | null

// 各种弹窗显示状态
showCampaignAnalysis: boolean
showBudgetReason: boolean
showBudgetEdit: boolean
showConfigModal: boolean

// 预算原因数据
budgetReasonData: BudgetReason | null

// 目标列表
goals: Goal[]

// 广告活动列表
campaigns: Campaign[]

// 当前激活的标签页
activeTab: 'all' | 'meta' | 'google'
```

### CampaignTable 组件状态

```javascript
// 反馈弹窗
feedbackOpen: boolean
feedbackTarget: string | null

// 广告组详情弹窗
selectedAdset: Adset | null
isAdsetDetailOpen: boolean

// 排序配置
sortConfig: {
  key: string,
  direction: 'asc' | 'desc'
}

// 分页状态
currentPage: number
itemsPerPage: number

// 内部广告活动列表（当没有外部传入时使用）
internalCampaigns: Campaign[]
```

### CrossChannelAISummary 组件状态

```javascript
// 悬停的平台
hoveredPlatform: string | null

// 分析状态
isAnalyzing: boolean

// 分析冷却时间
analysisCooldown: number | null

// 冷却计时器 ID
cooldownIntervalId: number | null

// 用于强制重新渲染的 tick
tick: number

// 悬停的卡片
hoveredCard: 'daily' | 'autopilot' | null

// 模拟统计数据
mockStats: {
  increase: number,
  decrease: number,
  pause: number,
  maintain: number,
  totalCurrentBudget: number,
  totalSuggestedBudget: number
}
```

---

## 核心功能模块

### 1. DashboardInsightsHeader (顶部导航栏)

**功能：**
- 平台切换（全渠道、Meta、Google）
- 优化目标展示和编辑
- 规则库入口
- 摘要面板折叠/展开

**关键逻辑：**

#### 平台切换
```javascript
const handleTabChange = (tab) => {
  setActiveTab(tab)
  onActiveTabChange?.(tab)  // 通知父组件更新
}
```

- `tab` 可选值：`'all'` | `'meta'` | `'google'`
- 切换时会触发整个页面的数据过滤

#### 账户信息 Tooltip
- 鼠标悬停在 Meta/Google 按钮上时显示已连接的账户列表
- 使用 React Portal 实现层级控制（z-index: 999999）

#### 优化目标弹窗
- 点击目标按钮打开弹窗
- 显示两个目标卡片：US,UK 和 Global
- 点击"Go to modify"触发 `onEditBrandConfig` 回调

#### 折叠/展开
- 当 `activeTab !== 'google'` 时显示折叠按钮
- 点击切换 `isSummaryCollapsed` 状态

---

### 2. CrossChannelAISummary (AI 分析摘要面板)

**功能：**
- 展示关键指标（Spend、Event1s、CPA、ROAS）
- AI 分析摘要
- 关键亮点和潜在风险
- 预算优化统计
- 手动分析触发
- 每日分析 / AI 自动驾驶模式切换

**关键逻辑：**

#### 手动分析触发
```javascript
const handleManualAnalysis = () => {
  if (isAnalyzing || analysisCooldown) return
  
  setIsAnalyzing(true)
  
  // 模拟 5 秒分析过程
  setTimeout(() => {
    setIsAnalyzing(false)
    
    // 设置 4 小时冷却时间
    const cooldownEndTime = Date.now() + 4 * 60 * 60 * 1000
    setAnalysisCooldown(cooldownEndTime)
    
    // 启动倒计时计时器（每秒更新）
    const intervalId = setInterval(() => {
      setTick(prev => prev + 1)
    }, 1000)
    setCooldownIntervalId(intervalId)
    
    // 更新时间戳
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    onUpdateLastUpdated?.(timeStr)
    
    // 随机更新统计数据
    setMockStats(prev => ({
      increase: Math.max(0, prev.increase + Math.floor(Math.random() * 5) - 2),
      decrease: Math.max(0, prev.decrease + Math.floor(Math.random() * 3) - 1),
      pause: Math.max(0, prev.pause + Math.floor(Math.random() * 2) - 1),
      maintain: Math.max(0, prev.maintain + Math.floor(Math.random() * 2) - 1),
      totalCurrentBudget: 900,
      totalSuggestedBudget: 700 + Math.floor(Math.random() * 100)
    }))
  }, 5000)
}
```

**状态说明：**
- `isAnalyzing`：分析进行中，显示旋转图标和"Analyzing..."文本
- `analysisCooldown`：冷却时间，显示倒计时（格式：HH:MM:SS）
- 冷却时间结束后自动清除状态

#### 冷却时间格式化
```javascript
const formatCooldownTime = (endTime) => {
  if (!endTime) return null
  
  const remaining = endTime - Date.now()
  if (remaining <= 0) {
    // 冷却时间结束，清除状态
    setAnalysisCooldown(null)
    if (cooldownIntervalId) {
      clearInterval(cooldownIntervalId)
      setCooldownIntervalId(null)
    }
    return null
  }
  
  const hours = Math.floor(remaining / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
```

#### AI 洞察数据生成
```javascript
const aiInsights = useMemo(() => {
  const isInitial = lastUpdated === '2026-01-15 13:29'
  
  if (isInitial) {
    // 初始数据：详细的 Hifami 品牌分析
    return {
      summary: "The only Campaign for brand Hifami was paused on 01-12...",
      highlights: [
        "CTR improved from 14-day average of 1.97% to 7-day average of 2.55%...",
        "7-day cumulative conversions: 1,093...",
        // ...
      ],
      key_insights: [
        "ROAS remains at 0, indicating a technical anomaly...",
        "CVR continuously declined from 17.60% to 11.33%...",
        // ...
      ]
    }
  } else {
    // 分析后数据：基于 mockStats 的动态分析
    return {
      summary: `AI analysis complete. Current account performance is stable...`,
      highlights: [
        `${mockStats.increase} Campaigns identified with scaling potential...`,
        // ...
      ],
      key_insights: [
        "Recommend increasing investment in Google Search Ads...",
        // ...
      ]
    }
  }
}, [lastUpdated, mockStats, avgRoas])
```

#### 预算优化统计计算
```javascript
const budgetStats = useMemo(() => {
  // 优先使用 stateful 的 mockStats
  const stats = { ...mockStats }
  
  // 如果有真实的 campaigns 数据，则计算真实统计
  if (campaigns && campaigns.length > 0) {
    let realStats = {
      increase: 0,
      decrease: 0,
      pause: 0,
      maintain: 0,
      totalCurrentBudget: 0,
      totalSuggestedBudget: 0
    }
    
    campaigns.forEach(campaign => {
      if (!campaign.enabled) return
      
      if (campaign.budgetLevel === 'campaign') {
        // Campaign 级别预算
        if (campaign.status !== 'Paused' && campaign.budgetReason) {
          const type = campaign.budgetReason.type
          if (type === 'increase') realStats.increase++
          else if (type === 'decrease') realStats.decrease++
          else if (type === 'pause') realStats.pause++
          else if (type === 'maintain') realStats.maintain++
          
          realStats.totalCurrentBudget += campaign.dailyBudget
          realStats.totalSuggestedBudget += campaign.suggestedBudget
        } else if (campaign.status !== 'Paused') {
          realStats.totalCurrentBudget += campaign.dailyBudget
          realStats.totalSuggestedBudget += campaign.dailyBudget
        }
      } else {
        // Adset 级别预算
        campaign.adsets?.forEach(adset => {
          if (!adset.enabled) return
          
          if (adset.status !== 'Paused' && adset.budgetReason) {
            const type = adset.budgetReason.type
            if (type === 'increase') realStats.increase++
            else if (type === 'decrease') realStats.decrease++
            else if (type === 'pause') realStats.pause++
            else if (type === 'maintain') realStats.maintain++
            
            realStats.totalCurrentBudget += adset.dailyBudget
            realStats.totalSuggestedBudget += adset.suggestedBudget
          } else if (adset.status !== 'Paused') {
            realStats.totalCurrentBudget += adset.dailyBudget
            realStats.totalSuggestedBudget += adset.dailyBudget
          }
        })
      }
    })
    
    if (realStats.totalCurrentBudget > 0) {
      return realStats
    }
  }
  
  return stats
}, [campaigns, mockStats])
```

#### 每日分析 / AI 自动驾驶模式切换
```javascript
// 每日分析模式（默认）
- 显示为高亮状态（蓝色背景）
- 状态显示 "RUNNING"
- 需要 Manual Approval
- 点击后切换到 AI 自动驾驶模式

// AI 自动驾驶模式
- 显示为深色背景（黑色）
- 状态显示 "RUNNING"
- 7*24H 自动优化
- 点击后切换回每日分析模式
```

**视觉效果：**
- 每日分析：蓝色脉冲动画、日历图标
- AI 自动驾驶：雷达扫描动画、无限符号旋转

---

### 3. FilterSection (筛选区域)

**功能：**
- 平台筛选（仅在全渠道模式下显示）
- 账户筛选
- 广告活动状态筛选
- 数据时间段筛选（支持快速选择和自定义日期）

**关键逻辑：**

#### 数据时间段选择
```javascript
const periodOptions = [
  { label: 'Today', value: 'Today' },
  { label: 'Last 3 days', value: 'Last 3 days' },
  { label: 'Last 7 days', value: 'Last 7 days' },
  { label: 'Last 14 days', value: 'Last 14 days' },
  { label: 'Last 30 days', value: 'Last 30 days' }
]

const getPeriodDates = (period) => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  switch (period) {
    case 'Today':
      return { start: todayStr, end: todayStr }
    case 'Last 3 days':
      const last3 = new Date(today)
      last3.setDate(last3.getDate() - 2)
      return { start: last3.toISOString().split('T')[0], end: todayStr }
    // ... 其他时间段
  }
}

const handlePeriodClick = (period) => {
  setDataPeriod(period)
  const dates = getPeriodDates(period)
  setCustomStartDate(dates.start)
  setCustomEndDate(dates.end)
}
```

#### 自定义日历选择
```javascript
const generateCalendar = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()
  
  const days = []
  
  // 空白填充
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-1"></div>)
  }
  
  // 日期生成
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isStart = dateStr === customStartDate
    const isEnd = dateStr === customEndDate
    const isInRange = customStartDate && customEndDate && 
                     dateStr > customStartDate && dateStr < customEndDate
    
    days.push(
      <button
        key={day}
        onClick={() => {
          if (!customStartDate) {
            // 第一次点击：设置开始日期
            setCustomStartDate(dateStr)
            setDataPeriod('Custom')
          } else if (!customEndDate && dateStr >= customStartDate) {
            // 第二次点击：设置结束日期
            setCustomEndDate(dateStr)
            setDataPeriod('Custom')
          } else {
            // 第三次点击：重新开始
            setCustomStartDate(dateStr)
            setCustomEndDate('')
            setDataPeriod('Custom')
          }
        }}
        className="relative p-1 text-sm rounded hover:bg-indigo-50 transition-colors"
      >
        {day}
        {isStart && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-indigo-600 font-bold">START</span>}
        {isEnd && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-indigo-600 font-bold">END</span>}
        {isStart && !isEnd && <div className="absolute inset-0 bg-indigo-100 rounded"></div>}
        {isEnd && <div className="absolute inset-0 bg-indigo-100 rounded"></div>}
        {isInRange && <div className="absolute inset-0 bg-indigo-50 rounded"></div>}
      </button>
    )
  }
  
  return days
}
```

**交互流程：**
1. 点击日期 → 设置开始日期
2. 点击第二个日期（需 >= 开始日期）→ 设置结束日期
3. 点击第三个日期 → 重新开始选择

---

### 4. CampaignTable (广告活动表格)

**功能：**
- 广告活动列表展示
- 广告组详情展示（可展开/折叠）
- 预算建议批准/拒绝
- 预算编辑
- 广告活动/广告组启用/暂停
- 排序和分页
- 汇总数据展示

**关键逻辑：**

#### 数据过滤（基于平台标签）
```javascript
const filteredCampaigns = useMemo(() => {
  if (activeTab === 'meta') {
    return campaigns.filter(campaign => campaign.platform === 'Meta')
  } else if (activeTab === 'google') {
    return campaigns.filter(campaign => campaign.platform === 'Google')
  }
  return campaigns  // 'all' 返回所有
}, [campaigns, activeTab])
```

#### 排序功能
```javascript
const sortedCampaigns = useMemo(() => {
  const sorted = [...filteredCampaigns].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (sortConfig.direction === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })
  return sorted
}, [filteredCampaigns, sortConfig])

const handleSort = (key) => {
  setSortConfig(prev => ({
    key,
    direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
  }))
}
```

**支持排序的字段：**
- Spend（花费）
- Impressions（展示次数）
- CPM（千次展示成本）
- Clicks（点击次数）
- CPC（单次点击成本）
- Event1s（事件1次数）
- CPA-Event1（事件1 CPA）
- Event2s（事件2次数）
- CPA-Event2（事件2 CPA）
- Purchases（购买次数）
- CPA-Purchase（购买 CPA）
- Purchase Value（购买价值）

#### 分页功能
```javascript
const paginatedCampaigns = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return sortedCampaigns.slice(startIndex, endIndex)
}, [sortedCampaigns, currentPage])

const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
```

- 每页显示 10 条记录
- 支持上一页/下一页和页码跳转

#### 汇总数据计算
```javascript
const summaryData = useMemo(() => {
  const activeCampaigns = filteredCampaigns.filter(c => c.enabled)
  
  return {
    totalCampaigns: filteredCampaigns.length,
    activeCampaigns: activeCampaigns.length,
    totalSpend: filteredCampaigns.reduce((sum, c) => sum + c.spend, 0),
    totalImpressions: filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalClicks: filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0),
    avgCPM: filteredCampaigns.reduce((sum, c) => sum + c.cpm, 0) / filteredCampaigns.length,
    avgCPC: filteredCampaigns.reduce((sum, c) => sum + c.cpc, 0) / filteredCampaigns.length,
    avgCTR: filteredCampaigns.reduce((sum, c) => sum + c.ctr, 0) / filteredCampaigns.length,
    totalEvent1s: filteredCampaigns.reduce((sum, c) => sum + c.event1s, 0),
    avgCPAEvent1: filteredCampaigns.reduce((sum, c) => sum + c.cpaEvent1, 0) / filteredCampaigns.length,
    avgCVREvent1: filteredCampaigns.reduce((sum, c) => sum + c.cvrEvent1, 0) / filteredCampaigns.length,
    // ... 其他指标
    totalDailyBudget: /* 计算总日预算 */
  }
}, [filteredCampaigns])
```

#### 自动应用推荐（当 autoExecuteRecommendations 为 true 时）
```javascript
useEffect(() => {
  if (autoExecuteRecommendations) {
    filteredCampaigns.forEach(campaign => {
      const status = budgetStatus[campaign.id] || 'pending'
      if (status === 'pending' && campaign.status !== 'Paused') {
        onBudgetStatusChange(prev => ({ 
          ...prev, 
          [campaign.id]: 'auto_applied' 
        }))
      }
      
      // 自动应用广告组推荐
      campaign.adsets.forEach(adset => {
        const adsetStatus = budgetStatus[adset.id] || 'pending'
        if (adsetStatus === 'pending' && adset.status !== 'Paused' && adset.budgetReason) {
          onBudgetStatusChange(prev => ({ 
            ...prev, 
            [adset.id]: 'auto_applied' 
          }))
        }
      })
    })
  }
}, [autoExecuteRecommendations, budgetStatus, filteredCampaigns])
```

**逻辑说明：**
- 当 `autoExecuteRecommendations` 为 true 时，自动将所有 `pending` 状态的推荐标记为 `auto_applied`
- 只处理状态为 `Active` 的广告活动/广告组
- 同时处理 Campaign 级别和 Adset 级别的推荐

#### 广告活动启用/暂停
```javascript
const toggleCampaign = (id) => {
  setCampaigns(campaigns.map(c => 
    c.id === id ? { 
      ...c, 
      enabled: !c.enabled,
      status: c.enabled ? 'Paused' : 'Active',
      // Campaign 暂停时，自动暂停所有启用的 Ad Set
      // 已经手动暂停的 Ad Set 不设置标记
      // Campaign 启用时，只启用之前因为 Campaign 暂停而自动暂停的 Ad Set
      adsets: c.enabled 
        ? c.adsets.map(a => ({
            ...a,
            enabled: false,
            status: 'Paused',
            // 只对当前启用的 Ad Set 设置标记
            pausedByCampaign: a.enabled ? true : (a.pausedByCampaign || false)
          }))
        : c.adsets.map(a => ({
            ...a,
            // 只启用之前因为 Campaign 暂停而自动暂停的 Ad Set
            enabled: a.pausedByCampaign ? true : a.enabled,
            status: a.pausedByCampaign ? 'Active' : a.status,
            pausedByCampaign: false  // 清除标记
          }))
    } : c
  ))
}
```

**关键逻辑：**
1. **暂停 Campaign 时：**
   - 暂停所有当前启用的 Ad Set
   - 为这些 Ad Set 设置 `pausedByCampaign: true` 标记
   - 已经手动暂停的 Ad Set 不设置标记

2. **启用 Campaign 时：**
   - 只启用之前因为 Campaign 暂停而自动暂停的 Ad Set（`pausedByCampaign: true`）
   - 清除所有 Ad Set 的 `pausedByCampaign` 标记
   - 保持其他 Ad Set 的状态不变

#### 广告组启用/暂停
```javascript
const toggleAdset = (campaignId, adsetId) => {
  setCampaigns(campaigns.map(c => 
    c.id === campaignId 
      ? {
          ...c,
          adsets: c.adsets.map(a => 
            a.id === adsetId ? { 
              ...a, 
              enabled: !a.enabled,
              status: a.enabled ? 'Paused' : 'Active'
            } : a
          )
        }
      : c
  ))
  // Ad Set 暂停时，不影响 Campaign 状态
}
```

**重要：** Ad Set 的启用/暂停不影响 Campaign 的状态

#### 预算建议批准/拒绝
```javascript
const handleApprove = (id) => {
  onBudgetStatusChange(prev => ({ 
    ...prev, 
    [id]: autoExecuteRecommendations ? 'auto_applied' : 'approved' 
  }))
}

const handleReject = (id) => {
  setFeedbackTarget(id)
  setFeedbackOpen(true)
}

const handleFeedbackConfirm = (feedback) => {
  if (feedbackTarget) {
    onBudgetStatusChange(prev => ({ ...prev, [feedbackTarget]: 'rejected' }))
  }
  setFeedbackOpen(false)
  setFeedbackTarget(null)
}
```

**状态说明：**
- 批准时，根据 `autoExecuteRecommendations` 决定状态为 `approved` 还是 `auto_applied`
- 拒绝时，打开反馈弹窗收集用户反馈
- 提交反馈后，状态设置为 `rejected`

#### 平台图标获取
```javascript
const getPlatformLogo = (platform) => {
  switch (platform) {
    case 'Google':
      return (
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            {/* Google Logo SVG */}
          </svg>
          <span className="text-xs text-gray-600">{platform}</span>
        </div>
      )
    case 'Meta':
      return (
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            {/* Meta Logo SVG */}
          </svg>
          <span className="text-xs text-gray-600">{platform}</span>
        </div>
      )
    case 'TikTok':
      return (
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            {/* TikTok Logo SVG */}
          </svg>
          <span className="text-xs text-gray-600">{platform}</span>
        </div>
      )
    default:
      return <span className="text-xs text-gray-600">{platform}</span>
  }
}
```

#### 状态徽章
```javascript
const getStatusBadge = (status) => {
  switch (status) {
    case 'approved':
      return <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Approved</span>
    case 'auto_applied':
      return <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Auto-applied</span>
    case 'rejected':
      return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Rejected</span>
    case 'invalid_modified':
      return <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Invalid (Modified)</span>
    default:
      return null
  }
}
```

#### 预算变化信息
```javascript
const getBudgetChangeInfo = (suggestedBudget, currentBudget) => {
  if (suggestedBudget > currentBudget) {
    return {
      icon: <TrendingUp size={14} className="text-red-600" />,
      colorClass: 'text-red-600 font-semibold',
      change: 'increase'
    }
  } else if (suggestedBudget < currentBudget) {
    return {
      icon: <TrendingDown size={14} className="text-green-600" />,
      colorClass: 'text-green-600 font-semibold',
      change: 'decrease'
    }
  } else {
    return {
      icon: <Minus size={14} className="text-gray-500" />,
      colorClass: 'text-gray-500 font-semibold',
      change: 'maintain'
    }
  }
}
```

#### 地区标签
```javascript
const getCampaignLocations = (campaign) => {
  const allLocations = campaign.adsets.flatMap(adset => adset.locations || [])
  const uniqueLocations = [...new Set(allLocations)]
  return uniqueLocations
}

const LocationTags = ({ locations, maxVisible = 3 }) => {
  if (!locations || locations.length === 0) return <span className="text-xs text-gray-400">-</span>
  
  const visibleLocations = locations.slice(0, maxVisible)
  const hasMore = locations.length > maxVisible
  
  return (
    <div className="group relative">
      <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
        {visibleLocations.map((loc, idx) => (
          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {loc}
          </span>
        ))}
        {hasMore && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
            +{locations.length - maxVisible}
          </span>
        )}
      </div>
      {hasMore && (
        <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <div className="flex flex-wrap gap-1">
            {locations.map((loc, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {loc}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

### 5. BudgetEditModal (预算编辑弹窗)

**功能：**
- 编辑广告活动或广告组的日预算
- 显示当前预算和建议预算
- 应用 AI 建议
- 可选的修改原因

**关键逻辑：**

#### 预算提交
```javascript
const handleSubmit = (e) => {
  e.preventDefault()
  const newBudget = parseFloat(budget)
  const suggestedBudget = campaign.suggestedBudget
  
  // 保存预算
  onSave(campaign.id, newBudget, currentEditMode)
  
  // 如果修改后的预算与建议不符，标记为无效修改
  if (newBudget !== suggestedBudget && onUpdateBudgetStatus) {
    onUpdateBudgetStatus(campaign.id, 'invalid_modified')
  }
  
  setModificationReason('')
  onClose()
}
```

#### 应用 AI 建议
```javascript
const applyRecommendation = () => {
  if (campaign.suggestedBudget) {
    setBudget(campaign.suggestedBudget)
  }
}
```

#### 平台判断
```javascript
// 检查是否为非 Meta 平台
const isNonMetaPlatform = campaign.platform !== 'Meta' && 
                         (campaign.parentCampaign?.platform !== 'Meta')

// 非 Meta 平台隐藏 AI 建议和原因字段
{campaign.suggestedBudget && !isNonMetaPlatform && (
  // 显示 AI 建议
)}

{!isNonMetaPlatform && (
  // 显示原因字段
)}
```

---

### 6. BudgetReasonModal (预算原因详情抽屉)

**功能：**
- 展示详细的预算调整原因
- 14 天优化历史
- 原始数据表格
- 多维度时间序列分析
- 14 天关键指标趋势图
- 转化漏斗对比

**关键逻辑：**

#### 历史数据生成（模拟）
```javascript
const generateHistoryData = () => {
  const history = []
  const today = new Date()
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // 生成随机但合理的数据
    const budget = campaign.dailyBudget || 500
    const spendRatio = 0.8 + Math.random() * 0.4
    const spend = budget * spendRatio
    const impressions = Math.max(1, Math.floor(spend * 40 + Math.random() * 10000))
    const clicks = Math.max(1, Math.floor(impressions * (0.02 + Math.random() * 0.02)))
    const conversions = Math.max(1, Math.floor(clicks * (0.01 + Math.random() * 0.02)))
    const purchases = Math.max(1, Math.floor(conversions * (0.3 + Math.random() * 0.4)))
    
    history.push({
      date: dateStr,
      budget: budget,
      spend: spend,
      impressions: impressions,
      cpm: (spend / impressions) * 1000,
      cpc: spend / clicks,
      ctr: (clicks / impressions) * 100,
      conversions: conversions,
      cpa: spend / conversions,
      purchases: purchases,
      cpp: spend / purchases,
      operation: i === 0 || i === 7 || i === 3 || i === 10 ? 'Budget Adjustment' : null
    })
  }
  
  return history
}
```

#### 线性回归计算（趋势分析）
```javascript
const calculateLinearRegression = (data, key) => {
  const n = data.length
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0
  
  data.forEach((d, i) => {
    const val = d[key]
    sumX += i
    sumY += val
    sumXY += i * val
    sumXX += i * i
    sumYY += val * val
  })

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // 计算 R²（决定系数）
  const rNum = (n * sumXY - sumX * sumY)
  const rDen = Math.sqrt(Math.max(0, (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)))
  const rSquared = rDen === 0 ? 0 : Math.pow(rNum / rDen, 2)

  return { slope, rSquared, avg: sumY / n }
}
```

**返回值：**
- `slope`：斜率（正数表示上升趋势，负数表示下降趋势）
- `rSquared`：R² 值（0-1，越接近 1 表示趋势越明显）
- `avg`：平均值

#### 周期统计数据计算
```javascript
const calculatePeriodStats = (days) => {
  const periodData = history14.slice(-days)
  const sum = (key) => periodData.reduce((acc, d) => acc + (d[key] || 0), 0)
  const spend = sum('spend')
  const budget = periodData.reduce((acc, d) => acc + (d.budget || 0), 0)
  const conv = sum('conversions')
  const clicks = sum('clicks')
  const impressions = sum('impressions')
  
  return {
    spendTotal: spend,
    spendAvg: spend / days,
    convTotal: conv,
    convAvg: conv / days,
    cpa: spend / conv,
    cpaAchievement: (18 / (spend / conv)) * 100,  // 目标 CPA 为 18
    budgetUtilization: (spend / budget) * 100,
    ctr: (clicks / impressions) * 100,
    regRate: (conv / clicks) * 100,
    rank: Math.floor(Math.random() * 5) + 1,  // 模拟排名
  }
}
```

#### 周期洞察生成
```javascript
const getPeriodicAnalysisInsights = () => {
  const insights = []
  const p1 = periods['1d']
  const p14 = periods['14d']
  const p7 = periods['7d']

  // 预算利用率分析
  if (p1.budgetUtilization > 120) {
    insights.push({ 
      icon: <AlertCircle className="text-amber-500" />, 
      text: `Short-term budget overspending risk: Budget utilization in the last 24 hours reached ${p1.budgetUtilization.toFixed(1)}%, significantly higher than the 14-day average, recommend monitoring spend rate.` 
    })
  } else if (p1.budgetUtilization < 80) {
    insights.push({ 
      icon: <Info className="text-blue-500" />, 
      text: `Insufficient budget spend: Last 1 day spend only accounts for ${p1.budgetUtilization.toFixed(1)}% of budget, possibly affected by audience saturation or competitive environment.` 
    })
  } else {
    insights.push({ 
      icon: <CheckCircle className="text-green-500" />, 
      text: `Healthy budget utilization: Spend pace highly aligned with budget setting, utilization maintained in the golden range of 90%-110%.` 
    })
  }

  // CPA 趋势分析
  const cpaTrend = ((p1.cpa - p14.cpa) / p14.cpa) * 100
  if (cpaTrend < -10) {
    insights.push({ 
      icon: <TrendingDown className="text-green-500" />, 
      text: `CPA efficiency improvement: Last 1 day CPA ($${p1.cpa.toFixed(1)}) decreased by ${Math.abs(cpaTrend).toFixed(1)}% compared to 14-day average, model entered positive feedback cycle.` 
    })
  } else if (cpaTrend > 10) {
    insights.push({ 
      icon: <TrendingUp className="text-red-500" />, 
      text: `Core metric warning: Last 1 day CPA increased by ${cpaTrend.toFixed(1)}% compared to 14-day average, KPI achievement rate declined, need to check creative fatigue.` 
    })
  }

  // 转化率分析
  if (p1.regRate > p7.regRate) {
    insights.push({ 
      icon: <Zap className="text-blue-500" />, 
      text: `Funnel efficiency optimization: Registration conversion rate (CVR1) showed stepwise growth, increasing from 7-day average of ${p7.regRate.toFixed(2)}% to today's ${p1.regRate.toFixed(2)}%.` 
    })
  }

  // 排名分析
  if (p1.rank <= 3) {
    insights.push({ 
      icon: <Target className="text-purple-500" />, 
      text: `Category dominance: This series currently ranks in the top ${((p1.rank/12)*100).toFixed(0)}% winning zone under the same targeting and goal dimensions.` 
    })
  }

  insights.push({ 
    icon: <ShieldCheck size={14} className="text-green-600" />, 
    text: "Anomaly monitoring: Core metrics did not trigger circuit breaker threshold, system running smoothly, no abnormal performance due to media policy or API jitter." 
  })

  return insights.slice(0, 5)  // 最多返回 5 条洞察
}
```

#### 批准/拒绝逻辑
```javascript
const handleApprove = () => {
  if (campaign.handleApprove && typeof campaign.handleApprove === 'function') {
    campaign.handleApprove(campaign.id)
  }
  onClose()
}

const handleReject = () => {
  setFeedbackOpen(true)
}

const handleFeedbackConfirm = (feedback) => {
  if (campaign.id) {
    if (campaign.onBudgetStatusChange) {
      campaign.onBudgetStatusChange(prev => ({ ...prev, [campaign.id]: 'rejected' }))
    }
  }
  setFeedbackOpen(false)
  onClose()
}
```

---

### 7. 其他辅助组件

#### FeedbackModal (反馈弹窗)
- 收集用户拒绝预算建议的原因
- 支持自定义标题和按钮文本

#### AdsetDetailModal (广告组详情弹窗)
- 展示广告组的详细信息
- 基于广告组数据渲染

#### RuleConfigModal (规则配置弹窗)
- 配置优化规则
- 保存规则到状态或发送到后端

---

## 交互流程

### 1. 页面加载流程

```
1. AdManagerV3 组件初始化
   ├─ 设置初始状态
   ├─ 加载 mock 数据（或从 API 获取）
   └─ 渲染子组件

2. DashboardInsightsHeader 渲染
   ├─ 显示默认标签页（meta）
   ├─ 加载账户信息
   └─ 显示优化目标

3. CrossChannelAISummary 渲染
   ├─ 计算预算优化统计
   ├─ 生成 AI 洞察数据
   └─ 显示关键指标

4. FilterSection 渲染
   ├─ 初始化日期选择器
   └─ 显示筛选选项

5. CampaignTable 渲染
   ├─ 过滤广告活动（基于 activeTab）
   ├─ 排序广告活动
   ├─ 分页处理
   └─ 渲染表格
```

### 2. 平台切换流程

```
用户点击平台标签
  ↓
DashboardInsightsHeader.handleTabChange()
  ↓
更新 activeTab 状态
  ↓
通知父组件（onActiveTabChange）
  ↓
CampaignTable 重新过滤数据
  ↓
CrossChannelAISummary 更新显示
  ↓
页面重新渲染
```

### 3. 预算建议审批流程

#### 手动批准
```
用户点击 "Approve" 按钮
  ↓
CampaignTable.handleApprove()
  ↓
更新 budgetStatus 状态
  ↓
状态变为 'approved' 或 'auto_applied'
  ↓
UI 更新显示状态徽章
```

#### 手动拒绝
```
用户点击 "Reject" 按钮（向下拇指图标）
  ↓
CampaignTable.handleReject()
  ↓
打开 FeedbackModal
  ↓
用户填写反馈并提交
  ↓
CampaignTable.handleFeedbackConfirm()
  ↓
更新 budgetStatus 状态为 'rejected'
  ↓
关闭弹窗
  ↓
UI 更新显示状态徽章
```

### 4. 预算编辑流程

```
用户点击预算旁的编辑图标
  ↓
CampaignTable.onBudgetEditClick()
  ↓
打开 BudgetEditModal
  ↓
用户修改预算
  ↓
点击 "Apply AI Suggestion"（可选）
  ↓
或手动输入预算
  ↓
填写原因（可选）
  ↓
点击 "Save Changes"
  ↓
BudgetEditModal.handleSubmit()
  ↓
调用 onSave(campaignId, newBudget, editMode)
  ↓
更新 campaigns 状态
  ↓
如果新预算 ≠ 建议预算，标记为 'invalid_modified'
  ↓
关闭弹窗
  ↓
UI 更新显示新预算
```

### 5. 广告活动启用/暂停流程

```
用户点击开关按钮
  ↓
CampaignTable.toggleCampaign()
  ↓
更新 campaign.enabled 状态
  ↓
更新 campaign.status 状态
  ↓
如果是暂停操作：
  ├─ 暂停所有启用的 Ad Set
  ├─ 为这些 Ad Set 设置 pausedByCampaign: true
  └─ 保持手动暂停的 Ad Set 状态不变
  ↓
如果是启用操作：
  ├─ 只启用 pausedByCampaign: true 的 Ad Set
  ├─ 清除所有 Ad Set 的 pausedByCampaign 标记
  └─ 保持其他 Ad Set 状态不变
  ↓
UI 更新显示新状态
```

### 6. 手动分析流程

```
用户点击 "Manual Analysis" 按钮
  ↓
CrossChannelAISummary.handleManualAnalysis()
  ↓
检查是否正在分析或冷却中
  ↓
设置 isAnalyzing = true
  ↓
显示 "Analyzing..." 状态
  ↓
等待 5 秒（模拟分析）
  ↓
设置 isAnalyzing = false
  ↓
设置 4 小时冷却时间
  ↓
启动倒计时计时器
  ↓
更新 lastUpdated 时间戳
  ↓
随机更新 mockStats 数据
  ↓
生成新的 AI 洞察
  ↓
UI 更新显示分析结果
```

### 7. 每日分析 / AI 自动驾驶切换流程

```
用户点击模式卡片
  ↓
检查当前模式
  ↓
如果是每日分析模式：
  ├─ 切换到 AI 自动驾驶模式
  ├─ autoApply = true
  └─ CampaignTable 自动应用所有待处理推荐
  ↓
如果是 AI 自动驾驶模式：
  ├─ 切换到每日分析模式
  └─ autoApply = false
  ↓
UI 更新显示新模式
```

---

## API 交互

### 当前实现状态

**注意：** 当前版本主要使用 mock 数据，实际 API 交互需要后端配合。

### 需要实现的 API 接口

#### 1. 获取广告活动列表
```javascript
GET /api/campaigns
Query Parameters:
  - platform: 'all' | 'meta' | 'google'
  - account: string
  - status: 'all' | 'active' | 'paused'
  - startDate: string
  - endDate: string

Response:
{
  campaigns: Campaign[],
  lastUpdated: string
}
```

#### 2. 更新预算
```javascript
POST /api/campaigns/:id/budget
Body:
{
  budget: number,
  reason?: string,
  editMode: 'campaign' | 'single-adset'
}

Response:
{
  success: boolean,
  campaign: Campaign
}
```

#### 3. 批准预算建议
```javascript
POST /api/campaigns/:id/approve-budget
Body:
{
  autoApply: boolean
}

Response:
{
  success: boolean,
  status: 'approved' | 'auto_applied'
}
```

#### 4. 拒绝预算建议
```javascript
POST /api/campaigns/:id/reject-budget
Body:
{
  feedback: string
}

Response:
{
  success: boolean,
  status: 'rejected'
}
```

#### 5. 切换广告活动状态
```javascript
POST /api/campaigns/:id/toggle
Body:
{
  enabled: boolean
}

Response:
{
  success: boolean,
  campaign: Campaign
}
```

#### 6. 切换广告组状态
```javascript
POST /api/campaigns/:campaignId/adsets/:adsetId/toggle
Body:
{
  enabled: boolean
}

Response:
{
  success: boolean,
  adset: Adset
}
```

#### 7. 触发 AI 分析
```javascript
POST /api/analysis/trigger
Body:
{
  campaigns: Campaign[]
}

Response:
{
  success: boolean,
  lastUpdated: string,
  insights: AIInsights,
  budgetStats: BudgetStats
}
```

#### 8. 获取预算建议详情
```javascript
GET /api/campaigns/:id/budget-reason

Response:
{
  campaign: Campaign,
  reason: BudgetReason,
  history: HistoryData[],
  trends: TrendData[]
}
```

#### 9. 保存规则配置
```javascript
POST /api/rules/save
Body:
{
  rules: Rule[]
}

Response:
{
  success: boolean
}
```

---

## 样式规范

### Tailwind CSS 配置

页面使用 Tailwind CSS 进行样式管理，主要使用以下工具类：

#### 颜色
- `slate-*`：主要文本和边框颜色
- `indigo-*`：主要品牌色（按钮、链接、高亮）
- `blue-*`：次要品牌色（信息提示）
- `green-*`：成功状态
- `red-*`：错误状态
- `amber-*`：警告状态
- `gray-*`：中性状态

#### 间距
- `p-*`：内边距
- `m-*`：外边距
- `gap-*`：Flex/Grid 间距

#### 尺寸
- `w-*`：宽度
- `h-*`：高度
- `min-w-*`：最小宽度
- `max-w-*`：最大宽度

#### 圆角
- `rounded-*`：圆角
- `rounded-lg`：大圆角（8px）
- `rounded-xl`：超大圆角（12px）
- `rounded-2xl`：特大圆角（16px）

#### 阴影
- `shadow-sm`：小阴影
- `shadow-md`：中等阴影
- `shadow-lg`：大阴影
- `shadow-xl`：超大阴影
- `shadow-2xl`：特大阴影

#### 动画
- `transition-*`：过渡效果
- `animate-*`：关键帧动画
- `duration-*`：动画持续时间

### 自定义 CSS 类

#### badge
```css
.badge {
  @apply inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium;
}
.badge-success {
  @apply bg-green-100 text-green-700;
}
.badge-warning {
  @apply bg-yellow-100 text-yellow-700;
}
.badge-gray {
  @apply bg-gray-100 text-gray-700;
}
```

### 图标库

使用 `lucide-react` 图标库，主要图标包括：
- `Eye`：查看
- `Target`：目标
- `Zap`：闪电（规则）
- `Edit2`：编辑
- `TrendingUp`：上升趋势
- `TrendingDown`：下降趋势
- `CheckCircle`：成功
- `AlertCircle`：警告
- `RefreshCw`：刷新
- `X`：关闭
- 等等...

---

## 注意事项

### 1. 平台限制

- **Meta 平台**：支持完整的预算建议功能
- **Google 平台**：显示 "Coming soon"，暂不支持预算建议
- **TikTok 平台**：显示 "Coming soon"，暂不支持预算建议

### 2. 预算层级

- **Campaign 级别预算（CBO）**：预算在 Campaign 层级设置，Adset 自动分配
- **Adset 级别预算（ABO）**：每个 Adset 有独立预算

### 3. 状态管理

- 使用 React Hooks 进行状态管理
- 状态提升到父组件，通过 props 传递
- 使用 `useMemo` 和 `useCallback` 优化性能

### 4. 数据格式化

- 货币：使用 `Intl.NumberFormat` 格式化为美元
- 数字：使用 `toLocaleString()` 添加千位分隔符
- 日期：使用 `toLocaleDateString()` 格式化

### 5. 响应式设计

- 使用 Tailwind 的响应式前缀（`md:`, `lg:` 等）
- 表格支持横向滚动
- 弹窗和抽屉固定定位

### 6. 性能优化

- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存回调函数
- 虚拟滚动（如有大量数据）
- 防抖和节流（搜索、输入等）

### 7. 错误处理

- 添加 try-catch 处理异步操作
- 显示友好的错误提示
- 提供重试机制

### 8. 浏览器兼容性

- 使用现代浏览器 API
- 避免使用实验性功能
- 添加必要的 polyfill

---

## 开发建议

### 1. 组件拆分

- 保持组件单一职责
- 复用通用组件（如 Select、Modal、Drawer）
- 提取业务逻辑到自定义 Hook

### 2. 类型定义

- 使用 TypeScript 定义数据结构
- 为 props 添加类型注解
- 使用接口定义 API 响应

### 3. 测试

- 编写单元测试
- 编写集成测试
- 测试边界情况

### 4. 文档

- 保持代码注释清晰
- 更新 API 文档
- 记录业务逻辑变更

### 5. 性能监控

- 添加性能指标收集
- 监控渲染时间
- 优化慢查询

---

## 总结

Ad Manager V3 是一个功能完善的广告优化管理平台，具有以下特点：

1. **多平台支持**：统一管理 Meta、Google、TikTok 等平台
2. **AI 智能优化**：基于数据分析提供预算调整建议
3. **灵活的审批流程**：支持手动审批和自动执行
4. **详细的数据分析**：提供 14 天历史数据、趋势分析、漏斗对比
5. **良好的用户体验**：清晰的界面、流畅的交互、实时的反馈

本文档详细说明了页面的所有功能、数据流、状态管理和交互逻辑，为前端工程师提供了完整的开发参考。

---

**文档版本：** 1.0  
**最后更新：** 2026-01-20  
**维护者：** AdsGo 开发团队
