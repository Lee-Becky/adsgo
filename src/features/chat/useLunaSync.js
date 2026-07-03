import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useLunaStore from '@stores/lunaStore'
import { buildWorkspaceSyncPath, normalizeSyncKey } from './lunaSyncPayloads'

/* ═══════════════════════════════════════════════════════════
   useLunaSync — Hook for modules to consume Luna sync data
   ═══════════════════════════════════════════════════════════ */

const useLunaSync = (moduleKey) => {
  const key = normalizeSyncKey(moduleKey)
  const navigate = useNavigate()
  const { brandId } = useParams()

  const syncData = useLunaStore((s) => s.pendingSync[key] || null)
  const appliedEffect = useLunaStore((s) => s.moduleEffects[key] || null)
  const acceptSync = useLunaStore((s) => s.acceptSync)
  const clearSyncData = useLunaStore((s) => s.clearSyncData)
  const openChat = useLunaStore((s) => s.openChat)

  const accept = useCallback(() => {
    acceptSync(key)
  }, [acceptSync, key])

  const dismiss = useCallback(() => {
    clearSyncData(key)
  }, [clearSyncData, key])

  const openLunaForContext = useCallback(() => {
    openChat()
  }, [openChat])

  const navigateToSync = useCallback((target) => {
    navigate(buildWorkspaceSyncPath(brandId, target || key))
  }, [brandId, key, navigate])

  return {
    hasSuggestion: !!syncData,
    hasApplied: !!appliedEffect,
    suggestion: syncData,
    appliedEffect,
    payload: syncData?.payload || appliedEffect || null,
    accept,
    dismiss,
    openLunaForContext,
    navigateToSync,
  }
}

export default useLunaSync
