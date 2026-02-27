import React, { useState } from 'react';
import { Users, Info, Sparkles, DollarSign, ChevronDown, Briefcase, Target, Layers, Lock, Edit3, Check, LayoutGrid, Facebook } from 'lucide-react';
import { Z_INDEX } from '../../../constants/zIndex';

const AUDIENCE_SHORT_LABELS = {
  LAL: 'LAL',
  INT: 'INT',
  ADV: 'Adv+'
};

const CampaignPlanView = ({ 
  structure, 
  onStructureChange,
  campaignType,
  budgetType, 
  onBudgetTypeChange,
  dailyBudget, 
  onBudgetChange,
  adsetAudiences,
  onToggleAudience,
  lalOptions,
  onToggleLalOption,
  intOptions,
  onToggleIntOption,
  selectedProducts,
  productCreativesMap,
  isExistingCampaign,
  selectedCampaign,
  onSelectCampaign,
  selectedAccount,
  onSelectAccount,
  authStatus,
  handleAuthorize
}) => {
  const [showLalDropdown, setShowLalDropdown] = useState(false);
  const [showIntDropdown, setShowIntDropdown] = useState(false);
  const [showNumAdsetsDropdown, setShowNumAdsetsDropdown] = useState(false);

  const getAdSetGroups = () => {
    let groups = [];
    
    if (structure.strategy === 'PER_PRODUCT') {
      selectedProducts.forEach(p => {
        const ads = productCreativesMap[p.id] || [];
        if (ads.length > 0) {
          const count = structure.numAdsetsPerProduct || 1;
          for (let i = 0; i < count; i++) {
            groups.push({ 
              name: count > 1 ? `${p.name} - 组 ${i + 1}` : p.name, 
              ads 
            });
          }
        }
      });
    } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      const numAdsets = structure.numAdsets || 1;
      for (let i = 0; i < numAdsets; i++) {
        groups.push({ 
          name: campaignType === 'CATALOG' ? `DPA-${i + 1}` : `混合组 ${i + 1}`, 
          ads: allAds 
        });
      }
    } else if (structure.strategy === 'BY_AD_COUNT') {
      const allAds = selectedProducts.flatMap(p => productCreativesMap[p.id] || []);
      if (allAds.length > 0) {
        // 在总素材智能拆组逻辑下，adsPerSet 代表用户选择的总组数
        const numGroups = structure.adsPerSet || 1;
        
        let currentIndex = 0;
        for (let i = 0; i < numGroups; i++) {
          // 确保尽可能均分：计算剩余素材和剩余组数
          const remainingAds = allAds.length - currentIndex;
          const remainingGroups = numGroups - i;
          const currentGroupSize = Math.ceil(remainingAds / remainingGroups);
          
          groups.push({ 
            name: `智能分组 ${i + 1}`, 
            ads: allAds.slice(currentIndex, currentIndex + currentGroupSize) 
          });
          currentIndex += currentGroupSize;
        }
      }
    }
    return groups;
  };

  const adSetGroups = getAdSetGroups();
  const estimatedTotalDaily = budgetType === 'ABO' 
    ? dailyBudget * adSetGroups.length 
    : dailyBudget;

  const hasLalAudience = adsetAudiences.slice(0, adSetGroups.length).some(a => a === 'LAL');
  const hasIntAudience = adsetAudiences.slice(0, adSetGroups.length).some(a => a === 'INT');

  const allAdsCount = selectedProducts.flatMap(p => productCreativesMap[p.id] || []).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <h4 className="text-[11px] font-black text-slate-400 tracking-widest">Campaign 架构策略</h4>
          <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center cursor-help shadow-sm">
            <Info size={12} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest px-1">选择发布逻辑</label>
            <div className={`grid ${campaignType === 'CATALOG' ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
              {(campaignType === 'CATALOG' 
                ? [{ id: 'ALL_PRODUCTS_PER_SET', label: '每组均投放已选目录', desc: 'Each group uses selected catalog' }]
                : [
                    { id: 'PER_PRODUCT', label: '每款产品多组', desc: 'Multiple Adsets per SKU' },
                    { id: 'ALL_PRODUCTS_PER_SET', label: '混合组包含全品', desc: 'All SKU in every Adset' },
                    { id: 'BY_AD_COUNT', label: '总素材智能拆组', desc: 'Intelligently split all ads' },
                  ]
              ).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onStructureChange({ ...structure, strategy: opt.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    (structure.strategy === opt.id || campaignType === 'CATALOG')
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/10' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <p className={`text-[11px] font-black ${(structure.strategy === opt.id || campaignType === 'CATALOG') ? 'text-indigo-600' : 'text-slate-800'}`}>{opt.label}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {(structure.strategy === 'PER_PRODUCT' || structure.strategy === 'ALL_PRODUCTS_PER_SET' || structure.strategy === 'BY_AD_COUNT') && (
            <div className="animate-in slide-in-from-top-2 duration-200">
               <label className="text-[10px] font-bold text-slate-400 tracking-widest px-1 mb-2 block">
                 {structure.strategy === 'PER_PRODUCT' ? '每款产品对应的 Adset 组数 (1-10)' : `Adset 组数 (1-${structure.strategy === 'BY_AD_COUNT' ? allAdsCount : 10})`}
               </label>
               <div className="relative max-w-[240px]">
                  <div 
                    onClick={() => setShowNumAdsetsDropdown(!showNumAdsetsDropdown)}
                    className="w-full h-12 bg-white border-2 border-indigo-50 rounded-2xl px-5 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={16} className="text-indigo-500" />
                      <span className="text-sm font-black text-slate-700">
                        {structure.strategy === 'PER_PRODUCT' ? (structure.numAdsetsPerProduct || 1) : (structure.strategy === 'BY_AD_COUNT' ? (structure.adsPerSet || 1) : (structure.numAdsets || 1))} 组
                      </span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${showNumAdsetsDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {showNumAdsetsDropdown && (
                    <>
                      <div className="fixed inset-0 z-[190]" onClick={() => setShowNumAdsetsDropdown(false)} />
                      <div 
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-indigo-50 rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 py-2"
                        style={{ zIndex: 200 }}
                      >
                        {Array.from({ length: structure.strategy === 'BY_AD_COUNT' ? allAdsCount : 10 }, (_, i) => i + 1).map((n) => {
                          const isSel = structure.strategy === 'PER_PRODUCT' 
                            ? (structure.numAdsetsPerProduct || 1) === n 
                            : (structure.strategy === 'BY_AD_COUNT' ? (structure.adsPerSet || 1) === n : (structure.numAdsets || 1) === n);
                          return (
                            <div 
                              key={n}
                              onClick={() => {
                                let field = 'numAdsets';
                                if (structure.strategy === 'PER_PRODUCT') field = 'numAdsetsPerProduct';
                                else if (structure.strategy === 'BY_AD_COUNT') field = 'adsPerSet';
                                
                                onStructureChange({ 
                                  ...structure, 
                                  [field]: n 
                                });
                                setShowNumAdsetsDropdown(false);
                              }}
                              className={`flex items-center justify-between px-5 py-3 hover:bg-indigo-50 cursor-pointer transition-colors group ${isSel ? 'bg-indigo-50/50' : ''}`}
                            >
                              <span className={`text-xs font-black ${isSel ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-600'}`}>{n} 组 Adsets</span>
                              {isSel && <Check size={14} className="text-indigo-600" />}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
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
                  <span className="text-[9px] font-black text-slate-400 tracking-widest">Target Campaign</span>
                  <div className="w-[1px] h-6 bg-slate-200 mt-1"></div>
                </div>
              </div>

              <div className={`w-full flex ${adSetGroups.length > 4 ? 'justify-start' : 'justify-center'} gap-10 overflow-x-auto pb-4 no-scrollbar px-4`}>
                {adSetGroups.map((group, idx) => {
                  const audienceType = adsetAudiences[idx % adsetAudiences.length] || 'ADV';
                  return (
                    <div key={idx} className="flex flex-col items-center shrink-0">
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
                      
                      <p className="text-[8px] font-black text-slate-400 truncate max-w-[80px] text-center mb-3">{group.name}</p>
                      
                      <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                        {campaignType === 'CATALOG' ? (
                          <div className="w-16 h-20 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/30 flex flex-col items-center justify-center p-2 relative overflow-hidden group/catalog">
                            <div className="grid grid-cols-2 gap-1 opacity-40 group-hover/catalog:opacity-60 transition-opacity">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-4 h-4 rounded-sm bg-indigo-200" />
                              ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LayoutGrid size={24} className="text-indigo-400" />
                            </div>
                            <div className="absolute bottom-1 w-full flex justify-center">
                              <span className="text-[6px] font-black text-indigo-400 uppercase tracking-tighter">Dynamic Feed</span>
                            </div>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {hasLalAudience && (
                <div className="w-full mt-8 pt-6 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
                  <div className="relative">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest px-1 mb-2 block flex items-center gap-1.5">
                      <Sparkles size={10} className="text-purple-500" />
                      LAL 包含受众选项 (多选)
                    </label>
                    <div 
                      onClick={() => setShowLalDropdown(!showLalDropdown)}
                      className="w-full p-4 bg-white border-2 border-purple-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
                    >
                      <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[90%]">
                        {(!selectedAccount || lalOptions.length === 0) ? (
                          <span className="text-xs font-bold text-slate-300">请选择 LAL 受众源...</span>
                        ) : (
                          lalOptions.map(opt => (
                            <span key={opt} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black tracking-tighter border border-purple-100">
                              {opt.split(' ')[1] || opt}
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown size={14} className={`text-purple-300 transition-transform ${showLalDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showLalDropdown && (
                      <>
                        <div className="fixed inset-0 z-[190]" onClick={() => setShowLalDropdown(false)} />
                        <div 
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
                          style={{ zIndex: 200 }}
                        >
                          {!authStatus?.meta ? (
                            <div className="p-4">
                              <button 
                                onClick={() => { handleAuthorize('meta'); setShowLalDropdown(false); }}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                              >
                                <Facebook size={14} /> 立即连接 Meta
                              </button>
                            </div>
                          ) : !selectedAccount ? (
                            <div className="p-4">
                              <button 
                                onClick={() => { onSelectAccount(); setShowLalDropdown(false); }}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                              >
                                <Briefcase size={14} /> 选择广告账户
                              </button>
                            </div>
                          ) : (
                            ['US Purchase 1%', 'US add to cart 5%', 'US register last30days 1%~3%'].map((opt) => {
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
                            })
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {hasIntAudience && (
                <div className="w-full mt-4 pt-4 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
                  <div className="relative">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest px-1 mb-2 block flex items-center gap-1.5 uppercase">
                      <Target size={10} className="text-amber-500" />
                      AI 推荐兴趣词组 (多选 - HOVER 查看明细)
                    </label>
                    <div 
                      onClick={() => setShowIntDropdown(!showIntDropdown)}
                      className="w-full p-4 bg-white border-2 border-amber-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
                    >
                      <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[90%]">
                        {intOptions.length === 0 ? (
                          <span className="text-xs font-bold text-slate-300">点击选择 AI 生成的 5 组推荐兴趣...</span>
                        ) : (
                          intOptions.map(opt => (
                            <span key={opt} className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black tracking-tighter border border-amber-100">
                              {opt.split('(')[0].trim()}
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown size={14} className={`text-amber-300 transition-transform ${showIntDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showIntDropdown && (
                      <>
                        <div className="fixed inset-0 z-[190]" onClick={() => setShowIntDropdown(false)} />
                        <div 
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-amber-100 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
                          style={{ zIndex: 200 }}
                        >
                          {[
                            'Retro Fashion Lovers (复古时尚爱好者)', 
                            'Vintage Clothing Collectors (中古服饰藏家)', 
                            'Sustainable Apparel (可持续环保服饰)', 
                            'Italian Design Enthusiasts (意大利设计追求者)', 
                            'High-end Streetwear (高端潮流街头)'
                          ].map((opt) => {
                            const isSel = intOptions.includes(opt);
                            return (
                              <div 
                                key={opt}
                                onClick={() => onToggleIntOption(opt)}
                                className="flex items-center justify-between px-5 py-3 hover:bg-amber-50 cursor-pointer transition-colors"
                              >
                                <span className={`text-[11px] font-bold ${isSel ? 'text-amber-700' : 'text-slate-600'}`}>{opt}</span>
                                {isSel && <Check size={14} className="text-amber-600" />}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 tracking-widest px-2">预算配置与预估消耗</h4>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 h-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">目标投放系列 (Campaign)</label>
              <button 
                onClick={onSelectCampaign}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Edit3 size={12} />
                <span className="text-[10px] font-black">选择已有</span>
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
                {isExistingCampaign && <p className="text-[9px] text-indigo-400 font-bold mt-0.5">ID: {selectedCampaign.id}</p>}
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
              <span className="text-[10px] font-black text-slate-400 mr-4">
                {budgetType === 'ABO' ? 'Per AdSet' : 'Total Campaign'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-indigo-400" />
                <p className="text-[10px] font-black opacity-60 tracking-widest">预估日均消耗</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black text-white">${estimatedTotalDaily}</p>
                  <p className="text-[10px] text-indigo-400 font-bold mt-1 tracking-widest">
                    {budgetType === 'ABO' ? `${dailyBudget} * ${adSetGroups.length} Adsets` : '系列全局消耗'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Layers size={14} className="text-indigo-400" />
                    <p className="text-xl font-black text-white">{adSetGroups.length}</p>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold tracking-widest">AdSets 数量</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPlanView;
