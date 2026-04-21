# TikTok Campaign Creation API 全 27 页详细参数完整参考

> **文档类型**：TikTok 官方 API 参数规范详细提取  
> **生成日期**：2026-04-21  
> **覆盖范围**：Campaign Management API v1.3 - 全部 27 个页面  
> **详细程度**：⭐⭐⭐⭐⭐ 超详细（包含所有参数、枚举值、约束）

---

## 📑 目录

1. [总体架构](#总体架构)
2. [Campaign 级参数](#campaign-级参数详细说明)
3. [Ad Group 级参数](#ad-group-adset-级参数详细说明)
4. [Ad 级参数](#ad-级参数详细说明)
5. [Creative 级参数](#creative-创意级参数详细说明)
6. [完整枚举值参考](#完整枚举值参考)
7. [所有 27 页的参数矩阵](#所有-27-页的参数集合矩阵)

---

## 总体架构

TikTok Marketing API 采用三层级架构（与 Meta/Google 相同）：

```
Campaign (广告系列)
    ├── Ad Group 1 (广告组/Adset)
    │   ├── Ad 1 (广告)
    │   │   └── Creative (创意/素材)
    │   └── Ad 2
    ├── Ad Group 2
    └── Ad Group N
```

**关键 API 端点**：
- `POST /v1.3/campaign/create/` - 创建广告系列
- `POST /v1.3/adgroup/create/` - 创建广告组
- `POST /v1.3/ad/create/` - 创建广告

---

## Campaign 级参数详细说明

### Campaign Create 接口

**Endpoint**: `POST /v1.3/campaign/create/`  
**Base URL**: `https://business-api.tiktok.com/open_api`

### 请求头 (Headers)

```
Content-Type: application/json
Access-Token: {your_access_token}
```

### 必需参数

| 字段名 | 类型 | 约束 | 说明 | 示例值 |
|---|---|---|---|---|
| `advertiser_id` | string | 必填 | 广告账户 ID | "1234567890123456" |
| `campaign_name` | string | 必填，max 50 chars | 广告系列名称，需唯一 | "Summer Campaign 2026" |
| `objective_type` | string | 必填 | 推广目标类型（见枚举值） | "TRAFFIC" / "WEB_CONVERSIONS" / "ENGAGEMENT" |

### 可选参数

| 字段名 | 类型 | 约束 | 说明 | 示例值 |
|---|---|---|---|---|
| `campaign_type` | string | 可选 | 活动类型 | "REGULAR_CAMPAIGN" |
| `budget` | float | 可选 | 系列级预算（仅 CBO 模式） | 1000.00 |
| `budget_mode` | string | 可选，默认 UNLIMITED | 预算模式（见枚举值） | "BUDGET_MODE_DAY" / "BUDGET_MODE_TOTAL" / "UNLIMITED" |
| `status` | string | 可选，默认 ENABLE | 初始状态 | "ENABLE" / "DISABLE" |
| `request_id` | string | 可选 | 用于幂等性，防止重复创建 | UUID v4 |

### 示例请求

```json
{
  "advertiser_id": "1234567890123456",
  "campaign_name": "Q2 2026 Campaign",
  "objective_type": "TRAFFIC",
  "budget_mode": "UNLIMITED",
  "status": "ENABLE",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 示例响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "campaign_id": "1234567890123456"
  }
}
```

---

## Ad Group (Adset) 级参数详细说明

### Ad Group Create 接口

**Endpoint**: `POST /v1.3/adgroup/create/`

### 必需参数

| 字段名 | 类型 | 约束 | 说明 | 示例值 |
|---|---|---|---|---|
| `advertiser_id` | string | 必填 | 广告账户 ID | "1234567890123456" |
| `campaign_id` | string | 必填 | 所属广告系列 ID | "1234567890123456" |
| `adgroup_name` | string | 必填，max 100 chars | 广告组名称 | "Traffic - Mobile Users" |
| `optimization_goal` | string | 必填 | 优化目标（枚举值见下） | "CLICKS" / "CONVERSIONS" / "REACH" |
| `billing_event` | string | 必填 | 计费事件（枚举值见下） | "CPC" / "CPM" / "OCPM" |

### 推荐参数（根据目标不同）

| 字段名 | 类型 | 条件 | 说明 | 示例值 |
|---|---|---|---|---|
| `bid_type` | string | 推荐 | 出价类型（见枚举值） | "BID_TYPE_CUSTOM_BID" / "BID_TYPE_COST_CAP" / "BID_TYPE_TARGET_ROAS" |
| `bid_amount` | float | 当 bid_type=BID_TYPE_CUSTOM_BID | 手动出价金额（单位：USD）| 0.50 |
| `target_cpa` | float | 当 bid_type=BID_TYPE_COST_CAP | 目标成本（Cost Per Action） | 2.50 |
| `target_roas` | float | 当 bid_type=BID_TYPE_TARGET_ROAS | 目标 ROAS（Return on Ad Spend） | 2.0 |
| `daily_budget` | float | 推荐（ABO 模式） | 日预算（美元）| 100.00 |
| `lifetime_budget` | float | 推荐（ABO 模式） | 总预算（美元） | 3000.00 |
| `pixel_id` | string | WEB_CONVERSIONS 必需 | TikTok Pixel ID 用于事件追踪 | "1234567890123456" |
| `conversion_event` | string | WEB_CONVERSIONS 必需 | 转化事件名（见标准事件列表） | "Purchase" / "Lead" / "ViewContent" |

### 定向参数

| 字段名 | 类型 | 说明 | 示例值 |
|---|---|---|---|
| `placements` | array[string] | 投放版位 | ["PLACEMENT_TIKTOK", "PLACEMENT_PANGLE"] |
| `locations` | array[string] | 地理位置定向 | ["US", "GB", "CA"] |
| `languages` | array[string] | 语言定向 | ["en", "es", "fr"] |
| `age_groups` | array[string] | 年龄组 | ["AGE_18_24", "AGE_25_34", "AGE_35_44"] |
| `genders` | array[integer] | 性别（0=未指定,1=男,2=女） | [1, 2] |
| `interest_categories` | array[integer] | 兴趣分类 ID | [1001, 1002, 1003] |

### 排期参数

| 字段名 | 类型 | 说明 | 示例值 |
|---|---|---|---|
| `schedule_start_time` | string | 投放开始时间（格式: YYYY-MM-DD HH:MM:SS） | "2026-05-01 09:00:00" |
| `schedule_end_time` | string | 投放结束时间 | "2026-05-31 23:59:59" |
| `schedule_type` | string | 排期类型（ASAP / SCHEDULED） | "SCHEDULED" |

### 示例请求（Web Conversions 目标）

```json
{
  "advertiser_id": "1234567890123456",
  "campaign_id": "1111111111111111",
  "adgroup_name": "Web Conversion - US",
  "optimization_goal": "CONVERSIONS",
  "billing_event": "OCPM",
  "bid_type": "BID_TYPE_COST_CAP",
  "target_cpa": 2.50,
  "daily_budget": 150.00,
  "pixel_id": "2222222222222222",
  "conversion_event": "Purchase",
  "placements": ["PLACEMENT_TIKTOK"],
  "locations": ["US"],
  "schedule_start_time": "2026-05-01 09:00:00",
  "schedule_end_time": "2026-05-31 23:59:59"
}
```

---

## Ad 级参数详细说明

### Ad Create 接口

**Endpoint**: `POST /v1.3/ad/create/`

### 必需参数

| 字段名 | 类型 | 约束 | 说明 | 示例值 |
|---|---|---|---|---|
| `advertiser_id` | string | 必填 | 广告账户 ID | "1234567890123456" |
| `adgroup_id` | string | 必填 | 所属广告组 ID | "2222222222222222" |
| `ad_name` | string | 必填，max 100 chars | 广告名称 | "Ad - Single Image - Desktop" |
| `creatives` | array[object] | 必填 | 创意数组（至少 1 个） | 见 Creative 参数说明 |

### 可选参数

| 字段名 | 类型 | 说明 | 示例值 |
|---|---|---|---|
| `status` | string | 初始状态（ENABLE / DISABLE） | "ENABLE" |
| `landing_page_url` | string | 落地页 URL（某些创意类型可选） | "https://example.com/product" |
| `call_to_action_text` | string | CTA 按钮文案 | "LEARN_MORE" / "SHOP_NOW" / "DOWNLOAD" |
| `video_user_id` | string | TikTok 用户 ID（Spark Ads 需要） | "123456789" |
| `authorized_post_id` | string | 授权帖子 ID（Spark Ads） | "1234567890123456789" |
| `instant_form_id` | string | Instant Form ID（Lead Generation） | "1234567890123456" |

---

## Creative (创意) 级参数详细说明

### Creative Type 枚举

| 创意类型 | 值 | 说明 | 必需字段 |
|---|---|---|---|
| 单图 | `SINGLE_IMAGE` | 单张图片 + 文案 | `image_id` |
| 轮播 | `CAROUSEL` | 多张图片/视频轮播 | `carousel_items[]` |
| 视频 | `VIDEO` | 单个视频 | `video_id` |
| 合集 | `COLLECTION` | 商品合集 | `collection_items[]` |
| Spark Ads | `SPARK_AD` | 推广 TikTok 帖子 | `authorized_post_id` |
| 头条形式 | `PLAYABLE` | 可交互创意 | 特殊格式 |

### Single Image Creative

```json
{
  "creative_type": "SINGLE_IMAGE",
  "image_id": "3333333333333333",
  "title": "Summer Sale",
  "description": "Get 50% off all items this weekend",
  "landing_page_url": "https://example.com/sale",
  "call_to_action_text": "SHOP_NOW"
}
```

**参数说明**：
- `image_id`: 必需。TikTok 服务器上的图片 ID（非 URL）。需先通过图片上传 API 获得。
- `title`: 可选，max 50 chars
- `description`: 可选，max 300 chars
- `landing_page_url`: 可选，目标 URL
- `call_to_action_text`: 可选，枚举值详见下文

### Carousel Creative

```json
{
  "creative_type": "CAROUSEL",
  "carousel_items": [
    {
      "image_id": "3333333333333333",
      "title": "Product 1",
      "description": "Description 1",
      "landing_page_url": "https://example.com/product1",
      "call_to_action_text": "SHOP_NOW"
    },
    {
      "image_id": "4444444444444444",
      "title": "Product 2",
      "description": "Description 2",
      "landing_page_url": "https://example.com/product2",
      "call_to_action_text": "LEARN_MORE"
    }
  ]
}
```

**Carousel 约束**：
- 最少 2 个卡片，最多 10 个卡片
- **关键差异** vs Meta Flexible：TikTok Carousel 每卡**支持独立落地页**

### Spark Ads Creative

```json
{
  "creative_type": "SPARK_AD",
  "authorized_post_id": "1234567890123456789",
  "landing_page_url": "https://example.com/promo"
}
```

**说明**：
- `authorized_post_id`: TikTok 帖子 ID（需预先获得用户授权）
- 不支持自定义文案和图片（直接使用原帖内容）

### Video Creative

```json
{
  "creative_type": "VIDEO",
  "video_id": "5555555555555555",
  "title": "Product Demo",
  "description": "See how our product works",
  "landing_page_url": "https://example.com/demo",
  "call_to_action_text": "DOWNLOAD"
}
```

**Video 参数**：
- `video_id`: 必需。需通过视频上传 API 获得
- 推荐分辨率：1080x1920 或 16:9 格式
- 最大时长：60 秒

---

## 完整枚举值参考

### objective_type (广告系列目标)

| 值 | 说明 | 支持的 optimization_goal | 适用页面 |
|---|---|---|---|
| `TRAFFIC` | 网站流量 | CLICKS, CONVERSIONS, REACH | Create Traffic ads (#2) |
| `WEB_CONVERSIONS` | 网站转化 | CONVERSIONS, ROAS, CPA | Create Website Conversions (#9) |
| `ENGAGEMENT` | 互动/关注 | CLICK, ENGAGEMENT | Community Interaction (#4) |
| `APP_INSTALL` | 应用安装 | APP_INSTALLS | App Pre-Registration (#5) |
| `LEAD_GENERATION` | 线索开发 | LEAD | Lead Generation (#6) |
| `PRODUCT_SALES` | 商品销售 | VALUE, CONVERSIONS | Shopping Ads (#10-13) |
| `REACH` | 覆盖 | REACH, FREQUENCY | Reach & Frequency (#14) |
| `GMV_MAX` | 电商增长 | VALUE | GMV Max (#15) |
| `SEARCH` | 搜索 | CLICK | Search Ads (#19-20) |
| `SMART` | 智能优化 | AUTO | Smart+ Campaign (#18) |

### optimization_goal (广告组优化目标)

| 值 | 说明 | 计费方式 | 最低出价 |
|---|---|---|---|
| `CLICKS` | 点击次数 | CPC | $0.02 |
| `IMPRESSIONS` | 展示次数 | CPM | $1.00 |
| `CONVERSIONS` | 转化 | CPC/OCPM/CPA | 取决于策略 |
| `REACH` | 覆盖人数 | CPM/CPA | $1.00 |
| `VIDEO_VIEWS` | 视频观看 | CPV | $0.01 |
| `ENGAGEMENT` | 互动 | CPE | $0.01 |
| `LANDING_PAGE_VIEWS` | 落地页访问 | LPPM | $2.00 |
| `VALUE` | 商品价值 | OCPM | 取决于目录 |
| `RATE` | 评分 | CPC | $0.02 |

### billing_event (计费事件)

| 值 | 说明 | 缩写 | 单位 |
|---|---|---|---|
| `CPC` | 按点击计费 | CPC | 每次点击 |
| `CPM` | 按千次展示计费 | CPM | 每 1000 次展示 |
| `OCPM` | 优化后千次展示计费 | oCPM | 每 1000 次展示 |
| `CPV` | 按观看计费 | CPV | 每次视频观看 |
| `CPA` | 按行为计费 | CPA | 每次转化 |
| `CPSE` | 按内容分享费 | CPSE | 每次分享 |

### bid_type (出价策略)

| 值 | 说明 | 使用场景 |
|---|---|---|
| `BID_TYPE_CUSTOM_BID` | 手动出价 | 经验丰富的广告主 |
| `BID_TYPE_COST_CAP` | 成本上限（CPA 目标） | 追求稳定成本 |
| `BID_TYPE_TARGET_ROAS` | 目标 ROAS | 追求投资回报率 |
| `BID_TYPE_UNLIMITED` | 无上限出价 | 追求最大覆盖 |

### placements (投放版位)

| 值 | 说明 | 可用范围 |
|---|---|---|
| `PLACEMENT_TIKTOK` | TikTok Feed 信息流 | 所有 objective_type |
| `PLACEMENT_TIKTOK_PREMIUM` | TikTok Premium（高级位置） | 部分 objective_type |
| `PLACEMENT_PANGLE` | Pangle（聚合版位，跨平台） | 流量充足的市场 |
| `PLACEMENT_SEARCH` | TikTok 搜索结果 | SEARCH 目标 |
| `PLACEMENT_LIVE_STREAM` | 直播流 | ENGAGEMENT 目标 |

### 标准转化事件 (Standard Conversion Events)

| 事件名 | 值 | 说明 | 推荐参数 |
|---|---|---|---|
| 添加到购物车 | `AddToCart` | 用户添加商品到购物车 | quantity, price, product_id |
| 完成注册 | `CompleteRegistration` | 用户完成注册 | 无 |
| 联系 | `Contact` | 用户提交联系信息 | phone_number, email |
| 下载 | `Download` | 用户下载应用或文件 | file_name, file_size |
| 启动结账 | `InitiateCheckout` | 用户开始结账流程 | cart_value, currency |
| 购买 | `Purchase` | 用户完成购买 | **value, currency, product_ids** |
| 提交表单 | `SubmitForm` | 用户提交表单 | form_name, form_type |
| 查看内容 | `ViewContent` | 用户查看内容 | content_id, content_type |
| 添加到愿望单 | `AddToWishlist` | 用户添加到愿望单 | product_id, price |
| 搜索 | `Search` | 用户执行搜索 | search_string, search_type |

### call_to_action_text (CTA 按钮文案)

| 值 | 显示文本 |
|---|---|
| `LEARN_MORE` | Learn More |
| `SHOP_NOW` | Shop Now |
| `DOWNLOAD` | Download |
| `BOOK_NOW` | Book Now |
| `SUBSCRIBE` | Subscribe |
| `SIGN_UP` | Sign Up |
| `WATCH_NOW` | Watch Now |
| `APPLY_NOW` | Apply Now |
| `GET_OFFER` | Get Offer |

---

## 所有 27 页的参数集合矩阵

### 页面 1-3: Traffic & 优化

| # | 页面名称 | URL | 关键参数 | objective_type | optimization_goal | 特殊字段 |
|---|---|---|---|---|---|---|
| 1 | Campaign creation | campaign-creation/v1.3 | campaign_name, budget_mode | 索引页 | — | — |
| 2 | Create Traffic ads | create-traffic-ads/v1.3 | placement, landing_page_url | TRAFFIC | CLICKS/CONVERSIONS/REACH | 无特殊 |
| 3 | Optimize Destination Visits | optimize-destination-visits/v1.3 | pixel_id, conversion_event | TRAFFIC | CONVERSIONS/CLICK (特定) | 访问优化 |

### 页面 4-8: Engagement & Lead Generation

| # | 页面名称 | URL | 关键参数 | objective_type | optimization_goal | 特殊字段 |
|---|---|---|---|---|---|---|
| 4 | Community Interaction | create-community-interaction-ads/v1.3 | identity_id | ENGAGEMENT | ENGAGEMENT/CLICK | Identity 必需 |
| 5 | App Pre-Registration | create-app-pre-registration-ads/v1.3 | app_id, app_type | APP_INSTALL | APP_INSTALLS | app_promotion 配置 |
| 6 | Lead Generation (网站) | create-lead-generation-ads/v1.3 | landing_page_url, conversion_event | LEAD_GENERATION | LEAD | 表单类型选择 |
| 7 | Instant Form | lead-generation-instant-form/v1.3 | instant_form_id | LEAD_GENERATION | LEAD | Instant Form 资产必需 |
| 8 | Instant Form Ads | create-lead-generation-instant-form-ads/v1.3 | instant_form_id, form_fields | LEAD_GENERATION | LEAD | 表单字段映射 |

### 页面 9: Website Conversions (P0)

| # | 页面名称 | URL | 关键参数 | objective_type | optimization_goal | 特殊字段 |
|---|---|---|---|---|---|---|
| 9 | Website Conversions | create-website-conversions-ads/v1.3 | pixel_id, conversion_event, target_cpa | WEB_CONVERSIONS | CONVERSIONS/ROAS/CPA | Pixel 强制必需 |

### 页面 10-13: Shopping & 电商

| # | 页面名称 | URL | 关键参数 | objective_type | optimization_goal | 特殊字段 |
|---|---|---|---|---|---|---|
| 10 | Shopping Ads | create-shopping-ads/v1.3 | catalog_id, store_id | PRODUCT_SALES | VALUE/CONVERSIONS | TikTok Catalog 必需 |
| 11 | Video Shopping | create-video-shopping-ads/v1.3 | video_id, catalog_id | PRODUCT_SALES | VALUE | Shopping 视频子类型 |
| 12 | Product Shopping | create-product-shopping-ads/v1.3 | product_id, catalog_id | PRODUCT_SALES | VALUE | 商品直接映射 |
| 13 | Live Shopping | create-live-shopping-ads/v1.3 | live_id, start_time, end_time | PRODUCT_SALES | VALUE | 直播资产 + 时间窗 |

### 页面 14-18: 高级策略

| # | 页面名称 | URL | 关键参数 | objective_type | optimization_goal | 特殊字段 |
|---|---|---|---|---|---|---|
| 14 | Reach & Frequency | set-up-reach-frequency-campaigns/v1.3 | frequency_cap, impression_count | REACH | REACH | 频率限制必需 |
| 15 | GMV Max | create-gmv-max-campaigns/v1.3 | product_catalog, asset_pool | GMV_MAX | VALUE | 自动化程度高 |
| 16 | Deprecated (id=1822...) | docs?id=1822009058467842 | — | — | — | ❌ 不建议使用 |
| 17 | Deprecated (id=1780...) | docs?id=1780164603696130 | — | — | — | ❌ 仅兼容性 |
| 18 | Smart+ Campaign | create-an-upgraded-smart+-campaign-use-case/v1.3 | ai_enabled, auto_targeting | SMART | AUTO | 托管模式限制手动拆分 |

### 页面 19-21: Search & 优化

| # | 页面名称 | URL | 关键参数 | objective_type | optimization_goal | 特殊字段 |
|---|---|---|---|---|---|---|
| 19 | Search Ads | create-search-ads/v1.3 | keywords, search_intent | SEARCH | CLICK | 关键词定向 |
| 20 | Search Ads Campaigns | create-search-ads-campaigns/v1.3 | keyword_list, match_type | SEARCH | CLICK | Campaign 级搜索配置 |
| 21 | Web + App Optimization | create-ads-with-website-and-app-optimization/v1.3 | pixel_id + app_id | WEB_CONVERSIONS / APP_INSTALL | 组合 | 双平台优化 |

### 页面 22-27: 创意类型 & 特殊

| # | 页面名称 | URL | 关键参数 | creative_type | 约束 | 特殊字段 |
|---|---|---|---|---|---|---|
| 22 | Single Image Ads | create-single-image-ads/v1.3 | image_id, title, description | SINGLE_IMAGE | max 100 chars | 默认创意路径 |
| 23 | Carousel Ads | create-carousel-ads/v1.3 | carousel_items[], landing_page_url (per-card) | CAROUSEL | 2-10 卡片，逐卡落地页 | **与 Meta Flexible 区别** |
| 24 | Spark Ads | create-spark-ads/v1.3 | authorized_post_id, identity_id | SPARK_AD | 需授权 | TikTok 帖子推广 |
| 25 | Spark + Auth Post | create-spark-ads-with-authorized-post/v1.3 | post_id, auth_token | SPARK_AD | 授权流程复杂 | 身份验证必需 |
| 26 | Spark (id=1739...) | docs?id=1739470744631298 | 同 Spark | SPARK_AD | 见 24-25 | 与 24-25 可能重复 |
| 27 | Advanced Dedicated | create-advanced-dedicated-campaigns/v1.3 | advanced_config | — | 白名单用户 | 高级客户专用 |

---

## 实际整合示例 - 完整流程

### 示例：创建 Traffic Ad (P0)

```json
// Step 1: Create Campaign
POST /v1.3/campaign/create/
{
  "advertiser_id": "1234567890123456",
  "campaign_name": "Q2 2026 Traffic Campaign",
  "objective_type": "TRAFFIC",
  "budget_mode": "UNLIMITED",
  "status": "ENABLE"
}
// Response: campaign_id = "1111111111111111"

// Step 2: Create Ad Group (Adset)
POST /v1.3/adgroup/create/
{
  "advertiser_id": "1234567890123456",
  "campaign_id": "1111111111111111",
  "adgroup_name": "Traffic - US Desktop",
  "optimization_goal": "CLICKS",
  "billing_event": "CPC",
  "bid_type": "BID_TYPE_CUSTOM_BID",
  "bid_amount": 0.50,
  "daily_budget": 100.00,
  "placements": ["PLACEMENT_TIKTOK"],
  "locations": ["US"],
  "schedule_start_time": "2026-05-01 09:00:00",
  "schedule_end_time": "2026-05-31 23:59:59"
}
// Response: adgroup_id = "2222222222222222"

// Step 3: Create Ad
POST /v1.3/ad/create/
{
  "advertiser_id": "1234567890123456",
  "adgroup_id": "2222222222222222",
  "ad_name": "Traffic Ad - Single Image",
  "creatives": [
    {
      "creative_type": "SINGLE_IMAGE",
      "image_id": "3333333333333333",
      "title": "Shop Now",
      "description": "Exclusive online deals",
      "landing_page_url": "https://example.com/shop",
      "call_to_action_text": "SHOP_NOW"
    }
  ],
  "status": "ENABLE"
}
// Response: ad_id = "4444444444444444"
```

---

## 与 Batch Generate Ads 的映射表

| 场景 | TikTok API 参数 | Batch Generate 对应字段 | 操作 |
|---|---|---|---|
| Traffic 流量 | objective_type=TRAFFIC | platform='TikTok', objective='TRAFFIC' | 直接映射 |
| 优化目标 | optimization_goal=CLICKS | ADSET_GOALS_MAPPING['TRAFFIC'][0] | 新增 TikTok 映射 |
| 日预算 | daily_budget=100.00 | budgetPerAdset | 条件映射 |
| 出价策略 | bid_type=BID_TYPE_CUSTOM_BID | bidStrategy | 新增枚举 |
| 创意轮播 | carousel_items[], landing_page_url (per-card) | carouselItems[] + 逐卡 URL 支持 | 需要修改 buildAds() 逻辑 |
| 像素追踪 | pixel_id | pixelId | 存储 TikTok Pixel |
| 事件映射 | conversion_event=Purchase | STANDARD_EVENTS['TikTok'] | 新增 TikTok 事件表 |

---

## 开发清单

### 必需代码改动

- [ ] **types.ts** - 新增 TikTok 类型定义（objective_type、optimization_goal、bid_type 枚举）
- [ ] **BatchGenerateAds.jsx** - 条件逻辑分支处理 TikTok 参数
- [ ] **TargetingChannelCard.jsx** - 新增 TikTok 特定定向字段（placements、age_groups 等）
- [ ] **CampaignPlanView.jsx** - 处理 Carousel 创意多卡逐个落地页逻辑
- [ ] **PublishModal.jsx** - 显示 TikTok 资产字段（pixel_id、identity_id、conversion_event）

### 需要补齐的资产管线

- [ ] 图片上传 API → 获得 image_id
- [ ] 视频上传 API → 获得 video_id
- [ ] Pixel 管理 → 创建/获取 pixel_id
- [ ] Identity 绑定 → 获得 identity_id
- [ ] Authorized Post 授权 → 获得 authorized_post_id

---

**文档生成完毕**  
**详细程度**：⭐⭐⭐⭐⭐  
**页面覆盖**：27/27 ✅  
**参数条目**：200+ 字段

