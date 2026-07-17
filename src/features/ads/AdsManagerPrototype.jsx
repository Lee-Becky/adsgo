import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import useLunaSync from '@features/chat/useLunaSync'
import useStrategyTaskStore from '@stores/strategyTaskStore'
import useLunaStore from '@stores/lunaStore'
import useMarketingOpsStore from '@stores/marketingOpsStore'
import {
  demoAds,
  demoAdsets,
  demoAuditEvents,
  demoBrand,
  demoCampaigns,
  demoRecommendations,
  demoScenarios,
  getBudgetModeLabel,
  getBudgetRecommendationForRow,
  getBudgetScopeHint,
  getAdSuggestionForEntity,
  getScenarioById,
  rowHasEditableBudget,
} from '../../data/adsgo2DemoData'

const TABLE_DEFAULT_FILTERS = {
  time: '近 7 天',
  market: '全部',
  status: '全部',
  suggestion: '全部',
}

const TABLE_FILTER_OPTIONS = {
  time: ['近 7 天', '近 14 天', '近 30 天'],
  market: ['全部', '美国', '加拿大'],
  status: ['全部', '投放中', '学习期'],
  suggestion: ['全部', '有预算动作', '建议关停'],
}

const LEVELS = [
  { id: 'campaign', label: 'Campaign', countLabel: 'campaigns' },
  { id: 'adset', label: 'AdSet', countLabel: 'adsets' },
  { id: 'ad', label: 'Ad', countLabel: 'ads' },
]

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
const formatMetric = (value, suffix = '') => `${Number(value || 0).toFixed(2)}${suffix}`

const getRiskStyle = (risk) => {
  if (risk === '中风险' || risk === 'medium') return 'border-amber-200 bg-amber-50 text-amber-800'
  if (risk === '高风险' || risk === 'high') return 'border-rose-200 bg-rose-50 text-rose-800'
  return 'border-emerald-200 bg-emerald-50 text-emerald-800'
}

const getActionStyle = (action) => {
  if (action === '降预算' || action === 'Decrease') return 'border-amber-200 bg-amber-50 text-amber-800'
  if (action === '加预算' || action === 'Increase') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  if (action === '需要换新' || action === 'Review') return 'border-sky-200 bg-sky-50 text-sky-800'
  return 'border-slate-200 bg-slate-50 text-slate-700'
}

const getStatusStyle = (status) => {
  if (status === '已采纳' || status === 'accepted') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === '已转入策略') return 'bg-violet-50 text-violet-700 border-violet-200'
  if (status === '已拒绝') return 'bg-slate-100 text-slate-600 border-slate-200'
  if (status === '已关停') return 'bg-slate-100 text-slate-600 border-slate-200'
  if (status === '继续投放' || status === '已确认') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === '人工调整' || status === 'edited') return 'bg-sky-50 text-sky-700 border-sky-200'
  if (status === '忽略' || status === 'dismissed') return 'bg-slate-100 text-slate-600 border-slate-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

const getRowsForLevel = (level) => {
  if (level === 'adset') return demoAdsets
  if (level === 'ad') return demoAds
  return demoCampaigns
}

const filterTableRows = (rows, filters, level) => rows.filter((row) => {
  if (filters.market === '美国' && row.market && row.market !== 'US') return false
  if (filters.market === '加拿大' && row.market !== 'CA') return false
  if (filters.status === '投放中' && row.status !== '投放中') return false
  if (filters.status === '学习期' && row.status !== '学习期') return false
  if (filters.suggestion === '有预算动作') {
    const hasBudgetRec = getBudgetRecommendationForRow(row, level)
    const adSuggestion = level === 'ad' ? getAdSuggestionForEntity(row.id) : null
    const hasAdSuggestion = adSuggestion && adSuggestion.action !== '继续投放'
    if (!hasBudgetRec && !hasAdSuggestion) return false
  }
  if (filters.suggestion === '建议关停') {
    if (level !== 'ad') return false
    const adSuggestion = getAdSuggestionForEntity(row.id)
    if (adSuggestion?.action !== '建议关停') return false
  }
  return true
})

const applyHierarchyScope = (rows, level, hierarchyScope) => {
  if (level === 'adset' && hierarchyScope.campaignIds.length > 0) {
    return rows.filter((row) => hierarchyScope.campaignIds.includes(row.campaignId))
  }
  if (level === 'ad') {
    if (hierarchyScope.adsetIds.length > 0) {
      return rows.filter((row) => hierarchyScope.adsetIds.includes(row.adsetId))
    }
    if (hierarchyScope.campaignIds.length > 0) {
      return rows.filter((row) => hierarchyScope.campaignIds.includes(row.campaignId))
    }
  }
  return rows
}

const getVisibleRows = (level, filters, hierarchyScope) => (
  applyHierarchyScope(filterTableRows(getRowsForLevel(level), filters, level), level, hierarchyScope)
)

const findCampaignName = (campaignId) => demoCampaigns.find((campaign) => campaign.id === campaignId)?.name || 'Unmapped campaign'
const findRecommendationEntityName = (recommendation) => {
  const source = recommendation.entityLevel === 'campaign'
    ? demoCampaigns
    : recommendation.entityLevel === 'adset'
      ? demoAdsets
      : demoAds
  return source.find((item) => item.id === recommendation.entityId)?.name || recommendation.entityId
}

