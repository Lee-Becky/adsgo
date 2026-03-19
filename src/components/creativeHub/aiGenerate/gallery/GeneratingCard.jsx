import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { productImg, resultImg } from '../constants';

const PROGRESS_MSGS = [
  'Nano banana is creating magic...',
  'Composing layout...',
  'Applying style...',
  'Rendering assets...',
  'Almost there...',
];

export default function GeneratingCard({ batch }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [remaining, setRemaining] = useState(3);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % PROGRESS_MSGS.length);
    }, 1200);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const timeInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      setRemaining(Math.max(0, Math.ceil((3000 - elapsed) / 1000)));
    }, 500);
    return () => clearInterval(timeInterval);
  }, []);

  const sourceImgUrl = productImg(batch.product.productIdx, batch.image.selectedIdx);

  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50/30 overflow-hidden fade-in-up">
      {/* Header */}
      <div className="px-4 py-3 border-b border-primary-100 flex items-center gap-2">
        <img src={sourceImgUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{batch.product.name}</p>
          <p className="text-[10px] text-gray-400">{batch.template.styleName} &middot; Generating...</p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-100 text-primary-600 border border-primary-200">
          <Loader2 className="animate-spin h-3 w-3 mr-1" /> Processing
        </span>
      </div>

      {/* Animation area */}
      <div className="p-6 flex flex-col items-center">
        <div className="flex items-center gap-5 mb-5">
          {/* Source image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-md flex-shrink-0">
            <img src={sourceImgUrl} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Particles left */}
          <div className="relative w-8 h-1">
            <div className="particle" style={{ top: '-2px', animationDelay: '0s' }} />
            <div className="particle" style={{ top: '-2px', animationDelay: '0.7s' }} />
          </div>

          {/* Nano banana mascot */}
          <div className="relative flex-shrink-0 float-anim">
            <div className="absolute -inset-2 rounded-full bg-primary-300/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg relative z-10 glow-pulse">
              <span className="text-lg">&#x1F34C;</span>
            </div>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary-500 whitespace-nowrap">
              Nano banana
            </span>
          </div>

          {/* Particles right */}
          <div className="relative w-8 h-1">
            <div className="particle" style={{ top: '-2px', animationDelay: '0.3s' }} />
            <div className="particle" style={{ top: '-2px', animationDelay: '1s' }} />
          </div>

          {/* Result placeholder */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-md flex-shrink-0 relative">
            <img src={resultImg(0, 300, 300)} alt="" className="w-full h-full object-cover blur-sm opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-primary-300/20 flex items-center justify-center">
              <Loader2 className="animate-spin w-5 h-5 text-primary-400" />
            </div>
          </div>
        </div>

        <p className="text-xs font-medium text-gray-600">{PROGRESS_MSGS[msgIdx]}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">~{remaining}s remaining</p>

        {/* Skeleton grid */}
        <div className="grid grid-cols-4 gap-2 mt-4 w-full max-w-xs">
          {[0, 0.15, 0.3, 0.45].map((delay, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" style={{ animationDelay: `${delay}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
