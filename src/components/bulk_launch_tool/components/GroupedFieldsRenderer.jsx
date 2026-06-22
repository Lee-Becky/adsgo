import React, { useMemo, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { GROUP_META, ACCENT, getGroupMeta } from '../fieldDefinitions/groupMeta';
import { evaluateDependsOn } from '../fieldDefinitions';

/**
 * Phase 2.K：把字段按 group 分桶，每个 group 渲染为一张白色卡片（标题 + 图标 + 计数 + grid）。
 * 与 Card 1 三个 Section 和架构图 detail panel 共用。
 *
 * Props:
 *  - channel:        'meta' | 'tiktok'
 *  - level:          'campaign' | 'adset' | 'ad'
 *  - defs:           已派生（hideInUi 已过滤）的字段数组
 *  - formData:       该层 effective data
 *  - rootFormData:   全局 formData（跨 level dependsOn）
 *  - onFieldChange:  (name, value) => void
 *  - inheritanceMap?: { [name]: true } —— detail panel 模式下的 override 集合
 *  - onResetField?:  (name) => void
 *  - mergedSlots?:   { [groupName]: ReactNode | ReactNode[] } —— 每个 group 内追加合并控件
 */
const GroupedFieldsRenderer = ({
  channel, level, defs, formData, rootFormData,
  onFieldChange, inheritanceMap, onResetField, mergedSlots = {},
  compact = false,
}) => {
  // 按 group 分桶
  const buckets = useMemo(() => {
    const m = {};
    (defs || []).forEach(d => {
      const g = d.group || 'advanced';
      if (!m[g]) m[g] = [];
      m[g].push(d);
    });
    return m;
  }, [defs]);

  // 取所有可见 group + 用户合并控件 slot 注入的 group（即使该 group 无字段，但有 mergedSlots 也要展示）
  const groupNames = useMemo(() => {
    const set = new Set([
      ...Object.keys(buckets),
      ...Object.keys(mergedSlots).filter(k => mergedSlots[k]),
    ]);
    return Array.from(set).sort((a, b) => (getGroupMeta(a).order || 99) - (getGroupMeta(b).order || 99));
  }, [buckets, mergedSlots]);

  // 折叠状态
  const [openMap, setOpenMap] = useState(() => {
    const init = {};
    groupNames.forEach(g => { init[g] = !!getGroupMeta(g).defaultOpen; });
    return init;
  });
  const toggle = (g) => setOpenMap(prev => ({ ...prev, [g]: !prev[g] }));

  // Phase 2.P：监听全局聚焦字段事件 —— 若目标 level + 字段属于本渲染器某 group，自动展开该 group 让 scrollIntoView 命中
  useEffect(() => {
    const onFocus = (e) => {
      const targetLevel = e.detail?.level;
      const targetName = e.detail?.name;
      if (!targetLevel || !targetName || targetLevel !== level) return;
      // 在 buckets 中找包含该字段的 group
      const groupName = Object.entries(buckets).find(
        ([, list]) => list.some(d => d.name === targetName)
      )?.[0];
      if (groupName) setOpenMap(prev => prev[groupName] ? prev : { ...prev, [groupName]: true });
    };
    window.addEventListener('bulk-launch:focus-field', onFocus);
    return () => window.removeEventListener('bulk-launch:focus-field', onFocus);
  }, [level, buckets]);

  const isOverrideMode = !!inheritanceMap;
  const fieldOverridden = (name) => isOverrideMode && !!inheritanceMap[name];
  const onReset = (name) => isOverrideMode ? () => onResetField?.(name) : undefined;

  const renderFieldsOfGroup = (groupName) => {
    const fields = (buckets[groupName] || []).filter(d => evaluateDependsOn(d, formData, rootFormData));
    const slot = mergedSlots[groupName];
    const containerCls = compact
      ? 'border-t border-neutral-50 px-4 py-4 flex flex-col gap-y-4 bg-neutral-50/30'
      : 'border-t border-neutral-50 px-5 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 bg-neutral-50/30';
    return (
      <div className={containerCls}>
        {fields.map(def => (
          <DynamicFieldRenderer
            key={def.name}
            def={def}
            value={formData?.[def.name]}
            onChange={(next) => onFieldChange?.(def.name, next)}
            levelFormData={formData}
            rootFormData={rootFormData}
            isOverridden={fieldOverridden(def.name)}
            onReset={onReset(def.name)}
            compact={compact}
          />
        ))}
        {slot}
        {fields.length === 0 && !slot && (
          <p className={`text-xs text-neutral-400 ${compact ? '' : 'col-span-full'}`}>该组暂无可见字段。</p>
        )}
      </div>
    );
  };

  // 计算每个 group 的"待填必填"数量（折叠时仍提示）
  const pendingRequiredCount = (groupName) => {
    const fields = buckets[groupName] || [];
    return fields.filter(d => {
      if (!evaluateDependsOn(d, formData, rootFormData)) return false;
      const isReq = !!d.required ||
        (typeof d.requiredWhen === 'function' && d.requiredWhen(formData?.[d.name], rootFormData));
      if (!isReq) return false;
      const v = formData?.[d.name];
      return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
    }).length;
  };

  // 计算 visible 字段数（不含合并控件——slot 不计数，因为它们已是高频字段集合显示）
  const visibleCount = (groupName) =>
    (buckets[groupName] || []).filter(d => evaluateDependsOn(d, formData, rootFormData)).length
    + (Array.isArray(mergedSlots[groupName]) ? mergedSlots[groupName].filter(Boolean).length : (mergedSlots[groupName] ? 1 : 0));

  return (
    <div className="space-y-4">
      {groupNames.map(gName => {
        const meta = getGroupMeta(gName);
        const accent = ACCENT[meta.accent] || ACCENT.slate;
        const Icon = meta.icon;
        const open = openMap[gName];
        const pending = pendingRequiredCount(gName);
        const count = visibleCount(gName);
        if (count === 0) return null;
        return (
          <section key={gName} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(gName)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50/40 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center shrink-0`}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight truncate">{meta.label}</h3>
                {meta.desc && <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{meta.desc}</p>}
              </div>
              {pending > 0 && (
                <span
                  title={`该组有 ${pending} 项必填待填`}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  待填 {pending}
                </span>
              )}
              <span className="text-[10px] text-neutral-500 px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-100 shrink-0">
                {count} 项
              </span>
              <ChevronDown size={14} className={`text-neutral-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && renderFieldsOfGroup(gName)}
          </section>
        );
      })}
    </div>
  );
};

export default GroupedFieldsRenderer;
