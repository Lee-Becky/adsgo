import metaCampaignFields    from './metaCampaignFields';
import metaAdsetFields       from './metaAdsetFields';
import metaAdFields          from './metaAdFields';
import tiktokCampaignFields  from './tiktokCampaignFields';
import tiktokAdgroupFields   from './tiktokAdgroupFields';
import tiktokAdFields        from './tiktokAdFields';

const REGISTRY = {
  meta:   { campaign: metaCampaignFields,   adset: metaAdsetFields,    ad: metaAdFields    },
  tiktok: { campaign: tiktokCampaignFields, adset: tiktokAdgroupFields, ad: tiktokAdFields },
};

/**
 * Phase 2.F：核心字段重定义（用户清单）。
 *
 * Campaign：名称 / 推广目标 / 特殊广告类别 / 特殊类别投放国家 / 购买类型 / 出价策略 / 预算（合并）
 * AdSet：名称 / 转化位置 / 优化目标 / promoted_object（条件子字段）/ 多目录组合（条件）/ 多 app（条件）
 *        / 地区 / 语言 / 年龄 / 性别 / 兴趣 / 包含/排除受众
 * Ad：名称 / 广告格式 / CTA / 标题 / 文案
 */
const CORE_FIELDS = {
  meta: {
    campaign: [
      'name', 'objective',
      'special_ad_categories', 'special_ad_category_country',
      'buying_type', 'bid_strategy',
      'daily_budget', 'lifetime_budget',     // 由 BudgetField 合并渲染
    ],
    adset: [
      'name', 'destination_type', 'optimization_goal',
      'promoted_object',
      'product_set_id', 'application_id',     // 被 CatalogCombos / AppList 吞，但保留必填条件链
      'geo_locations', 'locales',
      'age_min', 'age_max', 'genders',
      'interests', 'custom_audiences', 'excluded_custom_audiences',
      'daily_budget', 'lifetime_budget',
    ],
    ad: [
      'name', 'ad_format', 'call_to_action_type', 'title', 'body',
    ],
  },
  tiktok: {
    campaign: [
      'campaign_name', 'objective_type', 'special_industries',
      'budget', 'budget_optimize_on',
    ],
    adset: [
      'adgroup_name', 'promotion_type', 'app_id',
      'optimization_goal', 'optimization_event', 'pixel_id',
      'budget',
      'location_ids', 'languages',
      'age_groups', 'gender',
      'audience_ids', 'excluded_audience_ids',
      'interest_keyword_ids', 'interest_category_ids',
    ],
    ad: [
      'ad_name', 'ad_format', 'call_to_action', 'ad_text',
    ],
  },
};

/**
 * Phase 2.F：被前端合并控件吞掉的字段（schema 保留，UI 不渲染原字段）。
 *  - AgeRangeField        吞 Meta age_min / age_max
 *  - LocationSearchField  吞 Meta geo_locations / TikTok location_ids
 *  - AudienceTagsField    吞 Meta 8 个标签字段 / TikTok 2 个兴趣字段
 *  - BudgetField          吞 Meta+TikTok daily_budget / lifetime_budget / budget
 *  - CatalogCombosField   吞 Meta product_set_id（DPA 时多组合）
 *  - AppListField         吞 Meta application_id / TikTok app_id（多 app 选择）
 */
const HIDE_IN_UI = {
  meta: {
    campaign: ['daily_budget', 'lifetime_budget'],
    adset: [
      'age_min', 'age_max',
      'geo_locations',
      'interests', 'behaviors', 'family_statuses', 'life_events',
      'industries', 'education_statuses', 'income', 'relationship_statuses',
      'daily_budget', 'lifetime_budget',
      'product_set_id', 'application_id',
    ],
  },
  tiktok: {
    campaign: ['budget'],
    adset: [
      'location_ids',
      'interest_keyword_ids', 'interest_category_ids',
      'budget',
      'app_id',
    ],
  },
};

/**
 * 字段是否"当前必填"（含 required + requiredWhen 触发）
 */
function isFieldCurrentlyRequired(def, rootFormData) {
  if (def.required) return true;
  if (typeof def.requiredWhen === 'function') {
    const lvlData = rootFormData?.[def.level] || {};
    return !!def.requiredWhen(lvlData[def.name], rootFormData);
  }
  return false;
}

/**
 * Phase 2.H K3：默认值兜底 — 切渠道 / pruneAllLevels 后某些必填字段被清空，自动补默认。
 */
const DEFAULT_VALUES = {
  meta: {
    campaign: { special_ad_categories: ['NONE'] },
  },
  tiktok: {},
};

export function getDefaultLevelValues(channel, level) {
  return DEFAULT_VALUES[channel]?.[level] || {};
}

/**
 * Phase 2.M：核心字段白名单（按用户原话精确定义）
 * 不在白名单内的字段，getFieldDefs 派生时其 group 强制改写为 'advanced'，
 * GroupedFieldsRenderer 自动把它们集中到底部「高级设置」卡片。
 */
