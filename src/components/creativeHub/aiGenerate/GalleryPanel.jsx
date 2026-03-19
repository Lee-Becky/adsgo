import { useRef, useEffect } from 'react';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GeneratingCard from './gallery/GeneratingCard';
import BatchCard from './gallery/BatchCard';

export default function GalleryPanel({ gallery, onRegenerate, onPreview }) {
  const areaRef = useRef(null);

  const doneBatches = gallery.filter(b => b.status === 'done');
  const totalCreatives = doneBatches.reduce((sum, b) => sum + b.results.length, 0);
  const batchCount = doneBatches.length;
  const statsText = batchCount > 0
    ? `${batchCount} batch${batchCount > 1 ? 'es' : ''} \u00b7 ${totalCreatives} creatives`
    : '';

  // Scroll to top when gallery changes
  useEffect(() => {
    if (areaRef.current && gallery.length > 0) {
      areaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gallery.length]);

  return (
    <div className="flex-1 bg-white rounded-[20px] border border-[#F0F0F0] card-shadow flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Creative Gallery</h3>
          <span className="text-[10px] text-gray-400">{statsText}</span>
        </div>
      </div>

      {/* Gallery area */}
      <div ref={areaRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {gallery.length === 0 ? (
          <GalleryEmptyState />
        ) : (
          gallery.map((batch, idx) =>
            batch.status === 'generating' ? (
              <GeneratingCard key={batch.id} batch={batch} />
            ) : (
              <BatchCard
                key={batch.id}
                batch={batch}
                isNewest={idx === 0}
                onRegenerate={onRegenerate}
                onPreview={onPreview}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
