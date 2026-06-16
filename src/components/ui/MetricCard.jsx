import { TrendingUp, TrendingDown } from 'lucide-react'

const colorSchemes = {
  default: 'bg-white shadow-ring',
  primary: 'bg-primary-50 border border-primary-100',
  success: 'bg-emerald-50 border border-emerald-100',
  warning: 'bg-amber-50 border border-amber-100',
  hero:    'bg-primary-500 text-white',
}

const MetricCard = ({
  label,
  value,
  trend,
  trendLabel,
  accentColor,
  colorScheme = 'default',
  sparkline,
  className = '',
}) => {
  const isHero = colorScheme === 'hero'
  const isPositive = trend > 0
  const isNegative = trend < 0

  return (
    <div
      className={`rounded-xl p-5 relative overflow-hidden ${colorSchemes[colorScheme] || colorSchemes.default} ${className}`}
    >
      {/* Optional accent top bar */}
      {accentColor && !isHero && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: accentColor }}
        />
      )}

      {/* Label — Swiss uppercase */}
      <p className={`text-[10px] font-bold uppercase tracking-[0.08em] mb-2 ${
        isHero ? 'text-primary-200' : 'text-gray-400'
      }`}>
        {label}
      </p>

      {/* Value — Editorial large number */}
      <p className={`font-display text-[32px] leading-[1.1] font-extrabold tracking-tight ${
        isHero ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </p>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {isPositive && <TrendingUp size={12} className={isHero ? 'text-emerald-300' : 'text-emerald-500'} />}
          {isNegative && <TrendingDown size={12} className={isHero ? 'text-red-300' : 'text-red-500'} />}
          <span className={`font-mono text-xs font-semibold ${
            isPositive
              ? (isHero ? 'text-emerald-300' : 'text-emerald-500')
              : isNegative
              ? (isHero ? 'text-red-300' : 'text-red-500')
              : (isHero ? 'text-primary-200' : 'text-gray-400')
          }`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && (
            <span className={`text-xs ${isHero ? 'text-primary-200' : 'text-gray-400'}`}>
              {trendLabel}
            </span>
          )}
        </div>
      )}

      {/* Optional sparkline slot */}
      {sparkline && (
        <div className="mt-3 h-12">
          {sparkline}
        </div>
      )}
    </div>
  )
}

export default MetricCard
