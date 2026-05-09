import React from 'react';
import { Layers, Info } from 'lucide-react';
import Select from './controls/Select';
import TextInput from './controls/TextInput';
import NumberInput from './controls/NumberInput';

/**
 * Phase 2.H 任务 3 — 批量编辑面板（替换 detail panel）：
 *  - 列出该层级的白名单字段
 *  - 每个字段：草稿值优先 → 共同值 → "Mixed (N values)" 占位
 *  - 用户编辑只写到 draft；点击保存才 apply
 *
 * Props:
 *  - level: 'campaign' | 'adset'
 *  - count: 已选节点数
 *  - fieldDefs: [{ name, label, type, options?, helpText? }]
 *  - getFieldState: (name) => { mixed, value }   — 按当前选中节点合成
 *  - draft / onDraftChange(patch)
 */
const BulkEditPanel = ({ level, count, fieldDefs = [], getFieldState, draft, onDraftChange }) => {
  const levelLabel = level === 'campaign' ? 'Campaign' : 'Ad Set';

  const renderControl = (def) => {
    const inDraft = Object.prototype.hasOwnProperty.call(draft || {}, def.name);
    const draftVal = draft?.[def.name];
    const { mixed, value } = inDraft ? { mixed: false, value: draftVal } : (getFieldState?.(def.name) || {});
    const showMixed = !inDraft && mixed;
    const setVal = (v) => onDraftChange?.({ [def.name]: v });

    const placeholder = showMixed ? `Mixed · ${count} 个不同值` : (def.placeholder || '');

    switch (def.type) {
      case 'select':
        return (
          <Select
            value={showMixed ? '' : (value ?? '')}
            onChange={setVal}
            options={def.options || []}
            placeholder={placeholder}
          />
        );
      case 'currency':
        return (
          <NumberInput
            value={showMixed ? '' : (value ?? '')}
            onChange={setVal}
            placeholder={showMixed ? placeholder : '0'}
            prefix="$"
            min={1}
          />
        );
      case 'number':
        return (
          <NumberInput
            value={showMixed ? '' : (value ?? '')}
            onChange={setVal}
            placeholder={showMixed ? placeholder : '0'}
            min={def.min}
          />
        );
      case 'text':
      default:
        return (
          <TextInput
            value={showMixed ? '' : (value ?? '')}
            onChange={setVal}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
          <Layers size={16} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">批量编辑 {count} 个 {levelLabel}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">改动后点击右上「保存」才会生效，可随时取消。</p>
        </div>
      </div>

      <div className="space-y-3">
        {fieldDefs.map(def => {
          const inDraft = Object.prototype.hasOwnProperty.call(draft || {}, def.name);
          const { mixed } = !inDraft ? (getFieldState?.(def.name) || {}) : { mixed: false };
          return (
            <div key={def.name} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-gray-700">{def.label}</label>
                {def.helpText && (
                  <span title={def.helpText} className="text-gray-300 cursor-help"><Info size={11} /></span>
                )}
                {!inDraft && mixed && (
                  <span className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-semibold">
                    Mixed
                  </span>
                )}
                {inDraft && (
                  <span className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 font-semibold">
                    将更新
                  </span>
                )}
              </div>
              {renderControl(def)}
            </div>
          );
        })}
      </div>

      {Object.keys(draft || {}).length > 0 && (
        <div className="text-[11px] text-amber-700 bg-amber-50/60 border border-amber-200/60 px-3 py-2 rounded-base">
          ⚠ 当前有 {Object.keys(draft).length} 个字段待保存；点击右上「保存到 {count} 个 {levelLabel}」生效，或「取消」放弃修改。
        </div>
      )}
    </div>
  );
};

export default BulkEditPanel;
