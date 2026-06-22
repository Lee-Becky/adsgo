import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

/* ── Variant styles ─────────────────────────────────────────── */
const variantStyles = {
  primary:
    'bg-primary-500 text-white shadow-xs hover:bg-primary-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary-500/40 active:bg-primary-700',
  secondary:
    'bg-white border border-neutral-200 text-neutral-800 shadow-xs hover:bg-neutral-50 hover:border-neutral-300 focus-visible:ring-2 focus-visible:ring-primary-500/30 active:bg-neutral-100',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500/30 active:bg-neutral-200',
  danger:
    'bg-danger-500 text-white shadow-xs hover:bg-danger-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-danger-500/40 active:bg-danger-700',
  luna:
    'relative bg-white text-luna-violet shadow-xs hover:shadow-luna focus-visible:ring-2 focus-visible:ring-luna-violet/40 active:bg-luna-bg',
  /* 1.0 backward-compat */
  link:
    'bg-transparent text-primary-500 hover:text-primary-600 hover:underline !p-0 !h-auto',
}

/* ── Size styles ────────────────────────────────────────────── */
const sizeStyles = {
  sm: 'h-8 text-caption px-3 gap-1.5 rounded-md',
  md: 'h-9 text-body px-4 gap-2 rounded-md',
  lg: 'h-11 text-body-lg px-5 gap-2.5 rounded-lg',
}

/* ── Icon sizes per button size ─────────────────────────────── */
const iconSizes = { sm: 14, md: 16, lg: 18 }

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  /* backward-compat aliases */
  iconRight: IconRight,
  iconOnly = false,
  className = '',
  children,
  ...props
}, ref) => {
  const isDisabled = disabled || loading
  const iconPx = iconSizes[size] || iconSizes.md
  const isIconOnly = iconOnly || (!children && Icon)
  const isLuna = variant === 'luna'
  const isLink = variant === 'link'

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold',
        'select-none outline-none',
        'transition-all duration-fast ease-default',
        'active:scale-[0.98]',
        variantStyles[variant] || variantStyles.primary,
        !isLink ? (sizeStyles[size] || sizeStyles.md) : '',
        isIconOnly ? `!px-0 ${size === 'sm' ? 'w-8' : size === 'lg' ? 'w-11' : 'w-9'}` : '',
        isDisabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {/* Loading spinner replaces left icon */}
      {loading && (
        <Loader2 size={iconPx} className="animate-spin shrink-0" />
      )}

      {/* Left icon */}
      {!loading && Icon && (iconPosition === 'left' || isIconOnly) && (
        <Icon size={iconPx} className="shrink-0" />
      )}

      {/* Label */}
      {!isIconOnly && children}

      {/* Right icon (new prop or backward-compat iconRight) */}
      {!loading && Icon && iconPosition === 'right' && !isIconOnly && (
        <Icon size={iconPx} className="shrink-0" />
      )}
      {!loading && IconRight && (
        <IconRight size={iconPx} className="shrink-0" />
      )}

      {/* Luna gradient border effect (CSS pseudo-element driven) */}
      {isLuna && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
          style={{
            background: 'var(--luna-gradient)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
