import React from 'react';
import { Info } from 'lucide-react';
import NumberInput from '../controls/NumberInput';

/**
 * 年龄合并：把 age_min + age_max 合并成一行 [13][~][65] 岁，单一交互单元。
 * Props:
 *  - ageMin / ageMax: number
 *  - onChangeMin / onChangeMax: (v) => void
 *  - errorMin / errorMax?: string
 *  - required?: boolean
 */
const AgeRangeField = ({
  ageMin, ageMax, onChangeMin, onChangeMax, errorMin, errorMax, required, helpText,
}) => {
  const error = errorMin || errorMax;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-gray-700">
          年龄
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {helpText && (
          <span title={helpText} className="text-gray-300 cursor-help">
            <Info size={11} />
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <NumberInput value={ageMin ?? ''} onChange={onChangeMin}
            placeholder="13" min={13} max={65} error={errorMin} />
        </div>
        <span className="text-xs text-gray-400">—</span>
        <div className="flex-1">
          <NumberInput value={ageMax ?? ''} onChange={onChangeMax}
            placeholder="65" min={13} max={65} error={errorMax} />
        </div>
        <span className="text-xs text-gray-400 shrink-0">岁</span>
      </div>
      <span className="text-[10px] text-gray-300 font-mono truncate">adset.targeting.age_min / age_max</span>
      {error && <span className="text-[11px] text-rose-500">{error}</span>}
    </div>
  );
};

export default AgeRangeField;
