/* ═══════════════════════════════════════════════════════════
   Badge — AdsGo 2.0 "Luminous Precision"
   Covers: generic Badge, legacy StatusBadge, legacy CountBadge
   ═══════════════════════════════════════════════════════════ */

/* ── Variant color map ──────────────────────────────────────── */
const variantStyles = {
  default:
    'bg-neutral-100 text-neutral-700',
  success:
    'bg-success-50 text-success-700',
  warning:
    'bg-warning-50 text-warning-700',
  danger:
    'bg-danger-50 text-danger-700',
  info:
    'bg-info-50 text-info-700',
  luna:
    'text-luna-violet',
  outline:
    'bg-transparent border border-neutral-300 text-neutral-700',
}

/* Luna variant gets a subtle gradient bg via inline style */
const lunaBg = 'var(--luna-gradient-subtle)'

/* ── Dot colors (matches variant) ───────────────────────────── */
const dotColors = {
  default: 'bg-neutral-400',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
  info:    'bg-info-500',
  luna:    'bg-luna-violet',
  outline: 'bg-neutral-400',
}

/* ── Size presets ───────────────────────────────────────────── */
const sizeStyles = {
  sm: 'h-5 px-1.5 text-[10px] gap-1',
  md: 'h-[22px] px-2.5 text-xs gap-1.5',
}

/* ── Main Badge Component ───────────────────────────────────── */
const Badge = ({
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  children,
}) => {
  const isLuna = variant === 'luna'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-semibold leading-none select-none shrink-0',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.md,
        className,
      ].filter(Boolean).join(' ')}
      style={isLuna ? { background: lunaBg } : undefined}
    >
      {dot && (
        <span
          className={[
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant] || dotColors.default,
          ].join(' ')}
        />
      )}
      {children}
    </span>
  )
}

/* ── StatusBadge (backward-compat wrapper) ──────────────────── */
const statusToVariant = {
  active:   'success',
  paused:   'default',
  error:    'danger',
  learning: 'warning',
  draft:    'default',
  info:     'info',
}

export const StatusBadge = ({ status = 'active', label, className = '' }) => {
  const variant = statusToVariant[status] || 'default'
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Badge variant={variant} size="md" dot className={className}>
      {displayLabel}
    </Badge>
  )
}

/* ── CountBadge (backward-compat wrapper) ───────────────────── */
export const CountBadge = ({ count = 0, className = '' }) => {
  if (count <= 0) return null

  return (
    <span
      className={[
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
        'rounded-full bg-danger-500 text-white font-mono text-[9px] font-bold leading-none',
        className,
      ].filter(Boolean).join(' ')}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default Badge
