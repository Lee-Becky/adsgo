import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 下拉组件首次打开时模拟数据加载的 loading 效果。
 * Meta 断开后自动重置，下次连接重新触发 loading。
 *
 * @param {string} resourceKey  资源标识（如 'accounts'、'catalogs'）
 * @param {boolean} isMetaConnected  Meta 是否已连接
 * @param {number} delay  loading 持续时间（ms），默认 3000
 * @returns {{ isLoading: boolean, hasLoaded: boolean, triggerLoad: () => void }}
 */
const useDropdownLoading = (resourceKey, isMetaConnected, delay = 3000) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const timerRef = useRef(null);

  // Meta 断开时重置状态
  useEffect(() => {
    if (!isMetaConnected) {
      setHasLoaded(false);
      setIsLoading(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isMetaConnected]);

  const triggerLoad = useCallback(() => {
    if (hasLoaded || isLoading) return;
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasLoaded(true);
      timerRef.current = null;
    }, delay);
  }, [hasLoaded, isLoading, delay]);

  // 组件卸载时清理 timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { isLoading, hasLoaded, triggerLoad };
};

export default useDropdownLoading;
