import { useState, useMemo } from 'react'
import {
  Calendar, Download, Columns3, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronDown, Search,
} from 'lucide-react'
import { DAILY_PERFORMANCE, CAMPAIGN_PERFORMANCE } from './reportMockData'

/* ═══════════════════════════════════════════════════════════
   PerformanceTable — Detailed performance data table
   Filterable by date range, sortable columns, column toggle
   ═══════════════════════════════════════════════════════════ */

const ALL_COLUMNS = [
  { key: 'date',        label: 'Date',         type: 'date',    defaultVisible: true },
  { key: 'spend',       label: 'Spend',        type: 'currency', defaultVisible: true },
  { key: 'impressions', label: 'Impressions',  type: 'number',   defaultVisible: true },
  { key: 'clicks',      label: 'Clicks',       type: 'number',   defaultVisible: true },
  { key: 'ctr',         label: 'CTR',          type: 'percent',  defaultVisible: true },
  { key: 'cpc',         label: 'CPC',          type: 'currency', defaultVisible: true },
  { key: 'cpa',         label: 'CPA',          type: 'currency', defaultVisible: true },
  { key: 'roas',        label: 'ROAS',         type: 'roas',     defaultVisible: true },
  { key: 'purchases',   label: 'Purchases',    type: 'number',   defaultVisible: true },
  { key: 'addToCart',   label: 'Add to Cart',  type: 'number',   defaultVisible: false },
]

const VIEW_OPTIONS = [
  { id: 'daily',    label: 'Daily Summary' },
  { id: 'campaign', label: 'By Campaign' },
]

/* ── Formatters ───────────────────────────────────────────── */
const fmt = {
  date:     (v) => v,
  currency: (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  number:   (v) => Number(v).toLocaleString('en-US'),
  percent:  (v) => `${Number(v).toFixed(2)}%`,
  roas:     (v) => `${Number(v).toFixed(2)}x`,
}

const PerformanceTable = () => {
  const [view, setView] = useState('daily')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [visibleCols, setVisibleCols] = useState(
    () => new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.key))
  )
  const [showColPicker, setShowColPicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const columns = useMemo(
    () => (view === 'campaign'
      ? [{ key: 'name', label: 'Campaign', type: 'text', defaultVisible: true }, ...ALL_COLUMNS.filter(c => c.key !== 'date')]
      : ALL_COLUMNS
    ).filter(c => visibleCols.has(c.key) || c.key === 'date' || c.key === 'name'),
    [view, visibleCols]
  )

  const rawData = view === 'daily' ? DAILY_PERFORMANCE : CAMPAIGN_PERFORMANCE

  const sortedData = useMemo(() => {
    let d = [...rawData]
    if (searchQuery && view === 'campaign') {
      d = d.filter(r => r.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    d.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return d
  }, [rawData, sortKey, sortDir, searchQuery, view])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const toggleColumn = (key) => {
    setVisibleCols(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const getSortIcon = (key) => {
    if (sortKey !== key) return <ArrowUpDown size={12} className="text-neutral-300" />
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-primary-500" />
      : <ArrowDown size={12} className="text-primary-500" />
  }

  const getCellColor = (col, value) => {
    if (col.key === 'roas') {
      if (value >= 3.5) return 'text-success-600 font-semibold'
      if (value >= 2.5) return 'text-warning-600 font-semibold'
      return 'text-danger-600 font-semibold'
    }
    if (col.key === 'cpa' && value > 28) return 'text-danger-600 font-semibold'
    return 'text-neutral-700'
  }

  return (
    <div className="space-y-5">
      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-caption font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* ── Controls bar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
          {VIEW_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { setView(opt.id); setSortKey(opt.id === 'daily' ? 'date' : 'spend'); setSortDir('desc') }}
              className={`px-3 py-1.5 text-caption font-medium transition-colors ${
                view === opt.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-500 hover:bg-neutral-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search (campaign view only) */}
        {view === 'campaign' && (
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 text-caption text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 w-52"
            />
          </div>
        )}

        {/* Date range placeholder */}
        <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 text-caption font-medium text-neutral-600 hover:bg-neutral-50">
          <Calendar size={14} />
          Jun 3 - Jun 16
          <ChevronDown size={12} />
        </button>

        {/* Column picker */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowColPicker(!showColPicker)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-caption font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <Columns3 size={14} />
            Columns
          </button>
          {showColPicker && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-xl z-20 py-2 px-1">
              {ALL_COLUMNS.filter(c => c.key !== 'date').map(col => (
                <label key={col.key} className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleCols.has(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="w-3.5 h-3.5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                  />
                  <span className="text-caption text-neutral-700">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Data table ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-4 py-3 font-semibold text-neutral-600 whitespace-nowrap cursor-pointer hover:text-neutral-900 transition-colors ${
                      col.key === 'name' ? 'text-left' : col.key === 'date' ? 'text-left' : 'text-right'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {getSortIcon(col.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 tabular-nums ${
                        col.key === 'name' ? 'text-left text-neutral-800 font-medium max-w-[260px] truncate' :
                        col.key === 'date' ? 'text-left text-neutral-800' :
                        `text-right ${getCellColor(col, row[col.key])}`
                      }`}
                    >
                      {col.type === 'text' ? row[col.key] : (fmt[col.type] || fmt.number)(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-caption text-neutral-400">
            {sortedData.length} {view === 'daily' ? 'days' : 'campaigns'}
          </span>
          <span className="text-caption text-neutral-400">
            Total Spend: ${sortedData.reduce((s, r) => s + r.spend, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceTable
