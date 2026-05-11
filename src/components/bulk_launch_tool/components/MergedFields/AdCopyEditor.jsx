import React, { useState, useEffect } from 'react';
import { X, Edit3, Plus, Trash2 } from 'lucide-react';
import TextInput from '../controls/TextInput';
import Select from '../controls/Select';
import ProductVariableInserter from './ProductVariableInserter';

/**
 * AdCopyEditor — 文案组编辑器（modal）。
 *
 * 数据契约（升级后）：
 *   {
 *     titles?: string[]    // Meta：最多 5 条标题
 *     bodies?: string[]    // Meta：最多 5 条正文
 *     ad_text?: string     // TikTok：单条文案
 *     link_url?: string
 *     call_to_action_type?: string
 *   }
 *
 * 兼容旧 shape `{ title, body }` —— 初始化 draft 时把单值 normalize 为单元素数组。
 *
 * Props:
 *  - open / onClose
 *  - productId / groupId / groupName    主键 + 标题展示
 *  - channel: 'meta' | 'tiktok'         决定 Meta 多文案 还是 TikTok 单文案分支
 *  - value: AdCopy
 *  - onSave: (next: AdCopy) => void
 *  - ctaOptions: [{value, label}]
 *  - enableProductVariables?: boolean   true 时每行 title/body/ad_text 旁挂「+ 变量」按钮（CATALOG 系列文案场景）
 */
const META_MAX_TITLES = 5;
const META_MAX_BODIES = 5;
const META_TITLE_LEN  = 40;
const META_BODY_LEN   = 125;
const TIKTOK_TEXT_LEN = 100;

