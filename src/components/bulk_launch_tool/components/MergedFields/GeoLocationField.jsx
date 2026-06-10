import React, { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import MultiSelect from '../controls/MultiSelect';
import {
  COUNTRIES, REGIONS, CITIES, ZIPS, TIKTOK_LOCATIONS,
} from '../../services/platformResources';

/**
 * Phase 2.M：投放地区合并控件 — 含「包含」+「排除」两 tab。
 * Meta：写入 formData.adset.geo_locations (include) 与 formData.adset.excluded_geo_locations (exclude)
 * TikTok：仅写入 formData.adset.location_ids（v1.3 无 excluded_location_ids，"排除" tab 禁用）
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - includeValue / excludeValue: 当前值
 *  - onChangeInclude(next) / onChangeExclude(next)
 *  - required / error / helpText
 */
const GeoLocationField = ({
  channel,
  includeValue, excludeValue,
  onChangeInclude, onChangeExclude,
  required, error, helpText,
}) => {
  const [tab, setTab] = useState('include');
  const isTikTok = channel === 'tiktok';

  // ─── Meta：geo_locations object（含 countries/regions/cities/zips 子数组）───
  const metaAllOptions = useMemo(() => {
    if (isTikTok) return [];
    const allRegions = Object.values(REGIONS).flat();
    const allCities  = Object.values(CITIES).flat();
    const allZips    = Object.values(ZIPS).flat();
    return [
      ...COUNTRIES.map(o => ({ value: `c:${o.value}`, label: `🌐 ${o.label}`, _dim: 'countries', _val: o.value })),
      ...allRegions.map(o => ({ value: `r:${o.value}`, label: `🗺️ ${o.label}`,  _dim: 'regions',   _val: o.value })),
      ...allCities.map(o  => ({ value: `t:${o.value}`, label: `🏙️ ${o.label}`,  _dim: 'cities',    _val: o.value })),
      ...allZips.map(o    => ({ value: `z:${o.value}`, label: `📮 ${o.label}`,  _dim: 'zips',      _val: o.value })),
    ];
  }, [isTikTok]);

  const metaSelectedKeys = (geoVal) => {
    const out = [];
    const v = geoVal || {};
    (v.countries || []).forEach(c => out.push(`c:${c}`));
    (v.regions   || []).forEach(c => out.push(`r:${c}`));
    (v.cities    || []).forEach(c => out.push(`t:${c}`));
    (v.zips      || []).forEach(c => out.push(`z:${c}`));
    return out;
  };

  const metaKeysToBuckets = (keys, originalGeo) => {
    const buckets = { countries: [], regions: [], cities: [], zips: [] };
    keys.forEach(key => {
      const [prefix, ...rest] = String(key).split(':');
      const val = rest.join(':');
      if (prefix === 'c') buckets.countries.push(val);
      else if (prefix === 'r') buckets.regions.push(val);
      else if (prefix === 't') buckets.cities.push(val);
      else if (prefix === 'z') buckets.zips.push(val);
    });
    return { ...(originalGeo || {}), ...buckets };
  };

  // ─── 渲染 ───
  const includeCount = isTikTok
    ? (Array.isArray(includeValue) ? includeValue.length : 0)
    : metaSelectedKeys(includeValue).length;
  const excludeCount = isTikTok
    ? 0
    : metaSelectedKeys(excludeValue).length;

  return (
    <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-3">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-gray-700">
          投放地区
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {helpText && <span title={helpText} className="text-gray-300 cursor-help"><Info size={11} /></span>}
      </div>

      {/* Include / Exclude Tabs */}
      <div className="inline-flex p-0.5 bg-gray-100/80 rounded-base border border-gray-100 self-start">
        <button
          type="button"
          onClick={() => setTab('include')}
          className={`px-3 py-1 rounded-base text-[11px] font-semibold transition-all ${
            tab === 'include' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          包含 {includeCount > 0 && <span className="ml-1 text-[10px] opacity-70">{includeCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => !isTikTok && setTab('exclude')}
          disabled={isTikTok}
          title={isTikTok ? 'TikTok 不支持地区排除（可在受众层做排除）' : undefined}
          className={`px-3 py-1 rounded-base text-[11px] font-semibold transition-all ${
            tab === 'exclude' && !isTikTok ? 'bg-white text-rose-600 shadow-sm' :
            isTikTok ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          排除 {excludeCount > 0 && <span className="ml-1 text-[10px] opacity-70">{excludeCount}</span>}
        </button>
      </div>

      {/* Selector */}
      {isTikTok ? (
        <MultiSelect
          value={Array.isArray(includeValue) ? includeValue : []}
          onChange={onChangeInclude}
          options={TIKTOK_LOCATIONS}
          placeholder="搜索地区..."
          error={error}
        />
      ) : (
        <MultiSelect
          value={tab === 'include' ? metaSelectedKeys(includeValue) : metaSelectedKeys(excludeValue)}
          onChange={(nextKeys) => {
            const merged = metaKeysToBuckets(nextKeys, tab === 'include' ? includeValue : excludeValue);
            if (tab === 'include') onChangeInclude?.(merged);
            else onChangeExclude?.(merged);
          }}
          options={metaAllOptions}
          placeholder={tab === 'include' ? '搜索国家 / 省 / 市 / 邮编...' : '搜索要排除的地区...'}
          error={error}
        />
      )}

      {isTikTok && (
        <p className="text-[10px] text-gray-400 italic">
          TikTok 不支持地区排除；如需排除受众，请在「自定义受众-排除」字段配置。
        </p>
      )}

      <span className="text-[10px] text-gray-300 font-mono truncate">
        {isTikTok ? 'adgroup.location_ids' : 'adset.targeting.geo_locations / excluded_geo_locations'}
      </span>
      {error && <span className="text-[11px] text-rose-500">{error}</span>}
    </div>
  );
};

export default GeoLocationField;
