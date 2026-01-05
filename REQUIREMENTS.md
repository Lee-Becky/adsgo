# AdsGo 广告投放管理系统 - 需求文档

## 项目概述

AdsGo 是一个智能广告投放管理系统，通过 AI 分析提供预算优化建议，帮助广告主提高投放效率和 ROI。

## 技术栈

- **前端框架**: React + Vite
- **UI 库**: Tailwind CSS
- **图标库**: Lucide React
- **部署**: ngrok（用于公网访问）

---

## 用户使用场景旅程

### 场景一：每日查看广告投放概况

**用户目标**: 快速了解今日广告投放的整体表现和关键指标

**用户旅程**:
1. 用户登录系统，进入首页
2. 首先查看左侧的 "Today's Overview" 卡片
3. 阅读自然语言描述的性能摘要，了解整体表现
4. 查看 "Today's Highlights" 了解表现优异的 campaign
5. 查看 "Key Insights" 了解需要关注的问题
6. 如果需要更详细的分析，点击 "View Details" 按钮
7. 打开 "Overall Insight" 右侧抽屉
8. 查看顶部三个关键指标：Total Budget Today、Avg Cost/Conv.、ROAS
9. 查看性能概览、关键发现、渠道表现等详细信息
10. 查看 AI 推荐行动和风险评估
11. 点击关闭按钮返回首页

**涉及组件**:
- OverallAnalysis（Today's Overview 卡片）
- OverallAnalysis 抽屉（Overall Insight）

**数据联动**:
- 今日总预算、平均转化成本、ROAS 从所有 campaign 的数据汇总计算
- 渠道表现数据来自不同平台的 campaign 表现

---

### 场景二：配置优化规则

**用户目标**: 设置自己的优化规则，让 AI 根据这些规则提供监控和建议

**用户旅程**:
1. 用户查看首页右侧的 "Optimize Preferences" 卡片
2. 如果还没有配置规则，卡片显示提示文案
3. 点击 "Config" 按钮打开配置弹窗
4. 在输入框中输入第一条优化规则（例如："7日ROAS小于2.0关闭Campaign"）
5. 点击加号按钮添加规则
6. 继续添加更多规则（可选）
7. 点击 "Save" 按钮保存所有规则
8. 弹窗关闭，Optimize Preferences 卡片显示已配置的规则列表
9. AI 将根据这些规则监控 campaign 状态并提供优化建议

**涉及组件**:
- OptimizePreferences（卡片）
- OptimizePreferences 配置弹窗

**数据联动**:
- 保存的规则存储在组件状态中
- 这些规则可以影响 AI 的预算建议逻辑（未来功能）

---

### 场景三：筛选查看特定数据

**用户目标**: 查看特定时间段的广告投放数据

**用户旅程**:
1. 用户查看表格上方的 Filter Section
2. 点击 "Today" 按钮查看今日数据（默认选中）
3. 或者点击 "Yesterday" 查看昨日数据
4. 或者点击 "Last 7 Days" 查看过去7天数据
5. 或者点击 "Last 30 Days" 查看过去30天数据
6. 或者点击 "Custom" 自定义日期范围
7. 点击 "Custom" 后，显示日历选择器
8. 左侧快速按钮：Today、Yesterday、This Week、This Month
9. 右侧日历：选择 Start Date 和 End Date
10. 点击 "Confirm" 按钮确认日期范围
11. 表格数据根据选择的日期范围刷新
12. 今日概览和优化偏好卡片保持不变

**涉及组件**:
- FilterSection
- 日历选择器

**数据联动**:
- 日期选择会影响 Campaign Table 显示的数据
- 日期选择会影响 Overall Insight 抽屉中的指标计算
- 今日概览卡片不受日期筛选影响，始终显示今日数据

---

### 场景四：采纳 AI 预算建议（Approve）

**用户目标**: 同意 AI 的预算调整建议

