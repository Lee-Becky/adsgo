import { ArrowRight, Sparkles } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   LunaDiffIndicator — Shows AI suggestion vs current value
   "Current → Suggested" with visual styling
   ═══════════════════════════════════════════════════════════ */

const LunaDiffIndicator = ({
  currentValue,
  suggestedValue,
  label,
  format, // optional formatter function
  inline = false,
  className = '',
}) => {
  const formatValue = (v) => {
    if (format) return format(v)
    if (typeof v === 'number') return v.toLocaleString()
    return String(v)
  }

  if (inline) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-neutral-400 line-through text-caption">{formatValue(currentValue)}</span>
        <ArrowRight size={10} className="text-neutral-300" />
        <span className="text-primary-600 font-semibold text-caption">{formatValue(suggestedValue)}</span>
        <Sparkles size={10} className="text-luna-violet" />
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md bg-luna-bg border border-luna-border ${className}`}>
      {label && (
        <span className="text-caption text-neutral-500 shrink-0">{label}</span>
      )}
      <div className="flex items-center gap-2">
        {/* Current value */}
        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 text-body line-through">
          {formatValue(currentValue)}
        </span>
        <ArrowRight size={14} className="text-neutral-300 shrink-0" />
        {/* Suggested value */}
        <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-600 text-body font-semibold border border-primary-200">
          {formatValue(suggestedValue)}
        </span>
        <Sparkles size={12} className="text-luna-violet shrink-0 ml-0.5" />
      </div>
    </div>
  )
}

export default LunaDiffIndicator
