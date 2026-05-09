/**
 * Bulk Launch Tool - Field Definition Schema
 *
 * 描述 Meta Marketing API v25 与 TikTok Business API v1.3 创建/更新接口的可写字段。
 *
 * ⚠ Phase 2.L 规范：禁止为新字段使用 type:'json'。raw JSON textarea 用户无法填写、不可用。
 *   - 如果字段是结构化 object → 用 type:'composite' + subFields（每个子字段是 select / multiselect / number / switch / date 等具体类型）
 *   - 如果字段是 enum / 资源 ID → 用 type:'select' / type:'multiselect' 配 platformResources 选项
 *   - 如果 Meta Ads Manager / TikTok Ads Manager UI 不暴露 → 标 excludeFromCreate: true
 *
 * @typedef {Object} FieldDefOption
 * @property {string|number|boolean} value
 * @property {string} label
 * @property {string} [description]
 * @property {{ field: string, level?: string, equals?: any, in?: any[],
 *             predicate?: (value: any, root: any) => boolean }} [dependsOn]
 *
 * @typedef {Object} FieldDef
 * @property {string} name              字段在 formData[level] 中的 key（建议与 SDK 字段同名）
 * @property {string} label             业务化中文 label
 * @property {string} sdkPath           SDK 字段路径，如 'campaign.special_ad_categories'
 * @property {'campaign'|'adset'|'ad'} level
 * @property {'meta'|'tiktok'} channel
 * @property {('text'|'textarea'|'number'|'currency'|'percent'|'select'|'multiselect'
 *           |'tags'|'date'|'datetime'|'switch'|'json'|'composite'|'url')} type
 *           ⚠ 'json' 已 DEPRECATED — 仅保留旧 saved structures 兼容；不允许新字段使用。
 * @property {boolean} [required]                       基础必填
 * @property {(value: any, root: any) => boolean} [requiredWhen]   条件必填（动态 required）
 * @property {boolean} [excludeFromCreate]              Phase 2.I/2.L：UI 不渲染此字段（创建态噪音）；schema 保留兼容
 * @property {boolean} [hideInUi]                       UI 不渲染（被合并控件吞或 subField 隐藏）
 * @property {FieldDefOption[]} [options]
 * @property {{ min?: number, max?: number, step?: number, pattern?: string,
 *             custom?: (value: any, root: any) => string|null }} [validation]
 * @property {{ field: string, level?: string, equals?: any, in?: any[],
 *             predicate?: (value: any, root: any) => boolean }} [dependsOn]
 * @property {string[]} [mutuallyExclusiveWith]   同 level 互斥字段名（同时设值会校验报错）
 * @property {FieldDef[]} [subFields]             type='composite' 时使用
 * @property {('basic'|'audience'|'placement'|'bidding'|'budget'|'schedule'|'cta'|'creative'|'tracking'|'advanced'|'targeting')} group
 *           Phase 2.K 起 'targeting' alias 自动映射到 'audience'
 * @property {string} [helpText]
 * @property {string} [placeholder]
 * @property {*} [defaultValue]
 * @property {('meta-v21'|'meta-v25'|'tiktok-v1.3')} apiVersion
 * @property {string} [sdkConstantsRef]
 * @property {boolean} [comingSoon]
 * @property {string} [legacyStateKey]
 */

const GROUP_ORDER = ['basic', 'targeting', 'bidding', 'tracking', 'creative', 'schedule', 'advanced'];

const GROUP_LABELS = {
  basic:     '基础',
  targeting: '定向',
  bidding:   '出价与预算',
  tracking:  '跟踪',
  creative:  '创意',
  schedule:  '排期',
  advanced:  '高级',
};

/** 给定一组 FieldDef，按 group 分组。 */
export function groupFields(defs) {
  const groups = {};
  for (const def of defs || []) {
    const g = def.group || 'advanced';
    (groups[g] = groups[g] || []).push(def);
  }
  return groups;
}

/** 按 group 顺序返回 [groupKey, fieldDefs[]] 列表，便于 UI 渲染。 */
export function listGroupedFields(defs) {
  const grouped = groupFields(defs);
  return GROUP_ORDER
    .filter(g => grouped[g] && grouped[g].length > 0)
    .map(g => [g, grouped[g]]);
}

