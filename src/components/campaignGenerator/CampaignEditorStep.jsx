import React from 'react';
import { MessageSquare } from 'lucide-react';

export const CampaignEditorStep = ({ onBack }) => {
  return (
    <div className="fixed inset-0 top-[64px] left-[260px] bg-[#F8FAFC] flex flex-col font-sans overflow-hidden z-10 animate-in fade-in duration-500">
      {/* Main Content Area - Image covers the full width */}
      <div className="flex-1 overflow-y-auto bg-white">
        <img 
          src="/publish.png" 
          alt="Publish Campaign" 
          className="w-full h-auto block"
        />
      </div>

      {/* Footer Actions */}
      <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-between px-12 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] shrink-0 relative">
        <button 
          onClick={onBack} 
          className="px-10 py-3 bg-slate-50 text-slate-500 rounded-full text-[11px] font-bold hover:bg-slate-100 transition-all border border-slate-100"
        >
          Previous
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button className="px-24 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-800 text-white rounded-full text-sm font-bold tracking-wider shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0.5 transition-all">
            Publish
          </button>
          <button className="px-10 py-3 bg-slate-50 text-slate-500 rounded-full text-[11px] font-bold hover:bg-slate-100 transition-all border border-slate-100">
            Save draft
          </button>
        </div>

      </div>
    </div>
  );
};
