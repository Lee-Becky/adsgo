import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Zap, ArrowRight, Edit3, Save, MapPin, Globe, Target, ChevronRight, Settings2, Grid } from 'lucide-react';
import CreateBrandModal from '../brand/CreateBrandModal';
import SaveConfirmationModal from './SaveConfirmationModal';
import SelectProductModal from './SelectProductModal';

export const UrlInputStep = ({ url, setUrl, handleStartAnalysis, avatars, isFirstGeneration, firstGeneratedUrl, savedConfig }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false); // Reset to false to ensure user goes through confirm flow each time
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const BRAND_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAeJSURBVHgB5Vtdcts2EF5Qdmo7Tsc5QekTxH+d6aN8gsYnsHOC0CeodALR0wM4uUHy0j7aj52pHbuvfTFzgVhNIluyRKC7C1IiJYAEZXqSSb6JIhEESHxY7GKxCwN8JxBQMw63b14qUBv4aB+U8pO3+BDfPQ0vn3ZNbYKd3oWuKyL8UJ0utolgNGjb2lTFAtQMJBngl0+/csO4tLQGRMDcaCOpvMHtdBkgyUOoCR7UDhUZi0dEfhbBxvUamFGLJFM8AFF4bywVsW+uvmQmSlO3RjwEUcv09MyEFka+sVzram2on6iwdVCZiSpr+X9QI5yJBlu3vwW/3PqlFaVFR5X3k7FceD6YG0RQ1qemWgu2e8cFej6GE1FaMkDIFgzlFREurCykRaLyqaWBRUeLp26wc9uET70r/HkACz8U9wkciJIUcckIJx2QrWD75sQqXc+LjOUCzBK1TV2LjrIUt246oOTJeJCUClCyz6EA5RId0gNnetek8mDr88Fs/YZtrbQQ8mwDEE0XaSneXIDgtXoax0WqVUg02OrRlPAtt32cXsesI7kX9G1TzkJUWqau1833BVWGpWjtzxoM1bHlXolERfyPdssKccDSpdEG9ma0C2foiNFoCIuOLuh1lAaRVIVtRBmEfGu7VUg0PP/xDcRiF+fRKRTDp9HOGCqzVJcMzoGySKjf77IRHMYXrCqFQGHEajM8Ww2tNcARwc6nFi4RpdYNESXf/swdb3Ez/PvRZe652z1lfow4LSdIUEcQP26Fl8VWutLuJdhAXWwo1JNkV1Ide+H54zf558krmAsoRRG/CM+enLrUruQZhZfLUXi+so660IZ54E0tJVb3rxSoUsubriT51TAH8AUtJLvrYKjyUMKH+wH3qeoQZ8Ve2VSdRo4ou3kzy4UZPJraUL0GV0w7B1L44AqBOht7hQansHn6g8kNc/ryCha9dvjXclT2EHYcBBmqAt2ljo7kYXi5OjZGWkfjFt7ch8JeohTnJDh+xPilKEmgNXEWToSTTuMzRHPqVhcleRi+W31lbbv9Ed23hc7sQNGyIfeygzMvmKhBmqaqpyiVdni2fFpUK7MMoT7JIxithq76lJ8ZbsuGKzRRcvUEtBzbRCihdqGENrSOk5WGiuC2aI2rWFQXaKLuzkAWpYS/Jkx01NUwzIIJw6PGqYvh+lKY8Yw04RFugxq/VvSAIvzgEnB3WFcstk5YXUAm7MXN0mVjGoveuqtk/wjjznAgXw76StzdKrjrK3VHv/Fbl0kqww8k3woG9Bn2YBBfq4H8IAbxB+jT7/gay/BaXuP1B9DX+JHdN93Rv3tWz4jdPdQ/dvmUelHZC3KBUM/TcLXACy6BTOhbCP2hsDj/E5PoNjXhK0GVBSRt0gq6Ot9nJ8XJBcwRFnDvNY3w5+/DJn75iqlgn4USMCFM/09opFQ0OQUpYTEmlaVIz6BnCpVyhaq+rtdAw1PPura46O0L7jkFDqWYZCKoiP8XQqUkxlQVM6DBESLhxkXA5MX4GZoqD6Auc8q9cPRAKQplNKEGnBwrXw4VWXfsTioBGn8ltPxIYkpkNqoKkomsEiI8AmI81TVlfgBXSwQPY0EXEk08lf26CKZoADRjkiL3Tc9OzSQtIkaC52k6hSEhz7/4WqXzPZnbmquuq6krnsZJ6+lOUDgRPvYxjhsH1pirHajLj1/AV4iJwzA/wco+7ZdA4uvSFIXOt0gwRUZHnUmWEgx+/rwBjUZ3HpeQZ9anm2Y2tlQHsvvRa7AGmUFvnKV8XebEJ6l9vUlWXgtk/8jVJdRtKX6Lgy5EWGdqf0LUto";

  // Ensure we map location labels to the format expected by CreateBrandModal (objects with {value, label})
  const initialTargetLocations = savedConfig?.locations?.map(locName => ({
    value: locName.toLowerCase().replace(/\s+/g, '-'), // fallback value generation
    label: locName
  })) || [{ value: 'us', label: 'United States' }];

  const mockInitialData = {
    name: 'AdsGo.ai',
    url: firstGeneratedUrl || url || '',
    logo: { url: BRAND_LOGO_BASE64 },
    campaignObjective: savedConfig?.objective || 'sales_conversions',
    adsetGoal: savedConfig?.adsetGoal || 'in_web_actions',
    event: savedConfig?.event || 'Purchase',
    marketGroups: [
      {
        id: '1',
        targetLocations: initialTargetLocations,
        budgetMode: 'unified',
        unifiedBudget: savedConfig?.dailyLimit || '45',
        kpiType: 'ROAS',
        kpiMode: 'unified',
        unifiedKPI: ''
      }
    ]
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-[#FAFAFA] flex flex-col items-center p-8 font-sans selection:bg-indigo-100 custom-scrollbar">
      {/* Brand Info Card - Inline instead of absolute to prevent overlap */}
      {!isFirstGeneration && (
        <div className="w-full max-w-5xl z-50 animate-in slide-in-from-top-4 duration-500 mb-12">
          <div className={`relative border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] p-6 flex items-center justify-between gap-8 transition-all duration-1000 overflow-hidden ${isSaved ? 'bg-white/80 backdrop-blur-xl' : 'bg-blue-50/40 animate-pulse border-blue-100/50 shadow-blue-100/20'}`}>
            {/* Breathing background fill for non-saved state */}
            {!isSaved && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-sky-100/20 to-blue-100/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            )}
            
            <div className="relative z-10 flex items-center gap-8 flex-1 min-w-0">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 overflow-hidden shrink-0">
                  <img src={BRAND_LOGO_BASE64} alt="AdsGo.ai" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-none">AdsGo.ai</span>
                  <div className="flex items-center gap-1.5 mt-1 text-indigo-600">
                    <Globe className="w-3 h-3" />
                    <span className="text-[10px] font-bold truncate max-w-[120px]">{firstGeneratedUrl || url || 'brand-url.com'}</span>
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200/50 hidden md:block" />

              {/* Conversion Event */}
              <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
                <div className="flex flex-col shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">Conversion Event</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Sparkles size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {savedConfig?.adsetGoal === 'in_web_actions' ? 'In-web actions' : 
                       savedConfig?.adsetGoal === 'leads_landing_page' ? 'Leads landing-page' : 
                       savedConfig?.adsetGoal || 'In-web actions'}
                    </span>
                    {savedConfig?.event && (
                      <>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-xs font-bold text-indigo-600">{savedConfig.event}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200/50 hidden lg:block" />

              {/* Locations */}
              <div className="hidden lg:flex flex-col shrink-0">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">Locations</span>
                <div className="flex items-center gap-1.5 mt-0.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold">
                    {savedConfig?.locations?.[0] || 'United States'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex items-center gap-2 shrink-0">
              {!isSaved ? (
                <>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsConfirmOpen(true)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/brandCenter/optimizeGoals')}
                  className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100 active:scale-95 group shadow-sm"
                >
                  <Settings2 className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-500" />
                  Go Modify
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal with Mock Data */}
      <CreateBrandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(updatedBrand) => {
          console.log('Brand updated:', updatedBrand);
          // When creating from modal, also trigger confirmation
          setIsConfirmOpen(true);
        }}
        initialData={mockInitialData}
      />

      {/* Save Confirmation Modal */}
      <SaveConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsSaved(true);
          setIsConfirmOpen(false);
          setIsModalOpen(false);
        }}
        brandUrl={firstGeneratedUrl || url}
      />

      {/* Select Product Modal */}
      <SelectProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelect={(id) => {
          console.log('Product selected:', id);
          setIsProductModalOpen(false);
        }}
      />

      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-100/30 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none"></div>
      
      {/* Centered Content Container */}
      <div className={`relative z-10 w-full max-w-7xl flex flex-col items-center text-center ${!isFirstGeneration ? 'mt-4' : 'mt-24'}`}>
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
          <div className="mt-8 flex flex-col items-center gap-6">
            {!isFirstGeneration && (
              <button 
                onClick={() => setIsProductModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all shadow-sm active:scale-95 group"
              >
                <Grid className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                Choose Existing Product
              </button>
            )}

            <div className="flex justify-center items-center gap-4 text-[11px] font-bold tracking-wider text-slate-400 text-center">
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
    </div>
  );
};