**用户旅程**:
1. 用户在 Campaign Table 中查看 Optimize 列的推荐预算卡片
2. 阅读推荐预算金额和三条优化原因
3. 如果需要更详细的分析，点击 "More Insights" 链接
4. 打开 "Optimization Detail" 右侧抽屉
5. 查看顶部预算信息：Current Daily Budget、Recommended Budget、Last 7 Days Spend
6. 查看关键指标：ROI、Cost Change、Status
7. 阅读 AI 预算调整原因的详细说明
8. 查看支持数据和风险警告
9. 如果同意建议，点击抽屉底部的 "Approve" 按钮
10. 或者在表格中直接点击推荐预算卡片的 "Approve" 按钮
11. 推荐预算卡片置灰
12. Reject/Approve 按钮隐藏
13. 显示绿色 "Approved" 标签
14. 抽屉中的按钮也更新为显示 "Approved" 标签
15. 状态同步到所有相关位置（表格、抽屉）

**涉及组件**:
- CampaignTable（Optimize 列）
- BudgetReasonModal（Optimization Detail 抽屉）

**数据联动**:
- Approve 操作更新 budgetStatus 状态
- 状态在表格和抽屉之间同步
- Approved 状态的 campaign/adset 的推荐预算卡片会置灰并显示标签
- 预算建议被采纳后，可能触发实际的预算调整（未来功能）

---

### 场景五：拒绝 AI 预算建议（Reject）

**用户目标**: 不同意 AI 的预算调整建议，并提供反馈

**用户旅程**:
1. 用户在 Campaign Table 中查看 Optimize 列的推荐预算卡片
2. 如果不同意建议，点击 "Reject" 按钮
3. 或者在 Optimization Detail 抽屉中点击 "Reject" 按钮
4. 打开 "Feedback" 弹窗
5. 弹窗标题显示 "Feedback"
6. 弹窗显示引导文案："Please tell me why you did not adopt my suggestion, and I will improve its quality in future optimizations based on your reason."
7. 用户在文本域中填写拒绝原因（必填）
8. 例如："当前预算已经足够，不需要增加"
9. 点击 "Cancel" 按钮取消，返回之前的界面
10. 或点击 "Confirm Reject" 按钮确认
11. Feedback 弹窗关闭
12. 推荐预算卡片置灰
13. Reject/Approve 按钮隐藏
14. 显示红色 "Rejected" 标签
15. 抽屉中的按钮也更新为显示 "Rejected" 标签
16. AI 会根据反馈改进未来的建议质量

**涉及组件**:
- CampaignTable（Optimize 列）
- BudgetReasonModal（Optimization Detail 抽屉）
- FeedbackModal

**数据联动**:
- Reject 操作更新 budgetStatus 状态为 rejected
- Feedback 数据可以发送给后端用于改进 AI 模型
- 状态在表格和抽屉之间同步
- Rejected 状态的 campaign/adset 的推荐预算卡片会置灰并显示标签

---

### 场景六：修改预算（Budget Edit）

**用户目标**: 修改 campaign 或 adset 的预算

**用户旅程**:
1. 用户在 Campaign Table 的 Daily Budget 列点击编辑按钮
2. 打开 "Budget Edit Modal" 弹窗
3. 弹窗显示 Campaign 或 Adset 名称
4. 显示当前日预算
5. 显示推荐预算提示（如果有）
6. 在同一行有两个输入框：
   - 左侧：New Daily Budget 输入框（宽度 140px，带 ¥ 符号）
   - 右侧：Reason for manual modification (optional) 输入框（占据剩余空间）
7. 用户在预算输入框中输入新的预算金额
8. 用户在 Reason 输入框中填写修改原因（选填）
9. 点击 "Save" 按钮
10. 如果新预算 = 推荐预算：
    - 直接保存预算
    - 弹窗关闭
11. 如果新预算 ≠ 推荐预算：
    - 预算保存
    - 弹窗关闭
    - 推荐预算卡片置灰
    - 显示橙色 "Invalid (Modified)" 标签
    - 状态同步到所有相关位置

