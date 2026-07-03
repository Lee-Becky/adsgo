import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Bot, Sparkles, X } from 'lucide-react'
import { LunaAvatar } from '@components/luna'
import useLunaStore from '@stores/lunaStore'
import { Z_INDEX } from '@constants/zIndex'
import { buildWorkspaceSyncPath, getSyncPayload } from '@features/chat/lunaSyncPayloads'
import { demoBrand } from '../../data/adsgo2DemoData'

const GLOBAL_BRIEFING = {
  summary: `美国市场 ROAS 1.82，低于 ${demoBrand.target.value.toFixed(1)} 目标；CPA $42.80 已接近红线，建议先降低冷启动预算并保留再营销观察。`,
  actionPath: 'ads/campaigns',
  actionLabel: '去广告管理处理',
}

const GlobalLunaBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { brandId = 'default' } = useParams()

  const pendingSync = useLunaStore((s) => s.pendingSync)
  const globalBriefingDismissed = useLunaStore((s) => s.globalBriefingDismissed)
  const dismissGlobalBriefing = useLunaStore((s) => s.dismissGlobalBriefing)
  const applyGlobalBriefing = useLunaStore((s) => s.applyGlobalBriefing)
  const acceptSync = useLunaStore((s) => s.acceptSync)
  const clearSyncData = useLunaStore((s) => s.clearSyncData)
  const openChatWithBriefing = useLunaStore((s) => s.openChatWithBriefing)
  const openChat = useLunaStore((s) => s.openChat)

  const pendingEntry = useMemo(() => {
    const keys = Object.keys(pendingSync)
    if (!keys.length) return null
    const key = keys[keys.length - 1]
    const data = pendingSync[key]
    const payload = data?.payload || getSyncPayload(key)
    return { key, data, payload }
  }, [pendingSync])

  const visible = pendingEntry || !globalBriefingDismissed
  if (!visible) return null

  const isSync = !!pendingEntry
  const summary = isSync
    ? (pendingEntry.payload?.summary || pendingEntry.data?.text)
    : GLOBAL_BRIEFING.summary
  const effects = isSync ? (pendingEntry.payload?.effects || []) : []
  const source = isSync ? pendingEntry.payload?.source : 'Luna · 今日异常'
  const moduleLabel = isSync ? pendingEntry.payload?.moduleLabel : '今日异常'
  const primaryLabel = isSync ? '应用到页面' : GLOBAL_BRIEFING.actionLabel

  const handleOpenChat = () => {
    if (isSync) openChat()
    else openChatWithBriefing(`今日异常：${summary}\n\n你可以问我：该先处理哪个 Campaign？冷启动该怎么降预算？`)
  }

  const handleApply = () => {
    if (isSync) {
      const targetKey = pendingEntry.key.split('?')[0]
      const targetPath = buildWorkspaceSyncPath(brandId, pendingEntry.key)
      if (!location.pathname.includes(targetKey)) {
        navigate(targetPath)
      }
      acceptSync(pendingEntry.key)
      return
    }

    const targetPath = buildWorkspaceSyncPath(brandId, GLOBAL_BRIEFING.actionPath)
    if (!location.pathname.includes(GLOBAL_BRIEFING.actionPath)) {
      navigate(targetPath)
    }
    applyGlobalBriefing()
  }

  const handleDismiss = () => {
    if (isSync) clearSyncData(pendingEntry.key)
    else dismissGlobalBriefing()
  }

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-4 flex justify-center px-4"
      style={{ zIndex: Z_INDEX.GLOBAL_LUNA_BAR }}
    >
      <div className="w-full max-w-[920px] rounded-2xl border border-luna-border bg-white p-4 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <LunaAvatar size="sm" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-luna-bg px-2 py-0.5 text-[10px] font-semibold text-luna-violet">
                  <Sparkles size={10} />
                  Luna 建议
                </span>
                <span className="text-[11px] text-neutral-400">{moduleLabel}</span>
                {source && <span className="hidden text-[11px] text-neutral-400 sm:inline">· {source}</span>}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-neutral-900">{summary}</p>
              {effects.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {effects.slice(0, 3).map((item) => (
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
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenChat}
              className="rounded-lg border border-luna-border bg-white px-3 py-1.5 text-xs font-semibold text-luna-violet hover:bg-luna-bg/50 active:scale-[0.98]"
            >
              在 Luna 中查看
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 active:scale-[0.98]"
            >
              稍后处理
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 active:scale-[0.98]"
            >
              {primaryLabel}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 active:scale-[0.98]"
              title="关闭"
              aria-label="关闭"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default GlobalLunaBar
