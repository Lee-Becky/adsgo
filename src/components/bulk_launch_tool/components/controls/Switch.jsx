import React from 'react';

/** 美化 Toggle Switch */
const Switch = ({ value, onChange, disabled, labels }) => {
  const on = !!value;
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange?.(!on)}
      disabled={disabled}
      aria-pressed={on}
      className={[
        'relative inline-flex items-center h-6 w-11 rounded-full transition-colors shrink-0',
        on ? 'bg-primary-500' : 'bg-neutral-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90',
      ].join(' ')}
    >
      <span
        className="inline-block w-5 h-5 bg-white rounded-full shadow transition-transform"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }}
      />
      {labels && (
        <span className={`ml-14 text-xs ${disabled ? 'text-neutral-400' : 'text-neutral-500'}`}>
          {on ? labels.on : labels.off}
        </span>
      )}
    </button>
  );
};

export default Switch;