/**
 * 解析单个 dependsOn 子句的当前值。支持 level 跨层引用。
 * @param {{ field: string, level?: string }} cond
 * @param {{ campaign?: object, adset?: object, ad?: object }} root  根 formData
 * @param {object} [fallbackLevel]  当 cond.level 缺省时使用的 level scope
 */
function resolveRefValue(cond, root, fallbackLevel) {
  if (!cond || !cond.field) return undefined;
  const scope = cond.level
    ? (root?.[cond.level] || {})
    : (fallbackLevel || {});
  return scope[cond.field];
}

/**
 * 评估 dependsOn —— 字段当前是否应可见。
 * @param {FieldDef|FieldDefOption} def
 * @param {object} levelFormData    当前 level 的 formData
 * @param {object} root             根 formData (含 campaign/adset/ad)
 */
export function evaluateDependsOn(def, levelFormData, root) {
  const cond = def?.dependsOn;
  if (!cond) return true;
  const refValue = resolveRefValue(cond, root, levelFormData);
  if (typeof cond.predicate === 'function') {
    return !!cond.predicate(refValue, root || levelFormData);
  }
  if (Object.prototype.hasOwnProperty.call(cond, 'equals')) return refValue === cond.equals;
  if (Array.isArray(cond.in)) return cond.in.includes(refValue);
  return true;
}

/**
 * 过滤一个 select / multiselect 字段的可见 options。
 */
export function filterVisibleOptions(def, levelFormData, root) {
  if (!def?.options) return [];
  return def.options.filter(opt =>
    !opt.dependsOn || evaluateDependsOn(opt, levelFormData, root)
  );
}

/**
 * 单字段校验。返回 null 表示通过。
 * 支持：基础 required / requiredWhen / mutuallyExclusiveWith / min/max/pattern / custom
 */
export function validateField(def, value, levelFormData, root) {
  if (!def) return null;
  const v = def.validation || {};

  // 空值判定：原始空 + composite 空对象（所有子字段也为空）
  const isPrimitiveEmpty = value === undefined || value === null || value === ''
    || (Array.isArray(value) && value.length === 0);
  const isCompositeEmpty = !isPrimitiveEmpty
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.values(value).every(sub =>
      sub === undefined || sub === null || sub === ''
      || (Array.isArray(sub) && sub.length === 0)
      || (typeof sub === 'object' && !Array.isArray(sub) && Object.keys(sub).length === 0)
    );
  const isEmpty = isPrimitiveEmpty || isCompositeEmpty;

  // 必填
  const required = def.required
    || (typeof def.requiredWhen === 'function' && def.requiredWhen(value, root || levelFormData));
  if (required && isEmpty) return `${def.label}必填`;

  // 互斥
  if (Array.isArray(def.mutuallyExclusiveWith) && !isEmpty) {
    for (const otherName of def.mutuallyExclusiveWith) {
      const otherVal = (levelFormData || {})[otherName];
      const otherSet = !(otherVal === undefined || otherVal === null || otherVal === ''
        || (Array.isArray(otherVal) && otherVal.length === 0));
      if (otherSet) return `${def.label}与${otherName}互斥，仅能设置其中之一`;
    }
  }

  // 数值范围
  if (typeof value === 'number') {
    if (v.min !== undefined && value < v.min) return `${def.label}必须 ≥ ${v.min}`;
    if (v.max !== undefined && value > v.max) return `${def.label}必须 ≤ ${v.max}`;
  }

  // 字符串格式
  if (typeof value === 'string' && v.pattern) {
    const re = new RegExp(v.pattern);
    if (value !== '' && !re.test(value)) return `${def.label}格式不正确`;
  }

  // 字符串长度（推荐用 maxLength；保留 max 兼容旧字段）
  if (typeof value === 'string') {
    if (v.maxLength !== undefined && value.length > v.maxLength) {
      return `${def.label}长度不能超过 ${v.maxLength} 字符`;
    }
    if (v.maxLength === undefined && v.max !== undefined && value.length > v.max) {
      return `${def.label}长度不能超过 ${v.max} 字符`;
    }
  }

  // 自定义
  if (typeof v.custom === 'function') {
    const r = v.custom(value, root || levelFormData);
    if (r) return r;
  }
  return null;
}