**涉及组件**:
- CampaignTable（Daily Budget 列）
- BudgetEditModal

**数据联动**:
- Budget Edit Modal 根据预算级别显示不同的编辑模式
- Campaign 级别：编辑单个 campaign 预算
- Adset 级别：编辑单个 adset 预算，或编辑 campaign 下所有 adsets 预算
- 修改后的预算更新到 campaign/adset 数据中
- Reason 数据可以发送给后端用于分析
- budgetStatus 更新为 invalid_modified（如果修改 ≠ 建议）
- 状态在表格和抽屉之间同步

---

### 场景七：查看 Adset 详情

**用户目标**: 查看 Adset 的详细图片信息

**用户旅程**:
1. 用户在 Campaign Table 中展开 campaign（点击展开/收起按钮）
2. 显示该 campaign 下的所有 adsets
3. 在某个 adset 行的 Campaign 列点击 "View detail" 链接
4. 打开 "Adset Detail Modal" 弹窗
5. 弹窗显示 adset 名称
6. 弹窗显示 adset 的详细图片
7. 点击关闭按钮或点击背景关闭弹窗

**涉及组件**:
- CampaignTable（展开/收起功能）
- AdsetDetailModal

**数据联动**:
- 展开/收起功能控制 adsets 行的显示/隐藏
- AdsetDetailModal 显示当前点击的 adset 的图片信息

---

### 场景八：查看 Campaign 详细分析

**用户目标**: 查看 Campaign 的详细分析数据

**用户旅程**:
1. 用户在 Campaign Table 的 Campaign 列点击 campaign 名称
2. 打开 "Campaign Analysis Modal" 弹窗
3. 弹窗显示 campaign 名称
4. 弹窗显示详细的分析数据
5. 点击关闭按钮或点击背景关闭弹窗

**涉及组件**:
- CampaignTable（Campaign 列）
- CampaignAnalysisModal

**数据联动**:
- CampaignAnalysisModal 显示当前点击的 campaign 的详细分析

---

## 组件功能及联动关系

### 1. OverallAnalysis（Today's Overview）

**功能**:
- 显示今日广告投放的整体性能摘要
- 提供快速查看和详细分析两种视图

**与其他组件的联动**:
- **CampaignTable**: 汇总所有 campaign 的数据计算今日总预算、平均转化成本、ROAS
- **FilterSection**: 不受日期筛选影响，始终显示今日数据
- **BudgetReasonModal**: 无直接联动

**数据来源**:
- Campaign Table 中所有 campaign 的 spend、results、resultValue、resultRoas 数据

---

### 2. OptimizePreferences

**功能**:
- 配置用户的优化规则
- 显示已配置的规则列表

**与其他组件的联动**:
- **CampaignTable**: 无直接联动（未来可能根据规则触发监控）
- **BudgetReasonModal**: 无直接联动
- **FilterSection**: 无联动

**数据存储**:
- 组件内部状态管理
- 未来可以存储到后端或 localStorage

---

### 3. FilterSection

**功能**:
- 筛选数据周期
- 自定义日期范围选择

**与其他组件的联动**:
- **CampaignTable**: 日期选择影响表格显示的数据
- **OverallAnalysis**: 不受影响，始终显示今日数据
- **OptimizePreferences**: 无联动
- **BudgetReasonModal**: 日期选择影响抽屉中的指标计算

**数据影响范围**:
- Campaign Table 的所有 campaign 和 adset 数据
- Overall Insight 抽屉中的所有指标

---

### 4. CampaignTable

**功能**:
- 显示所有 campaign 和 adset 的数据
- 支持 campaign 级别和 adset 级别的预算管理
- 提供 Reject/Approve 按钮处理 AI 建议
- 支持 展开/收起功能查看 adsets
- 提供预算编辑功能

