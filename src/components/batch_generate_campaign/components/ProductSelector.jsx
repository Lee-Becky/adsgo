
import React, { useState, useEffect } from 'react';
import { 
  Link2, Search, History, ShoppingBag, X, ChevronRight, 
  LayoutGrid, Wand2, CheckCircle2, 
  Loader2, Terminal, Globe, Tag, Target, Sparkles, Plus,
  Image as ImageIcon, Upload, Filter, Check, 
  Trash2, PackageCheck, FileText, Users, Eye, Layers, Settings2, Database,
  Flame
} from 'lucide-react';
import { generateAIGCCreative } from '../services/mockAiService';

const ANALYSIS_STEPS = [
  { icon: <Globe size={14} />, text: '正在批量访问多目标落地页并解析元数据...' },
  { icon: <Tag size={14} />, text: '识别差异化卖点并统一人格化视觉风格...' },
  { icon: <Target size={14} />, text: '多维度匹配高转化受众及兴趣交叉点...' },
  { icon: <LayoutGrid size={14} />, text: '构建多产品并行投放的系列架构方案...' },
  { icon: <Sparkles size={14} />, text: '智能匹配最佳素材测试路径与 A/B Test 计划...' },
];

const HISTORY_PRODUCTS = [
  { id: 'h1', name: '意式复古灯芯绒外套', url: 'shop.com/products/vintage-coat', imageUrl: 'https://picsum.photos/seed/coat/400/400' },
  { id: 'h2', name: '极简主义皮靴', url: 'shop.com/products/boots', imageUrl: 'https://picsum.photos/seed/boots/400/400' },
  { id: 'h3', name: '真丝眼罩', url: 'shop.com/products/silk-mask', imageUrl: 'https://picsum.photos/seed/silk-mask/400/400' },
];

const SHOPIFY_PRODUCTS = [
  { id: 's1', name: 'Summer Linen Shirt', url: 'myshopify.com/linen-shirt', imageUrl: 'https://picsum.photos/seed/shirt/400/400' },
  { id: 's2', name: 'Canvas Tote Bag', url: 'myshopify.com/tote', imageUrl: 'https://picsum.photos/seed/tote/400/400' },
  { id: 's3', name: 'Leather Sandals', url: 'myshopify.com/sandals', imageUrl: 'https://picsum.photos/seed/sandals/400/400' },
];

