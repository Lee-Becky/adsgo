# TikTok 融入 Batch Generate Ads：极简方案

> **核心思路**：和 Meta 一样，大量参数后端默认映射，前端只暴露用户必须选的东西。  
> **目标**：前端改动最小化，用户体验与 Meta 完全一致（选平台→选目标→选 goal→选 event）。

---

## 设计哲学：Meta 已经给我们打了样

看看现有 Meta 的处理方式——用户实际只选 3 件事：

```
Objective: Sales & Conversions
  → Goal: In-web actions
    → Event: Purchase
```

但发布到 Meta API 时，后端默认了一大堆参数：
- `objective`: OUTCOME_SALES ← 从 `sales_conversions` 映射
- `optimization_goal`: OFFSITE_CONVERSIONS ← 从 `in_web_actions` 映射
- `billing_event`: IMPRESSIONS ← 默认，不外露
- `bid_strategy`: LOWEST_COST_WITHOUT_CAP ← 默认竞价，不外露
- `promoted_object.pixel_id`: 发布弹窗选 ← Step 6
- `promoted_object.custom_event_type`: Purchase ← 从 event 映射
- `targeting.publisher_platforms`: ['facebook','instagram'] ← 默认，不外露
- `campaign_type`: AUCTION ← 默认竞价，不外露

**用户不知道也不需要知道这些后端映射。**

---

## TikTok 目标树设计（平台目标动态变更）

### 设计原则

1. **目标树跟随平台动态变更**——TikTok 就显示 TikTok 的目标，不强行和 Meta 对齐
2. **组件通用**——Objective 选择器、Goal 选择器、Event 选择器的 UI 组件不变，只是数据源不同
3. **必需参数在正确的环节收集**——每个 goal 携带的元数据驱动发布弹窗显示哪些资产选择器
4. **后端默认大量参数**——billing_event / bid_type / placement_type 等不外露

### 目标树定义

```javascript
const CAMPAIGN_OBJECTIVES = {
  meta: [
    { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Reach more people' },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Drive site visits' },
    { value: 'leads', label: 'Leads', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Find prospects' },
    { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Drive transactions' },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-primary-500', bg: 'bg-primary-50', description: 'Install & usage' }
  ],
  tiktok: [
    // TikTok 官方 7 个目标，忠实呈现
    { value: 'reach', label: 'Reach', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Maximum ad exposure' },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Drive site/app visits' },
    { value: 'video_views', label: 'Video Views', icon: Play, color: 'text-purple-500', bg: 'bg-purple-50', description: 'Maximize video plays' },
    { value: 'community_interaction', label: 'Community Interaction', icon: Users, color: 'text-pink-500', bg: 'bg-pink-50', description: 'Followers & profile visits' },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-primary-500', bg: 'bg-primary-50', description: 'Installs & in-app actions' },
    { value: 'lead_generation', label: 'Lead Generation', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Collect leads' },
    { value: 'sales', label: 'Sales', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Drive sales on shop/web/app' }
  ]
};
```

### Goal 列表（每个目标的二级选择）

Goal 定义中携带**该 goal 需要的后端参数和发布资产标记**，驱动整个下游逻辑：

