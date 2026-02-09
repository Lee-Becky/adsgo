import { useState, useEffect } from 'react';
import { getNextModalZIndex } from '../constants/zIndex';

/**
 * 自动管理层级的 Hook
 * @param {boolean} isOpen 是否打开
 * @returns {number} 应该使用的 zIndex
 */
export const useZIndex = (isOpen) => {
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setZIndex(getNextModalZIndex());
    }
  }, [isOpen]);

  return zIndex;
};
