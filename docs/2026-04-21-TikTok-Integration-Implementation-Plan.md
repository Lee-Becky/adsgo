# TikTok 融入 Batch Generate Ads 实施方案

> **视角**：从现有前端交互逻辑出发，评估需要做什么、改造什么  
> **核心结论**：现有架构 Campaign→Adset→Ad 与 TikTok 同构，绝大多数模块可复用。改造集中在"数据配置层"而非"架构层"。

---

## 一、现有页面完整交互流程（基线）

用户从进入 Batch Generate Ads 到发布的完整链路：

```
Step 1 — 产品/素材选择
  ├─ 选择投放类型：PRODUCT（落地页广告）/ CATALOG（目录广告）
  ├─ 选择/上传产品 + 绑定素材
  └─ AI 分析产品

Step 2 — 投放目标与渠道（TargetingChannelCard）
  ├─ 选择投放国家/地区
  ├─ 选择投放语言
  ├─ 选择投放渠道媒体 ← 用户先选平台
  ├─ 选择 Promote Objective ← 目标跟随平台变化
  │   ├── 一级：Campaign Objective（如 Traffic / Sales / Leads）
  │   ├── 二级：Conversion Goal（如 link_clicks / in_web_actions）
  │   └── 三级：Event（如 Purchase / AddToCart）—— 仅部分 goal 需要
  └─ AI 推荐配置（可选）

Step 3 — 架构与预算（CampaignPlanView）
  ├─ 选择拆分策略：PER_PRODUCT / ALL_PRODUCTS_PER_SET / BY_CREATIVE / AI_STRATEGY
  ├─ 设置 Adset 组数
  ├─ 选择 Ad Format：FLEXIBLE / SINGLE（仅 sales_conversions / app_promotion 显示）
  ├─ 预算：CBO / ABO + 日预算
  └─ 受众分配：ADV / LAL / INT / CUSTOM

Step 4 — 高级设置
  ├─ 命名模板
  ├─ 落地页策略
  ├─ 文案策略
  └─ 排期

Step 5 — 预览树（CampaignPreviewView）
  └─ Campaign → Adset[] → Ad[]（可编辑名称、素材、文案）

Step 6 — 发布弹窗（PublishModal）
  ├─ Step 1：连接平台（Meta / Google）
  ├─ Step 2：选择资产（Ad Account → FB Page → Pixel → Event → Phone）
  ├─ Step 3：发布进度（Campaign→Adset→Ad 逐步）
  ├─ Step 4：发布结果
  └─ Step 5：后续引导
```

---

## 二、逐模块改造评估

### 模块 1：产品/素材选择（ProductSelector）

| 维度 | 改造量 | 说明 |
|---|---|---|
| PRODUCT 模式 | ⭐ 无 | 产品选择、素材绑定与平台无关 |
| CATALOG 模式 | ⭐⭐ 中 | 需新增 TikTok 子类型（见下文） |

**CATALOG 模式的具体改造**：

当前 `CATALOG` 只绑定 Meta Product Catalog。TikTok 下需要区分子类型：

```javascript
// 现有
campaignType: 'PRODUCT' | 'CATALOG'

// 改造后
campaignType: 'PRODUCT' | 'CATALOG'
// CATALOG 下新增 catalogSubtype（仅 TikTok）
catalogSubtype: 'DPA'               // Meta 默认
             | 'VIDEO_SHOPPING'     // TikTok - 视频购物
             | 'PRODUCT_SHOPPING'   // TikTok - 商品购物
             | 'GMV_MAX'            // TikTok - GMV Max（需 TikTok Shop 授权）
             | 'LIVE_SHOPPING'      // TikTok - 直播购物（需直播资产）
```

**GMV Max 的特殊处理**：
- 需要在 ProductSelector 中增加「授权 TikTok Shop」的入口
- 选择 GMV_MAX 后，系统自动锁定大部分手动配置（类似 Smart+ 的"托管"模式）
- 商品池来源从 Meta Catalog 切换到 TikTok Shop 商品

**改造文件**：`ProductSelector.jsx`  
**改造行数**：约 50-80 行（增加子类型选择 + 条件授权入口）

---

### 模块 2：投放目标与渠道（TargetingChannelCard）★ 核心改造点

