import React from 'react';
import { CheckCircle2, Users, Activity, ChevronDown, Sparkles, Search, DollarSign } from 'lucide-react';

export const AnalysisResultsStep = ({ onBack, onGenerate, LOGO_LINKS }) => {
  const personas = [
    { title: 'Beach fashion enthusiasts', age: '18-35', gender: '15% male, 85% female', details: 'Style-conscious women who actively...', interests: 'Swimsuit (apparel), Bikini (apparel), Summer (time), Beaches (places), Resort...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { title: 'Luxury travelers', age: '25-50', gender: '40% male, 60% female', details: 'High-income individuals seeking premium...', interests: 'First class, luxury resort, boutique hotel, private jet, fine dining...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { title: 'Outdoor adventurers', age: '20-40', gender: '60% male, 40% female', details: 'Active souls who spend weekends...', interests: 'Hiking, Camping gear, Patagonia, National parks, trail running...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper' },
    { title: 'Sustainability advocates', age: '22-45', gender: '30% male, 70% female', details: 'Conscious consumers looking for eco...', interests: 'Eco-friendly, zero waste, recycling, organic cotton, veganism...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { title: 'Digital nomads', age: '24-38', gender: '50% male, 50% female', details: 'Remote workers traveling while they...', interests: 'Remote work, coworking, Bali, Airbnb, travel insurance, MacBook...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilith' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 overflow-y-auto animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12 pb-32 relative min-h-screen flex flex-col">
        <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-700">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0"><CheckCircle2 className="w-6 h-6" /></div>
          <p className="text-green-800 font-medium text-sm md:text-base">🥳 All set! Your best ad strategy is ready. Review your goals below and start your campaign with one click!</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Users className="w-6 h-6 text-indigo-600" />Audience personas</h3>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full tracking-wider">5 segments found</span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {personas.map((persona, i) => (
              <div key={i} className="min-w-[320px] bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group flex flex-col h-[360px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[4rem] -z-10 group-hover:bg-indigo-100 transition-colors"></div>
                <h4 className="text-lg font-bold text-slate-900 truncate mb-4 pr-8 text-left">{persona.title}</h4>
                <div className="space-y-2.5 mb-5 flex-none">
                  <div className="flex text-[11px] items-center whitespace-nowrap"><span className="text-slate-400 w-12 text-left">Age:</span><span className="text-slate-900 font-bold text-left">{persona.age}</span><span className="mx-2 text-slate-200">|</span><span className="text-slate-400 w-14 text-left">Gender:</span><span className="text-slate-900 font-bold truncate text-left">{persona.gender}</span></div>
                  <div className="flex text-xs h-8 overflow-hidden"><span className="text-slate-400 w-12 shrink-0 text-left">Details:</span><span className="text-slate-600 italic leading-tight line-clamp-2 text-left">{persona.details}</span></div>
                </div>
                <div className="h-[1px] bg-slate-50 w-full mb-5 flex-none"></div>
                <div className="flex gap-3 h-24 overflow-hidden flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100"><img src={persona.img} alt="" className="w-full h-full object-cover" /></div>
                  <div className="space-y-1.5 flex-1 overflow-hidden text-left">
                    <span className="text-[9px] font-bold text-indigo-400 tracking-wider block text-left">Interests</span>
                    <p className="text-[11px] text-slate-500 leading-snug font-medium line-clamp-3 text-left">{persona.interests}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 overflow-hidden animate-in slide-in-from-bottom-8 duration-1000">
          <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 text-left"><Activity className="w-6 h-6" /></div>
            <div className="text-left"><h3 className="text-xl font-bold text-slate-900 text-left">Promotion objective</h3><p className="text-sm text-slate-400 text-left">Configure your final campaign settings</p></div>
          </div>
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left">Business type</label><div className="relative group text-left"><select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 appearance-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700 text-left"><option>Online shopping</option><option>SaaS platform</option><option>Lead generation</option></select><ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none group-focus-within:rotate-180 transition-transform" /></div></div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left">Your Business goal</label><div className="relative text-left"><select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 appearance-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700 text-sm text-left"><option>Sales</option><option>Leads</option><option>Traffic</option></select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" /></div></div>
                <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left">Performance goal</label><div className="relative text-left"><select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 appearance-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700 text-sm text-left"><option>In-web actions</option><option>Maximize reach</option><option>Lower CPA</option></select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" /></div></div>
              </div>
              <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left text-left">Ad platform</label><div className="relative flex items-center bg-slate-50 rounded-2xl px-6 py-4 text-left"><div className="flex items-center gap-2 flex-1 text-left"><img src={LOGO_LINKS.meta} className="w-6 h-6 rounded-md object-contain" alt="Meta" /><span className="font-semibold text-slate-700 text-left">Meta</span></div><div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 text-left"><Sparkles className="w-3 h-3 text-indigo-600" /><span className="text-[10px] font-bold text-indigo-600 tracking-wider text-left">Recommended</span></div><ChevronDown className="ml-4 w-5 h-5 text-slate-300" /></div></div>
              <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left text-left">Target locations</label><div className="relative flex items-center bg-slate-50 rounded-2xl px-6 py-4 text-left"><div className="flex flex-wrap gap-2 flex-1 text-left"><span className="bg-white px-3 py-1 rounded-lg border border-slate-100 text-sm font-medium text-slate-700 flex items-center gap-2 text-left">United States<button className="text-slate-300 hover:text-rose-500 text-left">×</button></span></div><Search className="ml-4 w-5 h-5 text-slate-300" /></div></div>
              <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left text-left">Suggested daily limit</label><div className="relative flex items-center bg-slate-50 rounded-2xl px-6 text-left"><input type="number" defaultValue="45" className="bg-transparent border-none py-4 px-0 w-full focus:ring-0 font-bold text-slate-900 text-xl text-left" /><div className="h-6 w-[1px] bg-slate-200 mx-4 text-left"></div><span className="font-bold text-slate-400 tracking-wider text-left">USD</span></div></div>
              <div className="space-y-3 text-left"><label className="text-sm font-bold text-slate-900 ml-1 text-left text-left">Promotion type</label><div className="relative text-left"><select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 appearance-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700 text-left"><option>Long-term</option><option>Fixed term</option><option>Dynamic</option></select><ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" /></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-[260px] right-0 h-24 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-between px-12 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] text-left">
        <button onClick={onBack} className="px-10 py-3 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wider hover:bg-slate-200 transition-all border border-slate-100 text-left">Previous</button>
        <button onClick={onGenerate} className="absolute left-1/2 -translate-x-1/2 px-20 py-4 bg-gradient-to-r from-indigo-600 to-purple-800 text-white rounded-full text-sm font-bold tracking-wide shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0.5 transition-all text-left">Generate campaign</button>
        <div className="w-[120px] text-left"></div>
      </div>
    </div>
  );
};
