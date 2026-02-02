import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, Globe, MapPin, Target, Sparkles, ChevronRight, 
  ShoppingCart, Layout, Users, MousePointer2, Plus, Info, 
  ArrowRight, Zap, Image as ImageIcon, Link as LinkIcon, Trash2
} from 'lucide-react';

export const ConfigurePublishStep = ({ product, savedConfig, LOGO_LINKS, onBack, onConfirm }) => {
  // Use data from Brand config as defaults
  const [locations] = useState(savedConfig?.locations || ['United States (US)']);
  const [objective] = useState('Sales & Conversions');
  const [event] = useState('Purchase');
  
  // Dynamic Structure Logic
  const [creatives, setCreatives] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400", isMain: true },
    { id: 2, url: "https://picsum.photos/seed/asset-1/300/400" },
    { id: 3, url: "https://picsum.photos/seed/asset-2/300/400" },
    { id: 4, url: "https://picsum.photos/seed/asset-3/300/400" },
    { id: 5, url: "https://picsum.photos/seed/asset-4/300/400" },
    { id: 6, url: "https://picsum.photos/seed/asset-5/300/400" },
    { id: 7, url: "https://picsum.photos/seed/asset-6/300/400" },
    { id: 8, url: "https://picsum.photos/seed/asset-7/300/400" },
  ]);

  const totalCreatives = creatives.length;
  const [adsetsCount, setAdsetsCount] = useState(3);
  const [adsPerSet, setAdsPerSet] = useState('6'); // Can be string 'dynamic' or number
  
  const [budget, setBudget] = useState(50);
  const [budgetType, setBudgetType] = useState('CBO'); // CBO or ABO

  // Campaign count logic: use ceil to ensure all creatives are covered
  const campaignCount = useMemo(() => {
    if (adsPerSet === 'dynamic') {
      return 1; // In dynamic mode, we use 1 campaign where each adset contains all creatives
    }
    const adsCountNum = Number(adsPerSet);
    return Math.ceil(totalCreatives / (adsetsCount * adsCountNum));
  }, [adsetsCount, adsPerSet, totalCreatives]);

  // Dynamic Estimated Budget Logic
  const estimatedDailyBudget = useMemo(() => {
    if (budgetType === 'CBO') {
      return campaignCount * budget;
    } else {
      return (campaignCount * adsetsCount) * budget;
    }
  }, [budgetType, campaignCount, adsetsCount, budget]);

  // Dynamic Scale Logic to keep the tree inside the card
  const treeScale = useMemo(() => {
    const horizontalComplexity = campaignCount * adsetsCount;
    if (horizontalComplexity > 12) return 0.5;
    if (horizontalComplexity > 8) return 0.65;
    if (horizontalComplexity > 4) return 0.8;
    return 1;
  }, [campaignCount, adsetsCount]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newCreatives = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      isMain: false
    }));
    setCreatives(prev => [...prev, ...newCreatives]);
  };

  const removeCreative = (id) => {
    if (creatives.length <= 1) return; // Keep at least one
    setCreatives(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        
        {/* Top Configuration Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Location', value: locations[0], icon: MapPin },
            { label: 'Platform', value: 'Meta', icon: Globe, img: LOGO_LINKS?.meta },
            { label: 'Objective', value: objective, icon: Target },
            { label: 'Optimization event', value: event, icon: Zap }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-indigo-200 transition-all">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">{item.label}</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.img ? (
                    <img src={item.img} className="w-5 h-5 rounded object-contain shrink-0" alt="" />
                  ) : (
                    <item.icon size={16} className="text-indigo-500 shrink-0" />
                  )}
                  <span className="text-sm font-bold text-slate-700 truncate">{item.value}</span>
                </div>
                <ChevronDown size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Landing Page & Creatives Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-100 shadow-sm">
                  <ShoppingCart size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-none">{product?.name || 'AIGC Recommended Creatives'}</h3>
                  <div className="flex items-center gap-1.5 text-indigo-600 hover:underline cursor-pointer">
                    <LinkIcon size={14} />
                    <span className="text-xs font-medium">{product?.url || '/products/item-1'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creatives Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {creatives.map((creative) => (
                <div key={creative.id} className="aspect-[3/4] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group shadow-sm hover:shadow-lg transition-all">
                  <img src={creative.url} className="w-full h-full object-cover" alt="" />
                  {creative.isMain && (
                    <div className="absolute top-2 left-2 bg-indigo-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded shadow-lg tracking-tighter">Main</div>
                  )}
                  {/* Delete Button on Hover */}
                  <button 
                    onClick={() => removeCreative(creative.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 shadow-sm"
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              {/* Add Button */}
              <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-center leading-tight">Add creatives</span>
              </label>
            </div>
          </div>
        </div>

        {/* Campaign Structure & Budget Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Structure & Tree */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 space-y-8 flex flex-col min-h-[500px]">
            <h3 className="text-sm font-bold text-slate-400 tracking-wider">Campaign structure</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider">Adsets</label>
                <div className="relative">
                  <select 
                    value={adsetsCount} 
                    onChange={(e) => setAdsetsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider">Ads per set</label>
                <div className="relative">
                  <select 
                    value={adsPerSet} 
                    onChange={(e) => setAdsPerSet(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="dynamic">Dynamic</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 flex gap-3 border border-indigo-100/50">
              <Info size={18} className="text-indigo-500 shrink-0" />
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {adsPerSet === 'dynamic' ? (
                  <>
                    AI will generate <span className="text-indigo-600 font-bold">1 Campaign</span> where each of the <span className="text-indigo-600 font-bold">{adsetsCount} Adsets</span> will use <span className="text-indigo-600 font-bold">all {totalCreatives} creatives</span> (Dynamic mode).
                  </>
                ) : (
                  <>
                    AI will generate <span className="text-indigo-600 font-bold">{campaignCount} Campaign</span> with a <span className="text-indigo-600 font-bold">1:{adsetsCount}:{adsPerSet}</span> structure based on the <span className="text-indigo-600 font-bold">{totalCreatives} creatives</span> provided.
                  </>
                )}
              </p>
            </div>

            {/* Dynamic Tree Visualization */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/30 rounded-3xl border border-slate-100 relative overflow-hidden">
              <div 
                className="flex flex-col items-center gap-8 relative z-10 transition-transform duration-500 origin-center"
                style={{ transform: `scale(${treeScale})` }}
              >
                {/* Root Campaigns */}
                <div className="flex gap-16">
                  {[...Array(campaignCount)].map((_, ci) => (
                    <div key={ci} className="flex flex-col items-center group">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl relative z-20 transition-transform group-hover:scale-110">
                        <Layout size={20} />
                      </div>
                      <span className="text-[9px] font-bold mt-2 text-slate-400">Camp {ci + 1}</span>
                      
                      {/* Connector down to Adsets */}
                      <div className="w-px h-8 bg-slate-200 relative">
                        <div className="absolute top-full left-1/2 -translate-x-1/2 bg-slate-200 transition-all" 
                             style={{ 
                               width: adsetsCount > 1 ? `${(adsetsCount - 1) * 64}px` : '0px', 
                               height: '1px' 
                             }} 
                        />
                      </div>

                      {/* Level 2: Adsets */}
                      <div className="flex gap-8 mt-0">
                        {[...Array(adsetsCount)].map((_, ai) => (
                          <div key={ai} className="flex flex-col items-center">
                            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm relative z-20 transition-all hover:border-indigo-300">
                              <Users size={14} />
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-slate-200" />
                            </div>
                            
                            {/* Level 3: Ads dots grid */}
                            <div 
                              className="mt-8 grid gap-1 px-1" 
                              style={{ 
                                gridTemplateColumns: `repeat(${adsPerSet === 'dynamic' ? Math.ceil(totalCreatives/3) : Math.ceil(Number(adsPerSet)/2)}, minmax(0, 1fr))` 
                              }}
                            >
                              {[...Array(adsPerSet === 'dynamic' ? totalCreatives : Number(adsPerSet))].map((_, di) => (
                                <div key={di} className="w-2 h-2 bg-indigo-500 rounded-[2px] shadow-sm animate-in zoom-in" style={{ animationDelay: `${di * 50}ms` }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Budget & Estimated Spend */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-10 space-y-10 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 leading-none">Campaign budget (Daily)</h3>
              <div className="inline-flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                {['CBO', 'ABO'].map(type => (
                  <button
                    key={type}
                    onClick={() => setBudgetType(type)}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                      budgetType === type ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Budget Input */}
            <div className="bg-slate-50 rounded-3xl p-8 flex items-center gap-6 group hover:bg-slate-100/50 transition-colors border border-transparent hover:border-slate-200">
              <span className="text-4xl font-bold text-slate-300">$</span>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-transparent text-6xl font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-bold text-indigo-100 tracking-wider mb-2">Daily spend (est.)</p>
                <div className="text-3xl font-bold">${estimatedDailyBudget}</div>
              </div>
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-2">Total campaigns</p>
                <div className="text-3xl font-bold">{campaignCount}</div>
              </div>
            </div>

            {/* Suggestion Box */}
            <div className="bg-slate-50 rounded-[2rem] p-6 flex gap-4 border border-slate-100 mt-auto">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">AI testing advice</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Based on <span className="font-bold text-indigo-600">{totalCreatives} creatives</span>, AI suggests using cross-testing mode. First round test duration is estimated to be <span className="font-bold text-indigo-600">72 hours</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-[260px] right-0 h-24 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <button 
          onClick={onBack}
          className="absolute left-12 px-8 py-3 bg-slate-50 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-100 transition-all border border-slate-100"
        >
          Back
        </button>
        <button 
          onClick={() => onConfirm?.({
            campaignCount,
            adsetsCount,
            adsPerSet,
            budget,
            budgetType,
            totalCreatives,
            estimatedDailyBudget,
            creatives
          })}
          className="px-24 py-4 bg-slate-900 text-white rounded-full text-sm font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 group"
        >
          Confirm configuration & start AI building
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
