/**
 * Phase 2.B：SDK ↔ legacy 命名映射 + form/CampaignPlanView 双向桥接。
 *
 * deriveSectionDefaults 输出统一返回 legacy 命名（'sales_conversions' / 'in_web_actions' / 'cost_cap' / 'SINGLE'），
 * 让 CampaignPlanView 内部 ADSET_GOALS_MAPPING / BID_STRATEGIES 等查表正常。
 *
 * legacy*ToSdk 系列把 PlanView 内 onChange 的 legacy 值写回 formData 中的 SDK 命名。
 */

import { META_PIXELS, TIKTOK_PIXELS } from '../services/platformResources';

// ─── Phase 2.M: Meta attribution_spec 4 预设组合 ↔ SDK [{event_type, window_days}] ───
const META_ATTRIBUTION_PRESETS = {
  CLICK_7D_VIEW_1D: [
    { event_type: 'CLICK_THROUGH', window_days: 7 },
    { event_type: 'VIEW_THROUGH',  window_days: 1 },
  ],
  CLICK_7D_ONLY: [
    { event_type: 'CLICK_THROUGH', window_days: 7 },
  ],
  CLICK_1D_VIEW_1D: [
    { event_type: 'CLICK_THROUGH', window_days: 1 },
    { event_type: 'VIEW_THROUGH',  window_days: 1 },
  ],
  CLICK_1D_ONLY: [
    { event_type: 'CLICK_THROUGH', window_days: 1 },
  ],
};

/** 把 attribution preset 字符串展开为 SDK 数组（发布层使用） */
export function expandAttributionPreset(preset) {
  return META_ATTRIBUTION_PRESETS[preset] || null;
}

// ─── Phase 2.N: publish 状态渠道映射 ───
// Meta:   campaign/adset/ad.status         ∈ {PAUSED, ACTIVE}
// TikTok: campaign/adgroup/ad.operation_status ∈ {DISABLE, ENABLE}
/** 渠道 → 该渠道存放"初始状态"的字段名 */
export function statusFieldName(channelId) {
  return channelId === 'tiktok' ? 'operation_status' : 'status';
}

/** UI 二元值 'PAUSED' | 'ACTIVE' → 该渠道的 SDK 值 */
export function publishStatusToSdk(channelId, uiStatus) {
  if (channelId === 'tiktok') return uiStatus === 'ACTIVE' ? 'ENABLE' : 'DISABLE';
  return uiStatus === 'ACTIVE' ? 'ACTIVE' : 'PAUSED';
}

// ─── Phase 2.O: 命名模板变量 ───
/** 默认变量集（NameTemplateField + resolveNameTemplate 共用）。Label 用于 Popover 展示，key 用作 {token}。 */
export const NAME_VARIABLES = [
  { key: 'creative_name', label: '素材名称', hint: '仅 Ad 层有效；其他层级显示字面' },
  { key: 'optimize_goal', label: '优化目标', hint: 'adset.optimization_goal' },
  { key: 'locations',     label: '投放地区', hint: 'Meta: geo_locations.countries / TikTok: location_ids' },
  { key: 'age',           label: '年龄',     hint: 'age_min-age_max' },
  { key: 'gender',        label: '性别',     hint: 'genders 联合' },
];

/** 把 `Q4-{locations}-{age}` 替换为实际值；未命中或空值的 token 保留字面量。 */
export function resolveNameTemplate(template, ctx = {}) {
  if (!template) return '';
  return String(template).replace(/\{(\w+)\}/g, (m, key) => {
    const v = ctx[key];
    if (v === undefined || v === null || v === '') return m;
    if (Array.isArray(v)) return v.filter(Boolean).join('|');
    return String(v);
  });
}

