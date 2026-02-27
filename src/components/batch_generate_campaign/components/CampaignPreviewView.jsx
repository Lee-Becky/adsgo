import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Sparkles, ChevronLeft, 
  Rocket, Edit3, DollarSign, X, Check, Globe, 
  Layers, Target, Box, Plus, Tag, Link as LinkIcon, Megaphone,
  ChevronDown
} from 'lucide-react';

const AUDIENCE_NAMES = {
  LAL: 'LAL 1% US Purchase',
  INT: 'INT Lifestyle & Design',
  ADV: 'Advantage+ Audience'
};

const CTA_OPTIONS = [
  'Shop Now',
  'Learn More',
  'Sign Up',
  'Get Offer',
  'Book Now',
  'Contact Us',
  'Download',
  'Watch More'
];

const CampaignPreviewView = ({
  structure, budgetType, dailyBudget, initialAdsetAudiences, productCreativesMap, selectedProducts, brand, onBack, onPublish, campaignName, optimizationEvent, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody, campaignType,
  estimatedTotalDaily, adSetGroupsCount
}) => {
  
  const [localAdSets, setLocalAdSets] = useState([]);
  const [editingAdSetIndex, setEditingAdSetIndex] = useState(null);
  const [editingAdInfo, setEditingAdInfo] = useState(null);
  
  // Temporary state for interest input
  const [interestInput, setInterestInput] = useState('');

  const getAdUrl = (p) => {
    if (landingPageType === 'PRODUCT') {
      let baseUrl = p.url;
      if (productUtm) {
        const utmProcessed = productUtm.replace(/\{\{product_name\}\}/g, encodeURIComponent(p.name)).replace(/\{\{product_id\}\}/g, encodeURIComponent(p.id));
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${utmProcessed.replace(/^[?&]+/, '')}`;
      }
      return baseUrl;
    }
    return landingPageTemplate.replace(/\{\{product_name\}\}/g, encodeURIComponent(p.name));
  };

  const getAdCopy = (p) => {
    if (copyStrategy === 'UNIFIED') return { headline: unifiedHeadline, body: unifiedBody };
    return { headline: `Get your ${p.name} today!`, body: `Discover quality and style that lasts with our exclusive ${p.name}. Limited time offer.` };
  };

  useMemo(() => {
    let adSets = [];
    const targetAdSetCount = adSetGroupsCount || 0;

    if (campaignType === 'CATALOG') {
      for (let i = 0; i < targetAdSetCount; i++) {
        const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
        adSets.push({
          name: `DPA-${i + 1} - ${AUDIENCE_NAMES[audienceType]}`,
          audienceType,
          ageMin: 18, ageMax: 65, gender: 'All', interests: ['Broad Shopping'], placements: ['All'], optimizationEvent,
          ads: [{
            id: `cat-${i}`,
            name: `Dynamic Catalog Creative`,
            headline: '{{product.name}}',
            primaryText: 'Check out our latest arrivals. {{product.description}}',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
            cta: 'Shop Now',
            destinationUrl: '{{product.url}}',
            isDynamic: true,
            offerType: 'AUTO',
            promoCode: '90%OFF'
          }]
        });
      }
    } else {
      if (structure.strategy === 'PER_PRODUCT') {
        const activeProducts = selectedProducts.filter(p => (productCreativesMap[p.id] || []).length > 0);
        const adsetsPerProduct = structure.numAdsetsPerProduct || 1;
        
        activeProducts.forEach((p, pIdx) => {
          const creatives = productCreativesMap[p.id] || [];
          const copy = getAdCopy(p);
          
          for (let i = 0; i < adsetsPerProduct; i++) {
            const adSetOverallIdx = (pIdx * adsetsPerProduct) + i;
            const audienceType = initialAdsetAudiences[adSetOverallIdx % initialAdsetAudiences.length] || 'ADV';
            
            adSets.push({
              name: adsetsPerProduct > 1 ? `${p.name} - 组 ${i + 1} - ${AUDIENCE_NAMES[audienceType]}` : `${p.name} - ${AUDIENCE_NAMES[audienceType]}`,
              audienceType,
              ageMin: 18, ageMax: 65, gender: 'All', interests: ['E-commerce', 'Shopping'], placements: ['Feed', 'Stories', 'Reels'], optimizationEvent,
              ads: creatives.map((c, cIdx) => ({
                id: `${p.id}-${i}-${cIdx}`,
                name: `AD - ${p.name} - ${c.id.slice(-4)}`,
                headline: copy.headline,
                primaryText: copy.body,
                imageUrl: c.url,
                cta: 'Shop Now',
                destinationUrl: getAdUrl(p),
                utmParams: ``,
                productId: p.id,
                offerType: 'AUTO',
                promoCode: '90%OFF'
              }))
            });
          }
        });
      } else if (structure.strategy === 'ALL_PRODUCTS_PER_SET') {
        const allCreativesPool = selectedProducts.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
        for (let i = 0; i < targetAdSetCount; i++) {
          const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
          adSets.push({
            name: `混合组 ${i + 1} - ${AUDIENCE_NAMES[audienceType]}`,
            audienceType,
            ageMin: 18, ageMax: 65, gender: 'All', interests: ['E-commerce', 'Shopping'], placements: ['Feed', 'Stories'], optimizationEvent,
            ads: allCreativesPool.map((c, cIdx) => {
              const p = selectedProducts.find(prod => prod.id === c.productId);
              const copy = getAdCopy(p);
              return {
                id: `${i}-${cIdx}`,
                name: `AD - ${p.name} - ${c.id.slice(-4)}`,
                headline: copy.headline,
                primaryText: copy.body,
                imageUrl: c.url,
                cta: 'Shop Now',
                destinationUrl: getAdUrl(p),
                utmParams: ``,
                productId: p.id,
                offerType: 'AUTO',
                promoCode: '90%OFF'
              };
            })
          });
        }
      } else if (structure.strategy === 'BY_AD_COUNT') {
        const allAdsPool = selectedProducts.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
        if (allAdsPool.length > 0) {
          const numGroups = targetAdSetCount;
          let currentIndex = 0;
          
          for (let i = 0; i < numGroups; i++) {
            const audienceType = initialAdsetAudiences[i % initialAdsetAudiences.length] || 'ADV';
            const remainingAds = allAdsPool.length - currentIndex;
            const remainingGroups = numGroups - i;
            const currentGroupSize = Math.ceil(remainingAds / remainingGroups);
            const chunk = allAdsPool.slice(currentIndex, currentIndex + currentGroupSize);
            
            adSets.push({
              name: `智能分组 ${i + 1} - ${AUDIENCE_NAMES[audienceType]}`,
              audienceType,
              ageMin: 18, ageMax: 65, gender: 'All', interests: ['Fashion'], placements: ['Feed'], optimizationEvent,
              ads: chunk.map((c, cIdx) => {
                const p = selectedProducts.find(prod => prod.id === c.productId);
                const copy = getAdCopy(p);
                return {
                  id: `${i}-${cIdx}`,
                  name: `AD - G${i + 1} - ${c.id.slice(-4)}`,
                  headline: copy.headline,
                  primaryText: copy.body,
                  imageUrl: c.url,
                  cta: 'Shop Now',
                  destinationUrl: getAdUrl(p),
                  utmParams: ``,
                  productId: p.id,
                  offerType: 'AUTO',
                  promoCode: '90%OFF'
                };
              })
            });
            currentIndex += currentGroupSize;
          }
        }
      }
    }
    setLocalAdSets(adSets);
  }, [campaignType, selectedProducts, structure, productCreativesMap, initialAdsetAudiences, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody, optimizationEvent, adSetGroupsCount]);

  const totalDailyBudget = estimatedTotalDaily || (budgetType === 'CBO' ? dailyBudget : dailyBudget * localAdSets.length);

  const addInterest = (asIndex) => {
    if (!interestInput.trim()) return;
    const next = [...localAdSets];
    if (!next[asIndex].interests.includes(interestInput.trim())) {
      next[asIndex].interests = [...next[asIndex].interests, interestInput.trim()];
      setLocalAdSets(next);
    }
    setInterestInput('');
  };

  const removeInterest = (asIndex, interest) => {
    const next = [...localAdSets];
    next[asIndex].interests = next[asIndex].interests.filter(i => i !== interest);
    setLocalAdSets(next);
  };

  const EditAdSetModal = () => {
    if (editingAdSetIndex === null) return null;
    const adSet = localAdSets[editingAdSetIndex];
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">编辑广告组 (AdSet)</h3>
            <button onClick={() => setEditingAdSetIndex(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">广告组名称</label>
              <input type="text" value={adSet.name} onChange={e => {
                const next = [...localAdSets]; next[editingAdSetIndex].name = e.target.value; setLocalAdSets(next);
              }} className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">兴趣词配置 (Interests)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={interestInput} 
                  onChange={e => setInterestInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addInterest(editingAdSetIndex)}
                  placeholder="输入兴趣词后回车或点击添加..."
                  className="flex-1 h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all"
                />
                <button 
                  onClick={() => addInterest(editingAdSetIndex)}
                  className="px-6 bg-slate-900 text-white rounded-xl font-black text-xs"
                >添加</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {adSet.interests.map(i => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black flex items-center gap-2 border border-indigo-100 group">
                    {i}
                    <button onClick={() => removeInterest(editingAdSetIndex, i)} className="text-indigo-300 hover:text-rose-500 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {adSet.interests.length === 0 && <p className="text-[10px] text-slate-300 font-bold italic">暂无兴趣词，建议添加以优化投放效果</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 px-1">最小年龄</label>
                <input type="number" value={adSet.ageMin} onChange={e => {
                  const next = [...localAdSets]; next[editingAdSetIndex].ageMin = Number(e.target.value); setLocalAdSets(next);
                }} className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 px-1">最大年龄</label>
                <input type="number" value={adSet.ageMax} onChange={e => {
                  const next = [...localAdSets]; next[editingAdSetIndex].ageMax = Number(e.target.value); setLocalAdSets(next);
                }} className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">性别 (Gender)</label>
              <div className="flex gap-2">
                {['All', 'Men', 'Women'].map(g => (
                  <button key={g} onClick={() => {
                    const next = [...localAdSets]; next[editingAdSetIndex].gender = g; setLocalAdSets(next);
                  }} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${adSet.gender === g ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{g}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onClick={() => setEditingAdSetIndex(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs">保存修改</button>
          </div>
        </div>
      </div>
    );
  };

  const EditAdModal = () => {
    if (!editingAdInfo) return null;
    const { asIndex, adIndex } = editingAdInfo;
    const ad = localAdSets[asIndex].ads[adIndex];
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">编辑广告素材 (Ad)</h3>
            <button onClick={() => setEditingAdInfo(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">广告标题 (Headline)</label>
              <input type="text" value={ad.headline} onChange={e => {
                const next = [...localAdSets]; next[asIndex].ads[adIndex].headline = e.target.value; setLocalAdSets(next);
              }} className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1">广告正文 (Primary Text)</label>
              <textarea value={ad.primaryText} onChange={e => {
                const next = [...localAdSets]; next[asIndex].ads[adIndex].primaryText = e.target.value; setLocalAdSets(next);
              }} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold h-32 resize-none focus:border-indigo-600 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><Megaphone size={12} className="text-indigo-600"/> 行动号召 (CTA)</label>
              <div className="relative">
                <select 
                  value={ad.cta} 
                  onChange={e => {
                    const next = [...localAdSets]; next[asIndex].ads[adIndex].cta = e.target.value; setLocalAdSets(next);
                  }} 
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all appearance-none"
                >
                  {CTA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><LinkIcon size={12} className="text-indigo-600"/> 落地页 URL</label>
              <input 
                type="text" 
                value={ad.destinationUrl} 
                onChange={e => {
                  const next = [...localAdSets]; next[asIndex].ads[adIndex].destinationUrl = e.target.value; setLocalAdSets(next);
                }} 
                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-600 outline-none transition-all" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 px-1 flex items-center gap-2"><Tag size={12} className="text-indigo-600"/> 突显优惠 (Promo Offer)</label>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const next = [...localAdSets];
                      next[asIndex].ads[adIndex].offerType = 'AUTO';
                      next[asIndex].ads[adIndex].promoCode = '90%OFF';
                      setLocalAdSets(next);
                    }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${ad.offerType === 'AUTO' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'}`}
                  >自动获取 (90% OFF)</button>
                  <button 
                    onClick={() => {
                      const next = [...localAdSets];
                      next[asIndex].ads[adIndex].offerType = 'MANUAL';
                      setLocalAdSets(next);
                    }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${ad.offerType === 'MANUAL' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'}`}
                  >手动输入</button>
                </div>
                {ad.offerType === 'MANUAL' && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <input 
                      type="text" 
                      placeholder="输入优惠码，例如: SAVE20" 
                      value={ad.promoCode || ''}
                      onChange={e => {
                        const next = [...localAdSets]; next[asIndex].ads[adIndex].promoCode = e.target.value; setLocalAdSets(next);
                      }}
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onClick={() => setEditingAdInfo(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs">保存修改</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">发布方案预览</h2>
          <p className="text-sm text-slate-400 font-medium mt-1 tracking-widest">{campaignName} • {campaignType === 'CATALOG' ? '目录广告' : '商品广告'} 架构</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
          <ChevronLeft size={16} /> 返回修改配置
        </button>
      </div>

      <div className="space-y-16">
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-40 translate-x-40"></div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10"><Briefcase size={28} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 tracking-widest">Campaign Overview</p>
                <h3 className="text-2xl font-black">{campaignName}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 tracking-widest">总日消耗</p>
              <p className="text-2xl font-black text-emerald-400">${totalDailyBudget}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">投放国家</p>
              <p className="text-sm font-bold">{brand.country}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">优化目标</p>
              <p className="text-sm font-bold truncate">{optimizationEvent.split(' ')[0]}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">AdSets 数量</p>
              <p className="text-sm font-bold">{adSetGroupsCount || localAdSets.length}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">Campaign 类型</p>
              <p className="text-sm font-bold">{campaignType}</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {localAdSets.map((adSet, asIdx) => (
            <div key={asIdx} className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center font-black">AS{asIdx + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-black text-slate-400 tracking-widest">Ad Set</p>
                       <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded">{adSet.audienceType}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800">{adSet.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {adSet.interests.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100">
                      <Tag size={12} className="text-indigo-600" />
                      <span className="text-[9px] font-black text-indigo-600">{adSet.interests[0]} {adSet.interests.length > 1 ? `+${adSet.interests.length - 1}` : ''}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => setEditingAdSetIndex(asIdx)}
                    className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Edit3 size={14} /> 编辑配置
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {adSet.ads.map((ad, aIdx) => {
                  const product = selectedProducts.find(p => p.id === ad.productId);
                  return (
                    <div key={aIdx} className="group relative">
                      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 relative">
                        <button 
                          onClick={() => setEditingAdInfo({ asIndex: asIdx, adIndex: aIdx })}
                          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-600 shadow-lg"
                        >
                          <Edit3 size={14} />
                        </button>
                        <div className="p-4 bg-white border-b border-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">{brand.name.charAt(0)}</div>
                              <div><p className="text-[10px] font-bold text-slate-900">{brand.name}</p><p className="text-[8px] text-slate-400">Sponsored</p></div>
                            </div>
                            {ad.promoCode && (
                              <div className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                <Sparkles size={10} className="text-rose-500" />
                                <span className="text-[8px] font-black text-rose-600 tracking-tighter">{ad.promoCode}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-700 leading-relaxed line-clamp-2">{ad.primaryText}</p>
                        </div>
                        <div className="aspect-square bg-slate-100 relative overflow-hidden">
                           <img src={ad.imageUrl} className="w-full h-full object-cover" />
                           {ad.isDynamic && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-black tracking-widest">Dynamic Catalog Preview</div>}
                        </div>
                        <div className="p-4 bg-slate-50 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-slate-400 font-black truncate">{ad.destinationUrl.split('?')[0].split('/').slice(0,3).join('/')}</p>
                            <h6 className="text-[10px] font-black text-slate-900 truncate">{ad.headline}</h6>
                          </div>
                          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-800 shrink-0 tracking-tighter shadow-sm">{ad.cta}</div>
                        </div>
                        {product && (
                          <div className="p-2.5 bg-indigo-50/50 border-t border-indigo-100 flex items-center gap-2">
                             <img src={product.imageUrl} className="w-6 h-6 rounded-md object-cover border border-indigo-200" />
                             <div className="min-w-0 flex-1"><p className="text-[8px] font-black text-indigo-400 tracking-tighter">关联商品</p><p className="text-[9px] font-bold text-indigo-900 truncate">{product.name}</p></div>
                          </div>
                        )}
                        {ad.isDynamic && (
                           <div className="p-2.5 bg-emerald-50/50 border-t border-emerald-100 flex items-center gap-2">
                              <Box size={14} className="text-emerald-400" />
                              <p className="text-[9px] font-bold text-emerald-900">使用目录动态字段渲染</p>
                           </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-8 z-[100] border-t border-white/5 backdrop-blur-xl bg-opacity-95 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><Layers size={24} /></div>
              <div><p className="text-[10px] font-black text-slate-400 tracking-widest">结构方案</p><p className="text-xl font-black">{adSetGroupsCount || localAdSets.length} Adsets • {campaignType === 'CATALOG' ? 'Dynamic' : localAdSets.reduce((acc, as) => acc + as.ads.length, 0)} Ads</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><DollarSign size={24} /></div>
              <div><p className="text-[10px] font-black text-slate-400 tracking-widest">预估日消耗</p><p className="text-2xl font-black text-emerald-400">${totalDailyBudget}</p></div>
            </div>
          </div>
          <button onClick={onPublish} className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-base shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-3">
            <Rocket size={20} className="text-indigo-600" /> 立即发布方案
          </button>
        </div>
      </div>
      <EditAdSetModal />
      <EditAdModal />
    </div>
  );
};

export default CampaignPreviewView;
