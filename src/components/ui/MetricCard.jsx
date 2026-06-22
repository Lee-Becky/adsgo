import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react'

/* ── Formatters ─────────────────────────────────────────────── */
const formatters = {
  currency:   (v) => typeof v === 'number' ? `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : v,
  percentage: (v) => typeof v === 'number' ? `${v.toFixed(2)}%` : v,
  number:     (v) => typeof v === 'number' ? v.toLocaleString('en-US') : v,
}

/* ── Trend color / icon map ─────────────────────────────────── */
const trendConfig = {
  up:   { Icon: TrendingUp,   color: 'text-success-600', sign: '+' },
  down: { Icon: TrendingDown, color: 'text-danger-600',  sign: '' },
  flat: { Icon: Minus,        color: 'text-neutral-400',  sign: '' },
}

const MetricCard = ({
  label,
  value,
  trend,           // { value: number, direction: 'up'|'down'|'flat' }
  trendLabel,      // backward-compat: legacy descriptive label
  format,          // 'currency' | 'percentage' | 'number'
  sparkline,       // ReactNode placeholder
  lunaInsight,     // string — AI insight text
  accentColor,     // backward-compat: top accent bar
  colorScheme,     // backward-compat: 'default'|'primary'|'success'|'warning'|'hero'
  className = '',
}) => {
  /* ── Format the displayed value ──────────────────────────── */
  const displayValue = format && formatters[format] ? formatters[format](value) : value

  /* ── Resolve trend (support both old number-trend and new object) */
  let trendDir = null
  let trendVal = null
  if (trend && typeof trend === 'object') {
    trendDir = trend.direction || 'flat'
    trendVal = trend.value
  } else if (typeof trend === 'number') {
    /* backward-compat: old numeric trend prop */
    trendDir = trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'
    trendVal = Math.abs(trend)
  }

  const tc = trendDir ? trendConfig[trendDir] : null

  /* ── Legacy colorScheme support ──────────────────────────── */
  const legacySchemes = {
    default: 'bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow',
    primary: 'bg-primary-50 border border-primary-100',
    success: 'bg-success-50 border border-success-100',
    warning: 'bg-warning-50 border border-warning-100',
    hero:    'bg-primary-500 text-white',
  }
  const isHero = colorScheme === 'hero'
  const schemeClass = colorScheme ? (legacySchemes[colorScheme] || legacySchemes.default) : legacySchemes.default

  return (
    <div
      className={[
        'rounded-lg p-5 relative overflow-hidden',
        schemeClass,
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Optional accent top bar (legacy) */}
      {accentColor && !isHero && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: accentColor }}
        />
      )}

      {/* Label */}
      <p className={[
        'font-body text-caption tracking-wide mb-1.5',
        isHero ? 'text-primary-200' : 'text-neutral-500',
      ].join(' ')}>
        {label}
      </p>

      {/* KPI Value */}
      <p className={[
        'font-heading text-kpi tabular-nums tracking-tight',
        isHero ? 'text-white' : 'text-neutral-900',
      ].join(' ')}>
        {displayValue}
      </p>

      {/* Trend indicator */}
      {tc && trendVal !== null && (
        <div className="flex items-center gap-1 mt-2">
          <tc.Icon
            size={14}
            className={isHero ? (trendDir === 'up' ? 'text-success-300' : trendDir === 'down' ? 'text-danger-300' : 'text-primary-200') : tc.color}
          />
          <span className={[
            'font-mono text-xs font-semibold',
            isHero ? (trendDir === 'up' ? 'text-success-300' : trendDir === 'down' ? 'text-danger-300' : 'text-primary-200') : tc.color,
          ].join(' ')}>
            {tc.sign}{trendVal}%
          </span>
          {trendLabel && (
            <span className={`text-xs ${isHero ? 'text-primary-200' : 'text-neutral-400'}`}>
              {trendLabel}
            </span>
          )}
        </div>
      )}

      {/* Sparkline slot */}
      {sparkline && (
        <div className="mt-3 h-10">
          {sparkline}
        </div>
      )}

      {/* Luna AI insight line */}
      {lunaInsight && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-start gap-1.5">
          <Sparkles size={12} className="text-luna-violet shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug text-neutral-500">
            {lunaInsight}
          </p>
        </div>
      )}
    </div>
  )
}

export default MetricCard