```javascript
const ADSET_GOALS_MAPPING = {
  meta: {
    // ... 保持现有不变 ...
  },
  tiktok: {
    reach: [
      { value: 'reach', label: 'Reach', 
        api: { objective_type: 'REACH', optimization_goal: 'REACH', billing_event: 'CPM' },
        assets: ['identity'] }
    ],
    traffic: [
      { value: 'clicks', label: 'Clicks',
        api: { objective_type: 'TRAFFIC', optimization_goal: 'CLICK', billing_event: 'CPC', promotion_type: 'WEBSITE' },
        assets: ['identity'] },
      { value: 'landing_page_views', label: 'Landing page views',
        api: { objective_type: 'TRAFFIC', optimization_goal: 'LANDING_PAGE_VIEW', billing_event: 'OCPM', promotion_type: 'WEBSITE' },
        assets: ['identity'] }
    ],
    video_views: [
      { value: 'video_views', label: 'Video views',
        api: { objective_type: 'VIDEO_VIEWS', optimization_goal: 'VIDEO_VIEW', billing_event: 'CPV' },
        assets: ['identity'] }
    ],
    community_interaction: [
      { value: 'follows', label: 'Followers',
        api: { objective_type: 'ENGAGEMENT', optimization_goal: 'FOLLOW', billing_event: 'CPM' },
        assets: ['identity'] },
      { value: 'profile_visits', label: 'Profile visits',
        api: { objective_type: 'ENGAGEMENT', optimization_goal: 'PROFILE_VISIT', billing_event: 'CPM' },
        assets: ['identity'] }
    ],
    app_promotion: [
      { value: 'app_installs', label: 'App installs',
        api: { objective_type: 'APP_PROMOTION', optimization_goal: 'APP_INSTALL', billing_event: 'OCPM', promotion_type: 'APP' },
        assets: ['identity', 'app'] },
      { value: 'in_app_events', label: 'In-app events', needsEvent: true,
        api: { objective_type: 'APP_PROMOTION', optimization_goal: 'IN_APP_EVENT', billing_event: 'OCPM', promotion_type: 'APP' },
        assets: ['identity', 'app'],
        eventType: 'app' }
    ],
    lead_generation: [
      { value: 'website_leads', label: 'Website leads', needsEvent: true,
        api: { objective_type: 'LEAD_GENERATION', optimization_goal: 'LEAD', billing_event: 'OCPM' },
        assets: ['identity', 'pixel'],
        eventType: 'web' },
      { value: 'instant_form_leads', label: 'Instant form leads',
        api: { objective_type: 'LEAD_GENERATION', optimization_goal: 'LEAD_GENERATION', billing_event: 'OCPM' },
        assets: ['identity', 'instant_form'] },
      { value: 'messaging_leads', label: 'TikTok messages',
        api: { objective_type: 'LEAD_GENERATION', optimization_goal: 'CONVERSATIONS', billing_event: 'OCPM' },
        assets: ['identity'] }
      // P0 不支持 Instant messaging apps（WhatsApp/Messenger 等需第三方集成）
    ],
    sales: [
      { value: 'web_conversions', label: 'Website conversions', needsEvent: true,
        api: { objective_type: 'WEB_CONVERSIONS', optimization_goal: 'CONVERSIONS', billing_event: 'OCPM', sales_destination: 'WEBSITE' },
        assets: ['identity', 'pixel'],
        eventType: 'web' },
      { value: 'web_value', label: 'Website value (ROAS)', needsEvent: true,
        api: { objective_type: 'WEB_CONVERSIONS', optimization_goal: 'VALUE', billing_event: 'OCPM', sales_destination: 'WEBSITE' },
        assets: ['identity', 'pixel'],
        eventType: 'web' },
      { value: 'shop_purchases', label: 'TikTok Shop purchases',
        api: { objective_type: 'PRODUCT_SALES', optimization_goal: 'VALUE', billing_event: 'OCPM', sales_destination: 'TIKTOK_SHOP' },
        assets: ['identity', 'shop'] },
      { value: 'app_sales', label: 'App sales', needsEvent: true,
        api: { objective_type: 'PRODUCT_SALES', optimization_goal: 'CONVERSIONS', billing_event: 'OCPM', sales_destination: 'APP' },
        assets: ['identity', 'app', 'catalog'],
        eventType: 'app' }
    ]
  }
};
```

### 核心设计：`api` 对象 + `assets` 数组

每个 goal 自带两个关键属性：

1. **`api`** — 后端构建 API 请求时需要的所有参数映射，前端不关心
2. **`assets`** — 发布弹窗需要用户选择的资产列表，驱动资产选择器的条件显示

```
assets 取值说明：
  'identity'     → 发布弹窗显示 Identity 选择（所有 TT 广告必需）
  'pixel'        → 发布弹窗显示 Pixel 选择
  'app'          → 发布弹窗显示 App 选择
  'shop'         → 发布弹窗显示 TikTok Shop 选择
  'instant_form' → 发布弹窗显示 Instant Form 选择
  'catalog'      → 发布弹窗显示 Catalog 选择
```

**这样做的好处**：
- 前端不需要写 if/else 判断"当前 goal 需要什么资产"
- 直接读 `currentGoalObj.assets` 数组，循环渲染对应选择器
- 新增 goal 只需在配置中增加一行，不改组件代码

### Event 列表按平台 + eventType 区分

