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

## TikTok 的同等处理方式

### 前端：和 Meta 完全一样的三级选择

TikTok 的 objective list 只需要和 Meta 的 5 个目标**语义对齐**即可，不需要照搬 TikTok 的 7 个目标：

```javascript
const CAMPAIGN_OBJECTIVES = {
  meta: [
    { value: 'awareness_engagement', label: 'Awareness & Engagement', ... },
    { value: 'traffic', label: 'Traffic', ... },
    { value: 'leads', label: 'Leads', ... },
    { value: 'sales_conversions', label: 'Sales & Conversions', ... },
    { value: 'app_promotion', label: 'App Promotion', ... }
  ],
  tiktok: [
    { value: 'awareness_engagement', label: 'Reach & Awareness', icon: Megaphone, ... },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2, ... },
    { value: 'leads', label: 'Lead Generation', icon: Users, ... },
    { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, ... },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, ... }
  ]
};
```

**为什么不照搬 TikTok 的 7 个目标？**
- TikTok 的 `Video views` 和 `Community interaction` → 可以并入 `awareness_engagement` 的 Goal 中
- TikTok 的 `Sales` → 等同于我们的 `sales_conversions`
- 用户在我们平台上选目标时，心智模型保持统一：**"我要干什么"**，而不是"TikTok 叫什么"

### Goal 列表才是差异所在

差异体现在**第二级 Goal 选择**中。不同平台、不同 objective 下，可选的 goal 不同：

```javascript
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
    awareness_engagement: [
      { value: 'reach', label: 'Reach' },
      { value: 'video_views', label: 'Video views' },
      { value: 'community_interaction', label: 'Community interaction' }
    ],
    traffic: [
      { value: 'clicks', label: 'Clicks' },
      { value: 'landing_page_views', label: 'Landing page views' }
    ],
    leads: [
      { value: 'website_leads', label: 'Website leads', needsEvent: true },
      { value: 'instant_form_leads', label: 'Instant form leads' }
    ],
    sales_conversions: [
      { value: 'web_conversions', label: 'Website conversions', needsEvent: true },
      { value: 'shop_purchases', label: 'TikTok Shop purchases' }
    ],
    app_promotion: [
      { value: 'app_installs', label: 'App installs' },
      { value: 'in_app_events', label: 'In-app events', needsEvent: true }
    ]
  }
};
```

### Event 列表按平台区分

```javascript
const STANDARD_EVENTS = {
  meta: ['Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', ...],
  tiktok: ['Purchase', 'AddToCart', 'InitiateCheckout', 'Lead',
           'CompleteRegistration', 'SubmitForm', 'ViewContent', 
           'Subscribe', 'Download', 'AddToWishlist', 'Search', ...]
};
```

### 用户操作流程——和 Meta 完全一致

```
用户选 TikTok：
  Objective: Sales & Conversions
    → Goal: Website conversions        ← 用户只选这个
      → Event: Purchase                ← 用户只选这个
```

**后端自动映射（用户不看不选）**：

