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

当前 `CATALOG` 只绑定 Meta Product Catalog。

根据 TikTok 2026 年最新的产品结构，TikTok 的 Shopping/Catalog 功能**不需要在 ProductSelector 里开子类型**。原因如下：

- TikTok 的 Shopping 广告（包括 GMV Max）是通过 **Sales 目标 + destination 选择** 进入的，不是通过 campaignType 选择的
- 用户选 Sales → Website 后，可以开启 "Use Catalog" 开关（等价于 Meta DPA）
- 用户选 Sales → TikTok Shop 后，自动走 GMV Max 流程

所以 `CATALOG` 模式的改造很简单：

```javascript
// 现有
campaignType: 'PRODUCT' | 'CATALOG'
// CATALOG 模式下绑定 Meta Product Catalog

// 改造后
campaignType: 'PRODUCT' | 'CATALOG'
// CATALOG 模式下：
//   Meta → 绑定 Meta Product Catalog（不变）
//   TikTok → 绑定 TikTok Catalog（仅切换数据源）
//   TikTok Shop / GMV Max → 在 Sales 目标的 salesDestination 中处理，不走 CATALOG 模式
```

**改造文件**：`ProductSelector.jsx`  
**改造行数**：约 20 行（CATALOG 模式下按平台切换目录源）

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
  // ══════════════════════════════════════════════════════════════
  // TikTok 7 个目标（基于 TikTok Ads Manager 前端截图逐一核对）
  //
  // 核心发现：每个目标选中后，右侧展开的配置结构各不相同，
  // 有的有二级选择（Campaign type / Promotion type / Sales destination），
  // 有的有 Campaign setup（Manual / Smart+ / Search），
  // 有的只有说明文字没有子选项。
  // 这些二级结构必须在我们的 Objective 选择流程中还原。
  //
  // API 层面的 objective_type 枚举值：
  //   REACH, TRAFFIC, VIDEO_VIEWS, ENGAGEMENT,
  //   APP_PROMOTION, LEAD_GENERATION, WEB_CONVERSIONS, PRODUCT_SALES
  // ══════════════════════════════════════════════════════════════
  tiktok: [

    // ─── Awareness ───────────────────────────────────────────
    { value: 'reach', label: 'Reach', icon: Megaphone,
      description: 'Show your ad to the maximum number of people.',
      apiObjective: 'REACH',
      // 右侧展开：Campaign type（radio）
      campaignTypes: [
        { id: 'auction', label: 'Auction reach',
          description: 'Ads with the most efficient reach.',
          isDefault: true },
        { id: 'reach_frequency', label: 'Reach & Frequency',
          description: 'Reserve ads in advance with a guaranteed reach and frequency.',
          badge: 'Reserve',
          // R&F 不是独立目标，而是 Reach 下的子类型
          // R&F 通常需要预算锁定、频次上限等特殊配置
          requiresReservation: true }
      ]
    },

    // ─── Consideration ───────────────────────────────────────
    { value: 'traffic', label: 'Traffic', icon: MousePointer2,
      description: 'Send more people to your website, app, or TikTok Shop.',
      apiObjective: 'TRAFFIC',
      // 右侧展开：Campaign setup（radio）
      campaignSetup: [
        { id: 'manual', label: 'Manual campaign',
          description: 'Create your campaign using the standard workflow to maximize precise control for your ads settings.',
          isDefault: true },
        { id: 'smart_plus', label: 'Smart+ campaign',
          description: 'Improve ad performance with automated campaign management and smart optimization (placement selection, AIGC, audience targeting, and more).',
          badge: 'New' },
        { id: 'search', label: 'Search campaign',
          description: "Create your campaign with keywords and serve ads within TikTok's search result page.",
          badge: 'New' }
      ]
    },

    { value: 'video_views', label: 'Video views', icon: Play,
      description: 'Get more views and engagement for your video ads.',
      apiObjective: 'VIDEO_VIEWS'
      // 右侧展开：纯说明文字，无子选项
      // - Maximize the plays of your video ads
      // - Drive consideration by showing your ads to users who are more actively engaged
    },

    { value: 'engagement', label: 'Community interaction', icon: Users,
      description: 'Get more followers or TikTok page visits.',
      apiObjective: 'ENGAGEMENT',
      requiresIdentity: true
      // 右侧展开：纯说明文字，无子选项
      // - Get more people to follow your TikTok account
      // - Get more people to visit your TikTok profile
      // - Promote your livestream
    },

    // ─── Conversion ──────────────────────────────────────────
    { value: 'app_promotion', label: 'App promotion', icon: Smartphone,
      description: 'The cost effective way to get more people to install and take desired actions in your app.',
      apiObjective: 'APP_PROMOTION',
      requiresAppId: true,
      // 右侧展开：Promotion types（radio），选中 App install 后内嵌 Campaign setup
      promotionTypes: [
        { id: 'app_install', label: 'App install',
          description: 'Get people to install and use your app.',
          isDefault: true,
          // 内嵌 Campaign setup
          campaignSetup: [
            { id: 'manual', label: 'Manual campaign',
              description: 'Create your campaign using the standard workflow to maximize precise control for your ads settings.',
              isDefault: true },
            { id: 'smart_plus', label: 'Smart+ campaign',
              description: 'Improve ad performance with automated campaign management and smart optimization.',
              badge: 'New' }
          ]
        },
        { id: 'app_retargeting', label: 'App retargeting',
          description: 'Re-engage existing app users to take action in your app.' }
      ]
    },

    { value: 'lead_generation', label: 'Lead generation', icon: Users,
      description: 'Collect leads for your business.',
      apiObjective: 'LEAD_GENERATION',
      // 右侧展开：顶部有 lead source tab 栏 + Campaign setup + Use catalog toggle
      leadSources: [
        { id: 'website', label: 'Website' },
        { id: 'instant_form', label: 'Instant form', needsForm: true },
        { id: 'tiktok_dm', label: 'TikTok direct messages' },
        { id: 'instant_messaging', label: 'Instant messaging apps' }
      ],
      campaignSetup: [
        { id: 'manual', label: 'Manual campaign', isDefault: true },
        { id: 'smart_plus', label: 'Smart+ campaign', badge: 'New' }
      ],
      // "Use catalog" toggle 开关（用汽车目录推广库存/车型）
      useCatalogToggle: true,
      useCatalogDescription: 'Use your automotive catalog to promote car inventory or models.'
    },

    { value: 'sales', label: 'Sales', icon: ShoppingBag,
      description: 'Drive sales on your TikTok Shop, website, or app.',
      // Sales 是 UI 统一目标，发布时按 destination 映射到 API objective_type
      salesDestinations: [
        { id: 'tiktok_shop', label: 'TikTok Shop',
          description: 'Drive sales on your TikTok Shop with Shop Ads campaign settings chosen by you.',
          apiObjective: 'PRODUCT_SALES',
          requiresShop: true,
          gmvMaxToggle: true,
          gmvMaxWarning: 'Starting September 1, custom shop ads will be unavailable for creation, duplication, drafting, and editing. Your existing ads will run until they\'re out of budget.',
          gmvMaxDescription: 'See better results with an automated Shop Ads solution that selects the best performing ad creative for your products and leverages all shoppable ad placements.'
        },
        { id: 'website', label: 'Website',
          description: 'Drive sales on your website with campaign settings chosen by you.',
          apiObjective: 'WEB_CONVERSIONS',
          requiresPixel: true
          // 选完后下一步才配置 Manual / Smart+ / Search 模式
        },
        { id: 'app', label: 'App',
          description: 'Drive sales on your app (product catalog required).',
          apiObjective: 'PRODUCT_SALES',
          requiresCatalog: true
        },
        { id: 'website_and_app', label: 'Website and app',
          description: 'Drive sales on both your website and your app.',
          apiObjective: 'WEB_CONVERSIONS',
          requiresPixel: true, requiresAppId: true
        }
      ]
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
  // TikTok 的 ADSET_GOALS 也要与 2026 年最新的 7 个 UI 目标对齐
  // 注意：Sales 是统一目标，其 goals 取决于用户选择的 salesDestination
  tiktok: {
    reach: [
      { value: 'reach', label: 'Reach (CPM)', billingEvent: 'CPM' }
    ],
    traffic: [
      { value: 'clicks', label: 'Clicks (CPC)', billingEvent: 'CPC' },
      { value: 'landing_page_views', label: 'Landing Page Views', billingEvent: 'OCPM' }
    ],
    video_views: [
      { value: 'video_views', label: 'Video Views (2s/6s)', billingEvent: 'CPV' },
      { value: 'reach', label: 'Reach', billingEvent: 'CPM' }
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
    // Sales 是统一目标，goals 按 salesDestination 动态变化：
    //   website → conversions / value（需 Pixel）
    //   tiktok_shop → gmv（GMV Max 托管，通常无需手选 goal）
    //   app → app_conversions（需 Catalog）
    //   website_and_app → conversions / value
    sales: [
      { value: 'conversions', label: 'Conversions', needsEvent: true, billingEvent: 'OCPM',
        forDestination: ['website', 'website_and_app'], needsPixel: true },
      { value: 'value', label: 'Value (ROAS)', needsEvent: true, billingEvent: 'OCPM',
        forDestination: ['website', 'website_and_app'], needsPixel: true },
      { value: 'gmv', label: 'GMV Optimization', billingEvent: 'OCPM',
        forDestination: ['tiktok_shop'], autoManaged: true },
      { value: 'product_sales', label: 'Product Sales', needsEvent: true, billingEvent: 'OCPM',
        forDestination: ['app'], needsCatalog: true }
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

#### 2.5 Campaign setup / Campaign type 选择器

截图揭示：**不同目标的二级配置结构各不相同**，我们需要在 Objective 选择完成后，
根据目标类型动态渲染对应的二级选择器。

```javascript
// 新增状态（BatchGenerateAds.jsx 主组件）
const [campaignSetupMode, setCampaignSetupMode] = useState('manual');
const [reachCampaignType, setReachCampaignType] = useState('auction');
const [appPromotionType, setAppPromotionType] = useState('app_install');
const [leadSource, setLeadSource] = useState('website');
const [salesDestination, setSalesDestination] = useState('');
const [useCatalog, setUseCatalog] = useState(false);

// 条件渲染（TargetingChannelCard 中，Objective 选择后）
// 根据当前目标的数据结构，动态展示对应的二级选择器：

// 1. Reach → 显示 Campaign type（Auction / R&F）
// 2. Traffic → 显示 Campaign setup（Manual / Smart+ / Search）
// 3. Video views → 无二级，直接进下一步
// 4. Community interaction → 无二级，直接进下一步
// 5. App promotion → 显示 Promotion type（Install / Retargeting），
//                     Install 下嵌 Campaign setup（Manual / Smart+）
// 6. Lead generation → 显示 Lead source tab（Website / Instant form / DM / Messaging）
//                       + Campaign setup（Manual / Smart+）
//                       + Use catalog toggle
// 7. Sales → 显示 Sales destination（TikTok Shop / Website / App / Website+App）
```

**所有目标的二级配置全景表**：

| 目标 | 二级选择名称 | 选项 | 对发布的影响 |
|---|---|---|---|
| Reach | Campaign type | Auction / R&F | R&F 需要频次上限、预约预算 |
| Traffic | Campaign setup | Manual / Smart+ / Search | Smart+ 锁定定向；Search 需关键词 |
| Video views | （无） | — | 直接进下一步 |
| Community interaction | （无） | — | 直接进下一步 |
| App promotion | Promotion type → Campaign setup | Install(Manual/Smart+) / Retargeting | Retargeting 需已安装用户数据 |
| Lead generation | Lead source + Campaign setup + Use catalog | Website/Form/DM/Messaging × Manual/Smart+ | Form 需 Instant Form 资产 |
| Sales | Sales destination | TikTok Shop(+GMV Max) / Website / App / Website+App | 映射到不同 API objective_type |

**改造文件**：`TargetingChannelCard`（组件内部）、`BatchGenerateAds.jsx`（状态）  
**改造行数**：约 120-160 行

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
  └─ 在 Sales(website/website_and_app) / Lead Generation 时显示
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

## 四、Smart+ / Campaign setup 的处理（基于截图修正）

### 关键发现：Smart+ 不是独立 toggle，而是 Campaign setup 的一个选项

从截图来看，TikTok 的 Smart+ **不是**在任何目标上叠加的独立开关。它的实际位置是：

```
目标选择后 → 右侧展开 Campaign setup（radio group）
  ● Manual campaign（默认）
  ○ Smart+ campaign [New]
  ○ Search campaign [New]（仅 Traffic / Sales-Website 有）
```

**哪些目标有 Campaign setup？**

| 目标 | 有 Campaign setup？ | 可选模式 |
|---|---|---|
| Reach | ❌ 没有（有 Campaign type：Auction / R&F） | — |
| Traffic | ✅ 有 | Manual / Smart+ / Search |
| Video views | ❌ 没有 | — |
| Community interaction | ❌ 没有 | — |
| App promotion | ✅ 有（嵌在 App install 内） | Manual / Smart+ |
| Lead generation | ✅ 有 | Manual / Smart+ |
| Sales | ✅ 有（选完 destination 后出现） | Manual / Smart+ / Search |

### 与 Meta Advantage+ 的对比

| 维度 | Meta Advantage+ | TikTok Smart+ |
|---|---|---|
| 位置 | Campaign 级别 flag（独立 toggle） | **Campaign setup 中的 radio 选项** |
| 可选目标 | 任何 objective | 仅 Traffic / App / Lead / Sales |
| 影响范围 | 自动定向、自动出价、自动版位 | 同左 + AIGC 素材生成 |
| 前端表现 | 隐藏手动配置 | 隐藏手动配置 |

### 前端实现

```javascript
// 不再是独立的 toggle，而是 campaignSetup 状态
const [campaignSetupMode, setCampaignSetupMode] = useState('manual');
// 'manual' | 'smart_plus' | 'search'

// 根据当前目标判断是否显示 Campaign setup 选择器
const currentObjective = platformObjectives.find(o => o.value === objective);
const hasCampaignSetup = !!currentObjective?.campaignSetup;

// Smart+ 模式下的影响
useEffect(() => {
  if (campaignSetupMode === 'smart_plus') {
    setAdsetAudiences(Array(50).fill('AUTO'));
    if (structure.strategy === 'BY_CREATIVE') {
      setStructure({ ...structure, strategy: 'PER_PRODUCT' });
    }
  }
}, [campaignSetupMode]);
```

### Reach 的特殊处理：Campaign type（不是 Campaign setup）

Reach 没有 Campaign setup，但有 **Campaign type**：
- **Auction reach**（默认）：标准竞价
- **Reach & Frequency**：预约制，需要提前锁定预算和频次

R&F 在之前的分析中被列为独立页面 `set-up-reach-frequency-campaigns/v1.3`，
但实际上它是 **Reach 目标下的子类型**，不需要在 Objective 层面单独处理。

```javascript
const [reachCampaignType, setReachCampaignType] = useState('auction');
// 'auction' | 'reach_frequency'
```

---

## 五、Sales 统一目标与 GMV Max 的处理

### 背景（2026 年最新）

TikTok 在 2025-2026 年做了一个重大变更：
- 原先独立的 `Website Conversions` 和 `Product Sales` 两个目标 → **合并为统一的 "Sales" 目标**
- 用户选 Sales 后，需再选择 **Sales Destination**（销售渠道）
- **自 2025 年 7 月起，TikTok Shop 广告只能通过 GMV Max 创建**

### Sales 目标的交互流程（与 TikTok Ads Manager 截图完全对齐）

```
用户选 Sales 目标
  │
  ├── 显示 Sales Destination 选择（radio group，截图右侧）
  │
  │   ● TikTok Shop
  │   │   "Drive sales on your TikTok Shop with Shop Ads campaign settings chosen by you."
  │   │   ├─ ⚠️ 黄色提示："Starting September 1, custom shop ads will be unavailable..."
  │   │   ├─ 🔘 GMV Max Campaign [New] ← toggle 开关（不是独立选项！）
  │   │   │   "See better results with an automated Shop Ads solution..."
  │   │   ├─ 前置条件：TikTok Shop 已授权
  │   │   └─ API objective_type = 'PRODUCT_SALES'
  │   │
  │   ○ Website
  │   │   "Drive sales on your website with campaign settings chosen by you."
  │   │   ├─ 前置条件：Pixel 安装
  │   │   ├─ 选完后下一步才选 Manual / Smart+ / Search 模式
  │   │   └─ API objective_type = 'WEB_CONVERSIONS'
  │   │
  │   ○ App
  │   │   "Drive sales on your app (product catalog required)."
  │   │   ├─ 前置条件：App + Catalog
  │   │   └─ API objective_type = 'PRODUCT_SALES'
  │   │
  │   ○ Website & App（部分广告主可见）
  │       "Drive sales across your website and mobile app within a single campaign."
  │       ├─ 前置条件：Pixel + App + Deeplink
  │       └─ API objective_type = 'WEB_CONVERSIONS'
  │
  └── Continue → 进入 Ad Group 配置（选 Conversion Goal、出价等）
```

### 与现有 CATALOG 的关系

```
现有 CATALOG 模式
  ├── Meta: DPA（Dynamic Product Ads）
  │   └─ 数据源：Meta Product Catalog
  │   └─ 优化目标：ROAS / Purchase
  │
  └── TikTok: 通过 Sales 目标 + destination 选择进入
      ├── Website destination + Use Catalog 开关
      │   └─ 等价于 Meta DPA：基于目录自动推商品
      │   └─ 数据源：TikTok Catalog
      │
      └── TikTok Shop destination → GMV Max ★
          └─ 数据源：TikTok Shop 店铺商品
          └─ 2025.7 后 TikTok Shop 唯一方式
          └─ 分为 Product GMV Max 和 LIVE GMV Max
          └─ 自动化程度：极高（系统自动选品、出价、定向）
```

### 关键设计决策

TikTok 的 Shopping/Catalog 广告**不需要在 ProductSelector 里单独开一个 CATALOG 子类型**。
正确的做法是：
1. 用户在 Objective 里选 **Sales**
2. 选 destination 为 **Website** 时，可以开启 "Use Catalog" 开关（等价于 Meta DPA）
3. 选 destination 为 **TikTok Shop** 时，自动走 GMV Max 流程

这样更符合 TikTok 官方 Ads Manager 的实际交互逻辑。

### 前端改造

Sales 目标选择后，显示 **Sales Destination** 二级选择器：

```javascript
// TargetingChannelCard 中，objective === 'sales' 时显示 destination 选择
{platform?.id === 'tiktok' && objective === 'sales' && (
  <div className="mt-4 space-y-2">
    <label className="text-xs font-medium text-gray-500">Sales Destination</label>
    <div className="grid grid-cols-2 gap-2">
      {currentObjectiveObj.salesDestinations.map(dest => (
        <button
          key={dest.id}
          onClick={() => setSalesDestination(dest.id)}
          disabled={dest.requiresShop && !tiktokShopAuthorized}
          className={`p-3 rounded-base border text-left transition-all ${
            salesDestination === dest.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-100 hover:border-gray-200'
          } ${dest.requiresShop && !tiktokShopAuthorized ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <p className="text-xs font-bold text-gray-700">{dest.label}</p>
          {dest.requiresShop && !tiktokShopAuthorized && (
            <p className="text-[10px] text-amber-500 mt-1">需先授权 TikTok Shop</p>
          )}
          {dest.id === 'tiktok_shop' && (
            <p className="text-[10px] text-gray-400 mt-1">GMV Max（系统自动优化）</p>
          )}
        </button>
      ))}
    </div>
  </div>
)}

// 发布时，根据 salesDestination 映射到 API objective_type：
const apiObjectiveType = (() => {
  if (platform?.id !== 'tiktok') return objective; // Meta 直接用 objective
  if (objective !== 'sales') return currentObjectiveObj.apiObjective;
  const dest = currentObjectiveObj.salesDestinations.find(d => d.id === salesDestination);
  return dest?.apiObjective || 'WEB_CONVERSIONS';
})();
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
| 目标二级选择器（Campaign setup/type/destination/source） | TargetingChannelCard + BatchGenerateAds | ~120 行 | P0 |
| Carousel 逐卡落地页配置 | 高级设置区域 | ~20 行 | P1 |
| 平台切换时清空 objective/goal/event | BatchGenerateAds.jsx | ~10 行 | P0 |
| Sales destination 二级选择器 | TargetingChannelCard | ~40 行 | P0 |
| CATALOG 按平台切换目录源 | ProductSelector.jsx | ~20 行 | P1 |
| TikTok Shop 授权入口（GMV Max 前置） | PublishModal | ~30 行 | P2 |

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
| **交互层** | ⭐⭐ 小量改造 | Ad Format 条件化 + Smart+ toggle + Sales destination 选择器 |
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

