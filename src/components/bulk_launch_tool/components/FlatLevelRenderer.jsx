import React, { useMemo, useState, useEffect } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import Switch from './controls/Switch';
import { evaluateDependsOn, LAYER_SECTIONS_V2 } from '../fieldDefinitions';

// Phase 2.W：subsection header inline 用的小 switch（仅 ON/OFF，无 label 行）
const SwitchInline = Switch;

/**
 * Phase 2.T：扁平字段渲染器 — Card 1 三层 Section 用，按 LAYER_SECTIONS_V2 声明的分段顺序渲染。
 *
 * 与 GroupedFieldsRenderer 的区别：
 *  - 不再按 group 桶分类。直接消费 LAYER_SECTIONS_V2[channel][level]
 *  - section 类型：
 *    - 'flat'        → 字段 grid，无标题
 *    - 'subsection'  → 小标题 + 字段 grid + 可选 mergedSlots
 *    - 'mergedSlot'  → 单一合并控件（如 BudgetField）
 *  - 余下未在 sections 中列出的 schema 字段 → 单一「高级设置」折叠
 *
 * Props 与 GroupedFieldsRenderer 同构：
 *  - channel / level / defs / formData / rootFormData / onFieldChange / inheritanceMap / onResetField / mergedSlots / compact
 */
