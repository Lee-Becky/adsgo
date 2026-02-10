import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Check, ChevronRight, Loader2, 
  Layout, Target, Rocket, Sparkles,
  ArrowRight, AlertCircle, RefreshCw,
  ChevronDown, Search
} from 'lucide-react';
import ObjectiveSection from '../brand/optimizeGoals/ObjectiveSection';
import BudgetKPISection from '../brand/optimizeGoals/BudgetKPISection';

const PublishCampaignModal = ({ isOpen, onClose, LOGO_LINKS, onComplete, publishConfig }) => {
  console.log('PublishCampaignModal Root - publishConfig:', publishConfig);
  const [step, setStep] = useState(1); // Main modal steps: 1-4
  const [showAccountChoice, setShowAccountChoice] = useState(false); // Independent modal
  const [selectedAccountType, setSelectedAccountType] = useState(null); // 'own' or 'adsgo'
  const [showAdsgoReminder, setShowAdsgoReminder] = useState(false); // Show reminder when selecting adsgo
  const [hideMainModal, setHideMainModal] = useState(false); // Hide main modal when adsgo is selected
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

  const [activeDropdown, setActiveDropdown] = useState(null); // 'adAccount', 'fbPage', etc.

  // Step 3 progress
  const [publishProgress, setPublishProgress] = useState([
    { id: 1, name: 'Campaign #1 - US Market', status: 'Publishing' },
    { id: 2, name: 'Campaign #2 - EU Market', status: 'Waiting' },
    { id: 3, name: 'Campaign #3 - Retargeting', status: 'Waiting' },
    { id: 4, name: 'Campaign #4 - Lookalike', status: 'Waiting' },
    { id: 5, name: 'Campaign #5 - Brand Awareness', status: 'Waiting' },
  ]);

  // Step 4 data initialization
  const initialBrandGoalData = useMemo(() => {
    console.log('PublishCampaignModal - Syncing brandGoalData. Raw publishConfig:', publishConfig);
    
    // Determine locations with multiple fallbacks
    let rawLocations = publishConfig?.locations || publishConfig?.targetLocations || ['United States'];
    if (!Array.isArray(rawLocations) || rawLocations.length === 0) rawLocations = ['United States'];

    const finalLocations = rawLocations.map(loc => {
      if (typeof loc === 'string') return { value: loc.toLowerCase(), label: loc };
      return loc; // Already an object
    });

    console.log('PublishCampaignModal - Normalized finalLocations:', finalLocations);

    return {
      campaignObjective: 'sales_conversions',
      adsetGoal: 'in_web_actions',
      event: publishConfig?.event || 'Purchase',
      marketGroups: [
        {
          id: '1',
          targetLocations: finalLocations,
          budgetMode: 'unified',
          unifiedBudget: publishConfig?.budget?.toString() || '500',
          kpiType: 'ROAS',
          kpiMode: 'unified',
          unifiedKPI: ''
        }
      ]
    };
  }, [isOpen, publishConfig]);

  const [brandGoalData, setBrandGoalData] = useState(initialBrandGoalData);

  // Update state if initial data changes (e.g. when modal re-opens)
  useEffect(() => {
    if (isOpen) {
      setBrandGoalData(initialBrandGoalData);
    }
  }, [isOpen, initialBrandGoalData]);

  const [validation, setValidation] = useState({
    objective: true,
    marketGroups: true
  });

  useEffect(() => {
    console.log('Publish Campaign Modal - publishConfig received:', publishConfig);
  }, [publishConfig]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowAccountChoice(true);
      setSelectedAccountType(null);
      setShowAdsgoReminder(false);
      setHideMainModal(false);
      setConnectedPlatform(null);
      setIsConnecting(false);
      setPlatforms({
        meta: { connected: false, email: 'alex.designer@meta.com' },
        google: { connected: false, email: 'alex.growth@google.com' }
      });
      setSelections({
        adAccount: '',
        fbPage: '',
        pixel: '',
        event: '',
        conversionDataset: ''
      });
      setActiveDropdown(null);
      setPublishProgress([
        { id: 1, name: 'Campaign #1 - US Market', status: 'Publishing' },
        { id: 2, name: 'Campaign #2 - EU Market', status: 'Waiting' },
        { id: 3, name: 'Campaign #3 - Retargeting', status: 'Waiting' },
        { id: 4, name: 'Campaign #4 - Lookalike', status: 'Waiting' },
        { id: 5, name: 'Campaign #5 - Brand Awareness', status: 'Waiting' },
      ]);
    }
  }, [isOpen]);

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

  const renderAccountChoiceStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        {/* Use your own ad account Card */}
        <div 
          onClick={() => setSelectedAccountType('own')}
          className={`relative overflow-hidden cursor-pointer rounded-2xl border-2 p-6 transition-all ${
            selectedAccountType === 'own' 
              ? 'bg-indigo-50 border-indigo-500 shadow-lg shadow-indigo-200/30' 
              : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
          }`}
        >
          {selectedAccountType === 'own' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          )}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-1">Use your own ad account</h4>
              <p className="text-[11px] font-medium text-slate-500">Connect and use your existing advertising accounts</p>
            </div>
          </div>
        </div>

        {/* Use AdsGo provided ad account Card */}
        <div 
          onClick={() => setSelectedAccountType('adsgo')}
          className={`relative overflow-hidden cursor-pointer rounded-2xl border-2 p-6 transition-all ${
            selectedAccountType === 'adsgo' 
              ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-200/30' 
              : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
          }`}
        >
          {selectedAccountType === 'adsgo' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          )}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-1">Use the ad account provided by adsgo</h4>
              <p className="text-[11px] font-medium text-slate-500">Let AdsGo manage your advertising setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

  const CustomDropdown = ({ label, options, value, onChange, placeholder, isOpen, onToggle }) => {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="space-y-2 relative">
        <label className="text-[10px] font-bold text-slate-400 tracking-widest">{label}</label>
        <div 
          onClick={onToggle}
          className={`w-full h-12 px-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
            isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-sm font-bold ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-[150] top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  onToggle();
                }}
                className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${
                  value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStep2 = () => {
    const isMeta = connectedPlatform === 'meta';
    const canPublish = isMeta 
      ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
      : (selections.adAccount && selections.conversionDataset && selections.event);

    const options = {
      adAccount: [
        { value: '1', label: 'Main Business Account (129-382-991)' },
        { value: '2', label: 'Backup Marketing (442-110-872)' }
      ],
      fbPage: [
        { value: '1', label: 'Eco-Friendly Brand' },
        { value: '2', label: 'Daily Lifestyle Store' }
      ],
      pixel: [
        { value: '1', label: 'Primary Web Pixel (Active)' }
      ],
      metaEvent: [
        { value: 'purchase', label: 'Purchase' },
        { value: 'add_to_cart', label: 'Add to Cart' },
        { value: 'lead', label: 'Lead' }
      ],
      conversionDataset: [
        { value: '1', label: 'Primary Conversions' },
        { value: '2', label: 'Secondary Goals' }
      ],
      googleEvent: [
        { value: 'sales', label: 'Sales' },
        { value: 'signup', label: 'Signup' }
      ]
    };

    const handleToggle = (key) => {
      setActiveDropdown(activeDropdown === key ? null : key);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
          <CustomDropdown 
            label="Select ad account"
            options={options.adAccount}
            value={selections.adAccount}
            onChange={(val) => setSelections({...selections, adAccount: val})}
            placeholder="Select an account..."
            isOpen={activeDropdown === 'adAccount'}
            onToggle={() => handleToggle('adAccount')}
          />

          {isMeta ? (
            <>
              {selections.adAccount && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <CustomDropdown 
                    label="Facebook page"
                    options={options.fbPage}
                    value={selections.fbPage}
                    onChange={(val) => setSelections({...selections, fbPage: val})}
                    placeholder="Select a page..."
                    isOpen={activeDropdown === 'fbPage'}
                    onToggle={() => handleToggle('fbPage')}
                  />
                </div>
              )}
              {selections.fbPage && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <CustomDropdown 
                    label="Tracking pixel"
                    options={options.pixel}
                    value={selections.pixel}
                    onChange={(val) => setSelections({...selections, pixel: val})}
                    placeholder="Select a pixel..."
                    isOpen={activeDropdown === 'pixel'}
                    onToggle={() => handleToggle('pixel')}
                  />
                </div>
              )}
              {selections.pixel && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <CustomDropdown 
                    label="Event"
                    options={options.metaEvent}
                    value={selections.event}
                    onChange={(val) => setSelections({...selections, event: val})}
                    placeholder="Select an event..."
                    isOpen={activeDropdown === 'metaEvent'}
                    onToggle={() => handleToggle('metaEvent')}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {selections.adAccount && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <CustomDropdown 
                    label="Conversion dataset"
                    options={options.conversionDataset}
                    value={selections.conversionDataset}
                    onChange={(val) => setSelections({...selections, conversionDataset: val})}
                    placeholder="Select a dataset..."
                    isOpen={activeDropdown === 'conversionDataset'}
                    onToggle={() => handleToggle('conversionDataset')}
                  />
                </div>
              )}
              {selections.conversionDataset && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <CustomDropdown 
                    label="Optimization event"
                    options={options.googleEvent}
                    value={selections.event}
                    onChange={(val) => setSelections({...selections, event: val})}
                    placeholder="Select an event..."
                    isOpen={activeDropdown === 'googleEvent'}
                    onToggle={() => handleToggle('googleEvent')}
                  />
                </div>
              )}
            </>
          )}

          {!canPublish && selections.adAccount && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold animate-pulse">
              <AlertCircle size={14} />
              Please complete all required selections to proceed
            </div>
          )}</div>

        <button 
          onClick={() => {
            setActiveDropdown(null);
            setStep(3);
          }}
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
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Publish successful!</h3>
        <p className="text-sm font-medium text-slate-500">Confirm your brand's optimize goal to activate AI optimization</p>
      </div>

      <div className="space-y-8 pr-2 pb-32">
        {/* Budget & KPI Card */}
        <div className="transform transition-all hover:shadow-md relative z-[100]">
          <BudgetKPISection 
            formData={brandGoalData}
            updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))}
            updateFormDataDeep={(updates) => setBrandGoalData(p => ({...p, ...updates}))}
            validation={validation}
            setValidation={setValidation}
          />
        </div>

        {/* Objective Card - Removed overflow-hidden to allow dropdown to show */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm transform transition-all hover:shadow-md relative z-[50]">
          <ObjectiveSection 
            formData={brandGoalData}
            updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))}
            validation={validation}
            setValidation={setValidation}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Content - Hide when adsgo is selected */}
      {!hideMainModal && (
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
            <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
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

          {/* Step 4 Sticky Footer */}
          {step === 4 && (
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-white/0 pt-16 z-[200]">
              <button 
                onClick={onComplete}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl text-base font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-emerald-200/50"
              >
                Confirm strategy & finish
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Account Choice Modal - Independent Modal */}
      {showAccountChoice && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center px-4 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="px-10 pt-10 pb-6 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Two ways to run your ads
              </h2>
              <button onClick={() => {
                setShowAccountChoice(false);
                onClose();
              }} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-10 pb-6 custom-scrollbar">
              {renderAccountChoiceStep()}
            </div>

            <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
              <button onClick={() => {
                setShowAccountChoice(false);
                onClose();
              }} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-6 py-2 transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (selectedAccountType === 'adsgo') {
                    setShowAccountChoice(false);
                    setShowAdsgoReminder(true);
                    setHideMainModal(true);
                  } else if (selectedAccountType === 'own') {
                    setShowAccountChoice(false);
                    // Continue to main modal
                  }
                }}
                disabled={!selectedAccountType}
                className="px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-30 flex items-center gap-2"
              >
                Confirm
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AdsGo Reminder Modal */}
      {showAdsgoReminder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden p-10">
            <button 
              onClick={() => {
                setShowAdsgoReminder(false);
                onClose();
              }}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-6 pt-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center animate-bounce">
                <Loader2 size={40} className="text-emerald-600 animate-spin" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Setting up your dedicated ad account
                </h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Once your account is ready, you can republish from the 
                  <button 
                    onClick={() => {
                      // Trigger navigation to Draft & Recom. page
                      if (onClose) onClose();
                      // Navigate to AI optimize -> Draft & Recom. page
                      window.location.href = '/ai-optimize/draft-recom';
                    }}
                    className="text-indigo-600 hover:text-indigo-700 underline transition-colors bg-transparent border-0 p-0 cursor-pointer"
                  >
                    Draft & Recom.
                  </button>
                  page.
                </p>
                <p className="text-xs font-bold text-slate-500">
                  Contact us at<br/>
                  <a href="mailto:support@adsgo.ai" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                    support@adsgo.ai
                  </a>
                  for real-time updates
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishCampaignModal;
