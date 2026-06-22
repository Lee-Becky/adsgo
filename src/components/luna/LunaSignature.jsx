import { Sparkles } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   LunaSignature — "Analyzed by Luna" footer signature
   Used at bottom of AI-generated reports and analysis sections
   ═══════════════════════════════════════════════════════════ */

const LunaSignature = ({
  label = 'Analyzed by Luna',
  timestamp,
  variant = 'default', // 'default' | 'minimal' | 'branded'
  className = '',
}) => {
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-1 text-[10px] text-neutral-400 ${className}`}>
        <Sparkles size={10} className="text-luna-violet" />
        {label}
      </div>
    )
  }

  if (variant === 'branded') {
    return (
      <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg ${className}`}
        style={{ background: 'var(--luna-gradient-subtle)' }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--luna-gradient)' }}
        >
          <Sparkles size={12} className="text-white" />
        </div>
        <div>
          <p className="text-caption text-neutral-700 font-semibold">{label}</p>
          {timestamp && (
            <p className="text-[10px] text-neutral-400 mt-0.5">{timestamp}</p>
          )}
        </div>
      </div>
    )
  }

  /* default */
  return (
    <div className={`flex items-center gap-2 py-2 ${className}`}>
      <div className="flex-1 h-px bg-neutral-200" />
      <div className="flex items-center gap-1.5 px-2">
        <Sparkles size={11} className="text-luna-violet" />
        <span className="text-[10px] text-neutral-400 font-medium">{label}</span>
        {timestamp && (
          <span className="text-[10px] text-neutral-300 ml-1">{timestamp}</span>
        )}
      </div>
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  )
}

export default LunaSignature
