import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, Monitor, Target, ShoppingBag, ChevronDown, Sparkles, Search, Briefcase, Check, Layout, Tag, Link2, Info, Settings, Plus, FileText, Type, Calendar, Clock, Rocket, Facebook, Instagram, Hash, Loader2, CheckCircle2 } from 'lucide-react';
import BrandBar from './components/BrandBar';
import ProductSelector from './components/ProductSelector';
import CampaignPlanView from './components/CampaignPlanView';
import CampaignPreviewView from './components/CampaignPreviewView';

const MOCK_EXISTING_CAMPAIGNS = [
  { id: '1202058341', name: 'US-Summer-Sales-CBO-001', budgetType: 'CBO', budget: 200 },
  { id: '1202059422', name: 'GLOBAL-Testing-ABO-V2', budgetType: 'ABO', budget: 20 },
  { id: '1202061553', name: 'US-Apparel-NewSeason-LAL', budgetType: 'CBO', budget: 500 },
  { id: '1202062774', name: 'CA-Accessories-Retargeting', budgetType: 'ABO', budget: 50 },
];

const MOCK_ACCOUNTS = [
  { id: 'act_2948192038', name: 'Luminaire Style - Global' },
  { id: 'act_1039582103', name: 'Performance Testing Acc' },
];

const MOCK_PAGES = [
  { id: 'page_123', name: 'Luminaire Vintage Official' },
  { id: 'page_456', name: 'Retro Fashion Daily' },
];

