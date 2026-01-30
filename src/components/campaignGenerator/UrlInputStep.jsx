import React from 'react';
import { Sparkles, Search, Zap, ArrowRight } from 'lucide-react';

export const UrlInputStep = ({ url, setUrl, handleStartAnalysis, avatars }) => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#FAFAFA] flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-100">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-100/30 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-16 px-6 py-3 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
          <div className="flex -space-x-3">
            {avatars.map((avatar, index) => (
              <div key={avatar.id} className="relative group cursor-pointer" style={{ zIndex: avatars.length - index }}>
                <div className="w-12 h-12 rounded-full ring-4 ring-white shadow-sm overflow-hidden bg-white transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-indigo-200">
                  {avatar.isAi ? (
                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                      <Zap className="text-white w-5 h-5 fill-white animate-pulse" />
                    </div>
                  ) : (
                    <img src={avatar.img} alt="Expert" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="ml-4 px-3 py-1 bg-white/60 rounded-full text-[10px] font-bold text-indigo-600 tracking-wider border border-indigo-50">
            Expert AI assisted
          </div>
        </div>
        <div className="space-y-4 mb-16 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-tight flex items-center justify-center gap-x-4 text-center">
            <span className="opacity-95">Which</span> 
            <span className="relative text-indigo-600">
              page
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="opacity-95">would</span>
            <span className="opacity-95 font-light italic text-slate-400">you</span>
            <span className="opacity-95">like</span>
            <span className="opacity-95">to</span>
            <span className="relative">
              promote?
              <div className="absolute -right-6 -top-2 w-6 h-6 bg-yellow-400 rounded-full blur-xl opacity-20 animate-ping"></div>
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto font-medium leading-snug opacity-90 text-center">
            No landing page? No problem — you can use a social media page or any page that<br className="hidden md:block" />
            shows your product. Paste your link below to get started.
          </p>
        </div>
        <div className="w-full max-w-4xl px-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000 group-within:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-[1.8rem] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-2.5 transition-all duration-500 group-focus-within:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] group-focus-within:-translate-y-1">
              <div className="flex-1 flex items-center px-5 text-left">
                <Search className="w-6 h-6 text-slate-300 mr-4 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="https://your-page.com/product-link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full py-4 bg-transparent text-xl font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none text-left"
                />
              </div>
              <button onClick={handleStartAnalysis} className="px-10 py-4 bg-indigo-600 text-white rounded-[1.4rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-100 active:scale-95 group/btn overflow-hidden">
                <Sparkles className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
                <span>Deep Research</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="mt-8 flex justify-center items-center gap-4 text-[11px] font-bold tracking-wider text-slate-400 text-center">
            <span className="w-6 h-[1px] bg-slate-200"></span>
            <span className="text-center">Neural scan ready</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce text-center"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s] text-center"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s] text-center"></div>
            </div>
            <span className="w-6 h-[1px] bg-slate-200"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