/** 从 formData snapshot 派生 NameTemplateField 预览所需 ctx。perAdCtx 用于 ad 层节点 override。 */
export function deriveNameResolveCtx(channel, level, rootFormData, perAdCtx = {}) {
  const adset = rootFormData?.adset || {};
  // locations：Meta 取 geo_locations.countries（主要维度），TikTok 取 location_ids
  let locations = null;
  if (channel === 'tiktok') {
    locations = Array.isArray(adset.location_ids) && adset.location_ids.length ? adset.location_ids : null;
  } else {
    const geo = adset.geo_locations || {};
    locations = (geo.countries && geo.countries.length) ? geo.countries
              : (geo.regions   && geo.regions.length)   ? geo.regions
              : (geo.cities    && geo.cities.length)    ? geo.cities
              : null;
  }
  const ageMin = adset.age_min, ageMax = adset.age_max;
  return {
    optimize_goal: adset.optimization_goal || adset.optimization_event || null,
    locations,
    age: (ageMin != null && ageMax != null) ? `${ageMin}-${ageMax}` : (ageMin != null ? `${ageMin}+` : null),
    gender: Array.isArray(adset.genders) && adset.genders.length ? adset.genders.join('+') : (adset.gender || null),
    creative_name: perAdCtx.creative_name || null,
  };
}

/** 把 SDK 数组反推回 preset 字符串（saved structures 应用兼容） */
export function detectAttributionPreset(specArray) {
  if (!Array.isArray(specArray) || specArray.length === 0) return null;
  for (const [key, val] of Object.entries(META_ATTRIBUTION_PRESETS)) {
    if (val.length !== specArray.length) continue;
    const match = val.every(want =>
      specArray.some(got => got.event_type === want.event_type && got.window_days === want.window_days)
    );
    if (match) return key;
  }
  return null;
}

// ─── SDK → legacy ───
const META_OBJECTIVE_LEGACY = {
  OUTCOME_AWARENESS:    'awareness_engagement',
  OUTCOME_TRAFFIC:      'traffic',
  OUTCOME_ENGAGEMENT:   'awareness_engagement',
  OUTCOME_LEADS:        'leads',
  OUTCOME_APP_PROMOTION:'app_promotion',
  OUTCOME_SALES:        'sales_conversions',
};
const TIKTOK_OBJECTIVE_LEGACY = {
  REACH:                  'awareness_engagement',
  TRAFFIC:                'traffic',
  VIDEO_VIEWS:            'awareness_engagement',
  COMMUNITY_INTERACTION:  'awareness_engagement',
  ENGAGEMENT:             'awareness_engagement',
  LEAD_GENERATION:        'leads',
  WEB_CONVERSIONS:        'sales_conversions',
  PRODUCT_SALES:          'sales_conversions',
  SHOP_PURCHASES:         'sales_conversions',
  APP_PROMOTION:          'app_promotion',
};

const META_OPT_GOAL_LEGACY = {
  OFFSITE_CONVERSIONS:  'in_web_actions',
  VALUE:                'in_web_actions',
  LEAD_GENERATION:      'instant_form_leads',
  QUALITY_LEAD:         'instant_form_leads',
  APP_INSTALLS:         'installs',
  APP_INSTALLS_AND_OFFSITE_CONVERSIONS: 'installs',
  IN_APP_VALUE:         'in_app_actions',
  LANDING_PAGE_VIEWS:   'page_views',
  LINK_CLICKS:          'link_clicks',
  POST_ENGAGEMENT:      'post_engagement',
  IMPRESSIONS:          'impressions',
  REACH:                'impressions',
  THRUPLAY:             'impressions',
  CONVERSATIONS:        'conversations',
  PAGE_LIKES:           'post_engagement',
};
const TIKTOK_OPT_GOAL_LEGACY = {
  CONVERT:                  'in_web_actions',
  VALUE:                    'in_web_actions',
  INSTALL:                  'installs',
  IN_APP_EVENT:             'in_app_actions',
  CLICK:                    'link_clicks',
  TRAFFIC_LANDING_PAGE_VIEW:'page_views',
  REACH:                    'impressions',
  SHOW:                     'impressions',
  VIDEO_VIEW:               'impressions',
  ENGAGED_VIEW:             'impressions',
  LIVE_VIEW:                'impressions',
  LEAD_GENERATION:          'instant_form_leads',
  INITIATE_CHECKOUT:        'in_web_actions',
};