const CREATIVE_LIBRARY = [
  { id: 'lib1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'lib2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
  { id: 'lib3', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'lib4', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
];

export const ProductSelector = ({ 
  selectedProducts, 
  onSelectProducts, 
  productCreatives,
  onUpdateCreatives,
  onAnalysisStart, 
  onAnalysisComplete,
  hasGeneratedOnce,
  analysisFinished,
  isAnalyzing
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [reports, setReports] = useState({});
  const [showReportFor, setShowReportFor] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalContext, setModalContext] = useState(null);
  
  // Batch AIGC UI State
  const [batchAIGCCount, setBatchAIGCCount] = useState(3);
  const [batchAIGCExclusions, setBatchAIGCExclusions] = useState(new Set());

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= ANALYSIS_STEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              const mockReports = {};
              selectedProducts.forEach(p => {
                mockReports[p.id] = {
                  summary: `${p.name} 网页核心卖点：高品质复古设计，适用于多种场景。`,
                  recommendedAudience: "25-45 岁，对极简主义和高质感生活有追求的都市人群。",
                  competitors: ["Lululemon", "Everlane", "Zara Home"]
                };
              });
              setReports(mockReports);
              onAnalysisComplete(mockReports);
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, onAnalysisComplete, selectedProducts]);

  const handleUpdateCreatives = (pid, creatives) => {
    onUpdateCreatives(pid, creatives);
  };

  const removeProduct = (id) => {
    onSelectProducts(selectedProducts.filter(p => p.id !== id));
  };

  const handleUploadForProduct = (productId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onUpdateCreatives(productId, [...(productCreatives[productId] || []), { 
          id: `upload-${Date.now()}`, 
          url, 
          productId 
        }]);
      }
    };
    input.click();
  };

  const handleAIGCForProduct = async (productId) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (!product) return;
    const prompt = `Professional advertising photography for ${product.name}, high quality, studio lighting`;
    const url = await generateAIGCCreative(prompt);
    onUpdateCreatives(productId, [...(productCreatives[productId] || []), { 
      id: `aigc-${Date.now()}`, 
      url, 
      productId 
    }]);
  };

  const handleBatchAIGC = async () => {
    setActiveModal(null);
    const targets = selectedProducts.filter(p => !batchAIGCExclusions.has(p.id));
    for (const p of targets) {
      const newCreatives = [];
      for (let i = 0; i < batchAIGCCount; i++) {
        const url = `https://picsum.photos/seed/${p.id}-${i}-${Date.now()}/800/1200`;
        newCreatives.push({ id: `batch-ai-${p.id}-${i}-${Date.now()}`, url, productId: p.id });
      }
      onUpdateCreatives(p.id, [...(productCreatives[p.id] || []), ...newCreatives]);
    }
  };

  const handleBatchMatch = (strategies) => {
    setActiveModal(null);
    selectedProducts.forEach(p => {
      const matched = CREATIVE_LIBRARY.slice(0, 2).map((lib, i) => ({
        ...lib,
        id: `matched-${p.id}-${lib.id}-${Date.now()}`,
        productId: p.id
      }));
      onUpdateCreatives(p.id, [...(productCreatives[p.id] || []), ...matched]);
    });
  };

  const SelectionModal = ({ type }) => {
    const [search, setSearch] = useState('');
    const [localSelected, setLocalSelected] = useState(new Set());
    const [matchStrategies, setMatchStrategies] = useState(new Set());

    const items = type === 'history' ? HISTORY_PRODUCTS : type === 'shopify' ? SHOPIFY_PRODUCTS : CREATIVE_LIBRARY;
    
    const filtered = type === 'creative_lib' || type === 'batch_match' || type === 'batch_aigc' 
      ? items 
      : items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.url.toLowerCase().includes(search.toLowerCase()));

    const toggleItem = (id) => {
      const next = new Set(localSelected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setLocalSelected(next);
    };

    if (type === 'batch_match') {
      return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Database size={24} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">批量匹配素材库</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">智能分析并关联现有营销资产</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: '24h', label: '智能匹配 24h 内上传素材', icon: <Sparkles size={16} /> },
                { id: 'unused', label: '智能匹配历史从未投放过素材', icon: <FileText size={16} /> },
                { id: 'top7d', label: '智能匹配近 7 天 TOP 素材', icon: <Flame size={16} /> },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    const next = new Set(matchStrategies);
                    if (next.has(opt.id)) next.delete(opt.id);
                    else next.add(opt.id);
                    setMatchStrategies(next);
                  }}
                  className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    matchStrategies.has(opt.id) ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${matchStrategies.has(opt.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{opt.icon}</div>
                    <span className={`text-sm font-black ${matchStrategies.has(opt.id) ? 'text-indigo-900' : 'text-slate-600'}`}>{opt.label}</span>
                  </div>
                  {matchStrategies.has(opt.id) && <Check size={20} className="text-indigo-600" />}
                </button>
              ))}
            </div>
            
            <button 
              disabled={matchStrategies.size === 0}
              onClick={() => handleBatchMatch(Array.from(matchStrategies))}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all ${
                matchStrategies.size === 0 ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              确认并开始批量匹配 ({matchStrategies.size})
            </button>
          </div>
        </div>
      );
    }

    if (type === 'batch_aigc') {
      return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">批量 AIGC 生成素材</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">为每个所选商品并行生成差异化创意</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">每个商品生成的素材数量</label>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setBatchAIGCCount(n)}
                      className={`h-12 rounded-xl font-black text-sm border-2 transition-all ${batchAIGCCount === n ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">选择执行商品 ({selectedProducts.length - batchAIGCExclusions.size})</label>
                <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar pr-2">
                  {selectedProducts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        const next = new Set(batchAIGCExclusions);
                        if (next.has(p.id)) next.delete(p.id);
                        else next.add(p.id);
                        setBatchAIGCExclusions(next);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${!batchAIGCExclusions.has(p.id) ? 'border-indigo-100 bg-white' : 'border-slate-100 opacity-50 grayscale'}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                        <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!batchAIGCExclusions.has(p.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-slate-200'}`}>
                        {!batchAIGCExclusions.has(p.id) && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleBatchAIGC}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              开始并行生成 { (selectedProducts.length - batchAIGCExclusions.size) * batchAIGCCount } 张创意
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-xl font-black text-slate-900">
              {type === 'history' ? '从商品库选择' : type === 'shopify' ? '从 Shopify 全量选择' : '从创意素材库选择'}
            </h3>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          
          {type !== 'creative_lib' && (
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" autoFocus placeholder="模糊搜索商品..." 
                  className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-indigo-500 shadow-sm"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 sm:grid-cols-4 gap-4 no-scrollbar">
            {filtered.map((item) => {
              const isSel = localSelected.has(item.id);
              return (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`relative p-2 bg-white border-2 rounded-2xl transition-all cursor-pointer group ${isSel ? 'border-indigo-600 shadow-lg shadow-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                    <img src={item.imageUrl || item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSel ? 'bg-indigo-600 border-indigo-600' : 'bg-black/20 border-white/40'}`}>
                      {isSel && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                  {item.name && <p className="text-[10px] font-black text-slate-800 truncate px-1">{item.name}</p>}
                </div>
              );
            })}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
             <div className="text-sm font-bold text-slate-400">已选中 <span className="text-indigo-600 font-black">{localSelected.size}</span> 个项目</div>
             <button 
               disabled={localSelected.size === 0}
               onClick={() => {
                 if (type === 'creative_lib') {
                   const selectedCreatives = CREATIVE_LIBRARY.filter(i => localSelected.has(i.id));
                   onUpdateCreatives(modalContext, [...(productCreatives[modalContext] || []), ...selectedCreatives.map(c => ({...c, id: `${c.id}-${Date.now()}`, productId: modalContext}))]);
                 } else {
                   const pool = type === 'history' ? HISTORY_PRODUCTS : SHOPIFY_PRODUCTS;
                   const toAdd = pool.filter(i => localSelected.has(i.id) && !selectedProducts.some(p => p.id === i.id));
                   onSelectProducts([...selectedProducts, ...toAdd]);
                 }
                 setActiveModal(null);
               }}
               className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all ${localSelected.size === 0 ? 'bg-slate-200 text-white cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-black'}`}
             >
               确认选择项目
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* 1. Input Module */}
      <div className="space-y-6">
        <div className="relative">
          {hasGeneratedOnce && (
            <div className="absolute -top-4 left-6 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full shadow-lg border border-white/20">
                <PackageCheck size={12} className="text-indigo-200" />
                <span className="text-[9px] font-black uppercase tracking-widest">出品</span>
              </div>
              <div className="w-[2px] h-4 bg-indigo-600 ml-5 opacity-50"></div>
            </div>
          )}
          <div className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-6 flex items-center gap-6 focus-within:bg-white focus-within:border-indigo-500 transition-all ${selectedProducts.length > 0 ? 'border-slate-300' : ''}`}>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
              <Link2 size={24} />
            </div>
            <input 
              type="text" 
              placeholder="粘贴投放目标 URL，回车立即解析..."
              className="flex-1 bg-transparent border-none outline-none text-base font-medium text-slate-800 placeholder:text-slate-300"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && urlInput) {
                  const newP = { id: `manual-${Date.now()}`, name: `落地页商品 - ${selectedProducts.length + 1}`, url: urlInput, imageUrl: `https://picsum.photos/seed/${Date.now()}/400/400` };
                  onSelectProducts([...selectedProducts, newP]);
                  setUrlInput('');
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-4 px-2">
          <button 
            onClick={() => setActiveModal('history')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <History size={14} /> 从商品库选择历史商品
          </button>
          <button 
            onClick={() => setActiveModal('shopify')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ShoppingBag size={14} /> 从 Shopify 选择全量商品
          </button>
        </div>
      </div>

      {/* 2. Post-Analysis Batch Operations */}
      {analysisFinished && (
        <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6 px-1">
             <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Settings2 size={16} /></div>
             <div>
               <h5 className="text-xs font-black text-slate-900 uppercase">批量操作中心</h5>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Orchestrate Creative Production at Scale</p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => setActiveModal('batch_match')}
              className="flex items-center justify-center gap-4 p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all group"
            >
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Database size={24} />
               </div>
               <div className="text-left">
                  <p className="text-sm font-black text-slate-800 uppercase">批量匹配素材库</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">智能分析现有素材并分发</p>
               </div>
            </button>
            <button 
              onClick={() => setActiveModal('batch_aigc')}
              className="flex items-center justify-center gap-4 p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all group"
            >
               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Sparkles size={24} />
               </div>
               <div className="text-left">
                  <p className="text-sm font-black text-slate-800 uppercase">批量 AIGC 生成素材</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">自动构建差异化并行创意</p>
               </div>
            </button>
          </div>
        </div>
      )}

      {/* 3. Product List - Optimized Thumbnails */}
      <div className="space-y-3">
        {selectedProducts.map((p) => (
          <div key={p.id} className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Smaller Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                  <img src={p.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-black text-slate-800 truncate">{p.name}</h4>
                  <p className="text-[9px] text-indigo-500 font-bold truncate underline opacity-60">{p.url}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {analysisFinished && (
                  <button 
                    onClick={() => setShowReportFor(p.id)}
                    className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-100 transition-colors"
                  >
                    <FileText size={16} />
                  </button>
                )}
                {!isAnalyzing && !analysisFinished && (
                  <button onClick={() => removeProduct(p.id)} className="w-9 h-9 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {analysisFinished && (
              <div className="mt-4 pt-4 border-t border-slate-50 animate-in fade-in">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ImageIcon size={10} className="text-indigo-600" />
                    素材清单 ({productCreatives[p.id]?.length || 0})
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => { setModalContext(p.id); setActiveModal('creative_lib'); }} className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase hover:bg-slate-100">创意库</button>
                    <button onClick={() => handleUploadForProduct(p.id)} className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase hover:bg-slate-100">上传</button>
                    <button onClick={() => handleAIGCForProduct(p.id)} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase hover:bg-indigo-100 flex items-center gap-1"><Sparkles size={8} /> AI 生成</button>
                  </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {productCreatives[p.id]?.map(c => (
                    <div key={c.id} className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-100 group">
                      <img src={c.url} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => onUpdateCreatives(p.id, productCreatives[p.id].filter(prev => prev.id !== c.id))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-rose-500"
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => { setModalContext(p.id); setActiveModal('creative_lib'); }} className="w-12 h-16 rounded-lg border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 hover:border-indigo-200">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analysis UI */}
      {!analysisFinished && selectedProducts.length > 0 && (
        <div className="flex flex-col items-center pt-4">
          {isAnalyzing ? (
            selectedProducts.length === 1 ? (
              <div className="w-full bg-slate-900 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Terminal size={24} /></div>
                    <div>
                      <h4 className="text-white font-black text-lg">Agent 实时深度解析中...</h4>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{selectedProducts[0].url}</p>
                    </div>
                  </div>
                  <Loader2 className="animate-spin text-indigo-400" size={24} />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">网页元数据解析</p>
                    <div className="h-2 w-3/4 bg-white/10 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-indigo-500 animate-[loading_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-slate-900 rounded-[2.5rem] p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Loader2 size={20} className="animate-spin" /></div>
                    <h4 className="text-white font-black">多产品智能并行解析中...</h4>
                  </div>
                  <span className="text-indigo-400 text-xs font-black uppercase">{currentStep + 1} / {ANALYSIS_STEPS.length}</span>
                </div>
                <div className="space-y-4">
                  {ANALYSIS_STEPS.map((step, idx) => (
                    <div key={idx} className={`flex items-center gap-4 transition-opacity duration-500 ${idx <= currentStep ? 'opacity-100' : 'opacity-20'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx < currentStep ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>{idx < currentStep ? <Check size={14} /> : step.icon}</div>
                      <p className="text-xs font-bold text-slate-300">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <button onClick={onAnalysisStart} className="h-20 px-16 bg-slate-900 text-white rounded-[2.5rem] text-base font-black uppercase tracking-widest flex items-center gap-4 hover:bg-black transition-all shadow-xl shadow-indigo-100">
              <Wand2 size={24} />
              开启 {selectedProducts.length} 个产品的智能并行解析
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      {activeModal && <SelectionModal type={activeModal} />}

      {/* Report Modal */}
      {showReportFor && reports[showReportFor] && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><FileText size={24} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">Agent 深度解析报告</h4>
                  <p className="text-slate-400 text-xs font-bold truncate max-w-xs">{selectedProducts.find(p => p.id === showReportFor)?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowReportFor(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={12} className="text-indigo-600"/> 网页内容总结</p>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">{reports[showReportFor].summary}</div>
              </div>
            </div>
            
            <button onClick={() => setShowReportFor(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">完成阅读</button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
