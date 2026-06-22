import { forwardRef } from 'react'

/* ── Variant styles ─────────────────────────────────────────── */
const variantStyles = {
  flat:
    'bg-white border border-neutral-200',
  elevated:
    'bg-white border border-neutral-200 shadow-sm',
  interactive:
    'bg-white border border-neutral-200 shadow-sm cursor-pointer transition-all duration-normal ease-spring hover:shadow-card-hover hover:-translate-y-px',
  ai:
    'relative bg-white border border-neutral-200 shadow-sm',
}

/* ── Padding presets ────────────────────────────────────────── */
const paddingStyles = {
  none:    'p-0',
  sm:      'p-3',
  compact: 'p-4',
  md:      'p-5',
  lg:      'p-6',
}

const Card = forwardRef(({
  variant = 'elevated',
  padding = 'md',
  /* backward-compat: old boolean prop */
  interactive = false,
  className = '',
  children,
  ...props
}, ref) => {
  /* If old-style interactive=true is passed, upgrade to interactive variant */
  const resolvedVariant = interactive && variant === 'elevated' ? 'interactive' : variant
  const isAI = resolvedVariant === 'ai'

  return (
    <div
      ref={ref}
      className={[
        'rounded-lg overflow-hidden',
        variantStyles[resolvedVariant] || variantStyles.elevated,
        paddingStyles[padding] || paddingStyles.md,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}

      {/* AI variant: luna gradient border overlay */}
      {isAI && (
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
    </div>
  )
})

Card.displayName = 'Card'
export default Card
