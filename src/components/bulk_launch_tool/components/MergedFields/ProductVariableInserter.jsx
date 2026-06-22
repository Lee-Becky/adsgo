import React, { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Popover } from '../../../common/Popover';

/**
 * 商品变量占位符列表 — Meta DPA + TikTok CATALOG_CAROUSEL 标准合集。
 * UI 用 `{{product.x}}` 统一书写；publish 阶段由 SDK 适配器按 channel 转写为各自 SDK 的实际占位语法。
 */
export const PRODUCT_VARIABLES = [
  { token: '{{product.name}}',          label: '商品名称' },
  { token: '{{product.brand}}',         label: '品牌'     },
  { token: '{{product.current_price}}', label: '现价'     },
  { token: '{{product.price}}',         label: '原价'     },
  { token: '{{product.description}}',   label: '商品描述' },
  { token: '{{product.id}}',            label: '商品 ID'  },
  { token: '{{product.sku}}',           label: 'SKU'      },
  { token: '{{product.category}}',      label: '类目'     },
];

/**
 * 「+ 变量」chip 按钮，点击弹 Popover 列出 PRODUCT_VARIABLES。
 * 选中后调用 onInsert(token)，由调用方决定如何拼接（v1 简化为附加到字符串末尾）。
 *
 * Props:
 *  - onInsert: (token: string) => void
 *  - size?: 'xs' | 'sm'   chip 的紧凑度
 */
const ProductVariableInserter = ({ onInsert, size = 'xs' }) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const padding = size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-1.5 py-0.5 text-[10px]';

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        title="插入商品变量"
        className={`inline-flex items-center gap-1 ${padding} rounded-full border border-primary-200 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:border-primary-300 font-medium transition-colors`}
      >
        <Plus size={size === 'sm' ? 12 : 10} strokeWidth={2.5} />
        <span>变量</span>
      </button>

      <Popover
        open={open}
        anchorRef={anchorRef}
        placement="bottom-end"
        offset={4}
        onClose={() => setOpen(false)}
        closeOnContentClick
        className="bg-white rounded-base shadow-xl border border-neutral-100 overflow-hidden min-w-[200px] py-1"
      >
        <div className="px-2.5 py-1.5 border-b border-neutral-50">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">商品变量</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">发布时按当前商品自动替换</p>
        </div>
        <div className="max-h-[280px] overflow-y-auto py-1">
          {PRODUCT_VARIABLES.map(v => (
            <button
              key={v.token}
              type="button"
              onClick={() => { onInsert?.(v.token); setOpen(false); }}
              className="w-full flex items-center justify-between gap-3 px-3 py-1.5 text-left hover:bg-neutral-50 transition-colors"
            >
              <span className="text-xs font-medium text-neutral-700">{v.label}</span>
              <span className="text-[10px] font-mono text-primary-500">{v.token}</span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default ProductVariableInserter;
