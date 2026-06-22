import { useState } from 'react'
import { X, Send, SkipForward } from 'lucide-react'
import LunaAvatar from './LunaAvatar'

/* ═══════════════════════════════════════════════════════════
   LunaQuestionCard — Luna asks about user's manual changes
   Triggered when user modifies a value that differs from
   Luna's recommendation (human-AI learning mechanism)
   ═══════════════════════════════════════════════════════════ */

const LunaQuestionCard = ({
  question,
  context, // e.g. "You changed daily budget from $500 to $800"
  fieldLabel,
  oldValue,
  newValue,
  onSubmit,
  onSkip,
  onDismiss,
  className = '',
}) => {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim()) return
    setSubmitted(true)
    onSubmit?.(answer.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  /* ── Submitted state ────────────────────────────────────── */
  if (submitted) {
    return (
      <div className={`rounded-lg border border-luna-border p-4 animate-luna-suggest ${className}`}
        style={{ background: 'var(--luna-gradient-subtle)' }}
      >
        <div className="flex items-center gap-2.5">
          <LunaAvatar size="sm" />
          <p className="text-body text-neutral-700 font-medium">
            Thanks! I'll remember this for future recommendations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-luna-border overflow-hidden animate-luna-suggest ${className}`}
      style={{ background: 'var(--luna-gradient-subtle)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <LunaAvatar size="sm" className="mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-body text-neutral-800 font-medium leading-relaxed">
            {question || "I noticed you made a change. Could you tell me why?"}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:bg-white/60 hover:text-neutral-600 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Context — shows the value change */}
      {(context || (oldValue !== undefined && newValue !== undefined)) && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-md bg-white/60 border border-neutral-200/50">
          {context && (
            <p className="text-caption text-neutral-600">{context}</p>
          )}
          {oldValue !== undefined && newValue !== undefined && (
            <div className="flex items-center gap-2 mt-1">
              {fieldLabel && (
                <span className="text-caption text-neutral-500">{fieldLabel}:</span>
              )}
              <span className="text-caption text-neutral-400 line-through">{oldValue}</span>
              <span className="text-caption text-neutral-400">→</span>
              <span className="text-caption text-primary-600 font-semibold">{newValue}</span>
            </div>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your reasoning (optional)..."
            className="flex-1 min-w-0 px-3 py-2 rounded-md bg-white border border-neutral-200 text-body text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all"
          />
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Skip option */}
      {onSkip && (
        <div className="px-4 pb-3 -mt-1">
          <button
            onClick={onSkip}
            className="inline-flex items-center gap-1 text-caption text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <SkipForward size={12} />
            Skip this question
          </button>
        </div>
      )}
    </div>
  )
}

export default LunaQuestionCard