const META_BID_LEGACY = {
  LOWEST_COST_WITHOUT_CAP:    'highest_volume',
  LOWEST_COST_WITH_BID_CAP:   'bid_cap',
  COST_CAP:                   'cost_cap',
  LOWEST_COST_WITH_MIN_ROAS:  'roas',
};
const TIKTOK_BID_LEGACY = {
  BID_TYPE_NO_BID:         'highest_volume',
  BID_TYPE_CUSTOM:          'cost_cap',
  BID_TYPE_MAX_CONVERSION:  'highest_volume',
};

const META_AD_FORMAT_LEGACY = {
  SINGLE_IMAGE: 'SINGLE',
  SINGLE_VIDEO: 'SINGLE',
  CAROUSEL:     'CAROUSEL',
  COLLECTION:   'CAROUSEL',
  FLEXIBLE:     'FLEXIBLE',
  DPA:          'FLEXIBLE',
};
const TIKTOK_AD_FORMAT_LEGACY = {
  SINGLE_IMAGE:     'SINGLE',
  SINGLE_VIDEO:     'SINGLE',
  CAROUSEL_ADS:     'CAROUSEL',
  CATALOG_CAROUSEL: 'CAROUSEL',
  COLLECTION_ADS:   'CAROUSEL',
  SPARK_ADS:        'SINGLE',
  PLAYABLE_ADS:     'SINGLE',
  INSTANT_PAGE_ADS: 'SINGLE',
};

// ─── legacy → SDK ───（反向，PlanView onChange 时使用）
const LEGACY_TO_META_OBJECTIVE = {
  awareness_engagement: 'OUTCOME_AWARENESS',
  traffic:              'OUTCOME_TRAFFIC',
  leads:                'OUTCOME_LEADS',
  sales_conversions:    'OUTCOME_SALES',
  app_promotion:        'OUTCOME_APP_PROMOTION',
};
const LEGACY_TO_TIKTOK_OBJECTIVE = {
  awareness_engagement: 'REACH',
  traffic:              'TRAFFIC',
  leads:                'LEAD_GENERATION',
  sales_conversions:    'WEB_CONVERSIONS',
  app_promotion:        'APP_PROMOTION',
};

const LEGACY_TO_META_OPT_GOAL = {
  in_web_actions:       'OFFSITE_CONVERSIONS',
  instant_form_leads:   'LEAD_GENERATION',
  installs:             'APP_INSTALLS',
  in_app_actions:       'IN_APP_VALUE',
  page_views:           'LANDING_PAGE_VIEWS',
  link_clicks:          'LINK_CLICKS',
  post_engagement:      'POST_ENGAGEMENT',
  impressions:          'IMPRESSIONS',
};
const LEGACY_TO_TIKTOK_OPT_GOAL = {
  in_web_actions:       'CONVERT',
  installs:             'INSTALL',
  in_app_actions:       'IN_APP_EVENT',
  page_views:           'TRAFFIC_LANDING_PAGE_VIEW',
  link_clicks:          'CLICK',
  impressions:          'REACH',
  instant_form_leads:   'LEAD_GENERATION',
};

const LEGACY_TO_META_BID = {
  highest_volume: 'LOWEST_COST_WITHOUT_CAP',
  bid_cap:        'LOWEST_COST_WITH_BID_CAP',
  cost_cap:       'COST_CAP',
  roas:           'LOWEST_COST_WITH_MIN_ROAS',
};
const LEGACY_TO_TIKTOK_BID = {
  highest_volume: 'BID_TYPE_NO_BID',
  cost_cap:       'BID_TYPE_CUSTOM',
  bid_cap:        'BID_TYPE_CUSTOM',
  roas:           'BID_TYPE_CUSTOM',
};