这是融入 TikTok 的**最核心模块**。用户操作流程不变，但数据跟随平台切换。

#### 2.1 平台选择（已有框架，改动极小）

```javascript
// 现有代码（第 35-40 行）
const PLATFORMS = [
  { id: 'meta', name: 'Meta', ... },
  { id: 'google', name: 'Google', ..., disabled: true },
  { id: 'tiktok', name: 'TikTok', ..., disabled: true },  // ← 改为 disabled: false
  { id: 'bing', name: 'Bing', ..., disabled: true }
];
```

**改造**：`disabled: false`，一行代码。

#### 2.2 Campaign Objective 跟随平台切换 ★

现有的 `CAMPAIGN_OBJECTIVES` 是固定数组，只适用于 Meta。改造为按平台索引：

```javascript
// 现有（第 42-48 行）
const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness_engagement', label: 'Awareness & Engagement', ... },
  { value: 'traffic', label: 'Traffic', ... },
  { value: 'leads', label: 'Leads', ... },
  { value: 'sales_conversions', label: 'Sales & Conversions', ... },
  { value: 'app_promotion', label: 'App Promotion', ... }
];

// 改造后
const CAMPAIGN_OBJECTIVES = {
  meta: [
    { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, ... },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, ... },
    { value: 'leads', label: 'Leads', icon: Users, ... },
    { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, ... },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, ... }
  ],
  tiktok: [
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, 
      description: 'Drive visits to website/app',
      subModes: ['standard', 'optimize_destination']  // 对应官方子页
    },
    { value: 'web_conversions', label: 'Website Conversions', icon: ShoppingBag,
      description: 'Drive purchases & sign-ups',
      requiresPixel: true  // 发布时强制要求 Pixel
    },
    { value: 'engagement', label: 'Community Interaction', icon: Users,
      description: 'Followers & engagement',
      requiresIdentity: true  // 发布时强制要求 Identity
    },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone,
      description: 'Installs & in-app actions',
      requiresAppId: true
    },
    { value: 'lead_generation', label: 'Lead Generation', icon: Users,
      description: 'Collect leads via website or Instant Form',
      subModes: ['website_lead', 'instant_form']
    },
    { value: 'product_sales', label: 'Product Sales', icon: ShoppingBag,
      description: 'Shopping ads via catalog/shop',
      requiresCatalog: true
    }
  ]
};
```

**使用方式**（第 963 行改造）：

```javascript
// 现有
const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === objective);

// 改造后
const platformObjectives = CAMPAIGN_OBJECTIVES[platform?.id] || CAMPAIGN_OBJECTIVES.meta;
const currentObjectiveObj = platformObjectives.find(o => o.value === objective);
```

#### 2.3 Conversion Goal 跟随平台切换

```javascript
// 现有（第 50-73 行）
const ADSET_GOALS_MAPPING = {
  awareness_engagement: [...],
  traffic: [...],
  leads: [...],
  sales_conversions: [...],
  app_promotion: [...]
};

// 改造后
const ADSET_GOALS_MAPPING = {
  meta: {
    awareness_engagement: [
      { value: 'impressions', label: 'Impressions' },
      { value: 'post_engagement', label: 'Post engagement' },
      { value: 'conversations', label: 'Conversations' }
    ],
    traffic: [
      { value: 'impressions', label: 'Impressions' },
      { value: 'link_clicks', label: 'Link clicks' },
      { value: 'page_views', label: 'Page views' }
    ],
    leads: [
      { value: 'leads_landing_page', label: 'Leads within landing-page', needsEvent: true },
      { value: 'instant_form_leads', label: 'Instant form leads' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'calls', label: 'Calls' }
    ],
    sales_conversions: [
      { value: 'in_web_actions', label: 'In-web actions', needsEvent: true }
    ],
    app_promotion: [
      { value: 'installs', label: 'Installs' },
      { value: 'in_app_actions', label: 'In-app actions', needsEvent: true }
    ]
  },
  tiktok: {
    traffic: [
      { value: 'clicks', label: 'Clicks (CPC)', billingEvent: 'CPC' },
      { value: 'reach', label: 'Reach (CPM)', billingEvent: 'CPM' },
      { value: 'landing_page_views', label: 'Landing Page Views', billingEvent: 'OCPM' }
    ],
    web_conversions: [
      { value: 'conversions', label: 'Conversions', needsEvent: true, billingEvent: 'OCPM', needsPixel: true },
      { value: 'value', label: 'Value (ROAS)', needsEvent: true, billingEvent: 'OCPM', needsPixel: true }
    ],
    engagement: [
      { value: 'engagement', label: 'Engagement (Likes/Comments)', billingEvent: 'CPE' },
      { value: 'follows', label: 'Follows', billingEvent: 'CPM' }
    ],
    app_promotion: [
      { value: 'app_installs', label: 'App Installs', billingEvent: 'OCPM' },
      { value: 'in_app_events', label: 'In-app Events', needsEvent: true, billingEvent: 'OCPM' }
    ],
    lead_generation: [
      { value: 'leads', label: 'Leads (Website)', needsEvent: true, billingEvent: 'OCPM' },
      { value: 'instant_form', label: 'Instant Form Leads', billingEvent: 'OCPM', needsForm: true }
    ],
    product_sales: [
      { value: 'product_conversions', label: 'Product Conversions', needsEvent: true, billingEvent: 'OCPM' },
      { value: 'gmv', label: 'GMV Optimization', billingEvent: 'OCPM' }
    ]
  }
};
```

