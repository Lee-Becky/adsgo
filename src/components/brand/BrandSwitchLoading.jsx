import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const BrandSwitchLoading = ({ brandName }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={40} className="text-primary-600 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
          Switching to {brandName}
        </h2>
        <div className="flex items-center justify-center gap-2 text-neutral-400 font-bold text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Synchronizing brand data and assets...</span>
        </div>
      </div>

      <div className="mt-12 w-48 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-600 rounded-full animate-progress-loading"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress-loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-progress-loading {
          animation: progress-loading 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default BrandSwitchLoading;
