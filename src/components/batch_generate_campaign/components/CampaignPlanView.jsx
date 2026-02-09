import React, { useState } from 'react';
import { Users, Info, Sparkles, DollarSign, ChevronDown, Briefcase, Target, Layers, Lock, Edit3, Check } from 'lucide-react';

const AUDIENCE_SHORT_LABELS = {
  LAL: 'LAL',
  INT: 'INT',
  ADV: 'Adv+'
};

const CampaignPlanView = ({ 
  structure, 
  onStructureChange,
  budgetType, 
  onBudgetTypeChange,
  dailyBudget, 
  onBudgetChange,
  adsetAudiences,
  onToggleAudience,
  lalOptions,
  onToggleLalOption,
  selectedProducts,
  productCreativesMap,
  isExistingCampaign,
  selectedCampaign,
  onSelectCampaign
}) => {
  const [showLalDropdown, setShowLalDropdown] = useState(false);

  const getAdSetGroups = () => {
    let groups = [];
    
    if (structure.strategy === 'PER_PRODUCT') {
      selectedProducts.forEach(p => {
        const ads = productCreativesMap[p.id] || [];
        if (ads.length > 0) groups.push({ name: p.name, ads });
      });
    } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      const numAdsets = structure.numAdsets || 1;
      for (let i = 0; i < numAdsets; i++) {
        groups.push({ 
          name: `混合组 ${i + 1}`, 
          ads: allAds 
        });
      }
    } else if (structure.strategy === 'BY_AD_COUNT') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      const adsPerSet = structure.adsPerSet || 1;
      for (let i = 0; i < allAds.length; i += adsPerSet) {
        groups.push({ 
          name: `组 ${Math.floor(i / adsPerSet) + 1}`, 
          ads: allAds.slice(i, i + adsPerSet) 
        });
      }
    }
    return groups;
  };

  const adSetGroups = getAdSetGroups();
  const estimatedTotalDaily = budgetType === 'ABO' 
    ? dailyBudget * adSetGroups.length 
    : dailyBudget;

  const hasLalAudience = adsetAudiences.slice(0, adSetGroups.length).some(a => a === 'LAL');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">CAMPAIGN 架构策略</h4>
          <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center cursor-help shadow-sm">
            <Info size={12} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">选择发布逻辑</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'PER_PRODUCT', label: '每款商品1组', desc: '1 Adset per SKU' },
                { id: 'ALL_PRODUCTS_PER_SET', label: '每组内包含全部商品', desc: 'All SKU in every Adset' },
                { id: 'BY_AD_COUNT', label: '按素材量拆组', desc: 'Fixed Ads per Adset' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onStructureChange({ ...structure, strategy: opt.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    structure.strategy === opt.id 
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/10' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <p className={`text-[11px] font-black uppercase ${structure.strategy === opt.id ? 'text-indigo-600' : 'text-slate-800'}`}>{opt.label}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {structure.strategy === 'BY_AD_COUNT' && (
            <div className="animate-in slide-in-from-top-2 duration-200">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2 block">每个 Adset 包含素材数</label>
               <div className="relative max-w-[200px]">
                <select 
                  value={structure.adsPerSet}
                  onChange={(e) => onStructureChange({ ...structure, adsPerSet: Number(e.target.value) })}
                  className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-black text-slate-700 appearance-none outline-none focus:border-indigo-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Ads</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
              </div>
            </div>
          )}

          {structure.strategy === 'ALL_PRODUCTS_PER_SET' && (
            <div className="animate-in slide-in-from-top-2 duration-200">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2 block">Adset 组数 (1-10)</label>
               <div className="relative max-w-[200px]">
                <select 
                  value={structure.numAdsets}
                  onChange={(e) => onStructureChange({ ...structure, numAdsets: Number(e.target.value) })}
                  className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-black text-slate-700 appearance-none outline-none focus:border-indigo-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} Adsets</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
              </div>
            </div>
          )}

          <div className="bg-slate-50/50 rounded-[2rem] p-8 mt-6">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-10 relative">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl z-10 border-4 border-white">
                  <Briefcase size={28} />
                </div>
                <div className="absolute -bottom-6 flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Campaign</span>
                  <div className="w-[1px] h-6 bg-slate-200 mt-1"></div>
                </div>
              </div>

              <div className="w-full flex justify-center gap-10 overflow-x-auto pb-4 no-scrollbar">
                {adSetGroups.map((group, idx) => {
                  const audienceType = adsetAudiences[idx % adsetAudiences.length] || 'ADV';
                  return (
                    <div key={idx} className="flex flex-col items-center shrink-0">
                      {/* Clickable Audience Icon */}
                      <button 
                        onClick={() => onToggleAudience(idx)}
                        className={`w-10 h-10 rounded-xl border shadow-sm flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 mb-2 relative group ${
                          audienceType === 'LAL' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          audienceType === 'INT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}
                        title="点击切换受众策略 (Adv+ / LAL / INT)"
                      >
                        <Users size={18} />
                        <span className="text-[7px] font-black mt-0.5">{AUDIENCE_SHORT_LABELS[audienceType]}</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white">
                          {idx + 1}
                        </div>
                      </button>
                      
                      <p className="text-[8px] font-black text-slate-400 uppercase truncate max-w-[80px] text-center mb-3">{group.name}</p>
                      
                      <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                        {group.ads.slice(0, 4).map((ad, adIdx) => (
                          <div key={adIdx} className="w-8 h-10 rounded-md border border-white shadow-sm overflow-hidden bg-white ring-1 ring-slate-100">
                            <img src={ad.url} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {group.ads.length > 4 && (
                          <div className="w-8 h-10 rounded-md border border-white shadow-sm flex items-center justify-center bg-slate-50 text-[8px] font-black text-slate-400">
                            +{group.ads.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* LAL Options Multi-select Dropdown */}
              {hasLalAudience && (
                <div className="w-full mt-8 pt-6 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
                  <div className="relative">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block flex items-center gap-1.5">
                      <Sparkles size={10} className="text-purple-500" />
                      LAL 包含受众选项 (多选)
                    </label>
                    <div 
                      onClick={() => setShowLalDropdown(!showLalDropdown)}
                      className="w-full p-4 bg-white border-2 border-purple-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
                    >
                      <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[90%]">
                        {lalOptions.length === 0 ? (
                          <span className="text-xs font-bold text-slate-300">请选择 LAL 受众源...</span>
                        ) : (
                          lalOptions.map(opt => (
                            <span key={opt} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-purple-100">
                              {opt.split(' ')[1] || opt}
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown size={14} className={`text-purple-300 transition-transform ${showLalDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showLalDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-150">
                        {['US Purchase 1%', 'US add to cart 5%', 'US register last30days 1%~3%'].map((opt) => {
                          const isSel = lalOptions.includes(opt);
                          return (
                            <div 
                              key={opt}
                              onClick={() => onToggleLalOption(opt)}
                              className="flex items-center justify-between px-5 py-3 hover:bg-purple-50 cursor-pointer transition-colors"
                            >
                              <span className={`text-[11px] font-bold ${isSel ? 'text-purple-700' : 'text-slate-600'}`}>{opt}</span>
                              {isSel && <Check size={14} className="text-purple-600" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">预算配置与预估消耗</h4>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 h-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目标投放系列 (Campaign)</label>
              <button 
                onClick={onSelectCampaign}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Edit3 size={12} />
                <span className="text-[10px] font-black uppercase">选择已有</span>
              </button>
            </div>
            <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${isExistingCampaign ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExistingCampaign ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 shadow-sm'}`}>
                <Briefcase size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  {selectedCampaign?.name || '创建全新系列 (Create New)'}
                </p>
                {isExistingCampaign && <p className="text-[9px] text-indigo-400 font-bold uppercase mt-0.5">ID: {selectedCampaign.id}</p>}
              </div>
              {isExistingCampaign && <Lock size={14} className="text-indigo-300 shrink-0" />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black text-slate-800">投放预算模式</p>
              {isExistingCampaign && <Lock size={12} className="text-slate-300" />}
            </div>
            <div className={`flex p-1 bg-slate-100/80 rounded-xl border border-slate-100 ${isExistingCampaign ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
              <button 
                onClick={() => onBudgetTypeChange('CBO')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${budgetType === 'CBO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                CBO (均衡)
              </button>
              <button 
                onClick={() => onBudgetTypeChange('ABO')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${budgetType === 'ABO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                ABO (单组)
              </button>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden group">
            <div className="flex items-center w-full">
              <DollarSign className="text-slate-300 absolute left-8 pointer-events-none group-focus-within:text-indigo-500 transition-colors" size={32} />
              <input 
                type="number" 
                value={dailyBudget}
                onChange={(e) => onBudgetChange(Number(e.target.value))}
                className="w-full bg-transparent border-none outline-none pl-16 pr-4 text-4xl font-black text-slate-800"
              />
              <span className="text-[10px] font-black text-slate-400 uppercase mr-4">
                {budgetType === 'ABO' ? 'Per AdSet' : 'Total Campaign'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-indigo-400" />
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">预估日均消耗</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black text-white">${estimatedTotalDaily}</p>
                  <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-widest">
                    {budgetType === 'ABO' ? `${dailyBudget} * ${adSetGroups.length} Adsets` : '系列全局消耗'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Layers size={14} className="text-indigo-400" />
                    <p className="text-xl font-black text-white">{adSetGroups.length}</p>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AdSets 数量</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPlanView;