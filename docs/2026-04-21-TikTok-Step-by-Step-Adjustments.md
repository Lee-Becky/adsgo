# Batch Generate Ads 融入 TikTok：逐步骤最佳调整方案

> **依据**：TikTok Ads Manager 前端截图（全 7 个目标）+ TikTok Marketing API v1.3 规范 + 现有代码逐行审阅  
> **原则**：最小改动、不改架构、只改数据配置和条件分支

---

## Step 1 — 产品/素材选择（ProductSelector）

### 现有流程
```
选择投放类型 → PRODUCT（落地页广告）/ CATALOG（目录广告）
  → 选择/上传产品 + 绑定素材
  → AI 分析产品
```

### 最佳调整：不改

**理由**：
- 产品/素材选择与平台完全无关。用户选产品、上传素材、AI 分析，这些操作在 Meta 和 TikTok 下完全一致。
- CATALOG 模式：Meta 绑定 Meta Product Catalog，TikTok 绑定 TikTok Catalog。但数据源切换在**发布阶段**处理，不在产品选择阶段。
- TikTok Shop / GMV Max 在 **Step 2 的 Sales 目标 → TikTok Shop destination** 中处理，不需要在 Step 1 增加入口。

### 改动量：0 行

---

## Step 2 — 投放目标与渠道（TargetingChannelCard）★ 核心改造

### 现有流程
```
4 格卡片并排：投放国家 | 投放语言 | 投放渠道媒体 | Promote Objective
  → Objective 选择是 3 级：Campaign Objective → Conversion Goal → Event
  → 当前 Objective / Goal / Event 全部写死为 Meta 的值
```

### 现有代码关键变量
```javascript
platform           // PLATFORMS[0] = Meta（写死）
objective          // 'sales_conversions' 等（写死 Meta 枚举）
adsetGoal          // 'in_web_actions' 等（写死 Meta 枚举）
event              // 'Purchase' 等（写死 Meta 事件）
objectiveStage     // 'objective' | 'goal' | 'event'（三级选择的当前阶段）
```

### 最佳调整

#### 调整 1：启用 TikTok 平台（1 行）

```javascript
// 第 38 行：disabled: true → disabled: false
{ id: 'tiktok', name: 'TikTok', ..., disabled: false }
```

#### 调整 2：平台切换时重置下游状态（~10 行）

```javascript
// 新增 useEffect
useEffect(() => {
  // 切换平台时，清空目标、goal、event，因为枚举不通用
  setObjective('');
  setAdsetGoal('');
  setEvent('');
  setObjectiveStage('objective');
  setCampaignSetupMode('manual');
  setSalesDestination('');
}, [platform?.id]);
```

#### 调整 3：CAMPAIGN_OBJECTIVES 按平台索引（~80 行）

把固定数组改为 `{ meta: [...], tiktok: [...] }` 字典。
TikTok 的 7 个目标定义要包含每个目标右侧展开的**二级配置结构**（已在实施方案文档中完整定义）。

引用方式改造（~2 行）：
```javascript
// 现有
const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === objective);
// 改造后
const platformObjectives = CAMPAIGN_OBJECTIVES[platform?.id] || CAMPAIGN_OBJECTIVES.meta;
const currentObjectiveObj = platformObjectives.find(o => o.value === objective);
```

#### 调整 4：objectiveStage 从 3 级扩展为 4 级（~30 行）

现有的三级选择 `objective → goal → event` 不够。TikTok 截图显示：
选完 objective 后，先要处理**二级配置**（Campaign setup / Campaign type / Sales destination / Promotion type / Lead source），然后才是 goal 和 event。

```javascript
// 现有
objectiveStage: 'objective' | 'goal' | 'event'

// 改造后
objectiveStage: 'objective' | 'sub_config' | 'goal' | 'event'
//                               ↑ 新增：二级配置阶段
```

**sub_config 阶段要渲染什么？取决于当前目标**：

| 当选了 | sub_config 显示 | 然后进入 |
|---|---|---|
| Reach | Campaign type（Auction / R&F） | goal |
| Traffic | Campaign setup（Manual / Smart+ / Search） | goal |
| Video views | 跳过 sub_config | goal |
| Community interaction | 跳过 sub_config | goal |
| App promotion | Promotion type（Install / Retargeting）→ Install 下嵌 Campaign setup | goal |
| Lead generation | Lead source tab（Website / Instant form / DM / Messaging）+ Campaign setup + Use catalog | goal |
| Sales | Sales destination（TikTok Shop / Website / App / Website+App） | goal |

