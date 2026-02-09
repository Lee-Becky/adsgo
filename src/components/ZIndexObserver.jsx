import { useEffect } from 'react';
import { updateMaxZIndex } from '../constants/zIndex';

/**
 * ZIndexObserver 组件
 * 用于监控 DOM 变化，当有新元素出现且具有 z-index 时，自动提升全局最大层级
 */
const ZIndexObserver = () => {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // ELEMENT_NODE
              const element = node;
              const style = window.getComputedStyle(element);
              const zIndex = parseInt(style.zIndex, 10);
              
              if (!isNaN(zIndex)) {
                updateMaxZIndex(zIndex);
              }
              
              // 递归检查子节点
              element.querySelectorAll('*').forEach(child => {
                const childStyle = window.getComputedStyle(child);
                const childZIndex = parseInt(childStyle.zIndex, 10);
                if (!isNaN(childZIndex)) {
                  updateMaxZIndex(childZIndex);
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default ZIndexObserver;
