import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useZIndex } from '../../hooks/useZIndex';

const BaseModal = ({ children, isOpen, onClose, className = "" }) => {
  const zIndex = useZIndex(isOpen);

  useEffect(() => {
    if (isOpen) {
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
      className={`fixed inset-0 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-300 ${className}`}
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
