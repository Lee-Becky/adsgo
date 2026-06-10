import React, { useRef, useState, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { Popover } from '../../../common/Popover';

/**
 * 美化 MultiSelect：触发器显示 chips（最多 3 + "+N"）+ Popover 下拉勾选。
 * options 为空时退化为 tag input（用户自由输入逗号分隔）。
 */
const CHIP_COLORS = {
  primary: 'bg-primary-50 text-primary-700',
  violet:  'bg-violet-50 text-violet-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber:   'bg-amber-50 text-amber-700',
  rose:    'bg-rose-50 text-rose-700',
  sky:     'bg-sky-50 text-sky-700',
  pink:    'bg-pink-50 text-pink-700',
  indigo:  'bg-indigo-50 text-indigo-700',
};

const MultiSelect = ({
  value, onChange, options = [], placeholder = '请选择...',
  disabled, error, searchable, chipColorByOption,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const triggerRef = useRef(null);
  const selected = Array.isArray(value) ? value : [];

  // tag-input 模式：无 options 时
  const tagMode = !options || options.length === 0;

  const useSearch = searchable !== undefined ? searchable : (options.length >= 8);
  const filtered = useMemo(() => {
    if (!q) return options;
    const k = q.toLowerCase();
    return options.filter(o => String(o.label || '').toLowerCase().includes(k)
      || String(o.value || '').toLowerCase().includes(k));
  }, [options, q]);

  const toggleOption = (val) => {
    const has = selected.some(v => v === val);
    onChange?.(has ? selected.filter(v => v !== val) : [...selected, val]);
  };
  const removeChip = (val, e) => {
    e.stopPropagation();
    onChange?.(selected.filter(v => v !== val));
  };

  const selectedDefs = options.length > 0
    ? selected.map(v => options.find(o => o.value === v)).filter(Boolean)
    : selected.map(v => ({ value: v, label: String(v) }));

  if (tagMode) {
    // fallback：逗号输入
    return (
      <input
        type="text"
        value={selected.join(', ')}
        onChange={e => onChange?.(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        placeholder={placeholder || '逗号分隔多个值'}
        disabled={disabled}
        className={[
          'w-full h-10 px-3 text-sm bg-white border rounded-base outline-none transition-all',
          disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
          error ? 'border-rose-400 focus:border-rose-500' :
          'border-gray-200 hover:border-gray-300 focus:border-primary-500',
        ].join(' ')}
      />
    );
  }

  const visibleChips = selectedDefs.slice(0, 3);
  const moreCount = selectedDefs.length - visibleChips.length;

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className={[
          'w-full min-h-10 px-2 py-1.5 text-sm bg-white border rounded-base outline-none transition-all',
          'flex items-center gap-2',
          disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
          error ? 'border-rose-400' :
          'border-gray-200 hover:border-gray-300',
          open && !disabled && !error ? 'border-primary-500 shadow-primary-focus' : '',
        ].join(' ')}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedDefs.length === 0 ? (
            <span className="text-gray-300 px-1 text-xs">{placeholder}</span>
          ) : (
            <>
              {visibleChips.map(opt => {
                const colorKey = chipColorByOption ? chipColorByOption(opt) : 'primary';
                const colorCls = CHIP_COLORS[colorKey] || CHIP_COLORS.primary;
                return (
                <span key={String(opt.value)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium max-w-[160px] ${colorCls}`}>
                  <span className="truncate">{opt.label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeChip(opt.value, e)}
                      className="hover:opacity-70 shrink-0 cursor-pointer"
                      tabIndex={-1}
                    >
                      <X size={10} />
                    </button>
                  )}
                </span>
                );
              })}
              {moreCount > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{moreCount}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <Popover
        open={open && !disabled}
        anchorRef={triggerRef}
        placement="bottom-start"
        onClose={() => { setOpen(false); setQ(''); }}
        className="bg-white rounded-base shadow-xl border border-gray-100 overflow-hidden"
        style={{ minWidth: triggerRef.current?.offsetWidth ?? 240 }}
      >
        {useSearch && (
          <div className="border-b border-gray-100 px-3 py-2 flex items-center gap-2 bg-gray-50/30">
            <Search size={12} className="text-gray-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="搜索..."
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-300"
            />
          </div>
        )}
        <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-gray-400">无匹配项</div>
          ) : filtered.map(opt => {
            const sel = selected.some(v => v === opt.value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => toggleOption(opt.value)}
                className={[
                  'w-full flex items-center justify-between px-2.5 py-2 rounded-inner text-xs transition-colors text-left',
                  sel ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                <span className="truncate">{opt.label}</span>
                {sel && <Check size={12} className="shrink-0 text-primary-600" />}
              </button>
            );
          })}
        </div>
        {selectedDefs.length > 0 && (
          <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between bg-gray-50/40">
            <span className="text-[11px] text-gray-500">已选 {selectedDefs.length}</span>
            <button
              type="button"
              onClick={() => onChange?.([])}
              className="text-[11px] text-rose-500 hover:text-rose-600"
            >
              清空
            </button>
          </div>
        )}
      </Popover>
    </>
  );
};

export default MultiSelect;