```javascript
const STANDARD_EVENTS = {
  meta: ['Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', 
         'CompleteRegistration', 'SubmitApplication', 'Contact',
         'Search', 'ViewContent', 'Subscribe', 'CustomizeProduct',
         'Donate', 'FindLocation', 'Schedule', 'StartTrial'],
  tiktok: {
    web: ['Purchase', 'AddToCart', 'InitiateCheckout', 'ViewContent',
          'AddPaymentInfo', 'AddToWishlist', 'Lead', 'CompleteRegistration',
          'SubmitForm', 'Contact', 'Subscribe', 'Download', 'Search',
          'StartTrial', 'Schedule', 'SubmitApplication'],
    app: ['InstallApp', 'LaunchAPP', 'CompleteTutorial', 'AchieveLevel',
          'SpendCredits', 'Purchase', 'AddToCart', 'ViewContent',
          'Subscribe', 'Rate', 'Login', 'CreateGroup']
  }
};

// 获取事件列表的方式：
const getEventList = () => {
  if (platform?.id === 'meta') return STANDARD_EVENTS.meta;
  const eventType = currentGoalObj?.eventType; // 'web' 或 'app'
  return STANDARD_EVENTS.tiktok?.[eventType] || [];
};
```

### 用户操作流程——组件通用，数据跟随平台

**选 Meta 时**：
```
Objective: Sales & Conversions → Goal: In-web actions → Event: Purchase
```

**选 TikTok 时**：
```
Objective: Sales → Goal: Website conversions → Event: Purchase
```

**组件完全不变**——同一个 Objective 选择器、同一个 Goal 选择器、同一个 Event 选择器。
只是喂入的 `platformObjectives` 和 `platformGoals` 数据不同。

### 后端映射（零前端感知）

前端传给后端的 payload 只有用户选的东西：

```json
{
  "platform": "tiktok",
  "objective": "sales",
  "goal": "web_conversions",
  "event": "Purchase"
}
```

后端读取 goal 配置中的 `api` 对象，自动映射为 TikTok API 参数：

```json
{
  "objective_type": "WEB_CONVERSIONS",
  "optimization_goal": "CONVERSIONS",
  "billing_event": "OCPM",
  "sales_destination": "WEBSITE",
  "bid_type": "BID_TYPE_COST_CAP",
  "placement_type": "PLACEMENT_TYPE_NORMAL",
  "pacing": "PACING_MODE_SMOOTH",
  "pixel_id": "...",
  "optimization_event": "Purchase",
  "smart_audience_enabled": true
}
```

---

## 完整的后端映射表

### Objective + Goal → TikTok API 参数（基于 SDK CampaignCreateBody + AdgroupCreateBody 字段核实）

| 我们的 Objective | 我们的 Goal | Campaign: objective_type | Campaign: sales_destination | AdGroup: optimization_goal | AdGroup: billing_event | AdGroup: pacing | 需要的资产 |
|---|---|---|---|---|---|---|---|
| awareness_engagement | reach | REACH | — | REACH | CPM | PACING_MODE_SMOOTH | Identity |
| awareness_engagement | video_views | VIDEO_VIEWS | — | VIDEO_VIEW | CPV | PACING_MODE_SMOOTH | Identity |
| awareness_engagement | community_interaction | ENGAGEMENT | — | ENGAGEMENT | CPM | PACING_MODE_SMOOTH | Identity |
| traffic | clicks | TRAFFIC | — | CLICK | CPC | PACING_MODE_SMOOTH | — |
| traffic | landing_page_views | TRAFFIC | — | LANDING_PAGE_VIEW | OCPM | PACING_MODE_SMOOTH | — |
| leads | website_leads | LEAD_GENERATION | — | LEAD | OCPM | PACING_MODE_SMOOTH | Pixel + Event |
| leads | instant_form_leads | LEAD_GENERATION | — | LEAD_GENERATION | OCPM | PACING_MODE_SMOOTH | Instant Form ID |
| leads | messaging_leads | LEAD_GENERATION | — | CONVERSATIONS | OCPM | PACING_MODE_SMOOTH | Identity（TikTok DM）|
| sales_conversions | web_conversions | WEB_CONVERSIONS | WEBSITE | CONVERSIONS | OCPM | PACING_MODE_SMOOTH | Pixel |
| sales_conversions | shop_purchases | PRODUCT_SALES | TIKTOK_SHOP | VALUE | OCPM | PACING_MODE_SMOOTH | TikTok Shop (store_id) |
| app_promotion | app_installs | APP_PROMOTION | — | APP_INSTALL | OCPM | PACING_MODE_SMOOTH | App ID |
| app_promotion | in_app_events | APP_PROMOTION | — | IN_APP_EVENT | OCPM | PACING_MODE_SMOOTH | App ID |

