import { RefreshCw, Download } from 'lucide-react';
import { productImg } from '../constants';

const ROW_H = 72;

export default function BatchCard({ batch, isNewest, onRegenerate, onPreview }) {
  const sourceImgUrl = productImg(batch.product.productIdx, batch.image.selectedIdx);
  const resultCount = batch.results.length;

  return (
    <div className={`rounded-xl border border-[#F0F0F0] overflow-hidden card-shadow ${isNewest ? 'fade-in-up' : ''}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={sourceImgUrl} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">{batch.product.name}</p>
            <p className="text-[10px] text-gray-400">
              {batch.template.styleName} &middot; {resultCount} creatives &middot; {batch.createdAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRegenerate(batch.id)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Download All"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results grid */}
      <div className="p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {batch.results.map((item, i) => {
            const thumbW = Math.round(ROW_H * item.w / item.h);
            return (
              <div
                key={i}
                onClick={() => onPreview(item.src, item.ratio)}
                style={{ width: `${thumbW}px`, height: `${ROW_H}px` }}
                className="relative rounded-md overflow-hidden group border border-gray-200 hover:ring-2 hover:ring-primary-500/30 transition-all cursor-pointer flex-shrink-0"
              >
                <img src={item.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-0.5 bg-white/90 rounded text-gray-700 hover:bg-white hover:text-primary-600 transition-all shadow-sm"
                    title="Download"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
                <span className="absolute bottom-0.5 right-0.5 text-[8px] text-white/80 bg-black/30 px-0.5 rounded">
                  {item.ratio}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