const BatchGenerateAds = () => {
  const [isBrandSaved, setIsBrandSaved] = useState(false);
  const [showBrandSuggestion, setShowBrandSuggestion] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productCreativesMap, setProductCreativesMap] = useState({});
  const [productReportsMap, setProductReportsMap] = useState({});
  
  const [campaignType, setCampaignType] = useState('PRODUCT');

  const [lpType, setLpType] = useState('PRODUCT');
  const [lpTemplateUrl, setLpTemplateUrl] = useState('https://luminaire-style.com/collections/{{product_name}}');
  const [productLpUtm, setProductLpUtm] = useState('utm_source=meta&utm_medium=paid&utm_campaign=ai_batch_{{product_id}}');
  
  const [copyStrategy, setCopyStrategy] = useState('AI_CUSTOM');
  const [unifiedHeadline, setUnifiedHeadline] = useState('Limited Time Offer: Quality You Can Trust');
  const [unifiedBody, setUnifiedBody] = useState('Discover the perfect blend of style and comfort. Shop our latest collection today and enjoy exclusive benefits.');

  const [scheduleType, setScheduleType] = useState('CONTINUOUS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [country, setCountry] = useState('United States (US)');
  const [media, setMedia] = useState('Meta (FB/IG)');
  const [goal, setGoal] = useState('销量');
  const [optEvent, setOptEvent] = useState('成功购买');

  const [activeDropdown, setActiveDropdown] = useState(null);

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(() => {
    return localStorage.getItem('has_generated_once') === 'true';
  });

  const [structure, setStructure] = useState({ 
    strategy: 'PER_PRODUCT',
    adsPerSet: 3,
    numAdsets: 3
  });
  const [adsetAudiences, setAdsetAudiences] = useState(Array(10).fill('ADV'));
  const [lalOptions, setLalOptions] = useState(['US Purchase 1%']);
  const [budgetType, setBudgetType] = useState('CBO');
  const [dailyBudget, setDailyBudget] = useState(50);
  const [view, setView] = useState('config');

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStep, setPublishStep] = useState('SELECT');
  const [publishProgress, setPublishProgress] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(MOCK_ACCOUNTS[0]);
  const [selectedFBPage, setSelectedFBPage] = useState(MOCK_PAGES[0]);
  const [selectedIGPage, setSelectedIGPage] = useState(MOCK_PAGES[0]);
  const [threadsAccount, setThreadsAccount] = useState('luminaire_vintage_threads');

  const selectedCampaign = useMemo(() => 
    MOCK_EXISTING_CAMPAIGNS.find(c => c.id === selectedCampaignId), 
  [selectedCampaignId]);

  useEffect(() => {
    if (selectedCampaign) {
      setBudgetType(selectedCampaign.budgetType);
      setDailyBudget(selectedCampaign.budget);
    } else {
      setBudgetType('CBO');
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
    const savedBrand = localStorage.getItem('saved_brand');
    if (savedBrand) setIsBrandSaved(true);
    else setShowBrandSuggestion(true);
  }, []);

  const handleUpdateProductCreatives = (productId, creatives) => {
    const creativesWithId = creatives.map(c => ({ ...c, productId }));
    setProductCreativesMap(prev => ({ ...prev, [productId]: creativesWithId }));
  };

  const handleToggleAudienceType = (index) => {
    const types = ['ADV', 'LAL', 'INT'];
    setAdsetAudiences(prev => {
      const currentType = prev[index] || 'ADV';
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

  const handleQuickSchedule = (days) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const startPublishing = () => {
    setPublishStep('PROGRESS');
    setPublishProgress(0);
    const interval = setInterval(() => {
      setPublishProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPublishStep('SUCCESS');
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
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
              {options.map(opt => (
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

  const PublishModal = () => {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in">
        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-bottom-12">
          
          {publishStep === 'SELECT' && (
            <>
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">发布方案配置</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Final Sync to Meta Ecosystem</p>
                </div>
                <button onClick={() => setShowPublishModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-12 space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">广告账户</label>
                    <select 
                      value={selectedAccount.id}
                      onChange={(e) => setSelectedAccount(MOCK_ACCOUNTS.find(a => a.id === e.target.value))}
                      className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none transition-all appearance-none"
                    >
                      {MOCK_ACCOUNTS.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Facebook size={12} className="text-blue-600" /> Facebook 粉丝页</label>
                      <select 
                        value={selectedFBPage.id}
                        onChange={(e) => setSelectedFBPage(MOCK_PAGES.find(p => p.id === e.target.value))}
                        className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none transition-all appearance-none"
                      >
                        {MOCK_PAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Instagram size={12} className="text-pink-600" /> Instagram 账户</label>
                      <select 
                        value={selectedIGPage.id}
                        onChange={(e) => setSelectedIGPage(MOCK_PAGES.find(p => p.id === e.target.value))}
                        className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none transition-all appearance-none"
                      >
                        {MOCK_PAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Hash size={12} className="text-slate-800" /> Threads 账户</label>
                    <input 
                      type="text"
                      value={threadsAccount}
                      onChange={(e) => setThreadsAccount(e.target.value)}
                      className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-indigo-600 outline-none transition-all"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100">
                 <button 
                   onClick={startPublishing}
                   className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
                 >
                   <Rocket size={24} /> 确认并开始同步发布
                 </button>
              </div>
            </>
          )}

          {publishStep === 'PROGRESS' && (
            <div className="p-20 flex flex-col items-center justify-center space-y-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-[6px] border-slate-100"></div>
                <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                  <circle
                    cx="64" cy="64" r="59"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={Math.PI * 2 * 59}
                    strokeDashoffset={Math.PI * 2 * 59 * (1 - publishProgress / 100)}
                    className="text-indigo-600 transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{publishProgress}%</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-black text-slate-900">正在同步至广告管理系统...</h4>
                <p className="text-sm font-bold text-slate-400">正在创建 Campaign, AdSets 和素材资产，请勿刷新页面</p>
              </div>
              <div className="w-full space-y-3">
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                   <Loader2 size={14} className="animate-spin text-indigo-600" />
                   {publishProgress < 30 ? '初始化发布环境...' : publishProgress < 60 ? '正在生成 AdSet 结构与受众策略...' : '正在上传 4K AI 创意素材并关联 URL...'}
                 </div>
              </div>
            </div>
          )}

          {publishStep === 'SUCCESS' && (
            <div className="p-20 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-50">
                <CheckCircle2 size={48} />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-black text-slate-900">方案已成功发布</h4>
                <p className="text-sm font-bold text-slate-400">您的广告已成功推送到 Meta 广告管理后台</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 w-full space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>发布时间</span>
                    <span className="text-slate-900">{new Date().toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>目标账户</span>
                    <span className="text-slate-900">{selectedAccount.name}</span>
                 </div>
              </div>
              <button 
                onClick={() => { setShowPublishModal(false); setView('config'); setPublishStep('SELECT'); setHasGeneratedOnce(true); localStorage.setItem('has_generated_once', 'true'); }}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                回到首页
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {showBrandSuggestion && view === 'config' && (
        <BrandBar brand={detectedBrand} onSave={() => { setIsBrandSaved(true); setShowBrandSuggestion(false); }} onIgnore={() => setShowBrandSuggestion(false)} isSaved={isBrandSaved} />
      )}

      <main className="flex-1 p-4 md:p-8 flex justify-center overflow-auto">
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
            <button className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="p-10 md:p-14">
            {view === 'config' ? (
              <div className="space-y-12">
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <SelectionField 
                      id="country" label="投放国家/地区" value={country} icon={<Globe size={20} />} 
                      options={['United States (US)', 'United Kingdom (GB)', 'Brazil (BR)']} onSelect={setCountry} 
                    />
                    <SelectionField 
                      id="media" label="投放渠道媒体" value={media} icon={<Monitor size={20} />} 
                      options={['Meta (FB/IG)', 'TikTok']} onSelect={setMedia} 
                    />
                    <SelectionField 
                      id="goal" label="核心投放目标" value={goal} icon={<Target size={20} />} 
                      options={['销量', '线索']} onSelect={setGoal} 
                    />
                    <SelectionField 
                      id="event" label="转化优化事件" value={optEvent} icon={<ShoppingBag size={20} />} 
                      options={['成功购买', '加入购物车', '完成注册']} onSelect={setOptEvent} 
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
                      campaignType={campaignType}
                      onCampaignTypeChange={(type) => {
                        setCampaignType(type);
                        setAnalysisFinished(false);
                        setIsAnalyzing(false);
                      }}
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
                                  { id: 'PRODUCT', label: '投放单品落地页', desc: 'Direct Product SKU', icon: <Tag size={18} /> },
                                  { id: 'CATEGORY', label: '投放类目落地页', desc: 'Collection / Search', icon: <Layout size={18} /> },
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
                                {lpType === 'PRODUCT' ? (
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
                                  { id: 'AI_CUSTOM', label: 'AI 为每个商品定制', desc: 'Custom per SKU', icon: <Sparkles size={18} /> },
                                  { id: 'UNIFIED', label: '为所有广告输入统一文案', desc: 'Unified Headlines & Text', icon: <FileText size={18} /> },
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
                                {copyStrategy === 'AI_CUSTOM' ? (
                                  <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 animate-in fade-in slide-in-from-left-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                          <Sparkles size={24} />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-slate-900 tracking-tight">AI 智能深度定制文案</h4>
                                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">
                                            基于落地页分析报告，Agent 将为每一个商品自动撰写差异化的广告标题和正文，最大化转化率。
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

                          <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">广告投放排期</label>
                              <Info size={12} className="text-slate-300" />
                            </div>
                            
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: 'CONTINUOUS', label: '长期投放', desc: 'No End Date', icon: <Clock size={18} /> },
                                  { id: 'SCHEDULED', label: '定期投放', desc: 'Custom Date Range', icon: <Calendar size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setScheduleType(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                                      scheduleType === opt.id 
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50' 
                                        : 'bg-transparent border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${scheduleType === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-black uppercase ${scheduleType === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>{opt.label}</p>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {scheduleType === 'CONTINUOUS' ? (
                                  <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 animate-in fade-in slide-in-from-left-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                          <Clock size={24} />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-slate-900 tracking-tight">常青投放模式</h4>
                                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">
                                            广告发布后将立即开始投放，并且不设具体的结束日期，直至您手动暂停或预算消耗完毕。
                                          </p>
                                        </div>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">开始日期</label>
                                        <input 
                                          type="date"
                                          value={startDate}
                                          onChange={(e) => setStartDate(e.target.value)}
                                          className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 transition-all"
                                        />
                                      </div>
                                      <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">结束日期</label>
                                        <input 
                                          type="date"
                                          value={endDate}
                                          onChange={(e) => setEndDate(e.target.value)}
                                          className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 transition-all"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">快速设置时长</label>
                                      <div className="flex gap-3">
                                        {[3, 7, 14, 30].map(days => (
                                          <button
                                            key={days}
                                            onClick={() => handleQuickSchedule(days)}
                                            className="flex-1 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                          >
                                            {days} 天
                                          </button>
                                        ))}
                                      </div>
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
                onPublish={() => setShowPublishModal(true)}
                campaignName={selectedCampaign?.name || 'NEW-AI-CAMPAIGN-001'}
                optimizationEvent={optEvent}
                landingPageType={lpType}
                landingPageTemplate={lpTemplateUrl}
                productUtm={productLpUtm}
                copyStrategy={copyStrategy}
                unifiedHeadline={unifiedHeadline}
                unifiedBody={unifiedBody}
                campaignType={campaignType}
              />
            )}
          </div>
        </div>
      </main>

      {showCampaignModal && <CampaignSearchModal />}
      {showPublishModal && <PublishModal />}

      <footer className="py-16 flex flex-col items-center opacity-40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">AG</div>
          <span className="text-lg font-black text-slate-900 tracking-tighter">AdsGo Campaign Architect</span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Next Generation Multi-Channel Orchestration Engine</p>
      </footer>
    </div>
  );
};

export default BatchGenerateAds;