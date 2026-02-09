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
          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-slate-50 transition-all group"
        >
          <ImageIcon size={28} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">从素材库选择</span>
        </button>

        <button 
          onClick={handleUpload}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-slate-50 transition-all group"
        >
          <Upload size={28} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">本地上传素材</span>
        </button>

        <button 
          disabled={isGenerating}
          onClick={handleAIGC}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed bg-indigo-50/30 border-indigo-100 text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 transition-all group relative overflow-hidden"
        >
          {isGenerating ? (
            <div className="flex flex-col items-center animate-pulse">
              <Sparkles size={28} className="mb-2" />
              <span className="text-xs font-black uppercase tracking-widest">AI 生成中...</span>
            </div>
          ) : (
            <>
              <Sparkles size={28} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">AIGC 生成素材</span>
            </>
          )}
        </button>
      </div>

      {showLibraryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">公司素材库</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">选择已有的优质营销资产</p>
              </div>
              <button onClick={() => setShowLibraryModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={24} className="text-slate-300" />
              </button>
            </div>

            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">过滤选项</span>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className={`text-[10px] font-black uppercase transition-colors ${showOnlyRelated ? 'text-indigo-600' : 'text-slate-400'}`}>仅显示关联素材</span>
                <div 
                  onClick={() => setShowOnlyRelated(!showOnlyRelated)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${showOnlyRelated ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${showOnlyRelated ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                {filteredLibrary.map((item) => {
                  const isSelected = creatives.some(c => c.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleLibraryItem(item)}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group ring-offset-2 transition-all ${isSelected ? 'ring-4 ring-indigo-600' : 'hover:ring-2 hover:ring-slate-300'}`}
                    >
                      <img src={item.url} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isSelected ? 'bg-indigo-600/20 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900'}`}>
                          {isSelected ? <Check size={20} /> : <Plus size={20} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button 
                 onClick={() => setShowLibraryModal(false)}
                 className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200"
               >
                 确认选择 ({creatives.length})
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">待投放素材列表</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">已选 {creatives.length} 个资产</span>
        </div>
        
        {creatives.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">尚未添加任何素材</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x">
            {creatives.map((c, idx) => (
              <div key={c.id} className="relative group shrink-0 w-36 h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-sm snap-start bg-white">
                <img src={c.url} alt="Creative" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {idx === 0 && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded uppercase tracking-tighter">主图</span>
                  )}
                  {c.id.startsWith('aigc') && (
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-[8px] font-black rounded uppercase tracking-tighter">AI</span>
                  )}
                </div>
                <button 
                  onClick={() => onRemove(c.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
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