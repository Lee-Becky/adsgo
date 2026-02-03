import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getNextModalZIndex } from '../../constants/zIndex';

const BaseModal = ({ children, isOpen, onClose, className = "" }) => {
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setZIndex(getNextModalZIndex());
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 ${className}`}
      style={{ zIndex }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;
