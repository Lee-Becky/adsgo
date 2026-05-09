import React from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { evaluateDependsOn, filterVisibleOptions } from '../fieldDefinitions/schema';
import CompositeFieldRenderer from './CompositeFieldRenderer';
import TextInput from './controls/TextInput';
import NumberInput from './controls/NumberInput';
import Select from './controls/Select';
import MultiSelect from './controls/MultiSelect';
import Switch from './controls/Switch';
import DateTimeInput from './controls/DateTimeInput';

/**
 * 单字段渲染器（Phase 2.D：派发到美化控件）。
 *
 * Props:
 *  - def: FieldDef
 *  - value: any
 *  - onChange: (next) => void
 *  - levelFormData / rootFormData
 *  - error?: string
 *  - hideSdkPath?: boolean  合并控件内部不显示 SDK 路径行
 */
const DynamicFieldRenderer = ({
  def, value, onChange, levelFormData, rootFormData, error, hideSdkPath,
  // Phase 2.J：节点级 override 视觉（detail panel 模式下传入）
  isOverridden = false, onReset,
  // 窄面板模式（架构树右侧详情面板）：单列、标签头允许换行、隐藏 SDK path
  compact = false,
}) => {
  if (!evaluateDependsOn(def, levelFormData, rootFormData)) return null;
  if (def.hideInUi) return null;

  const disabled = !!def.comingSoon;
  const handleChange = (next) => { if (!disabled) onChange?.(next); };
  const isRequired = def.required
    || (typeof def.requiredWhen === 'function' && def.requiredWhen(value, rootFormData));

  // Phase 2.H V3：col-span 元数据控制网格占宽
  // 默认：textarea/json/composite → full；其它 → 1
  // compact 模式下父容器是 flex column，无网格 → col-span 无意义
  const inferredColSpan = def.colSpan
    || (def.type === 'composite' || def.type === 'json' || def.type === 'textarea' ? 'full' : 1);
  const colSpanCls = compact
    ? ''
    : inferredColSpan === 'full' ? 'col-span-full' :
      inferredColSpan === 2 ? 'md:col-span-2' : '';

  // composite 字段
  if (def.type === 'composite' && Array.isArray(def.subFields)) {
    return (
      <div className={`flex flex-col gap-1.5 ${colSpanCls}`}>
        <CompositeFieldRenderer
          def={def}
          value={value}
          onChange={handleChange}
          rootFormData={rootFormData}
          parentLevelFormData={levelFormData}
          renderField={(subDef, subValue, subOnChange, subParentForm, root, subError) => (
            <DynamicFieldRenderer
              key={subDef.name}
              def={subDef}
              value={subValue}
              onChange={subOnChange}
              levelFormData={subParentForm}
              rootFormData={root}
              error={subError}
              compact={compact}
            />
          )}
        />
        {error && <span className="text-[11px] text-rose-500">{error}</span>}
      </div>
    );
  }

  let control = null;
  switch (def.type) {
    case 'text':
    case 'url':
      control = (
        <TextInput
          value={value}
          onChange={handleChange}
          placeholder={def.placeholder}
          disabled={disabled}
          error={error}
          type={def.type === 'url' ? 'url' : 'text'}
          maxLength={def.validation?.maxLength}
        />
      );
      break;
    case 'textarea':
      control = (
        <textarea
          rows={3}
          value={value ?? ''}
          onChange={e => handleChange(e.target.value)}
          placeholder={def.placeholder || ''}
          disabled={disabled}
          maxLength={def.validation?.maxLength}
          className={[
            'w-full px-3 py-2 text-sm bg-white border rounded-base outline-none resize-y transition-all',
            disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
            error ? 'border-rose-400 focus:border-rose-500' :
            'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus',
          ].join(' ')}
        />
      );
      break;
    case 'number':
      control = (
        <NumberInput value={value} onChange={handleChange} placeholder={def.placeholder}
          disabled={disabled} error={error}
          min={def.validation?.min} max={def.validation?.max} step={def.validation?.step} />
      );
      break;
    case 'currency':
      control = (
        <NumberInput value={value} onChange={handleChange} placeholder={def.placeholder}
          disabled={disabled} error={error} prefix="$"
          min={def.validation?.min} max={def.validation?.max} step={def.validation?.step} />
      );
      break;
    case 'percent':
      control = (
        <NumberInput value={value} onChange={handleChange} placeholder={def.placeholder}
          disabled={disabled} error={error} suffix="%"
          min={def.validation?.min} max={def.validation?.max} step={def.validation?.step} />
      );
      break;
    case 'select':
      control = (
        <Select value={value} onChange={handleChange}
          options={filterVisibleOptions(def, levelFormData, rootFormData)}
          placeholder={def.placeholder} disabled={disabled} error={error} />
      );
      break;
    case 'multiselect':
      control = (
        <MultiSelect value={value} onChange={handleChange}
          options={filterVisibleOptions(def, levelFormData, rootFormData)}
          placeholder={def.placeholder} disabled={disabled} error={error} />
      );
      break;
    case 'tags':
      control = (
        <MultiSelect value={value} onChange={handleChange}
          options={[]} placeholder={def.placeholder || '逗号分隔多个值'}
          disabled={disabled} error={error} />
      );
      break;
    case 'switch':
      control = (
        <Switch value={value} onChange={handleChange} disabled={disabled}
          labels={{ on: '开启', off: '关闭' }} />
      );
      break;
    case 'date':
    case 'datetime':
      control = (
        <DateTimeInput
          value={value} onChange={handleChange}
          disabled={disabled} error={error}
          type={def.type}
        />
      );
      break;
    case 'json':
    default:
      control = (
        <textarea
          rows={3}
          value={typeof value === 'string' ? value : (value ? JSON.stringify(value, null, 2) : '')}
          onChange={e => {
            const txt = e.target.value;
            try { handleChange(txt ? JSON.parse(txt) : null); }
            catch { handleChange(txt); }
          }}
          placeholder={def.placeholder || '{ } / [ ]'}
          disabled={disabled}
          className={[
            'w-full px-3 py-2 text-[11px] font-mono bg-white border rounded-base outline-none resize-y transition-all',
            disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
            error ? 'border-rose-400' :
            'border-gray-200 hover:border-gray-300 focus:border-primary-500',
          ].join(' ')}
        />
      );
      break;
  }

  return (
    <div className={`flex flex-col gap-1.5 ${colSpanCls}`}>
      <div className={`flex items-center gap-x-1.5 ${compact ? 'flex-wrap gap-y-1' : ''}`}>
        <label className="text-xs font-medium text-gray-700">
          {def.label}
          {isRequired && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {def.helpText && (
          <span title={def.helpText} className="text-gray-300 cursor-help">
            <Info size={11} />
          </span>
        )}
        {disabled && (
          <span className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-semibold">
            Coming Soon
          </span>
        )}
        {/* Phase 2.J：override 视觉 */}
        {isOverridden && (
          <span className="ml-auto inline-flex items-center gap-1">
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-semibold border border-violet-100">
              已覆盖
            </span>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                title="清除覆盖，恢复继承自模板"
                className="w-5 h-5 inline-flex items-center justify-center rounded text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              >
                <RotateCcw size={11} />
              </button>
            )}
          </span>
        )}
        {!isOverridden && onReset !== undefined && (
          // Detail panel 模式但未 override → 显示"继承"灰色 chip（与 onReset 同位）
          <span className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 font-semibold border border-gray-100">
            继承
          </span>
        )}
      </div>
      {control}
      {!compact && !hideSdkPath && def.sdkPath && (
        <span className="text-[10px] text-gray-300 font-mono truncate">{def.sdkPath}</span>
      )}
      {error && <span className="text-[11px] text-rose-500">{error}</span>}
    </div>
  );
};

export default DynamicFieldRenderer;
