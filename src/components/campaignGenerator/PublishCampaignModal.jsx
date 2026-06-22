import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Check, ChevronRight, Loader2, 
  Layout, Target, Rocket, Sparkles,
  ArrowRight, AlertCircle, RefreshCw,
  ChevronDown, Search, Link2Off, Briefcase, ChevronLeft
} from 'lucide-react';
import ObjectiveSection from '../brand/optimizeGoals/ObjectiveSection';
import BudgetKPISection from '../brand/optimizeGoals/BudgetKPISection';
import { useZIndex } from '../../hooks/useZIndex';

const PublishCampaignModal = ({ isOpen, onClose, LOGO_LINKS, onComplete, publishConfig }) => {
  const zIndex = useZIndex(isOpen);
  const [step, setStep] = useState(1); // Main steps: 1: Publishing status, 2: Confirm goal
  const [showAccountChoice, setShowAccountChoice] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState('own');
  const [showAdsgoReminder, setShowAdsgoReminder] = useState(false);
  const [hideMainModal, setHideMainModal] = useState(false);
  const [connectedPlatform, setConnectedPlatform] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [platforms, setPlatforms] = useState({
    meta: { connected: false, email: 'alex.designer@meta.com' },
    google: { connected: false, email: 'alex.growth@google.com' }
  });

  const [selections, setSelections] = useState({
    adAccount: '',
    fbPage: '',
    pixel: '',
    event: '',
    conversionDataset: ''
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  const [publishProgress, setPublishProgress] = useState([
    { id: 1, name: 'Campaign #1 - US Market', status: 'Publishing' },
    { id: 2, name: 'Campaign #2 - EU Market', status: 'Waiting' },
    { id: 3, name: 'Campaign #3 - Retargeting', status: 'Waiting' },
    { id: 4, name: 'Campaign #4 - Lookalike', status: 'Waiting' },
    { id: 5, name: 'Campaign #5 - Brand Awareness', status: 'Waiting' },
  ]);

  const initialBrandGoalData = useMemo(() => {
    let rawLocations = publishConfig?.locations || publishConfig?.targetLocations || ['United States'];
    if (!Array.isArray(rawLocations) || rawLocations.length === 0) rawLocations = ['United States'];

    const finalLocations = rawLocations.map(loc => {
      if (typeof loc === 'string') return { value: loc.toLowerCase(), label: loc };
      return loc;
    });

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
  }, [publishConfig]);

  const [brandGoalData, setBrandGoalData] = useState(initialBrandGoalData);
  const [validation, setValidation] = useState({ objective: true, marketGroups: true });

  useEffect(() => {
    if (isOpen) {
      setStep(1); // Set to publishing initially, but will show account choice
      setShowAccountChoice(true);
      setSelectedAccountType('own');
      setShowAdsgoReminder(false);
      setHideMainModal(false);
      setConnectedPlatform(null);
      setBrandGoalData(initialBrandGoalData);
      setSelections({
        adAccount: '',
        fbPage: '',
        pixel: '',
        event: '',
        conversionDataset: ''
      });
      setPublishProgress([
        { id: 1, name: 'Campaign #1 - US Market', status: 'Publishing' },
        { id: 2, name: 'Campaign #2 - EU Market', status: 'Waiting' },
        { id: 3, name: 'Campaign #3 - Retargeting', status: 'Waiting' },
        { id: 4, name: 'Campaign #4 - Lookalike', status: 'Waiting' },
        { id: 5, name: 'Campaign #5 - Brand Awareness', status: 'Waiting' },
      ]);
    }
  }, [isOpen, initialBrandGoalData]);

  useEffect(() => {
    if (isOpen && !showAccountChoice && step === 1 && !hideMainModal) {
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
          setTimeout(() => setStep(2), 1500);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, showAccountChoice, step, hideMainModal]);

  if (!isOpen) return null;

  const handleConnect = (platform) => {
    setIsConnecting(platform);
    setTimeout(() => {
      setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], connected: true } }));
      setIsConnecting(false);
      setConnectedPlatform(platform);
    }, 2000);
  };

  const handleDisconnect = (platform) => {
    setPlatforms(prev => ({ ...prev, [platform]: { ...prev[platform], connected: false } }));
    if (connectedPlatform === platform) setConnectedPlatform(null);
  };

  const CustomDropdown = ({ label, options, value, onChange, placeholder, isOpen, onToggle }) => {
    const selectedOption = options.find(opt => opt.value === value);
    return (
      <div className="space-y-2 relative">
        <label className="text-[10px] font-bold text-neutral-400 tracking-widest">{label}</label>
        <div onClick={onToggle} className={`w-full h-12 px-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary-500 ring-2 ring-primary-500/10' : 'border-neutral-200 hover:border-neutral-300'}`}>
          <span className={`text-sm font-bold ${selectedOption ? 'text-neutral-900' : 'text-neutral-400'}`}>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown size={16} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <div className="absolute z-[150] top-full left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
              <div key={opt.value} onClick={() => { onChange(opt.value); onToggle(); }} className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${value === opt.value ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-50 text-neutral-600'}`}>{opt.label}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary-600" />
          </div>
          <span className="text-[13px] font-black text-neutral-700">Meta Connection</span>
        </div>
        <div className="relative overflow-hidden group bg-white rounded-2xl border border-neutral-100 shadow-sm flex items-center transition-all h-16 hover:border-primary-100">
          <div className="flex items-center gap-4 px-6 flex-1 min-w-0">
            <div className="w-8 h-8 shrink-0 bg-neutral-50 rounded-lg p-1.5 border border-neutral-100"><img src={LOGO_LINKS.meta} alt="Meta" className="w-full h-full object-contain" /></div>
            <div className="flex items-center gap-10 w-full">
              <span className="text-sm font-black text-neutral-800 shrink-0">Meta Ads</span>
              {platforms.meta.connected ? (
                <span className="text-sm font-bold text-neutral-400 truncate">{platforms.meta.email.split('@')[0]}</span>
              ) : (
                <span className="text-sm font-bold text-neutral-200">Not connected</span>
              )}
            </div>
          </div>
          <div className="h-full shrink-0 flex items-center pr-4">
            {platforms.meta.connected ? (
              <button onClick={() => handleDisconnect('meta')} className="px-6 py-2 text-danger-500 text-xs font-black hover:bg-danger-50 rounded-xl transition-colors flex items-center gap-2"><Link2Off size={14} /> Disconnect</button>
            ) : (
              <button onClick={() => handleConnect('meta')} disabled={!!isConnecting} className="px-8 py-2.5 bg-neutral-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-neutral-200">{isConnecting === 'meta' ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}</button>
            )}
          </div>
          {isConnecting === 'meta' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-300">
              <p className="text-[10px] font-black text-primary-600 animate-pulse tracking-widest">CONNECTING...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const isMeta = connectedPlatform === 'meta';
    const options = { adAccount: [{ value: '1', label: 'Main Business Account (129-382-991)' }, { value: '2', label: 'Backup Marketing (442-110-872)' }], fbPage: [{ value: '1', label: 'Eco-Friendly Brand' }, { value: '2', label: 'Daily Lifestyle Store' }], pixel: [{ value: '1', label: 'Primary Web Pixel (Active)' }], metaEvent: [{ value: 'purchase', label: 'Purchase' }, { value: 'add_to_cart', label: 'Add to Cart' }, { value: 'lead', label: 'Lead' }], conversionDataset: [{ value: '1', label: 'Primary Conversions' }, { value: '2', label: 'Secondary Goals' }], googleEvent: [{ value: 'sales', label: 'Sales' }, { value: 'signup', label: 'Signup' }] };
    const handleToggle = (key) => setActiveDropdown(activeDropdown === key ? null : key);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-neutral-50 rounded-2xl p-6 space-y-6">
          <CustomDropdown label="Select ad account" options={options.adAccount} value={selections.adAccount} onChange={(val) => setSelections({...selections, adAccount: val})} placeholder="Select an account..." isOpen={activeDropdown === 'adAccount'} onToggle={() => handleToggle('adAccount')} />
          {isMeta ? (
            <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Facebook page" options={options.fbPage} value={selections.fbPage} onChange={(val) => setSelections({...selections, fbPage: val})} placeholder="Select a page..." isOpen={activeDropdown === 'fbPage'} onToggle={() => handleToggle('fbPage')} /></div>)}{selections.fbPage && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Tracking pixel" options={options.pixel} value={selections.pixel} onChange={(val) => setSelections({...selections, pixel: val})} placeholder="Select a pixel..." isOpen={activeDropdown === 'pixel'} onToggle={() => handleToggle('pixel')} /></div>)}{selections.pixel && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Event" options={options.metaEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'metaEvent'} onToggle={() => handleToggle('metaEvent')} /></div>)}</>
          ) : (
            <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Conversion dataset" options={options.conversionDataset} value={selections.conversionDataset} onChange={(val) => setSelections({...selections, conversionDataset: val})} placeholder="Select a dataset..." isOpen={activeDropdown === 'conversionDataset'} onToggle={() => handleToggle('conversionDataset')} /></div>)}{selections.conversionDataset && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Optimization event" options={options.googleEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'googleEvent'} onToggle={() => handleToggle('googleEvent')} /></div>)}</>
          )}
          {!selections.adAccount && selections.adAccount && (<div className="flex items-center gap-2 p-3 bg-primary-50 text-primary-600 rounded-xl text-[10px] font-bold animate-pulse"><AlertCircle size={14} />Please complete all required selections to proceed</div>)}
        </div>
      </div>
    );
  };

  const renderPublishingStatus = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-neutral-50 rounded-[2rem] p-8 border border-neutral-100">
        <div className="flex items-center justify-between mb-8">
          <div><h3 className="text-xl font-black text-neutral-900 tracking-tight">Pushing campaigns</h3><p className="text-[11px] font-bold text-neutral-400 tracking-widest mt-1">Status: {publishProgress.filter(p => p.status === 'Success').length}/5 Completed</p></div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center"><Loader2 size={24} className="text-primary-600 animate-spin" /></div>
        </div>
        <div className="space-y-3">
          {publishProgress.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-neutral-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${p.status === 'Success' ? 'bg-success-50 text-success-600' : p.status === 'Failure' ? 'bg-danger-50 text-danger-600' : p.status === 'Publishing' ? 'bg-primary-50 text-primary-600' : 'bg-neutral-50 text-neutral-300'}`}>{p.status === 'Success' ? <Check size={20} /> : p.status === 'Failure' ? <AlertCircle size={20} /> : p.status === 'Publishing' ? <Loader2 size={20} className="animate-spin" /> : <Layout size={18} />}</div>
                <div><h4 className="text-sm font-bold text-neutral-800">{p.name}</h4><p className={`text-[10px] font-black tracking-widest ${p.status === 'Success' ? 'text-success-500' : p.status === 'Failure' ? 'text-danger-500' : p.status === 'Publishing' ? 'text-primary-500' : 'text-neutral-400'}`}>{p.status}</p></div>
              </div>
              {p.status === 'Failure' && (<button className="p-2 hover:bg-danger-50 text-danger-400 rounded-lg transition-colors"><RefreshCw size={14} /></button>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSuccessAndGoal = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col items-center text-center space-y-2 mb-4">
        <div className="w-16 h-16 bg-success-50 text-success-600 rounded-full flex items-center justify-center mb-2 animate-bounce"><Check size={32} /></div>
        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Publish successful!</h3>
        <p className="text-sm font-medium text-neutral-500">Confirm your brand's optimize goal to activate AI optimization</p>
      </div>
      <div className="space-y-8 pr-2 pb-32">
        <div className="transform transition-all hover:shadow-md relative z-[100]"><BudgetKPISection formData={brandGoalData} updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))} updateFormDataDeep={(updates) => setBrandGoalData(p => ({...p, ...updates}))} validation={validation} setValidation={setValidation} /></div>
      </div>
    </div>
  );

  const AccountChoiceModal = ({ onSelect, onClose, selectedAccountType, setSelectedAccountType, renderStep1, renderStep2, connectedPlatform, selections }) => {
    const isMeta = connectedPlatform === 'meta';
    const canProceed = isMeta 
      ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event)
      : (selections.adAccount && selections.conversionDataset && selections.event);

    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 animate-in fade-in duration-300" style={{ zIndex: zIndex + 50 }}>
        <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
        <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
          <div className="px-10 pt-10 pb-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                  {selectedAccountType === 'own' ? 'Account Connection Needed' : 'Let AdsGo Handle Everything'}
                </h2>
                <p className="text-[13px] font-medium text-neutral-500 leading-relaxed max-w-md">
                  {selectedAccountType === 'own' 
                    ? 'Please connect your Meta account, and select a valid ad account and Facebook page to publish your ads.'
                    : "We've prepped everything for you : Stable ad accounts, professional Facebook Pages."}
                </p>
              </div>
              <button 
                onClick={() => setSelectedAccountType(selectedAccountType === 'own' ? 'adsgo' : 'own')}
                className="px-4 py-2 border-2 border-primary-100 text-primary-600 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-primary-50 transition-all group shrink-0"
              >
                {selectedAccountType === 'own' ? "Use AdsGo's account" : "Use my own account"}
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {selectedAccountType === 'own' ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                {renderStep1()}
                {connectedPlatform && (
                  <div className="pt-6 border-t border-neutral-50 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6"><h4 className="text-sm font-black text-neutral-900 mb-1">Select your assets</h4><p className="text-[11px] font-medium text-neutral-500">Configure the ad account and tracking for this campaign</p></div>
                    {renderStep2()}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 p-1 relative group overflow-hidden rounded-[2.5rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-success-400/20 via-teal-500/10 to-primary-500/20 animate-pulse" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.4rem] p-12 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-success-100/50 animate-in zoom-in-95">
                  <div className="relative">
                    <div className="absolute inset-0 bg-success-400 blur-2xl opacity-20 animate-pulse" />
                    <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-success-200 relative z-10">
                      <Briefcase size={36} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-success-600/80 tracking-wide">Let AdsGo manage your advertising setup</p>
                  </div>
                  <div className="flex gap-1.5 pt-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-success-200 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-10 py-8 border-t border-neutral-50 flex items-center justify-between bg-neutral-50/50 shrink-0">
            <button onClick={onClose} className="text-xs font-bold text-neutral-400 hover:text-neutral-600 px-6 py-2 transition-colors font-sans">Cancel</button>
            <button 
              onClick={() => onSelect(selectedAccountType)} 
              disabled={selectedAccountType === 'own' ? !canProceed : false} 
              className="px-12 py-4 bg-neutral-900 text-white rounded-2xl text-[13px] font-black hover:bg-black transition-all disabled:opacity-30 flex items-center gap-3 shadow-xl shadow-neutral-200"
            >
              {selectedAccountType === 'own' ? 'Confirm and Publish' : 'Confirm'} 
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AdsGoReminderModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center px-4 animate-in fade-in duration-300" style={{ zIndex: zIndex + 100 }}>
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in duration-300" />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors"><X size={20} /></button>
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-teal-100 rounded-full flex items-center justify-center animate-bounce">
            <Loader2 size={40} className="text-success-600 animate-spin" />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-black text-neutral-900 tracking-tight">Setting up your dedicated ad account</h3>
            <p className="text-sm font-medium text-neutral-600 leading-relaxed">
              An advertising specialist will contact you at your registered email address shortly; please check your email. You can republish from the <button onClick={() => { onClose(); window.location.href = '/autoRegeneration'; }} className="text-primary-600 hover:text-primary-700 underline transition-colors bg-transparent border-0 p-0 cursor-pointer">Draft & Recom.</button> page.
            </p>
            <p className="text-xs font-bold text-neutral-500">
              Contact us at<br/><a href="mailto:support@adsgo.ai" className="text-primary-600 hover:text-primary-700 transition-colors">support@adsgo.ai</a> for real-time updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden" style={{ zIndex }}>
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      {!hideMainModal && !showAccountChoice && !showAdsgoReminder && (
        <div className={`relative bg-white w-full ${step === 2 ? 'max-w-4xl' : 'max-w-xl'} rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden`}>
          <div className="px-10 pt-10 pb-6 flex items-start justify-between shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${step === 1 ? 'bg-warning-50 text-warning-600' : 'bg-success-50 text-success-600'}`}>Step {step} of 2</span>
                <div className="flex gap-1">{[1, 2].map((i) => (<div key={i} className={`h-1 rounded-full transition-all duration-500 ${i < step ? 'w-4 bg-success-500' : i === step ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-200'}`} />))}</div>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{step === 1 && 'Publishing status'}{step === 2 && 'Confirm brand optimize goal'}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
            {step === 1 && renderPublishingStatus()}
            {step === 2 && renderSuccessAndGoal()}
          </div>
          {step === 2 && (
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-white/0 pt-16 z-[200]">
              <button onClick={onComplete} className="w-full py-5 bg-gradient-to-r from-success-600 to-teal-700 text-white rounded-2xl text-base font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-success-200/50">Confirm strategy & finish <ArrowRight size={20} /></button>
            </div>
          )}
        </div>
      )}
      {showAccountChoice && <AccountChoiceModal onSelect={(type) => {
        if (type === 'adsgo') {
          setShowAccountChoice(false);
          setShowAdsgoReminder(true);
          setHideMainModal(true);
        } else {
          setShowAccountChoice(false);
          setStep(1);
        }
      }} onClose={onClose} selectedAccountType={selectedAccountType} setSelectedAccountType={setSelectedAccountType} renderStep1={renderStep1} renderStep2={renderStep2} connectedPlatform={connectedPlatform} selections={selections} />}
      {showAdsgoReminder && <AdsGoReminderModal onClose={onClose} />}
    </div>
  );
};

export default PublishCampaignModal;
