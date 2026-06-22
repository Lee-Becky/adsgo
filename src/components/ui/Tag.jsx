import { X } from 'lucide-react'

const variantStyles = {
  default: {
    base: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    hover: 'hover:bg-neutral-200',
    removeHover: 'hover:bg-neutral-300 hover:text-neutral-800',
  },
  primary: {
    base: 'bg-primary-50 text-primary-700 border-primary-200',
    hover: 'hover:bg-primary-100',
    removeHover: 'hover:bg-primary-200 hover:text-primary-800',
  },
  success: {
    base: 'bg-success-50 text-success-700 border-success-200',
    hover: 'hover:bg-success-100',
    removeHover: 'hover:bg-success-200 hover:text-success-700',
  },
  warning: {
    base: 'bg-warning-50 text-warning-700 border-warning-200',
    hover: 'hover:bg-warning-100',
    removeHover: 'hover:bg-warning-200 hover:text-warning-700',
  },
  danger: {
    base: 'bg-danger-50 text-danger-700 border-danger-200',
    hover: 'hover:bg-danger-100',
    removeHover: 'hover:bg-danger-200 hover:text-danger-700',
  },
  luna: {
    base: 'text-luna-violet border-luna-border',
    hover: 'hover:border-luna-violet/40',
    removeHover: 'hover:bg-luna-violet/20 hover:text-luna-violet',
  },
}

const sizeStyles = {
  sm: {
    tag: 'h-6 text-xs px-2 gap-1 rounded-base',
    icon: 14,
    removeBtn: 'w-3.5 h-3.5 rounded-xs',
    removeIcon: 10,
  },
  md: {
    tag: 'h-7 text-body px-2.5 gap-1.5 rounded-md',
    icon: 16,
    removeBtn: 'w-4 h-4 rounded-sm',
    removeIcon: 12,
  },
}

const Tag = ({
  label,
  variant = 'default',
  removable = false,
  onRemove,
  icon: Icon,
  size = 'sm',
  className = '',
}) => {
  const style = variantStyles[variant] || variantStyles.default
  const dim = sizeStyles[size] || sizeStyles.sm
  const isLuna = variant === 'luna'

  return (
    <span
      className={`
        group inline-flex items-center font-medium border
        transition-colors duration-fast
        ${style.base} ${style.hover}
        ${dim.tag}
        ${isLuna ? 'bg-gradient-to-r from-luna-violet/5 to-luna-amber/5' : ''}
        ${className}
      `.trim()}
    >
      {/* Icon */}
      {Icon && <Icon size={dim.icon} className="shrink-0" />}

      {/* Label */}
      <span className="truncate max-w-[160px]">{label}</span>

      {/* Remove button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={`
            inline-flex items-center justify-center shrink-0
            transition-colors duration-fast
            opacity-60 group-hover:opacity-100
            ${dim.removeBtn} ${style.removeHover}
            rounded-full
          `.trim()}
          aria-label={`Remove ${label}`}
        >
          <X size={dim.removeIcon} />
        </button>
      )}
    </span>
  )
}

Tag.displayName = 'Tag'
export default Tag