const SituationBrief = ({ scenario, onNavigate }) => {
  const { brief } = scenario

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
      <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)]">
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{brief.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{brief.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{scenario.summary}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <p className="text-xs text-slate-500">{brief.targetLabel}</p>
              <p className="font-mono text-xl font-semibold text-slate-950">{brief.targetValue}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {brief.metrics.map(([label, value, note]) => (
              <div key={label} className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-slate-950">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-950 text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)]">
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{brief.strategyEyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{brief.strategyTitle}</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {brief.strategyPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
          {brief.action && (
            <button
              type="button"
              onClick={() => onNavigate(brief.action.path)}
              className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-transform active:scale-[0.98]"
            >
              {brief.action.label}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

const ScenarioStrip = ({ activeScenarioId, onSelect }) => (
  <div className="flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="今日关注场景">
    {demoScenarios.map((scenario) => {
      const isActive = scenario.id === activeScenarioId
      return (
        <button
          key={scenario.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(scenario.id)}
          className={`min-w-[260px] rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.98] ${
            isActive
              ? 'border-slate-900 bg-slate-950 text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          }`}
        >
          <p className="text-sm font-semibold">{scenario.label}</p>
          <p className={`mt-1 text-xs leading-5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
            {scenario.summary}
          </p>
        </button>
      )
    })}
  </div>
)

const FilterBar = ({ filters, onFilterChange }) => (
  <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50/80 p-4 md:grid-cols-4">
    {[
      ['time', '时间'],
      ['market', '市场'],
      ['status', '状态'],
      ['suggestion', '建议'],
    ].map(([key, label]) => (
      <label
        key={key}
        className="relative block rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-slate-300 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-400/20"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
        <select
          value={filters[key]}
          onChange={(event) => onFilterChange(key, event.target.value)}
          className="mt-1 w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium text-slate-800 focus:outline-none"
          aria-label={`筛选${label}`}
        >
          {TABLE_FILTER_OPTIONS[key].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute bottom-3 right-3 text-slate-400"
          aria-hidden
        />
      </label>
    ))}
  </div>
)

const getActionIconMeta = (action) => {
  if (!action) {
    return { Icon: Minus, ring: 'border-slate-200 bg-slate-50 text-slate-500' }
  }
  if (action.includes('降') || action === 'Decrease') {
    return { Icon: TrendingDown, ring: 'border-amber-200 bg-amber-50 text-amber-700' }
  }
  if (action.includes('加') || action === 'Increase') {
    return { Icon: TrendingUp, ring: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
  }
  return { Icon: Minus, ring: 'border-slate-200 bg-slate-50 text-slate-600' }
}

const BudgetSuggestionCell = ({
  recommendation,
  statusOverride,
  onApply,
  onReject,
}) => {
  if (!recommendation) {
    return <span className="text-xs text-slate-400">今日无动作</span>
  }

  const { action, currentBudget, suggestedBudget } = recommendation
  const status = statusOverride || recommendation.status
  const isPending = status === '待确认'
  const { Icon, ring } = getActionIconMeta(action)
  const delta = suggestedBudget - currentBudget
  const isHold = action === '保持' && delta === 0

  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${ring}`}
        title={action}
        aria-label={action}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div>
        {isHold ? (
          <>
            <p className="font-mono text-sm font-semibold text-slate-900">{formatCurrency(suggestedBudget)}</p>
            <p className="mt-0.5 text-xs text-slate-500">维持当前</p>
          </>
        ) : (
          <>
            <p className="font-mono text-sm font-semibold text-slate-900">
              {formatCurrency(currentBudget)}
              <span className="mx-1 text-slate-400">→</span>
              {formatCurrency(suggestedBudget)}
            </p>
            <p className={`mt-0.5 font-mono text-xs font-semibold ${delta < 0 ? 'text-amber-700' : delta > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
              {delta > 0 ? '+' : ''}{formatCurrency(delta)}/日
            </p>
          </>
        )}
        {isPending ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={onApply}
              className="rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]"
            >
              应用
            </button>
            <button
              type="button"
              onClick={onReject}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            >
              拒绝
            </button>
          </div>
        ) : status ? (
          <span className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusStyle(status)}`}>
            {String(status).replace('_', ' ')}
          </span>
        ) : null}
      </div>
    </div>
  )
}

const getAdActionStyle = (action) => {
  if (action === '建议关停') return 'border-rose-200 bg-rose-50 text-rose-800'
  if (action === '观察') return 'border-amber-200 bg-amber-50 text-amber-800'
  return 'border-emerald-200 bg-emerald-50 text-emerald-800'
}

const AdSuggestionCell = ({ suggestion, statusOverride, onApply, onReject }) => {
  if (!suggestion) {
    return <span className="text-xs text-slate-400">今日无建议</span>
  }

  const status = statusOverride || suggestion.status
  const isPending = status === '待确认'
  const isShutdown = suggestion.action === '建议关停'

  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${getAdActionStyle(suggestion.action)}`}
      >
        {suggestion.action}
      </span>
      <div>
        {isPending ? (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {isShutdown ? (
              <button
                type="button"
                onClick={onApply}
                className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-transform hover:bg-rose-700 active:scale-[0.98]"
              >
                关停
              </button>
            ) : (
              <button
                type="button"
                onClick={onApply}
                className="rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]"
              >
                确认
              </button>
            )}
            <button
              type="button"
              onClick={onReject}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            >
              拒绝
            </button>
          </div>
        ) : (
          <span className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusStyle(status)}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  )
}

const ReasonCell = ({ recommendation, adSuggestion, onViewDetail }) => {
  const reason = adSuggestion?.reason || recommendation?.reason

  return (
    <div className="space-y-2">
      {reason ? (
        <p className="max-w-xs text-xs leading-5 text-slate-600">{reason}</p>
      ) : (
        <p className="text-xs text-slate-400">—</p>
      )}
      <button
        type="button"
        onClick={onViewDetail}
        className="text-xs font-semibold text-primary-600 underline-offset-2 transition-colors hover:text-primary-700 hover:underline active:scale-[0.98]"
      >
        查看详情
      </button>
    </div>
  )
}

const BudgetEditableCell = ({ value, onCommit }) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEdit = () => {
    setDraft(String(value))
    setEditing(true)
  }

  const commit = () => {
    const next = Number(draft)
    setEditing(false)
    if (!Number.isFinite(next) || next < 0) return
    if (Math.round(next) !== Math.round(value)) onCommit(Math.round(next))
  }

  if (editing) {
    return (
      <div className="flex items-center gap-0.5">
        <span className="font-mono text-sm text-slate-400">$</span>
        <input
          type="number"
          min="0"
          step="1"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit()
            if (event.key === 'Escape') setEditing(false)
          }}
          className="w-[72px] rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-sm text-slate-900 outline-none ring-slate-400 focus:border-slate-400 focus:ring-2"
          autoFocus
          aria-label="编辑日预算"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className="group inline-flex items-center gap-1 font-mono text-slate-900 underline-offset-2 hover:underline"
      title="点击手动修改预算"
    >
      {formatCurrency(value)}
      <span className="text-[10px] font-sans text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">编辑</span>
    </button>
  )
}

const BudgetCell = ({ row, level, value, onCommit }) => {
  const modeLabel = getBudgetModeLabel(row, level)

  if (modeLabel) {
    return (
      <span
        className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-600"
        title={getBudgetScopeHint(row, level)}
      >
        {modeLabel}
      </span>
    )
  }

  if (!rowHasEditableBudget(row, level)) {
    return <span className="text-xs text-slate-400">—</span>
  }

  return <BudgetEditableCell value={value} onCommit={onCommit} />
}

const EntityTable = ({
  level,
  rows,
  selectedIds,
  onToggleRow,
  onDrillDown,
  onOpenDetail,
  recommendationStatuses,
  adSuggestionStatuses,
  budgetOverrides,
  lunaHighlightIds = [],
  onApplyRecommendation,
  onRejectRecommendation,
  onApplyAdSuggestion,
  onRejectAdSuggestion,
  onManualBudgetChange,
}) => {
  const isAdLevel = level === 'ad'
  const columnCount = isAdLevel ? 8 : 9

  return (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-white">
        <tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          <th className="w-12 px-4 py-3">选择</th>
          <th className="min-w-[260px] px-4 py-3">{level === 'campaign' ? 'Campaign' : level === 'adset' ? 'AdSet' : 'Ad'}</th>
          <th className="px-4 py-3">市场</th>
          {!isAdLevel && <th className="px-4 py-3">预算</th>}
          <th className="px-4 py-3">ROAS</th>
          <th className="px-4 py-3">CPA</th>
          <th className="px-4 py-3">CTR</th>
          <th className="min-w-[180px] px-4 py-3">{isAdLevel ? 'Ad 建议' : '预算建议'}</th>
          <th className="min-w-[240px] px-4 py-3">原因</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columnCount} className="px-4 py-12 text-center text-sm text-slate-500">
              当前筛选条件下没有匹配对象，请调整表格筛选。
            </td>
          </tr>
        ) : rows.map((row) => {
          const recommendation = isAdLevel ? null : getBudgetRecommendationForRow(row, level)
          const adSuggestion = isAdLevel ? getAdSuggestionForEntity(row.id) : null
          const selected = selectedIds.includes(row.id)
          const budget = rowHasEditableBudget(row, level)
            ? (budgetOverrides[row.id] ?? row.dailyBudget)
            : null

          const lunaHighlight = lunaHighlightIds.includes(row.id)

          return (
            <tr
              key={row.id}
              className={`transition-colors ${
                lunaHighlight
                  ? 'bg-violet-50 ring-1 ring-inset ring-violet-300'
                  : selected
                    ? 'bg-slate-50'
                    : 'hover:bg-slate-50/80'
              }`}
            >
              <td className="px-4 py-4 align-top">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggleRow(row.id)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  aria-label={`Select ${row.name}`}
                />
              </td>
              <td className="px-4 py-4 align-top">
                {level === 'ad' ? (
                  <p className="font-medium text-slate-950">
                    {row.name}
                    {lunaHighlight && (
                      <span className="ml-2 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">Luna</span>
                    )}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => onDrillDown(row)}
                    className="text-left font-medium text-slate-950 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                    title={level === 'campaign' ? '查看下属 AdSet' : '查看下属 Ad'}
                  >
                    {row.name}
                    {lunaHighlight && (
                      <span className="ml-2 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">Luna</span>
                    )}
                  </button>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {row.status}
                  {level === 'campaign' && row.budgetType && (
                    <span className="ml-1.5 font-semibold text-slate-400">{row.budgetType}</span>
                  )}
                </p>
              </td>
              <td className="px-4 py-4 align-top text-slate-600">
                <p>{row.platform || 'Meta'} / {row.market || 'US'}</p>
                {row.campaignId && <p className="mt-1 text-xs text-slate-400">{findCampaignName(row.campaignId)}</p>}
                {row.format && <p className="mt-1 text-xs text-slate-400">{row.format}</p>}
              </td>
              {!isAdLevel && (
                <td className="px-4 py-4 align-top">
                  <BudgetCell
                    row={row}
                    level={level}
                    value={budget}
                    onCommit={(nextBudget) => onManualBudgetChange(row, budget, nextBudget)}
                  />
                </td>
              )}
              <td className="px-4 py-4 align-top font-mono text-slate-900">{formatMetric(row.roas)}</td>
              <td className="px-4 py-4 align-top font-mono text-slate-900">{formatCurrency(row.cpa)}</td>
              <td className="px-4 py-4 align-top font-mono text-slate-900">{formatMetric(row.ctr, '%')}</td>
              <td className="px-4 py-4 align-top">
                {isAdLevel ? (
                  <AdSuggestionCell
                    suggestion={adSuggestion}
                    statusOverride={adSuggestionStatuses[row.id]}
                    onApply={() => onApplyAdSuggestion(row)}
                    onReject={() => onRejectAdSuggestion(row)}
                  />
                ) : (
                  <BudgetSuggestionCell
                    recommendation={recommendation}
                    statusOverride={recommendationStatuses[row.id]}
                    onApply={() => onApplyRecommendation(row)}
                    onReject={() => onRejectRecommendation(row)}
                  />
                )}
              </td>
              <td className="px-4 py-4 align-top">
                <ReasonCell
                  recommendation={recommendation}
                  adSuggestion={adSuggestion}
                  onViewDetail={() => onOpenDetail(row)}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
  )
}

const EvidenceDrawer = ({
  entity,
  level,
  onClose,
  recommendation,
  adSuggestion,
  adSuggestionStatus,
  status,
  budget,
  onSetStatus,
  onApplyBudget,
  onManualBudgetChange,
  onRejectRecommendation,
  onApplyAdSuggestion,
  onRejectAdSuggestion,
}) => {
  const [memoryNotice, setMemoryNotice] = useState('')
  if (!entity) return null

  const isAdLevel = level === 'ad'
  const budgetEditable = rowHasEditableBudget(entity, level)
  const budgetModeLabel = getBudgetModeLabel(entity, level)
  const budgetScopeHint = getBudgetScopeHint(entity, level)
  const hasBudgetDiff = recommendation && recommendation.currentBudget !== recommendation.suggestedBudget
  const resolvedAdStatus = adSuggestionStatus || adSuggestion?.status
  const adPending = resolvedAdStatus === '待确认'

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-xl border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {isAdLevel ? 'Ad 决策' : '预算决策'}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{entity.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {isAdLevel ? '素材表现、关停建议与后续观察。' : '表现证据、预算变化和后续观察任务。'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            >
              关闭
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <section className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">当前表现</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['ROAS', formatMetric(entity.roas)],
                ['CPA', formatCurrency(entity.cpa)],
                ['CTR', formatMetric(entity.ctr, '%')],
              ].map(([label, value]) => (
                <div key={label} className="border-t border-slate-200 pt-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {!isAdLevel && (
          <section className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">日预算</p>
            <div className="mt-3">
              {budgetEditable ? (
                <>
                  <BudgetEditableCell
                    value={budget}
                    onCommit={(nextBudget) => onManualBudgetChange(entity, budget, nextBudget)}
                  />
                  <p className="mt-2 text-xs text-slate-500">手动修改后将自动弹出 Luna 追问调整原因。</p>
                </>
              ) : (
                <>
                  {budgetModeLabel ? (
                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700">
                      {budgetModeLabel}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">—</span>
                  )}
                  {budgetScopeHint && (
                    <p className="mt-2 text-xs text-slate-500">{budgetScopeHint}</p>
                  )}
                </>
              )}
            </div>
          </section>
          )}

          {isAdLevel && adSuggestion ? (
            <section className="rounded-3xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getAdActionStyle(adSuggestion.action)}`}>
                  {adSuggestion.action}
                </span>
                {resolvedAdStatus && !adPending && (
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(resolvedAdStatus)}`}>
                    {resolvedAdStatus}
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{adSuggestion.reason}</p>
            </section>
          ) : null}

          {!isAdLevel && recommendation ? (
            <>
              <section className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getActionStyle(recommendation.action)}`}>
                    {recommendation.action}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getRiskStyle(recommendation.risk)}`}>
                    {recommendation.risk}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    置信度 {(recommendation.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700">{recommendation.reason}</p>
              </section>

              <section className="rounded-3xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">判断依据</p>
                <div className="mt-4 space-y-2">
                  {recommendation.evidence.map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {hasBudgetDiff && (
                <section className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">预算变化</p>
                  <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">当前预算</p>
                      <p className="mt-1 font-mono text-xl font-semibold text-slate-950">{formatCurrency(recommendation.currentBudget)}</p>
                    </div>
                    <span className="text-slate-400">调整为</span>
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-xs text-emerald-700">建议预算</p>
                      <p className="mt-1 font-mono text-xl font-semibold text-emerald-950">{formatCurrency(recommendation.suggestedBudget)}</p>
                    </div>
                  </div>
                </section>
              )}

              {recommendation.memoryPrompt && (
                <section className="rounded-3xl border border-sky-200 bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">客户偏好</p>
                  <p className="mt-3 text-sm leading-6 text-sky-900">{recommendation.memoryPrompt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMemoryNotice('已记录为客户偏好，后续建议会参考此规则')
                        setTimeout(() => setMemoryNotice(''), 2500)
                      }}
                      className="rounded-full bg-sky-900 px-3 py-1.5 text-xs font-semibold text-white active:scale-[0.98]"
                    >
                      记录为客户偏好
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemoryNotice('')}
                      className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 active:scale-[0.98]"
                    >
                      稍后再说
                    </button>
                  </div>
                  {memoryNotice && (
                    <p className="mt-3 text-xs font-medium text-sky-800">{memoryNotice}</p>
                  )}
                </section>
              )}
            </>
          ) : !isAdLevel ? (
            <section className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">今日无需调整预算。</p>
            </section>
          ) : !adSuggestion ? (
            <section className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">今日无 Ad 建议。</p>
            </section>
          ) : null}

          <section className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">处理记录</p>
            <div className="mt-4 space-y-3">
              {demoAuditEvents.map((event) => (
                <div key={event.id} className="grid grid-cols-[56px_1fr] gap-3 border-t border-slate-100 pt-3">
                  <p className="font-mono text-xs text-slate-400">{event.at}</p>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{event.event}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.actor}: {event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {isAdLevel && adSuggestion && adPending && (
          <div className="border-t border-slate-200 p-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onApplyAdSuggestion(entity)}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98] ${
                  adSuggestion.action === '建议关停' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-950'
                }`}
              >
                {adSuggestion.action === '建议关停' ? '关停' : '确认'}
              </button>
              <button
                onClick={() => onRejectAdSuggestion(entity)}
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
              >
                拒绝
              </button>
            </div>
          </div>
        )}

        {!isAdLevel && recommendation && budgetEditable && (
          <div className="border-t border-slate-200 p-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onSetStatus(entity.id, '已采纳')
                  onApplyBudget(entity.id, recommendation.suggestedBudget)
                }}
                className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
              >
                采纳
              </button>
              <button
                onClick={() => onSetStatus(entity.id, '人工调整')}
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
              >
                编辑后采纳
              </button>
              <button
                onClick={() => onRejectRecommendation(entity)}
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
              >
                拒绝
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

const BulkActionBar = ({ selectedCount, totalBudgetDelta, convertibleCount, onConvert, onApply }) => {
  if (!selectedCount) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-30 w-[min(860px,calc(100vw-48px))] -translate-x-1/2 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">已选择 {selectedCount} 个预算动作</p>
          <p className="mt-1 text-xs text-slate-500">
            预计日预算变化：<span className="font-mono text-slate-900">{formatCurrency(totalBudgetDelta)}</span>
          </p>
          <p className="mt-1 max-w-md text-[11px] leading-5 text-slate-400">
            转策略任务：纳入本周策略待办，不立刻改账户；应用预算调整：立即采纳并更新当前预算。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onConvert}
            disabled={!convertibleCount}
            title={convertibleCount ? '转入媒体计划与策略 → 本周策略 → 执行待办' : '所选行无预算建议或已转入策略'}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            转策略任务{convertibleCount ? ` (${convertibleCount})` : ''}
          </button>
          <button
            onClick={onApply}
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
          >
            应用预算调整
          </button>
        </div>
      </div>
    </div>
  )
}

const AdsManagerPrototype = () => {
  const navigate = useNavigate()
  const importBudgetTasksFromAds = useStrategyTaskStore((s) => s.importBudgetTasksFromAds)
  const triggerManualChangeFollowUp = useLunaStore((s) => s.triggerManualChangeFollowUp)
  const triggerRejectFollowUp = useLunaStore((s) => s.triggerRejectFollowUp)
  const createAction = useMarketingOpsStore((s) => s.createAction)
  const executeAction = useMarketingOpsStore((s) => s.executeAction)
  const {
    payload,
    appliedEffect,
  } = useLunaSync('ads/campaigns')

  const [activeScenarioId, setActiveScenarioId] = useState('us-roas-decline')
  const [activeLevel, setActiveLevel] = useState('campaign')
  const [filters, setFilters] = useState(TABLE_DEFAULT_FILTERS)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [recommendationStatuses, setRecommendationStatuses] = useState({})
  const [adSuggestionStatuses, setAdSuggestionStatuses] = useState({})
  const [budgetOverrides, setBudgetOverrides] = useState({})
  const [transferNotice, setTransferNotice] = useState('')
  const [hierarchyScope, setHierarchyScope] = useState({ campaignIds: [], adsetIds: [] })

  const activeScenario = useMemo(() => getScenarioById(activeScenarioId), [activeScenarioId])

  const lunaHighlightIds = appliedEffect?.highlightIds || payload?.highlightIds || []

  useEffect(() => {
    if (appliedEffect?.autoSelectIds?.length) {
      setActiveScenarioId('us-roas-decline')
      setActiveLevel('campaign')
      setSelectedIds(appliedEffect.autoSelectIds)
      const nextStatuses = {}
      appliedEffect.autoSelectIds.forEach((id) => {
        nextStatuses[id] = appliedEffect.markStatus || '待确认'
      })
      setRecommendationStatuses((current) => ({ ...current, ...nextStatuses }))
    }
  }, [appliedEffect])

  const rows = useMemo(
    () => getVisibleRows(activeLevel, filters, hierarchyScope),
    [activeLevel, filters, hierarchyScope],
  )

  const levelCounts = useMemo(() => (
    LEVELS.reduce((acc, level) => {
      acc[level.id] = getVisibleRows(level.id, filters, hierarchyScope).length
      return acc
    }, {})
  ), [filters, hierarchyScope])

  const selectedRows = rows.filter((row) => selectedIds.includes(row.id))
  const convertibleRows = selectedRows.filter((row) => {
    const recommendation = getBudgetRecommendationForRow(row, activeLevel)
    if (!recommendation) return false
    const status = recommendationStatuses[row.id] || recommendation.status
    return status !== '已转入策略' && status !== '已采纳' && status !== '已拒绝'
  })
  const totalBudgetDelta = selectedRows.reduce((total, row) => {
    const recommendation = getBudgetRecommendationForRow(row, activeLevel)
    if (!recommendation) return total
    return total + recommendation.suggestedBudget - recommendation.currentBudget
  }, 0)

  const handleLevelChange = (level) => {
    if (level === activeLevel) return

    let nextScope = { ...hierarchyScope }

    if (level === 'campaign') {
      nextScope = { campaignIds: [], adsetIds: [] }
    } else if (level === 'adset') {
      if (activeLevel === 'campaign' && selectedIds.length > 0) {
        nextScope = { campaignIds: [...selectedIds], adsetIds: [] }
      } else if (activeLevel === 'campaign' && selectedIds.length === 0) {
        nextScope = { campaignIds: [], adsetIds: [] }
      } else if (activeLevel === 'ad') {
        nextScope = { ...nextScope, adsetIds: [] }
      }
    } else if (level === 'ad') {
      if (activeLevel === 'adset' && selectedIds.length > 0) {
        nextScope = { ...nextScope, adsetIds: [...selectedIds] }
      } else if (activeLevel === 'adset' && selectedIds.length === 0) {
        nextScope = { ...nextScope, adsetIds: [] }
      } else if (activeLevel === 'campaign' && selectedIds.length > 0) {
        nextScope = { campaignIds: [...selectedIds], adsetIds: [] }
      } else if (activeLevel === 'campaign' && selectedIds.length === 0) {
        nextScope = { campaignIds: [], adsetIds: [] }
      }
    }

    setHierarchyScope(nextScope)
    setActiveLevel(level)
    setSelectedIds([])
    setSelectedEntity(null)
  }

  const handleDrillDown = (row) => {
    if (activeLevel === 'campaign') {
      setHierarchyScope({ campaignIds: [row.id], adsetIds: [] })
      setActiveLevel('adset')
      setSelectedIds([])
      setSelectedEntity(null)
      return
    }

    if (activeLevel === 'adset') {
      setHierarchyScope((prev) => ({
        campaignIds: prev.campaignIds.length ? prev.campaignIds : [row.campaignId],
        adsetIds: [row.id],
      }))
      setActiveLevel('ad')
      setSelectedIds([])
      setSelectedEntity(null)
    }
  }

  const handleOpenDetail = (row) => {
    setSelectedEntity(row)
  }

  const clearHierarchyScope = () => {
    setHierarchyScope({ campaignIds: [], adsetIds: [] })
  }

  const handleScenarioSelect = (scenarioId) => {
    setActiveScenarioId(scenarioId)
  }

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setSelectedIds([])
    setSelectedEntity(null)
    clearHierarchyScope()
  }

  const handleToggleRow = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    ))
  }

  const handleSetStatus = (entityId, status) => {
    setRecommendationStatuses((current) => ({ ...current, [entityId]: status }))
  }

  const handleApplyBudget = (entityId, budget) => {
    setBudgetOverrides((current) => ({ ...current, [entityId]: budget }))
  }

  const handleApplyRecommendation = (row) => {
    const recommendation = getBudgetRecommendationForRow(row, activeLevel)
    if (!recommendation) return
    handleSetStatus(row.id, '已采纳')
    handleApplyBudget(row.id, recommendation.suggestedBudget)
    const actionId = createAction({
      type: '预算调整',
      source: 'Luna 建议',
      target: row.name,
      before: `日预算 ${formatCurrency(recommendation.currentBudget ?? row.dailyBudget)}${row.roas ? ` · ROAS ${row.roas}` : ''}`,
      action: `${recommendation.action}至 ${formatCurrency(recommendation.suggestedBudget)}`,
      status: '待执行',
      proposedBy: 'Luna',
      approvedBy: '优化师',
    })
    executeAction(actionId)
  }

  const handleRejectRecommendation = (row) => {
    const recommendation = getBudgetRecommendationForRow(row, activeLevel)
    handleSetStatus(row.id, '已拒绝')

    if (!recommendation) return

    triggerRejectFollowUp({
      entityName: row.name,
      action: recommendation.action,
      currentBudget: recommendation.currentBudget ?? row.dailyBudget,
      suggestedBudget: recommendation.suggestedBudget,
      memoryPrompt: recommendation.rejectMemoryPrompt,
    })
  }

  const handleApplyAdSuggestion = (row) => {
    const suggestion = getAdSuggestionForEntity(row.id)
    if (!suggestion) return

    if (suggestion.action === '建议关停') {
      setAdSuggestionStatuses((current) => ({ ...current, [row.id]: '已关停' }))
    } else {
      setAdSuggestionStatuses((current) => ({ ...current, [row.id]: '已确认' }))
    }
    const actionId = createAction({
      type: '素材处理',
      source: 'Luna 建议',
      target: row.name,
      before: `当前状态：${row.status || '投放中'}`,
      action: suggestion.action,
      approvedBy: '优化师',
      verificationWindow: '72 小时',
    })
    executeAction(actionId)
  }

  const handleRejectAdSuggestion = (row) => {
    const suggestion = getAdSuggestionForEntity(row.id)
    setAdSuggestionStatuses((current) => ({ ...current, [row.id]: '继续投放' }))

    if (suggestion?.action === '建议关停') {
      triggerRejectFollowUp({
        entityName: row.name,
        action: '建议关停',
        currentBudget: 0,
        suggestedBudget: 0,
        memoryPrompt: `你拒绝了 Luna 对 ${row.name} 的关停建议。方便说一下继续保留投放的原因吗？我会记下来，后续判断会更贴合你的标准。`,
      })
    }
  }

  const handleManualBudgetChange = (row, oldBudget, newBudget) => {
    if (!rowHasEditableBudget(row, activeLevel)) return
    if (Math.round(oldBudget) === Math.round(newBudget)) return

    handleApplyBudget(row.id, newBudget)
    handleSetStatus(row.id, '人工调整')
    const actionId = createAction({
      type: '预算调整',
      source: '人工操作',
      target: row.name,
      before: `日预算 ${formatCurrency(oldBudget)}`,
      action: `日预算调整为 ${formatCurrency(newBudget)}`,
      proposedBy: '优化师',
      approvedBy: '优化师',
    })
    executeAction(actionId)

    const recommendation = getBudgetRecommendationForRow(row, activeLevel)
    triggerManualChangeFollowUp({
      entityName: row.name,
      oldBudget,
      newBudget,
      suggestedBudget: recommendation?.suggestedBudget,
      memoryPrompt: recommendation?.memoryPrompt,
    })
  }

  const handleApplySelected = () => {
    const nextStatuses = {}
    const nextBudgets = {}

    selectedRows.forEach((row) => {
      const recommendation = getBudgetRecommendationForRow(row, activeLevel)
      if (!recommendation) return
      nextStatuses[row.id] = '已采纳'
      nextBudgets[row.id] = recommendation.suggestedBudget
    })

    setRecommendationStatuses((current) => ({ ...current, ...nextStatuses }))
    setBudgetOverrides((current) => ({ ...current, ...nextBudgets }))
    selectedRows.forEach((row) => {
      const recommendation = getBudgetRecommendationForRow(row, activeLevel)
      if (!recommendation) return
      const actionId = createAction({
        type: '预算调整',
        source: 'Luna 批量建议',
        target: row.name,
        before: `日预算 ${formatCurrency(recommendation.currentBudget ?? row.dailyBudget)}`,
        action: `${recommendation.action}至 ${formatCurrency(recommendation.suggestedBudget)}`,
        approvedBy: '优化师',
      })
      executeAction(actionId)
    })
    setSelectedIds([])
  }

  const handleConvertToStrategyTasks = () => {
    if (!convertibleRows.length) return

    const items = convertibleRows.map((row) => ({
      row,
      recommendation: getBudgetRecommendationForRow(row, activeLevel),
    }))

    importBudgetTasksFromAds(items, activeLevel)

    const nextStatuses = {}
    convertibleRows.forEach((row) => {
      nextStatuses[row.id] = '已转入策略'
    })
    setRecommendationStatuses((current) => ({ ...current, ...nextStatuses }))
    setSelectedIds([])
    setTransferNotice(`已将 ${convertibleRows.length} 条预算建议转入「本周策略 → 执行待办」，正在跳转…`)
    setTimeout(() => setTransferNotice(''), 3200)
    navigate('../plan/media-plan?tab=cycle')
  }

  const selectedRecommendation = selectedEntity && activeLevel !== 'ad'
    ? getBudgetRecommendationForRow(selectedEntity, activeLevel)
    : null

  const selectedAdSuggestion = selectedEntity && activeLevel === 'ad'
    ? getAdSuggestionForEntity(selectedEntity.id)
    : null

  const selectedBudget = selectedEntity && rowHasEditableBudget(selectedEntity, activeLevel)
    ? (budgetOverrides[selectedEntity.id] ?? selectedEntity.dailyBudget)
    : 0

  return (
    <div className="-mx-6 min-h-[100dvh] bg-slate-100 px-6 py-6 text-slate-900 lg:px-8">
      <div className="w-full space-y-5">
        <header className="flex flex-wrap items-center justify-end gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
              更新时间 {demoBrand.lastSyncAt}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              {activeScenario.badge}
            </span>
          </div>
        </header>

        <ScenarioStrip activeScenarioId={activeScenarioId} onSelect={handleScenarioSelect} />
        <SituationBrief scenario={activeScenario} onNavigate={navigate} />

        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.22)]">
          <div className="border-b border-slate-200 bg-white p-4">
            <div className="flex justify-end">
              <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                {LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelChange(level.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${
                      activeLevel === level.id
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    {level.label}
                    <span className="ml-2 font-mono text-xs opacity-70">{levelCounts[level.id] ?? 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          {(hierarchyScope.campaignIds.length > 0 || hierarchyScope.adsetIds.length > 0) && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">层级筛选</span>
                {activeLevel === 'adset' && hierarchyScope.campaignIds.length > 0 && (
                  <span className="ml-2">
                    Campaign：
                    {hierarchyScope.campaignIds
                      .map((id) => demoCampaigns.find((item) => item.id === id)?.name)
                      .filter(Boolean)
                      .join('、')}
                  </span>
                )}
                {activeLevel === 'ad' && hierarchyScope.adsetIds.length > 0 && (
                  <span className="ml-2">
                    AdSet：
                    {hierarchyScope.adsetIds
                      .map((id) => demoAdsets.find((item) => item.id === id)?.name)
                      .filter(Boolean)
                      .join('、')}
                  </span>
                )}
                {activeLevel === 'ad' && hierarchyScope.adsetIds.length === 0 && hierarchyScope.campaignIds.length > 0 && (
                  <span className="ml-2">
                    Campaign：
                    {hierarchyScope.campaignIds
                      .map((id) => demoCampaigns.find((item) => item.id === id)?.name)
                      .filter(Boolean)
                      .join('、')}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={clearHierarchyScope}
                className="text-xs font-semibold text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
              >
                清除层级筛选
              </button>
            </div>
          )}

          <EntityTable
            level={activeLevel}
            rows={rows}
            selectedIds={selectedIds}
            onToggleRow={handleToggleRow}
            onDrillDown={handleDrillDown}
            onOpenDetail={handleOpenDetail}
            recommendationStatuses={recommendationStatuses}
            adSuggestionStatuses={adSuggestionStatuses}
            budgetOverrides={budgetOverrides}
            lunaHighlightIds={lunaHighlightIds}
            onApplyRecommendation={handleApplyRecommendation}
            onRejectRecommendation={handleRejectRecommendation}
            onApplyAdSuggestion={handleApplyAdSuggestion}
            onRejectAdSuggestion={handleRejectAdSuggestion}
            onManualBudgetChange={handleManualBudgetChange}
          />
        </section>

      </div>

      <EvidenceDrawer
        entity={selectedEntity}
        level={activeLevel}
        onClose={() => setSelectedEntity(null)}
        recommendation={selectedRecommendation}
        adSuggestion={selectedAdSuggestion}
        adSuggestionStatus={selectedEntity ? adSuggestionStatuses[selectedEntity.id] : null}
        status={selectedEntity ? recommendationStatuses[selectedEntity.id] : null}
        budget={selectedBudget}
        onSetStatus={handleSetStatus}
        onApplyBudget={handleApplyBudget}
        onManualBudgetChange={handleManualBudgetChange}
        onRejectRecommendation={handleRejectRecommendation}
        onApplyAdSuggestion={handleApplyAdSuggestion}
        onRejectAdSuggestion={handleRejectAdSuggestion}
      />

      {activeLevel !== 'ad' && (
      <BulkActionBar
        selectedCount={selectedRows.length}
        totalBudgetDelta={totalBudgetDelta}
        convertibleCount={convertibleRows.length}
        onConvert={handleConvertToStrategyTasks}
        onApply={handleApplySelected}
      />
      )}

      {transferNotice && (
        <div className="fixed bottom-28 left-1/2 z-40 max-w-md -translate-x-1/2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-900 shadow-lg">
          {transferNotice}
        </div>
      )}
    </div>
  )
}

export default AdsManagerPrototype
