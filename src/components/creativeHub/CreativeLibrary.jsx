import React, { useState, useRef } from 'react';
import { Trash2, Check, X, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UploadCreativesModal from './UploadCreativesModal';
import { useOnboardingTour } from '../onboarding/useOnboardingTour';
import OnboardingSpotlight from '../onboarding/OnboardingSpotlight';

const initialCreatives = [
  { id: 1, url: '/ad-preview.jpg', name: 'Product Showcase 1' },
  { id: 2, url: '/ad edit.jpg', name: 'Ad Edit Preview' },
  { id: 3, url: '/ad insights .png', name: 'Performance Insights' },
  { id: 4, url: '/adset edit.jpg', name: 'Adset Configuration' },
  { id: 5, url: '/publish.png', name: 'Launch Creative' },
  { id: 6, url: '/Solid Clean background.webp', name: 'Clean Background' },
  { id: 7, url: '/Blurry image.webp', name: 'Lifestyle Blur' },
  { id: 8, url: '/Messy background.webp', name: 'Dynamic Background' },
  { id: 9, url: '/Transparent image.webp', name: 'Transparent Product' },
  { id: 10, url: '/budget reason detail.jpg', name: 'Budget Detail' },
];

const CreativeLibrary = () => {
  const [creatives, setCreatives] = useState(initialCreatives);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewCreative, setPreviewCreative] = useState(null);

  const navigate = useNavigate();
  const { isActive, tourSubStep, endTour, advanceTourSubStep } = useOnboardingTour(4);
  const libraryHeaderRef = useRef(null);

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSingle = (e, id) => {
    e.stopPropagation();
    setCreatives(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  const handleDeleteSelected = () => {
    setCreatives(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const handlePreview = (e, creative) => {
    e.stopPropagation();
    setPreviewCreative(creative);
  };

  return (
    <>
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            ref={libraryHeaderRef}
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} />
            Add Creatives
          </button>
        </div>
        
        <div className="flex items-center gap-3 h-10">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm animate-in fade-in slide-in-from-right-2 duration-200"
            >
              <Trash2 size={16} />
              Delete ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {creatives.map((creative) => (
            <div 
              key={creative.id}
              className={`group relative bg-white rounded-xl border-2 transition-all overflow-hidden ${
                selectedIds.includes(creative.id) 
                ? 'border-blue-500 ring-2 ring-blue-500/10' 
                : 'border-transparent hover:border-gray-200'
              } shadow-sm hover:shadow-md`}
            >
              <div className="aspect-[1/1] relative bg-gray-50 overflow-hidden">
                <img 
                  src={creative.url} 
                  alt={creative.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Selection Hotspot (ONLY THIS PART TRIGGERS SELECTION) */}
                <div 
                  onClick={(e) => toggleSelect(e, creative.id)}
                  className="absolute top-0 right-0 p-3 z-20 cursor-pointer group/check"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(creative.id)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white/80 border-gray-300 group-hover/check:border-blue-400'
                  }`}>
                    {selectedIds.includes(creative.id) ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                    )}
                  </div>
                </div>

                {/* Hover Actions Overlay (Now buttons have their own click handlers) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                  <button
                    onClick={(e) => handlePreview(e, creative)}
                    className="p-2.5 bg-white rounded-full text-blue-600 shadow-xl hover:bg-blue-50 hover:scale-110 transition-all active:scale-95"
                    title="Preview creative"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteSingle(e, creative.id)}
                    className="p-2.5 bg-white rounded-full text-red-500 shadow-xl hover:bg-red-50 hover:scale-110 transition-all active:scale-95"
                    title="Delete creative"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Selection Overlay (subtle) */}
                <div className={`absolute inset-0 transition-colors pointer-events-none ${
                  selectedIds.includes(creative.id) ? 'bg-blue-500/5' : 'bg-transparent'
                }`} />
              </div>
              
              <div className="p-2 border-t border-gray-50 bg-white">
                <p className="text-[11px] font-medium text-gray-600 truncate">{creative.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {creatives.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <Trash2 size={40} className="mb-3 opacity-20" />
            <p className="text-base">No creatives found</p>
          </div>
        )}
      </div>

      <UploadCreativesModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      {/* Image Preview Modal */}
      {previewCreative && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-8">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewCreative(null)}
          />
          <div className="relative max-w-5xl max-h-full flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setPreviewCreative(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <img 
              src={previewCreative.url} 
              alt={previewCreative.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="mt-4 text-white text-lg font-medium">{previewCreative.name}</p>
          </div>
        </div>
      )}
    </div>

    {isActive && tourSubStep === 1 && (
      <OnboardingSpotlight
        targetRef={libraryHeaderRef}
        stepLabel="2/4"
        title="创意素材库"
        body="所有广告素材统一存放在这里。点击「Upload Creatives」可批量上传本地图片或视频，上传后可直接用于广告投放"
        onSkip={endTour}
        onNext={advanceTourSubStep}
        nextText="下一步"
      />
    )}
    </>
  );
};

export default CreativeLibrary;
