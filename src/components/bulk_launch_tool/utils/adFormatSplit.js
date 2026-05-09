/**
 * 把素材组按 SDK 的 ad_format 枚举拆分为 ad 列表。
 *
 * - SINGLE_IMAGE / SINGLE_VIDEO（Meta + TikTok 同名）→ 每张素材 1 个 ad
 * - CAROUSEL / COLLECTION / FLEXIBLE（Meta）
 *   CAROUSEL_ADS / COLLECTION_ADS / SPARK_ADS / PLAYABLE_ADS / INSTANT_PAGE_ADS（TikTok）
 *   → 整组合并为 1 个 ad（多创意）
 * - DPA（Meta）/ CATALOG_CAROUSEL（TikTok）→ 由 CATALOG 占位流程接管，本函数返回空
 *
 * 入参：
 *   group     —— { id, name, ads: Creative[] }
 *   format    —— SDK ad_format 字符串
 *   baseId    —— 调用方拼好的稳定前缀（含时间戳 / 随机段）
 *   payload   —— { productId, groupId } 用于回写到每个 ad
 *
 * 返回 ad 列表，shape 与原 handleDropGroupToAdset 输出一致：
 *   [{ id, productId, groupId, groupName, creatives: Creative[] }]
 */
export function splitGroupByAdFormat(group, format, baseId, payload) {
  const creatives = group?.ads || [];
  if (creatives.length === 0) return [];

  const groupName = group.name;
  const meta = { productId: payload.productId, groupId: payload.groupId, groupName };

  if (format === 'DPA' || format === 'CATALOG_CAROUSEL') {
    // 动态目录广告：占位流程接管，不拆 ad
    return [];
  }

  if (isMultiCreativeFormat(format)) {
    return [{ id: `ad-${baseId}`, ...meta, creatives }];
  }

  // SINGLE_* / SPARK_ADS / PLAYABLE_ADS / INSTANT_PAGE_ADS：每张素材独立 ad
  return creatives.map((c, i) => ({
    id: `ad-${baseId}-${i}-${c.id}`,
    ...meta,
    creatives: [c],
  }));
}

/** 多创意聚合到 1 个 ad 的 format 集合（Meta + TikTok 合并） */
const MULTI_CREATIVE_FORMATS = new Set([
  // Meta
  'CAROUSEL',
  'COLLECTION',
  'FLEXIBLE',
  // TikTok
  'CAROUSEL_ADS',
  'COLLECTION_ADS',
]);

export function isMultiCreativeFormat(format) {
  return MULTI_CREATIVE_FORMATS.has(format);
}

/**
 * 解析 publish 时某 ad 实际生效的 ad_format。
 * 优先级：per-ad override > 该 adset 的 __adFormat > 全局 formData.ad.ad_format > legacy adType 兜底。
 *
 * 调用方：发布层（BulkLaunchTool publish hook 或 SDK 适配器）按 (cIdx, aIdx, adId) 一一询问。
 */
export function resolveEffectiveAdFormat({ channel, formData, nodeOverrides, adsetFlatIdx, adId, fallbackAdType }) {
  const adOverride = nodeOverrides?.ad?.[adId];
  if (adOverride && adOverride.ad_format) return adOverride.ad_format;
  const adsetOverride = nodeOverrides?.adset?.[adsetFlatIdx];
  if (adsetOverride && adsetOverride.__adFormat) return adsetOverride.__adFormat;
  const globalAdFmt = formData?.ad?.ad_format;
  if (globalAdFmt) return globalAdFmt;
  return legacyAdTypeToSdkFormat(channel, fallbackAdType);
}

/**
 * 旧的全局 adType（FLEXIBLE / CAROUSEL / SINGLE）映射到该 channel 下的默认 SDK ad_format。
 * 当一个 adset 还没设置 __adFormat override 时由 getAdFormatFor() 兜底使用。
 */
export function legacyAdTypeToSdkFormat(channel, legacyAdType) {
  if (channel === 'tiktok') {
    if (legacyAdType === 'CAROUSEL') return 'CAROUSEL_ADS';
    return 'SINGLE_VIDEO'; // SINGLE / FLEXIBLE / 缺省
  }
  // Meta
  if (legacyAdType === 'FLEXIBLE') return 'FLEXIBLE';
  if (legacyAdType === 'CAROUSEL') return 'CAROUSEL';
  return 'SINGLE_IMAGE'; // SINGLE / 缺省
}