### 每个 Goal 的发布必需参数全面检查（基于 SDK 三层字段逐一核实）

**这是最关键的表。每个参数标注了它属于哪个 API 层级（Campaign / Ad Group / Ad Creative），以及从哪里获取。**

> ⚠️ `identity_id` + `identity_type` 是 **Ad Creative 级参数**（不是 Ad Group 级），所有 TikTok 广告创意都必须指定。

#### Campaign 级必填参数（所有目标通用）

| 参数 | 必需性 | 说明 | 获取方式 |
|---|---|---|---|
| `advertiser_id` | **required** | 广告账户 ID | 发布弹窗选 Ad Account |
| `campaign_name` | **required** | 系列名称 | 从命名模板自动生成 |
| `objective_type` | **required** | 投放目标 | 后端从 goal 映射 |
| `budget_mode` | optional | CBO 开关 | 从 Step 3 预算设置映射 |
| `sales_destination` | 条件 | 仅 Sales 目标 | 后端从 goal 映射（web_conversions→WEBSITE, shop_purchases→TIKTOK_SHOP） |

#### Ad Group 级必填参数（所有目标通用）

| 参数 | 必需性 | 说明 | 获取方式 |
|---|---|---|---|
| `campaign_id` | **required** | 所属系列 | 上一步创建后获得 |
| `adgroup_name` | **required** | 组名称 | 从命名模板自动生成 |
| `optimization_goal` | **required** | 优化目标 | 后端从 goal 映射 |
| `billing_event` | **required** | 计费事件 | 后端从 goal 映射 |
| `budget` | **required** | 预算 | 从 Step 3 预算设置 |
| `budget_mode` | **required** | 预算模式 | 后端根据 CBO/ABO 映射 |
| `pacing` | **required** | 投放节奏 | 后端默认 PACING_MODE_SMOOTH |
| `schedule_type` | **required** | 排期类型 | 后端从 Step 4 排期映射 |
| `schedule_start_time` | **required** | 开始时间 | 从 Step 4 排期 |
| `location_ids` | 推荐 | 投放地区 | 从 Step 2 国家选择 |

#### 各目标 + Goal 的特有必填参数

| Objective | Goal | Ad Group 级特有参数 | Ad Creative 级特有参数 | 获取方式 |
|---|---|---|---|---|
| **awareness** | reach | — | `identity_id` + `identity_type` + `video_id`/`image_ids` | 发布弹窗选 Identity；素材从 Step 1 |
| **awareness** | video_views | — | `identity_id` + `identity_type` + `video_id` | 同上（视频必须） |
| **awareness** | community_interaction | — | `identity_id` + `identity_type` | 同上 |
| **traffic** | clicks | `promotion_type`=WEBSITE | `landing_page_url` + `identity_id` + `identity_type` | 落地页从 Step 4；Identity 从发布弹窗 |
| **traffic** | landing_page_views | `promotion_type`=WEBSITE | `landing_page_url` + `identity_id` + `identity_type` | 同上 |
| **leads** | website_leads | `pixel_id` + `optimization_event` | `landing_page_url` + `identity_id` + `identity_type` | Pixel+Event 从发布弹窗；落地页从 Step 4 |
| **leads** | instant_form_leads | — | `identity_id` + `identity_type` + `card_id`(Instant Form) | Form 从发布弹窗选；Identity 从发布弹窗 |
| **leads** | messaging_leads | — | `identity_id` + `identity_type` + `auto_message_id` | Identity 从发布弹窗（TikTok DM 身份） |
| **sales** | web_conversions | `pixel_id` + `optimization_event` | `landing_page_url` + `identity_id` + `identity_type` | Pixel+Event 从发布弹窗；落地页从 Step 4 |
| **sales** | shop_purchases | `store_id` + `catalog_id`(可选) | `identity_id` + `identity_type` | Shop 从发布弹窗；Identity 从发布弹窗 |
| **app** | app_installs | `app_id` + `promotion_type`=APP | `identity_id` + `identity_type` | App 从发布弹窗；Identity 从发布弹窗 |
| **app** | in_app_events | `app_id` + `promotion_type`=APP + `optimization_event` | `identity_id` + `identity_type` | App+Event 从发布弹窗；Identity 从发布弹窗 |