**使用方式**（第 964 行改造）：

```javascript
// 现有
const availableGoals = ADSET_GOALS_MAPPING[objective] || [];

// 改造后
const platformGoals = ADSET_GOALS_MAPPING[platform?.id] || ADSET_GOALS_MAPPING.meta;
const availableGoals = platformGoals[objective] || [];
```

#### 2.4 Standard Events 按平台区分

```javascript
// 现有（第 76-80 行）
const STANDARD_EVENTS = [
  'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', ...
];

// 改造后
const STANDARD_EVENTS = {
  meta: [
    'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead',
    'CompleteRegistration', 'SubmitApplication', 'Contact',
    'Search', 'ViewContent', 'Subscribe', 'CustomizeProduct',
    'Donate', 'FindLocation', 'Schedule', 'StartTrial'
  ],
  tiktok: [
    'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead',
    'CompleteRegistration', 'SubmitForm', 'Contact',
    'Search', 'ViewContent', 'Subscribe', 'Download',
    'AddToWishlist', 'AddPaymentInfo', 'Schedule', 'StartTrial',
    'SubmitApplication', 'ApplicationApproval'
  ]
};
```

#### 2.5 Smart+ / Advantage+ 开关

在 TargetingChannelCard 的 Objective 选择器下方，增加一个 toggle：

```javascript
// 新增状态（BatchGenerateAds.jsx 主组件）
const [smartOptEnabled, setSmartOptEnabled] = useState(false);

// 条件渲染（TargetingChannelCard 中，Objective 选择后）
{platform?.id === 'tiktok' && objective && (
  <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-base">
    <Toggle checked={smartOptEnabled} onChange={setSmartOptEnabled} />
    <div>
      <p className="text-xs font-bold text-gray-700">Smart+ 智能优化</p>
      <p className="text-[10px] text-gray-400">系统自动优化定向、出价、版位</p>
    </div>
  </div>
)}

{platform?.id === 'meta' && objective && (
  <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-base">
    <Toggle checked={smartOptEnabled} onChange={setSmartOptEnabled} />
    <div>
      <p className="text-xs font-bold text-gray-700">Advantage+ 智能优化</p>
      <p className="text-[10px] text-gray-400">系统自动优化定向、出价、版位</p>
    </div>
  </div>
)}
```

**Smart+ 启用后的影响**：
- CampaignPlanView 中隐藏 BY_CREATIVE 策略（系统接管）
- 受众分配默认为 AUTO（隐藏 LAL/INT/CUSTOM 选择）
- 出价策略默认为 UNLIMITED（隐藏手动出价）

**改造文件**：`TargetingChannelCard`（组件内部）、`BatchGenerateAds.jsx`（状态）  
**改造行数**：约 80-120 行

---

### 模块 3：架构与预算（CampaignPlanView）

