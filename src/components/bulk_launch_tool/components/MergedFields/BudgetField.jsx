import React from 'react';
import { Info } from 'lucide-react';
import NumberInput from '../controls/NumberInput';

/**
 * 预算合并：上方 segmented [日预算 | 总预算]，下方数字输入。
 * 切换时清空另一字段，保证 SDK 互斥。
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - level: 'campaign' | 'adset'
 *  - value: { daily_budget, lifetime_budget }（Meta）/ { budget }（TikTok）
 *  - onSetField: (fieldName, value) => void
 *  - required?: boolean
 *  - error?: string
 */
const BudgetField = ({ channel, level, value, onSetField, required, helpText }) => {
  const isMeta = channel === 'meta';
  // Meta：分日 / 总；TikTok：单 budget 字段（顶层不分日/总，由 budget_mode 决定）
  // 这里 TikTok 也保留 segmented，但写入同一字段 budget
  const dailyVal    = isMeta ? value?.daily_budget    : value?.budget;
  const lifetimeVal = isMeta ? value?.lifetime_budget : null;

  // 切换 budget mode：日 / 总
  const mode = lifetimeVal ? 'lifetime' : 'daily';
  const handleSwitch = (next) => {
    if (next === mode) return;
    if (isMeta) {
      if (next === 'daily') {
        onSetField('lifetime_budget', undefined);
      } else {
        onSetField('daily_budget', undefined);
      }
    }
    // TikTok 仅一个字段，不需要清
  };
  const currentVal = mode === 'daily' ? dailyVal : lifetimeVal;
  const handleChange = (v) => {
    if (isMeta) {
      onSetField(mode === 'daily' ? 'daily_budget' : 'lifetime_budget', v);
    } else {
      onSetField('budget', v);
    }
  };

  const levelLabel = level === 'campaign' ? '系列' : '广告组';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-neutral-700">
          {levelLabel}预算
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {helpText && <span title={helpText} className="text-neutral-300 cursor-help"><Info size={11} /></span>}
      </div>
      <div className="flex items-center gap-2">
        {isMeta && (
          <div className="inline-flex p-0.5 bg-neutral-100 rounded-base shrink-0">
            {[
              { id: 'daily',    label: '日预算' },
              { id: 'lifetime', label: '总预算' },
            ].map(opt => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSwitch(opt.id)}
                  className={[
                    'px-3 h-9 rounded-base text-xs font-medium transition-all',
                    active ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
        <div className="flex-1">
          <NumberInput
            value={currentVal ?? ''}
            onChange={handleChange}
            placeholder="0"
            prefix="$"
            min={1}
          />
        </div>
      </div>
      <span className="text-[10px] text-neutral-300 font-mono truncate">
        {isMeta ? `${level}.${mode === 'daily' ? 'daily_budget' : 'lifetime_budget'}` : 'campaign.budget'}
      </span>
    </div>
  );
};

export default BudgetField;
