import React from 'react';

/** 美化文本输入：圆角 + primary 焦点态 + 错误红边 */
const TextInput = ({
  value, onChange, placeholder, disabled, error,
  type = 'text', maxLength, prefix, suffix, className = '',
}) => {
  const cls = [
    'w-full h-10 px-3 text-sm bg-white border rounded-base outline-none transition-all',
    disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' :
    error ? 'border-rose-400 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.1)]' :
    'border-gray-200 text-gray-800 hover:border-gray-300 focus:border-primary-500 focus:shadow-primary-focus',
    prefix ? 'pl-9' : '',
    suffix ? 'pr-9' : '',
    className,
  ].join(' ');
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">{prefix}</span>}
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder || ''}
        disabled={disabled}
        maxLength={maxLength}
        className={cls}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">{suffix}</span>}
    </div>
  );
};

export default TextInput;
