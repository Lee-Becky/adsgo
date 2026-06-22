import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * 渲染 type='composite' 的字段。把 value 视作对象，每个 subField 读写 value[subField.name]。
 * 子字段递归走 DynamicFieldRenderer。为避免循环依赖，调用方传入 renderer 引用。
 *
 * Props:
 *  - def: FieldDef (type='composite', subFields: FieldDef[])
 *  - value: object
 *  - onChange: (next: object) => void
 *  - rootFormData: object
 *  - parentLevelFormData: object   父字段所在 level 的 formData（用于 dependsOn 求值）
 *  - errors?: { [subFieldName]: string }
 *  - renderField: (subDef, subValue, subOnChange) => ReactNode
 */
const CompositeFieldRenderer = ({
  def, value, onChange, rootFormData, parentLevelFormData, errors = {}, renderField,
}) => {
  const [open, setOpen] = useState(false);
  const obj = value && typeof value === 'object' ? value : {};
  const setSub = (subName, subValue) => {
    const next = { ...obj, [subName]: subValue };
    onChange?.(next);
  };
  const filledKeys = Object.keys(obj).filter(k => {
    const v = obj[k];
    return !(v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0));
  });

  return (
    <div className="border border-neutral-200 rounded-inner bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-neutral-700 truncate">{def.label}</span>
          {def.required && <span className="text-rose-500 text-xs">*</span>}
          <span className="text-[10px] text-neutral-400 font-mono truncate">{def.sdkPath}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {filledKeys.length > 0 && (
            <span className="text-[10px] text-primary-500 font-medium">
              已填 {filledKeys.length} / {def.subFields.length}
            </span>
          )}
          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-neutral-100 px-3 py-3 bg-neutral-50/40 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          {(def.subFields || []).map(subDef => (
            <React.Fragment key={subDef.name}>
              {renderField(
                subDef,
                obj[subDef.name],
                (next) => setSub(subDef.name, next),
                obj,           // 子级的 levelFormData = composite 内部对象
                rootFormData,  // 跨 level dependsOn 仍用 root
                errors[subDef.name]
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      {def.helpText && (
        <div className="px-3 pb-2 text-[10px] text-neutral-400">{def.helpText}</div>
      )}
    </div>
  );
};

export default CompositeFieldRenderer;
