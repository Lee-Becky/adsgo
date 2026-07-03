import { create } from 'zustand'

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export function buildBudgetStrategyTodo({ row, recommendation, level = 'campaign' }) {
  const delta = recommendation.suggestedBudget - recommendation.currentBudget
  const levelLabel = level === 'campaign' ? 'Campaign' : level === 'adset' ? 'AdSet' : 'Ad'
  const actionLabel = delta < 0
    ? `降低日预算 ${formatCurrency(Math.abs(delta))}`
    : delta > 0
      ? `提高日预算 ${formatCurrency(delta)}`
      : '维持当前预算'

  return {
    id: `todo_import_${row.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: delta === 0 ? 'execution' : 'decision',
    description: `确认 ${row.name} 日预算从 ${formatCurrency(recommendation.currentBudget)} 调整到 ${formatCurrency(recommendation.suggestedBudget)}`,
    target_object: `${levelLabel} / ${row.name}`,
    current_state: `ROAS ${Number(row.roas || 0).toFixed(2)}，CPA ${formatCurrency(row.cpa)}`,
    action: actionLabel,
    data_basis: '广告管理 · Luna 预算建议',
    expected_outcome: recommendation.reason,
    executor: 'human',
    scheduled_at: '待排期（本周策略）',
    status: 'pending',
    done: false,
    completed_at: '',
    source: 'ads/campaigns',
    sourceEntityId: row.id,
    sourceRecommendationId: recommendation.id,
    importedAt: new Date().toISOString(),
  }
}

const useStrategyTaskStore = create((set, get) => ({
  importedTodos: [],
  navigationIntent: null,

  importBudgetTasksFromAds: (items, level = 'campaign') => {
    const todos = items.map(({ row, recommendation }) => buildBudgetStrategyTodo({ row, recommendation, level }))
    const highlightTodoIds = todos.map((todo) => todo.id)

    set({
      importedTodos: [...get().importedTodos, ...todos],
      navigationIntent: {
        tab: 'cycle',
        step: 4,
        highlightTodoIds,
        count: todos.length,
      },
    })

    return { todos, highlightTodoIds }
  },

  consumeNavigationIntent: () => {
    const intent = get().navigationIntent
    set({ navigationIntent: null })
    return intent
  },

  consumeImportedTodos: () => {
    const todos = get().importedTodos
    set({ importedTodos: [] })
    return todos
  },
}))

export default useStrategyTaskStore