| 维度 | 改造量 | 说明 |
|---|---|---|
| 拆分策略 PER_PRODUCT / ALL_PRODUCTS / BY_CREATIVE / AI_STRATEGY | ⭐ 无 | 平台无关的编排逻辑 |
| Adset 组数 | ⭐ 无 | 与平台无关 |
| 预算 CBO/ABO | ⭐ 无 | TikTok 同样支持 CBO（Campaign Budget Optimization）和 ABO |
| 日预算 | ⭐ 无 | 与平台无关 |
| 受众分配 ADV/LAL/INT/CUSTOM | ⭐ 极小 | TikTok 也有 Lookalike/Interest/Custom Audience，命名略有不同 |
| **Ad Format** | ⭐ 小 | 需要条件切换（见下文） |

**Ad Format 改造**：

```javascript
// 现有（第 940-948 行）
// FLEXIBLE / SINGLE 仅在 sales_conversions / app_promotion 时显示

// 改造后
const AD_FORMAT_OPTIONS = {
  meta: {
    condition: (obj) => obj === 'sales_conversions' || obj === 'app_promotion',
    options: [
      { value: 'FLEXIBLE', label: 'Flexible 多素材', desc: '多素材组合一条广告' },
      { value: 'SINGLE', label: 'Single 单素材', desc: '每素材 1 个 ad' }
    ]
  },
  tiktok: {
    condition: (obj) => true,  // TikTok 所有目标都可选择创意类型
    options: [
      { value: 'SINGLE', label: 'Single 单素材', desc: '单图/单视频一条广告' },
      { value: 'CAROUSEL', label: 'Carousel 轮播', desc: '多图/视频轮播（每卡独立落地页）' }
    ]
  }
};
```

**关键差异说明**：
- Meta 的 `FLEXIBLE`（多图组合成一条广告，所有图共享一个落地页）
- TikTok 的 `CAROUSEL`（多图/视频轮播，**每卡可独立落地页**）
- 这个差异会影响 `buildAds()` 函数中广告生成的逻辑

**改造文件**：`CampaignPlanView.jsx`  
**改造行数**：约 30-50 行（Ad Format 选项条件化）

---

### 模块 4：高级设置

| 维度 | 改造量 | 说明 |
|---|---|---|
| 命名模板 | ⭐ 无 | 模板变量通用：{Brand}-{Location}-{Date}-{Objective} |
| 落地页策略 | ⭐ 极小 | TikTok Carousel 需支持"逐卡落地页"配置 |
| 文案策略 | ⭐ 无 | Title + Description 通用 |
| 排期 | ⭐ 无 | start_time / end_time 通用 |

**Carousel 逐卡落地页**：当 adType === 'CAROUSEL' 时，落地页策略需要从"统一 URL"变为"逐卡配置 URL"的选项。

**改造行数**：约 20 行

---

### 模块 5：预览树（CampaignPreviewView）

| 维度 | 改造量 | 说明 |
|---|---|---|
| Campaign→Adset→Ad 树结构 | ⭐ 无 | TikTok 的 Campaign→Ad Group→Ad 完全同构 |
| buildAds() 函数 | ⭐ 小 | CAROUSEL 创意需要输出多卡结构 |
| 广告名称/预览 | ⭐ 无 | 通用 |
| DPA 预览卡 | ⭐ 极小 | TikTok Shopping 下使用类似的动态预览 |

**buildAds() 改造**：

```javascript
// 现有（CampaignPreviewView.jsx，buildAds 函数）
// isFlexible = adType === 'FLEXIBLE' && (objective === 'sales_conversions' || objective === 'app_promotion')

// 改造后
const isFlexible = platform?.id === 'meta' && adType === 'FLEXIBLE' && ...;
const isCarousel = platform?.id === 'tiktok' && adType === 'CAROUSEL';

// Carousel 广告生成逻辑
if (isCarousel) {
  // 一个 Carousel ad 包含多个 items，每 item 有独立的 image + landing_page
  const carouselAd = {
    name: `${productName} - Carousel`,
    creativeType: 'CAROUSEL',
    carouselItems: productCreatives.map(c => ({
      imageUrl: c.imageUrl,
      title: c.title || productName,
      landingPageUrl: c.landingPageUrl || defaultLandingPage
    }))
  };
  ads.push(carouselAd);
}
```

