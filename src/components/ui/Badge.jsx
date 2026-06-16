const statusStyles = {
  active:   { dot: 'bg-emerald-500', text: 'text-emerald-600 bg-emerald-50' },
  paused:   { dot: 'bg-gray-300',    text: 'text-gray-500 bg-gray-100' },
  error:    { dot: 'bg-red-500',     text: 'text-red-600 bg-red-50' },
  learning: { dot: 'bg-amber-400 animate-glow-pulse', text: 'text-amber-600 bg-amber-50' },
  draft:    { dot: 'bg-gray-300',    text: 'text-gray-500 bg-gray-100' },
  info:     { dot: 'bg-primary-500', text: 'text-primary-600 bg-primary-50' },
}

export const StatusBadge = ({ status = 'active', label, className = '' }) => {
  const style = statusStyles[status] || statusStyles.active
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={`inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full text-xs font-semibold ${style.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      {displayLabel}
    </span>
  )
}

export const CountBadge = ({ count = 0, className = '' }) => {
  if (count <= 0) return null

  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default StatusBadge
