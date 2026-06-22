import React, { useRef, useState, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { Popover } from '../../../common/Popover';

/**
 * 美化 Single Select：触发器卡片 + Popover 下拉。
 * 选项 ≥ 8 自动启用搜索框。
 */
const Select = ({
  value, onChange, options = [], placeholder = '请选择...',
  disabled, error, searchable,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const triggerRef = useRef(null);

  const useSearch = searchable !== undefined ? searchable : (options.length >= 8);
  const filtered = useMemo(() => {
    if (!q) return options;
    const k = q.toLowerCase();
    return options.filter(o => String(o.label || '').toLowerCase().includes(k)
      || String(o.value || '').toLowerCase().includes(k));
  }, [options, q]);

  const selected = options.find(o => o.value === value);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className={[
          'w-full h-10 px-3 text-sm bg-white border rounded-base outline-none transition-all',
          'flex items-center justify-between gap-2',
          disabled ? 'border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed' :
          error ? 'border-rose-400' :
          'border-neutral-200 hover:border-neutral-300 focus:border-primary-500',
          open && !disabled && !error ? 'border-primary-500 shadow-primary-focus' : '',
        ].join(' ')}
      >
        <span className={`truncate text-left flex-1 ${selected ? 'text-neutral-800' : 'text-neutral-300'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-neutral-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <Popover
        open={open && !disabled}
        anchorRef={triggerRef}
        placement="bottom-start"
        onClose={() => { setOpen(false); setQ(''); }}
        className="bg-white rounded-base shadow-xl border border-neutral-100 overflow-hidden min-w-[var(--anchor-width,200px)]"
        style={{ minWidth: triggerRef.current?.offsetWidth ?? 200 }}
      >
        {useSearch && (
          <div className="border-b border-neutral-100 px-3 py-2 flex items-center gap-2 bg-neutral-50/30">
            <Search size={12} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="搜索..."
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-neutral-300"
            />
          </div>
        )}
        <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-neutral-400">无匹配项</div>
          ) : filtered.map(opt => {
            const sel = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => { onChange?.(opt.value); setOpen(false); setQ(''); }}
                className={[
                  'w-full flex items-center justify-between px-2.5 py-2 rounded-inner text-xs transition-colors text-left',
                  sel ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-neutral-700 hover:bg-neutral-50',
                ].join(' ')}
              >
                <span className="truncate">{opt.label}</span>
                {sel && <Check size={12} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>
    </>
  );
};

export default Select;
