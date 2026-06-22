/* ═══════════════════════════════════════════════════════════
   LunaThinkingIndicator — AI processing states
   Used in chat panel and inline within modules
   ═══════════════════════════════════════════════════════════ */

/* ── Dot variant (compact, 3 bouncing dots) ───────────────── */
export const LunaThinkingDots = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1 ${className}`}>
    <span className="luna-thinking-dot" style={{ animationDelay: '0s' }} />
    <span className="luna-thinking-dot" style={{ animationDelay: '0.2s' }} />
    <span className="luna-thinking-dot" style={{ animationDelay: '0.4s' }} />
  </div>
)

/* ── Bar variant (full-width shimmer bar) ─────────────────── */
export const LunaThinkingBar = ({ className = '' }) => (
  <div className={`relative h-0.5 w-full overflow-hidden rounded-full bg-neutral-100 ${className}`}>
    <div
      className="absolute inset-0 animate-shimmer rounded-full"
      style={{
        background: 'linear-gradient(90deg, transparent, var(--luna-violet-light), var(--primary-500), var(--luna-amber-light), transparent)',
        backgroundSize: '200% 100%',
      }}
    />
  </div>
)

/* ── Message variant (full chat bubble thinking state) ────── */
export const LunaThinkingMessage = ({ label = 'Luna is thinking...', className = '' }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-luna-bg border border-luna-border ${className}`}>
    <div className="flex items-center gap-1">
      <span className="luna-thinking-dot" style={{ animationDelay: '0s' }} />
      <span className="luna-thinking-dot" style={{ animationDelay: '0.2s' }} />
      <span className="luna-thinking-dot" style={{ animationDelay: '0.4s' }} />
    </div>
    <span className="text-caption text-luna-violet font-medium">{label}</span>
  </div>
)

/* ── Compound export ──────────────────────────────────────── */
const LunaThinkingIndicator = {
  Dots: LunaThinkingDots,
  Bar: LunaThinkingBar,
  Message: LunaThinkingMessage,
}

export default LunaThinkingIndicator
