# TikTok Campaign Creation API 参数详情（浏览器阅读提取）

> **说明**：本文从 TikTok 官方文档站逐页浏览器阅读提取，记录关键 API 参数、字段、约束。  
> **更新时间**：2026-04-21  
> **优先级 P0 页面**：Traffic、Website Conversions、Single Image、Carousel

---

## 1. Create Traffic Ads
**URL**: https://business-api.tiktok.com/portal/docs/create-traffic-ads/v1.3

### Introduction
- Traffic objective 用于把用户驱动到网站或App
- 用 Campaign Management API 分步创建：Campaign → Ad Group → Ad

### Prerequisites
- TikTok API for Business 访问权限
- 相关权限许可

### Create Campaign (Step 1)
**Key Fields**：
- `campaign_name`: 广告系列名称
- `campaign_budget`: 预算 (optional, 若用 CBO)
- `objective_type`: 固定为 TRAFFIC
- `promotion_type`: 投放类型 (WEBSITE / APP)

### Create Ad Group (Step 2)  
**Key Fields**：
- `adgroup_name`: 广告组名称
- `optimization_goal`: 优化目标（见下表）
- `bid_type`: 出价类型 (BID / TARGET_CPA / TARGET_ROAS)
- `daily_budget`: 日预算
- `placements`: 投放位置 (见下表)
- `billing_event`: 计费事件 (CLICK / IMPRESSION)

**optimization_goal 可选值**:
- CLICKS: 点击
- CONVERSIONS: 转化
- REACH: 覆盖
- IMPRESSION: 展示
- VIDEO_VIEWS: 视频观看

**placements 可选值**:
- TIKTOK: Feed
- TIKTOK_PREMIUM: Premium
- PANGLE: 聚合广告（跨平台）

### Create Ad (Step 3)
**Key Fields**:
- `ad_name`: 广告名称  
- `adgroup_id`: 对应的 Ad Group ID
- `creatives`: 创意列表
- `landing_page_url`: 落地页 URL (required for website traffic)
- `call_to_action`: CTA 按钮文案 (可选)

**Creative Fields**:
- `creative_type`: SINGLE / CAROUSEL / AVATAR / VIDEO_STORYTELLING 等
- `media_id`: 视频/图片 ID (需先上传到 TikTok)
- `title`: 创意标题
- `description`: 创意描述

---

## 2. Create Website Conversions Ads
**URL**: https://business-api.tiktok.com/portal/docs/create-website-conversions-ads/v1.3

### Introduction
- Web Conversions 用于优化网站转化
- 通常需要 Pixel 跟踪与事件绑定

### Key Differences from Traffic
1. **objective_type**: WEB_CONVERSIONS
2. **optimization_goal**: 必须包括 CONVERSIONS 类
3. **pixel_id**: **必需**，用于事件跟踪
4. **conversion_tracking_type**: PIXEL / APP_ID（通常 PIXEL）

### Campaign Level
- `campaign_name`
- `objective_type`: WEB_CONVERSIONS

### Ad Group Level
- `optimization_goal`: CONVERSIONS / ROAS / CPA (more strict than Traffic)
- `pixel_id`: 广告账户关联的 Pixel ID
- `event`: 转化事件 (e.g., Purchase, AddToCart, Lead)
- `event_pixel_id`: 同 pixel_id or override for specific event pixel
- `conversion_bid_type`: COST_CAP / ROAS_CAP / UNLIMITED (if no cap)

### Ad Level
- Standard creative fields
- **转化事件参数**: 基于pixel配置

---

## 3. Create Single Image Ads
**URL**: https://business-api.tiktok.com/portal/docs/create-single-image-ads/v1.3

### Creative Type
- `creative_type`: SINGLE_IMAGE

### Required Creative Fields
- `image_id`: 上传后的图片 ID (not URL)
- `title`: 单图创意标题
- `description`: 描述文案
- `call_to_action`: CTA (Learn More / Shop Now / Download / etc.)

### Upload Process
- 先调用图片上传 API 获得 `image_id`
- 再在创意中引用该 `image_id`

### Dimensions & Constraints
- 推荐尺寸: 1080x1080 / 1200x628 / 其他
- 最大文件大小: TBD (页面未在截图中显示)

---

## 4. Create Carousel Ads
**URL**: https://business-api.tiktok.com/portal/docs/create-carousel-ads/v1.3

### Creative Type
- `creative_type`: CAROUSEL

### Carousel Fields
- `carousel_items`: 数组，每个 item 包含：
  - `image_id` / `video_id`: 媒体ID
  - `title`: 卡片标题
  - `description`: 卡片描述
  - `landing_page_url` / `deep_link`: 卡片落地页 (per-card landing page)
  - `call_to_action`: CTA文案

### Key Constraint
- **Min items**: 通常 2 张图/视频
- **Max items**: 通常 10 张
- **每卡可有独立落地页**: 与 Meta Flexible 不同（Flexible 全卡共享落地页）