#### 素材/创意级通用必填参数

| 参数 | 必需性 | 说明 | 获取方式 |
|---|---|---|---|
| `identity_id` | **所有 TikTok 广告必需** | 投放身份 ID | 发布弹窗选 |
| `identity_type` | **所有 TikTok 广告必需** | 身份类型（CUSTOMIZED_USER / TT_USER） | 后端默认或发布弹窗选 |
| `video_id` 或 `image_ids` | **必需之一** | 素材 ID（需先上传获得） | Step 1 产品素材 → 上传 API 获得 ID |
| `ad_text` | 推荐 | 广告文案 | Step 4 文案策略 |
| `call_to_action` | 推荐 | CTA 按钮 | 后端默认或 Step 4 |
| `landing_page_url` | 条件 | 落地页 URL | Step 4 落地页策略（Traffic/Sales-Website/Leads-Website） |

### 关于 Instant Messaging Ads（WhatsApp / Messenger / Zalo）

TikTok 的第四种 Lead source「Instant messaging apps」需要额外的第三方集成参数：

| 参数 | 层级 | 说明 | 必需性 |
|---|---|---|---|
| `messaging_app_type` | Ad Group | WHATSAPP / MESSENGER / ZALO / LINE | 必需 |
| `messaging_app_account_id` | Ad Group | WhatsApp 号码 / FB Page ID / Zalo OA ID | 必需 |
| `message_event_set_id` | Ad Group | 消息事件集 ID | 优化目标为 CONVERSATIONS 时必需 |

**P0 建议**：暂不支持 Instant messaging apps（需集成第三方渠道），仅支持 Website / Instant form / TikTok DM。

### 关于 Traffic 目标的 `promotion_type`

Traffic 目标的 `promotion_type` 决定流量去向：
- `WEBSITE`：引流到网站（需 `landing_page_url`）
- `APP`：引流到 App（需 `app_id`）
- `TIKTOK_SHOP`：引流到 TikTok 店铺

**P0 建议**：默认 `promotion_type: WEBSITE`（后端写死），因为我们的落地页策略已经覆盖了这个场景。

**SDK 事实依据**：
- `sales_destination` 是 **Campaign 级参数**（存在于 `CampaignCreateBody` 中），不是 Ad Group 级
- `optimization_goal` 在 **Ad Group 级 required**（存在于 `AdgroupCreateBody` 中）
- `billing_event` 在 **Ad Group 级 required**
- `pacing` 在 **Ad Group 级 required**（SDK 中标注 required，必须传）
- `schedule_type` 在 **Ad Group 级 required**
- `schedule_start_time` 在 **Ad Group 级 required**

### 后端默认的参数（前端不外露）

| 参数 | 默认值 | 说明 |
|---|---|---|
| `placement_type` | `AUTOMATIC` | 自动版位（和 Meta 一样不让用户选） |
| `bid_type` | `BID_TYPE_COST_CAP` | 默认成本上限竞价 |
| `billing_event` | 由 goal 决定（见上表） | CPC / CPM / CPV / OCPM |
| `campaign_type` | `REGULAR_CAMPAIGN` | 默认普通竞价（不是 R&F） |
| **Campaign 级** | | |
| `campaign_type` | 不传（默认普通竞价） | SDK 中 optional，不传 = 普通 Auction |
| `is_search_campaign` | `false` | P0 不支持 Search |
| `is_advanced_dedicated_campaign` | `false` | P0 不支持 |
| `sales_destination` | 由 goal 映射 | **SDK 确认此字段在 Campaign 级**（见下方映射表） |
| **Ad Group 级** | | |
| `placement_type` | `PLACEMENT_TYPE_NORMAL` | SDK 默认值，自动版位 |
| `billing_event` | 由 goal 映射（见映射表） | required 字段，后端自动填入 |
| `bid_type` | 由 goal 映射 | 默认 COST_CAP |
| `identity_type` | `TT_ACCOUNT` | 默认使用 TikTok 账号身份 |
| `schedule_type` | `SCHEDULE_FROM_NOW` 或 `SCHEDULE_START_END` | 根据用户排期设置 |
| `pacing` | `PACING_MODE_SMOOTH` | required 字段，后端默认匀速投放 |
| `smart_audience_enabled` | `true` | 允许系统在手动受众基础上做扩展，不外露 |
| `smart_interest_behavior_enabled` | `true` | 允许系统扩展兴趣行为定向，不外露 |