**改造文件**：`CampaignPreviewView.jsx`  
**改造行数**：约 40-60 行

---

### 模块 6：发布弹窗（PublishModal）★ 重要改造点

发布弹窗是**第二个重要改造点**，因为不同平台需要绑定不同的资产。

#### 6.1 Step 1 - 连接平台

```javascript
// 现有：只有 Meta / Google 连接选项
// 改造：增加 TikTok 连接选项

const LOGO_LINKS = {
  meta: '...',
  google: '...',
  tiktok: 'https://t3.gstatic.com/faviconV2?...'  // 新增
};

// renderStep1 中增加 TikTok 连接块
// 结构与 Meta 连接完全一致（图标 + Connect/Disconnect 按钮）
```

#### 6.2 Step 2 - 选择资产 ★★

这是发布弹窗改造的核心。当前只有 Meta 和 Google 两套资产链路，需要增加 TikTok 链路：

```javascript
// 现有（第 1440-1456 行）
const renderStep2 = () => {
  const isMeta = connectedPlatform === 'meta';
  // Meta: Ad Account → FB Page → Pixel → Event → Phone
  // Google: Ad Account → Conversion Dataset → Event → Phone
};

// 改造后
const renderStep2 = () => {
  const isMeta = connectedPlatform === 'meta';
  const isTikTok = connectedPlatform === 'tiktok';
  const isGoogle = connectedPlatform === 'google';

  // 资产选择链路按平台分叉：
  // Meta:   Ad Account → FB Page → Pixel → Event → Phone
  // TikTok: Ad Account → Identity → Pixel(条件) → Event(条件) → Phone
  // Google: Ad Account → Conversion Dataset → Event → Phone
};
```

**TikTok 资产链路详细设计**：

```
Step 2a: Select TikTok Ad Account
  └─ 下拉选择已授权的 TikTok 广告账户

Step 2b: Select Identity（TikTok 账户身份）
  └─ 选择用于投放的 TikTok 主页/账号
  └─ 所有 TikTok 广告都需要 Identity

Step 2c: Select TikTok Pixel（条件显示）
  └─ 仅在 objective = web_conversions / lead_generation 时显示
  └─ 选择已安装的 TikTok Pixel

Step 2d: Select Conversion Event（条件显示）
  └─ 仅在 needsEvent = true 的 goal 时显示
  └─ 从 STANDARD_EVENTS.tiktok 中选择

Step 2e: 特殊资产（条件显示）
  ├─ Instant Form（当 goal = instant_form 时）→ 选择/创建 Instant Form
  ├─ Authorized Post（当 adType 包含 Spark 时）→ 选择授权帖子
  ├─ TikTok Shop（当 catalogSubtype = GMV_MAX 时）→ 选择店铺
  └─ App ID（当 objective = app_promotion 时）→ 选择应用

Step 2f: Contact Phone（通用）
```

**改造文件**：`BatchGenerateAds.jsx` 中的 `PublishModal` 内联组件  
**改造行数**：约 120-160 行（新增 TikTok 资产链路 + 条件显示逻辑）

#### 6.3 Step 3 - 发布进度

发布进度的 UI 逻辑**完全通用**（Campaign→Adset→Ad 逐步推进），无需改动。  
但后端 API 调用链路不同：

```
Meta:   Campaign Create → Adset Create → Ad Create
TikTok: Campaign Create → Ad Group Create → Ad Create

// 结构完全一致，只是 API endpoint 和 payload 不同
// 这属于后端/API 适配层的工作，不影响前端 UI
```

---

## 三、不需要改造的模块（明确列出）

| 模块 | 原因 |
|---|---|
| 产品选择（PRODUCT 模式） | 产品/素材选择与平台完全无关 |
| AI 分析产品 | 分析逻辑与平台无关 |
| 拆分策略 PER_PRODUCT / ALL_PRODUCTS / BY_CREATIVE / AI_STRATEGY | 这是编排逻辑，与平台无关 |
| Adset 组数 | 与平台无关 |
| 预算 CBO/ABO | TikTok 完全支持 |
| 日预算/总预算 | 与平台无关 |
| 受众类型 ADV/LAL/INT | TikTok 同样有（自动/相似/兴趣定向），概念对齐 |
| 命名模板 | 通用 |
| 文案策略 | 通用 |
| 排期 | 通用 |
| 预览树结构 | Campaign→Adset→Ad 同构 |
| 发布进度 UI | 通用的 Campaign→Adset→Ad 推进条 |

