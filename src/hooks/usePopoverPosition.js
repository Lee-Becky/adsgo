import { useState, useEffect, useLayoutEffect, useCallback } from 'react';

/**
 * 计算 popover 相对 anchor 的最终视口坐标。
 * - 主轴（top/bottom）空间不足时自动 flip
 * - 交叉轴（start/end/center）超出视口时 clamp 到内边界
 * - 监听 scroll（capture）与 resize 实时重算
 * - 通过 ResizeObserver 跟踪 anchor / popover 自身尺寸变化
 *
 * @param {object} params
 * @param {React.RefObject<HTMLElement>} params.anchorRef
 * @param {React.RefObject<HTMLElement>} params.popoverRef
 * @param {boolean} params.open
 * @param {'bottom-start'|'bottom-end'|'bottom-center'|'top-start'|'top-end'|'top-center'} [params.placement]
 * @param {number} [params.offset]
 * @param {boolean} [params.matchWidth]
 * @returns {{ top:number, left:number, width?:number, ready:boolean, finalPlacement:string }}
 */
export function usePopoverPosition({
  anchorRef,
  popoverRef,
  open,
  placement = 'bottom-start',
  offset = 4,
  matchWidth = false,
}) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: undefined, ready: false, finalPlacement: placement });

  const update = useCallback(() => {
    if (!anchorRef.current || !popoverRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const pop = popoverRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;

    let side = placement.startsWith('top') ? 'top' : 'bottom';
    const spaceBelow = vh - anchor.bottom - margin;
    const spaceAbove = anchor.top - margin;
    if (side === 'bottom' && spaceBelow < pop.height && spaceAbove > spaceBelow) side = 'top';
    if (side === 'top' && spaceAbove < pop.height && spaceBelow > spaceAbove) side = 'bottom';

    const top = side === 'bottom'
      ? anchor.bottom + offset
      : anchor.top - pop.height - offset;

    const align = placement.endsWith('end') ? 'end' : placement.endsWith('center') ? 'center' : 'start';
    const width = matchWidth ? anchor.width : pop.width;
    let left;
    if (align === 'start') left = anchor.left;
    else if (align === 'end') left = anchor.right - width;
    else left = anchor.left + (anchor.width - width) / 2;
    left = Math.max(margin, Math.min(left, vw - width - margin));

    setPos({
      top,
      left,
      width: matchWidth ? anchor.width : undefined,
      ready: true,
      finalPlacement: `${side}-${align}`,
    });
  }, [anchorRef, popoverRef, placement, offset, matchWidth]);

  useLayoutEffect(() => {
    if (!open) {
      setPos(p => ({ ...p, ready: false }));
      return;
    }
    update();
  }, [open, update]);

  useEffect(() => {
    if (!open) return;
    update();
    const onScroll = () => update();
    const onResize = () => update();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => update());
      if (anchorRef.current) ro.observe(anchorRef.current);
      if (popoverRef.current) ro.observe(popoverRef.current);
    }

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [open, update, anchorRef, popoverRef]);

  return pos;
}