### Smart+ 的设计说明（P0 不支持，后续迭代）

**关键认知：TikTok Smart+ 与 Meta Advantage+ 的本质不同**

| 维度 | Meta Advantage+ | TikTok Smart+ |
|---|---|---|
| **控制粒度** | **分散式**：受众/版位/创意/预算各自独立开关 | **Campaign 级一刀切**：开 = 全部自动 |
| **在 Ads Manager 的位置** | Adset 受众、Adset 版位、Ad 创意各自有 Advantage+ 开关 | Campaign 创建时选 "Smart+ campaign"（见截图） |
| **API 层面** | Adset 级参数（`targeting_optimization`、`advantage_placements` 等） | Campaign 级参数（`is_smart_campaign` 或独立 API endpoint） |
| **我们现有代码对 Meta 的处理** | Adset 受众处的 `ADV`/`Adv+` 选项 = Advantage+ Audience（只是受众层面） | — |

**因此**：
- TikTok Smart+ **不能**像 Meta Advantage+ 一样放在 Adset 受众处，因为它是 Campaign 级开关
- P0 阶段：后端默认 `smart_plus: false`（Manual 模式），前端不做任何处理
- 后续迭代：在 Step 3 架构配置的**顶部**增加一个 Campaign 级 toggle："启用 Smart+ 智能优化"
  - 启用后：锁定受众为自动、版位为自动、出价为自动、创意自动轮播
  - 这是一个 **Campaign 级开关**，影响该 Campaign 下所有 Adset 和 Ad

### R&F / Search / GMV Max 的后端处理

这些特殊模式**在 P0 阶段可以先不支持**。如果未来要支持：

| 特殊模式 | 触发条件（后端判断） | 覆盖参数 |
|---|---|---|
| R&F | goal = 'reach' + 用户手动选 R&F | `campaign_type: 'REACH_AND_FREQUENCY'`, `reservation_buy_type: 'RESERVATION'` |
| Search | 用户输入了 search_keywords | `search_keywords: [...]`, `placement: 'SEARCH'` |
| GMV Max | goal = 'shop_purchases' | `campaign_type: 'GMV_MAX'`, 大部分参数系统接管 |

---

## 前端改动汇总（极简版）

### Step 1 — 不改（0 行）

### Step 2 — 投放目标与渠道（~120 行）

| 改什么 | 行数 | 说明 |
|---|---|---|
| PLATFORMS 启用 TikTok | 1 | `disabled: false` |
| CAMPAIGN_OBJECTIVES 加 tiktok key | ~25 | TikTok 7 个目标 |
| ADSET_GOALS_MAPPING 加 tiktok key | ~60 | 每 goal 携带 `api` + `assets` 元数据 |
| STANDARD_EVENTS 加 tiktok key（web/app） | ~15 | 按 eventType 拆分 |
| 平台切换重置 | ~10 | useEffect 清空 objective/goal/event |
| 引用修改（3 处） | ~6 | 数组查找改为字典查找 |
| objectiveStage | 0 | **不改**，保持三级 |
| 新增状态变量 | 0 | **不需要**——一切元数据在 goal 定义中 |

**设计关键**：
- TikTok 显示**自己的 7 个目标**，不强行压缩到 Meta 的 5 个
- Sales destination / Lead source / Promotion type 打平到 **goal 层级**
- 每个 goal 的 `assets` 数组**驱动发布弹窗**显示哪些资产选择器
- 每个 goal 的 `api` 对象**驱动后端**构建 TikTok API 请求
- **组件完全通用**——同一个 Objective/Goal/Event 选择器，数据源不同

### Step 3 — 架构与预算（~25 行）

| 改什么 | 行数 | 说明 |
|---|---|---|
| Ad Format 条件化 | ~15 | TikTok 下 FLEXIBLE→CAROUSEL/SINGLE |
| 受众选项按平台条件化 | ~10 | TikTok 下 `ADV` → `Broad`（广投，后端不传受众字段） |

