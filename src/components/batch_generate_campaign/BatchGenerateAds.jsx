
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AudienceType, BudgetType, 
  StructureStrategy,
  CampaignCountry, CampaignMedia, CampaignGoal, OptimizationEvent,
  LandingPageType, AdCopyStrategy, LalOption
} from './types';
import { BrandBar } from './components/BrandBar';
import { ProductSelector } from './components/ProductSelector';
import { CampaignPlanView } from './components/CampaignPlanView';
import { CampaignPreviewView } from './components/CampaignPreviewView';
import { X, Globe, Monitor, Target, ShoppingBag, ChevronDown, Sparkles, Search, Check, Layout, Tag, Link2, Info, Settings, Plus, FileText } from 'lucide-react';

const MOCK_EXISTING_CAMPAIGNS = [
  { id: '1202058341', name: 'US-Summer-Sales-CBO-001', budgetType: BudgetType.CBO, budget: 200 },
  { id: '1202059422', name: 'GLOBAL-Testing-ABO-V2', budgetType: BudgetType.ABO, budget: 20 },
  { id: '1202061553', name: 'US-Apparel-NewSeason-LAL', budgetType: BudgetType.CBO, budget: 500 },
  { id: '1202062774', name: 'CA-Accessories-Retargeting', budgetType: BudgetType.ABO, budget: 50 },
];

