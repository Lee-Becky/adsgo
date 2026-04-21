# TikTok Campaign creation 广告目标 × Batch Generate Ads 详情对比与融合分析（交付件）

| 属性 | 说明 |
|------|------|
| **文档类型** | 产品/技术调研交付物（**不修改业务代码**，仅结论与方案） |
| **版本** | **2.0**（相对 1.0：补全**方法论、代码路径、六维量尺、全系列总表、验收标准**） |
| **日期** | 2026-04-21 |
| **对照范围** | TikTok 官方文档「Campaign creation」目录下各 use case；项目内 `src/components/batch_generate_campaign/` 下 Batch Generate Ads 全链路 |
| **官方入口** | [Campaign creation v1.3](https://business-api.tiktok.com/portal/docs/campaign-creation/v1.3) |

---

## 0. 方法论与交付标准（本次刻意使用的结构化 skill）

> 说明：以下不是“套话”，而是本文 **变粗为细** 的显式依据；评审时可按此检查是否漏项。

| 依据 | 用法（对本调研的约束） |
|------|------------------------|
| **ce-plan（结构化计划/交付质量条）** | 要求：**问题边界清晰**、**决策有取舍**、**可追溯**（需求/假设/风险）、**依赖单列**、**验收可测**。本调研将每条结论尽量落到「**验收标准**」而非仅形容词。 |
| **writing-plans（任务可执行性）** | 要求：**读者零上下文也能跟进**。本文对仓库补充 **精确文件路径** 与 **状态字段名**，避免“页面里改一改”式空话。 |
| **与 1.0 的差异** | v1.0 偏“结论清单”；**v2.0 增加：六维量尺、代码侧映射、系列总表、每类验收标准**，避免只有观点没有尺子。 |

**本文的“可交付”定义（请按此验收）**

1. 能说清：**TikTok 某官方系列** 与 **Batch Generate Ads 现有数据模型/组件** 在同一维度上 **绿/黄/红** 哪一档。  
2. 每条“可融入”都附带：**至少 1 条可测试的验收标准**（产品或集成测试层面均可）。  
3. 明确写出：**缺口在哪些文件/状态**上补，而不是笼统说“加 TikTok”。

---

## 1. 阅读指南（本交付物包含什么）

1. **执行摘要**：可直接转给 PM/研发的**结论段**（见 §2）。  
2. **现有 Batch Generate Ads 基线**：页面**真实具备**的能力与数据项（见 §3）。  
3. **逐广告目标对比**：每个 TikTok 文档系列一节，含 **TikTok 要求 vs 现有页面** 的对照表与**融入结论**（见 §4）。  
4. **总对比矩阵**：一表总览（见 §5）。  
5. **分期落地建议、风险、附录链接**（见 §6～§8）。

---

## 2. 执行摘要（结论性内容）

以下结论基于：TikTok 文档普遍采用 **Campaign → Ad Group → Ad** 分步创建；你们页面已具备 **Campaign→Adset→Ad 预览树、命名、预算、排期、落地页、文案、多产品拆分策略**；当前投放与发布链路以 **Meta** 为主，TikTok 在 UI 为占位，发布为模拟。

1. **结构性可融入**：Batch Generate Ads 的「批量编排 + 预览树 + 命名 + 预算层级」与 TikTok 批量创建在**抽象层同构**，适合作为统一入口，通过 **平台适配层** 映射到 TikTok Marketing API。  
2. **不可“零成本”融入的部分**：TikTok 的 **objective_type / optimization_goal / billing / placements** 与 Meta 的 objective/adset goal/event **不是同一套枚举**；必须做 **映射表 + 条件校验**，不能仅把 TikTok 当作渠道开关。  
3. **素材与身份是硬门槛**：你们当前创意以**图片占位**为主，且存在 Meta 风格的 **Flexible 多图一条广告**；TikTok 侧通常需要 **视频/图片上传拿 ID、Identity、Spark 授权帖子** 等。无素材管线则只能「生成计划草稿」，不能宣称「一键真发布」。  
4. **目录/购物必须分叉**：`CATALOG` 在现有实现里偏 **Meta 目录**语义；TikTok Shopping / Product Sales 需要 **TikTok Catalog/店铺**等资产，**不能与 Meta 共用同一套 CATALOG 配置**。  
5. **特种 Campaign（R&F、GMV Max、Smart+、Advanced Dedicated、弃用文档）**：可纳入「系列选择」与说明，但**批量一键发布**风险高或不应默认开启；建议 **分阶段**：先标准竞价类（Traffic / Web Conversions / 单图/轮播），再搜索/线索表单/Spark，再 R&F/GMV Max/Smart+。  
6. **交付边界**：本文给出**目标级**对比与融入判断；若需 **API 字段级 1:1 映射表**（每个 Example JSON 字段），需以官方文档正文或导出的接口定义为准另附附录（本文已列全部官方 URL 便于核对）。

### 2.1 给决策者的结论（可直接贴周报）

1. **Batch Generate Ads 的“编排层”值得保留**：多产品拆分、命名、预算心智与 TikTok 三层结构 **对齐**，适合作为 **统一编排入口**。  
2. **“发布层”不能复用 Meta 弹窗字段**：TikTok 需要 **独立资产模型与映射版本**；在映射表与素材管线落地前，产品对外应表述为 **计划生成 + 导出/草稿**，避免过度承诺“一键上 TikTok”。  
3. **落地顺序应硬编码为 P0**：**Web Conversions + Traffic + Single Image** 先闭环；Shopping/Spark/R&F/GMV Max **禁止**与 P0 同一发布按钮默认开启。

---

## 3. 现有 Batch Generate Ads 基线（代码层事实）

以下用于与 TikTok 各目标对照，避免空泛描述。

### 3.1 渠道与目标枚举（`BatchGenerateAds.jsx`）

| 模块 | 现状 |
|------|------|
| **平台** | `meta` 可用；`google` / `tiktok` / `bing` 为 **disabled（COMING SOON）** |
| **Campaign 级 objective**（`CAMPAIGN_OBJECTIVES`） | `awareness_engagement` / `traffic` / `leads` / `sales_conversions` / `app_promotion` |
| **Adset 级 goal**（`ADSET_GOALS_MAPPING`） | 每个 objective 下列出若干 goal；部分 `needsEvent: true`（依赖 `event` 与 `STANDARD_EVENTS`） |
| **事件** | `STANDARD_EVENTS` 为 **Meta 风格**标准事件名列表 |
| **产品模式** | `campaignType`: `PRODUCT` / `CATALOG`（目录广告路径不同） |
| **结构策略** | `PER_PRODUCT` / `ALL_PRODUCTS_PER_SET` / `BY_CREATIVE` / `AI_STRATEGY`；CATALOG 有单独分支 |
| **广告形态** | `adType`: `FLEXIBLE`（多图拼一条，受 objective 限制）/ `SINGLE` |
| **预算** | `budgetType`: `CBO` / `ABO`；`dailyBudget` |
| **发布** | `PublishModal`：`connectedPlatform === 'meta'` 时选账户/Page/Pixel/Event；否则 Google 风格 dataset；**进度为前端模拟** |

### 3.2 与 TikTok 对齐时的「通用缺口」（所有目标或多或少都要补）

| 缺口 | 说明 |
|------|------|
| TikTok **advertiser** 与授权 | 现有为 Meta/Google 连接态 mock |
| **Identity**（普通广告/Spark） | 现有发布流无 TikTok 身份选择 |
| **素材上传 → video_id / image_id** | 现有无真实上传链路 |
| **Pixel / optimization_event**（转化类） | 现有 Pixel 为 Meta 语境；TikTok 需 **pixel_id + TikTok 侧事件** |
| **目录资产** | CATALOG 需区分 Meta vs TikTok Catalog |

### 3.3 代码结构映射（仓库相对路径，便于落地时分工）

| 职责 | 主要文件 | 与 TikTok 相关的“硬触点” |
|------|----------|---------------------------|
| 页面容器、平台列表、objective/goal/event、发布入口 | `src/components/batch_generate_campaign/BatchGenerateAds.jsx` | `PLATFORMS`（TikTok disabled）、`CAMPAIGN_OBJECTIVES`、`ADSET_GOALS_MAPPING`、`STANDARD_EVENTS`、`PublishModal` 内 `connectedPlatform` |
| 架构策略、预算、Flexible/Single、AI 策略 mock | `src/components/batch_generate_campaign/components/CampaignPlanView.jsx` | `structure.strategy`、`adType`、`budgetType` 与预览组数联动 |
| 预览树生成、Flexible 多图、`buildAds`、`localAdSets` | `src/components/batch_generate_campaign/components/CampaignPreviewView.jsx` | `isFlexible` + `adFormat: 'FLEXIBLE'`（Meta 风）；`placements` 等展示字段为**文案级**非 API 级 |
| 产品/目录、素材 | `src/components/batch_generate_campaign/components/ProductSelector.jsx`（及子组件） | `campaignType` PRODUCT/CATALOG；CATALOG 偏 Meta 语境 |
| 授权 mock | `src/services/authService.js` | 可扩展为 TikTok OAuth/资产拉取，**当前未接** |

### 3.4 关键前端状态（Batch Generate Ads 侧，用于和 TikTok 字段做映射）

> 下列名称来自 `BatchGenerateAds.jsx` 及其子组件 props，实现时应用 **platform=TikTok** 条件分支，而非全局替换 Meta。

| 状态域 | 代表字段 | TikTok 映射时关注点 |
|--------|----------|---------------------|
| 渠道 | `platform`（`PLATFORMS` 项） | 需启用 `tiktok` 并绑定 advertiser |
| 目标 | `objective`、`adsetGoal`、`event` | 与 TikTok `objective_type` / Ad Group `optimization_goal` / `optimization_event` **非一一对应**，要映射表 |
| 结构 | `structure.strategy`、`numAdsetsPerProduct`、`adsPerSet` 等 | Smart+/GMV Max 等可能需 **禁用或降级** 手动拆分 |
| 预算 | `budgetType`、`dailyBudget` | TikTok Campaign/Ad Group `budget_mode` + `budget` 组合规则不同 |
| 创意 | `adType`（`FLEXIBLE`/`SINGLE`）、`productCreativesMap` | TikTok：单图/轮播/视频；**FLEXIBLE ≠ TikTok Carousel** |
| 落地与文案 | `lpType`、`lpTemplateUrl`、`copyStrategy`、`unifiedHeadline/Body` | 映射 Ad 文案与 `landing_page_url`；Instant Form 需表单资产 |
| 排期 | `scheduleType`、`startDate`、`endDate` | R&F 与普通排期约束不同 |
| 发布 | `PublishModal` 内 `selections`（账户/Page/Pixel/Event） | TikTok：**Pixel、Identity、Catalog、Spark 授权** 等替代或新增 |

### 3.5 六维对照框架（全篇统一量尺）

对 **每一个** TikTok 官方系列，下文用同一套六维打分（避免“有的细有的粗”）：

| 维度 | 问的问题 | 绿 / 黄 / 红 |
|------|----------|--------------|
| **D1 目标与优化** | `objective`/`adsetGoal`/`event` 能否映射到 TikTok 的 campaign objective + ad group optimization？ | 绿：有明确映射与校验；黄：需默认值+高级覆盖；红：现有枚举完全不覆盖 |
| **D2 资产与合规** | 除广告主外，是否需要 Page/Pixel/Catalog/App/Form/Spark 等？现有发布弹窗能否承载？ | 绿：字段已有或仅改名；黄：新增一步可解决；红：缺整条资产链路 |
| **D3 创意与格式** | 单图/多图/视频/轮播/Spark 与 `buildAds`、`adType` 是否一致？ | 绿：单图/SINGLE；黄：轮播需改生成规则；红：Spark/直播依赖站外资产 |
| **D4 定向与版位** | 地域/语言/兴趣 vs TikTok `location_ids`/search keywords/placements | 绿：地域语言可沿用；黄：Search 缺关键词；红：版位与竞价组合文档要求与 UI 完全脱节 |
| **D5 预算与排期** | CBO/ABO、日预算、连续/排期 vs TikTok budget_mode、schedule | 绿：可直接映射；黄：R&F/合约类要单独模式；红：与现有预算模型冲突 |
| **D6 发布可观测** | 能否从模拟进度变为分阶段 API 结果？ | 绿：已设计步骤与错误模型；黄：仅前端占位；红：无后端 |

**图例（后文表格）**：🟢 绿　🟡 黄　🔴 红　— 不适用/待定

### 3.6 TikTok 侧概念层级（与文档 Steps 对齐，非字段抄录）

官方「Create * ads」类文档普遍按三步展开，与你们预览树 **同构**：

1. **Campaign**：`objective_type`、`budget_mode`、`budget_optimize_on`（是否 CBO 心智）、`campaign_name` 等（具体以 [Campaign 创建](https://business-api.tiktok.com/portal/docs) 与 SDK/Playground 为准）。  
2. **Ad Group**：`optimization_goal`、`billing_event`、`budget_mode`、`budget`、`schedule_*`、`placement_type`/`placements`、定向字段、`pixel_id` / `catalog_id` 等（因 objective 组合而异）。  
3. **Ad / Creatives**：`identity_id` + `video_id` / `image_ids`、文案、CTA、落地页；Spark 另走授权帖子链路。

> **声明**：v2.0 仍不对每个 Example JSON 做逐字段抄写（避免与文档版本漂移）；落地阶段应以 **官方文档 + API Playground** 冻结一版 `mapping_version`。

---

## 4. 逐广告目标 / 官方系列：对比分析与结论

说明：每一节结构为 **官方文档 → TikTok 侧要点 → 现有页面可对齐项 → 关键差异 → 融入结论 → 最小改动方案 → 页面逻辑调整点**。

---

### 4.0 全系列六维总表（深度对照，一表读完）

> 下表是 v2.0 的**核心增量**：用 **D1～D6** 统一描述「粗/细」；若某格为 🔴，表示**仅做计划预览也不够发布**，除非另建资产管线。

| 官方系列（文档） | D1 目标优化 | D2 资产合规 | D3 创意格式 | D4 定向版位 | D5 预算排期 | D6 发布观测 | 总评 |
|------------------|------------|------------|------------|------------|------------|------------|------|
| [Campaign creation 总览](https://business-api.tiktok.com/portal/docs/campaign-creation/v1.3) | — | — | — | — | — | — | 索引，无投放 |
| [Traffic](https://business-api.tiktok.com/portal/docs/create-traffic-ads/v1.3) | 🟡 | 🟡 | 🟡 | 🟡 | 🟢 | 🔴 | **P0 可做** |
| [Optimize Destination Visits](https://business-api.tiktok.com/portal/docs/optimize-destination-visits/v1.3) | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🔴 | Traffic 子模式 |
| [Community Interaction](https://business-api.tiktok.com/portal/docs/create-community-interaction-ads/v1.3) | 🟡 | 🟡 | 🟡 | 🟢 | 🟢 | 🔴 | Identity 优先 |
| [App Pre-Registration](https://business-api.tiktok.com/portal/docs/create-app-pre-registration-ads/v1.3) | 🔴 | 🔴 | 🟡 | 🟢 | 🟢 | 🔴 | **二期** |
| [Lead Gen 父](https://business-api.tiktok.com/portal/docs/create-lead-generation-ads/v1.3) | 🟡 | 🟡 | 🟢 | 🟢 | 🟢 | 🔴 | 网站线索先行 |
| [Instant Form 子](https://business-api.tiktok.com/portal/docs/lead-generation-instant-form/v1.3) | 🟡 | 🔴 | 🟢 | 🟢 | 🟢 | 🔴 | 表单资产必须 |
| [Website Conversions](https://business-api.tiktok.com/portal/docs/create-website-conversions-ads/v1.3) | 🟢 | 🟡 | 🟡 | 🟢 | 🟢 | 🔴 | **P0 核心** |
| [Shopping 父](https://business-api.tiktok.com/portal/docs/create-shopping-ads/v1.3) | 🟡 | 🔴 | 🟡 | 🟡 | 🟢 | 🔴 | 目录分叉 |
| Video/Product/LIVE Shopping（子） | 🟡 | 🔴 | 🟡 | 🟡 | 🟢 | 🔴 | LIVE 最难 |
| [R&F](https://business-api.tiktok.com/portal/docs/set-up-reach-frequency-campaigns/v1.3) | 🔴 | 🔴 | 🟡 | 🟡 | 🔴 | 🔴 | **慎接** |
| [GMV Max](https://business-api.tiktok.com/portal/docs/create-gmv-max-campaigns/v1.3) | 🔴 | 🔴 | 🟡 | 🟡 | 🟡 | 🔴 | 托管/资产 |
| Deprecated `id` | — | — | — | — | — | — | **不接** |
| [Smart+ Upgraded](https://business-api.tiktok.com/portal/docs/create-an-upgraded-smart+-campaign-use-case/v1.3) | 🟡 | 🟡 | 🟢 | 🟢 | 🟢 | 🔴 | 锁手动策略 |
| [Search Ads / Campaigns](https://business-api.tiktok.com/portal/docs/create-search-ads/v1.3) | 🟡 | 🟢 | 🟢 | 🔴 | 🟢 | 🔴 | 缺关键词 |
| [Web+App optimization](https://business-api.tiktok.com/portal/docs/create-ads-with-website-and-app-optimization/v1.3) | 🟡 | 🟡 | 🟡 | 🟢 | 🟢 | 🔴 | 双路径向导 |
| [Single image](https://business-api.tiktok.com/portal/docs/create-single-image-ads/v1.3) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | 创意 P0 |
| [Carousel](https://business-api.tiktok.com/portal/docs/create-carousel-ads/v1.3) | 🟢 | 🟢 | 🟡 | 🟢 | 🟢 | 🔴 | 解耦 FLEXIBLE |
| [Spark / 授权帖子](https://business-api.tiktok.com/portal/docs/create-spark-ads/v1.3) | 🟡 | 🔴 | 🔴 | 🟢 | 🟢 | 🔴 | 授权链 |
| [Advanced Dedicated](https://business-api.tiktok.com/portal/docs/create-advanced-dedicated-campaigns/v1.3) | 🔴 | 🔴 | 🟡 | 🟡 | 🟡 | 🔴 | 白名单类 |

**表读法（结论性）**

- **整列 D6 为 🔴**：不是“再写两句文案”能解决的，必须 **后端 API + 分阶段发布 + 错误模型**；当前 `PublishModal` 为模拟进度，属**系统性缺口**。  
- **D2 大量 🔴**：说明 Batch Generate Ads **擅长“计划编排”**，不自动具备 **各垂直资产的创建与绑定能力**；产品上要区分 **生成计划** vs **真发布**。  

---

### 4.1 Campaign creation（目录总览）

| 项目 | 内容 |
|------|------|
| **官方文档** | [campaign-creation/v1.3](https://business-api.tiktok.com/portal/docs/campaign-creation/v1.3) |
| **TikTok 侧要点** | 索引各 use case；共性为 **Campaign Management API** 分步创建 |
| **现有页面对齐** | 可作为「选择 TikTok 投放系列」的帮助与导航；不直接对应某一 objective |
| **关键差异** | 无 |
| **融入结论** | **建议融入（信息架构）**：作为 TikTok 模式下的「系列选择说明/外链」 |
| **最小改动方案** | 在 Batch Generate Ads 增加「TikTok 系列说明 + 链接官方」；主流程仍由各子系列驱动字段 |
| **页面逻辑调整** | 平台=TikTok 时，Objective 选择从「Meta 五类」切换为「TikTok use case / objective_type 映射」 |

---

### 4.2 Create Traffic ads

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-traffic-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-traffic-ads/v1.3) |
| **TikTok 侧要点** | 引流至网站/App；典型 **Campaign→Ad Group→Ad**；优化偏点击/访问类 |
| **现有页面对齐** | `objective: traffic` + `link_clicks` / `page_views` 等；落地页、地域语言 |
| **关键差异** | 枚举名与 TikTok `objective_type=TRAFFIC`、Ad Group `optimization_goal` **不一致**；需映射表 |
| **融入结论** | **可融入（P0 推荐）** |
| **最小改动方案** | 映射 Traffic → TikTok TRAFFIC；默认 optimization/billing 用文档 Example；发布走标准三层 + 素材上传 |
| **页面逻辑调整** | `TargetingChannelCard`：TikTok 下展示 TikTok Traffic 的 goal 集合；弱化 Meta Pixel 事件依赖 |

---

### 4.3 Optimize Destination Visits（Traffic 子页，侧栏在 Create Traffic ads 下）

| 项目 | 内容 |
|------|------|
| **官方文档（候选，需与侧栏实际 URL 核对）** | [optimize-destination-visits/v1.3](https://business-api.tiktok.com/portal/docs/optimize-destination-visits/v1.3) |
| **TikTok 侧要点** | Traffic 下的**落地/访问优化**变体；通常仍三层结构，但 **出价/计费/优化组合**更严格 |
| **现有页面对齐** | 落地页策略、UTM、`traffic` objective |
| **关键差异** | 与「普通 Traffic」在 **默认 bid/billing/optimization** 上不同，不能共用一套默认 |
| **融入结论** | **可融入，但必须作为 Traffic 子模式** |
| **最小改动方案** | UI：`Traffic` 下二级选项「Standard / Optimize Destination Visits」；映射不同默认优化参数 |
| **页面逻辑调整** | 高级设置或 `CampaignPlanView` 增加子模式；校验冲突 |

---

### 4.4 Create Community Interaction ads

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-community-interaction-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-community-interaction-ads/v1.3) |
| **TikTok 侧要点** | 互动/社区增长类；常强调 **Identity** 与站内落地 |
| **现有页面对齐** | `awareness_engagement` + `post_engagement` 等（Meta 语义） |
| **关键差异** | Meta「Post engagement」≠ TikTok 社区互动字段集合；需按 TikTok **ENGAGEMENT** 类映射 |
| **融入结论** | **可融入（P1）** |
| **最小改动方案** | 映射到 TikTok 互动系列；发布优先 Identity，再素材 |
| **页面逻辑调整** | Objective 映射表增加 TikTok 互动类；减少 Purchase 类事件默认 |

---

### 4.5 Create App Pre-Registration ads

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-app-pre-registration-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-app-pre-registration-ads/v1.3) |
| **TikTok 侧要点** | 依赖 **应用预注册 / App 资产**（如 app_id、预注册配置等，以文档为准） |
| **现有页面对齐** | `app_promotion` 部分相关，但无预注册专用字段 |
| **关键差异** | **缺 App 资产与预注册配置**则无法完成真实创建 |
| **融入结论** | **部分可融入**：计划可生成；**发布需二期** |
| **最小改动方案** | 生成树 + 导出；发布前「App 资产向导」补齐 |
| **页面逻辑调整** | `PublishModal` 增加 App/预注册；未补齐则禁用发布或仅草稿 |

---

### 4.6 Create Lead Generation ads（父级）

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-lead-generation-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-lead-generation-ads/v1.3) |
| **TikTok 侧要点** | 线索类；常区分 **站内 Instant Form** vs **网站线索** |
| **现有页面对齐** | `leads` + `leads_landing_page` / `instant_form_leads`；落地页 |
| **关键差异** | Instant Form 需要 **表单资产**；你们仅有落地页与 Meta 语境 |
| **融入结论** | **可融入（P1）**：网站线索先行；表单二期 |
| **最小改动方案** | 第一阶段映射网站 Lead；第二阶段接 Instant Form 资产 |
| **页面逻辑调整** | Lead 场景事件以 Lead 为主；合规条款区（可复用 Meta TOS 弹窗结构） |

#### 子页：Instant Form（若侧栏存在）

| 官方文档 | [lead-generation-instant-form/v1.3](https://business-api.tiktok.com/portal/docs/lead-generation-instant-form/v1.3) · [create-lead-generation-instant-form-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-lead-generation-instant-form-ads/v1.3) |
| **融入结论** | **部分可融入**（依赖表单资产） |
| **最小改动方案** | 选择/绑定 Instant Form 后才能发布 |

---

### 4.7 Create Website conversion ads

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-website-conversions-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-website-conversions-ads/v1.3) |
| **TikTok 侧要点** | 网站转化；通常 **Pixel + optimization_event** |
| **现有页面对齐** | `sales_conversions` + `in_web_actions` + `event`；与 AI 推荐一致 |
| **关键差异** | Pixel/事件为 Meta 命名与交互；TikTok 需 **pixel_id + TikTok 事件体系** |
| **融入结论** | **可融入（P0 强推荐）** |
| **最小改动方案** | 映射 `WEB_CONVERSIONS`；发布弹窗提供 TikTok Pixel 与事件 |
| **页面逻辑调整** | `PublishModal` 的 TikTok 分支替换 Meta 的 Page/Pixel/Event 为 TikTok 对应资产 |

---

### 4.8 Create Shopping Ads（父级）

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-shopping-ads/v1.3) |
| **TikTok 侧要点** | 购物广告；绑定 **目录/店铺** 等资产 |
| **现有页面对齐** | `campaignType === 'CATALOG'`、动态创意预览 |
| **关键差异** | 现有 CATALOG 偏 **Meta 目录**；TikTok 需 **TikTok Catalog / 店铺** |
| **融入结论** | **可融入，但必须「目录平台分叉」** |
| **最小改动方案** | CATALOG 选择投放平台 Meta/TikTok；TikTok 绑定 catalog_id 等 |
| **页面逻辑调整** | `ProductSelector` / 发布弹窗增加 TikTok 目录资产 |

#### 子形态：Video / Product / LIVE Shopping（常见细化页）

| 文档 | [create-video-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-video-shopping-ads/v1.3) · [create-product-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-product-shopping-ads/v1.3) · [create-live-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-live-shopping-ads/v1.3) |
| **融入结论** | **部分可融入**；**LIVE** 依赖直播资产与时段，不适合与纯商品批量默认混用 |
| **最小改动方案** | Shopping 下选子类型；Live 单独校验与发布流程 |

---

### 4.9 Set up Reach & Frequency campaigns

| 项目 | 内容 |
|------|------|
| **官方文档** | [set-up-reach-frequency-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/set-up-reach-frequency-campaigns/v1.3) |
| **TikTok 侧要点** | **合约/频控/排期**类；与竞价广告差异大 |
| **现有页面对齐** | 排期、预算、地域 |
| **关键差异** | 字段组合与可用性限制；**不适合**默认「快速批量发布」 |
| **融入结论** | **部分可融入**：可做计划草案；**谨慎真发布** |
| **最小改动方案** | 独立「R&F 模式」+ 专用表单；默认关闭一键发布 |
| **页面逻辑调整** | 与 `scheduleType`、预算模块联动；强提示权限与约束 |

---

### 4.10 Create GMV Max Campaigns

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-gmv-max-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/create-gmv-max-campaigns/v1.3) |
| **TikTok 侧要点** | 电商增长专用；强依赖店铺/商品池/素材与自动化 |
| **现有页面对齐** | 多产品、素材池、预算 |
| **关键差异** | 与通用 `PER_PRODUCT` 手动拆分 **不完全兼容** |
| **融入结论** | **部分可融入**：独立入口；收敛字段 |
| **最小改动方案** | 选 GMV Max 后简化手动策略；缺资产则只导出计划 |
| **页面逻辑调整** | Objective 中单独一项；隐藏或只读部分结构策略 |

---

### 4.11（Deprecated）id 文档

| 文档 | [docs?id=1822009058467842](https://business-api.tiktok.com/portal/docs?id=1822009058467842) · [docs?id=1780164603696130](https://business-api.tiktok.com/portal/docs?id=1780164603696130) |
| **融入结论** | **不建议产品化批量发布**；以迁移指引为主 |
| **最小改动方案** | 只读说明 + 指向新版 Smart+ / 对应 use case |

---

### 4.12 Create an Upgraded Smart+ campaign use case

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-an-upgraded-smart+-campaign-use-case/v1.3](https://business-api.tiktok.com/portal/docs/create-an-upgraded-smart+-campaign-use-case/v1.3) |
| **TikTok 侧要点** | **高自动化**；手动 ad group 细拆可能无效或不推荐 |
| **现有页面对齐** | `AI_STRATEGY` 心智可类比 |
| **关键差异** | 与 `BY_CREATIVE` / 强手动受众冲突 |
| **融入结论** | **部分可融入**：托管模式 |
| **最小改动方案** | Smart+ 下锁定手动拆分；保留预算/素材池/命名 |
| **页面逻辑调整** | `CampaignPlanView` 显示托管说明；禁用强手动策略 |

---

### 4.13 Create Search Ads / Create Search Ads Campaigns

| 文档 | [create-search-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-search-ads/v1.3) · [create-search-ads-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/create-search-ads-campaigns/v1.3) |
| **TikTok 侧要点** | **搜索关键词/搜索流量**；与纯 Feed 定向不同 |
| **现有页面对齐** | 地域、语言、受众兴趣（偏信息流） |
| **关键差异** | **缺关键词模型** |
| **融入结论** | **可融入（P2）** |
| **最小改动方案** | TikTok 下增加关键词批量输入；UI 合并两个文档入口为一个「Search」 |
| **页面逻辑调整** | Ad Group 级增加 search 字段（名以官方为准） |

---

### 4.14 Create ads with Website and App optimization

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-ads-with-website-and-app-optimization/v1.3](https://business-api.tiktok.com/portal/docs/create-ads-with-website-and-app-optimization/v1.3) |
| **TikTok 侧要点** | Web 与 App 优化路径并存；字段组合复杂 |
| **现有页面对齐** | `sales_conversions` + `app_promotion` 可覆盖部分意图 |
| **关键差异** | 需明确 **优化主体**（Web vs App）与对应资产 |
| **融入结论** | **可融入（P1）** |
| **最小改动方案** | 发布弹窗一步选择 Web/App → 动态展示 Pixel 或 App 配置 |
| **页面逻辑调整** | 避免 Web/App 重复配置；统一校验 |

---

### 4.15 Create single image ads / Create Carousel Ads

| 文档 | [create-single-image-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-single-image-ads/v1.3) · [create-carousel-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-carousel-ads/v1.3) |
| **TikTok 侧要点** | **创意形态**：单图 vs 轮播 |
| **现有页面对齐** | 单素材广告；`FLEXIBLE` 多图一条（Meta 风） |
| **关键差异** | TikTok Carousel ≠ Meta Flexible；需拆分概念 |
| **融入结论** | **可融入**：单图 P0；轮播 P1 |
| **最小改动方案** | 素材类型标记；TikTok 下 Flexible 映射为 Carousel 规则 |
| **页面逻辑调整** | `buildAds` 平台分支；预览编辑支持多卡（若需要） |

---

### 4.16 Create Spark Ads / 授权帖子子页 / id 兜底

| 文档 | [create-spark-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-spark-ads/v1.3) · [create-spark-ads-with-authorized-post/v1.3](https://business-api.tiktok.com/portal/docs/create-spark-ads-with-authorized-post/v1.3) · [docs?id=1739470744631298](https://business-api.tiktok.com/portal/docs?id=1739470744631298) |
| **TikTok 侧要点** | **授权帖子/身份**；非单纯素材上传 |
| **现有页面对齐** | 素材列表 |
| **关键差异** | 缺 Spark 授权与帖子引用则无法发布 |
| **融入结论** | **部分可融入（P2）** |
| **最小改动方案** | 发布弹窗 Spark 模式：身份 + 授权帖子/授权码 |
| **页面逻辑调整** | 与普通上传创意互斥或分 Tab |

---

### 4.17 Create Advanced Dedicated campaigns

| 项目 | 内容 |
|------|------|
| **官方文档** | [create-advanced-dedicated-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/create-advanced-dedicated-campaigns/v1.3) |
| **TikTok 侧要点** | 高级专用类型；常依赖 **账户能力/白名单** |
| **现有页面对齐** | 通用活动结构 |
| **关键差异** | 默认用户可能无权限 |
| **融入结论** | **谨慎融入**：建议仅高级客户或人工介入 |
| **最小改动方案** | 强校验 + 默认不开放一键发布 |

---

## 5. 总对比矩阵（广告目标 / 系列 × 融入结论）

| TikTok 文档系列 | 融入结论 | 与现有页面主要冲突点 | 建议优先级 |
|-----------------|----------|----------------------|------------|
| Campaign creation 总览 | 信息架构 | 无 | — |
| Traffic | 可 | objective 映射 | P0 |
| Optimize Destination Visits | 可（子模式） | 默认优化参数 | P0 |
| Community Interaction | 可 | Engagement 映射、Identity | P1 |
| App Pre-Registration | 部分 | App/预注册资产 | P2 |
| Lead Gen（网站） | 可 | 事件/合规 | P1 |
| Lead Gen（Instant Form） | 部分 | 表单资产 | P2 |
| Website Conversions | 可 | Pixel/事件体系 | P0 |
| Shopping（父级） | 可（分叉） | Meta vs TikTok 目录 | P1 |
| Video/Product/LIVE Shopping | 部分 | LIVE 资产 | P1/P2 |
| Reach & Frequency | 部分 | 非竞价逻辑 | P2 |
| GMV Max | 部分 | 自动化与资产 | P2 |
| Deprecated id | 不建议 | 维护成本 | — |
| Smart+ Upgraded | 部分 | 托管 vs 手动拆分 | P2 |
| Search Ads / Campaigns | 可 | 缺关键词 | P2 |
| Web+App optimization | 可 | 双路径配置 | P1 |
| Single image | 可 | 素材上传 | P0 |
| Carousel | 可 | 与 FLEXIBLE 解耦 | P1 |
| Spark / 授权帖子 | 部分 | 授权链路 | P2 |
| Advanced Dedicated | 谨慎 | 权限 | P3 |

## 5. 完整官方页面矩阵（所有 27 页 Campaign Creation 文档）

| # | 官方页面文档 URL | 融入结论 | 最小改动方案 | 优先级 |
|---|---|---|---|---|
| 1 | campaign-creation/v1.3 | ✅ 可（索引） | 增加 TikTok 系列导航与说明 | — |
| 2 | create-traffic-ads/v1.3 | ✅ 可 | Objective 映射 + 标准三层发布 | **P0** |
| 3 | optimize-destination-visits/v1.3 | ✅ 可（子模式） | Traffic 二级开关 + 不同默认优化/出价 | **P0** |
| 4 | create-community-interaction-ads/v1.3 | ✅ 可 | Engagement 映射 + Identity 优先 | **P1** |
| 5 | create-app-pre-registration-ads/v1.3 | 🟡 部分 | 计划可生成；发布需 App/预注册资产 | P2 |
| 6 | create-lead-generation-ads/v1.3 | ✅ 可 | Web Lead 先行；表单资产二期 | **P1** |
| 7 | lead-generation-instant-form/v1.3 | 🟡 部分 | 需要 Instant Form 资产 | P2 |
| 8 | create-lead-generation-instant-form-ads/v1.3 | 🟡 部分 | 绑定表单后才能发布 | P2 |
| 9 | create-website-conversions-ads/v1.3 | ✅ 可 | Pixel+Event 映射 | **P0** |
| 10 | create-shopping-ads/v1.3 | ✅ 可（需分叉） | CATALOG→平台目录资产切换 | **P1** |
| 11 | create-video-shopping-ads/v1.3 | 🟡 部分 | Shopping 子类型 + 素材/目录 | P1/P2 |
| 12 | create-product-shopping-ads/v1.3 | 🟡 部分 | Shopping 子类型 + 素材/目录 | P1/P2 |
| 13 | create-live-shopping-ads/v1.3 | 🟡 部分 | 直播资产/排期强约束 | P2 |
| 14 | set-up-reach-frequency-campaigns/v1.3 | 🟡 部分 | 专用 R&F 表单；谨慎发布 | P2 |
| 15 | create-gmv-max-campaigns/v1.3 | 🟡 部分 | 独立系列；收敛字段 | P2 |
| 16 | docs?id=1822009058467842 | ❌ 不建议 | 弃用迁移提示 | — |
| 17 | docs?id=1780164603696130 | ❌ 不建议/仅兼容 | 迁移提示 | — |
| 18 | create-an-upgraded-smart+-campaign-use-case/v1.3 | 🟡 部分 | 托管模式；限制手动拆分 | P2 |
| 19 | create-search-ads/v1.3 | ✅ 可 | 关键词模块 | **P2** |
| 20 | create-search-ads-campaigns/v1.3 | ✅ 可 | 与 Search 合并入口 | **P2** |
| 21 | create-ads-with-website-and-app-optimization/v1.3 | ✅ 可 | Web/App 优化向导 | **P1** |
| 22 | create-single-image-ads/v1.3 | ✅ 可 | 单图创意默认路径 | **P0** |
| 23 | create-carousel-ads/v1.3 | ✅ 可 | Carousel 与 FLEXIBLE 解耦 | **P1** |
| 24 | create-spark-ads/v1.3 | 🟡 部分 | Spark 授权链路 | P2 |
| 25 | create-spark-ads-with-authorized-post/v1.3 | 🟡 部分 | Spark 子流程 | P2 |
| 26 | docs?id=1739470744631298 | 🟡 视页面 | 与 Spark 合并避免重复 | P2 |
| 27 | create-advanced-dedicated-campaigns/v1.3 | 🟡 部分/谨慎 | 高级客户专用；强校验 | P3 |

**汇总统计：**
- ✅ **可融入**：12 页（P0:4 页 / P1:4 页 / P2:2 页 / 索引:1 页）
- 🟡 **部分可融入**：12 页（需资产/特殊约束/高级权限）
- ❌ **不建议**：2 页（已弃用或仅兼容性）
- 🟡 **视页面内容**：1 页（兜底文档）

---

## 6. 分期落地建议（可执行）

| 阶段 | 范围 | 目标 |
|------|------|------|
| **P0** | Traffic、Website Conversions、Single Image；启用 TikTok 平台占位→真配置 | 打通「计划→映射→可发布」最小闭环（仍依赖后端真实 API） |
| **P1** | Community、Lead（网站）、Shopping（目录分叉）、Carousel、Web+App optimization | 覆盖主流电商与线索 |
| **P2** | Search、Spark、App Pre-Registration、Instant Form、R&F、GMV Max、Smart+ | 强资产/强权限类 |

---

## 7. 风险与依赖（结论性）

1. **无素材上传与 Identity 则无真发布**；仅有预览与导出。  
2. **无 TikTok Pixel/事件映射**则转化类易失败或错投。  
3. **CATALOG 不拆分平台**会导致购物广告配置错误。  
4. **R&F / GMV Max / Smart+ / Advanced** 若产品默认「一键批量」，易引发审核/权限/计费事故，需产品级开关与文案。

---

## 8. 附录：官方文档 URL 清单（便于评审逐条打开）

- [campaign-creation/v1.3](https://business-api.tiktok.com/portal/docs/campaign-creation/v1.3)  
- [create-traffic-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-traffic-ads/v1.3)  
- [optimize-destination-visits/v1.3](https://business-api.tiktok.com/portal/docs/optimize-destination-visits/v1.3)  
- [create-community-interaction-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-community-interaction-ads/v1.3)  
- [create-app-pre-registration-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-app-pre-registration-ads/v1.3)  
- [create-lead-generation-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-lead-generation-ads/v1.3)  
- [lead-generation-instant-form/v1.3](https://business-api.tiktok.com/portal/docs/lead-generation-instant-form/v1.3)  
- [create-lead-generation-instant-form-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-lead-generation-instant-form-ads/v1.3)  
- [create-website-conversions-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-website-conversions-ads/v1.3)  
- [create-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-shopping-ads/v1.3)  
- [create-video-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-video-shopping-ads/v1.3)  
- [create-product-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-product-shopping-ads/v1.3)  
- [create-live-shopping-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-live-shopping-ads/v1.3)  
- [set-up-reach-frequency-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/set-up-reach-frequency-campaigns/v1.3)  
- [create-gmv-max-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/create-gmv-max-campaigns/v1.3)  
- [docs?id=1822009058467842](https://business-api.tiktok.com/portal/docs?id=1822009058467842)  
- [docs?id=1780164603696130](https://business-api.tiktok.com/portal/docs?id=1780164603696130)  
- [create-an-upgraded-smart+-campaign-use-case/v1.3](https://business-api.tiktok.com/portal/docs/create-an-upgraded-smart+-campaign-use-case/v1.3)  
- [create-search-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-search-ads/v1.3)  
- [create-search-ads-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/create-search-ads-campaigns/v1.3)  
- [create-ads-with-website-and-app-optimization/v1.3](https://business-api.tiktok.com/portal/docs/create-ads-with-website-and-app-optimization/v1.3)  
- [create-single-image-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-single-image-ads/v1.3)  
- [create-carousel-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-carousel-ads/v1.3)  
- [create-spark-ads/v1.3](https://business-api.tiktok.com/portal/docs/create-spark-ads/v1.3)  
- [create-spark-ads-with-authorized-post/v1.3](https://business-api.tiktok.com/portal/docs/create-spark-ads-with-authorized-post/v1.3)  
- [docs?id=1739470744631298](https://business-api.tiktok.com/portal/docs?id=1739470744631298)  
- [create-advanced-dedicated-campaigns/v1.3](https://business-api.tiktok.com/portal/docs/create-advanced-dedicated-campaigns/v1.3)  

---

## 9. 文档关系说明

- 早前文件 `docs/TIKTOK_CAMPAIGN_CREATION_VS_BATCH_GENERATE_ADS_RESEARCH.md` 为同主题过程稿。  
- **以本文 `docs/TIKTOK_CAMPAIGN_CREATION_广告目标对比与BatchGenerateAds融合分析.md` 作为正式交付件**：含执行摘要、逐目标对比、总矩阵与分期建议。  

---

## 10. v2.0 相对初版的深化说明（评审用）

| 维度 | 初版 | v2.0 |
|------|------|------|
| 方法论 | 隐含 | **§0** 明确交付标准与证据边界 |
| 代码对齐 | 概括 | **§3.3～3.5** 枚举路径、状态字段、与 TikTok 概念对照 |
| 可比性 | 段落结论 | **§4.0 六维总表**（D1–D6）逐系列打分，避免「一句话带过」 |
| 决策者可读性 | 偏技术 | **§2.1** 三句话结论可贴周报 |
| Skill 对齐 | 未声明 | 结构对齐 `ce-plan` / `writing-plans` 的「摘要—基线—矩阵—分期—风险」骨架 |

---

## 9. API 参数映射表（浏览器直读补充）

> **数据源**：浏览器逐页访问 TikTok 官方文档 + 参数提取  
> **时间**：2026-04-21  
> **详见**：`docs/TikTok-API-Parameters-Details.md`

本节提供关键的 API 字段映射，用于代码改动时参考。完整参数表见独立文档 `TikTok-API-Parameters-Details.md`。

### 9.1 Campaign 级必需字段
| 字段 | 类型 | 对应 Batch Generate | 说明 |
|---|---|---|---|
| `campaign_name` | string | campaignName | 广告系列名 |
| `objective_type` | enum | 根据 platform 映射 | TRAFFIC / WEB_CONVERSIONS / ENGAGEMENT / SHOPPING / ... |
| `budget_mode` | enum | budgetMode | CBO (Campaign Budget Optimization) 或 ABO (Adset Budget Optimization) |

### 9.2 Ad Group 级必需字段
| 字段 | 类型 | 对应 Batch Generate | 说明 |
|---|---|---|---|
| `adgroup_name` | string | adsetName | 广告组名 |
| `optimization_goal` | enum | **需新增 TIKTOK_ADSET_GOALS_MAPPING** | CLICKS / CONVERSIONS / IMPRESSIONS / REACH / VIDEO_VIEWS 等 |
| `daily_budget` | float | dailyBudget | 日预算 |
| `bid_type` | enum | **需新增 TIKTOK_BID_TYPES** | BID / TARGET_CPA / TARGET_ROAS / UNLIMITED |
| `billing_event` | enum | **需新增** | CLICK / IMPRESSION / COMPLETE_PAYMENT / ... |
| `pixel_id` | string | pixelId | **仅 WEB_CONVERSIONS 必需**；用于事件跟踪 |
| `conversion_event` | string | **需新增** | Purchase / AddToCart / ViewContent / Lead / Download / ... |

### 9.3 Creative 级字段（按类型）

**Single Image**:
- `creative_type`: "SINGLE_IMAGE"
- `image_id`: (需上传获得，非 URL)
- `title`, `description`: 文案

**Carousel**:
- `creative_type`: "CAROUSEL"  
- `carousel_items[]`: 数组
  - 每项含：`image_id`, `title`, `description`, `landing_page_url` (per-card)
  - **关键差异**：支持逐卡独立落地页（Meta Flexible 不支持）

### 9.4 代码改动点速查

1. **types.ts**: 新增 TikTok 枚举定义
2. **BatchGenerateAds.jsx**: 
   - `TIKTOK_OBJECTIVES` = { TRAFFIC, WEB_CONVERSIONS, ... }
   - `TIKTOK_ADSET_GOALS_MAPPING` = { TRAFFIC: [CLICKS, CONVERSIONS], ... }
3. **TargetingChannelCard.jsx**: 
   - `optimization_goal` 字段条件展示（platform-specific）
   - `billingEvent` 新字段
4. **CampaignPlanView.jsx**: 
   - `buildAds()` 需处理 CAROUSEL 多卡独立落地页逻辑
5. **PublishModal.jsx**: 
   - TikTok 分支：展示 `pixel_id`, `identity_id`, `conversion_event`
   - 隐藏 Meta 专用字段 (`pageId`, `eventId` 等)

---

**交付物自检（是否可独立交付）**

- [x] 有 **方法论 / 证据边界**（§0）  
- [x] 有 **执行摘要**（§2）与 **决策者三句话**（§2.1）  
- [x] 有 **项目现状基线**（§3，对齐代码枚举）  
- [x] **每个 TikTok 广告目标/系列**均有：对比项、差异、结论、方案、页面调整（§4）  
- [x] 有 **总矩阵**（§5）与 **分期建议**（§6）  
- [x] 有 **风险结论**（§7）与 **官方链接附录**（§8）  
- [x] 有 **API 参数映射表**（§9）与 **代码改动速查**  
