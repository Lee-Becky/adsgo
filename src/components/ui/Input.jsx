import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  helper,
  error,
  prefix,
  suffix,
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
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full h-10 px-3 rounded-lg
            bg-surface-2 border text-sm text-gray-800
            placeholder:text-gray-400
            outline-none transition-all duration-200
            ${hasError
              ? 'border-red-500 focus:ring-[3px] focus:ring-red-500/8'
              : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/8 focus:bg-white'
            }
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-8' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
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

Input.displayName = 'Input'
export default Input