**与其他组件的联动**:
- **OverallAnalysis**: 提供数据源计算今日总预算、平均转化成本、ROAS
- **FilterSection**: 根据日期筛选显示数据
- **BudgetReasonModal**: 点击 More Insights 传递 campaign/adset 数据
- **BudgetEditModal**: 点击预算编辑按钮传递 campaign/adset 数据
- **FeedbackModal**: 点击 Reject 按钮触发反馈弹窗
- **AdsetDetailModal**: 点击 View detail 传递 adset 数据

**状态管理**:
- budgetStatus: 记录每个 campaign/adset 的预算状态（pending/approved/rejected/invalid_modified）
- 展开状态: 记录每个 campaign 的展开/收起状态

---

### 5. BudgetReasonModal（Optimization Detail）

**功能**:
- 显示详细的预算优化分析
- 提供 Reject/Approve 按钮处理建议
- 显示预算信息、关键指标、AI 原因、支持数据、风险警告

**与其他组件的联动**:
- **CampaignTable**: 
  - 接收 campaign/adset 数据
  - 传递 handleApprove 和 handleReject 函数
  - 传递 onBudgetStatusChange 函数更新状态
- **FeedbackModal**: 点击 Reject 按钮触发反馈弹窗
- **FilterSection**: 日期选择影响抽屉中的指标计算
- **BudgetEditModal**: 无直接联动

**状态同步**:
- Approve/Reject 操作会更新 CampaignTable 中的 budgetStatus
- 状态变化会立即反映在表格和抽屉中

---

### 6. BudgetEditModal

**功能**:
- 编辑 campaign 或 adset 的预算
- 支持三种编辑模式
- 在预算输入框右侧提供 Reason for manual modification 输入框（选填）

**与其他组件的联动**:
- **CampaignTable**: 
  - 接收 campaign/adset 数据
  - 传递 onSave 函数保存预算
  - 传递 onUpdateBudgetStatus 函数更新状态
- **BudgetReasonModal**: 无直接联动

**编辑模式**:
1. Campaign 级别 - 编辑单个 Campaign
2. Adset 级别 - 编辑单个 Adset
3. Adset 级别 - 编辑 Campaign 下所有 Adsets

**界面布局**:
- 左侧：New Daily Budget 输入框（固定宽度 140px，带 ¥ 符号在最左侧）
- 右侧：Reason for manual modification (optional) 输入框（占据剩余空间）

**状态更新**:
- 如果修改 ≠ 建议，budgetStatus 更新为 invalid_modified
- 状态同步到 CampaignTable

---

### 7. FeedbackModal

**功能**:
- 收集用户对 AI 建议的反馈
- 支持 Reject 场景

**与其他组件的联动**:
- **CampaignTable**: Reject 场景：通过 handleReject 触发
- **BudgetReasonModal**: 点击 Reject 按钮触发

**反馈数据**:
- 可以发送给后端用于改进 AI 模型
- 记录用户拒绝建议的原因

---

### 8. AdsetDetailModal

**功能**:
- 显示 adset 的详细图片

**与其他组件的联动**:
- **CampaignTable**: 点击 View detail 传递 adset 数据

**数据来源**:
- CampaignTable 中的 adset 数据

---

### 9. CampaignAnalysisModal

**功能**:
- 显示 campaign 的详细分析数据

**与其他组件的联动**:
- **CampaignTable**: 点击 campaign 名称传递 campaign 数据

**数据来源**:
- CampaignTable 中的 campaign 数据

---

## 状态管理

### Budget Status

每个 campaign/adset 有以下状态：

| 状态 | 说明 | 触发条件 |
|------|------|----------|
| pending | 待处理（默认） | 初始状态 |
| approved | 已采纳建议 | 点击 Approve 按钮 |
| rejected | 已拒绝建议 | 点击 Reject + 填写反馈 |
| invalid_modified | 用户修改了预算 | 修改预算 ≠ 建议值 + 填写反馈 |

### 状态流转图

