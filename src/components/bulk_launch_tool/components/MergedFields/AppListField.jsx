import React from 'react';
import { Info } from 'lucide-react';
import MultiSelect from '../controls/MultiSelect';
import { META_APPS, TIKTOK_APPS } from '../../services/platformResources';

/**
 * 多应用：用户可选多个 app；架构图按 app 数倍增 adsets（1 app → 1 adset）。
 *
 * 数据形态：value = ['app_id_1', 'app_id_2', ...]
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - value / onChange / required
 */
const AppListField = ({ channel, value, onChange, required }) => {
  const opts = channel === 'tiktok' ? TIKTOK_APPS : META_APPS;
  return (
    <div className="flex flex-col gap-1.5 col-span-full">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-gray-700">
          推广应用（可多选）
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <span title="每个应用将生成 1 个 AdSet。" className="text-gray-300 cursor-help"><Info size={11} /></span>
      </div>
      <MultiSelect
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        options={opts}
        placeholder="选择推广的应用..."
      />
      <span className="text-[10px] text-gray-300 font-mono truncate">_app_list · 派生 → adsets</span>
    </div>
  );
};

export default AppListField;