#### 调整 5：ADSET_GOALS_MAPPING 按平台索引（~50 行）

同理改为 `{ meta: {...}, tiktok: {...} }` 字典。TikTok 的 goal 还要携带 `billingEvent`、`needsPixel`、`needsForm` 等条件属性。

```javascript
// 现有
const availableGoals = ADSET_GOALS_MAPPING[objective] || [];
// 改造后
const platformGoals = ADSET_GOALS_MAPPING[platform?.id] || ADSET_GOALS_MAPPING.meta;
const availableGoals = platformGoals[objective] || [];
```

#### 调整 6：STANDARD_EVENTS 按平台 + web/app 区分（~40 行）

TikTok 的事件分 Web Event（Pixel）和 App Event（SDK）两套。根据当前的 objective + destination 动态选择事件列表。

```javascript
// 现有
const filteredEvents = STANDARD_EVENTS.filter(e => e.toLowerCase().includes(eventSearch.toLowerCase()));
// 改造后
const eventList = getEventListByContext(platform?.id, objective, salesDestination);
const filteredEvents = eventList.filter(e => ...);
```

#### 调整 7：新增状态变量（~8 行）

```javascript
const [campaignSetupMode, setCampaignSetupMode] = useState('manual');
const [reachCampaignType, setReachCampaignType] = useState('auction');
const [appPromotionType, setAppPromotionType] = useState('app_install');
const [leadSource, setLeadSource] = useState('website');
const [salesDestination, setSalesDestination] = useState('');
const [useCatalog, setUseCatalog] = useState(false);
```

### Step 2 总改动量：约 220 行

---

## Step 3 — 架构与预算（CampaignPlanView）

### 现有流程
```
拆分策略（PER_PRODUCT / ALL_PRODUCTS / BY_CREATIVE / AI_STRATEGY）
  → Adset 组数
  → Ad Format（FLEXIBLE / SINGLE，仅 sales_conversions / app_promotion 显示）
  → 预算（CBO / ABO + 日预算）
  → 受众分配（ADV / LAL / INT / CUSTOM）
```

### 最佳调整

#### 调整 1：拆分策略 — 不改

PER_PRODUCT / ALL_PRODUCTS / BY_CREATIVE / AI_STRATEGY 都是平台无关的编排逻辑。

#### 调整 2：Ad Format 按平台条件化（~20 行）

```javascript
// 现有（第 1041-1044 行）
useEffect(() => {
  if (objective !== 'sales_conversions' && objective !== 'app_promotion') {
    setAdType('SINGLE');
  }
}, [objective]);

// 改造后
useEffect(() => {
  if (platform?.id === 'meta') {
    // Meta: FLEXIBLE 仅在 sales_conversions / app_promotion 下可用
    if (objective !== 'sales_conversions' && objective !== 'app_promotion') {
      setAdType('SINGLE');
    }
  } else if (platform?.id === 'tiktok') {
    // TikTok: 没有 FLEXIBLE，默认 SINGLE；所有目标都可选 CAROUSEL
    if (adType === 'FLEXIBLE') setAdType('SINGLE');
  }
}, [objective, platform?.id]);
```

CampaignPlanView 中 Ad Format 选项渲染：

```javascript
// 现有：写死 FLEXIBLE / SINGLE
// 改造后：按平台显示
const adFormatOptions = platform?.id === 'tiktok'
  ? [
      { value: 'SINGLE', label: 'Single 单素材', desc: '单图/单视频一条广告' },
      { value: 'CAROUSEL', label: 'Carousel 轮播', desc: '多图/视频轮播（每卡可独立落地页）' }
    ]
  : [
      { value: 'FLEXIBLE', label: 'Flexible 多素材', desc: '多素材组合一条广告' },
      { value: 'SINGLE', label: 'Single 单素材', desc: '每素材 1 个 ad' }
    ];
```

#### 调整 3：Ad Format 显示条件（~5 行）

