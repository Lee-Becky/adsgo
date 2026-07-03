import { create } from 'zustand'
import { getSyncPayload } from '@features/chat/lunaSyncPayloads'

const formatBudget = (value) => `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export const formatLunaLearningAck = (question, answer) => {
  if (question.variant === 'reject') {
    return (
      `明白了。你拒绝了 ${question.entityName || question.context} 的${question.action || '预算'}建议`
      + `（${question.summary}），原因是：「${answer}」。我会把这条偏好记下来，下次做类似建议时会参考你的判断。`
    )
  }

  return (
    `明白了。${question.entityName || question.context} 的${question.field}从 ${question.oldValue} 调到 ${question.newValue}，`
    + `是因为：「${answer}」。我会把这条偏好记下来，下次做类似建议时会参考。`
  )
}

/* ═══════════════════════════════════════════════════════════
   Luna Store — AI Chat state, sync, quick prompts
   Stub for Phase 3 integration; provides the state shape
   ═══════════════════════════════════════════════════════════ */

const useLunaStore = create((set, get) => ({
  /* ── Chat State ─────────────────────────────────────────── */
  isOpen: false,
  chatHistory: [],
  isThinking: false,

  /* ── Data Sources ───────────────────────────────────────── */
  activeDataSources: ['adPerformance', 'brandProfile'],

  /* ── Sync Mechanism ─────────────────────────────────────── */
  // Key: module path (e.g. 'ads/campaigns'), Value: suggestion data
  pendingSync: {},
  // Applied Luna effects per module (persist until page refresh)
  moduleEffects: {},

  /* ── Activity log (Luna ↔ 系统交互轨迹) ───────────────── */
  activityLog: [],

  /* ── Quick Prompts ──────────────────────────────────────── */
  quickPrompts: [
    { id: 'analyze', label: '查看美国表现', category: 'analysis' },
    { id: 'optimize', label: '确认预算动作', category: 'optimize' },
    { id: 'create', label: '生成换新草稿', category: 'create' },
    { id: 'report', label: '生成客户日报', category: 'report' },
  ],

  /* ── Actions ────────────────────────────────────────────── */
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      ...message,
    }],
  })),

  clearHistory: () => set({ chatHistory: [] }),
  setThinking: (val) => set({ isThinking: val }),

  setActiveDataSources: (sources) => set({ activeDataSources: sources }),

  /* ── Sync actions ───────────────────────────────────────── */
  setSyncData: (moduleKey, data) => set((state) => ({
    pendingSync: { ...state.pendingSync, [moduleKey]: data },
    activityLog: [
      {
        id: Date.now(),
        type: 'sync',
        moduleKey,
        summary: data.payload?.summary || data.text?.slice(0, 60),
        timestamp: new Date().toISOString(),
      },
      ...state.activityLog,
    ].slice(0, 20),
  })),

  acceptSync: (moduleKey) => set((state) => {
    const data = state.pendingSync[moduleKey]
    if (!data) return state
    const nextPending = { ...state.pendingSync }
    delete nextPending[moduleKey]
    return {
      pendingSync: nextPending,
      moduleEffects: {
        ...state.moduleEffects,
        [moduleKey]: {
          ...data.payload,
          acceptedAt: new Date().toISOString(),
          status: 'applied',
        },
      },
      activityLog: [
        {
          id: Date.now(),
          type: 'apply',
          moduleKey,
          summary: data.payload?.summary || '已应用到页面',
          timestamp: new Date().toISOString(),
        },
        ...state.activityLog,
      ].slice(0, 20),
    }
  }),

  clearSyncData: (moduleKey) => set((state) => {
    const next = { ...state.pendingSync }
    delete next[moduleKey]
    return { pendingSync: next }
  }),

  getSyncData: (moduleKey) => get().pendingSync[moduleKey] || null,

  /* ── Global briefing (demo scenario — dismissible) ─────── */
  globalBriefingDismissed: false,
  dismissGlobalBriefing: () => set({ globalBriefingDismissed: true }),

  applyGlobalBriefing: () => set((state) => {
    const payload = getSyncPayload('ads/campaigns')
    return {
      globalBriefingDismissed: true,
      moduleEffects: payload
        ? {
          ...state.moduleEffects,
          'ads/campaigns': {
            ...payload,
            acceptedAt: new Date().toISOString(),
            status: 'applied',
          },
        }
        : state.moduleEffects,
    }
  }),

  openChatWithBriefing: (summary) => set((state) => ({
    isOpen: true,
    chatHistory: [
      ...state.chatHistory,
      {
        id: `briefing-${Date.now()}`,
        role: 'luna',
        text: summary,
        type: 'briefing',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  })),

  /* ── Question mechanism ─────────────────────────────────── */
  pendingQuestion: null,
  setPendingQuestion: (question) => set({ pendingQuestion: question }),
  clearPendingQuestion: () => set({ pendingQuestion: null }),

  triggerManualChangeFollowUp: (payload) => set((state) => {
    const {
      entityName,
      oldBudget,
      newBudget,
      suggestedBudget,
      memoryPrompt,
      field = '日预算',
    } = payload

    const suggestedPart = suggestedBudget != null && Number(suggestedBudget) !== Number(newBudget)
      ? `（Luna 原建议 $${Number(suggestedBudget).toLocaleString('en-US', { maximumFractionDigits: 0 })}/日）`
      : ''

    const text = memoryPrompt || (
      `你把 ${entityName} 的日预算从 $${Number(oldBudget).toLocaleString('en-US', { maximumFractionDigits: 0 })} `
      + `调到 $${Number(newBudget).toLocaleString('en-US', { maximumFractionDigits: 0 })}${suggestedPart}。`
      + '方便说一下这次手动调整的原因吗？我会记下来，后续建议会更贴合你的判断。'
    )

    return {
      isOpen: true,
      pendingQuestion: {
        field,
        oldValue: String(oldBudget),
        newValue: String(newBudget),
        context: entityName,
        entityName,
        suggestedBudget,
        timestamp: new Date().toISOString(),
      },
      chatHistory: [
        ...state.chatHistory,
        {
          id: `${Date.now()}-luna-question`,
          role: 'luna',
          text,
          type: 'question',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      activityLog: [
        {
          id: Date.now(),
          type: 'manual_change',
          moduleKey: 'ads/campaigns',
          summary: `${entityName} 预算 $${oldBudget} → $${newBudget}`,
          timestamp: new Date().toISOString(),
        },
        ...state.activityLog,
      ].slice(0, 20),
    }
  }),

  triggerRejectFollowUp: (payload) => set((state) => {
    const {
      entityName,
      action,
      currentBudget,
      suggestedBudget,
      memoryPrompt,
    } = payload

    const summary = `${action || '预算调整'} ${formatBudget(currentBudget)}/日 → ${formatBudget(suggestedBudget)}/日`

    const text = memoryPrompt || (
      `你拒绝了 Luna 对 ${entityName} 的${action || '预算'}建议（${summary}）。`
      + '方便说一下拒绝的原因吗？我会记下来，后续建议会更贴合你的判断。'
    )

    return {
      isOpen: true,
      pendingQuestion: {
        field: '预算建议',
        oldValue: `${formatBudget(currentBudget)}/日`,
        newValue: '已拒绝',
        context: entityName,
        entityName,
        variant: 'reject',
        action,
        summary,
        suggestedBudget,
        currentBudget,
        timestamp: new Date().toISOString(),
      },
      chatHistory: [
        ...state.chatHistory,
        {
          id: `${Date.now()}-luna-reject-question`,
          role: 'luna',
          text,
          type: 'question',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      activityLog: [
        {
          id: Date.now(),
          type: 'reject_suggestion',
          moduleKey: 'ads/campaigns',
          summary: `${entityName} 拒绝建议 ${summary}`,
          timestamp: new Date().toISOString(),
        },
        ...state.activityLog,
      ].slice(0, 20),
    }
  }),
}))

export default useLunaStore
