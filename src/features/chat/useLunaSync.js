import { useCallback } from 'react'
import useLunaStore from '@stores/lunaStore'

/* ═══════════════════════════════════════════════════════════
   useLunaSync — Hook for modules to consume Luna sync data
   Each module subscribes by its route key (e.g. 'ads/campaigns')
   ═══════════════════════════════════════════════════════════ */

const useLunaSync = (moduleKey) => {
  const syncData = useLunaStore((s) => s.pendingSync[moduleKey] || null)
  const clearSyncData = useLunaStore((s) => s.clearSyncData)
  const openChat = useLunaStore((s) => s.openChat)

  const accept = useCallback(() => {
    clearSyncData(moduleKey)
  }, [moduleKey, clearSyncData])

  const dismiss = useCallback(() => {
    clearSyncData(moduleKey)
  }, [moduleKey, clearSyncData])

  const openLunaForContext = useCallback(() => {
    openChat()
  }, [openChat])

  return {
    hasSuggestion: !!syncData,
    suggestion: syncData,
    accept,
    dismiss,
    openLunaForContext,
  }
}

export default useLunaSync
