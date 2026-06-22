import { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, Download, FolderPlus, Sparkles, ChevronDown, Check, X as CloseIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import GeneratingAnimation from './GeneratingAnimation';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function formatDateTimeLabel(timestamp, timeLabel) {
  const dt = new Date(timestamp);
  const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fallbackTime = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${dateStr} ${timeLabel || fallbackTime}`;
}

function formatHistoryDateTime(item) {
  if (!item) return '';
  if (item.date === 'Examples') return 'Example';
  return formatDateTimeLabel(item.timestamp, item.timeLabel);
}

function formatVersionDateTime(version, item) {
  const ts = version.timestamp ?? item.timestamp;
  const tl = version.timeLabel ?? item.timeLabel;
  return formatDateTimeLabel(ts, tl);
}

export default function HistoryDetailPanel({
  selectedHistory,
  isGenerating,
  isEditGenerating,
  showVersionDropdown,
  showSaveDropdown,
  showDownloadDropdown,
  selectedHistoryVariationIndex,
  selectedVariations,
  showRegenerateChat,
  onSetShowVersionDropdown,
  onSetShowSaveDropdown,
  onSetShowDownloadDropdown,
  onSetSelectedHistory,
  onSetItems,
  onSetSelectedHistoryVariationIndex,
  onSetSelectedVariations,
  onSetShowRegenerateChat,
  onSetRegenInitialImages,
  onSetRegenIsMultiple,
  onSetRegenChatInput,
  onRetry,
}) {
  const previewAreaRef = useRef(null);
  const [previewBoxSize, setPreviewBoxSize] = useState(null);

  const activeVersion = selectedHistory?.versions?.[selectedHistory.activeVersionIdx ?? 0];
  const displayPrompt = activeVersion?.prompt ?? selectedHistory?.prompt;
  const displayPreview = activeVersion !== undefined ? activeVersion.preview : selectedHistory?.preview;
  const displayPreviews = activeVersion !== undefined ? activeVersion.previews : selectedHistory?.previews;
  const isVersionProcessing = activeVersion?.status === 'processing';
  const isExampleCreative = selectedHistory?.date === 'Examples';
  const showActions =
    !isExampleCreative &&
    selectedHistory?.status !== 'processing' &&
    selectedHistory?.status !== 'failed' &&
    !isVersionProcessing &&
    !isGenerating &&
    !isEditGenerating;
  const versions = selectedHistory?.versions;
  const activeVersionIdx = selectedHistory?.activeVersionIdx ?? 0;

  // ResizeObserver for aspect-ratio-fit preview
  useEffect(() => {
    if (!displayPreview || !selectedHistory?.ratio || !previewAreaRef.current) {
      setPreviewBoxSize(null);
      return;
    }
    const [w, h] = selectedHistory.ratio.split(':').map(Number);
    if (!w || !h) { setPreviewBoxSize(null); return; }
    const ratio = w / h;

    const updateSize = () => {
      const el = previewAreaRef.current;
      if (!el) return;
      const safeMarginX = 56;
      const safeMarginY = 56;
      const cw = el.clientWidth - safeMarginX;
      const ch = el.clientHeight - safeMarginY;
      if (cw <= 0 || ch <= 0) return;
      let boxW, boxH;
      if (cw / ch > ratio) { boxH = ch; boxW = ch * ratio; }
      else { boxW = cw; boxH = cw / ratio; }
      setPreviewBoxSize({ width: Math.floor(boxW), height: Math.floor(boxH) });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(previewAreaRef.current);
    return () => ro.disconnect();
  }, [displayPreview, selectedHistory?.ratio, selectedHistory?.id]);

  const count = selectedHistory?.imageCount ?? 1;
  const isShowingFilmstrip =
    selectedHistory?.type === 'image' &&
    !isVersionProcessing &&
    selectedHistory?.status !== 'processing' &&
    !isGenerating &&
    count > 1;

  const disabledTip = 'Please select the images above first.';
  const multiImage = count > 1;
  const needsSelection = multiImage && selectedVariations.size === 0;

  const urls = displayPreviews ?? (displayPreview ? Array(count).fill(displayPreview) : []);
  const selCount = selectedVariations.size;
  const allSelected = selCount === count;

  return (
    <main className="flex-1 min-w-0 min-h-0 bg-white rounded-2xl border border-[#F0F0F0] card-shadow overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F5] bg-neutral-50/50 shrink-0 relative z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary-50 text-primary-600 rounded-xl shrink-0">
            <ImageIcon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold text-neutral-900 truncate">
              {selectedHistory?.productTitle || displayPrompt}
            </h3>
            <div className="flex items-center gap-2 text-[14px] text-neutral-400 font-normal mt-0.5">
              <span>{count} Image{count !== 1 ? 's' : ''}</span>
              <span className="text-neutral-200">•</span>
              <span>{selectedHistory?.ratio}</span>
              <span className="text-neutral-200">•</span>
              <span>{formatHistoryDateTime(selectedHistory)}</span>
            </div>
          </div>
        </div>

        {/* Version dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          {versions && versions.length > 1 && (
            <div className="relative">
              <button
                onClick={() => onSetShowVersionDropdown(v => !v)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm font-medium hover:bg-neutral-50 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm',
                  showVersionDropdown ? 'border-primary-500 ring-2 ring-primary-500/20 text-primary-600' : 'border-neutral-300 text-neutral-700'
                )}
              >
                {versions[activeVersionIdx]?.label ?? `Version ${activeVersionIdx + 1}`}
                <ChevronDown size={14} className={cn('transition-transform duration-200 text-neutral-400', showVersionDropdown && 'rotate-180')} />
              </button>
              {showVersionDropdown && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => onSetShowVersionDropdown(false)} />
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-[100] max-h-60 overflow-y-auto" style={{ minWidth: '16rem' }}>
                    {versions.map((v, idx) => {
                      const isSelected = activeVersionIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            const updated = { ...selectedHistory, activeVersionIdx: idx };
                            onSetSelectedHistory(updated);
                            onSetItems(prev => prev.map(i => i.id === selectedHistory.id ? updated : i));
                            onSetSelectedHistoryVariationIndex(0);
                            onSetShowVersionDropdown(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                            isSelected ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-700 hover:bg-neutral-50'
                          )}
                        >
                          {v.status === 'processing' && (
                            <div className="w-3.5 h-3.5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{v.label}</p>
                            <div className={cn('flex items-center gap-1.5 mt-0.5 text-xs whitespace-nowrap overflow-hidden', isSelected ? 'text-primary-400' : 'text-neutral-400')}>
                              <span>{count} Image{count !== 1 ? 's' : ''}</span>
                              {selectedHistory.ratio && <><span className="opacity-40">·</span><span>{selectedHistory.ratio}</span></>}
                              <span className="opacity-40">·</span>
                              <span>{formatVersionDateTime(v, selectedHistory)}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={13} className="text-primary-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filmstrip */}
      {isShowingFilmstrip && (
        <div className="shrink-0 flex items-center justify-center px-4 pt-5 pb-1">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/60 border border-neutral-100 rounded-2xl max-w-full overflow-x-auto">
            {/* Select All / Deselect All */}
            <button
              onClick={() => onSetSelectedVariations(allSelected ? new Set() : new Set(Array.from({ length: count }, (_, i) => i)))}
              className="text-xs font-medium text-neutral-500 hover:text-primary-500 transition-colors px-1 shrink-0 whitespace-nowrap"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            <span className="w-px h-5 bg-neutral-200 shrink-0" />

            {/* Thumbnails */}
            {Array.from({ length: count }, (_, i) => {
              const isActive = selectedHistoryVariationIndex === i;
              const isChecked = selectedVariations.has(i);
              return (
                <div key={i} className="relative group shrink-0">
                  <button
                    type="button"
                    onClick={() => onSetSelectedHistoryVariationIndex(i)}
                    className={cn(
                      'w-16 h-16 rounded-xl border-2 transition-all overflow-hidden block',
                      isActive
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
                    )}
                  >
                    <img src={urls[i] || displayPreview || ''} className="w-full h-full object-cover" alt={`Variation ${i + 1}`} />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onSetSelectedVariations(prev => {
                        const next = new Set(prev);
                        next.has(i) ? next.delete(i) : next.add(i);
                        return next;
                      });
                    }}
                    className={cn(
                      'absolute top-1 right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-sm',
                      isChecked
                        ? 'bg-primary-500 border-primary-500 opacity-100'
                        : 'bg-white/90 border-neutral-300 opacity-0 group-hover:opacity-100'
                    )}
                  >
                    {isChecked && <Check size={10} strokeWidth={3} className="text-white" />}
                  </button>
                </div>
              );
            })}

            {/* N selected */}
            {selCount > 0 && (
              <>
                <span className="w-px h-5 bg-neutral-200 shrink-0" />
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-xs font-medium text-primary-600 shrink-0">{selCount} selected</span>
                  <button onClick={() => onSetSelectedVariations(new Set())} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <CloseIcon size={11} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main preview canvas */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          ref={previewAreaRef}
          className="flex-1 min-h-0 bg-white flex items-center justify-center p-3 overflow-hidden relative"
        >
          {displayPreview && !isGenerating && !isEditGenerating && !isVersionProcessing ? (
            <div className="relative w-full h-full flex items-center justify-center min-w-0 min-h-0 group/preview">
              <div
                onClick={() => {
                  if (count <= 1 || isVersionProcessing) return;
                  onSetSelectedVariations(prev => {
                    const next = new Set(prev);
                    next.has(selectedHistoryVariationIndex) ? next.delete(selectedHistoryVariationIndex) : next.add(selectedHistoryVariationIndex);
                    return next;
                  });
                }}
                className={cn(
                  'relative shadow-2xl rounded-2xl overflow-hidden flex items-center justify-center bg-black/5',
                  count > 1 && !isVersionProcessing && 'cursor-pointer'
                )}
                style={
                  previewBoxSize
                    ? { width: previewBoxSize.width, height: previewBoxSize.height }
                    : selectedHistory?.ratio
                      ? { aspectRatio: selectedHistory.ratio.replace(':', '/'), maxWidth: '100%', maxHeight: '100%' }
                      : undefined
                }
              >
                <img
                  src={(displayPreviews && displayPreviews[selectedHistoryVariationIndex]) ?? displayPreview}
                  className="w-full h-full object-contain"
                  alt="Preview"
                />
                {/* Checkbox on main preview */}
                {count > 1 && !isVersionProcessing && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onSetSelectedVariations(prev => {
                        const next = new Set(prev);
                        next.has(selectedHistoryVariationIndex) ? next.delete(selectedHistoryVariationIndex) : next.add(selectedHistoryVariationIndex);
                        return next;
                      });
                    }}
                    className={cn(
                      'absolute top-2.5 right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-md',
                      selectedVariations.has(selectedHistoryVariationIndex)
                        ? 'bg-primary-500 border-primary-500 opacity-100'
                        : 'bg-white/90 border-neutral-300 opacity-0 group-hover/preview:opacity-100'
                    )}
                  >
                    {selectedVariations.has(selectedHistoryVariationIndex) && <Check size={13} strokeWidth={3} className="text-white" />}
                  </button>
                )}
              </div>
            </div>
          ) : isVersionProcessing || selectedHistory?.status === 'processing' || isGenerating || isEditGenerating ? (
            <div className="flex flex-col items-center justify-center h-full w-full p-8">
              <GeneratingAnimation />
            </div>
          ) : selectedHistory?.status === 'failed' ? (
            <div className="flex flex-col items-center gap-6 max-w-sm text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <CloseIcon size={36} className="text-red-300" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-neutral-900">Generation Failed</p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Something went wrong during generation. Please retry.
                </p>
              </div>
              <button
                onClick={() => onRetry(selectedHistory)}
                className="flex items-center gap-2 px-6 h-10 bg-primary-500 text-white rounded-full text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 whitespace-nowrap transition-all"
              >
                <RotateCcw size={15} />
                Retry
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300 mx-auto">
                <ImageIcon size={40} />
              </div>
              <p className="text-sm font-bold text-neutral-400">Select a creative from history to preview</p>
            </div>
          )}

          {/* Prev / Next arrows */}
          {selectedHistory?.type === 'image' && !isVersionProcessing && !isGenerating && selectedHistory?.status !== 'processing' && displayPreview && count > 1 && (
            <>
              {selectedHistoryVariationIndex > 0 && (
                <button
                  onClick={() => onSetSelectedHistoryVariationIndex(i => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
                >
                  <ChevronLeft size={18} className="text-neutral-600" />
                </button>
              )}
              {selectedHistoryVariationIndex < count - 1 && (
                <button
                  onClick={() => onSetSelectedHistoryVariationIndex(i => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
                >
                  <ChevronRight size={18} className="text-neutral-600" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      {showActions && (
        <div className="shrink-0 px-5 py-3 border-t border-[#F5F5F5] bg-neutral-50/50 flex items-center justify-center gap-2 flex-wrap">
          {/* Download */}
          <div className="relative group/tip">
            <button
              disabled={needsSelection}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all focus:outline-none',
                needsSelection
                  ? 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-white border border-neutral-300 text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-primary-600 hover:border-primary-500'
              )}
            >
              <Download size={16} />
              Download
            </button>
            {needsSelection && (
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block w-max max-w-[260px] bg-neutral-900/90 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg leading-relaxed z-[200]">
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90" />
                {disabledTip}
              </div>
            )}
          </div>

          {/* Save to My Creatives */}
          <div className="relative group/tip">
            <button
              disabled={needsSelection}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all focus:outline-none',
                needsSelection
                  ? 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-white border border-neutral-300 text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-primary-600 hover:border-primary-500'
              )}
            >
              <FolderPlus size={16} />
              Save to My Creatives
            </button>
            {needsSelection && (
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block w-max max-w-[260px] bg-neutral-900/90 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg leading-relaxed z-[200]">
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90" />
                {disabledTip}
              </div>
            )}
          </div>

          {/* Regenerate */}
          <div className="relative group/tip">
            <button
              disabled={needsSelection}
              onClick={needsSelection ? undefined : () => {
                const av = selectedHistory.versions?.[selectedHistory.activeVersionIdx ?? 0];
                const dp = av !== undefined ? av.preview : selectedHistory.preview;
                const dps = av !== undefined ? av.previews : selectedHistory.previews;
                const selVars = selectedVariations.size > 0 ? [...selectedVariations] : [selectedHistoryVariationIndex];
                const isMulti = selVars.length > 1;
                const imgs = selVars.map(i => (dps?.[i] ?? dp ?? '')).filter(Boolean);
                onSetRegenInitialImages(imgs);
                onSetRegenIsMultiple(isMulti);
                onSetRegenChatInput('');
                onSetShowRegenerateChat(true);
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all focus:outline-none',
                needsSelection
                  ? 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-white border border-neutral-300 text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-primary-600 hover:border-primary-500'
              )}
            >
              <Sparkles size={14} />
              Regenerate
            </button>
            {needsSelection && (
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover/tip:block w-max max-w-[260px] bg-neutral-900/90 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg leading-relaxed z-[200]">
                <div className="absolute top-full right-3 border-4 border-transparent border-t-neutral-900/90" />
                {disabledTip}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
