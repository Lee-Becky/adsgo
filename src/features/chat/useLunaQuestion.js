import { useCallback } from 'react'
import useLunaStore from '@stores/lunaStore'

/* ═══════════════════════════════════════════════════════════
   useLunaQuestion — Hook for the "Luna asks why" mechanism
   When a user manually changes a value, Luna can ask about it.
   ═══════════════════════════════════════════════════════════ */

const useLunaQuestion = () => {
  const pendingQuestion = useLunaStore((s) => s.pendingQuestion)
  const setPendingQuestion = useLunaStore((s) => s.setPendingQuestion)
  const clearPendingQuestion = useLunaStore((s) => s.clearPendingQuestion)
  const addMessage = useLunaStore((s) => s.addMessage)
  const openChat = useLunaStore((s) => s.openChat)

  /**
   * Trigger a Luna question when user manually changes a value.
   * @param {string} field — The field name that was changed
   * @param {string|number} oldValue — Previous value
   * @param {string|number} newValue — New value
   * @param {string} [context] — Optional module context
   */
  const triggerQuestion = useCallback((field, oldValue, newValue, context) => {
    setPendingQuestion({
      field,
      oldValue: String(oldValue),
      newValue: String(newValue),
      context: context || '',
      timestamp: new Date().toISOString(),
    })
  }, [setPendingQuestion])

  /**
   * Submit the user's answer to Luna's question.
   */
  const submitAnswer = useCallback((answer) => {
    if (!pendingQuestion) return

    // Record in chat history
    addMessage({
      role: 'user',
      text: `[Re: ${pendingQuestion.field}] ${answer}`,
    })

    addMessage({
      role: 'luna',
      text: `Got it — you changed ${pendingQuestion.field} from ${pendingQuestion.oldValue} to ${pendingQuestion.newValue} because: "${answer}". I'll factor this into future recommendations.`,
      type: 'learning',
    })

    clearPendingQuestion()
  }, [pendingQuestion, addMessage, clearPendingQuestion])

  /**
   * Skip the question without answering.
   */
  const skipQuestion = useCallback(() => {
    clearPendingQuestion()
  }, [clearPendingQuestion])

  /**
   * Open Luna chat to discuss the change.
   */
  const discussInChat = useCallback(() => {
    if (pendingQuestion) {
      addMessage({
        role: 'luna',
        text: `I noticed you changed ${pendingQuestion.field} from ${pendingQuestion.oldValue} to ${pendingQuestion.newValue}. Can you tell me more about your reasoning? This helps me make better suggestions.`,
        type: 'question',
      })
    }
    clearPendingQuestion()
    openChat()
  }, [pendingQuestion, addMessage, clearPendingQuestion, openChat])

  return {
    pendingQuestion,
    triggerQuestion,
    submitAnswer,
    skipQuestion,
    discussInChat,
  }
}

export default useLunaQuestion
