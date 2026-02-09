import React, { useState, useEffect } from 'react';
import { 
  Link2, Search, History, ShoppingBag, X, ChevronRight, 
  LayoutGrid, Wand2, 
  Loader2, Globe, Tag, Target, Sparkles, Plus,
  Upload, Check, 
  Trash2, PackageCheck, FileText, Layers, Database,
  Flame, Zap, Info, ChevronDown, ListFilter, Box
} from 'lucide-react';
import { generateAIGCCreative } from '../services/mockAiService';

const MOCK_CATALOGS = [
  { id: 'cat_8820192', name: 'Luminaire Official Catalog 2024' },
  { id: 'cat_1192837', name: 'Seasonal Accessories Feed' },
  { id: 'cat_5543210', name: 'Best Sellers - Global' },
];

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
  { id: 's2', name: 'Canvas Tote Bag', url: 'myshopify.com/tote', imageUrl: 'https://picsum.photos/seed/bag/400/400' },
  { id: 's3', name: 'Leather Sandals', url: 'myshopify.com/sandals', imageUrl: 'https://picsum.photos/seed/sandals/400/400' },
];

const CREATIVE_LIBRARY = [
  { id: 'lib1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'lib2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
  { id: 'lib3', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'lib4', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
];

const ProductSelector = ({ 
  selectedProducts, 
  onSelectProducts, 
  productCreatives,
  onUpdateCreatives,
  onAnalysisStart, 
  onAnalysisComplete,
  hasGeneratedOnce,
  analysisFinished,
  isAnalyzing,
  campaignType,
  onCampaignTypeChange
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [reports, setReports] = useState({});
  const [showReportFor, setShowReportFor] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalContext, setModalContext] = useState(null);
  
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedProductSet, setSelectedProductSet] = useState('All Products');
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const [setDropdownOpen, setSetDropdownOpen] = useState(false);

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
        onUpdateCreatives(productId, [...(productCreatives[productId] || []), { id: `upload-${Date.now()}`, url, productId }]);
      }
    };
    input.click();
  };

  const handleAIGCForProduct = async (productId) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (!product) return;
    const prompt = `Professional advertising photography for ${product.name}, high quality, studio lighting`;
    const url = await generateAIGCCreative(prompt);
    onUpdateCreatives(productId, [...(productCreatives[productId] || []), { id: `aigc-${Date.now()}`, url, productId }]);
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
    const filtered = items.filter(i => {
      if (type === 'creative_lib') return true;
      return i.name?.toLowerCase().includes(search.toLowerCase()) || i.url?.toLowerCase().includes(search.toLowerCase());
    });

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
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
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
                    <button key={n} onClick={() => setBatchAIGCCount(n)} className={`h-12 rounded-xl font-black text-sm border-2 transition-all ${batchAIGCCount === n ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">选择执行商品 ({selectedProducts.length - batchAIGCExclusions.size})</label>
                <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar pr-2">
                  {selectedProducts.map(p => (
                    <div key={p.id} onClick={() => {
                        const next = new Set(batchAIGCExclusions);
                        if (next.has(p.id)) next.delete(p.id);
                        else next.add(p.id);
                        setBatchAIGCExclusions(next);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${!batchAIGCExclusions.has(p.id) ? 'border-purple-100 bg-white' : 'border-slate-100 opacity-50 grayscale'}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                        <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!batchAIGCExclusions.has(p.id) ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-slate-200'}`}>{!batchAIGCExclusions.has(p.id) && <Check size={12} className="text-white" />}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleBatchAIGC} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
              <Sparkles size={20} /> 开始并行生成 { (selectedProducts.length - batchAIGCExclusions.size) * batchAIGCCount } 张创意
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-xl font-black text-slate-900">{type === 'history' ? '从商品库选择' : type === 'shopify' ? '从 Shopify 全量选择' : '从创意素材库选择'}</h3>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          {type !== 'creative_lib' && (
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" autoFocus placeholder="模糊搜索商品..." className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-indigo-500 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 sm:grid-cols-4 gap-4 no-scrollbar">
            {filtered.map((item) => {
              const isSel = localSelected.has(item.id);
              return (
                <div key={item.id} onClick={() => toggleItem(item.id)} className={`relative p-2 bg-white border-2 rounded-2xl transition-all cursor-pointer group ${isSel ? 'border-indigo-600 shadow-lg shadow-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}>
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                    <img src={item.imageUrl || item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSel ? 'bg-indigo-600 border-indigo-600' : 'bg-black/20 border-white/40'}`}>{isSel && <Check size={14} className="text-white" />}</div>
                  </div>
                  {item.name && <p className="text-[10px] font-black text-slate-800 truncate px-1">{item.name}</p>}
                </div>
              );
            })}
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
             <div className="text-sm font-bold text-slate-400">已选中 <span className="text-indigo-600 font-black">{localSelected.size}</span> 个项目</div>
             <button disabled={localSelected.size === 0} onClick={() => {
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
             >确认选择项目</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Campaign Type Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-100/50 p-1 rounded-2xl border border-slate-100 flex items-center shadow-sm">
          <button 
            onClick={() => onCampaignTypeChange('PRODUCT')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${campaignType === 'PRODUCT' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            投放商品广告
          </button>
          <button 
            onClick={() => onCampaignTypeChange('CATALOG')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${campaignType === 'CATALOG' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            投放目录广告
          </button>
        </div>
      </div>

      {campaignType === 'PRODUCT' ? (
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
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100"><Link2 size={24} /></div>
              <input type="text" placeholder="粘贴投放目标 URL，回车立即解析..." className="flex-1 bg-transparent border-none outline-none text-base font-medium text-slate-800 placeholder:text-slate-300" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => {
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
            <button onClick={() => setActiveModal('history')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"><History size={14} /> 从商品库选择历史商品</button>
            <button onClick={() => setActiveModal('shopify')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"><ShoppingBag size={14} /> 从 Shopify 选择全量商品</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">选择目录 (Catalog)</label>
              <div 
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-[1.5rem] cursor-pointer hover:border-indigo-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Database size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{selectedCatalog?.name || '请选择一个目录...'}</p>
                    {selectedCatalog && <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">ID: {selectedCatalog.id}</p>}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-300 transition-transform ${catalogDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {catalogDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] overflow-hidden">
                  {MOCK_CATALOGS.map(c => (
                    <div key={c.id} onClick={() => { setSelectedCatalog(c); setCatalogDropdownOpen(false); }} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div>
                        <p className="text-xs font-black text-slate-800">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">ID: {c.id}</p>
                      </div>
                      {selectedCatalog?.id === c.id && <Check size={16} className="text-indigo-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">商品系列 (Product Set)</label>
              <div 
                onClick={() => setSetDropdownOpen(!setDropdownOpen)}
                className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-[1.5rem] cursor-pointer hover:border-indigo-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <ListFilter size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{selectedProductSet || '选择商品系列...'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Set Criteria</p>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-300 transition-transform ${setDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {setDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] overflow-hidden">
                  {['All Products', 'Best Sellers', 'New Arrivals'].map(s => (
                    <div key={s} onClick={() => { setSelectedProductSet(s); setSetDropdownOpen(false); }} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                      <p className="text-xs font-black text-slate-800">{s}</p>
                      {selectedProductSet === s && <Check size={16} className="text-indigo-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unified Creative Assets Management Workbench - Only for Product Ads */}
      {campaignType === 'PRODUCT' && (analysisFinished || isAnalyzing) && (
        <section className="animate-in fade-in duration-700">
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-inner">
            {/* Header Area */}
            <div className="p-8 md:p-10 bg-white border-b border-slate-100 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100"><Zap size={20} /></div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">智能素材生产工作台</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Orchestrate Creative Production at Scale</p>
                </div>
                
                {analysisFinished && (
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button onClick={() => setActiveModal('batch_match')} className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm group">
                      <Database size={16} className="group-hover:scale-110 transition-transform" /> 批量匹配素材库
                    </button>
                    <button onClick={() => setActiveModal('batch_aigc')} className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group">
                      <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> 批量 AIGC 生成
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Loading UI */}
            {!analysisFinished && isAnalyzing && (
               <div className="p-12 md:p-20 flex flex-col items-center bg-slate-900 space-y-10">
                 <div className="flex flex-col items-center gap-4 text-center">
                   <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-pulse"><Loader2 size={40} className="animate-spin" /></div>
                   <div>
                     <h4 className="text-2xl font-black text-white">正在加速生产资产包...</h4>
                     <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Agent Parallel Engine Active</p>
                   </div>
                 </div>
                 <div className="w-full max-w-xl space-y-5">
                    {ANALYSIS_STEPS.map((step, idx) => (
                      <div key={idx} className={`flex items-center gap-5 transition-all duration-500 ${idx <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${idx < currentStep ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{idx < currentStep ? <Check size={18} /> : step.icon}</div>
                        <p className="text-sm font-bold text-slate-300">{step.text}</p>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            {/* Individual Product Creative List */}
            {analysisFinished && (
              <div className="p-4 md:p-6 space-y-4 max-h-[700px] overflow-y-auto no-scrollbar">
                {selectedProducts.map((p) => {
                  const creatives = productCreatives[p.id] || [];
                  return (
                    <div key={p.id} className={`bg-white border rounded-[2rem] p-4 md:p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${creatives.length === 0 ? 'border-amber-100 ring-2 ring-amber-500/5' : 'border-slate-100'}`}>
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex items-center gap-4 lg:w-72 shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-sm relative">
                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                            {creatives.length === 0 && (
                              <div className="absolute inset-0 bg-amber-500/80 flex items-center justify-center"><Flame size={14} className="text-white animate-bounce" /></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-slate-800 truncate">{p.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${creatives.length > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>{creatives.length} 素材</span>
                              <button onClick={() => setShowReportFor(p.id)} className="text-[9px] font-black text-slate-400 underline hover:text-indigo-600">分析报告</button>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                           <div className="w-full flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                              {creatives.map(c => (
                                <div key={c.id} className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-100 group/item shadow-sm">
                                  <img src={c.url} className="w-full h-full object-cover" />
                                  <button onClick={() => onUpdateCreatives(p.id, creatives.filter(prev => prev.id !== c.id))} className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all text-rose-500 shadow-md"><X size={10} /></button>
                                </div>
                              ))}
                              <div className="flex gap-2 shrink-0 ml-2">
                                <button onClick={() => { setModalContext(p.id); setActiveModal('creative_lib'); }} className="w-14 h-20 rounded-lg border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-400 hover:text-indigo-400 hover:bg-indigo-50 transition-all gap-1" title="从素材库选择">
                                  <Database size={16} /><span className="text-[7px] font-black uppercase">库</span>
                                </button>
                                <button onClick={() => handleAIGCForProduct(p.id)} className="w-14 h-20 rounded-lg border-2 border-dashed border-purple-100 flex flex-col items-center justify-center text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all gap-1" title="AI 生成">
                                  <Sparkles size={16} /><span className="text-[7px] font-black uppercase">AI</span>
                                </button>
                                <button onClick={() => handleUploadForProduct(p.id)} className="w-14 h-20 rounded-lg border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all gap-1" title="本地上传">
                                  <Upload size={16} /><span className="text-[7px] font-black uppercase">传</span>
                                </button>
                              </div>
                           </div>
                        </div>
                        <div className="shrink-0 flex items-center">
                           <button onClick={() => removeProduct(p.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom Floating Triggers */}
      {!analysisFinished && !isAnalyzing && (
        <div className="flex flex-col items-center pt-8 border-t border-slate-50 space-y-10 animate-in fade-in slide-in-from-bottom-6">
          {campaignType === 'PRODUCT' ? (
            selectedProducts.length > 0 && (
              <div className="w-full flex flex-col items-center space-y-8">
                <div className="w-full max-w-4xl space-y-4">
                  <div className="flex items-center justify-between px-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={14} className="text-indigo-400" /> 待解析商品清单 ({selectedProducts.length})
                    </h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Ready for Agent Deep Scan</p>
                  </div>
                  <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="relative group shrink-0 w-44 bg-white border border-slate-100 rounded-3xl p-3 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                          <img src={p.imageUrl} className="w-full h-full object-cover" />
                          <button onClick={() => removeProduct(p.id)} className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-rose-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                        </div>
                        <p className="text-[11px] font-black text-slate-800 truncate px-1">{p.name}</p>
                      </div>
                    ))}
                    <div className="w-44 h-full shrink-0 flex items-center justify-center"><div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 animate-pulse"><Plus size={24} /></div></div>
                  </div>
                </div>
                <button onClick={onAnalysisStart} className="h-24 px-20 bg-slate-900 text-white rounded-[3rem] text-lg font-black uppercase tracking-widest flex items-center gap-6 hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group">
                  <Wand2 size={32} className="group-hover:rotate-12 transition-transform" /> 开启 {selectedProducts.length} 个产品的智能并行解析与生产 <ChevronRight size={32} />
                </button>
              </div>
            )
          ) : (
            selectedCatalog && (
              <button 
                onClick={() => onAnalysisComplete({})} 
                className="h-24 px-20 bg-slate-900 text-white rounded-[3rem] text-lg font-black uppercase tracking-widest flex items-center gap-6 hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 group"
              >
                <Box size={32} className="group-hover:scale-110 transition-transform" /> 配置 {selectedProductSet} 目录发布结构 <ChevronRight size={32} />
              </button>
            )
          )}
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">Next-Gen Media Planning System</p>
        </div>
      )}

      {activeModal && <SelectionModal type={activeModal} />}
      {showReportFor && reports[showReportFor] && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><FileText size={24} /></div>
                <div><h4 className="text-xl font-black text-slate-900">Agent 深度解析报告</h4><p className="text-slate-400 text-xs font-bold truncate max-w-xs">{selectedProducts.find(p => p.id === showReportFor)?.name}</p></div>
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
    </div>
  );
};

export default ProductSelector;