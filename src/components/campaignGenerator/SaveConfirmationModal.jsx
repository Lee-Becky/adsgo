import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

const SaveConfirmationModal = ({ isOpen, onClose, onConfirm, brandUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div 
        className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-10 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shield Icon */}
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 shadow-sm">
          <ShieldCheck size={40} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-4">Confirm Brand Details</h3>

        {/* Description */}
        <p className="text-[13px] text-slate-500 leading-relaxed mb-10">
          Once saved, for marketing security, this brand will only allow advertising for subdomains of <span className="text-indigo-600 font-bold">{brandUrl || 'adsgo-store.com'}</span>.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            Confirm and Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal;
