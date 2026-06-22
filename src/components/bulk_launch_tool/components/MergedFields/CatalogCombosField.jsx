import React, { useMemo } from 'react';
import { Plus, X, Info } from 'lucide-react';
import Select from '../controls/Select';
import MultiSelect from '../controls/MultiSelect';
import { META_CATALOGS, META_PRODUCT_SETS, TIKTOK_CATALOGS, TIKTOK_PRODUCT_SETS } from '../../services/platformResources';

/**
 * DPA 多目录-系列组合：用户可添加多组 [catalog + product_sets]。
 * 同一 catalog 不可重复选；product_sets 多选。
 *
 * 数据形态：value = [{ catalog_id, product_set_ids: [] }, ...]
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - value: array
 *  - onChange: (next) => void
 */
const CatalogCombosField = ({ channel, value, onChange, helpText }) => {
  const catalogs = channel === 'tiktok' ? TIKTOK_CATALOGS : META_CATALOGS;
  const productSets = channel === 'tiktok' ? TIKTOK_PRODUCT_SETS : META_PRODUCT_SETS;
  const combos = Array.isArray(value) ? value : [];

  const usedCatalogIds = useMemo(
    () => new Set(combos.map(c => c.catalog_id).filter(Boolean)),
    [combos]
  );

  const updateCombo = (idx, patch) => {
    const next = combos.map((c, i) => i === idx ? { ...c, ...patch } : c);
    onChange?.(next);
  };
  const removeCombo = (idx) => {
    onChange?.(combos.filter((_, i) => i !== idx));
  };
  const addCombo = () => {
    onChange?.([...combos, { catalog_id: '', product_set_ids: [] }]);
  };

  return (
    <div className="flex flex-col gap-2 col-span-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-neutral-700">
            目录与系列组合
            <span className="text-rose-500 ml-0.5">*</span>
          </label>
          <span title={helpText || '每个目录将生成 1 个 Campaign，每个商品系列生成 1 个 Adset。同一目录仅可选 1 次。'}
            className="text-neutral-300 cursor-help"><Info size={11} /></span>
        </div>
        <button
          type="button"
          onClick={addCombo}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-1 rounded-base transition-colors"
        >
          <Plus size={12} /> 添加目录组合
        </button>
      </div>

      {combos.length === 0 && (
        <div className="text-center py-6 px-4 bg-neutral-50 border border-dashed border-neutral-200 rounded-base">
          <p className="text-xs text-neutral-400">暂无目录组合，点击右上「添加目录组合」开始</p>
        </div>
      )}

      <div className="space-y-2">
        {combos.map((combo, idx) => {
          const catalogOpts = catalogs.filter(c =>
            c.value === combo.catalog_id || !usedCatalogIds.has(c.value)
          );
          return (
            <div key={idx} className="flex items-start gap-2 p-3 bg-white border border-neutral-100 rounded-base">
              <span className="text-[10px] font-bold text-neutral-400 mt-2.5 shrink-0 w-5 text-center">{idx + 1}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">目录</span>
                  <Select
                    value={combo.catalog_id}
                    onChange={(v) => updateCombo(idx, { catalog_id: v })}
                    options={catalogOpts}
                    placeholder="选择目录..."
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">商品系列（多选）</span>
                  <MultiSelect
                    value={combo.product_set_ids}
                    onChange={(v) => updateCombo(idx, { product_set_ids: v })}
                    options={productSets}
                    placeholder="选择商品系列..."
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCombo(idx)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors mt-1 shrink-0"
                title="删除该组合"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <span className="text-[10px] text-neutral-300 font-mono truncate">_dpa_combos · 派生 → campaigns × adsets</span>
    </div>
  );
};

export default CatalogCombosField;
