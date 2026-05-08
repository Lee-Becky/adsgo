import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * 全屏素材预览浮窗 —— inline style + portal 双重保险，避免 Tailwind JIT 漏扫导致的"挂载了但看不到"。
 *
 * @param {object} props
 * @param {{ url: string, mediaType?: 'image'|'video', name?: string } | null} props.media
 * @param {() => void} props.onClose
 */
export default function MediaPreviewModal({ media, onClose }) {
  useEffect(() => {
    if (!media) return;
    console.log('[MediaPreviewModal] mounted with', media);
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      console.log('[MediaPreviewModal] unmounted');
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [media, onClose]);

  if (!media || typeof document === 'undefined') return null;

  const backdropStyle = {
    position: 'fixed',
    top: 0, right: 0, bottom: 0, left: 0,
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.78)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    animation: 'mediaPreviewFadeIn 0.15s ease-out',
  };

  const innerStyle = {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  };

  const mediaStyle = {
    maxWidth: '100%',
    maxHeight: '80vh',
    borderRadius: 16,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    background: '#000',
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: 24, right: 24,
    width: 40, height: 40,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.12)',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: 22,
    lineHeight: 1,
  };

  return createPortal(
    <div style={backdropStyle} onClick={onClose} role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        style={closeBtnStyle}
        title="关闭 (Esc)"
        aria-label="关闭预览"
      >
        ×
      </button>
      <div style={innerStyle} onClick={(e) => e.stopPropagation()}>
        {media.mediaType === 'video' ? (
          <video
            src={media.url}
            controls
            autoPlay
            style={{ ...mediaStyle, objectFit: 'contain' }}
          />
        ) : (
          <img
            src={media.url}
            alt={media.name || ''}
            style={{ ...mediaStyle, objectFit: 'contain', background: '#fff' }}
          />
        )}
        {media.name && (
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: 500, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 12px', margin: 0 }}>
            {media.name}
          </p>
        )}
      </div>
      <style>{`@keyframes mediaPreviewFadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>,
    document.body
  );
}
