import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 hover:-translate-y-px hover:shadow-primary-soft active:bg-primary-700 active:translate-y-0 active:scale-[0.97] active:shadow-xs',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  link:      'bg-transparent text-primary-500 hover:text-primary-600 hover:underline p-0 h-auto',
}

const sizes = {
  sm: 'h-7 text-xs px-3 gap-1.5 rounded-md',
  md: 'h-9 text-sm px-4 gap-2 rounded-lg',
  lg: 'h-11 text-base px-5 gap-2.5 rounded-lg',
}

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  iconOnly = false,
  className = '',
  children,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200
        ${variants[variant] || variants.primary}
        ${variant !== 'link' ? sizes[size] || sizes.md : ''}
        ${iconOnly ? `!px-0 ${size === 'sm' ? 'w-7' : size === 'lg' ? 'w-11' : 'w-9'}` : ''}
        ${isDisabled ? 'opacity-40 pointer-events-none' : ''}
        ${className}
      `.trim()}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {!loading && Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {!iconOnly && children}
      {IconRight && <IconRight size={size === 'sm' ? 14 : 16} />}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
