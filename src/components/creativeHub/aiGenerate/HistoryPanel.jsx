import { Plus, History, LayoutGrid, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { EXAMPLE_CASES } from './constants';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function HistoryPanel({
  sortedAndGroupedHistory,
  selectedHistory,
  onSelectHistory,
  onNewCreativeClick,
  onSelectExample,
}) {
  return (
    <aside className="w-[360px] shrink-0 bg-white border border-[#F0F0F0] rounded-2xl card-shadow overflow-hidden flex flex-col">
      {/* New AI Creative button */}
      <div className="p-4 shrink-0 bg-neutral-50/30">
        <button
          onClick={onNewCreativeClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all group bg-white border border-neutral-200 text-neutral-700 hover:border-primary-400 hover:shadow-sm"
        >
          <Plus size={18} className="shrink-0 transition-transform group-hover:rotate-90 text-primary-500" />
          <span className="text-sm font-bold">New AI Creative</span>
        </button>
      </div>

      {/* History label */}
      <div className="px-5 py-3 flex items-center gap-2 shrink-0">
        <History size={14} className="text-neutral-500" />
        <span className="text-[14px] font-semibold text-neutral-700">History</span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 custom-scrollbar">
        {/* Date-grouped history items */}
        {Object.entries(sortedAndGroupedHistory).map(([date, items]) => (
          <div key={date} className="mb-6 last:mb-0">
            <h3 className="px-2 mb-2 text-[12px] font-medium text-neutral-400 tracking-[0.08em] uppercase">
              {date}
            </h3>
            <div className="space-y-1">
              {items.map(item => {
                const latestVersion = item.versions?.[item.versions.length - 1];
                const cardPreview = latestVersion !== undefined ? latestVersion.preview : item.preview;
                const isLatestProcessing = latestVersion?.status === 'processing';
                const showGenerating = item.status === 'processing' || isLatestProcessing;
                const isSelected = selectedHistory?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectHistory(item)}
                    className={cn(
                      'p-2.5 rounded-xl transition-all cursor-pointer group relative overflow-hidden',
                      isSelected ? 'bg-[#F5F1FF]' : 'hover:bg-neutral-50'
                    )}
                  >
                    <div className="flex gap-3 items-center">
                      {/* Thumbnail */}
                      <div className={cn(
                        'w-16 h-16 rounded-lg overflow-hidden shrink-0 relative transition-colors',
                        isSelected ? 'bg-white' : 'bg-[#FAFAFA] group-hover:bg-white'
                      )}>
                        {cardPreview ? (
                          <img
                            src={cardPreview}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : item.status === 'failed' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={20} className="text-neutral-300" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="0" height="0" className="absolute">
                              <linearGradient id="history-icon-grad" x1="0" x2="24" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#C3A2FE" />
                                <stop offset="50%" stopColor="#6424EF" />
                                <stop offset="100%" stopColor="#C3A2FE" />
                                <animateTransform attributeName="gradientTransform" type="translate" from="-24 0" to="24 0" dur="2s" repeatCount="indefinite" />
                              </linearGradient>
                            </svg>
                            <Sparkles size={20} stroke="url(#history-icon-grad)" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="min-w-0">
                          <p className={cn(
                            'text-[14px] font-medium leading-tight truncate',
                            isSelected ? 'text-primary-900' : 'text-neutral-900'
                          )}>
                            {item.productTitle || item.prompt}
                          </p>
                          <p className="text-[13px] text-neutral-500 truncate mt-0.5">
                            {item.productUrl || ''}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-400">
                            <span>{(item.imageCount ?? 1)} {(item.imageCount ?? 1) === 1 ? 'Image' : 'Images'}</span>
                            <span className="text-neutral-300">•</span>
                            <span>{item.ratio}</span>
                            {item.versions && item.versions.length > 1 && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span>v{item.versions.length}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.status === 'failed' ? (
                              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-500">
                                <AlertCircle size={10} />
                                Failed
                              </span>
                            ) : showGenerating ? (
                              <span className="text-[12px] font-bold tracking-tighter animate-shimmer">
                                Generating...
                              </span>
                            ) : (
                              <>
                                {item.timeLabel && (
                                  <span className="text-[12px] text-neutral-400">{item.timeLabel}</span>
                                )}
                                {item.isNew && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Examples section */}
        <div className="mt-4 mb-2 px-2 flex items-center gap-2">
          <LayoutGrid size={14} className="text-neutral-500" />
          <span className="text-[14px] font-semibold text-neutral-700">Examples</span>
        </div>
        <div className="space-y-1">
          {EXAMPLE_CASES.map(ex => {
            const isSelected = selectedHistory?.productUrl === ex.productUrl && selectedHistory?.prompt === ex.prompt;
            return (
              <div
                key={ex.id}
                onClick={() => onSelectExample(ex)}
                className={cn(
                  'p-2.5 rounded-xl transition-all cursor-pointer group relative overflow-hidden',
                  isSelected ? 'bg-[#F5F1FF]' : 'hover:bg-neutral-50'
                )}
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
                    <img
                      src={ex.preview}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div className="min-w-0">
                      <p className={cn(
                        'text-[14px] font-medium leading-tight truncate',
                        isSelected ? 'text-primary-900' : 'text-neutral-900'
                      )}>
                        {ex.prompt}
                      </p>
                      <p className="text-[13px] text-neutral-500 truncate mt-0.5">{ex.productUrl}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 mt-1">
                      <span>{ex.imageCount} Image</span>
                      <span className="text-neutral-300">•</span>
                      <span>{ex.ratio}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
