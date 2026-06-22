import React, { useEffect, useMemo, useState } from 'react';
import { X, Layers } from 'lucide-react';
import Select from './controls/Select';
import TextInput from './controls/TextInput';
import NumberInput from './controls/NumberInput';
import Switch from './controls/Switch';

/**
 * Phase 2.H 任务 3 — 批量编辑模态：
 *  1. 用户从字段下拉选要批量修改的字段
 *  2. 根据字段类型动态渲染对应输入控件
 *  3. 点击「应用至 N 个」→ 写入所有选中节点；点击「取消」→ 不写入
 *
 * Props:
 *  - open / onClose
 *  - level: 'campaign' | 'adset'
 *  - count: 已选节点数
 *  - fieldDefs: [{ name, label, type, options? }]  可批量编辑的字段白名单
 *  - onApply: (fieldName, value) => void
 */
const BulkEditModal = ({ open, onClose, level, count, fieldDefs = [], onApply }) => {
  const [fieldName, setFieldName] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open) {
      setFieldName('');
      setValue('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const def = useMemo(() => fieldDefs.find(d => d.name === fieldName), [fieldDefs, fieldName]);
  const fieldOptions = useMemo(() => fieldDefs.map(d => ({ value: d.name, label: d.label })), [fieldDefs]);

  if (!open) return null;

  const renderValueControl = () => {
    if (!def) return null;
    switch (def.type) {
      case 'select':
        return <Select value={value} onChange={setValue} options={def.options || []} placeholder="选择新值..." />;
      case 'number':
        return <NumberInput value={value} onChange={setValue} placeholder="0" min={def.min} />;
      case 'currency':
        return <NumberInput value={value} onChange={setValue} placeholder="0" prefix="$" min={1} />;
      case 'switch':
        return (
          <div className="h-10 flex items-center px-3 bg-white border border-neutral-200 rounded-base">
            <Switch value={!!value} onChange={setValue} labels={{ on: '开启', off: '关闭' }} />
          </div>
        );
      case 'text':
      default:
        return <TextInput value={value} onChange={setValue} placeholder="输入新值..." />;
    }
  };

  const canApply = !!fieldName && (
    def?.type === 'switch' ? true : (value !== '' && value !== null && value !== undefined)
  );
  const handleApply = () => {
    if (!canApply) return;
    onApply?.(fieldName, value);
    onClose?.();
  };

  const levelLabel = level === 'campaign' ? 'Campaign' : 'Ad Set';

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-[92vw] overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Layers size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">批量编辑 {count} 个 {levelLabel}</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">仅本次编辑生效，可随时取消</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1 rounded-base hover:bg-neutral-50">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-700">选择要批量修改的字段</label>
            <Select
              value={fieldName}
              onChange={(v) => { setFieldName(v); setValue(''); }}
              options={fieldOptions}
              placeholder="请选择字段..."
            />
          </div>

          {fieldName && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-medium text-neutral-700">{def?.label} 的新值</label>
              {renderValueControl()}
              <p className="text-[11px] text-amber-600 mt-1">
                ⚠ 应用后将覆盖所有 {count} 个 {levelLabel} 上该字段的现有值
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-end gap-2">
          <button onClick={onClose}
            className="px-4 h-9 text-xs font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-base transition-colors">
            取消
          </button>
          <button
            onClick={handleApply}
            disabled={!canApply}
            className="px-4 h-9 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-base transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            应用至 {count} 个 {levelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;
