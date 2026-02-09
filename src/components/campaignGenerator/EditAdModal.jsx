import React, { useState, useEffect } from 'react';
import { X, ImagePlus, ChevronDown, Check, Plus, Trash2 } from 'lucide-react';
import ChangeCreativesModal from './ChangeCreativesModal';
import { useZIndex } from '../../hooks/useZIndex';

const CTA_OPTIONS = [
  'Shop Now',
  'Learn More',
  'Get Quote',
  'Sign Up',
  'Book Now',
  'Contact Us',
  'Download'
];

const EditAdModal = ({ isOpen, onClose, adData, onSave, allCreatives }) => {
  const [headlines, setHeadlines] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [cta, setCta] = useState('Shop Now');
  const [isCtaOpen, setIsCtaOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  const zIndex = useZIndex(isOpen);

  // Synchronize internal state with adData when modal opens
  useEffect(() => {
    if (isOpen && adData) {
      setHeadlines(adData.headlines || ['Winning Style #1']);
      setDescriptions(adData.descriptions || ['Exclusive summer deals on our premium corduroy collection. Shop now for limited offers.']);
      setCta(adData.cta || 'Shop Now');
      setImageUrl(adData.imageUrl || '');
    }
  }, [isOpen, adData]);

  if (!isOpen) return null;

  const handleAddHeadline = () => {
    if (headlines.length < 5) setHeadlines([...headlines, '']);
  };

  const handleAddDescription = () => {
    if (descriptions.length < 5) setDescriptions([...descriptions, '']);
  };

  const removeHeadline = (index) => {
    if (headlines.length > 1) {
      setHeadlines(headlines.filter((_, i) => i !== index));
    }
  };

  const removeDescription = (index) => {
    if (descriptions.length > 1) {
      setDescriptions(descriptions.filter((_, i) => i !== index));
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 p-4"
      style={{ zIndex }}
    >
      <div 
        className="w-full max-w-[560px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold text-slate-900">Edit ad content</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Image Preview */}
          <div className="flex justify-center">
            <div className="relative group w-48 aspect-[4/5] rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => setIsChangeModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-slate-900 shadow-lg hover:bg-white transition-all active:scale-95"
                >
                  <ImagePlus size={14} className="text-indigo-600" />
                  Change
                </button>
              </div>
              <div className="absolute bottom-3 right-3 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <ImagePlus size={20} />
              </div>
            </div>
          </div>

          {/* Headlines Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 tracking-wider">Headlines ({headlines.length}/5)</label>
              {headlines.length < 5 && (
                <button onClick={handleAddHeadline} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                  <Plus size={12} /> Add more
                </button>
              )}
            </div>
            <div className="space-y-3">
              {headlines.map((text, idx) => (
                <div key={idx} className="relative group">
                  <input 
                    type="text"
                    value={text}
                    onChange={(e) => {
                      const newH = [...headlines];
                      newH[idx] = e.target.value;
                      setHeadlines(newH);
                    }}
                    placeholder="Enter headline..."
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  />
                  {headlines.length > 1 && (
                    <button onClick={() => removeHeadline(idx)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 tracking-wider">Descriptions ({descriptions.length}/5)</label>
              {descriptions.length < 5 && (
                <button onClick={handleAddDescription} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                  <Plus size={12} /> Add more
                </button>
              )}
            </div>
            <div className="space-y-3">
              {descriptions.map((text, idx) => (
                <div key={idx} className="relative group">
                  <textarea 
                    value={text}
                    onChange={(e) => {
                      const newD = [...descriptions];
                      newD[idx] = e.target.value;
                      setDescriptions(newD);
                    }}
                    placeholder="Enter description..."
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm font-medium text-slate-600 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                  />
                  {descriptions.length > 1 && (
                    <button onClick={() => removeDescription(idx)} className="absolute right-4 top-4 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Selector */}
          <div className="space-y-4 pb-12">
            <label className="text-[11px] font-bold text-slate-400 tracking-wider">Call to action (CTA)</label>
            <div className="relative">
              <button 
                onClick={() => setIsCtaOpen(!isCtaOpen)}
                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-[1.25rem] flex items-center justify-between text-sm font-bold text-slate-800 hover:bg-slate-100 transition-all"
              >
                {cta}
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCtaOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCtaOpen && (
                <>
                  <div className="fixed inset-0" style={{ zIndex: zIndex + 1 }} onClick={() => setIsCtaOpen(false)} />
                  <div 
                    className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2"
                    style={{ zIndex: zIndex + 2 }}
                  >
                    {CTA_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setCta(opt);
                          setIsCtaOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
                          cta === opt ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                        {cta === opt && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 shrink-0">
          <button 
            onClick={() => onSave({ headlines, descriptions, cta, imageUrl })}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-base flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
          >
            Save & close preview
            <Check size={20} />
          </button>
        </div>
      </div>

      <ChangeCreativesModal 
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        creatives={allCreatives}
        onConfirm={(selectedIds) => {
          const selected = allCreatives.find(c => c.id === selectedIds[0]);
          if (selected) setImageUrl(selected.url);
          setIsChangeModalOpen(false);
        }}
      />
    </div>
  );
};

export default EditAdModal;