---

## 四、Smart+ 与 Advantage+ 的处理

### 本质
二者都是"将更多优化决策交给平台算法"的开关，**不是独立的 objective_type**：

| 参数 | Meta Advantage+ | TikTok Smart+ |
|---|---|---|
| 触发方式 | Campaign 级别 flag | Campaign 级别 flag |
| 影响范围 | 自动定向、自动出价、自动版位 | 自动定向、自动出价、自动版位 |
| 前端表现 | 隐藏手动定向/出价配置 | 隐藏手动定向/出价配置 |
| 可叠加目标 | 任何 objective | 任何 objective |

### 前端实现

```javascript
// 新增状态
const [smartOptEnabled, setSmartOptEnabled] = useState(false);

// 影响点
useEffect(() => {
  if (smartOptEnabled) {
    // 1. 锁定受众为 AUTO
    setAdsetAudiences(Array(50).fill('AUTO'));
    // 2. 禁用 BY_CREATIVE 策略
    if (structure.strategy === 'BY_CREATIVE') {
      setStructure({ ...structure, strategy: 'PER_PRODUCT' });
    }
  }
}, [smartOptEnabled]);
```

---

## 五、GMV Max 的处理

### 定位
GMV Max 是 CATALOG 广告的**平行子类型**，为 TikTok 特有，需要 TikTok Shop 授权。

### 与现有 CATALOG 的关系

```
现有 CATALOG 模式
  ├── Meta: DPA（Dynamic Product Ads）
  │   └─ 数据源：Meta Product Catalog
  │   └─ 优化目标：ROAS / Purchase
  │
  └── TikTok（新增）:
      ├── Video Shopping Ads
      │   └─ 数据源：TikTok Catalog
      │   └─ 优化目标：Conversions / Value
      ├── Product Shopping Ads
      │   └─ 数据源：TikTok Catalog
      │   └─ 优化目标：Conversions / Value
      ├── GMV Max ★
      │   └─ 数据源：TikTok Shop 店铺商品
      │   └─ 优化目标：GMV（成交额）
      │   └─ 前置条件：TikTok Shop 授权
      │   └─ 自动化程度：极高（系统自动选品、出价、定向）
      └── Live Shopping Ads
          └─ 数据源：直播资产
          └─ 优化目标：Value
          └─ 前置条件：直播间权限
```

### 前端改造

```javascript
// ProductSelector.jsx 中 CATALOG 模式下增加子类型选择
{campaignType === 'CATALOG' && platform?.id === 'tiktok' && (
  <div className="flex gap-2 mt-4">
    {[
      { id: 'VIDEO_SHOPPING', label: '视频购物', icon: Video },
      { id: 'PRODUCT_SHOPPING', label: '商品购物', icon: ShoppingBag },
      { id: 'GMV_MAX', label: 'GMV Max', icon: Zap, requiresShop: true },
      { id: 'LIVE_SHOPPING', label: '直播购物', icon: Tv, requiresLive: true }
    ].map(sub => (
      <button
        key={sub.id}
        onClick={() => setCatalogSubtype(sub.id)}
        disabled={sub.requiresShop && !tiktokShopAuthorized}
        className={...}
      >
        <sub.icon size={16} />
        <span>{sub.label}</span>
        {sub.requiresShop && !tiktokShopAuthorized && (
          <span className="text-[10px] text-amber-500">需授权店铺</span>
        )}
      </button>
    ))}
  </div>
)}
```

---

## 六、完整改造清单（可作为开发任务拆分）

### Phase 1 — 配置层改造（约 300 行代码）

