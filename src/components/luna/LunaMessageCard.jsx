import { useState } from 'react'
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, ExternalLink } from 'lucide-react'
import LunaAvatar from './LunaAvatar'
import LunaBadge from './LunaBadge'

/* ═══════════════════════════════════════════════════════════
   LunaMessageCard — Chat message bubble
   Supports text, structured data, tables, action buttons
   ═══════════════════════════════════════════════════════════ */

/* ── User message (right-aligned) ─────────────────────────── */
export const UserMessage = ({ text, timestamp, attachments = [], className = '' }) => (
  <div className={`flex justify-end ${className}`}>
    <div className="max-w-[85%]">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap justify-end gap-2">
          {attachments.map((file) => (
            <div key={file.id} className="overflow-hidden rounded-lg border border-primary-200 bg-white">
              {file.previewUrl ? (
                <img src={file.previewUrl} alt={file.name} className="h-20 w-20 object-cover" />
              ) : (
                <div className="flex h-16 max-w-[140px] items-center gap-2 px-3 text-xs text-neutral-600">
                  <span className="truncate">{file.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {text && (
        <div className="px-4 py-3 rounded-2xl rounded-br-md bg-primary-500 text-white text-body">
          {text}
        </div>
      )}
      {timestamp && (
        <p className="text-[10px] text-neutral-400 mt-1 text-right">{timestamp}</p>
      )}
    </div>
  </div>
)

/* ── Luna message (left-aligned, with avatar) ─────────────── */
export const LunaMessage = ({
  text,
  timestamp,
  thinking = false,
  children, // structured content (tables, charts, actions)
  onCopy,
  onFeedback,
  onRetry,
  className = '',
}) => {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'up' | 'down' | null

  const handleCopy = () => {
    if (onCopy) onCopy(text)
    else navigator.clipboard?.writeText(text || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type) => {
    setFeedback(type)
    onFeedback?.(type)
  }

  return (
    <div className={`flex gap-2.5 ${className}`}>
      <LunaAvatar size="sm" thinking={thinking} showRing={false} />
      <div className="flex-1 min-w-0 max-w-[85%]">
        {/* Message bubble */}
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-neutral-50 border border-neutral-200/60 text-body text-neutral-800">
          {thinking ? (
            <div className="flex items-center gap-1.5">
              <span className="luna-thinking-dot" style={{ animationDelay: '0s' }} />
              <span className="luna-thinking-dot" style={{ animationDelay: '0.2s' }} />
              <span className="luna-thinking-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : (
            <>
              {text && <div className="whitespace-pre-wrap leading-relaxed">{text}</div>}
              {children}
            </>
          )}
        </div>

        {/* Meta + actions row */}
        {!thinking && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            {timestamp && (
              <span className="text-[10px] text-neutral-400">{timestamp}</span>
            )}
            <LunaBadge variant="ghost" size="xs" label="" showIcon />

            <div className="flex-1" />

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {text && (
                <button
                  onClick={handleCopy}
                  className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={12} className="text-success-500" /> : <Copy size={12} />}
                </button>
              )}
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                  title="Regenerate"
                >
                  <RotateCcw size={12} />
                </button>
              )}
              {onFeedback && (
                <>
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${feedback === 'up' ? 'text-success-500 bg-success-50' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'}`}
                    title="Helpful"
                  >
                    <ThumbsUp size={12} />
                  </button>
                  <button
                    onClick={() => handleFeedback('down')}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${feedback === 'down' ? 'text-danger-500 bg-danger-50' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'}`}
                    title="Not helpful"
                  >
                    <ThumbsDown size={12} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Structured data card (embedded in chat) ──────────────── */
export const LunaDataCard = ({
  title,
  children,
  actions = [], // [{ label, icon, onClick }]
  className = '',
}) => (
  <div className={`mt-2 rounded-lg border border-neutral-200 bg-white overflow-hidden ${className}`}>
    {title && (
      <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
        <span className="text-caption text-neutral-600 font-semibold">{title}</span>
        <LunaBadge size="xs" />
      </div>
    )}
    <div className="p-3">{children}</div>
    {actions.length > 0 && (
      <div className="px-3 py-2 border-t border-neutral-100 bg-neutral-50 flex items-center gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-caption font-semibold bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
          >
            {action.icon && <action.icon size={13} />}
            {action.label}
          </button>
        ))}
      </div>
    )}
  </div>
)

/* ── Action suggestion card ───────────────────────────────── */
export const LunaActionCard = ({
  title,
  description,
  primaryAction, // { label, onClick }
  secondaryAction, // { label, onClick }
  className = '',
}) => (
  <div className={`mt-2 rounded-lg border border-luna-border overflow-hidden ${className}`}
    style={{ background: 'var(--luna-gradient-subtle)' }}
  >
    <div className="px-4 py-3">
      {title && (
        <p className="text-body text-neutral-800 font-semibold">{title}</p>
      )}
      {description && (
        <p className="text-caption text-neutral-500 mt-1">{description}</p>
      )}
    </div>
    <div className="px-4 py-2.5 border-t border-luna-border/50 flex items-center gap-2">
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-500 text-white text-caption font-semibold hover:bg-primary-600 transition-colors shadow-xs"
        >
          {primaryAction.label}
          <ExternalLink size={12} />
        </button>
      )}
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-neutral-600 text-caption font-medium hover:bg-white/60 transition-colors"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  </div>
)

/* ── Compound export ──────────────────────────────────────── */
const LunaMessageCard = {
  User: UserMessage,
  Luna: LunaMessage,
  Data: LunaDataCard,
  Action: LunaActionCard,
}

export default LunaMessageCard