const AdCopyEditor = ({
  open, onClose, productId, groupId, groupName,
  channel, value, onSave, ctaOptions = [],
  enableProductVariables = false,
}) => {
  const [draft, setDraft] = useState({});
  useEffect(() => {
    if (!open) return;
    const v = value || {};
    setDraft({
      titles: Array.isArray(v.titles) && v.titles.length > 0
        ? v.titles
        : (v.title ? [v.title] : ['']),
      bodies: Array.isArray(v.bodies) && v.bodies.length > 0
        ? v.bodies
        : (v.body ? [v.body] : ['']),
      ad_text: v.ad_text || '',
      link_url: v.link_url || '',
      call_to_action_type: v.call_to_action_type || '',
    });
  }, [open, value, productId, groupId]);

  if (!open) return null;
  const isMeta = channel !== 'tiktok';

  const set = (name, v) => setDraft(prev => ({ ...prev, [name]: v }));
  const setListAt = (key, idx, v) => setDraft(prev => {
    const arr = [...(prev[key] || [])];
    arr[idx] = v;
    return { ...prev, [key]: arr };
  });
  const appendList = (key, max) => setDraft(prev => {
    const arr = [...(prev[key] || [])];
    if (arr.length >= max) return prev;
    return { ...prev, [key]: [...arr, ''] };
  });
  const removeListAt = (key, idx) => setDraft(prev => {
    const arr = [...(prev[key] || [])];
    if (arr.length <= 1) return prev;
    arr.splice(idx, 1);
    return { ...prev, [key]: arr };
  });
  const insertVariableTo = (key, idx, token) => setDraft(prev => {
    const arr = [...(prev[key] || [])];
    arr[idx] = (arr[idx] || '') + token;
    return { ...prev, [key]: arr };
  });

  const handleSave = () => {
    // 保存时去掉数组里全空字符串行（保留至少 1 项防止后续读不到）
    const titles = (draft.titles || []).filter((t, i, a) => t || a.length === 1);
    const bodies = (draft.bodies || []).filter((t, i, a) => t || a.length === 1);
    const next = isMeta
      ? {
          titles: titles.length > 0 ? titles : [''],
          bodies: bodies.length > 0 ? bodies : [''],
          link_url: draft.link_url || '',
          call_to_action_type: draft.call_to_action_type || '',
        }
      : {
          ad_text: draft.ad_text || '',
          link_url: draft.link_url || '',
          call_to_action_type: draft.call_to_action_type || '',
        };
    onSave?.(next);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-[92vw] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0">
              <Edit3 size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                文案 · {groupName || `素材组 #${groupId || ''}`}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isMeta
                  ? `Meta 最多 ${META_MAX_TITLES} 个标题 + ${META_MAX_BODIES} 个正文，发布时走 DCO 多变体`
                  : 'TikTok 单条广告文案，发布时注入到 ad_text'}
                {enableProductVariables && ' · 支持插入商品变量'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-base hover:bg-gray-50 shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 overflow-y-auto flex-1">
          {isMeta ? (
            <>
              {/* Meta — 多标题 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">
                    广告标题 <span className="text-gray-400 font-normal">（≤ {META_TITLE_LEN} 字符 · 最多 {META_MAX_TITLES} 个）</span>
                  </label>
                  <span className="text-[10px] text-gray-400">{(draft.titles || []).length} / {META_MAX_TITLES}</span>
                </div>
                {(draft.titles || []).map((t, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 mt-2.5 w-4 text-center shrink-0 tabular-nums">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <TextInput
                        value={t}
                        onChange={(v) => setListAt('titles', i, v)}
                        placeholder={`标题 ${i + 1}，如：Summer Sale - Up to 50% Off`}
                        maxLength={META_TITLE_LEN}
                      />
                    </div>
                    {enableProductVariables && (
                      <div className="mt-1.5 shrink-0">
                        <ProductVariableInserter onInsert={(token) => insertVariableTo('titles', i, token)} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeListAt('titles', i)}
                      disabled={(draft.titles || []).length <= 1}
                      title={(draft.titles || []).length <= 1 ? '至少保留 1 行' : '删除该行'}
                      className="w-7 h-7 mt-1 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:text-gray-200 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendList('titles', META_MAX_TITLES)}
                  disabled={(draft.titles || []).length >= META_MAX_TITLES}
                  className="self-start inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed px-2 py-1 rounded-base transition-colors"
                >
                  <Plus size={12} /> 添加标题
                </button>
              </div>

              {/* Meta — 多正文 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">
                    广告正文 <span className="text-gray-400 font-normal">（≤ {META_BODY_LEN} 字符 · 最多 {META_MAX_BODIES} 个）</span>
                  </label>
                  <span className="text-[10px] text-gray-400">{(draft.bodies || []).length} / {META_MAX_BODIES}</span>
                </div>
                {(draft.bodies || []).map((t, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 mt-2.5 w-4 text-center shrink-0 tabular-nums">{i + 1}</span>
                    <div className="flex-1 min-w-0 relative">
                      <textarea
                        rows={2}
                        value={t}
                        maxLength={META_BODY_LEN}
                        onChange={e => setListAt('bodies', i, e.target.value)}
                        placeholder={`正文 ${i + 1}，描述产品 / 卖点 / CTA`}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-base outline-none resize-y hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus transition-all"
                      />
                      {enableProductVariables && (
                        <div className="absolute top-1.5 right-1.5">
                          <ProductVariableInserter onInsert={(token) => insertVariableTo('bodies', i, token)} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeListAt('bodies', i)}
                      disabled={(draft.bodies || []).length <= 1}
                      title={(draft.bodies || []).length <= 1 ? '至少保留 1 行' : '删除该行'}
                      className="w-7 h-7 mt-1 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:text-gray-200 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendList('bodies', META_MAX_BODIES)}
                  disabled={(draft.bodies || []).length >= META_MAX_BODIES}
                  className="self-start inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed px-2 py-1 rounded-base transition-colors"
                >
                  <Plus size={12} /> 添加正文
                </button>
              </div>
            </>
          ) : (
            <>
              {/* TikTok — 单条广告文案 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">广告文案 <span className="text-gray-400 font-normal">（≤ {TIKTOK_TEXT_LEN} 字符）</span></label>
                  {enableProductVariables && (
                    <ProductVariableInserter onInsert={(token) => set('ad_text', (draft.ad_text || '') + token)} />
                  )}
                </div>
                <textarea
                  rows={3}
                  value={draft.ad_text || ''}
                  maxLength={TIKTOK_TEXT_LEN}
                  onChange={e => set('ad_text', e.target.value)}
                  placeholder="如：限时大促 全场 5 折起 立即抢购"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-base outline-none resize-y hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus transition-all"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">落地页 URL</label>
            <TextInput
              value={draft.link_url || ''}
              onChange={(v) => set('link_url', v)}
              placeholder="https://example.com/landing-page"
              type="url"
            />
            <p className="text-[10px] text-gray-400 px-1">留空 → 发布时回退到产品默认落地页</p>
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

        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">
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