```
pending
  │
  ├─Approve──> approved
  │
  └─Reject──> rejected (触发 Feedback)
       │
       └─Budget Edit (修改 ≠ 建议)──> invalid_modified (触发 Feedback)
```

### 状态同步

- budgetStatus 存储在 App.jsx 中
- 通过 props 传递给 CampaignTable
- CampaignTable 通过 onBudgetStatusChange 回调更新状态
- 状态变化会立即反映在表格和抽屉中

---

## 数据结构

### Campaign 对象

```javascript
{
  id: number,                          // 唯一标识
  enabled: boolean,                    // 开启/关闭状态
  platform: 'Google' | 'Meta' | 'TikTok',  // 平台
  campaign: string,                    // Campaign 名称
  status: 'Active' | 'Paused',        // Campaign 状态
  budgetLevel: 'campaign' | 'adset',  // 预算级别
  dailyBudget: number,                 // 当前日预算
  suggestedBudget: number,             // 推荐预算
  budgetReason: BudgetReason | null,  // 预算建议原因
  spend: number,                       // 花费
  impressions: number,                 // 展示次数
  cpm: number,                         // 千次展示成本
  clicks: number,                      // 点击次数
  cpc: number,                         // 单次点击成本
  ctr: number,                         // 点击率
  results: number,                     // 转化次数
  costPerResult: number,               // 转化成本
  resultCvr: number,                   // 转化率
  resultValue: number,                 // 转化价值
  resultRoas: number,                  // 投资回报率
  expanded: boolean,                   // 展开/收起状态
  adsets: Adset[]                     // Adsets 列表
}
```

### Adset 对象

```javascript
{
  id: string,                          // 唯一标识
  name: string,                        // Adset 名称
  enabled: boolean,                    // 开启/关闭状态
  status: 'Active' | 'Paused',        // Adset 状态
  dailyBudget: number,                 // 当前日预算
  suggestedBudget: number,             // 推荐预算
  budgetReason: BudgetReason | null,  // 预算建议原因
  spend: number,                       // 花费
  impressions: number,                 // 展示次数
  cpm: number,                         // 千次展示成本
  clicks: number,                      // 点击次数
  cpc: number,                         // 单次点击成本
  ctr: number,                         // 点击率
  results: number,                     // 转化次数
  costPerResult: number,               // 转化成本
  resultCvr: number,                   // 转化率
  resultValue: number,                 // 转化价值
  resultRoas: number                   // 投资回报率
}
```

### BudgetReason 对象

```javascript
{
  type: 'increase' | 'decrease' | 'maintain',  // 建议类型
  reasons: string[],                   // 三条优化原因
  detailedReason: string,              // 详细说明
  metrics: {                          // 关键指标
    roi: number,                      // ROI
    change: string,                   // 变化百分比
    costChange: string                // 成本变化
  }
}
```

---

## 部署说明

### 开发环境

```bash
npm install
npm run dev
```

### 生产环境

```bash
npm run build
```

### 公网访问

使用 ngrok 进行隧道转发，访问地址：
```
https://unsegregative-multifoliate-natalia.ngrok-free.dev
```

---

## 未来扩展

### 计划功能

1. **实时数据同步**: 从广告平台 API 获取实时数据
2. **自动化优化**: 根据规则自动调整预算
3. **A/B 测试**: 支持创建和管理 A/B 测试
4. **报告生成**: 自动生成周报/月报
5. **团队协作**: 支持多用户协作和权限管理
6. **移动端适配**: 响应式设计，支持移动端访问

### 性能优化

1. **数据缓存**: 使用 React Query 或 SWR 缓存数据
2. **虚拟滚动**: 优化大数据量表格渲染
3. **代码分割**: 使用 React.lazy 和 Suspender
4. **图片优化**: 使用 WebP 格式和懒加载

---

**文档版本**: 2.0  
**最后更新**: 2026年1月4日  
**维护者**: AdsGo Team
