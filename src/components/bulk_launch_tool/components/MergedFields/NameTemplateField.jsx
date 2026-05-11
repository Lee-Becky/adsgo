import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Save, Wand2, Check } from 'lucide-react';
import { Popover } from '../../../common/Popover';
import { NAME_VARIABLES, resolveNameTemplate } from '../../utils/formDataAdapter';
import { saveNamingTemplate } from '../../utils/savedNamingTemplates';

/**
 * Phase 2.O：命名输入助手 —— Campaign / AdSet / Ad name 字段的统一控件。
 *
 *  ─ 输入框（普通 input，token 以 `{key}` 字面量呈现）
 *  ─ 工具栏：[+ 变量] [自定义文字 ____ 插入]    [保存命名]
 *  ─ 预览行：→ 展开后的实际字符串（用 resolveNameTemplate）
 *
 * 「历史命名」抽到 HistoryNamingDropdown，放在 DynamicFieldRenderer 的 label 右侧。
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - level: 'campaign' | 'adset' | 'ad'
 *  - value / onChange
 *  - required / error
 *  - maxLength
 *  - resolveContext: 从 BulkLaunchTool 顶层派生（deriveNameResolveCtx）— 用于预览
 */
const NameTemplateField = ({
  channel, level, value, onChange, required, error, maxLength, resolveContext = {},
}) => {
  const inputRef = useRef(null);
  const variableBtnRef = useRef(null);
  const saveBtnRef = useRef(null);
  const [showVarPopover, setShowVarPopover] = useState(false);
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [customText, setCustomText] = useState('');
  const [saveName, setSaveName] = useState('');

  const safeValue = value || '';
  const preview = resolveNameTemplate(safeValue, resolveContext);
  const previewSame = preview === safeValue;
  const previewLen = preview.length;
  const overMax = maxLength && previewLen > maxLength;

  /** 在 input 当前光标处插入 fragment；光标停在插入末尾。 */
  const insertAtCaret = (fragment) => {
    if (!fragment) return;
    const el = inputRef.current;
    const cur = safeValue;
    if (!el) {
      onChange?.(cur + fragment);
      return;
    }
    const start = el.selectionStart ?? cur.length;
    const end = el.selectionEnd ?? cur.length;
    const next = cur.slice(0, start) + fragment + cur.slice(end);
    onChange?.(next);
    // 异步把光标移到插入末尾
    requestAnimationFrame(() => {
      try {
        const pos = start + fragment.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      } catch {}
    });
  };

  const handleInsertVariable = (key) => {
    insertAtCaret(`{${key}}`);
    setShowVarPopover(false);
  };

  const handleInsertCustom = () => {
    const t = customText;
    if (!t) return;
    insertAtCaret(t);
    // 不清空 customText，方便连续点
  };

  const handleSave = () => {
    if (!saveName.trim() || !safeValue) return;
    saveNamingTemplate({ name: saveName.trim(), channel, level, template: safeValue });
    setSaveName('');
    setShowSavePopover(false);
  };

  // 打开保存弹框时清空 saveName
  useEffect(() => {
    if (showSavePopover) setSaveName('');
  }, [showSavePopover]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={safeValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={`如：Q4-{locations}-{age}-Beta`}
        maxLength={maxLength}
        className={`w-full h-9 px-3 text-sm bg-white border rounded-base outline-none transition-all ${
          error ? 'border-rose-400 focus:border-rose-500'
                : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus'
        }`}
      />

      {/* 工具栏 row 1：变量插入 + 自定义文字 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          ref={variableBtnRef}
          type="button"
          onClick={() => setShowVarPopover(s => !s)}
          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-500/20 rounded-base transition-colors"
          title="插入命名变量"
        >
          <Plus size={11} /> 变量 <ChevronDown size={10} />
        </button>

        <div className="inline-flex items-center gap-1">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInsertCustom(); } }}
            placeholder="自定义文字"
            className="h-7 px-2 text-[11px] w-28 bg-white border border-gray-200 rounded-base outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all"
          />
          <button
            type="button"
            onClick={handleInsertCustom}
            disabled={!customText}
            className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 hover:border-primary-500/60 hover:text-primary-600 rounded-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={customText ? `插入字面文字「${customText}」（不会清空，可连续插入）` : '请先在左侧输入自定义文字'}
          >
            插入
          </button>
        </div>

        <div className="flex-1" />

        <button
          ref={saveBtnRef}
          type="button"
          onClick={() => setShowSavePopover(s => !s)}
          disabled={!safeValue}
          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-semibold text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-100 border border-fuchsia-500/20 rounded-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title={safeValue ? '保存当前命名规则供下次使用' : '请先在输入框填写内容'}
        >
          <Save size={11} /> 保存命名，下次使用
        </button>
      </div>

      {/* 预览 */}
      {safeValue && (
        <div className="flex items-center gap-1.5 text-[10px] leading-tight">
          <Wand2 size={10} className="text-primary-500/70 shrink-0" />
          <span className="text-gray-400 shrink-0">预览：</span>
          <span className={`truncate ${overMax ? 'text-rose-500 font-semibold' : previewSame ? 'text-gray-400' : 'text-primary-600 font-medium'}`}>
            {preview || <span className="text-gray-300">（暂无字符）</span>}
          </span>
          {overMax && (
            <span className="shrink-0 text-rose-500 font-semibold">
              · 超出 {maxLength} 字符（{previewLen}）
            </span>
          )}
        </div>
      )}

      {/* Popover：变量列表 */}
      <Popover
        open={showVarPopover}
        anchorRef={variableBtnRef}
        onClose={() => setShowVarPopover(false)}
        placement="bottom-start"
        className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[240px] max-h-[280px] overflow-auto"
      >
        <p className="px-3 pb-1.5 mb-1 text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100">默认变量</p>
        {NAME_VARIABLES.map(v => (
          <button
            key={v.key}
            type="button"
            onClick={() => handleInsertVariable(v.key)}
            className="w-full text-left px-3 py-2 hover:bg-primary-50/40 transition-colors flex items-start gap-2 group"
          >
            <Plus size={11} className="text-primary-500/60 mt-0.5 group-hover:text-primary-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800">{v.label}</p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{`{${v.key}}`}{v.hint ? ` · ${v.hint}` : ''}</p>
            </div>
          </button>
        ))}
      </Popover>

      {/* Popover：保存命名 */}
      <Popover
        open={showSavePopover}
        anchorRef={saveBtnRef}
        onClose={() => setShowSavePopover(false)}
        placement="bottom-end"
        className="bg-white rounded-xl shadow-2xl border border-gray-100 p-3 w-[280px]"
      >
        <p className="text-xs font-semibold text-gray-800 mb-1.5">保存为命名策略</p>
        <p className="text-[10px] text-gray-400 mb-2 font-mono truncate">{safeValue || '（空）'}</p>
        <input
          type="text"
          autoFocus
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          placeholder="例：Q4-促销系列"
          className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-base outline-none focus:border-primary-500 focus:shadow-primary-focus transition-all"
        />
        <div className="flex items-center justify-end gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => setShowSavePopover(false)}
            className="h-7 px-2 text-[11px] text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-base transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!saveName.trim() || !safeValue}
            className="inline-flex items-center gap-1 h-7 px-2.5 text-[11px] font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-base transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Check size={11} /> 保存
          </button>
        </div>
      </Popover>

      {error && <span className="text-[11px] text-rose-500">{error}</span>}
    </div>
  );
};

export default NameTemplateField;
