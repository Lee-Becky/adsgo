import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * 美化日期/时间输入：含 calendar 图标的卡片，与其它控件视觉统一。
 *
 * Props:
 *  - value / onChange / disabled / error
 *  - type: 'date' | 'datetime'
 */
const DateTimeInput = ({ value, onChange, disabled, error, type = 'date' }) => {
  const cls = [
    'w-full h-10 pl-9 pr-3 text-sm bg-white border rounded-base outline-none transition-all',
    disabled ? 'border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed' :
    error ? 'border-rose-400 focus:border-rose-500' :
    'border-neutral-200 text-neutral-800 hover:border-neutral-300 focus:border-primary-500 focus:shadow-primary-focus',
  ].join(' ');
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
        <Calendar size={14} strokeWidth={2.2} />
      </span>
      <input
        type={type === 'datetime' ? 'datetime-local' : 'date'}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className={cls}
      />
    </div>
  );
};

export default DateTimeInput;
