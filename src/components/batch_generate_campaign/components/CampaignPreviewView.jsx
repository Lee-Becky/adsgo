
import React, { useState, useMemo } from 'react';
import { AudienceType, BudgetType, StructureStrategy, OptimizationEvent, LandingPageType, AdCopyStrategy } from '../types';
import { 
  Briefcase, ChevronLeft, Rocket, DollarSign, Layers, Box
} from 'lucide-react';

const AUDIENCE_NAMES = {
  [AudienceType.LAL]: 'LAL 1% US Purchase',
  [AudienceType.INT]: 'INT Lifestyle & Design',
  [AudienceType.ADVANTAGE]: 'Advantage+ Audience'
};

export const CampaignPreviewView = ({
  structure,
  budgetType,
  dailyBudget,
  initialAdsetAudiences,
  productCreativesMap,
  selectedProducts,
  brand,
  onBack,
  onPublish,
  campaignName,
  optimizationEvent,
  landingPageType,
  landingPageTemplate,
  productUtm,
  copyStrategy,
  unifiedHeadline,
  unifiedBody
}) => {
  const getAdUrl = (p) => {
    if (landingPageType === LandingPageType.PRODUCT) {
      let baseUrl = p.url;
      if (productUtm) {
        const utmProcessed = productUtm
          .replace(/\{\{product_name\}\}/g, encodeURIComponent(p.name))
          .replace(/\{\{product_id\}\}/g, encodeURIComponent(p.id));
        const separator = baseUrl.includes('?') ? '&' : '?';
        const cleanUtm = utmProcessed.replace(/^[?&]+/, '');
        return `${baseUrl}${separator}${cleanUtm}`;
      }
      return baseUrl;
    }
    return landingPageTemplate.replace(/\{\{product_name\}\}/g, encodeURIComponent(p.name));
  };

  const getAdCopy = (p) => {
    if (copyStrategy === AdCopyStrategy.UNIFIED) {
      return { headline: unifiedHeadline, body: unifiedBody };
    }
    return {
      headline: `Get your ${p.name} today!`,
      body: `Discover quality and style that lasts with our exclusive ${p.name}. Limited time offer.`
    };
  };

  const computedStructure = useMemo(() => {
    let adSets = [];
    
    if (structure.strategy === StructureStrategy.PER_PRODUCT) {
      selectedProducts.forEach((p, idx) => {
        const creatives = productCreativesMap[p.id] || [];
        const audienceType = initialAdsetAudiences[idx % initialAdsetAudiences.length] || AudienceType.ADVANTAGE;
        const copy = getAdCopy(p);
        adSets.push({
          name: `${p.name} - ${AUDIENCE_NAMES[audienceType]}`,
          audienceType,
          ads: creatives.map(c => ({
            name: `AD - ${p.name} - ${c.id.slice(-4)}`,
            headline: copy.headline,
            primaryText: copy.body,
            imageUrl: c.url,
            cta: 'Shop Now',
            destinationUrl: getAdUrl(p),
            utmParams: ``,
            productId: p.id
          }))
        });
      });
    } else if (structure.strategy === StructureStrategy.PER_CATEGORY) {
      const categoryMap = {};
      selectedProducts.forEach(p => {
        const cat = p.category || 'General';
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push(p);
      });
      Object.entries(categoryMap).forEach(([cat, products], idx) => {
        const audienceType = initialAdsetAudiences[idx % initialAdsetAudiences.length] || AudienceType.ADVANTAGE;
        const allCreatives = products.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
        adSets.push({
          name: `${cat} Collection - ${AUDIENCE_NAMES[audienceType]}`,
          audienceType,
          ads: allCreatives.map(c => {
            const p = products.find(prod => prod.id === c.productId);
            const copy = getAdCopy(p);
            return {
              name: `AD - ${cat} - ${c.id.slice(-4)}`,
              headline: copy.headline,
              primaryText: copy.body,
              imageUrl: c.url,
              cta: 'Shop Now',
              destinationUrl: getAdUrl(p),
              utmParams: ``,
              productId: p.id
            };
          })
        });
      });
    } else if (structure.strategy === StructureStrategy.BY_AD_COUNT) {
      const allCreatives = selectedProducts.flatMap(p => (productCreativesMap[p.id] || []).map(c => ({...c, productId: p.id})));
      const adsPerSet = structure.adsPerSet || 1;
      for (let i = 0; i < allCreatives.length; i += adsPerSet) {
        const adSetIdx = Math.floor(i / adsPerSet);
        const audienceType = initialAdsetAudiences[adSetIdx % initialAdsetAudiences.length] || AudienceType.ADVANTAGE;
        const chunk = allCreatives.slice(i, i + adsPerSet);
        adSets.push({
          name: `Dynamic Set ${adSetIdx + 1} - ${AUDIENCE_NAMES[audienceType]}`,
          audienceType,
          ads: chunk.map(c => {
            const p = selectedProducts.find(prod => prod.id === c.productId);
            const copy = getAdCopy(p);
            return {
              name: `AD - Set${adSetIdx + 1} - ${c.id.slice(-4)}`,
              headline: copy.headline,
              primaryText: copy.body,
              imageUrl: c.url,
              cta: 'Shop Now',
              destinationUrl: getAdUrl(p),
              utmParams: ``,
              productId: p.id
            };
          })
        });
      }
    }
    return { adSets };
  }, [selectedProducts, structure, productCreativesMap, initialAdsetAudiences, landingPageType, landingPageTemplate, productUtm, copyStrategy, unifiedHeadline, unifiedBody]);

  const [localAdSets] = useState(computedStructure.adSets);
  const totalDailyBudget = budgetType === BudgetType.CBO ? dailyBudget : dailyBudget * localAdSets.length;

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">发布方案预览</h2>
          <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">
            {campaignName} • 架构预览
          </p>
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Overview</p>
                <h3 className="text-2xl font-black">{campaignName}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">总日消耗</p>
              <p className="text-2xl font-black text-emerald-400">${totalDailyBudget}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">投放国家</p>
              <p className="text-sm font-bold">{brand.country}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">优化目标</p>
              <p className="text-sm font-bold truncate">{optimizationEvent.split(' ')[0]}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">AdSets 数量</p>
              <p className="text-sm font-bold">{localAdSets.length}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">覆盖商品数</p>
              <p className="text-sm font-bold">{selectedProducts.length}</p>
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
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AD SET</p>
                       <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded uppercase">{adSet.audienceType}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800">{adSet.name}</h4>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {adSet.ads.map((ad, aIdx) => {
                  const product = selectedProducts.find(p => p.id === ad.productId);
                  return (
                    <div key={aIdx} className="group relative">
                      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-indigo-200">
                        <div className="p-4 bg-white border-b border-slate-50">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">{brand.name.charAt(0)}</div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-900">{brand.name}</p>
                              <p className="text-[8px] text-slate-400">Sponsored</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-700 leading-relaxed line-clamp-2">{ad.primaryText}</p>
                        </div>
                        <div className="aspect-square bg-slate-100 relative overflow-hidden"><img src={ad.imageUrl} className="w-full h-full object-cover" /></div>
                        <div className="p-4 bg-slate-50 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-slate-400 uppercase font-black truncate">{ad.destinationUrl.split('?')[0].split('/').slice(0,3).join('/')}</p>
                            <h6 className="text-[10px] font-black text-slate-900 truncate">{ad.headline}</h6>
                          </div>
                          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-800 shrink-0 uppercase tracking-tighter shadow-sm">{ad.cta}</div>
                        </div>
                        {product && (
                          <div className="p-2.5 bg-indigo-50/50 border-t border-indigo-100 flex items-center gap-2">
                             <img src={product.imageUrl} className="w-6 h-6 rounded-md object-cover border border-indigo-200" />
                             <div className="min-w-0 flex-1">
                               <p className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">关联商品</p>
                               <p className="text-[9px] font-bold text-indigo-900 truncate">{product.name}</p>
                             </div>
                             <Box size={10} className="text-indigo-300" />
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
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">结构方案</p>
                <p className="text-xl font-black">{localAdSets.length} Adsets • {localAdSets.reduce((acc, as) => acc + as.ads.length, 0)} Ads</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><DollarSign size={24} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">预估日消耗</p>
                <p className="text-2xl font-black text-emerald-400">${totalDailyBudget}</p>
              </div>
            </div>
          </div>
          <button onClick={onPublish} className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-base shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-3">
            <Rocket size={20} className="text-indigo-600" /> 立即发布方案
          </button>
        </div>
      </div>
    </div>
  );
};
