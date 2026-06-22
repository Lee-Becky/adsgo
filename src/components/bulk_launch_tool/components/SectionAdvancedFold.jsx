import React, { useMemo, useState } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { getAdvancedFieldDefs, evaluateDependsOn } from '../fieldDefinitions';

/**
 * Phase 2.J：每个 Section（CampaignSection / AdSetSection / AdSection）内部使用的高级设置折叠卡。
 * 取代 Phase 2.E 的 UnifiedAdvancedSettings——按"局部性原则"把高级字段就近放在所属层级下方。
 *
 * Props:
 *  - channel:      'meta' | 'tiktok'
 *  - level:        'campaign' | 'adset' | 'ad'
 *  - rootFormData: 全局 formData（跨 level dependsOn）
 *  - onFieldChange: (name, value) => void  写回 levelFormData[name]
 *  - defaultOpen?:  布尔，默认 false（折叠收起）
 */
const SectionAdvancedFold = ({ channel, level, rootFormData, onFieldChange, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const defs = useMemo(
    () => (channel ? getAdvancedFieldDefs(channel, level, rootFormData) : []),
    [channel, level, rootFormData]
  );
  const levelFormData = (rootFormData || {})[level] || {};
  const visibleDefs = useMemo(
    () => defs.filter(d => evaluateDependsOn(d, levelFormData, rootFormData)),
    [defs, levelFormData, rootFormData]
  );

  if (!channel || visibleDefs.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden mt-5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50/40 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0">
          <Settings2 size={14} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h4 className="text-sm font-semibold text-neutral-800 leading-tight">高级设置</h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            可选 <span className="font-semibold text-neutral-700">{visibleDefs.length}</span> 项 · 默认收起，按需展开调整
          </p>
        </div>
        <ChevronDown size={14} className={`text-neutral-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-5 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 bg-neutral-50/30">
          {visibleDefs.map(def => (
            <DynamicFieldRenderer
              key={def.name}
              def={def}
              value={levelFormData[def.name]}
              onChange={(next) => onFieldChange?.(def.name, next)}
              levelFormData={levelFormData}
              rootFormData={rootFormData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionAdvancedFold;
