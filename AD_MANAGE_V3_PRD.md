# AdsGo Ad Manage V3 页面 PRD 文档

## 项目概述
AdsGo Ad Manage V3 是一个智能化的跨渠道广告投放管理页面，通过集成 AI 诊断、多维度数据聚合与自动化规则引擎，帮助广告主实现高效的预算分配与策略优化。

## 技术栈
- **前端框架**: React + Vite
- **UI 库**: Tailwind CSS
- **动画/交互**: Framer Motion
- **数据可视化**: Recharts
- **图标库**: Lucide React

---

## 用户使用场景旅程

### 场景一：全渠道概览与 AI 诊断
**用户目标**: 快速掌握多平台投放现状及 AI 提供的宏观优化方向。
**用户旅程**:
1. 进入 V3 页面，默认看到 **Omnichannel** 视图。
2. 查看顶部 `DashboardInsightsHeader`，确认当前选中的 Ad Accounts 和全局 ROAS 目标。
3. 浏览 `CrossChannelAISummary` 的 AI 简报（Summary, Highlights, Risks）。
4. 观察“预算重配对比”：对比 `Current` 与 `Optimized` 蓝高亮金额，评估 AI 建议的调优空间。
5. 如需最新数据，点击 "Manual Analysis"，观察按钮旋转状态及倒计时。
**涉及组件**:
- DashboardInsightsHeader
- CrossChannelAISummary

### 场景二：多平台切换与细节聚焦
**用户目标**: 切换到特定平台（如 Meta 或 Google）查看详细广告表现。
**用户旅程**:
1. 在顶部 Tab 切换至 **Meta**。
2. `CampaignTable` 自动筛选显示 Meta 平台的 Campaign 数据。
3. 在 `FilterSection` 选择时间范围（如 "Last 7 Days"）。
4. 观察表格中的复合指标（如 CPA 及其下方的 CVR 指标）。
**涉及组件**:
- DashboardInsightsHeader (Tabs)
- FilterSection
- CampaignTable

### 场景三：采纳或拒绝 AI 预算建议
**用户目标**: 根据 AI 提供的优化理由，执行预算调整。
**用户旅程**:
1. 在 `CampaignTable` 的 "Optimize" 列看到推荐预算及简要理由。
2. 点击 "More Insights" 打开 `BudgetReasonModal` (抽屉)。
3. 在抽屉中查看决策摘要、过去 14 天操作历史及趋势图。
4. **采纳**: 点击 "Approve"，表格列更新为绿色 "Approved" 标签，状态置灰。
5. **拒绝**: 点击 "Reject"，弹出 `FeedbackModal`，输入至少 10 个字符的原因后提交，表格更新为红色 "Rejected" 标签。
**涉及组件**:
- CampaignTable
- BudgetReasonModal
- FeedbackModal

### 场景四：手动预算修改与状态失效
**用户目标**: 不完全采纳 AI 建议，根据经验手动设置预算。
**用户旅程**:
1. 点击表格中 `Daily Budget` 列的编辑图标。
2. 打开 `BudgetEditModal`。
3. 输入新预算值，并填写修改原因。
4. 若输入的值与 AI 建议值不符，保存后表格显示橙色 "Invalid (Modified)" 标签。
**涉及组件**:
- CampaignTable
- BudgetEditModal

### 场景五：自动化规则与自动驾驶 (Autopilot)
**用户目标**: 设定自动化策略，减少人工干预。
**用户旅程**:
1. 点击顶部 "Rule Library" 进入配置。
2. 设置阈值（如 ROAS < 2.0 则暂停）。
3. 开启 "AI Autopilot" 模式。系统自动执行建议并在表格中标记为 "Auto-applied"。
**涉及组件**:
- DashboardInsightsHeader
- RuleConfigModal (规则配置)

---

## 组件功能及联动关系

### 1. DashboardInsightsHeader (顶部导航与全局状态)
- **功能**: 平台切换、账号/目标展示、规则库入口。
- **联动**: 
  - 切换 Tab 触发 `CampaignTable` 和 `CrossChannelAISummary` 的数据重载。
  - 点击全局目标图标触发品牌配置更新。

### 2. CrossChannelAISummary (AI 智能诊断中心)
- **功能**: AI 文本简报、风险/亮点标记、预算重配对比图。
- **联动**: 
  - "Manual Analysis" 点击后进入 4 小时冷却锁，并同步更新全局 AI 状态。

### 3. FilterSection (过滤与搜索)
- **功能**: 日期筛选、关键词搜索。
- **联动**: 影响 `CampaignTable` 的数据范围及 `BudgetReasonModal` 内的图表统计周期。

### 4. CampaignTable (广告明细管理)
- **功能**: 多层级数据显示、开关控制、AI 建议展示。
- **联动**: 
  - 展开 Campaign 展示 Adset。
  - 点击 "More Insights" 打开 `BudgetReasonModal`。
  - 点击编辑预算打开 `BudgetEditModal`。

### 5. BudgetReasonModal (深度诊断抽屉)
- **功能**: 展示 AI 决策逻辑、趋势图、历史变动、品牌基准对比。
- **联动**: 内部的 Approve/Reject 操作会实时反馈至 `CampaignTable` 的状态列。

### 6. BudgetEditModal (预算编辑)
- **功能**: 手动修改预算，支持 "Apply AI Suggestion" 快捷填充。
- **联动**: 修改后的预算与 `budgetStatus` 标记位关联同步。

---

## 状态管理

### Budget Status (预算建议流转机)
| 状态 | 标签颜色 | 触发场景 |
| :--- | :--- | :--- |
| **Pending** | 蓝色 (默认) | AI 刚生成建议，等待处理 |
| **Approved** | 绿色 | 用户点击 Approve 或 Autopilot 自动通过 |
| **Auto-applied** | 绿色 | AI 自动驾驶模式下自动执行 |
| **Rejected** | 红色 | 用户点击 Reject 并提交反馈 |
| **Invalid (Modified)** | 橙色 | 用户手动修改预算且不等于 AI 建议值 |

### 状态联动逻辑
- **层级继承**: Campaign 暂停时，自动标记关联 Adset 为 `pausedByCampaign`；Campaign 开启时，仅恢复非手动关闭的 Adset。
- **数据同步**: App 级别维护全局 `campaignData` 状态，确保表格、抽屉、弹窗间的数据一致性。

---

## 数据结构

### Campaign/Adset 对象
```javascript
{
  id: string,
  platform: 'Meta' | 'Google' | 'TikTok',
  name: string,
  status: 'Active' | 'Paused',
  pausedByCampaign: boolean, // 仅 Adset 具有
  budget: number,
  recommendedBudget: number,
  budgetStatus: 'pending' | 'approved' | 'rejected' | 'invalid_modified' | 'auto_applied',
  metrics: {
    spend: number,
    roas: number,
    cpa: number,
    cvr: number,
    // ...其他核心指标
  },
  aiInsights: {
    reason: string[],
    trendData: Array<{date: string, value: number}>
  }
}
```

---

## 核心指标定义
- **ROAS**: 广告支出回报率 (Revenue / Spend)。
- **CPA**: 目标事件转化成本 (Spend / Conversions)。
- **CVR**: 转化率 (Conversions / Clicks)。
- **CPM**: 千次展示成本。

---

## 未来扩展
1. **策略沙盒**: 模拟不同预算分配方案下的预期 ROAS。
2. **素材实验室**: AI 自动识别高转化素材特征。
3. **跨平台重定向联动**: 基于 Meta 表现自动调整 Google 搜索词出价。

---
*文档版本: V3.0*  
*最后更新: 2026-01-19*