const BatchGenerateAds = () => {
  const [isBrandSaved, setIsBrandSaved] = useState(false);
  const [showBrandSuggestion, setShowBrandSuggestion] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productCreativesMap, setProductCreativesMap] = useState({});
  const [productReportsMap, setProductReportsMap] = useState({});
  
  // Strategy Configuration
  const [lpType, setLpType] = useState(LandingPageType.PRODUCT);
  const [lpTemplateUrl, setLpTemplateUrl] = useState('https://luminaire-style.com/collections/{{product_name}}');
  const [productLpUtm, setProductLpUtm] = useState('utm_source=meta&utm_medium=paid&utm_campaign=ai_batch_{{product_id}}');
  
  // Ad Copy Configuration
  const [copyStrategy, setCopyStrategy] = useState(AdCopyStrategy.AI_CUSTOM);
  const [unifiedHeadline, setUnifiedHeadline] = useState('Limited Time Offer: Quality You Can Trust');
  const [unifiedBody, setUnifiedBody] = useState('Discover the perfect blend of style and comfort. Shop our latest collection today and enjoy exclusive benefits.');

  // Campaign Configuration States
  const [country, setCountry] = useState(CampaignCountry.US);
  const [media, setMedia] = useState(CampaignMedia.META);
  const [goal, setGoal] = useState(CampaignGoal.SALES);
  const [optEvent, setOptEvent] = useState(OptimizationEvent.PURCHASE);

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Campaign Selection State
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(() => {
    return localStorage.getItem('has_generated_once_batch') === 'true';
  });

  const [structure, setStructure] = useState({ 
    strategy: StructureStrategy.PER_PRODUCT,
    adsPerSet: 3 
  });
  const [adsetAudiences, setAdsetAudiences] = useState(Array(10).fill(AudienceType.ADVANTAGE));
  const [lalOptions, setLalOptions] = useState([LalOption.PURCHASE_1]);
  const [budgetType, setBudgetType] = useState(BudgetType.CBO);
  const [dailyBudget, setDailyBudget] = useState(50);
  const [view, setView] = useState('config');

  const selectedCampaign = useMemo(() => 
    MOCK_EXISTING_CAMPAIGNS.find(c => c.id === selectedCampaignId), 
  [selectedCampaignId]);

  useEffect(() => {
    if (selectedCampaign) {
      setBudgetType(selectedCampaign.budgetType);
      setDailyBudget(selectedCampaign.budget);
    } else {
      setBudgetType(BudgetType.CBO);
      setDailyBudget(50);
    }
  }, [selectedCampaign]);

  const detectedBrand = {
    name: 'Luminaire Vintage',
    logo: 'https://picsum.photos/seed/logo1/100/100',
    url: 'luminaire-style.com',
    goal: goal.split(' ')[0],
    country: country
  };

  useEffect(() => {
    const savedBrand = localStorage.getItem('saved_brand_batch');
    if (savedBrand) setIsBrandSaved(true);
    else setShowBrandSuggestion(true);
  }, []);

  const handleUpdateProductCreatives = (productId, creatives) => {
    const creativesWithId = creatives.map(c => ({ ...c, productId }));
    setProductCreativesMap(prev => ({ ...prev, [productId]: creativesWithId }));
  };

  const handleToggleAudienceType = (index) => {
    const types = [AudienceType.ADVANTAGE, AudienceType.LAL, AudienceType.INT];
    setAdsetAudiences(prev => {
      const currentType = prev[index] || AudienceType.ADVANTAGE;
      const nextType = types[(types.indexOf(currentType) + 1) % types.length];
      const next = [...prev];
      next[index] = nextType;
      return next;
    });
  };

  const handleToggleLalOption = (option) => {
    setLalOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const SelectionField = ({ label, value, icon, options, onSelect, id }) => {
    const isOpen = activeDropdown === id;
    return (
      <div className="space-y-3 relative">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">{label}</label>
        <div 
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className={`flex items-center justify-between p-5 bg-white border-2 rounded-[1.5rem] cursor-pointer transition-all ${isOpen ? 'border-indigo-600 shadow-lg' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
        >
          <div className="flex items-center min-w-0">
            <span className={`mr-4 p-2 rounded-xl shadow-sm border transition-colors ${isOpen ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-50 text-indigo-600 border-slate-100'}`}>
              {icon}
            </span>
            <span className="text-xs font-black text-slate-800 tracking-tight truncate">{value}</span>
          </div>
          <ChevronDown size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)}></div>
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {options.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => { onSelect(opt); setActiveDropdown(null); }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <span className={`text-xs font-bold ${value === opt ? 'text-indigo-600' : 'text-slate-600'}`}>{opt}</span>
                  {value === opt && <Check size={14} className="text-indigo-600" />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const CampaignSearchModal = () => {
    const [search, setSearch] = useState('');
    const filtered = MOCK_EXISTING_CAMPAIGNS.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)
    );

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">选择已有投放系列</h3>
            <button onClick={() => setShowCampaignModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          <div className="p-6 bg-slate-50/50 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" autoFocus placeholder="搜索系列名称或 ID..." 
                className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-indigo-500 transition-all"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 no-scrollbar">
            <div 
              onClick={() => { setSelectedCampaignId(null); setShowCampaignModal(false); }}
              className="p-4 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-lg flex items-center justify-center"><Plus size={20}/></div>
                <span className="text-sm font-black text-slate-400 uppercase">创建全新系列 (Default)</span>
              </div>
            </div>
            {filtered.map(c => (
              <div 
                key={c.id} 
                onClick={() => { setSelectedCampaignId(c.id); setShowCampaignModal(false); }}
                className="p-4 rounded-xl hover:bg-indigo-50 cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div>
                  <p className="text-sm font-black text-slate-800">{c.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">ID: {c.id} • {c.budgetType}</p>
                </div>
                {selectedCampaignId === c.id && <Check size={18} className="text-indigo-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-slate-50/50 flex flex-col p-6">
      {showBrandSuggestion && view === 'config' && (
        <BrandBar brand={detectedBrand} onSave={() => { setIsBrandSaved(true); setShowBrandSuggestion(false); localStorage.setItem('saved_brand_batch', 'true'); }} onIgnore={() => setShowBrandSuggestion(false)} isSaved={isBrandSaved} />
      )}

      <main className="flex-1 flex justify-center overflow-auto">
        <div className="w-full max-w-7xl bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative mb-20 animate-fade-in">
          
          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-40">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                <Target size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {view === 'config' ? '多产品智能并行发布计划' : '发布方案预览'}
                </h1>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Next-Gen Media Planning System</p>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14">
            {view === 'config' ? (
              <div className="space-y-12">
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <SelectionField 
                      id="country" label="投放国家/地区" value={country} icon={<Globe size={20} />} 
                      options={Object.values(CampaignCountry)} onSelect={setCountry} 
                    />
                    <SelectionField 
                      id="media" label="投放渠道媒体" value={media} icon={<Monitor size={20} />} 
                      options={Object.values(CampaignMedia)} onSelect={setMedia} 
                    />
                    <SelectionField 
                      id="goal" label="核心投放目标" value={goal} icon={<Target size={20} />} 
                      options={Object.values(CampaignGoal)} onSelect={setGoal} 
                    />
                    <SelectionField 
                      id="event" label="转化优化事件" value={optEvent} icon={<ShoppingBag size={20} />} 
                      options={Object.values(OptimizationEvent)} onSelect={setOptEvent} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1.5">
                    <Info size={12} className="text-indigo-300" />
                    如果您目前无法确定，可以在 URL 分析完成后根据 AI 建议再填写。
                  </p>
                </div>

                <section>
                  <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 md:p-14 space-y-14 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50/20 rounded-full -translate-y-[20rem] translate-x-[20rem] blur-[120px] pointer-events-none"></div>
                    
                    <ProductSelector 
                      selectedProducts={selectedProducts} 
                      onSelectProducts={setSelectedProducts}
                      productCreatives={productCreativesMap}
                      onUpdateCreatives={handleUpdateProductCreatives}
                      onAnalysisStart={() => { setIsAnalyzing(true); setAnalysisFinished(false); }}
                      onAnalysisComplete={(reports) => { 
                        setIsAnalyzing(false); 
                        setAnalysisFinished(true); 
                        setProductReportsMap(reports);
                      }}
                      hasGeneratedOnce={hasGeneratedOnce}
                      analysisFinished={analysisFinished}
                      isAnalyzing={isAnalyzing}
                    />

                    {analysisFinished && (
                      <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-16 pt-16 border-t border-slate-50">
                        <section className="space-y-12">
                          <CampaignPlanView 
                            structure={structure} onStructureChange={setStructure}
                            budgetType={budgetType} onBudgetTypeChange={setBudgetType}
                            dailyBudget={dailyBudget} onBudgetChange={setDailyBudget}
                            adsetAudiences={adsetAudiences} onToggleAudience={handleToggleAudienceType}
                            lalOptions={lalOptions} onToggleLalOption={handleToggleLalOption}
                            selectedProducts={selectedProducts}
                            productCreativesMap={productCreativesMap}
                            isExistingCampaign={!!selectedCampaignId}
                            selectedCampaign={selectedCampaign}
                            onSelectCampaign={() => setShowCampaignModal(true)}
                          />

                          <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">投放落地页策略</label>
                              <Info size={12} className="text-slate-300" />
                            </div>
                            
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: LandingPageType.PRODUCT, label: '投放单品落地页', desc: 'Direct Product SKU', icon: <Tag size={18} /> },
                                  { id: LandingPageType.CATEGORY, label: '投放类目落地页', desc: 'Collection / Search', icon: <Layout size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setLpType(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                                      lpType === opt.id 
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50' 
                                        : 'bg-transparent border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${lpType === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-black uppercase ${lpType === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>{opt.label}</p>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {lpType === LandingPageType.PRODUCT ? (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                    <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 mb-4">
                                       <div className="flex items-start gap-4">
                                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                            <Target size={20} />
                                          </div>
                                          <div>
                                            <h4 className="text-xs font-black text-slate-900 tracking-tight">自动路由至商品单页</h4>
                                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                                              系统将使用所选商品的原始落地页。您可以在下方为所有单品 URL 统一增加 UTM 追踪参数。
                                            </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">统一 UTM 追踪参数</label>
                                      <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                          <Settings size={22} />
                                        </div>
                                        <input 
                                          type="text"
                                          value={productLpUtm}
                                          onChange={(e) => setProductLpUtm(e.target.value)}
                                          placeholder="utm_source=meta&utm_medium=paid&utm_campaign={{product_id}}"
                                          className="w-full h-14 pl-16 pr-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 focus:shadow-xl transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">落地页模板 URL (支持动态参数)</label>
                                      <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                          <Link2 size={24} />
                                        </div>
                                        <input 
                                          type="text"
                                          value={lpTemplateUrl}
                                          onChange={(e) => setLpTemplateUrl(e.target.value)}
                                          placeholder="https://example.com/collections/{{product_name}}"
                                          className="w-full h-16 pl-16 pr-24 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 focus:shadow-xl transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">广告文案标题策略</label>
                              <Info size={12} className="text-slate-300" />
                            </div>
                            
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: AdCopyStrategy.AI_CUSTOM, label: 'AI 为每个商品定制', desc: 'Custom per SKU', icon: <Sparkles size={18} /> },
                                  { id: AdCopyStrategy.UNIFIED, label: '为所有广告输入统一文案', desc: 'Unified Headlines & Text', icon: <FileText size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setCopyStrategy(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                                      copyStrategy === opt.id 
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50' 
                                        : 'bg-transparent border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${copyStrategy === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-black uppercase ${copyStrategy === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>{opt.label}</p>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {copyStrategy === AdCopyStrategy.AI_CUSTOM ? (
                                  <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 animate-in fade-in slide-in-from-left-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                          <Sparkles size={24} />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-slate-900 tracking-tight">AI 智能深度定制文案</h4>
                                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">
                                            基于落地页分析报告，模拟 Agent 将为每一个商品自动撰写差异化的广告标题和正文，最大化转化率。
                                          </p>
                                        </div>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">统一广告标题</label>
                                      <input 
                                        type="text"
                                        value={unifiedHeadline}
                                        onChange={(e) => setUnifiedHeadline(e.target.value)}
                                        placeholder="输入统一标题..."
                                        className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 focus:shadow-xl transition-all"
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">统一广告正文</label>
                                      <textarea 
                                        value={unifiedBody}
                                        onChange={(e) => setUnifiedBody(e.target.value)}
                                        placeholder="输入统一正文文案..."
                                        className="w-full p-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 h-28 focus:border-indigo-600 focus:shadow-xl transition-all resize-none"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>

                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => setView('preview')}
                            className="group relative w-full max-w-4xl py-8 px-16 rounded-[2.5rem] font-black text-2xl flex items-center justify-center bg-slate-900 text-white hover:bg-black shadow-2xl transition-all"
                          >
                            <Sparkles size={28} className="mr-5" />
                            预览发布计划
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <CampaignPreviewView 
                structure={structure}
                budgetType={budgetType} 
                dailyBudget={dailyBudget}
                initialAdsetAudiences={adsetAudiences} 
                productCreativesMap={productCreativesMap}
                selectedProducts={selectedProducts}
                brand={detectedBrand}
                onBack={() => setView('config')}
                onPublish={() => { setHasGeneratedOnce(true); localStorage.setItem('has_generated_once_batch', 'true'); alert('发布成功 (模拟)'); }}
                campaignName={selectedCampaign?.name || 'NEW-AI-CAMPAIGN-001'}
                optimizationEvent={optEvent}
                landingPageType={lpType}
                landingPageTemplate={lpTemplateUrl}
                productUtm={productLpUtm}
                copyStrategy={copyStrategy}
                unifiedHeadline={unifiedHeadline}
                unifiedBody={unifiedBody}
              />
            )}
          </div>
        </div>
      </main>

      {showCampaignModal && <CampaignSearchModal />}
    </div>
  );
};

export default BatchGenerateAds;