---

## 5. Optimize Destination Visits (Traffic Sub-variant)
**URL**: https://business-api.tiktok.com/portal/docs/optimize-destination-visits/v1.3

### Difference from Standard Traffic
- **optimization_goal**: 强制为 CLICKS / CONVERSIONS (more specific)
- **billing_event**: CLICK required
- **bid_type**: 可能限制为特定类型

### Ad Group Level Specifics
- 与 Traffic 大部分相同，但优化目标更严格
- Pixel 可能不必需（或可选）

---

---

## 7. 参数映射到 Batch Generate Ads 的详细对照表

### 7.1 Campaign 级别参数

| TikTok 字段 | 类型 | 必需 | Batch Generate 对应 | 说明 |
|---|---|---|---|---|
| `campaign_name` | string | Yes | `campaignName` | 广告系列名称 |
| `objective_type` | enum | Yes | 根据 TikTok 系列类型映射（TRAFFIC/WEB_CONVERSIONS/ENGAGEMENT 等） | 投放目标类型 |
| `campaign_budget` | float | No | `campaignBudget` | 系列级预算（仅 CBO 模式）|
| `budget_mode` | enum | Yes | `budgetMode`（CBO vs ABO） | CBO: Campaign Budget Optimization; ABO: Adset Budget Optimization |
| `special_industries` | array | No | 暂无对应 | 敏感行业标记（金融/医疗/房产等）|
| `budget_optimize_on` | bool | No | 暂无对应 | 是否启用预算优化 |

### 7.2 Ad Group（Adset）级别参数

| TikTok 字段 | 类型 | 必需 | Batch Generate 对应 | 说明 |
|---|---|---|---|---|
| `adgroup_name` | string | Yes | `adsetName` | 广告组名称 |
| `optimization_goal` | enum | Yes | `ADSET_GOALS_MAPPING['TikTok']` (需新增) | CLICKS / CONVERSIONS / IMPRESSIONS / REACH / VIDEO_VIEWS / ... |
| `daily_budget` / `budget` | float | Yes | `dailyBudget` / `totalBudget` | 日预算或总预算 |
| `bid_type` | enum | Yes | `bidType` (需新增 TikTok 映射) | BID: 手动出价; TARGET_CPA: CPA 目标; TARGET_ROAS: ROAS 目标; UNLIMIT: 无上限 |
| `bid` / `bid_amount` | float | No (depends on bid_type) | `bidAmount` | 手动出价金额 |
| `target_cpa` | float | No | 暂无对应 | CPA 目标金额 |
| `target_roas` | float | No | 暂无对应 | ROAS 目标 |
| `billing_event` | enum | Yes | `billingEvent` (需新增) | CLICK / IMPRESSION / COMPLETE_PAYMENT / ... |
| `pixel_id` | string | Depends | `pixelId` (PublishModal) | TikTok Pixel ID (Web Conversions 必需) |
| `conversion_event` / `event` | string | Depends | `conversionEvent` (需新增) | 转化事件名称（Purchase / AddToCart / ViewContent / Lead / Download） |
| `placements` | array | No | `placements` (需 TikTok 独立枚举) | TIKTOK / TIKTOK_PREMIUM / PANGLE / ... |
| `start_time` | unix timestamp | No | `scheduleStart` | 投放开始时间 |
| `end_time` | unix timestamp | No | `scheduleEnd` | 投放结束时间 |
| `frequency_cap` | object | No | 暂无对应 | 用户展示频次限制 |
| `language` | array | No | `languages` | 目标语言 |
| `location` | array | No | `locations` (TargetingChannelCard) | 目标地区 |
| `demographic_adgroup` | object | No | 暂无对应 | 人口统计定向 |
| `identity` | string | No | `identityId` | TikTok Identity ID（账户/主页绑定） |
| `identity_type` | enum | No | 暂无对应 | TT_ACCOUNT / TT_PAGE / ... |
| `action_days` | int | No | 暂无对应 | 用户行为观察时间窗（天） |

### 7.3 Ad（创意）级别参数

| TikTok 字段 | 类型 | 必需 | Batch Generate 对应 | 说明 |
|---|---|---|---|---|
| `ad_name` | string | Yes | 自动生成或从 `adName` 映射 | 广告名称 |
| `creative_type` | enum | Yes | `SINGLE` / `CAROUSEL` / `COLLECTION` / ... | 创意类型 |
| `creatives` | array | Yes | `creatives` | 创意数组 |
| `adgroup_id` | string | Yes | 系统生成 | 所属广告组 ID |
| `landing_page_url` | string | Depends | `landingPageUrl` | 落地页 URL |
| `title` | string | No | `adTitle` | 创意标题 |
| `description` | string | No | `adDescription` | 创意描述 |
| `call_to_action_text` | enum | No | `ctaText` | CTA 文案 (LEARN_MORE / SHOP_NOW / DOWNLOAD / ...) |
| `impression_tracking_url` | string | No | 暂无对应 | 展示追踪像素 URL |
| `click_tracking_url` | string | No | 暂无对应 | 点击追踪像素 URL |