**受众对齐说明**：
- Meta `ADV`/`Adv+` → Advantage+ Audience（Adset 级开关，系统自动扩展）
- TikTok `Broad` → 广投模式（不传 audience_ids / interest_ids，系统全自动找人）
- 两者**用户体验一致**：选了就不需要额外配置受众
- TikTok 的 LAL / INT / CUSTOM → 与 Meta 完全一致（Lookalike / Interest / Custom Audience）
- 后端默认 `smart_audience_enabled: true`（在 LAL/INT/CUSTOM 基础上允许系统做扩展）

**关键事实（基于 TikTok 官方 SDK 源码 `AdgroupCreateBody` + API 行为调研）**：

SDK 中 Ad Group Create 的受众相关字段：
- `audience_ids` — optional list（自定义受众 / Lookalike 受众 ID）
- `excluded_audience_ids` — optional list（排除受众）
- `interest_category_ids` — optional list（兴趣分类定向）
- `interest_keyword_ids` — optional list（兴趣关键词定向）
- `age_groups`, `gender`, `location_ids`, `languages` — 人口统计
- `smart_audience_enabled` — **optional bool**（智能受众扩展，Ad Group 级）
- `smart_interest_behavior_enabled` — **optional bool**（智能兴趣行为扩展，Ad Group 级）
- **没有 `auto_targeting_enabled` 字段**（SDK 中不存在）

**调研确认的三种定向模式**：

| 模式 | 实现方式 | 等同于 Meta |
|---|---|---|
| **Broad / 广投** | **不传** `audience_ids` 和 `interest_category_ids`，系统全自动找人 | ≈ Adv+（无手动约束） |
| **Smart 扩展** | 传入受众/兴趣 + `smart_audience_enabled: true` | ≈ Adv+（有手动基线+系统扩展） |
| **精准手动** | 传入受众/兴趣 + `smart_audience_enabled: false` | ≈ 纯 LAL/INT/CUSTOM |

**关键发现**：TikTok 实现"全自动定向"的方式不是通过一个 `auto_targeting_enabled` 开关，
而是**直接不传受众和兴趣字段**——这就是 Broad Targeting（广投），TikTok 官方推荐的策略之一。

因此 TikTok 下**可以有类似 ADV 的选项**，只是后端实现方式不同：

```javascript
const AUDIENCE_OPTIONS = {
  meta: ['ADV', 'LAL', 'INT', 'CUSTOM'],
  tiktok: ['BROAD', 'LAL', 'INT', 'CUSTOM']
};

const AUDIENCE_SHORT_LABELS = {
  meta:   { ADV: 'Adv+', LAL: 'LAL', INT: 'INT', CUSTOM: 'SA' },
  tiktok: { BROAD: 'Broad', LAL: 'LAL', INT: 'INT', CUSTOM: 'Custom' }
};
```

**后端映射**：

| 前端受众选择 | 后端 Ad Group 参数 |
|---|---|
| **BROAD**（广投） | 不传 `audience_ids` / `interest_category_ids`；`smart_audience_enabled: true` |
| **LAL** | `audience_ids: [lookalike_id]`；`smart_audience_enabled: true`（默认扩展） |
| **INT** | `interest_category_ids: [...]`；`smart_interest_behavior_enabled: true`（默认扩展） |
| **CUSTOM** | `audience_ids: [custom_audience_id]`；`smart_audience_enabled: true` |

**TikTok Lookalike 确认可用**：
- TikTok 有完整的 Lookalike Audience 支持
- 通过 Audience API 提前创建（基于 Custom Audience，需 1000+ 匹配用户）
- 创建后得到 `audience_id`，在 Ad Group 的 `audience_ids` 中引用
- 与 Meta LAL 使用方式完全一致

### Step 4 — 高级设置（~10 行）

| 改什么 | 行数 | 说明 |
|---|---|---|
| Carousel 逐卡落地页选项 | ~10 | CAROUSEL 时增加"逐卡/统一"选择 |

### Step 5 — 预览树（~30 行）

| 改什么 | 行数 | 说明 |
|---|---|---|
| buildAds() CAROUSEL 分支 | ~25 | 多素材组合成轮播广告 |
| isFlexible 排除 TikTok | ~5 | 条件判断修正 |

