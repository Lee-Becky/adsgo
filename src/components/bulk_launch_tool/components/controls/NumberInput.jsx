import React from 'react';

/** 美化数字输入：含可选前后缀（$ / %） */
const NumberInput = ({
  value, onChange, placeholder, disabled, error,
  min, max, step, prefix, suffix,
}) => {
  const cls = [
    'w-full h-10 text-sm bg-white border rounded-base outline-none transition-all tabular-nums',
    disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
    error ? 'border-rose-400 focus:border-rose-500' :
    'border-gray-200 text-gray-800 hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus',
    prefix ? 'pl-8' : 'pl-3',
    suffix ? 'pr-8' : 'pr-3',
    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  ].join(' ');
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium">{prefix}</span>}
      <input
        type="number"
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder || ''}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={cls}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">{suffix}</span>}
    </div>
  );
};

export default NumberInput;
