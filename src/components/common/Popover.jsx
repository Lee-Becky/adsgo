import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Z_INDEX } from '../../constants/zIndex';
import { usePopoverPosition } from '../../hooks/usePopoverPosition';

/**
 * 通用 Popover —— portal 到 document.body，动态定位，自动 flip + clamp。
 * 用于所有用户实时交互的浮层（dropdown / select / menu / autocomplete）。
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {React.RefObject<HTMLElement>} props.anchorRef  触发器 ref，用作定位锚点
 * @param {'bottom-start'|'bottom-end'|'bottom-center'|'top-start'|'top-end'|'top-center'} [props.placement='bottom-start']
 * @param {number} [props.offset=4]                       与 anchor 主轴方向的间距 px
 * @param {boolean} [props.matchWidth=false]              是否让 popover 宽度与 anchor 一致（select 风格）
 * @param {() => void} [props.onClose]                    点外部 / ESC 触发；不传则不会自动关闭
 * @param {boolean} [props.closeOnContentClick=false]     popover 内部点击是否关闭（菜单常用 true）
 * @param {number} [props.zIndex]                         覆盖默认 Z_INDEX.POPOVER（modal 内的 popover 可传更高值）
 * @param {string} [props.className='']                   附加到 popover 根 div 的类名（保留视觉样式）
 * @param {React.CSSProperties} [props.style]
 * @param {React.ReactNode} props.children
 */
export function Popover({
  open,
  anchorRef,
  placement = 'bottom-start',
  offset = 4,
  matchWidth = false,
  onClose,
  closeOnContentClick = false,
  zIndex = Z_INDEX.POPOVER,
  className = '',
  style,
  children,
}) {
  const popoverRef = useRef(null);
  const pos = usePopoverPosition({ anchorRef, popoverRef, open, placement, offset, matchWidth });

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onMouseDown = (e) => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      if (popoverRef.current && popoverRef.current.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div
      ref={popoverRef}
      data-popover-placement={pos.finalPlacement}
      onClick={closeOnContentClick && onClose ? (e) => {
        if (e.target.closest('[data-popover-no-close]')) return;
        onClose();
      } : undefined}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex,
        visibility: pos.ready ? 'visible' : 'hidden',
        ...style,
      }}
      className={`animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      {children}
    </div>,
    document.body
  );
}

export default Popover;