const LEGACY_TO_META_AD_FORMAT = {
  SINGLE:   'SINGLE_IMAGE',
  CAROUSEL: 'CAROUSEL',
  FLEXIBLE: 'FLEXIBLE',
};
const LEGACY_TO_TIKTOK_AD_FORMAT = {
  SINGLE:   'SINGLE_VIDEO',
  CAROUSEL: 'CAROUSEL_ADS',
  FLEXIBLE: 'SINGLE_VIDEO',  // TikTok 无 FLEXIBLE，回落
};

// ─── 派生 sectionDefaults（CampaignPlanView 消费的旧契约）─────
export function deriveSectionDefaults(formData, channelId) {
  const c = formData?.campaign || {};
  const a = formData?.adset || {};
  const ad = formData?.ad || {};

  if (channelId === 'tiktok') {
    const objSdk = c.objective_type || '';
    const ogSdk = a.optimization_goal || '';
    const bidSdk = a.bid_type || '';
    const adFmtSdk = ad.ad_format || '';
    return {
      selectedLocations: pickTiktokLocations(a),
      selectedLanguage:  pickTiktokLanguage(a),
      objective:         TIKTOK_OBJECTIVE_LEGACY[objSdk] || '',
      adsetGoal:         TIKTOK_OPT_GOAL_LEGACY[ogSdk] || '',
      event:             a.optimization_event || '',
      pixel:             pickPixel(a, 'tiktok'),
      dailyBudget:       Number(a.budget ?? c.budget ?? 0) || 0,
      budgetType:        deriveTiktokBudgetType(c, a),
      bidStrategy:       TIKTOK_BID_LEGACY[bidSdk] || 'highest_volume',
      bidAmount:         a.bid_price ?? '',
      adType:            TIKTOK_AD_FORMAT_LEGACY[adFmtSdk] || 'SINGLE',
      lalInclude: [], customInclude: [], lalExclude: [], customExclude: [],
      ageMin: '', ageMax: '', gender: 'All',
    };
  }

  // Meta（默认）
  const objSdk = c.objective || '';
  const ogSdk = a.optimization_goal || '';
  const bidSdk = a.bid_strategy || c.bid_strategy || '';
  const adFmtSdk = ad.ad_format || '';
  return {
    selectedLocations: pickMetaLocations(a),
    selectedLanguage:  pickMetaLanguage(a),
    objective:         META_OBJECTIVE_LEGACY[objSdk] || '',
    adsetGoal:         META_OPT_GOAL_LEGACY[ogSdk] || '',
    event:             pickMetaEvent(a),
    pixel:             pickPixel(a, 'meta'),
    dailyBudget:       Number(a.daily_budget ?? c.daily_budget ?? 0) || 0,
    budgetType:        deriveMetaBudgetType(c, a),
    bidStrategy:       META_BID_LEGACY[bidSdk] || 'highest_volume',
    bidAmount:         a.bid_amount ?? '',
    adType:            META_AD_FORMAT_LEGACY[adFmtSdk] || 'FLEXIBLE',
    lalInclude: [], customInclude: [], lalExclude: [], customExclude: [],
    ageMin: a.age_min ?? '', ageMax: a.age_max ?? '', gender: 'All',
  };
}

/**
 * Phase 2.I：从 adset.promoted_object.pixel_id 派生 {value,label}。
 * 用于 AdsetDetailPanel 的 globalPixel 默认（per-adset override 优先）。
 */
export function pickPixel(adsetData, channel) {
  const po = adsetData?.promoted_object;
  const pixelId = (po && typeof po === 'object') ? po.pixel_id : null;
  if (!pixelId) return null;
  const pool = channel === 'tiktok' ? TIKTOK_PIXELS : META_PIXELS;
  const px = pool.find(p => p.value === pixelId);
  return px ? { value: px.value, label: px.label } : { value: pixelId, label: pixelId };
}

// ─── 反向写入 helpers（PlanView onChange → setFormData）─────

