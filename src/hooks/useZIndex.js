import { useState, useEffect } from 'react';
import { getNextModalZIndex } from '../constants/zIndex';

/**
 * 自动管理层级的 Hook
 * @param {boolean} isOpen 是否打开
 * @returns {number} 应该使用的 zIndex
 */
export const useZIndex = (isOpen) => {
  const [zIndex, setZIndex] = useState(() => isOpen ? getNextModalZIndex() : 0);

  useEffect(() => {
    if (isOpen && zIndex === 0) {
      setZIndex(getNextModalZIndex());
    }
  }, [isOpen, zIndex]);

  return zIndex;
};
