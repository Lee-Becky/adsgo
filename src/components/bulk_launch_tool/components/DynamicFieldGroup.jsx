import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { FIELD_GROUP_LABELS, validateField, evaluateDependsOn } from '../fieldDefinitions/schema';

/**
 * Phase 2.A：透传 rootFormData，实时计算 errors 并传给 Renderer。
 */
const DynamicFieldGroup = ({
  groupKey,
  fields,
  levelFormData,
  rootFormData,
  onFieldChange,
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  if (!fields || fields.length === 0) return null;

  const errors = useMemo(() => {
    const e = {};
    for (const def of fields) {
      if (!evaluateDependsOn(def, levelFormData, rootFormData)) continue;
      const err = validateField(def, levelFormData?.[def.name], levelFormData, rootFormData);
      if (err) e[def.name] = err;
    }
    return e;
  }, [fields, levelFormData, rootFormData]);

  const visibleFields = fields.filter(f => evaluateDependsOn(f, levelFormData, rootFormData));
  const errorCount = Object.keys(errors).length;

  return (
    <div className="border border-neutral-100 rounded-inner bg-white mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            {FIELD_GROUP_LABELS[groupKey] || groupKey}
          </span>
          <span className="text-[10px] text-neutral-400">
            {visibleFields.length} 字段
            {errorCount > 0 && (
              <span className="ml-2 text-rose-500 font-medium">· {errorCount} 项待修</span>
            )}
          </span>
        </div>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
      {!collapsed && (
        <div className="px-3 py-3 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          {fields.map(def => (
            <DynamicFieldRenderer
              key={def.name}
              def={def}
              value={levelFormData?.[def.name]}
              onChange={(next) => onFieldChange?.(def.name, next)}
              levelFormData={levelFormData}
              rootFormData={rootFormData}
              error={errors[def.name]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicFieldGroup;
