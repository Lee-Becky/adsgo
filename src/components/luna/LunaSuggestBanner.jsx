import { useState } from 'react'
import { Sparkles, X, Check, ChevronRight } from 'lucide-react'
import LunaAvatar from './LunaAvatar'

/* ═══════════════════════════════════════════════════════════
   LunaSuggestBanner — AI suggestion strip for modules
   Appears at top of sections or beside form fields
   ═══════════════════════════════════════════════════════════ */

const LunaSuggestBanner = ({
  message,
  detail,
  onAccept,
  onDismiss,
  onViewMore,
  variant = 'default', // 'default' | 'compact' | 'field'
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  /* ── Field-level variant (inline, minimal) ──────────────── */
  if (variant === 'field') {
    return (
      <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-luna-bg border border-luna-border animate-luna-suggest ${className}`}>
        <Sparkles size={12} className="text-luna-violet shrink-0" />
        <span className="text-caption text-luna-violet font-medium flex-1 min-w-0 truncate">{message}</span>
        {onAccept && (
          <button
            onClick={onAccept}
            className="text-caption text-luna-violet font-semibold hover:text-primary-600 transition-colors shrink-0"
          >
            Apply
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  /* ── Compact variant ────────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg bg-luna-bg border border-luna-border animate-luna-suggest ${className}`}>
        <Sparkles size={14} className="text-luna-violet shrink-0" />
        <span className="text-body text-neutral-700 font-medium flex-1 min-w-0">{message}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {onAccept && (
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-500 text-white text-caption font-semibold hover:bg-primary-600 transition-colors"
            >
              <Check size={12} />
              Accept
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }

  /* ── Default variant (full banner) ──────────────────────── */
  return (
    <div className={`rounded-lg border border-luna-border overflow-hidden animate-luna-suggest ${className}`}
      style={{ background: 'var(--luna-gradient-subtle)' }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Avatar */}
        <LunaAvatar size="sm" className="mt-0.5" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-body text-neutral-800 font-medium">{message}</p>
          {detail && (
            <p className="text-caption text-neutral-500 mt-1">{detail}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onAccept && (
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-500 text-white text-caption font-semibold hover:bg-primary-600 transition-colors shadow-xs"
            >
              <Check size={13} />
              Accept
            </button>
          )}
          {onViewMore && (
            <button
              onClick={onViewMore}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-neutral-600 text-caption font-medium hover:bg-white/60 transition-colors"
            >
              View
              <ChevronRight size={13} />
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:bg-white/60 hover:text-neutral-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LunaSuggestBanner
