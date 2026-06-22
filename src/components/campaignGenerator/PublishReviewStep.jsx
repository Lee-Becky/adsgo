import React, { useState } from 'react';
import { 
  ChevronLeft, Layout, Users, MousePointer2, 
  Sparkles, Edit3, CheckCircle2, ChevronRight, 
  Info, Globe, Target, Zap, Edit2
} from 'lucide-react';
import EditAdModal from './EditAdModal';
import EditAdsetDrawer from './EditAdsetDrawer';

export const PublishReviewStep = ({ config, LOGO_LINKS, onBack, onPublish }) => {
  const [editingAd, setEditingAd] = useState(null); // { campaignIdx, adsetIdx, adIdx, data }
  const [isAdsetDrawerOpen, setIsAdsetDrawerOpen] = useState(false);
  const { 
    campaignCount = 1, 
    adsetsCount = 1, 
    adsPerSet = 1, 
    budget = 0, 
    budgetType = 'CBO',
    totalCreatives = 0,
    creatives = []
  } = config || {};

  const adsCountPerAdset = adsPerSet === 'dynamic' ? totalCreatives : Number(adsPerSet);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1300px] mx-auto p-6 space-y-10">
        
        {/* Campaigns List */}
        <div className="space-y-20 relative">
          {[...Array(campaignCount)].map((_, ci) => (
            <div key={ci} className="relative group">
              {/* Campaign Icon - Floating Left */}
              <div className="absolute -left-10 top-0 flex flex-col items-center h-full">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-xl relative z-20 group-hover:scale-110 transition-transform duration-500">
                  <Layout size={20} strokeWidth={2.5} />
                </div>
                {ci < campaignCount - 1 && (
                  <div className="w-px flex-1 bg-neutral-200 my-2 opacity-50" />
                )}
              </div>

              {/* Campaign Content Area */}
              <div className="space-y-8 pl-2">
                {/* Identifier Header with Horizontal Divider Line */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-neutral-200/60" />
                  <div className="px-8 py-2.5 bg-neutral-900 text-white rounded-full text-[11px] font-black tracking-wider shadow-lg flex items-center gap-2.5 animate-in slide-in-from-right-8 duration-700">
                    Campaign #{ci + 1} • {budgetType} ${budget}
                  </div>
                </div>

                {/* Adsets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(adsetsCount)].map((_, ai) => (
                    <div key={ai} className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 animate-in slide-in-from-bottom-6 min-w-[320px]" style={{ animationDelay: `${ai * 80}ms` }}>
                      {/* Adset Header */}
                      <div className="p-6 border-b border-neutral-50 flex items-start justify-between bg-white relative z-10">
                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 shadow-sm">
                            <Users size={18} />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <p className="text-[9px] font-bold text-neutral-400 tracking-wider leading-none">Adset #{ai + 1}</p>
                            <h4 className="text-[13px] font-black text-neutral-800 truncate leading-tight">LAL 1% US Purchase - {ai + 1}</h4>
                          </div>
                        </div>
                        <div className="text-[8px] font-bold text-neutral-400 bg-neutral-50/80 px-2 py-1 rounded-full border border-neutral-100 whitespace-nowrap shrink-0">18-65 • All</div>
                      </div>

                      {/* Ads Grid - Height naturally expands, no scrollbar */}
                      <div className="p-6 flex-1 bg-neutral-50/20">
                        <div className="grid grid-cols-2 gap-4">
                          {[...Array(adsCountPerAdset)].map((_, adi) => (
                            <div key={adi} className="group/ad relative bg-white rounded-xl border border-neutral-100 p-2 shadow-sm hover:shadow-xl transition-all duration-300">
                              <div className="aspect-[4/5] rounded-[0.8rem] bg-neutral-100 overflow-hidden relative mb-3">
                                <img 
                                  src={creatives[adi % creatives.length]?.url || `https://picsum.photos/seed/ad-${adi}/300/400`} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover/ad:scale-110" 
                                  alt="" 
                                />
                                <div className="absolute top-1.5 right-1.5 bg-neutral-900/70 backdrop-blur-md text-[7px] font-black text-white px-1.5 py-0.5 rounded tracking-tighter shadow-lg ring-1 ring-white/20">Ad #{adi + 1}</div>
                                
                                {/* Edit Overlay on Hover */}
                                <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover/ad:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingAd({
                                        campaignIdx: ci,
                                        adsetIdx: ai,
                                        adIdx: adi,
                                        data: {
                                          imageUrl: creatives[adi % creatives.length]?.url || `https://picsum.photos/seed/ad-${adi}/300/400`,
                                          headlines: [`Winning Style #${adi + 1}`],
                                          descriptions: ['Premium collection for your lifestyle.'],
                                          cta: 'Shop Now'
                                        }
                                      });
                                    }}
                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-900 shadow-xl pointer-events-auto active:scale-90 transition-transform"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <div className="px-1 space-y-1 pb-0.5">
                                <p className="text-[10px] font-bold text-neutral-800 truncate leading-none">Winning style #{adi + 1}</p>
                                <div className="flex items-center gap-1 opacity-40 group-hover/ad:opacity-100 transition-opacity">
                                  <MousePointer2 size={8} className="text-primary-500" />
                                  <span className="text-[8px] font-bold text-neutral-500 tracking-tight">CTA: Shop now</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Adset Footer */}
                      <div className="px-6 py-3 bg-white border-t border-neutral-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary-600">
                          <Sparkles size={12} className="animate-pulse" />
                          AI optimized
                        </div>
                        <button 
                          onClick={() => setIsAdsetDrawerOpen(true)}
                          className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 hover:text-primary-600 transition-all group/edit"
                        >
                          Edit
                          <Edit3 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Ad Modal */}
      <EditAdModal 
        isOpen={!!editingAd}
        onClose={() => setEditingAd(null)}
        adData={editingAd?.data}
        allCreatives={creatives}
        onSave={(updatedData) => {
          console.log('Updated Ad:', updatedData);
          setEditingAd(null);
        }}
      />

      <EditAdsetDrawer 
        isOpen={isAdsetDrawerOpen}
        onClose={() => setIsAdsetDrawerOpen(false)}
        onSave={() => {
          console.log('Adset changes saved');
          setIsAdsetDrawerOpen(false);
        }}
      />

      {/* Sticky Bottom Bar - Centered Horizontal Layout */}
      <div className="fixed bottom-0 left-[260px] right-0 h-24 bg-white backdrop-blur-3xl border-t border-neutral-100 flex items-center justify-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <button 
          onClick={onBack}
          className="absolute left-10 flex items-center gap-2 px-5 py-2.5 text-neutral-400 hover:text-neutral-900 font-bold transition-all group hover:bg-neutral-50 rounded-xl"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs">Previous</span>
        </button>
        
        <div className="flex items-center gap-10 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
              {campaignCount} {campaignCount > 1 ? 'Campaigns' : 'Campaign'} * (1:{adsetsCount}:{adsPerSet === 'dynamic' ? totalCreatives : adsPerSet})
            </span>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-2xl font-black text-neutral-900 tracking-tighter">
                ${config?.estimatedDailyBudget || 0}
              </span>
              <span className="text-[10px] font-bold text-neutral-400">/ Day</span>
            </div>
          </div>
          
          <button 
            onClick={onPublish}
            className="px-20 py-4 bg-neutral-900 text-white rounded-full text-sm font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98] group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            Publish
            <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
