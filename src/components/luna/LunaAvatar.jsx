import { Sparkles } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   LunaAvatar — Luna AI's visual identity
   Three sizes, optional thinking animation and status ring
   ═══════════════════════════════════════════════════════════ */

const sizes = {
  sm: { container: 'w-7 h-7', icon: 12, ring: 'p-[1.5px]' },
  md: { container: 'w-9 h-9', icon: 16, ring: 'p-[2px]' },
  lg: { container: 'w-12 h-12', icon: 20, ring: 'p-[2px]' },
}

const LunaAvatar = ({
  size = 'md',
  thinking = false,
  showRing = true,
  className = '',
}) => {
  const s = sizes[size] || sizes.md

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* Gradient ring */}
      {showRing && (
        <div
          className={`absolute inset-0 rounded-full ${s.ring} ${thinking ? 'animate-luna-glow' : ''}`}
          style={{ background: 'var(--luna-gradient)' }}
        >
          <div className="w-full h-full rounded-full bg-white" />
        </div>
      )}

      {/* Avatar body */}
      <div
        className={`${s.container} rounded-full flex items-center justify-center relative z-[1] ${thinking ? 'animate-pulse' : ''}`}
        style={{ background: 'var(--luna-gradient)' }}
      >
        <Sparkles size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Thinking glow ring */}
      {thinking && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: 'var(--luna-gradient)' }}
        />
      )}
    </div>
  )
}

export default LunaAvatar
