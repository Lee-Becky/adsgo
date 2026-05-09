import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import TextInput from '../controls/TextInput';
import Select from '../controls/Select';

/**
 * Phase 2.M：素材组级 Ad Copy 编辑器（modal/drawer）。
 *
 * 用户在 ProductSelector 中点击某素材组的「📝 文案」按钮 → 弹出此编辑器
 * → 编辑该素材组对应的 ad creative 文案（title / body / link_url / call_to_action_type）
 * → 数据写到 BulkLaunchTool 顶层 creativeGroupCopyMap[productId][groupId]
 * → 发布层组装 ad creative 时注入到 object_story_spec.link_data 等。
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - productId / groupId: 主键
 *  - groupName: 显示给用户看的素材组名（如 "默认" / "夏季促销"）
 *  - channel: 'meta' | 'tiktok'
 *  - value: { title?, body?, link_url?, call_to_action_type? }
 *  - onSave: (next) => void
 *  - ctaOptions: [{value, label}]  从 metaAdFields / tiktokAdFields 的 call_to_action_type.options 派生
 */
const AdCopyEditor = ({
  open, onClose, productId, groupId, groupName,
  channel, value, onSave, ctaOptions = [],
}) => {
  const [draft, setDraft] = useState({});
  useEffect(() => {
    if (open) setDraft(value || {});
  }, [open, value, productId, groupId]);

  if (!open) return null;

  const set = (name, v) => setDraft(prev => ({ ...prev, [name]: v }));
  const titleMaxLen = channel === 'meta' ? 40 : 40;
  const bodyMaxLen  = channel === 'meta' ? 125 : 100;

  const handleSave = () => {
    onSave?.(draft);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[92vw] overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
              <Edit3 size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                文案 · {groupName || `素材组 #${groupId || ''}`}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Phase 2.M：本组所有 ad 都用这套文案，发布时注入到 ad creative
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-base hover:bg-gray-50">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">广告标题（≤ {titleMaxLen} 字符）</label>
            <TextInput
              value={draft.title || ''}
              onChange={(v) => set('title', v)}
              placeholder="如：Summer Sale - Up to 50% Off"
              maxLength={titleMaxLen}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">广告正文（≤ {bodyMaxLen} 字符）</label>
            <textarea
              rows={3}
              value={draft.body || ''}
              maxLength={bodyMaxLen}
              onChange={e => set('body', e.target.value)}
              placeholder="详细描述产品 / 卖点 / CTA"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-base outline-none resize-y hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">落地页 URL</label>
            <TextInput
              value={draft.link_url || ''}
              onChange={(v) => set('link_url', v)}
              placeholder="https://example.com/landing-page"
              type="url"
            />
            <p className="text-[10px] text-gray-400 px-1">
              留空 → 发布时回退到产品默认落地页
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">行动号召按钮（CTA）</label>
            <Select
              value={draft.call_to_action_type || ''}
              onChange={(v) => set('call_to_action_type', v)}
              options={ctaOptions}
              placeholder="选择 CTA 按钮文案..."
            />
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button onClick={onClose}
            className="px-4 h-9 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-base transition-colors">
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 h-9 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-base transition-colors shadow-sm"
          >
            保存文案
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCopyEditor;
