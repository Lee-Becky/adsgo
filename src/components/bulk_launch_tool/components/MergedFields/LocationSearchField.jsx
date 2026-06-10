import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import MultiSelect from '../controls/MultiSelect';
import {
  COUNTRIES, REGIONS, CITIES, ZIPS, TIKTOK_LOCATIONS,
} from '../../services/platformResources';

/**
 * 投放地区合并：单一搜索框 + chip，跨 国家/省/市/邮编 4 维度。
 * 写入：分流到 geo_locations.{countries|regions|cities|zips} 数组（保留 SDK 字段结构）。
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - value: object | array  Meta：{countries:[], regions:[], cities:[], zips:[], ...}；TikTok：location_ids 数组
 *  - onChange: (next) => void  写回顶层（Meta 写整个 geo_locations 对象，TikTok 写 location_ids 数组）
 *  - required / error / helpText
 */
const LocationSearchField = ({ channel, value, onChange, required, error, helpText }) => {
  if (channel === 'tiktok') {
    // TikTok：location_ids 已是单一字段，直接渲染 MultiSelect
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-gray-700">
            投放地区
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
          {helpText && <span title={helpText} className="text-gray-300 cursor-help"><Info size={11} /></span>}
        </div>
        <MultiSelect
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          options={TIKTOK_LOCATIONS}
          placeholder="搜索地区..."
          error={error}
        />
        <span className="text-[10px] text-gray-300 font-mono truncate">adgroup.location_ids</span>
        {error && <span className="text-[11px] text-rose-500">{error}</span>}
      </div>
    );
  }

  // Meta：geo_locations 是 object，含 countries/regions/cities/zips 子数组
  const allOptions = useMemo(() => {
    const allRegions = Object.values(REGIONS).flat();
    const allCities = Object.values(CITIES).flat();
    const allZips = Object.values(ZIPS).flat();
    return [
      ...COUNTRIES.map(o => ({ value: `c:${o.value}`, label: `🌐 ${o.label}`, _dim: 'countries', _val: o.value })),
      ...allRegions.map(o => ({ value: `r:${o.value}`, label: `🗺️ ${o.label}`,  _dim: 'regions',   _val: o.value })),
      ...allCities.map(o => ({ value: `t:${o.value}`,  label: `🏙️ ${o.label}`,  _dim: 'cities',    _val: o.value })),
      ...allZips.map(o => ({ value: `z:${o.value}`,    label: `📮 ${o.label}`,  _dim: 'zips',      _val: o.value })),
    ];
  }, []);

  const selected = useMemo(() => {
    const out = [];
    const v = value || {};
    (v.countries || []).forEach(c => out.push(`c:${c}`));
    (v.regions   || []).forEach(c => out.push(`r:${c}`));
    (v.cities    || []).forEach(c => out.push(`t:${c}`));
    (v.zips      || []).forEach(c => out.push(`z:${c}`));
    return out;
  }, [value]);

  const handleChange = (nextSelectedKeys) => {
    const buckets = { countries: [], regions: [], cities: [], zips: [] };
    nextSelectedKeys.forEach(key => {
      const [prefix, ...rest] = String(key).split(':');
      const val = rest.join(':');
      switch (prefix) {
        case 'c': buckets.countries.push(val); break;
        case 'r': buckets.regions.push(val);   break;
        case 't': buckets.cities.push(val);    break;
        case 'z': buckets.zips.push(val);      break;
        default: break;
      }
    });
    // 保留其它子字段（location_types / custom_locations / geo_markets / electoral_districts）
    onChange({ ...(value || {}), ...buckets });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-gray-700">
          投放地区
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {helpText && <span title={helpText} className="text-gray-300 cursor-help"><Info size={11} /></span>}
      </div>
      <MultiSelect
        value={selected}
        onChange={handleChange}
        options={allOptions}
        placeholder="搜索国家 / 省 / 市 / 邮编..."
        error={error}
      />
      <span className="text-[10px] text-gray-300 font-mono truncate">adset.targeting.geo_locations.[countries|regions|cities|zips]</span>
      {error && <span className="text-[11px] text-rose-500">{error}</span>}
    </div>
  );
};

export default LocationSearchField;