const FlatLevelRenderer = ({
  channel, level, defs, formData, rootFormData,
  onFieldChange, inheritanceMap, onResetField, mergedSlots = {},
  compact = false,
}) => {
  const sections = LAYER_SECTIONS_V2?.[channel]?.[level] || [];

  // defs 按 name 索引，便于快速查找
  const defByName = useMemo(() => {
    const m = new Map();
    (defs || []).forEach(d => { if (!d.hideInUi) m.set(d.name, d); });
    return m;
  }, [defs]);

  // sections 中所有显式提到的字段名 → 用于剔除「高级设置」
  // Phase 2.T：fields 数组现在可以包含 { slot: 'X' } 对象 inline 注入合并控件；只对字符串收 usedNames
  // Phase 2.W：subsection.headerField 也算「已用」，避免它在高级设置里重复渲染
  const usedNames = useMemo(() => {
    const s = new Set();
    sections.forEach(sec => {
      (sec.fields || []).forEach(item => {
        if (typeof item === 'string') s.add(item);
      });
      if (sec.headerField) s.add(sec.headerField);
    });
    return s;
  }, [sections]);

  // 高级设置 = schema 中未在 sections 列出的可见字段
  const advancedFields = useMemo(() => {
    return (defs || []).filter(d => !d.hideInUi && !usedNames.has(d.name));
  }, [defs, usedNames]);

  // 高级折叠开关；监听 focus-field 事件 → 若目标字段在 advanced 中自动展开
  const [advancedOpen, setAdvancedOpen] = useState(false);
  useEffect(() => {
    const onFocus = (e) => {
      const targetLevel = e.detail?.level;
      const targetName = e.detail?.name;
      if (!targetLevel || !targetName || targetLevel !== level) return;
      if (advancedFields.some(d => d.name === targetName)) {
        setAdvancedOpen(true);
      }
    };
    window.addEventListener('bulk-launch:focus-field', onFocus);
    return () => window.removeEventListener('bulk-launch:focus-field', onFocus);
  }, [level, advancedFields]);

  const isOverrideMode = !!inheritanceMap;
  const fieldOverridden = (name) => isOverrideMode && !!inheritanceMap[name];
  const onReset = (name) => isOverrideMode ? () => onResetField?.(name) : undefined;

  // Phase 2.W：flex-wrap 替代 3-col grid —— 每个字段按 type 派生自然宽度，能挤一行就挤一行
  const gridCls = compact
    ? 'flex flex-col gap-y-3'
    : 'flex flex-wrap gap-x-4 gap-y-3 items-start';

  const renderField = (def) => (
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
  );

  // 单段渲染 helper：fields 数组按 user 顺序混合「字符串=schema 字段名」与「{slot:'X'}=mergedSlot」；
  // slotKeys（旧 API）作 fallback，appended 在末尾
  const renderFieldGrid = (fieldItems, slotKeys) => {
    const itemNodes = (fieldItems || []).map((item, idx) => {
      if (typeof item === 'string') {
        const def = defByName.get(item);
        if (!def) return null;
        if (!evaluateDependsOn(def, formData, rootFormData)) return null;
        return <React.Fragment key={`f-${item}`}>{renderField(def)}</React.Fragment>;
      }
      if (item && typeof item === 'object' && item.slot) {
        const node = mergedSlots[item.slot];
        if (!node) return null;
        return <React.Fragment key={`s-${item.slot}-${idx}`}>{node}</React.Fragment>;
      }
      return null;
    }).filter(Boolean);
    const trailingSlotNodes = (slotKeys || []).map(k => mergedSlots[k]).filter(Boolean);
    if (itemNodes.length === 0 && trailingSlotNodes.length === 0) return null;
    return (
      <div className={gridCls}>
        {itemNodes}
        {trailingSlotNodes}
      </div>
    );
  };

  // Phase 2.W：把连续的 flat / mergedSlot section 合并到 ONE flex-wrap 里，
  // 让 BudgetField + bid_strategy + start_time + stop_time 等能挤一行就挤一行；
  // 仅 subsection（受众 / 版位）保留独立 block 加小标题
  const renderSections = () => {
    const blocks = [];
    let currentGroup = []; // 累积 fields/slot items 直到遇到 subsection
    const flushGroup = (keySeed) => {
      if (currentGroup.length === 0) return;
      const items = currentGroup;
      currentGroup = [];
      blocks.push(<div key={`grp-${keySeed}`} className={gridCls}>{items}</div>);
    };

    sections.forEach((sec, idx) => {
      if (sec.kind === 'mergedSlot') {
        const slotNode = mergedSlots[sec.slot];
        if (slotNode) {
          currentGroup.push(<React.Fragment key={`s-${idx}-${sec.slot}`}>{slotNode}</React.Fragment>);
        }
        return;
      }
      if (sec.kind === 'flat') {
        // 把这个 flat section 的字段直接展开到 currentGroup
        (sec.fields || []).forEach((item, j) => {
          if (typeof item === 'string') {
            const def = defByName.get(item);
            if (!def) return;
            if (!evaluateDependsOn(def, formData, rootFormData)) return;
            currentGroup.push(<React.Fragment key={`f-${idx}-${item}`}>{renderField(def)}</React.Fragment>);
          } else if (item && typeof item === 'object' && item.slot) {
            const node = mergedSlots[item.slot];
            if (node) currentGroup.push(<React.Fragment key={`s-${idx}-${j}-${item.slot}`}>{node}</React.Fragment>);
          }
        });
        return;
      }
      if (sec.kind === 'subsection') {
        // subsection 前 flush 当前累积
        flushGroup(`pre-${idx}`);
        const grid = renderFieldGrid(sec.fields, sec.mergedSlots);
        // Phase 2.W：headerField 支持在 subtitle 行 inline 渲染（如 advantage_audience switch）
        let headerExtra = null;
        if (sec.headerField) {
          const headerDef = defByName.get(sec.headerField);
          if (headerDef && evaluateDependsOn(headerDef, formData, rootFormData)) {
            // 紧凑渲染：仅 label + switch；不复用 DynamicFieldRenderer 的完整 cell 视觉
            const v = formData?.[headerDef.name];
            headerExtra = (
              <div className="inline-flex items-center gap-1.5 ml-3">
                <span className="text-[11px] text-gray-600">{headerDef.label}</span>
                {headerDef.helpText && <span title={headerDef.helpText} className="text-gray-300 cursor-help">ⓘ</span>}
                <SwitchInline value={v} onChange={(next) => onFieldChange?.(headerDef.name, next)} />
              </div>
            );
          }
        }
        if (grid || headerExtra) {
          blocks.push(
            <section key={`sub-${idx}`} className="pt-2">
              {/* 受众 / 版位 subtitle 行：独占一整行，带细底边和 mb-3 与下方字段网格清晰分离 */}
              <div className="flex items-center gap-1 pb-1.5 mb-3 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800">{sec.label}</h4>
                {headerExtra}
              </div>
              {grid}
            </section>
          );
        }
        return;
      }
    });
    flushGroup('end');
    return blocks;
  };

  // 可见 advanced 字段（dependsOn 过滤）
  const visibleAdvancedFields = useMemo(
    () => advancedFields.filter(d => evaluateDependsOn(d, formData, rootFormData)),
    [advancedFields, formData, rootFormData]
  );

  return (
    <div className="space-y-3">
      {renderSections()}

      {visibleAdvancedFields.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setAdvancedOpen(o => !o)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50/40 transition-colors"
          >
            <Settings2 size={12} className="text-gray-400 shrink-0" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-gray-700">高级设置</span>
            <span className="text-[10px] text-gray-400">{visibleAdvancedFields.length} 项</span>
            <ChevronDown size={12} className={`ml-auto text-gray-400 shrink-0 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>
          {advancedOpen && (
            <div className={`border-t border-gray-100 px-4 py-4 bg-gray-50/30 ${gridCls}`}>
              {visibleAdvancedFields.map(renderField)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlatLevelRenderer;