| 任务 | 文件 | 行数 | 优先级 |
|---|---|---|---|
| PLATFORMS 启用 TikTok | BatchGenerateAds.jsx | 1 行 | P0 |
| CAMPAIGN_OBJECTIVES 改为按平台索引 | BatchGenerateAds.jsx | ~40 行 | P0 |
| ADSET_GOALS_MAPPING 改为按平台索引 | BatchGenerateAds.jsx | ~60 行 | P0 |
| STANDARD_EVENTS 改为按平台索引 | BatchGenerateAds.jsx | ~10 行 | P0 |
| currentObjectiveObj / availableGoals 引用修改 | BatchGenerateAds.jsx | ~5 行 | P0 |
| AI_RECOMMENDED 按平台条件化 | BatchGenerateAds.jsx | ~5 行 | P1 |

### Phase 2 — 交互层改造（约 200 行代码）

| 任务 | 文件 | 行数 | 优先级 |
|---|---|---|---|
| Ad Format 条件化（FLEXIBLE→CAROUSEL） | CampaignPlanView.jsx | ~30 行 | P0 |
| Smart+/Advantage+ toggle 开关 | TargetingChannelCard + BatchGenerateAds | ~40 行 | P1 |
| Carousel 逐卡落地页配置 | 高级设置区域 | ~20 行 | P1 |
| 平台切换时清空 objective/goal/event | BatchGenerateAds.jsx | ~10 行 | P0 |
| CATALOG 子类型选择（TikTok Shopping） | ProductSelector.jsx | ~50 行 | P1 |
| GMV Max 店铺授权入口 | ProductSelector.jsx | ~30 行 | P2 |

### Phase 3 — 发布层改造（约 200 行代码）

| 任务 | 文件 | 行数 | 优先级 |
|---|---|---|---|
| PublishModal Step 1 增加 TikTok 连接 | BatchGenerateAds.jsx (PublishModal) | ~30 行 | P0 |
| PublishModal Step 2 TikTok 资产链路 | BatchGenerateAds.jsx (PublishModal) | ~120 行 | P0 |
| Instant Form 资产选择（条件） | BatchGenerateAds.jsx (PublishModal) | ~20 行 | P2 |
| Spark Ads 授权帖子选择（条件） | BatchGenerateAds.jsx (PublishModal) | ~30 行 | P2 |

### Phase 4 — 预览层改造（约 60 行代码）

| 任务 | 文件 | 行数 | 优先级 |
|---|---|---|---|
| buildAds() 支持 CAROUSEL 创意 | CampaignPreviewView.jsx | ~40 行 | P0 |
| Carousel 预览卡片组件 | CampaignPreviewView.jsx | ~20 行 | P1 |

---

## 七、总结

### 改造本质

| 层面 | 改造量 | 核心判断 |
|---|---|---|
| **架构层** | ⭐ 几乎不变 | Campaign→Adset→Ad 同构；拆分策略通用；预算通用 |
| **数据配置层** | ⭐⭐⭐ 核心改造 | Objectives/Goals/Events/BillingEvents 按平台索引 |
| **交互层** | ⭐⭐ 小量改造 | Ad Format 条件化 + Smart+ toggle + CATALOG 子类型 |
| **发布资产层** | ⭐⭐⭐ 重要改造 | TikTok 特有资产链路（Identity/Pixel/Form/Shop） |
| **预览层** | ⭐ 极小 | CAROUSEL 创意生成逻辑 |

### 代码量估算

| Phase | 改造行数 | 涉及文件 | 优先级 |
|---|---|---|---|
| 配置层 | ~300 行 | BatchGenerateAds.jsx | P0（第一周） |
| 交互层 | ~200 行 | CampaignPlanView.jsx, ProductSelector.jsx | P0-P1（第一周） |
| 发布层 | ~200 行 | BatchGenerateAds.jsx (PublishModal) | P0（第二周） |
| 预览层 | ~60 行 | CampaignPreviewView.jsx | P0（第二周） |
| **合计** | **~760 行** | **4 个文件** | **2 周可完成 P0** |

### 与之前分析的对照

之前的 27 页分析是从"每个 TikTok 广告目标需要什么参数"的角度出发。本方案从"现有代码需要改什么"的角度出发。结论一致：

> **改的不是架构，而是数据配置。把 CAMPAIGN_OBJECTIVES / ADSET_GOALS_MAPPING / STANDARD_EVENTS / Ad Format 从"写死"改为"按平台索引"，就完成了 80% 的工作。剩下 20% 是发布弹窗的资产链路。**

