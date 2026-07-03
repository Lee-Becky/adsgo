import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useLunaStore, { formatLunaLearningAck } from '@stores/lunaStore'
import { sendToLuna, sendQuickPrompt, QUICK_PROMPTS } from './mockLunaService'
import { buildWorkspaceSyncPath, getSyncPayload, normalizeSyncKey } from './lunaSyncPayloads'

/* ═══════════════════════════════════════════════════════════
   useLunaChat — Hook for Luna Chat interactions
   Wraps lunaStore actions + mock service calls
   ═══════════════════════════════════════════════════════════ */

const useLunaChat = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const brandId = useMemo(() => {
    const match = location.pathname.match(/\/workspace\/([^/]+)/)
    return match ? decodeURIComponent(match[1]) : 'default'
  }, [location.pathname])

  const {
    isOpen,
    chatHistory,
    isThinking,
    activeDataSources,
    pendingSync,
    quickPrompts,
    pendingQuestion,
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    clearHistory,
    setThinking,
    setActiveDataSources,
    setSyncData,
    clearSyncData,
    getSyncData,
    setPendingQuestion,
    clearPendingQuestion,
  } = useLunaStore()

  const pushSync = useCallback((response) => {
    if (!response.syncTarget) return
    const moduleKey = normalizeSyncKey(response.syncTarget)
    const payload = response.payload || getSyncPayload(response.syncTarget)
    setSyncData(moduleKey, {
      text: response.text,
      type: response.type,
      actionCard: response.actionCard,
      syncTarget: response.syncTarget,
      payload,
      timestamp: new Date().toISOString(),
    })
  }, [setSyncData])

  const navigateToSyncTarget = useCallback((syncTarget) => {
    if (!syncTarget) return
    navigate(buildWorkspaceSyncPath(brandId, syncTarget))
  }, [brandId, navigate])

  /* ── Send a user message ───────────────────────────────── */
  const sendMessage = useCallback(async (text, attachments = []) => {
    const trimmed = text.trim()
    const hasAttachments = attachments.length > 0
    if (!trimmed && !hasAttachments) return

    const activeQuestion = useLunaStore.getState().pendingQuestion
    if (activeQuestion && trimmed && !hasAttachments) {
      addMessage({ role: 'user', text: trimmed })
      clearPendingQuestion()
      setThinking(true)
      setTimeout(() => {
        setThinking(false)
        addMessage({
          role: 'luna',
          text: formatLunaLearningAck(activeQuestion, trimmed),
          type: 'learning',
        })
      }, 700)
      return
    }

    addMessage({
      role: 'user',
      text: trimmed || '（已上传附件）',
      attachments,
    })

    setThinking(true)

    try {
      const response = await sendToLuna(trimmed, activeDataSources, attachments)

      setThinking(false)

      // Add Luna response
      addMessage({
        role: 'luna',
        text: response.text,
        type: response.type,
        dataCard: response.dataCard || null,
        actionCard: response.actionCard || null,
        syncTarget: response.syncTarget || null,
        synced: !!response.syncTarget,
      })

      pushSync(response)
    } catch {
      setThinking(false)
      addMessage({
        role: 'luna',
        text: '处理请求时出现问题，请重试。',
        type: 'error',
      })
    }
  }, [activeDataSources, addMessage, setThinking, pushSync])

  /* ── Send a quick prompt ───────────────────────────────── */
  const handleQuickPrompt = useCallback(async (promptId) => {
    const prompt = QUICK_PROMPTS.find((p) => p.id === promptId)
    const label = prompt?.label || promptId

    addMessage({ role: 'user', text: label })
    setThinking(true)

    try {
      const response = await sendQuickPrompt(promptId, activeDataSources)
      setThinking(false)

      addMessage({
        role: 'luna',
        text: response.text,
        type: response.type,
        dataCard: response.dataCard || null,
        actionCard: response.actionCard || null,
        syncTarget: response.syncTarget || null,
        synced: !!response.syncTarget,
      })

      pushSync(response)
    } catch {
      setThinking(false)
      addMessage({
        role: 'luna',
        text: '处理请求时出现问题，请重试。',
        type: 'error',
      })
    }
  }, [activeDataSources, addMessage, setThinking, pushSync])

  /* ── Sync: navigate to module (keep pending until user applies on page) ─ */
  const applySyncToModule = useCallback((syncTarget) => {
    navigateToSyncTarget(syncTarget)
  }, [navigateToSyncTarget])

  /* ── Question mechanism ────────────────────────────────── */
  const askLunaAboutChange = useCallback((field, oldValue, newValue, context) => {
    setPendingQuestion({
      field,
      oldValue,
      newValue,
      context,
      timestamp: new Date().toISOString(),
    })
  }, [setPendingQuestion])

  const answerQuestion = useCallback((answer) => {
    const question = useLunaStore.getState().pendingQuestion
    if (!question) return

    // Record the Q&A in chat
    addMessage({
      role: 'user',
      text: `[关于${question.field}调整] ${answer}`,
    })

    addMessage({
      role: 'luna',
      text: formatLunaLearningAck(question, answer),
      type: 'learning',
    })

    clearPendingQuestion()
  }, [addMessage, clearPendingQuestion])

  return {
    // State
    isOpen,
    chatHistory,
    isThinking,
    activeDataSources,
    pendingSync,
    quickPrompts,
    pendingQuestion,
    // Chat actions
    sendMessage,
    handleQuickPrompt,
    clearHistory,
    toggleChat,
    openChat,
    closeChat,
    // Data sources
    setActiveDataSources,
    // Sync
    applySyncToModule,
    navigateToSyncTarget,
    getSyncData,
    clearSyncData,
    // Question mechanism
    askLunaAboutChange,
    answerQuestion,
    clearPendingQuestion,
  }
}

export default useLunaChat
