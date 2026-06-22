import { useMemo } from 'react'

const statusColors = {
  online:  'bg-success-500',
  offline: 'bg-neutral-400',
  busy:    'bg-danger-500',
  away:    'bg-warning-500',
  luna:    'bg-gradient-to-br from-luna-violet to-luna-amber',
}

const pulseRings = {
  online:  'bg-success-500/40',
  offline: 'bg-neutral-400/40',
  busy:    'bg-danger-500/40',
  away:    'bg-warning-500/40',
  luna:    'bg-luna-violet/40',
}

const sizeMap = {
  sm: { dot: 'w-1.5 h-1.5', ring: 'w-3 h-3' },
  md: { dot: 'w-2 h-2', ring: 'w-4 h-4' },
  lg: { dot: 'w-2.5 h-2.5', ring: 'w-5 h-5' },
}

const StatusDot = ({
  status = 'online',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const isLuna = status === 'luna'
  const dims = sizeMap[size] || sizeMap.md
  const colorClass = statusColors[status] || statusColors.online
  const shouldPulse = pulse || isLuna

  const lunaStyle = useMemo(() => {
    if (!isLuna) return undefined
    return {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
    }
  }, [isLuna])

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${dims.ring} ${className}`}
    >
      {/* Pulse ring */}
      {shouldPulse && (
        <span
          className={`
            absolute inset-0 rounded-full
            ${pulseRings[status] || pulseRings.online}
            animate-ping
          `.trim()}
          style={{ animationDuration: '2s' }}
        />
      )}

      {/* Luna glow */}
      {isLuna && (
        <span
          className="absolute inset-0 rounded-full animate-luna-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(245,158,11,0.3) 100%)',
            filter: 'blur(3px)',
          }}
        />
      )}

      {/* Dot */}
      <span
        className={`
          relative rounded-full ${dims.dot}
          ${isLuna ? '' : colorClass}
        `.trim()}
        style={lunaStyle}
      />
    </span>
  )
}

StatusDot.displayName = 'StatusDot'
export default StatusDot
