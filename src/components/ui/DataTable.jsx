import { useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

const DataTable = ({
  columns = [],
  data = [],
  onSort,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  stickyHeader = true,
  className = '',
}) => {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (col) => {
    if (!col.sortable) return
    const newDir = sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc'
    setSortKey(col.key)
    setSortDir(newDir)
    onSort?.(col.key, newDir)
  }

  return (
    <div className={`bg-white rounded-xl shadow-ring overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Swiss-style header */}
          <thead>
            <tr className="bg-surface-2 border-b-2 border-gray-800">
              {onRowSelect && (
                <th className="w-10 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => {
                      onRowSelect(e.target.checked ? data.map((_, i) => i) : [])
                    }}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500/20"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`
                    px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-gray-400
                    ${col.sortable ? 'cursor-pointer hover:text-gray-600 select-none' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                    ${col.width ? '' : ''}
                  `}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc'
                        ? <ArrowUp size={12} className="text-primary-500" />
                        : <ArrowDown size={12} className="text-primary-500" />
                    )}
                    {col.sortable && sortKey !== col.key && (
                      <ArrowUp size={12} className="text-gray-300" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIdx) => {
              const isSelected = selectedRows.includes(rowIdx)
              return (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick?.(row, rowIdx)}
                  className={`
                    border-b border-gray-100 transition-colors duration-75
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${isSelected
                      ? 'bg-primary-50/60 border-l-[3px] border-l-primary-500'
                      : 'hover:bg-primary-50/40'
                    }
                  `}
                >
                  {onRowSelect && (
                    <td className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          const next = isSelected
                            ? selectedRows.filter(i => i !== rowIdx)
                            : [...selectedRows, rowIdx]
                          onRowSelect(next)
                        }}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500/20"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-4 py-3 text-sm
                        ${col.mono ? 'font-mono tabular-nums text-gray-800' : 'text-gray-700'}
                        ${col.align === 'right' ? 'text-right' : ''}
                      `}
                    >
                      {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