/**
 * 校验整个 level 的所有可见字段。
 */
export function validateLevel(defs, levelFormData, root) {
  const errors = {};
  for (const def of defs || []) {
    if (!evaluateDependsOn(def, levelFormData, root)) continue;
    const err = validateField(def, levelFormData?.[def.name], levelFormData, root);
    if (err) errors[def.name] = err;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * 校验全部三个 level。
 * @param {Object} root  { campaign, adset, ad }
 * @param {{ getDefs?: (level: string) => FieldDef[] }} ctx  传入按 channel 派生 defs 的 getter
 */
export function validateAllLevels(root, ctx) {
  const out = { valid: true, errors: { campaign: {}, adset: {}, ad: {} } };
  for (const level of ['campaign', 'adset', 'ad']) {
    const defs = ctx?.getDefs?.(level) || [];
    const r = validateLevel(defs, root?.[level] || {}, root);
    out.errors[level] = r.errors;
    if (!r.valid) out.valid = false;
  }
  return out;
}

export const FIELD_GROUPS = GROUP_ORDER;
export const FIELD_GROUP_LABELS = GROUP_LABELS;

/**
 * 当上游字段变更（channel / objective / destination_type 等）后，清理 formData 中
 * 当前不可见、或 select 值已不在 options 内的字段值，避免脏数据。
 *
 * @param {FieldDef[]} defs            getFieldDefs(channel, level) 返回的当前 level 定义
 * @param {object} levelFormData       当前 level 的 formData
 * @param {object} root                根 formData
 * @returns {object} 清理后的新对象（如无变化返回原对象）
 */
export function pruneStaleValues(defs, levelFormData, root) {
  if (!levelFormData) return levelFormData;
  let changed = false;
  const next = { ...levelFormData };
  for (const def of defs || []) {
    if (!evaluateDependsOn(def, next, root)) {
      // 字段当前不可见 → 清空
      if (next[def.name] !== undefined) { delete next[def.name]; changed = true; }
      continue;
    }
    // select：值不在选项中
    if (def.type === 'select' && def.options && next[def.name] !== undefined && next[def.name] !== '') {
      const visibleOpts = def.options.filter(o => !o.dependsOn || evaluateDependsOn(o, next, root));
      if (!visibleOpts.some(o => o.value === next[def.name])) {
        delete next[def.name]; changed = true;
      }
    }
    // multiselect：过滤掉不在选项中的值
    if (def.type === 'multiselect' && def.options && Array.isArray(next[def.name])) {
      const visibleVals = def.options
        .filter(o => !o.dependsOn || evaluateDependsOn(o, next, root))
        .map(o => o.value);
      const filtered = next[def.name].filter(v => visibleVals.includes(v));
      if (filtered.length !== next[def.name].length) {
        if (filtered.length === 0) delete next[def.name]; else next[def.name] = filtered;
        changed = true;
      }
    }
  }
  return changed ? next : levelFormData;
}

/**
 * 一次性 prune 三个 level。
 * @param {Object} root  { campaign, adset, ad }
 * @param {{ getDefs?: (level: string) => FieldDef[] } | ((level: string) => FieldDef[])} ctxOrFn
 *   既支持 { getDefs } 对象（与 validateAllLevels 一致），也支持直接传函数。
 */
export function pruneAllLevels(root, ctxOrFn) {
  if (!root) return root;
  const getDefs = typeof ctxOrFn === 'function'
    ? ctxOrFn
    : (ctxOrFn && ctxOrFn.getDefs);
  if (typeof getDefs !== 'function') return root;
  let next = { ...root };
  let changed = false;
  for (const level of ['campaign', 'adset', 'ad']) {
    const defs = getDefs(level) || [];
    const cleaned = pruneStaleValues(defs, next[level] || {}, next);
    if (cleaned !== (next[level] || {})) {
      next[level] = cleaned;
      changed = true;
    }
  }
  return changed ? next : root;
}
