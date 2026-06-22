import React, { useMemo, useState } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { getAdvancedFieldDefs, evaluateDependsOn } from '../fieldDefinitions';

/**
 * 统一高级设置（Phase 2.E）：
 * 折叠态：标题 + 计数（可选 N 项 = Campaign A + AdSet B + Ad C）
 * 展开态：segmented pill tab 切换三层 + 当前 tab 字段 grid
 */
const UnifiedAdvancedSettings = ({ channel, rootFormData, onFieldChange }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('campaign');

  const defs = useMemo(() => ({
    campaign: channel ? getAdvancedFieldDefs(channel, 'campaign', rootFormData) : [],
    adset:    channel ? getAdvancedFieldDefs(channel, 'adset',    rootFormData) : [],
    ad:       channel ? getAdvancedFieldDefs(channel, 'ad',       rootFormData) : [],
  }), [channel, rootFormData]);

  // 仅算"当前可见"字段数（dependsOn 满足）
  const visibleCount = useMemo(() => {
    const fd = rootFormData || {};
    const count = (lvl) => defs[lvl].filter(d =>
      evaluateDependsOn(d, fd[lvl] || {}, fd)
    ).length;
    return {
      campaign: count('campaign'),
      adset:    count('adset'),
      ad:       count('ad'),
    };
  }, [defs, rootFormData]);
  const total = visibleCount.campaign + visibleCount.adset + visibleCount.ad;

  if (!channel || total === 0) return null;

  const tabs = [
    { id: 'campaign', label: 'Campaign（系列）',   count: visibleCount.campaign },
    { id: 'adset',    label: channel === 'tiktok' ? 'Ad Group（广告组）' : 'Ad Set（广告组）', count: visibleCount.adset },
    { id: 'ad',       label: 'Ad（广告）',         count: visibleCount.ad   },
  ];

  const activeDefs = defs[tab] || [];
  const levelFormData = (rootFormData || {})[tab] || {};

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-neutral-50/40 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0">
          <Settings2 size={18} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-base font-semibold text-neutral-900 leading-tight">高级设置</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            可选 <span className="font-semibold text-neutral-700">{total}</span> 项 ·
            <span className="ml-1">Campaign {visibleCount.campaign}</span> ·
            <span className="ml-1">{channel === 'tiktok' ? 'AdGroup' : 'AdSet'} {visibleCount.adset}</span> ·
            <span className="ml-1">Ad {visibleCount.ad}</span>
          </p>
        </div>
        <ChevronDown size={16} className={`text-neutral-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-neutral-100">
          {/* segmented pill tabs */}
          <div className="px-6 py-3 bg-neutral-50/40 border-b border-neutral-100">
            <div className="inline-flex p-1 bg-white rounded-full border border-neutral-100 shadow-sm">
              {tabs.map(t => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={[
                      'px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5',
                      active ? 'bg-primary-500 text-white shadow' : 'text-neutral-600 hover:text-neutral-800',
                    ].join(' ')}
                  >
                    <span>{t.label}</span>
                    <span className={[
                      'inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-semibold',
                      active ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500',
                    ].join(' ')}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* fields */}
          <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 bg-neutral-50/30">
            {activeDefs.length === 0 ? (
              <p className="text-xs text-neutral-400 py-2 col-span-full">该层级无可选字段。</p>
            ) : activeDefs.map(def => (
              <DynamicFieldRenderer
                key={def.name}
                def={def}
                value={levelFormData[def.name]}
                onChange={(next) => onFieldChange?.(tab, def.name, next)}
                levelFormData={levelFormData}
                rootFormData={rootFormData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedAdvancedSettings;