/** budgetType 'CBO'|'ABO' → 写到对应层级。CBO 写 campaign 预算字段；ABO 写 adset 预算字段 */
export function writeBudgetType(setFormData, channelId, nextType) {
  setFormData(prev => {
    const next = { ...prev, campaign: { ...(prev.campaign || {}) }, adset: { ...(prev.adset || {}) } };
    // 切到 CBO：把 adset 预算清空（避免 CBO/ABO 互斥冲突）
    // 切到 ABO：把 campaign 预算清空
    if (channelId === 'tiktok') {
      if (nextType === 'CBO') {
        next.campaign.budget_optimize_on = true;
        delete next.adset.budget;
      } else {
        next.campaign.budget_optimize_on = false;
        delete next.campaign.budget;
      }
    } else {
      if (nextType === 'CBO') {
        delete next.adset.daily_budget;
        delete next.adset.lifetime_budget;
      } else {
        delete next.campaign.daily_budget;
        delete next.campaign.lifetime_budget;
      }
    }
    return next;
  });
}

/** 写日预算到正确层级 */
export function writeBudget(setFormData, channelId, budgetType, value) {
  const num = Number(value) || 0;
  setFormData(prev => {
    const next = { ...prev, campaign: { ...(prev.campaign || {}) }, adset: { ...(prev.adset || {}) } };
    if (channelId === 'tiktok') {
      if (budgetType === 'CBO') {
        next.campaign.budget = num;
      } else {
        next.adset.budget = num;
      }
    } else {
      if (budgetType === 'CBO') {
        next.campaign.daily_budget = num;
      } else {
        next.adset.daily_budget = num;
      }
    }
    return next;
  });
}

/** PlanView 改 objective(legacy) → 写 campaign.objective(sdk) */
export function writeObjective(setFormData, channelId, legacyValue) {
  const sdk = channelId === 'tiktok'
    ? LEGACY_TO_TIKTOK_OBJECTIVE[legacyValue]
    : LEGACY_TO_META_OBJECTIVE[legacyValue];
  setFormData(prev => ({
    ...prev,
    campaign: {
      ...(prev.campaign || {}),
      [channelId === 'tiktok' ? 'objective_type' : 'objective']: sdk || legacyValue,
    },
  }));
}

/** PlanView 改 optimization_goal(legacy) → 写 adset.optimization_goal(sdk) */
export function writeOptGoal(setFormData, channelId, legacyValue) {
  const sdk = channelId === 'tiktok'
    ? LEGACY_TO_TIKTOK_OPT_GOAL[legacyValue]
    : LEGACY_TO_META_OPT_GOAL[legacyValue];
  setFormData(prev => ({
    ...prev,
    adset: { ...(prev.adset || {}), optimization_goal: sdk || legacyValue },
  }));
}

/** PlanView 改 bid_strategy(legacy) → 写 adset.(bid_strategy|bid_type) */
export function writeBidStrategy(setFormData, channelId, legacyValue) {
  const sdk = channelId === 'tiktok'
    ? LEGACY_TO_TIKTOK_BID[legacyValue]
    : LEGACY_TO_META_BID[legacyValue];
  setFormData(prev => ({
    ...prev,
    adset: {
      ...(prev.adset || {}),
      [channelId === 'tiktok' ? 'bid_type' : 'bid_strategy']: sdk || legacyValue,
    },
  }));
}

/** PlanView 改 bidAmount → 写 adset.(bid_amount|bid_price) */
export function writeBidAmount(setFormData, channelId, value) {
  const num = value === '' || value === null || value === undefined ? '' : Number(value);
  setFormData(prev => ({
    ...prev,
    adset: {
      ...(prev.adset || {}),
      [channelId === 'tiktok' ? 'bid_price' : 'bid_amount']: num,
    },
  }));
}

/** PlanView 改 adType(legacy SINGLE/CAROUSEL/FLEXIBLE) → 写 ad.ad_format(sdk) */
export function writeAdType(setFormData, channelId, legacyValue) {
  const sdk = channelId === 'tiktok'
    ? LEGACY_TO_TIKTOK_AD_FORMAT[legacyValue]
    : LEGACY_TO_META_AD_FORMAT[legacyValue];
  setFormData(prev => ({
    ...prev,
    ad: { ...(prev.ad || {}), ad_format: sdk || legacyValue },
  }));
}

