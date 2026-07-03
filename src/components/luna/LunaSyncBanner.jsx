import { Bot, CheckCircle2, Sparkles, X } from 'lucide-react'
import { LunaAvatar } from '@components/luna'

const LunaSyncBanner = ({
  summary,
  effects = [],
  source,
  onAccept,
  onDismiss,
  onOpenLuna,
  applied = false,
}) => {
  if (!summary && !applied) return null

  if (applied) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50/60 px-4 py-3">
        <CheckCircle2 size={16} className="shrink-0 text-success-600" />
        <p className="text-sm text-success-800">
          <span className="font-semibold">已应用 Luna 建议</span>
          {source && <span className="ml-2 text-success-600/80">{source}</span>}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-luna-border bg-gradient-to-r from-luna-bg/80 to-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3 min-w-0">
          <LunaAvatar size="sm" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-luna-bg px-2 py-0.5 text-[10px] font-semibold text-luna-violet">
                <Sparkles size={10} /> Luna 已同步
              </span>
              {source && <span className="text-[11px] text-neutral-400">{source}</span>}
            </div>
            <p className="mt-1.5 text-sm font-semibold text-neutral-900">{summary}</p>
            {effects.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {effects.map((item) => (
                  <li key={item.label} className="flex items-start gap-2 text-xs text-neutral-600">
                    <Bot size={11} className="mt-0.5 shrink-0 text-luna-violet" />
                    <span>
                      <span className="font-semibold text-neutral-800">{item.label}</span>
                      {item.detail && <span className="text-neutral-500"> · {item.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {onOpenLuna && (
            <button
              onClick={onOpenLuna}
              className="rounded-lg border border-luna-border bg-white px-3 py-1.5 text-xs font-semibold text-luna-violet hover:bg-luna-bg/50"
            >
              在 Luna 中查看
            </button>
          )}
          <button
            onClick={onAccept}
            className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
          >
            应用到页面
          </button>
          <button
            onClick={onDismiss}
            className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600"
            title="忽略"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LunaSyncBanner
