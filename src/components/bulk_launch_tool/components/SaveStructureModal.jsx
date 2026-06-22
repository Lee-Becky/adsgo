import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

/**
 * 保存广告结构模板：居中模态 + 名称输入 + 取消/确认。
 */
const SaveStructureModal = ({ open, defaultName, onCancel, onConfirm }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) setName(defaultName || '');
  }, [open, defaultName]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter' && name.trim()) onConfirm?.(name.trim());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, name, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-w-[90vw] overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Save size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">保存广告结构模板</h3>
          </div>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-700 p-1 rounded-base hover:bg-neutral-50">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">
          <label className="text-xs font-medium text-neutral-700 block mb-2">模板名称</label>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="例：Meta DPA 双目录组合"
            className="w-full h-10 px-3 text-sm bg-white border border-neutral-200 rounded-base outline-none transition-all hover:border-neutral-300 focus:border-primary-500 focus:shadow-primary-focus"
          />
          <p className="text-xs text-neutral-400 mt-2">下次可在右上方「历史结构」下拉中一键复用此结构。</p>
        </div>
        <div className="px-5 py-3 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-end gap-2">
          <button onClick={onCancel}
            className="px-4 h-9 text-xs font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-base transition-colors">
            取消
          </button>
          <button
            onClick={() => name.trim() && onConfirm?.(name.trim())}
            disabled={!name.trim()}
            className="px-4 h-9 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-base transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Save size={12} /> 保存并继续
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveStructureModal;
