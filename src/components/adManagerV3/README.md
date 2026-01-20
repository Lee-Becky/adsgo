# Ad Manager V3 独立模块

## 概述

Ad Manager V3 是一个完全独立的广告管理组件模块，所有逻辑、样式和数据都封装在 `adManagerV3` 文件夹内，**不存在任何跨文件夹引用**。

## 文件结构

```
adManagerV3/
├── AdManagerV3.jsx                 # 主组件
├── DashboardInsightsHeader.jsx      # 仪表板头部组件
├── CrossChannelAISummary.jsx       # 跨渠道AI摘要组件
├── FilterSection.jsx               # 筛选区域组件
├── CampaignTable.jsx               # 广告活动表格组件
├── BudgetEditModal.jsx             # 预算编辑模态框
├── BudgetReasonModal.jsx           # 预算原因模态框
├── FeedbackModal.jsx               # 反馈模态框
├── RuleConfigModal.jsx             # 规则配置模态框
├── AdsetDetailModal.jsx            # 广告组详情模态框
├── BrandDataOverlay.jsx            # 品牌数据覆盖层组件
├── mockData.js                     # Mock数据文件
├── index.js                        # 统一导出文件
└── README.md                       # 本文档
```

## 特性

### ✅ 完全独立
- 所有组件、样式、数据都在同一文件夹内
- 无跨文件夹引用（无 `../` 或 `../../` 引用）
- 无外部依赖引用（无 `src/` 或 `@/` 引用）

### ✅ 自包含
- 包含所有必需的子组件
- 包含Mock数据用于开发和测试
- 包含统一的导出接口

### ✅ 易于使用
- 通过 `index.js` 统一导出所有组件
- 清晰的文件命名和结构
- 完整的组件文档

## 使用方法

### 导入主组件

```javascript
import { AdManagerV3 } from './components/adManagerV3'

function App() {
  return (
    <AdManagerV3 
      onEditBrandConfig={handleEditConfig}
      selectedBrand="Your Brand Name"
    />
  )
}
```

### 导入单个组件

```javascript
import { 
  DashboardInsightsHeader,
  CampaignTable,
  BudgetEditModal 
} from './components/adManagerV3'
```

### 导入Mock数据

```javascript
import { 
  MOCK_CAMPAIGNS, 
  MOCK_GOALS, 
  MOCK_RULES,
  Platform 
} from './components/adManagerV3'
```

## 组件说明

### AdManagerV3 (主组件)
广告管理主界面，包含：
- 仪表板头部
- 跨渠道AI摘要
- 筛选区域
- 广告活动表格
- 各种模态框

**Props:**
- `onEditBrandConfig`: 编辑品牌配置的回调函数
- `selectedBrand`: 当前选中的品牌名称

### DashboardInsightsHeader
仪表板头部，显示优化概览和平台标签。

### CrossChannelAISummary
跨渠道AI摘要，显示：
- 关键指标（花费、事件数、CPA、ROAS）
- AI分析摘要
- 优化建议
- 自动应用开关

### CampaignTable
广告活动表格，支持：
- 分页显示
- 排序功能
- 预算建议审批
- 广告组展开/折叠

### 模态框组件
- **BudgetEditModal**: 编辑预算
- **BudgetReasonModal**: 查看预算调整原因
- **FeedbackModal**: 反馈意见
- **RuleConfigModal**: 配置优化规则
- **AdsetDetailModal**: 广告组详情

### BrandDataOverlay
品牌数据覆盖层，处理：
- 连接账户
- 创建活动
- 数据获取状态
- 错误处理

## Mock数据

### MOCK_CAMPAIGNS
模拟广告活动数据，包含：
- 活动基本信息
- 预算建议
- 性能指标
- 历史数据
- 广告组数据

### MOCK_GOALS
优化目标配置。

### MOCK_RULES
自动化规则配置。

### Platform
平台枚举（META, GOOGLE, TIKTOK）。

## 样式说明

- 使用 Tailwind CSS 进行样式设计
- 所有样式类名都在组件内部定义
- 无外部CSS文件依赖

## 注意事项

1. **独立性**: 本模块完全独立，可以单独复制到任何项目中使用
2. **无外部依赖**: 不依赖项目中的其他文件或组件
3. **Mock数据**: 包含完整的Mock数据，可用于独立开发测试
4. **响应式**: 所有组件都支持响应式设计

## 维护建议

- 保持所有组件在 `adManagerV3` 文件夹内
- 添加新组件时，记得更新 `index.js` 导出文件
- 保持Mock数据的完整性和一致性
- 遵循现有的代码风格和命名规范

## 版本历史

- V3.0.0: 初始独立版本，完全模块化
