import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';

const ChangeCreativesModal = ({ isOpen, onClose, creatives, onConfirm }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  // Default select 3-5 items on open
  useEffect(() => {
    if (isOpen && creatives?.length > 0) {
      const initialSelected = creatives.slice(0, Math.min(5, Math.max(3, creatives.length))).map(c => c.id);
      setSelectedIds(initialSelected);
    }
  }, [isOpen, creatives]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(sid => sid !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-neutral-900/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div 
        className="w-full max-w-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-neutral-900">Change creatives</h3>
            <p className="text-sm font-bold text-neutral-400">Select multiple items to replace the current ad's visual.</p>
          </div>
          <button onClick={onClose} className="p-3 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {creatives?.map((creative) => {
              const isSelected = selectedIds.includes(creative.id);
              return (
                <div 
                  key={creative.id}
                  onClick={() => toggleSelect(creative.id)}
                  className={`group relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ring-offset-4 ${
                    isSelected ? 'ring-4 ring-primary-600 shadow-2xl scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-xl opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={creative.url} className="w-full h-full object-cover" alt="" />
                  
                  {/* Selection Overlay */}
                  <div className={`absolute inset-0 bg-primary-600/10 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  
                  {/* Check Indicator */}
                  <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isSelected ? 'bg-primary-600 text-white scale-100 shadow-lg' : 'bg-white/40 backdrop-blur-md text-white scale-0'
                  }`}>
                    <Check size={18} strokeWidth={3} />
                  </div>

                  {/* Creative Badge if Main */}
                  {creative.isMain && (
                    <div className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur-sm text-[8px] font-black text-white px-2 py-1 rounded-lg tracking-tighter">Main</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between shrink-0">
          <span className="text-sm font-bold text-neutral-400">
            <span className="text-primary-600 font-black">{selectedIds.length}</span> items selected
          </span>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-sm font-black text-neutral-500 hover:text-neutral-700 hover:bg-white transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(selectedIds)}
              className="px-12 py-4 bg-neutral-900 text-white rounded-2xl text-sm font-black hover:bg-black transition-all shadow-xl shadow-neutral-200 active:scale-95"
            >
              Confirm selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCreativesModal;
