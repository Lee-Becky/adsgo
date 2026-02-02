import React from 'react';
import { X, Check } from 'lucide-react';

const EditAdsetDrawer = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[700] flex items-end justify-center animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer Content - Full Width with Height Limit */}
      <div 
        className="relative w-full bg-white rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.15)] flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-500 ease-out overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 leading-tight">Edit adset config</h3>
            <p className="text-sm font-bold text-slate-400 italic">Adjust audience targeting and adset level settings.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Content Area - Height adaptive & scrollable */}
        <div className="p-10 bg-slate-50/20 flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl bg-white group transition-all duration-700 hover:shadow-indigo-100">
            <img 
              src="/adset edit.jpg" 
              className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.01]" 
              alt="Edit Adset Config" 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-white border-t border-slate-50 flex items-center justify-end gap-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <button 
            onClick={onClose}
            className="px-10 py-4 rounded-2xl text-sm font-black text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-16 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Save change
            <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdsetDrawer;
