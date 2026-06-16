import { Plus } from 'lucide-react'

const DatasetListSidebar = ({ items, selectedId, onSelect, onCreate, title = 'Datasets', renderItem }) => {
  return (
    <div className="w-[220px] flex-shrink-0 border-r border-slate-100 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400">{title}</h4>
        {onCreate && (
          <button
            onClick={onCreate}
            className="p-1 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-md transition-all"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[11px] text-slate-400">No items yet</p>
          </div>
        ) : (
          items.map(item => {
            const isActive = item.id === selectedId
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-indigo-50 border-r-2 border-indigo-500'
                    : 'hover:bg-slate-50'
                }`}
              >
                {renderItem ? renderItem(item, isActive) : (
                  <div>
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{item.name}</p>
                    {item.rowCount != null && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.rowCount.toLocaleString()} rows</p>
                    )}
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default DatasetListSidebar