const CORE_FIELDS_V2 = {
  meta: {
    campaign: [
      'name', 'buying_type', 'objective',
      'daily_budget', 'lifetime_budget',
      'bid_strategy',
      'start_time', 'stop_time',
      'special_ad_categories', 'special_ad_category_country',
      'dsa_beneficiary', 'dsa_payor',
    ],
    adset: [
      'name', 'destination_type', 'optimization_goal',
      'promoted_object',
      'bid_amount',
      // 受众
      'advantage_audience',
      'geo_locations',  // GeoLocationField 接管（hideInUi）但仍属 core 概念
      'locales',
      'age_min', 'age_max',
      'genders',
      'interests', 'behaviors', 'family_statuses', 'life_events',
      'industries', 'education_statuses', 'income', 'relationship_statuses',
      'custom_audiences', 'excluded_custom_audiences',
      // 版位
      'publisher_platforms',
      'facebook_positions', 'instagram_positions', 'audience_network_positions', 'messenger_positions',
      'threads_positions', 'whatsapp_positions',
      'device_platforms', 'user_os', 'user_device',
      // 归因
      'attribution_spec',
    ],
    ad: [
      'name', 'ad_format',
      'page_id', 'instagram_user_id',
      'url_tags',
    ],
  },
  tiktok: {
    campaign: [
      'campaign_name', 'campaign_type', 'objective_type',
      'budget_mode', 'budget', 'budget_optimize_on',
      'bid_type',
      'special_industries',
    ],
    adset: [  // TikTok adgroup 在 schema 中 level='adset'
      'adgroup_name', 'promotion_type',
      'optimization_goal', 'optimization_event',
      'pixel_id',
      'bid_price',
      // 受众
      'targeting_expansion',
      'location_ids',
      'languages',
      'age_groups', 'gender',
      'interest_keyword_ids', 'interest_category_ids',
      'audience_ids', 'excluded_audience_ids',
      // 版位 + 设备
      'placement_type', 'placements', 'tiktok_subplacements',
      'device_price_ranges', 'operating_systems', 'min_android_version', 'min_ios_version',
      'device_model_ids', 'network_types', 'isp_ids', 'carrier_ids',
      // 归因
      'event_attribution_window',
      // 排期
      'schedule_type', 'schedule_start_time', 'schedule_end_time', 'dayparting',
    ],
    ad: [
      'ad_name', 'ad_format',
      'identity_id', 'identity_type', 'identity_authorized_bc_id',
      'click_tracking_url',
    ],
  },
};

export function isFieldCore(channel, level, fieldName) {
  return (CORE_FIELDS_V2[channel]?.[level] || []).includes(fieldName);
}

/**
 * @param {'meta'|'tiktok'} channel
 * @param {'campaign'|'adset'|'ad'} level
 * @returns {import('./schema').FieldDef[]}
 */
export function getFieldDefs(channel, level) {
  if (!channel || !level) return [];
  const raw = REGISTRY[channel]?.[level] || [];
  const coreSet = new Set(CORE_FIELDS[channel]?.[level] || []);
  const hideSet = new Set(HIDE_IN_UI[channel]?.[level] || []);
  const coreV2Set = new Set(CORE_FIELDS_V2[channel]?.[level] || []);
  return raw.map(d => {
    const baseHidden = d.hideInUi !== undefined ? d.hideInUi : hideSet.has(d.name);
    // Phase 2.K：'targeting' 旧 group 名映射为 'audience'（向后兼容）
    const baseGroup = d.group === 'targeting' ? 'audience' : d.group;
    // Phase 2.M：非 V2 core 字段统一压入 advanced 组
    const finalGroup = coreV2Set.has(d.name) ? baseGroup : 'advanced';
    return {
      ...d,
      group: finalGroup,
      coreField: d.coreField !== undefined ? d.coreField : coreSet.has(d.name),
      // Phase 2.I: excludeFromCreate（创建态噪音字段）叠到 hideInUi
      hideInUi: baseHidden || !!d.excludeFromCreate,
    };
  });
}

/**
 * 派生：核心字段（含 hideInUi 排除 + 必填动态升级）。
 * @param {object} [rootFormData]  传入则启用必填动态升级（requiredWhen 触发的字段也归为核心）
 */
export function getCoreFieldDefs(channel, level, rootFormData) {
  return getFieldDefs(channel, level).filter(d => {
    if (d.hideInUi) return false;
    if (d.coreField) return true;
    if (rootFormData && isFieldCurrentlyRequired(d, rootFormData)) return true;
    return false;
  });
}

/** 派生：高级（非核心、非合并隐藏）字段。需排除"运行时已升为核心"的字段。 */
export function getAdvancedFieldDefs(channel, level, rootFormData) {
  const coreSet = new Set(getCoreFieldDefs(channel, level, rootFormData).map(d => d.name));
  return getFieldDefs(channel, level).filter(d =>
    !d.hideInUi && !coreSet.has(d.name)
  );
}

export {
  metaCampaignFields, metaAdsetFields, metaAdFields,
  tiktokCampaignFields, tiktokAdgroupFields, tiktokAdFields,
  CORE_FIELDS, HIDE_IN_UI,
  CORE_FIELDS_V2,
};

export * from './schema';
export { GROUP_META, ACCENT, getGroupMeta } from './groupMeta';
