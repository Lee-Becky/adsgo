import { X } from 'lucide-react';
import { useZIndex } from '../../../../hooks/useZIndex';

export default function ImagePreviewModal({ isOpen, src, ratio, onClose }) {
  const zIndex = useZIndex(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-3xl max-h-[85vh] flex items-center justify-center">
        <img
          src={src}
          alt=""
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
        {ratio && (
          <span className="absolute bottom-3 left-3 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {ratio}
          </span>
        )}
      </div>
    </div>
  );
}
