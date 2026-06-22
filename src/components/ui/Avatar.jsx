import { useState, useMemo } from 'react'
import StatusDot from './StatusDot'

const sizeMap = {
  xs: { container: 'w-6 h-6',   text: 'text-[10px]', statusSize: 'sm', statusPos: '-bottom-0.5 -right-0.5' },
  sm: { container: 'w-8 h-8',   text: 'text-xs',     statusSize: 'sm', statusPos: '-bottom-0.5 -right-0.5' },
  md: { container: 'w-10 h-10', text: 'text-sm',      statusSize: 'md', statusPos: '-bottom-0.5 -right-0.5' },
  lg: { container: 'w-12 h-12', text: 'text-base',    statusSize: 'md', statusPos: '-bottom-0.5 -right-0.5' },
  xl: { container: 'w-16 h-16', text: 'text-lg',      statusSize: 'lg', statusPos: '-bottom-1 -right-1' },
}

/* Stable color from name string */
const initialsColors = [
  'bg-primary-100 text-primary-700',
  'bg-success-100 text-success-700',
  'bg-warning-100 text-warning-700',
  'bg-danger-100 text-danger-700',
  'bg-info-100 text-info-700',
  'bg-neutral-200 text-neutral-700',
]

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  variant = 'default',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false)
  const dims = sizeMap[size] || sizeMap.md
  const isLuna = variant === 'luna'

  const initials = useMemo(() => getInitials(name || alt || ''), [name, alt])
  const colorIdx = useMemo(() => hashCode(name || alt || '') % initialsColors.length, [name, alt])
  const showImage = src && !imgError

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {/* Luna gradient border ring */}
      {isLuna && (
        <span
          className={`
            absolute -inset-[2px] rounded-full animate-luna-glow
          `}
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 40%, #F59E0B 100%)',
            padding: '2px',
          }}
        >
          <span className="block w-full h-full rounded-full bg-white" />
        </span>
      )}

      {/* Avatar container */}
      <span
        className={`
          relative overflow-hidden rounded-full flex items-center justify-center font-semibold
          ${dims.container} ${dims.text}
          ${showImage ? '' : initialsColors[colorIdx]}
          ${!isLuna ? 'ring-2 ring-white' : ''}
        `.trim()}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="select-none">{initials}</span>
        )}
      </span>

      {/* Status indicator */}
      {status && (
        <span className={`absolute ${dims.statusPos} z-10`}>
          <StatusDot
            status={status}
            size={dims.statusSize}
            pulse={status === 'online' || status === 'luna'}
          />
        </span>
      )}
    </span>
  )
}

Avatar.displayName = 'Avatar'
export default Avatar