/** PlanView 改 selectedLocations（[{code,name}]）→ 写 SDK 字段 */
export function writeLocations(setFormData, channelId, locations) {
  setFormData(prev => {
    const next = { ...prev, adset: { ...(prev.adset || {}) } };
    if (channelId === 'tiktok') {
      next.adset.location_ids = (locations || []).map(l => l.code || l.id || l);
    } else {
      const codes = (locations || []).map(l => l.code || l);
      next.adset.geo_locations = { ...(next.adset.geo_locations || {}), countries: codes };
    }
    return next;
  });
}

/** PlanView 改 selectedLanguage（{code,name}|null）→ 写 SDK 字段 */
export function writeLanguage(setFormData, channelId, lang) {
  setFormData(prev => {
    const next = { ...prev, adset: { ...(prev.adset || {}) } };
    const codes = lang ? [lang.code || lang] : [];
    if (channelId === 'tiktok') {
      next.adset.languages = codes;
    } else {
      next.adset.locales = codes;
    }
    return next;
  });
}

/** PlanView 改 event（标准事件名）→ 写 adset.promoted_object.custom_event_type 或 optimization_event */
export function writeEvent(setFormData, channelId, eventName) {
  setFormData(prev => {
    const next = { ...prev, adset: { ...(prev.adset || {}) } };
    if (channelId === 'tiktok') {
      next.adset.optimization_event = eventName;
    } else {
      const po = next.adset.promoted_object || {};
      next.adset.promoted_object = { ...po, custom_event_type: eventName };
    }
    return next;
  });
}

// ─── 内部 picker（保留 Phase 2.A 行为） ─────
function pickMetaLocations(adset) {
  const geo = adset?.geo_locations;
  if (!geo) return [];
  if (Array.isArray(geo.countries)) return geo.countries.map(code => ({ code, name: code }));
  return [];
}
function pickMetaLanguage(adset) {
  const locales = adset?.locales;
  if (!locales || (Array.isArray(locales) && locales.length === 0)) return null;
  const first = Array.isArray(locales) ? locales[0] : locales;
  return { code: String(first), name: String(first) };
}
function pickMetaEvent(adset) {
  const po = adset?.promoted_object;
  if (!po) return '';
  if (typeof po === 'string') return po;
  return po.custom_event_type || '';
}
function deriveMetaBudgetType(campaign, adset) {
  if (campaign?.daily_budget || campaign?.lifetime_budget) return 'CBO';
  if (adset?.daily_budget || adset?.lifetime_budget) return 'ABO';
  return 'CBO';
}
function pickTiktokLocations(adgroup) {
  const ids = adgroup?.location_ids;
  if (!Array.isArray(ids)) return [];
  return ids.map(id => ({ code: String(id), name: String(id) }));
}
function pickTiktokLanguage(adgroup) {
  const lang = adgroup?.languages;
  if (!lang || (Array.isArray(lang) && lang.length === 0)) return null;
  const first = Array.isArray(lang) ? lang[0] : lang;
  return { code: String(first), name: String(first) };
}
function deriveTiktokBudgetType(campaign, adgroup) {
  if (campaign?.budget_optimize_on || campaign?.budget) return 'CBO';
  if (adgroup?.budget) return 'ABO';
  return 'ABO';
}

// 对外（提供查表给 BulkLaunchTool 内部派生用）
export const SDK_TO_LEGACY = {
  meta:   { objective: META_OBJECTIVE_LEGACY,   optGoal: META_OPT_GOAL_LEGACY,   bid: META_BID_LEGACY,   adFormat: META_AD_FORMAT_LEGACY },
  tiktok: { objective: TIKTOK_OBJECTIVE_LEGACY, optGoal: TIKTOK_OPT_GOAL_LEGACY, bid: TIKTOK_BID_LEGACY, adFormat: TIKTOK_AD_FORMAT_LEGACY },
};