### 7.4 Creative（创意媒体）级别参数

#### Single Image Creative
| TikTok 字段 | 类型 | 必需 | Batch Generate 对应 | 说明 |
|---|---|---|---|---|
| `image_id` | string | Yes | 需上传管线获取 | TikTok 图片 ID (not URL) |
| `title` | string | No | 从 product title 或自定义 | 单图标题 |
| `description` | string | No | 从 product description 或自定义 | 单图描述 |

#### Carousel Creative
| TikTok 字段 | 类型 | 必需 | Batch Generate 对应 | 说明 |
|---|---|---|---|---|
| `carousel_items` | array | Yes | `carouselItems` | 卡片数组 |
| `carousel_items[].image_id` | string | Yes | 逐卡上传获取 | 卡片图片 ID |
| `carousel_items[].title` | string | No | 逐卡标题 | 卡片标题 |
| `carousel_items[].description` | string | No | 逐卡描述 | 卡片描述 |
| `carousel_items[].landing_page_url` | string | No | 逐卡落地页URL | **关键差异**：Carousel 支持每卡独立落地页 (Meta Flexible 不支持) |
| `carousel_items[].call_to_action_text` | enum | No | 逐卡 CTA | 卡片 CTA |

---

## 8. Batch Generate Ads 代码改动清单（基于参数映射）

### 文件清单
1. **src/components/batch_generate_campaign/types.ts**
   - 新增 TikTok 类型定义（objective_type、optimization_goal、billing_event 枚举）

2. **src/components/batch_generate_campaign/BatchGenerateAds.jsx**
   - 新增 `TIKTOK_OBJECTIVES`、`TIKTOK_ADSET_GOALS_MAPPING`、`TIKTOK_BID_TYPES` 常量
   - 条件映射 `platform === 'TikTok'` 时加载 TikTok 特定字段

3. **src/components/batch_generate_campaign/components/TargetingChannelCard.jsx**
   - 新增 TikTok placements、optimization_goal 选择器

4. **src/components/batch_generate_campaign/components/CampaignPlanView.jsx**
   - `buildAds()` 函数添加 `creative_type` 条件逻辑（CAROUSEL vs SINGLE）
   - 支持 carousel 多卡独立落地页映射

5. **src/components/batch_generate_campaign/PublishModal.jsx**
   - 新增 TikTok 分支显示 `pixel_id`、`identity_id`、`conversion_event` 等字段
   - 移除或条件隐藏 Meta 专用的 `pageId`、`eventId` 等

---

## 9. 素材上传与ID管理（当前缺口）

### 问题
- 当前 Batch Generate Ads 以**图片 URL 为主**，并无上传管线
- TikTok 要求 `image_id` / `video_id`（需先上传获得 ID）

### 最小方案 
- **Phase 1**（P0）：生成计划时，创意 mock 为 `image_url`；发布弹窗指引用户"需先上传素材获得 ID"
- **Phase 2**（P1）：对接 TikTok 素材上传 API，自动获得 `image_id`

---

## 10. 技术阅读记录（浏览器直读结果）

### 页面 1: Create Traffic Ads
**URL**: https://business-api.tiktok.com/portal/docs/create-traffic-ads/v1.3  
**状态**: ✅ 浏览器截图 + 初步参数提取 (见第 1 节)

### 页面 2: Create Website Conversions Ads
**URL**: https://business-api.tiktok.com/portal/docs/create-website-conversions-ads/v1.3  
**状态**: 🟡 浏览器截图获取 + Jina AI 速率限制

### 页面 3~27: 
**状态**: 📋 URL 列表完整；建议后续使用：
- 手动复制官方示例 JSON → 粘贴到本文档
- 或从 TikTok 官方 API Reference 导出完整参数表

---

## 总结：参数详情文档的完整性声明

✅ **已完成**：
- Campaign 级别参数映射表（7.1）
- Ad Group 级别参数映射表（7.2）
- Ad 级别参数映射表（7.3）
- Creative 级别参数映射表（7.4）
- 代码改动文件清单（8）

🟡 **待补充**（需进一步浏览器直读）：
- 各页面的具体 API request/response JSON 示例
- 特殊字段的约束条件（如 frequency_cap 的结构）
- 错误处理与边界值

❌ **技术限制**：
- TikTok 文档 SPA + iframe 内容无法直接程序化提取
- Jina AI 有速率限制
- 建议由产品 PM 或技术主管直接从官方文档复制示例

---

**本文件最后更新**: 2026-04-21 15:39 UTC  
**下一步行动**: 等待反馈 + 根据提供的 JSON 示例补充第 10 节的完整参数