```javascript
// 现有：仅 sales_conversions / app_promotion 显示 Ad Format 选择器
const isFlexibleObjective = objective === 'sales_conversions' || objective === 'app_promotion';

// 改造后
const showAdFormatSelector = platform?.id === 'tiktok'
  ? true  // TikTok: 所有目标都可选 SINGLE / CAROUSEL
  : (objective === 'sales_conversions' || objective === 'app_promotion');
```

#### 调整 4：Smart+ 模式下锁定部分配置（~15 行）

```javascript
// 当 campaignSetupMode === 'smart_plus' 时：
const isSmartPlus = campaignSetupMode === 'smart_plus';
// - BY_CREATIVE 策略不可用（系统接管素材分配）
// - 受众默认 AUTO（隐藏 LAL/INT/CUSTOM 选择）
// - 出价策略默认 UNLIMITED
```

#### 调整 5：预算 CBO/ABO — 不改

TikTok API 的 `budget_mode` 完全支持 `BUDGET_MODE_DAY`（ABO）和 Campaign 级别预算（CBO），概念一致。

#### 调整 6：受众类型 — 极小改动（~5 行）

```javascript
// 现有：ADV / LAL / INT / CUSTOM
// TikTok 也有相同概念，只是名称对齐：
//   ADV → Automatic targeting
//   LAL → Lookalike audience
//   INT → Interest & Behavior targeting
//   CUSTOM → Custom audience
// 不需要改逻辑，最多改标签文案
```

### Step 3 总改动量：约 45 行

---

## Step 4 — 高级设置

### 现有流程
```
命名模板 → 落地页策略 → 文案策略 → 排期
```

### 最佳调整

#### 调整 1：命名模板 — 不改

`{Brand}-{Location}-{Date}-{Objective}` 等变量通用。

#### 调整 2：落地页策略 — Carousel 逐卡落地页（~20 行）

```javascript
// 现有：统一落地页 URL
// 当 TikTok + CAROUSEL 时，增加选项：
{platform?.id === 'tiktok' && adType === 'CAROUSEL' && (
  <div>
    <label>落地页模式</label>
    <select>
      <option value="unified">统一落地页（所有卡片共享）</option>
      <option value="per_card">逐卡落地页（每张卡独立 URL）</option>
    </select>
  </div>
)}
```

#### 调整 3：文案策略 — 不改

Title + Description 通用。

#### 调整 4：排期 — 不改

start_time / end_time 通用。TikTok 的 `schedule_start_time` 格式为 `YYYY-MM-DD HH:MM:SS`，转换在发布层处理。

### Step 4 总改动量：约 20 行

---

## Step 5 — 预览树（CampaignPreviewView）

### 现有流程
```
Campaign → Adset[] → Ad[]
  → 可编辑名称、素材、文案
  → buildAds() 函数根据策略生成树
```

### 最佳调整

#### 调整 1：buildAds() 支持 CAROUSEL（~30 行）

```javascript
// 现有（第 1073 行）
const buildAds = (creatives, adSetIdx, namePrefix, resolveProduct) => {
  if (isFlexible && creatives.length > 0) {
    // FLEXIBLE: 多图组合成一条广告
    ...
  }
};

// 改造后
const isCarousel = platform?.id === 'tiktok' && adType === 'CAROUSEL';

const buildAds = (creatives, adSetIdx, namePrefix, resolveProduct) => {
  if (isFlexible && creatives.length > 0) {
    // Meta FLEXIBLE: 不变
    ...
  } else if (isCarousel && creatives.length > 1) {
    // TikTok CAROUSEL: 多素材组合成一条轮播广告
    const carouselAd = {
      name: applyNameTemplate(adNameTemplate, { ... }),
      adFormat: 'CAROUSEL',
      carouselItems: creatives.slice(0, 10).map((c, i) => ({
        imageUrl: c.imageUrl || c.url,
        title: c.headline || resolveProduct(c)?.name || '',
        landingPageUrl: c.landingPageUrl || landingPageTemplate,
      })),
      imageUrl: creatives[0]?.imageUrl || creatives[0]?.url, // 首图作为封面
    };
    return [carouselAd];
  }
  // SINGLE: 不变
  ...
};
```

#### 调整 2：isFlexible 判断条件（~3 行）

