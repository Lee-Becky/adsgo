import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
  label,
  helper,
  error,
  options = [],
  placeholder,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full h-10 px-3 pr-9 rounded-lg appearance-none cursor-pointer
            bg-surface-2 border text-sm text-gray-800
            outline-none transition-all duration-200
            ${hasError
              ? 'border-red-500 focus:ring-[3px] focus:ring-red-500/8'
              : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/8 focus:bg-white'
            }
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${className}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value
            const label = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={value} value={value}>{label}</option>
            )
          })}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {!error && helper && (
        <p className="text-xs text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
