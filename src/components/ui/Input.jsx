import { forwardRef, useState, useId } from 'react'
import { X, CheckCircle2, Sparkles } from 'lucide-react'

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  helper,
  prefix,
  suffix,
  clearable = false,
  lunaHint,
  disabled = false,
  className = '',
  floatLabel = false,
  type = 'text',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false)
  const id = useId()
  const inputId = props.id || id

  const hasValue = value !== undefined && value !== null && value !== ''
  const hasError = !!error
  const hasSuccess = !!success && !hasError
  const showFloatLabel = floatLabel && label
  const floatActive = showFloatLabel && (focused || hasValue || !!placeholder)

  const handleClear = () => {
    if (disabled) return
    // Simulate a synthetic change event with empty string
    const syntheticEvent = { target: { value: '' } }
    onChange?.(syntheticEvent)
  }

  // Compute padding based on slots
  const leftPad = prefix ? 'pl-10' : showFloatLabel ? 'pl-3' : 'pl-3'
  const rightPadParts = []
  if (clearable && hasValue) rightPadParts.push(24) // clear button width
  if (hasSuccess) rightPadParts.push(20)
  if (lunaHint) rightPadParts.push(20)
  if (suffix) rightPadParts.push(24)
  const rightPadTotal = rightPadParts.reduce((a, b) => a + b, 0)
  const rightPad = rightPadTotal > 24 ? 'pr-16' : rightPadTotal > 0 ? 'pr-10' : 'pr-3'

  return (
    <div className="w-full">
      {/* Static label (non-float mode) */}
      {label && !floatLabel && (
        <label
          htmlFor={inputId}
          className="block text-caption font-semibold text-neutral-700 mb-1.5"
        >
          {label}
          {lunaHint && (
            <span className="inline-flex items-center ml-1.5" title={lunaHint}>
              <Sparkles size={12} className="text-luna-violet animate-luna-suggest" />
            </span>
          )}
        </label>
      )}

      <div className="relative group">
        {/* Prefix slot */}
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-body pointer-events-none flex items-center">
            {prefix}
          </span>
        )}

        {/* Float label */}
        {showFloatLabel && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-3 pointer-events-none
              transition-all duration-fast ease-default
              ${prefix ? 'left-10' : 'left-3'}
              ${floatActive
                ? 'top-1.5 text-[10px] font-semibold text-primary-500'
                : 'top-1/2 -translate-y-1/2 text-body text-neutral-400'
              }
            `}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={showFloatLabel ? (floatActive ? placeholder : '') : placeholder}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          className={`
            w-full rounded-md font-body text-body text-neutral-800
            bg-surface border outline-none
            transition-all duration-fast ease-default
            placeholder:text-neutral-400
            ${showFloatLabel ? 'h-12 pt-4 pb-1' : 'h-10 py-2'}
            ${leftPad} ${rightPad}
            ${hasError
              ? 'border-danger-500 focus:border-danger-500 focus:shadow-error-focus'
              : hasSuccess
                ? 'border-success-500 focus:border-success-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]'
                : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30'
            }
            ${disabled
              ? 'bg-neutral-50 text-neutral-400 cursor-not-allowed hover:border-neutral-200'
              : ''
            }
            ${className}
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />

        {/* Right side icons container */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {/* Luna hint sparkle (inline, when no static label) */}
          {lunaHint && floatLabel && (
            <span title={lunaHint} className="pointer-events-auto cursor-help">
              <Sparkles size={14} className="text-luna-violet animate-luna-suggest" />
            </span>
          )}

          {/* Success check */}
          {hasSuccess && !hasError && (
            <CheckCircle2 size={16} className="text-success-500 shrink-0" />
          )}

          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              className="pointer-events-auto p-0.5 rounded-sm text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors duration-fast"
              aria-label="Clear"
            >
              <X size={14} />
            </button>
          )}

          {/* Suffix slot */}
          {suffix && (
            <span className="text-neutral-400 text-body shrink-0">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Error message */}
      {hasError && (
        <p className="text-caption text-danger-500 mt-1 animate-slide-up">{error}</p>
      )}

      {/* Success message */}
      {hasSuccess && typeof success === 'string' && (
        <p className="text-caption text-success-600 mt-1">{success}</p>
      )}

      {/* Helper text */}
      {!hasError && !hasSuccess && helper && (
        <p className="text-caption text-neutral-500 mt-1">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
