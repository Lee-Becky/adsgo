import { Sparkles } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   LunaBadge — "AI Generated" / "Luna" visual marker
   Used to tag content generated or analyzed by Luna
   ═══════════════════════════════════════════════════════════ */

const variants = {
  /* Default — subtle gradient bg */
  default: 'bg-luna-bg text-luna-violet border border-luna-border',
  /* Solid — more prominent */
  solid: 'bg-luna-violet text-white',
  /* Ghost — minimal, just text + icon */
  ghost: 'text-luna-violet',
  /* Gradient — eye-catching */
  gradient: 'text-white border-0',
}

const LunaBadge = ({
  label = 'Luna',
  variant = 'default',
  showIcon = true,
  size = 'sm',
  className = '',
}) => {
  const isGradient = variant === 'gradient'
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-caption'
  const iconSize = size === 'xs' ? 10 : 12
  const padding = size === 'xs' ? 'px-1.5 py-px' : 'px-2 py-0.5'

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-semibold leading-none',
        textSize,
        padding,
        variants[variant] || variants.default,
        className,
      ].filter(Boolean).join(' ')}
      style={isGradient ? { background: 'var(--luna-gradient)' } : undefined}
    >
      {showIcon && <Sparkles size={iconSize} className="shrink-0" />}
      {label}
    </span>
  )
}

export default LunaBadge