```
前端传给后端的 payload:
{
  platform: 'tiktok',
  objective: 'sales_conversions',
  goal: 'web_conversions',
  event: 'Purchase'
}

后端映射为 TikTok API 参数:
{
  objective_type: 'WEB_CONVERSIONS',           ← 从 goal='web_conversions' 映射
  optimization_goal: 'CONVERSIONS',            ← 从 goal 映射
  billing_event: 'OCPM',                       ← 默认，不外露
  bid_type: 'BID_TYPE_COST_CAP',              ← 默认，不外露
  placement_type: 'AUTOMATIC',                 ← 默认自动版位，不外露
  pixel_id: '...',                             ← 发布弹窗选
  conversion_event: 'Purchase'                 ← 从 event 映射
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
| leads | website_leads | LEAD_GENERATION | — | LEAD | OCPM | PACING_MODE_SMOOTH | Pixel |
| leads | instant_form_leads | LEAD_GENERATION | — | LEAD_GENERATION | OCPM | PACING_MODE_SMOOTH | Instant Form |
| sales_conversions | web_conversions | WEB_CONVERSIONS | WEBSITE | CONVERSIONS | OCPM | PACING_MODE_SMOOTH | Pixel |
| sales_conversions | shop_purchases | PRODUCT_SALES | TIKTOK_SHOP | VALUE | OCPM | PACING_MODE_SMOOTH | TikTok Shop (store_id) |
| app_promotion | app_installs | APP_PROMOTION | — | APP_INSTALL | OCPM | PACING_MODE_SMOOTH | App ID |
| app_promotion | in_app_events | APP_PROMOTION | — | IN_APP_EVENT | OCPM | PACING_MODE_SMOOTH | App ID |

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

### Step 2 — 投放目标与渠道（~100 行）

| 改什么 | 行数 | 说明 |
|---|---|---|
| PLATFORMS 启用 TikTok | 1 | `disabled: false` |
| CAMPAIGN_OBJECTIVES 加 tiktok key | ~15 | 5 个目标，和 Meta 同构 |
| ADSET_GOALS_MAPPING 加 tiktok key | ~25 | 每个 objective 下 2-3 个 goal |
| STANDARD_EVENTS 加 tiktok key | ~10 | TikTok 的标准事件列表 |
| 平台切换重置 | ~10 | useEffect 清空 objective/goal/event |
| 引用修改（3 处） | ~6 | 数组查找改为字典查找 |
| 不需要 objectiveStage 扩展 | 0 | **所有二级配置都隐藏到 goal 选择中了** |
| 不需要 sub_config 阶段 | 0 | **Sales destination 等通过 goal 隐式处理** |
| 不需要新增状态变量 | 0 | **不需要 salesDestination / leadSource 等** |

**关键简化**：
- TikTok 的 `Sales destination: Website` → 映射为 goal `web_conversions`
- TikTok 的 `Sales destination: TikTok Shop` → 映射为 goal `TT_shop_purchases`
- TikTok 的 `Lead source: Website` → 映射为 goal `website_leads`
- TikTok 的 `Lead source: Instant form` → 映射为 goal `instant_form_leads`
- TikTok 的 `Promotion type: Install` → 映射为 goal `app_installs`
- TikTok 的 `Promotion type: Retargeting` → **P0 不支持，后续迭代**
- TikTok 的 `Campaign type: R&F` → **P0 不支持，后续迭代**

**用户根本不需要知道 TikTok 前端的 destination / source / type 概念。
用户只需要选 goal，后端自动映射到正确的 API 参数。**

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

**资产显示条件（后端映射表驱动）**：

| 资产 | 何时显示 | 判断依据 |
|---|---|---|
| **Identity** | 所有 TikTok 广告 | `platform === 'tiktok'` |
| **Pixel** | web_conversions / website_leads | 后端映射表中标记 `needsPixel` |
| **Event** | goal.needsEvent === true | 同 Meta 的逻辑 |
| **Instant Form** | instant_form_leads | 后端映射表中标记 `needsForm` |
| **TikTok Shop** | shop_purchases | 后端映射表中标记 `needsShop` |
| **App ID** | app_installs / in_app_events | 后端映射表中标记 `needsApp` |

---

## 总汇总

| Step | 改动量 | 说明 |
|---|---|---|
| Step 1 产品/素材 | **0 行** | 不改 |
| Step 2 目标与渠道 | **~100 行** | 3 个常量加 tiktok key + 3 处引用修改 |
| Step 3 架构/预算 | **~20 行** | Ad Format 条件化 + 受众标签对齐 |
| Step 4 高级设置 | **~10 行** | Carousel 逐卡落地页 |
| Step 5 预览树 | **~30 行** | buildAds() CAROUSEL |
| Step 6 发布弹窗 | **~120 行** | TikTok 连接 + 资产链路 |
| **合计** | **~280 行** | **4 个文件，1 周 P0** |

---

## 与上一版方案的对比

| 维度 | 上一版（硬搬 TikTok UI） | 本版（后端默认映射） |
|---|---|---|
| 前端改动量 | ~483 行 | **~280 行**（减少 42%） |
| 新增状态变量 | 6 个 | **0 个** |
| objectiveStage 修改 | 3 级→4 级 | **不改，保持 3 级** |
| TikTok 目标数量 | 7 个（照搬 TT） | **5 个（和 Meta 同构）** |
| Sales destination | 前端让用户选 | **隐藏到 goal 选择中** |
| Lead source | 前端让用户选 | **隐藏到 goal 选择中** |
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