```javascript
// 现有
const isFlexible = adType === 'FLEXIBLE' && (campaignObjective === 'sales_conversions' || campaignObjective === 'app_promotion');

// 改造后：排除 TikTok
const isFlexible = platform?.id !== 'tiktok' && adType === 'FLEXIBLE' && (campaignObjective === 'sales_conversions' || campaignObjective === 'app_promotion');
```

#### 调整 3：预览卡片 — 极小（~10 行）

CAROUSEL 的预览卡片显示"轮播 N 张"而非单图。

### Step 5 总改动量：约 43 行

---

## Step 6 — 发布弹窗（PublishModal）★ 重要改造

### 现有流程
```
Step 1: 连接平台（Meta / Google）
Step 2: 选择资产（Ad Account → FB Page → Pixel → Event → Phone）
Step 3: 发布进度
Step 4: 发布结果
Step 5: 后续引导
```

### 最佳调整

#### 调整 1：Step 1 — 增加 TikTok 连接（~30 行）

```javascript
// 现有（第 1245-1248 行）
const [platforms, setPlatforms] = useState({
  meta: { connected: !!authStatus?.meta, email: 'alex.designer@meta.com' },
  google: { connected: !!authStatus?.google, email: 'alex.growth@google.com' }
});

// 改造后：增加 tiktok
const [platforms, setPlatforms] = useState({
  meta: { ... },
  google: { ... },
  tiktok: { connected: !!authStatus?.tiktok, email: 'alex.ads@tiktok.com' }  // 新增
});

// LOGO_LINKS 增加 tiktok
// renderStep1 中复制 Meta 连接块的结构，替换为 TikTok 图标和文案
```

#### 调整 2：Step 2 — TikTok 资产链路（~120 行）★★

这是发布弹窗最核心的改造。

```javascript
// 现有（第 1440-1456 行）
const renderStep2 = () => {
  const isMeta = connectedPlatform === 'meta';
  // isMeta → Ad Account → FB Page → Pixel → Event
  // !isMeta → Ad Account → Conversion Dataset → Event
};

// 改造后
const renderStep2 = () => {
  const isMeta = connectedPlatform === 'meta';
  const isTikTok = connectedPlatform === 'tiktok';

  if (isTikTok) {
    // TikTok 资产链路（根据当前 objective + sub_config 条件显示）
    return (
      <div className="space-y-6">
        {/* 1. Ad Account（必需） */}
        <CustomDropdown label="TikTok Ad Account" ... />

        {/* 2. Identity（必需 — 所有 TikTok 广告都需要） */}
        {selections.adAccount && (
          <CustomDropdown label="TikTok Identity" ... />
        )}

        {/* 3. Pixel（条件 — 仅 Sales-Website / Lead-Website 需要） */}
        {needsPixel && selections.identity && (
          <CustomDropdown label="TikTok Pixel" ... />
        )}

        {/* 4. Conversion Event（条件 — 仅 needsEvent 的 goal 需要） */}
        {needsEvent && (selections.pixel || !needsPixel) && (
          <CustomDropdown label="Conversion Event" options={eventOptions} ... />
        )}

        {/* 5. 特殊资产（条件） */}
        {/* Instant Form — 仅 Lead generation + instant_form source */}
        {leadSource === 'instant_form' && (
          <CustomDropdown label="Instant Form" ... />
        )}

        {/* TikTok Shop — 仅 Sales + TikTok Shop destination */}
        {salesDestination === 'tiktok_shop' && (
          <CustomDropdown label="TikTok Shop" ... />
        )}

        {/* App — 仅 App promotion / Sales-App */}
        {needsApp && (
          <CustomDropdown label="App" ... />
        )}

        {/* 6. Phone（通用） */}
        {allSelectionsComplete && <PhoneInput ... />}
      </div>
    );
  }

  // Meta / Google 保持现有逻辑不变
  ...
};
```

**条件判断逻辑**：
```javascript
const needsPixel = (objective === 'sales' && ['website', 'website_and_app'].includes(salesDestination))
                 || (objective === 'lead_generation' && leadSource === 'website');
const needsEvent = currentGoalObj?.needsEvent === true;
const needsApp = objective === 'app_promotion'
              || (objective === 'sales' && ['app', 'website_and_app'].includes(salesDestination));
```

