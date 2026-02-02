import React, { useState, useEffect } from 'react';
import { 
  X, Check, ChevronRight, Loader2, 
  Layout, Target, Rocket, Sparkles,
  ArrowRight, AlertCircle, RefreshCw
} from 'lucide-react';
import ObjectiveSection from '../brand/optimizeGoals/ObjectiveSection';
import BudgetKPISection from '../brand/optimizeGoals/BudgetKPISection';

const PublishCampaignModal = ({ isOpen, onClose, LOGO_LINKS, onComplete, publishConfig }) => {
  const [step, setStep] = useState(1);
  const [connectedPlatform, setConnectedPlatform] = useState(null); // 'meta' or 'google'
  const [isConnecting, setIsConnecting] = useState(false);
  const [platforms, setPlatforms] = useState({
    meta: { connected: false, email: 'alex.designer@meta.com' },
    google: { connected: false, email: 'alex.growth@google.com' }
  });

  // Step 2 selections
  const [selections, setSelections] = useState({
    adAccount: '',
    fbPage: '',
    pixel: '',
    event: '',
    conversionDataset: ''
  });

  // Step 3 progress
  const [publishProgress, setPublishProgress] = useState([
    { id: 1, name: 'Campaign #1 - US Market', status: 'Publishing' },
    { id: 2, name: 'Campaign #2 - EU Market', status: 'Waiting' },
    { id: 3, name: 'Campaign #3 - Retargeting', status: 'Waiting' },
    { id: 4, name: 'Campaign #4 - Lookalike', status: 'Waiting' },
    { id: 5, name: 'Campaign #5 - Brand Awareness', status: 'Waiting' },
  ]);

  // Step 4 data (mocking the brand optimize goal data structure)
  const [brandGoalData, setBrandGoalData] = useState({
    campaignObjective: 'sales_conversions',
    adsetGoal: 'in_web_actions',
    event: 'Purchase',
    marketGroups: [
      {
        id: '1',
        targetLocations: ['United States'],
        budgetMode: 'unified',
        unifiedBudget: '500',
        kpiType: 'ROAS',
        kpiMode: 'unified',
        unifiedKPI: ''
      }
    ]
  });

  // Sync data from publishConfig when step 4 is reached or modal opens
  useEffect(() => {
    if (isOpen && publishConfig) {
      setBrandGoalData(prev => ({
        ...prev,
        // Map common objectives if possible, otherwise default to sales_conversions
        campaignObjective: 'sales_conversions',
        adsetGoal: 'in_web_actions',
        event: publishConfig.event || 'Purchase',
        marketGroups: [
          {
            ...prev.marketGroups[0],
            targetLocations: publishConfig.locations || ['United States'],
            unifiedBudget: publishConfig.budget?.toString() || '500',
            unifiedKPI: '' // Keep empty for user selection
          }
        ]
      }));
    }
  }, [isOpen, publishConfig]);

  const [validation, setValidation] = useState({
    objective: true,
    marketGroups: true
  });

  useEffect(() => {
    if (step === 3) {
      let currentIdx = 0;
      const interval = setInterval(() => {
        setPublishProgress(prev => prev.map((item, idx) => {
          if (idx === currentIdx) return { ...item, status: Math.random() > 0.1 ? 'Success' : 'Failure' };
          if (idx === currentIdx + 1) return { ...item, status: 'Publishing' };
          return item;
        }));
        currentIdx++;
        if (currentIdx === 5) {
          clearInterval(interval);
          setTimeout(() => setStep(4), 1500);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleConnect = (platform) => {
    setIsConnecting(platform);
    setTimeout(() => {
      setPlatforms(prev => ({
        ...prev,
        [platform]: { ...prev[platform], connected: true }
      }));
      setIsConnecting(false);
      setConnectedPlatform(platform);
    }, 3000);
  };

  const handleDisconnect = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: { ...prev[platform], connected: false }
    }));
    if (connectedPlatform === platform) setConnectedPlatform(null);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        {/* Meta Card */}
        <div className="relative overflow-hidden group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-50 p-2.5 flex items-center justify-center border border-slate-100">
              <img src={LOGO_LINKS.meta} alt="Meta" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Meta Ads</h3>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest">Social media platform</p>
            </div>
          </div>
          
          {platforms.meta.connected ? (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                <p className="text-[10px] font-bold text-indigo-400 mb-1">Connected account</p>
                <p className="text-xs font-black text-indigo-900">{platforms.meta.email}</p>
              </div>
              <button 
                onClick={() => handleDisconnect('meta')}
                className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleConnect('meta')}
              disabled={!!isConnecting}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-50"
            >
              Connect
            </button>
          )}

          {isConnecting === 'meta' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
              <Loader2 size={32} className="text-indigo-600 animate-spin mb-3" />
              <p className="text-xs font-black text-slate-900 animate-pulse">Fetching your assets...</p>
            </div>
          )}
        </div>

        {/* Google Card */}
        <div className="relative overflow-hidden group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-50 p-2.5 flex items-center justify-center border border-slate-100">
              <img src={LOGO_LINKS.google} alt="Google" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Google Ads</h3>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest">Search & display network</p>
            </div>
          </div>
          
          {platforms.google.connected ? (
            <div className="space-y-4">
              <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50">
                <p className="text-[10px] font-bold text-amber-500 mb-1">Connected account</p>
                <p className="text-xs font-black text-amber-900">{platforms.google.email}</p>
              </div>
              <button 
                onClick={() => handleDisconnect('google')}
                className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleConnect('google')}
              disabled={!!isConnecting}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-50"
            >
              Connect
            </button>
          )}

          {isConnecting === 'google' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
              <Loader2 size={32} className="text-indigo-600 animate-spin mb-3" />
              <p className="text-xs font-black text-slate-900 animate-pulse">Fetching your assets...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const isMeta = connectedPlatform === 'meta';
    const canPublish = isMeta 
      ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
      : (selections.adAccount && selections.conversionDataset && selections.event);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
          {/* Ad Account Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest">Select ad account</label>
            <select 
              value={selections.adAccount}
              onChange={(e) => setSelections({...selections, adAccount: e.target.value})}
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select an account...</option>
              <option value="1">Main Business Account (129-382-991)</option>
              <option value="2">Backup Marketing (442-110-872)</option>
            </select>
          </div>

          {isMeta ? (
            <>
              {selections.adAccount && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest">Facebook page</label>
                  <select 
                    value={selections.fbPage}
                    onChange={(e) => setSelections({...selections, fbPage: e.target.value})}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select a page...</option>
                    <option value="1">Eco-Friendly Brand</option>
                    <option value="2">Daily Lifestyle Store</option>
                  </select>
                </div>
              )}
              {selections.fbPage && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest">Tracking pixel</label>
                  <select 
                    value={selections.pixel}
                    onChange={(e) => setSelections({...selections, pixel: e.target.value})}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select a pixel...</option>
                    <option value="1">Primary Web Pixel (Active)</option>
                  </select>
                </div>
              )}
              {selections.pixel && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest">Optimization event</label>
                  <select 
                    value={selections.event}
                    onChange={(e) => setSelections({...selections, event: e.target.value})}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select an event...</option>
                    <option value="purchase">Purchase</option>
                    <option value="add_to_cart">Add to Cart</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              {selections.adAccount && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest">Conversion dataset</label>
                  <select 
                    value={selections.conversionDataset}
                    onChange={(e) => setSelections({...selections, conversionDataset: e.target.value})}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select a dataset...</option>
                    <option value="1">Primary Conversions</option>
                    <option value="2">Secondary Goals</option>
                  </select>
                </div>
              )}
              {selections.conversionDataset && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest">Optimization event</label>
                  <select 
                    value={selections.event}
                    onChange={(e) => setSelections({...selections, event: e.target.value})}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select an event...</option>
                    <option value="sales">Sales</option>
                    <option value="signup">Signup</option>
                  </select>
                </div>
              )}
            </>
          )}

          {!canPublish && selections.adAccount && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold animate-pulse">
              <AlertCircle size={14} />
              Please complete all required selections to proceed
            </div>
          )}
        </div>

        <button 
          onClick={() => setStep(3)}
          disabled={!canPublish}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-30 disabled:grayscale"
        >
          Publish now
          <Rocket size={18} />
        </button>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Pushing campaigns</h3>
            <p className="text-[11px] font-bold text-slate-400 tracking-widest mt-1">Status: {publishProgress.filter(p => p.status === 'Success').length}/5 Completed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <Loader2 size={24} className="text-indigo-600 animate-spin" />
          </div>
        </div>

        <div className="space-y-3">
          {publishProgress.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  p.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                  p.status === 'Failure' ? 'bg-red-50 text-red-600' :
                  p.status === 'Publishing' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'
                }`}>
                  {p.status === 'Success' ? <Check size={20} /> :
                   p.status === 'Failure' ? <AlertCircle size={20} /> :
                   p.status === 'Publishing' ? <Loader2 size={20} className="animate-spin" /> :
                   <Layout size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
                  <p className={`text-[10px] font-black tracking-widest ${
                    p.status === 'Success' ? 'text-emerald-500' :
                    p.status === 'Failure' ? 'text-red-500' :
                    p.status === 'Publishing' ? 'text-indigo-500' : 'text-slate-400'
                  }`}>
                    {p.status}
                  </p>
                </div>
              </div>
              {p.status === 'Failure' && (
                <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col items-center text-center space-y-2 mb-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
          <Check size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Deployment successful!</h3>
        <p className="text-sm font-medium text-slate-500">Confirm your brand's optimize goal to activate AI optimization</p>
      </div>

      <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Objective Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transform transition-all hover:shadow-md">
          <ObjectiveSection 
            formData={brandGoalData}
            updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))}
            validation={validation}
            setValidation={setValidation}
          />
        </div>

        {/* Budget & KPI Card */}
        <div className="transform transition-all hover:shadow-md">
          <BudgetKPISection 
            formData={brandGoalData}
            updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))}
            updateFormDataDeep={(updates) => setBrandGoalData(p => ({...p, ...updates}))}
            validation={validation}
            setValidation={setValidation}
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={onComplete}
          className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl text-base font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-emerald-200/50"
        >
          Confirm strategy & finish
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Content */}
      <div className={`relative bg-white w-full ${step === 4 ? 'max-w-4xl' : 'max-w-xl'} rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden`}>
        
        {/* Header */}
        <div className="px-10 pt-10 pb-6 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                step === 1 ? 'bg-indigo-50 text-indigo-600' :
                step === 2 ? 'bg-purple-50 text-purple-600' :
                step === 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                Step {step} of 4
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${
                    i < step ? 'w-4 bg-emerald-500' : i === step ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'
                  }`} />
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {step === 1 && 'Connect ad platform'}
              {step === 2 && 'Select your assets'}
              {step === 3 && 'Publishing status'}
              {step === 4 && 'Confirm brand optimize goal'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Step 1 Footer */}
        {step === 1 && (
          <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
            <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-6 py-2 transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => setStep(2)}
              disabled={!connectedPlatform}
              className="px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-30 flex items-center gap-2"
            >
              Select account
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishCampaignModal;
