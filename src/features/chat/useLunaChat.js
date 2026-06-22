import { useCallback } from 'react'
import useLunaStore from '@stores/lunaStore'
import { sendToLuna, sendQuickPrompt } from './mockLunaService'

/* ═══════════════════════════════════════════════════════════
   useLunaChat — Hook for Luna Chat interactions
   Wraps lunaStore actions + mock service calls
   ═══════════════════════════════════════════════════════════ */

const useLunaChat = () => {
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

  /* ── Send a user message ───────────────────────────────── */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return

    // Add user message
    addMessage({ role: 'user', text: text.trim() })

    // Show thinking indicator
    setThinking(true)

    try {
      // Get Luna response (with streaming)
      const response = await sendToLuna(text, activeDataSources)

      setThinking(false)

      // Add Luna response
      addMessage({
        role: 'luna',
        text: response.text,
        type: response.type,
        dataCard: response.dataCard || null,
        actionCard: response.actionCard || null,
        syncTarget: response.syncTarget || null,
      })

      // If response has a sync target, store the sync data
      if (response.syncTarget) {
        setSyncData(response.syncTarget, {
          text: response.text,
          type: response.type,
          actionCard: response.actionCard,
          timestamp: new Date().toISOString(),
        })
      }
    } catch {
      setThinking(false)
      addMessage({
        role: 'luna',
        text: 'Sorry, I encountered an issue processing your request. Please try again.',
        type: 'error',
      })
    }
  }, [activeDataSources, addMessage, setThinking, setSyncData])

  /* ── Send a quick prompt ───────────────────────────────── */
  const handleQuickPrompt = useCallback(async (promptId) => {
    const prompt = useLunaStore.getState().quickPrompts.find((p) => p.id === promptId)
    if (!prompt) return

    addMessage({ role: 'user', text: prompt.label })
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
      })

      if (response.syncTarget) {
        setSyncData(response.syncTarget, {
          text: response.text,
          type: response.type,
          actionCard: response.actionCard,
          timestamp: new Date().toISOString(),
        })
      }
    } catch {
      setThinking(false)
      addMessage({
        role: 'luna',
        text: 'Sorry, I encountered an issue. Please try again.',
        type: 'error',
      })
    }
  }, [activeDataSources, addMessage, setThinking, setSyncData])

  /* ── Sync: apply to module ─────────────────────────────── */
  const applySyncToModule = useCallback((moduleKey) => {
    const data = getSyncData(moduleKey)
    if (data) {
      // In a real app this would dispatch the data to the module
      clearSyncData(moduleKey)
    }
  }, [getSyncData, clearSyncData])

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
      text: `[Re: ${question.field} change] ${answer}`,
    })

    addMessage({
      role: 'luna',
      text: `Thanks for explaining the ${question.field} change from ${question.oldValue} to ${question.newValue}. I've noted this for future optimizations — I'll factor in your reasoning when making similar recommendations.`,
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
    getSyncData,
    clearSyncData,
    // Question mechanism
    askLunaAboutChange,
    answerQuestion,
    clearPendingQuestion,
  }
}

export default useLunaChat