#### 调整 3：Step 2 — selections 状态扩展（~5 行）

```javascript
// 现有
const [selections, setSelections] = useState({
  adAccount: '', fbPage: '', pixel: '', event: '', conversionDataset: '', contactPhone: '', phoneCountryCode: '+1'
});

// 改造后：增加 TikTok 特有字段
const [selections, setSelections] = useState({
  adAccount: '', fbPage: '', pixel: '', event: '', conversionDataset: '',
  contactPhone: '', phoneCountryCode: '+1',
  identity: '',       // TikTok Identity
  instantForm: '',    // TikTok Instant Form
  tiktokShop: '',     // TikTok Shop
  appId: ''           // App ID
});
```

#### 调整 4：Step 3/4/5 发布进度 — 不改

发布进度的 UI（Campaign→Adset→Ad 逐步推进条）完全通用。API 调用差异在后端处理。

### Step 6 总改动量：约 155 行

---

## 汇总

| Step | 模块 | 改动量 | 核心改什么 |
|---|---|---|---|
| **Step 1** | ProductSelector | **0 行** | 不改 |
| **Step 2** | TargetingChannelCard | **~220 行** | Objectives/Goals/Events 按平台索引 + objectiveStage 扩展为 4 级 + 新增 6 个状态变量 |
| **Step 3** | CampaignPlanView | **~45 行** | Ad Format 条件化（FLEXIBLE→CAROUSEL）+ Smart+ 锁定 |
| **Step 4** | 高级设置 | **~20 行** | Carousel 逐卡落地页选项 |
| **Step 5** | CampaignPreviewView | **~43 行** | buildAds() 支持 CAROUSEL + isFlexible 排除 TikTok |
| **Step 6** | PublishModal | **~155 行** | TikTok 连接 + 资产链路（Identity/Pixel/Event/Form/Shop/App） |
| **合计** | **4 个文件** | **~483 行** | — |

---

## 不改的清单（明确列出）

| 内容 | 为什么不改 |
|---|---|
| 产品/素材选择 | 平台无关 |
| AI 分析 | 平台无关 |
| 拆分策略 PER_PRODUCT/ALL_PRODUCTS/BY_CREATIVE/AI | 编排逻辑，平台无关 |
| Adset 组数 | 平台无关 |
| 预算 CBO/ABO + 日预算 | TikTok 完全支持，概念一致 |
| 受众类型 ADV/LAL/INT/CUSTOM | TikTok 有相同概念（仅标签文案可能需对齐） |
| 命名模板 | 通用 |
| 文案策略 | 通用 |
| 排期 | 通用 |
| 预览树结构 | Campaign→Adset→Ad 完全同构 |
| 发布进度 UI | 通用的逐步推进条 |
| 发布结果/后续引导 | 通用 |

---

## 实施优先级

| 优先级 | 任务 | 文件 | 行数 |
|---|---|---|---|
| **P0-第1天** | 启用 TikTok 平台 + 平台切换重置 | BatchGenerateAds.jsx | ~11 行 |
| **P0-第2天** | CAMPAIGN_OBJECTIVES 按平台索引 | BatchGenerateAds.jsx | ~80 行 |
| **P0-第3天** | objectiveStage 扩展 4 级 + 二级配置渲染 | BatchGenerateAds.jsx | ~80 行 |
| **P0-第4天** | ADSET_GOALS_MAPPING + STANDARD_EVENTS | BatchGenerateAds.jsx | ~90 行 |
| **P0-第5天** | Ad Format 条件化 + isFlexible 修正 | CampaignPlanView + CampaignPreviewView | ~28 行 |
| **P0-第6天** | buildAds() CAROUSEL 支持 | CampaignPreviewView.jsx | ~30 行 |
| **P0-第7天** | PublishModal TikTok 连接 | BatchGenerateAds.jsx | ~30 行 |
| **P0-第8-9天** | PublishModal TikTok 资产链路 | BatchGenerateAds.jsx | ~120 行 |
| **P1-第10天** | Carousel 逐卡落地页 + Smart+ 锁定 | 高级设置 + CampaignPlanView | ~35 行 |

**总计 ~483 行代码，约 10 个工作日可完成 P0+P1。**

