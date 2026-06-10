import React, { useState, useRef, useMemo } from 'react';
import { History, ChevronDown, Trash2 } from 'lucide-react';
import { Popover } from '../../../common/Popover';
import { listNamingTemplates, deleteNamingTemplate } from '../../utils/savedNamingTemplates';

/**
 * Phase 2.O：历史命名下拉触发器 —— 单独提出来好放进 DynamicFieldRenderer 的「label 右侧」位置。
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - level: 'campaign' | 'adset' | 'ad'
 *  - onApply: (template: string) => void
 */
const HistoryNamingDropdown = ({ channel, level, onApply }) => {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState(0);

  const templates = useMemo(
    () => listNamingTemplates(channel, level),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channel, level, version, open]
  );

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    deleteNamingTemplate(id);
    setVersion(v => v + 1);
  };

  const handlePick = (item) => {
    onApply?.(item.template || '');
    setOpen(false);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(o => !o); }}
        className="inline-flex items-center gap-1 h-6 px-1.5 text-[10px] font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-base transition-colors"
        title="使用历史命名策略"
      >
        <History size={10} /> 历史命名 <ChevronDown size={9} />
      </button>

      <Popover
        open={open}
        anchorRef={btnRef}
        onClose={() => setOpen(false)}
        placement="bottom-end"
        className="bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 min-w-[280px] max-w-[400px] max-h-[320px] overflow-auto"
      >
        {templates.length === 0 ? (
          <p className="px-3 py-4 text-xs text-gray-400 text-center">本层级暂无历史命名</p>
        ) : (
          templates.map(it => (
            <div
              key={it.id}
              onClick={() => handlePick(it)}
              className="px-3 py-2 hover:bg-primary-50/40 transition-colors cursor-pointer flex items-center gap-2 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{it.name}</p>
                <p className="text-[10px] text-gray-500 font-mono truncate mt-0.5">{it.template}</p>
              </div>
              <button
                type="button"
                onClick={(e) => handleDelete(it.id, e)}
                className="shrink-0 p-1 text-gray-300 hover:text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                title="删除"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))
        )}
      </Popover>
    </>
  );
};

export default HistoryNamingDropdown;