### Step 6 — 发布弹窗（~120 行）

| 改什么 | 行数 | 说明 |
|---|---|---|
| TikTok 连接 | ~30 | 复制 Meta 连接块结构 |
| TikTok 资产链路 | ~90 | 根据 goal 条件显示：Identity(必需) → Pixel(条件) → Event(条件) → Form/Shop/App(条件) |

**资产显示条件（基于发布必需参数表驱动）**：

| 资产 | 何时显示 | 判断依据 | 不选的后果 |
|---|---|---|---|
| **Ad Account** | 所有 TikTok 广告 | `platform === 'tiktok'` | API 报错：advertiser_id 缺失 |
| **Identity** | 所有 TikTok 广告 | `platform === 'tiktok'` | API 报错：identity_id 缺失 |
| **Pixel** | web_conversions / website_leads | goal 标记 `needsPixel` | API 报错：pixel_id 缺失 |
| **Event** | goal.needsEvent === true | 同 Meta 逻辑 | API 报错：optimization_event 缺失 |
| **Instant Form** | instant_form_leads | goal 标记 `needsForm` | API 报错：无法创建表单类广告 |
| **TikTok Shop** | shop_purchases | goal 标记 `needsShop` | API 报错：store_id 缺失 |
| **App** | app_installs / in_app_events | goal 标记 `needsApp` | API 报错：app_id 缺失 |

**前端校验规则**：发布按钮只有在**所有必需资产都已选择**后才可点击（同 Meta 现有逻辑）。

---

## 总汇总

| Step | 改动量 | 说明 |
|---|---|---|
| Step 1 产品/素材 | **0 行** | 不改 |
| Step 2 目标与渠道 | **~120 行** | TikTok 7 个目标 + goal 携带 api/assets 元数据 |
| Step 3 架构/预算 | **~20 行** | Ad Format 条件化 + 受众标签对齐 |
| Step 4 高级设置 | **~10 行** | Carousel 逐卡落地页 |
| Step 5 预览树 | **~30 行** | buildAds() CAROUSEL |
| Step 6 发布弹窗 | **~120 行** | TikTok 连接 + 资产链路 |
| **合计** | **~320 行** | **4 个文件，1.5 周 P0** |

---

## 与上一版方案的对比

| 维度 | 上一版（硬搬 TikTok UI） | 本版（后端默认映射） |
|---|---|---|
| 前端改动量 | ~483 行 | **~320 行**（减少 34%） |
| 新增状态变量 | 6 个 | **0 个** |
| objectiveStage 修改 | 3 级→4 级 | **不改，保持 3 级** |
| TikTok 目标数量 | 7 个（照搬 TT） | **7 个（忠实于 TT，不强行压缩）** |
| Sales destination | 前端让用户选 | **打平到 goal 层（web_conversions / shop_purchases / app_sales）** |
| Lead source | 前端让用户选 | **打平到 goal 层（website_leads / instant_form / messaging）** |
| Smart+ | Step 2 的 Campaign setup | **P0 不支持，后端默认 Manual；后续在 Step 3 顶部加 Campaign 级 toggle** |
| Search campaign | Step 2 的 Campaign setup | **P0 不支持，后续 Step 4 关键词** |
| R&F | Step 2 的 Campaign type | **P0 不支持** |
| 用户体验 | 选 TikTok 后流程变长 | **和 Meta 完全一致** |

---

## P0 不支持、后续迭代的功能

| 功能 | 原因 | 后续方案 |
|---|---|---|
| R&F（Reach & Frequency） | 需要预约制、频次配置，用量少 | 后续在 Reach goal 中加子选项 |
| Search campaign | 需要关键词输入 | 后续在高级设置加关键词模块 |
| GMV Max | 需要 TikTok Shop 授权，复杂度高 | 通过 shop_purchases goal 触发，后端处理 |
| App retargeting | 需要已安装用户数据 | 后续在 App goal 中加子选项 |
| Lead - DM / Messaging | 需要 TikTok DM 或第三方消息集成 | 后续迭代 |
| Spark Ads | 需要授权帖子流程 | 后续在 Ad Format 中加入 |
| Video views（独立目标） | 已并入 awareness_engagement 的 goal | 不需要单独处理 |
| Community interaction（独立目标） | 已并入 awareness_engagement 的 goal | 不需要单独处理 |

