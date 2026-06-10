/**
 * Phase 2.G：派生 Campaign / AdSet 计划。
 *
 * 输入：
 *  - catalogCombos: [{ catalog_id, catalog_name, product_set_ids, product_set_names }, ...]
 *  - formData: { adset?: { _app_list?: string[] } }
 *  - mode: { isCatalog, isApp }
 *
 * 输出：
 *  {
 *    campaigns: [
 *      {
 *        index: number,
 *        name: string,
 *        kind: 'catalog' | 'app' | 'default',
 *        catalogId?: string,
 *        adsets: [{ index, name, productSetId?, appId? }],
 *      },
 *    ]
 *  } | null
 */

import { META_APPS, TIKTOK_APPS } from '../services/platformResources';

export function derivePlan({ catalogCombos, formData, channel, isCatalog, isApp }) {
  // 1) DPA 模式：每 catalog 1 campaign，每 product_set 1 adset
  if (isCatalog && Array.isArray(catalogCombos) && catalogCombos.length > 0) {
    return {
      campaigns: catalogCombos.map((combo, ci) => ({
        index: ci,
        name: combo.catalog_name || combo.catalog_id || `Catalog ${ci + 1}`,
        kind: 'catalog',
        catalogId: combo.catalog_id,
        adsets: (combo.product_set_ids || []).map((pid, ai) => ({
          index: ai,
          name: combo.product_set_names?.[ai] || pid,
          productSetId: pid,
        })),
      })),
    };
  }

  // 2) APP 模式（default 策略）：每 app 1 campaign，每 campaign 起 1 个占位 adset
  // adset 真实数量由 CampaignPlanView 按素材组（BY_CREATIVE）倍增；这里只确定 campaign 维度的拆分。
  if (isApp && Array.isArray(formData?.adset?._app_list) && formData.adset._app_list.length > 0) {
    const appOpts = channel === 'tiktok' ? TIKTOK_APPS : META_APPS;
    return {
      campaigns: formData.adset._app_list.map((appId, ci) => {
        const label = appOpts.find(a => a.value === appId)?.label || appId;
        return {
          index: ci,
          name: label,
          kind: 'app',
          appId,
          adsets: [{ index: 0, name: label, appId }],
        };
      }),
    };
  }

  return null;
}

/** 派生 structure（驱动 CampaignPlanView 倍增）
 *  catalog: PER_PRODUCT（adsets 由 catalog product_set 显式枚举）
 *  app:     BY_CREATIVE（每 campaign 内 adsets 按素材组倍增 — default 策略）
 */
export function deriveStructureFromPlan(plan) {
  if (!plan?.campaigns?.length) return null;
  const numCampaigns = plan.campaigns.length;
  const maxAdsets = plan.campaigns.reduce((m, c) => Math.max(m, c.adsets?.length || 1), 1);
  const kind = plan.campaigns[0]?.kind;
  if (kind === 'app') {
    return { strategy: 'BY_CREATIVE', numCampaigns };
  }
  return {
    strategy: 'PER_PRODUCT',
    numCampaigns,
    numAdsetsPerProduct: maxAdsets,
    numAdsets: maxAdsets,
  };
}
