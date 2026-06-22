import React, { useRef, useState } from 'react';
import { History, ChevronDown, Trash2 } from 'lucide-react';
import { Popover } from '../../common/Popover';
import { formatRelative } from '../utils/savedStructures';

/**
 * 历史结构下拉：列出 saved structures，按 savedAt 倒序，可应用/删除。
 *
 * Props:
 *  - items: SavedStructure[]
 *  - onApply / onDelete
 */
const SavedStructuresPicker = ({ items = [], onApply, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const count = items.length;

  return (
    <>
      <button
        type="button"
        ref={ref}
        onClick={() => setOpen(o => !o)}
        disabled={count === 0}
        className={[
          'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all border',
          count === 0
            ? 'border-neutral-100 text-neutral-300 cursor-not-allowed bg-neutral-50'
            : 'border-neutral-200 text-neutral-700 bg-white hover:border-primary-500/40 hover:text-primary-600 hover:bg-primary-50/30',
        ].join(' ')}
        title={count === 0 ? '暂无已保存结构' : ''}
      >
        <History size={12} />
        历史结构 ({count})
        {count > 0 && <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      <Popover
        open={open && count > 0}
        anchorRef={ref}
        placement="bottom-end"
        onClose={() => setOpen(false)}
        className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden w-[360px]"
      >
        <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/30">
          <p className="text-xs font-semibold text-neutral-700">已保存的结构模板</p>
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
          {items.map(it => (
            <div key={it.id} className="group flex items-start gap-2 p-2.5 rounded-base hover:bg-neutral-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">{it.name}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  <span className="uppercase font-semibold mr-2">{it.channel}</span>
                  {it.campaignType}
                  <span className="mx-2">·</span>
                  {formatRelative(it.savedAt)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { onApply?.(it); setOpen(false); }}
                  className="text-[11px] font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded-base"
                >
                  应用
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete?.(it.id); }}
                  className="text-neutral-300 hover:text-rose-500 p-1 rounded-base hover:bg-rose-50 transition-colors"
                  title="删除"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default SavedStructuresPicker;
