import React, { useState } from 'react';
import { Plus, Sparkles, Upload, Image as ImageIcon, X, Check, Filter } from 'lucide-react';
import { generateAIGCCreative } from '../services/mockAiService';

const MOCK_LIBRARY = [
  { id: 'lib-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400', relatedProduct: '意式复古灯芯绒外套' },
  { id: 'lib-2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', relatedProduct: '极简主义皮靴' },
  { id: 'lib-3', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', relatedProduct: '意式复古灯芯绒外套' },
  { id: 'lib-4', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400', relatedProduct: '意式复古灯芯绒外套' },
  { id: 'lib-5', url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400', relatedProduct: '极简主义皮靴' },
  { id: 'lib-6', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400', relatedProduct: '意式复古灯芯绒外套' },
];

const CreativeGallery = ({ creatives, onAdd, onRemove, selectedProductName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showOnlyRelated, setShowOnlyRelated] = useState(true);

  const handleAIGC = async () => {
    setIsGenerating(true);
    const url = await generateAIGCCreative("Professional advertising product photography, studio lighting, high resolution");
    onAdd({ id: `aigc-${Date.now()}`, url });
    setIsGenerating(false);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onAdd({ id: `upload-${Date.now()}`, url });
      }
    };
    input.click();
  };

  const toggleLibraryItem = (item) => {
    const isSelected = creatives.some(c => c.id === item.id);
    if (isSelected) {
      onRemove(item.id);
    } else {
      onAdd(item);
    }
  };

  const filteredLibrary = showOnlyRelated && selectedProductName
    ? MOCK_LIBRARY.filter(item => item.relatedProduct === selectedProductName)
    : MOCK_LIBRARY;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setShowLibraryModal(true)}
          className="flex flex-col items-center justify-center p-6 rounded-section border-2 border-dashed bg-white border-gray-200 text-gray-400 hover:border-primary-200 hover:bg-gray-50 transition-all duration-200 group"
        >
          <ImageIcon size={28} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">从素材库选择</span>
        </button>

        <button
          onClick={handleUpload}
          className="flex flex-col items-center justify-center p-6 rounded-section border-2 border-dashed bg-white border-gray-200 text-gray-400 hover:border-primary-200 hover:bg-gray-50 transition-all duration-200 group"
        >
          <Upload size={28} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">本地上传素材</span>
        </button>

        <button
          disabled={isGenerating}
          onClick={handleAIGC}
          className="flex flex-col items-center justify-center p-6 rounded-section border-2 border-dashed bg-primary-50/30 border-primary-200 text-primary-500 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex flex-col items-center animate-pulse">
              <Sparkles size={28} className="mb-2" />
              <span className="text-xs font-medium">AI 生成中...</span>
            </div>
          ) : (
            <>
              <Sparkles size={28} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">AIGC 生成素材</span>
            </>
          )}
        </button>
      </div>

      {showLibraryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-section shadow-xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">公司素材库</h3>
                <p className="text-sm text-gray-500 mt-0.5">选择已有的优质营销资产</p>
              </div>
              <button onClick={() => setShowLibraryModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <X size={20} />
              </button>
            </div>

            {/* Filter bar */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500">过滤选项</span>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className={`text-xs font-medium transition-colors duration-200 ${showOnlyRelated ? 'text-primary-500' : 'text-gray-400'}`}>仅显示关联素材</span>
                <button
                  role="switch"
                  aria-checked={showOnlyRelated}
                  onClick={() => setShowOnlyRelated(!showOnlyRelated)}
                  className={`relative inline-flex w-10 h-6 rounded-full transition-all duration-200 focus:outline-none focus:shadow-primary-focus ${showOnlyRelated ? 'bg-primary-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showOnlyRelated ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </label>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {filteredLibrary.map((item) => {
                  const isSelected = creatives.some(c => c.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleLibraryItem(item)}
                      className={`relative aspect-[3/4] rounded-inner overflow-hidden cursor-pointer group ring-offset-2 transition-all duration-200 ${isSelected ? 'ring-2 ring-primary-500' : 'hover:ring-2 hover:ring-gray-300'}`}
                    >
                      <img src={item.url} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isSelected ? 'bg-primary-500/20 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl ${isSelected ? 'bg-primary-500 text-white' : 'bg-white text-gray-900'}`}>
                          {isSelected ? <Check size={20} /> : <Plus size={20} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
               <button
                 onClick={() => setShowLibraryModal(false)}
                 className="inline-flex items-center justify-center bg-primary-500 text-white px-4 py-2 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus"
               >
                 确认选择 ({creatives.length})
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-sm font-semibold text-gray-900">待投放素材列表</h4>
          <span className="text-xs font-medium text-gray-500">已选 {creatives.length} 个资产</span>
        </div>

        {creatives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-section bg-primary-50 flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-primary-300" />
            </div>
            <p className="text-sm text-gray-500">尚未添加任何素材</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x">
            {creatives.map((c, idx) => (
              <div key={c.id} className="relative group shrink-0 w-36 h-48 rounded-inner overflow-hidden border border-gray-100 shadow-adsgo-card snap-start bg-white">
                <img src={c.url} alt="Creative" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {idx === 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-tag">主图</span>
                  )}
                  {c.id.startsWith('aigc') && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-tag">AI</span>
                  )}
                </div>
                <button
                  onClick={() => onRemove(c.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-700 shadow-adsgo-card opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeGallery;
