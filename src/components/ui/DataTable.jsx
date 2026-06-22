import { useState, useCallback, useMemo, Fragment } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronRight } from 'lucide-react'

/* ── Skeleton row for loading state ───────────────────────── */
const SkeletonRow = ({ cols }) => (
  <tr className="border-b border-neutral-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div
          className="h-4 rounded-sm animate-shimmer bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 bg-[length:200%_100%]"
          style={{ width: `${60 + Math.random() * 30}%` }}
        />
      </td>
    ))}
  </tr>
)

/* ── Checkbox ─────────────────────────────────────────────── */
const RowCheckbox = ({ checked, indeterminate, onChange, ariaLabel }) => (
  <label className="relative flex items-center justify-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => { if (el) el.indeterminate = !!indeterminate }}
      onChange={onChange}
      className="
        w-4 h-4 rounded-checkbox border border-neutral-300
        text-primary-500 bg-surface
        focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0
        cursor-pointer transition-colors duration-fast
      "
      aria-label={ariaLabel}
    />
  </label>
)

/* ── Main DataTable Component ─────────────────────────────── */
const DataTable = ({
  columns = [],
  data = [],
  sortKey: controlledSortKey,
  sortDir: controlledSortDir,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectRows,
  onRowSelect, // backward compat alias
  onRowClick,
  expandable = false,
  renderExpanded,
  loading = false,
  emptyMessage = 'No data to display',
  stickyHeader = true,
  className = '',
}) => {
  /* Internal sort state (fallback if uncontrolled) */
  const [internalSortKey, setInternalSortKey] = useState(null)
  const [internalSortDir, setInternalSortDir] = useState('asc')
  const [expandedRows, setExpandedRows] = useState(new Set())

  // Resolve controlled vs. uncontrolled
  const activeSortKey = controlledSortKey !== undefined ? controlledSortKey : internalSortKey
  const activeSortDir = controlledSortDir !== undefined ? controlledSortDir : internalSortDir

  // Normalize row selection handler
  const handleSelectRows = onSelectRows || onRowSelect

  /* ── Sort handler ───────────────────────────────────────── */
  const handleSort = useCallback((col) => {
    if (!col.sortable) return
    const newDir = activeSortKey === col.key && activeSortDir === 'asc' ? 'desc' : 'asc'

    if (controlledSortKey === undefined) {
      setInternalSortKey(col.key)
      setInternalSortDir(newDir)
    }
    onSort?.(col.key, newDir)
  }, [activeSortKey, activeSortDir, controlledSortKey, onSort])

  /* ── Row selection ──────────────────────────────────────── */
  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0 && !allSelected

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      handleSelectRows?.([])
    } else {
      handleSelectRows?.(data.map((_, i) => i))
    }
  }, [allSelected, data, handleSelectRows])

  const toggleSelectRow = useCallback((rowIdx, e) => {
    e?.stopPropagation?.()
    const isSelected = selectedRows.includes(rowIdx)
    const next = isSelected
      ? selectedRows.filter(i => i !== rowIdx)
      : [...selectedRows, rowIdx]
    handleSelectRows?.(next)
  }, [selectedRows, handleSelectRows])

  /* ── Expand handler ─────────────────────────────────────── */
  const toggleExpand = useCallback((rowIdx) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowIdx)) next.delete(rowIdx)
      else next.add(rowIdx)
      return next
    })
  }, [])

  /* ── Computed column count ──────────────────────────────── */
  const totalCols = useMemo(() => {
    let c = columns.length
    if (selectable) c++
    if (expandable) c++
    return c
  }, [columns.length, selectable, expandable])

  /* ── Sort icon ──────────────────────────────────────────── */
  const SortIcon = ({ col }) => {
    if (!col.sortable) return null
    if (activeSortKey === col.key) {
      return activeSortDir === 'asc'
        ? <ArrowUp size={12} className="text-primary-500" />
        : <ArrowDown size={12} className="text-primary-500" />
    }
    return <ArrowUpDown size={12} className="text-neutral-300" />
  }

  return (
    <div className={`bg-surface rounded-lg shadow-ring overflow-hidden ${className}`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          {/* ── Header ─────────────────────────────────────── */}
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="surface-nested border-b border-neutral-200">
              {/* Expand toggle spacer */}
              {expandable && (
                <th className="w-10 px-2 py-3" />
              )}

              {/* Select-all checkbox */}
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <RowCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleSelectAll}
                    ariaLabel="Select all rows"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`
                    px-4 py-3 text-left
                    text-overline text-neutral-500 font-semibold
                    ${col.sortable ? 'cursor-pointer hover:text-neutral-700 select-none' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                  `.replace(/\s+/g, ' ').trim()}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────────────── */}
          <tbody>
            {/* Loading skeleton */}
            {loading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={`skel-${i}`} cols={totalCols} />
                ))}
              </>
            )}

            {/* Empty state */}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={totalCols}
                  className="px-4 py-12 text-center text-body text-neutral-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && data.map((row, rowIdx) => {
              const isSelected = selectedRows.includes(rowIdx)
              const isExpanded = expandedRows.has(rowIdx)
              const isEven = rowIdx % 2 === 0

              return (
                <Fragment key={row.id || rowIdx}>
                  <tr
                    onClick={() => {
                      if (expandable) toggleExpand(rowIdx)
                      onRowClick?.(row, rowIdx)
                    }}
                    className={`
                      border-b border-neutral-100
                      transition-colors duration-fast
                      ${onRowClick || expandable ? 'cursor-pointer' : ''}
                      ${isSelected
                        ? 'bg-primary-50/60 border-l-[3px] border-l-primary-500'
                        : isEven
                          ? 'bg-surface'
                          : 'bg-neutral-50/50'
                      }
                      ${!isSelected ? 'hover:bg-primary-50/30' : ''}
                    `.replace(/\s+/g, ' ').trim()}
                  >
                    {/* Expand arrow */}
                    {expandable && (
                      <td className="w-10 px-2 py-3">
                        <ChevronRight
                          size={14}
                          className={`
                            text-neutral-400 transition-transform duration-fast
                            ${isExpanded ? 'rotate-90' : ''}
                          `.replace(/\s+/g, ' ').trim()}
                        />
                      </td>
                    )}

                    {/* Row checkbox */}
                    {selectable && (
                      <td className="w-10 px-4 py-3">
                        <RowCheckbox
                          checked={isSelected}
                          onChange={(e) => toggleSelectRow(rowIdx, e)}
                          ariaLabel={`Select row ${rowIdx + 1}`}
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`
                          px-4 py-3 text-body
                          ${col.mono ? 'font-mono tabular-nums text-neutral-800' : 'text-neutral-700'}
                          ${col.align === 'right' ? 'text-right' : ''}
                        `.replace(/\s+/g, ' ').trim()}
                      >
                        {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                      </td>
                    ))}
                  </tr>

                  {/* Expanded content */}
                  {expandable && isExpanded && renderExpanded && (
                    <tr className="bg-neutral-50/80">
                      <td colSpan={totalCols} className="px-6 py-4">
                        <div className="animate-slide-up">
                          {renderExpanded(row, rowIdx)}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
