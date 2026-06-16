import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { PAGE_SIZE_OPTIONS } from '../mockData'

const DataTable = ({ columns, data, pageSize: initialPageSize = 20, showSummary = false }) => {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const pageData = sortedData.slice(page * pageSize, (page + 1) * pageSize)

  const isNumeric = (key) => data.length > 0 && typeof data[0][key] === 'number'

  // Compute column sums for summary row
  const columnSums = useMemo(() => {
    if (!showSummary) return {}
    const sums = {}
    columns.forEach(col => {
      if (isNumeric(col.key)) {
        sums[col.key] = data.reduce((acc, row) => acc + (Number(row[col.key]) || 0), 0)
      }
    })
    return sums
  }, [data, columns, showSummary])

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 sticky top-0 z-10">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-[11px] font-black text-slate-500 cursor-pointer hover:text-slate-700 transition-colors whitespace-nowrap ${
                    isNumeric(col.key) ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex items-center gap-1 ${isNumeric(col.key) ? 'justify-end' : ''}`}>
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    ) : (
                      <ChevronsUpDown size={10} className="opacity-30" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pageData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap ${
                      isNumeric(col.key) ? 'text-right text-slate-700 font-mono' : 'text-left text-slate-600'
                    }`}
                  >
                    {typeof row[col.key] === 'number' ? row[col.key].toLocaleString() : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {showSummary && data.length > 0 && (
            <tfoot className="sticky bottom-0 z-10">
              <tr className="bg-slate-100 border-t-2 border-slate-200">
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2.5 text-[11px] font-black whitespace-nowrap ${
                      isNumeric(col.key) ? 'text-right text-slate-800 font-mono' : 'text-left text-slate-500'
                    }`}
                  >
                    {idx === 0 ? 'Total' : isNumeric(col.key) ? columnSums[col.key]?.toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }}
            className="px-2 py-1 text-[11px] font-medium border border-slate-200 rounded-md bg-white text-slate-700 outline-none"
          >
            {PAGE_SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 ml-2">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sortedData.length)} of {sortedData.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-[11px] text-slate-400 px-2">{page + 1} / {totalPages || 1}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
