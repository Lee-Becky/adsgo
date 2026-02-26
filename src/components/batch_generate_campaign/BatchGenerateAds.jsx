import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Globe, Monitor, Target, ShoppingBag, ChevronDown, Sparkles, Search, 
  Briefcase, Check, Layout, Tag, Link2, Info, Settings, Plus, FileText, 
  Type, Calendar, Clock, Rocket, Facebook, Instagram, Hash, Loader2, 
  CheckCircle2, Layers, RefreshCw, MapPin, Zap, ArrowRight, ChevronLeft, 
  Megaphone, MousePointer2, Users, Smartphone, ChevronRight 
} from 'lucide-react';
import { Z_INDEX } from '../../constants/zIndex';
import { useZIndex } from '../../hooks/useZIndex';
import ProductSelector from './components/ProductSelector';
import CampaignPlanView from './components/CampaignPlanView';
import CampaignPreviewView from './components/CampaignPreviewView';
import ObjectiveSection from '../brand/optimizeGoals/ObjectiveSection';
import BudgetKPISection from '../brand/optimizeGoals/BudgetKPISection';

const MOCK_EXISTING_CAMPAIGNS = [
  { id: '1202058341', name: 'US-Summer-Sales-CBO-001', budgetType: 'CBO', budget: 200 },
  { id: '1202059422', name: 'GLOBAL-Testing-ABO-V2', budgetType: 'ABO', budget: 20 },
  { id: '1202061553', name: 'US-Apparel-NewSeason-LAL', budgetType: 'CBO', budget: 500 },
  { id: '1202062774', name: 'CA-Accessories-Retargeting', budgetType: 'ABO', budget: 50 },
];

const MOCK_ACCOUNTS = [
  { id: 'act_2948192038', name: 'Luminaire Style - Global' },
  { id: 'act_1039582103', name: 'Performance Testing Acc' },
];

const MOCK_PAGES = [
  { id: 'page_123', name: 'Luminaire Vintage Official' },
  { id: 'page_456', name: 'Retro Fashion Daily' },
];

const PLATFORMS = [
  { id: 'meta', name: 'Meta', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256' },
  { id: 'google', name: 'Google', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' },
  { id: 'tiktok', name: 'TikTok', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256', disabled: true },
  { id: 'bing', name: 'Bing', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256', disabled: true }
];

const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Reach more people' },
  { value: 'traffic', label: 'Traffic', icon: MousePointer2, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Drive site visits' },
  { value: 'leads', label: 'Leads', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Find prospects' },
  { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Drive transactions' },
  { value: 'app_promotion', label: 'App Promotion', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50', description: 'Install & usage' }
];

const ADSET_GOALS_MAPPING = {
  awareness_engagement: [
    { value: 'impressions', label: 'Impressions' },
    { value: 'post_engagement', label: 'Post engagement' },
    { value: 'conversations', label: 'Conversations' }
  ],
  traffic: [
    { value: 'impressions', label: 'Impressions' },
    { value: 'link_clicks', label: 'Link clicks' },
    { value: 'page_views', label: 'Page views' }
  ],
  leads: [
    { value: 'leads_landing_page', label: 'Leads within landing-page', needsEvent: true },
    { value: 'instant_form_leads', label: 'Instant form leads' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'calls', label: 'Calls' }
  ],
  sales_conversions: [
    { value: 'in_web_actions', label: 'In-web actions', needsEvent: true }
  ],
  app_promotion: [
    { value: 'installs', label: 'Installs' },
    { value: 'in_app_actions', label: 'In-app actions', needsEvent: true }
  ]
};

const STANDARD_EVENTS = [
  'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', 
  'CompleteRegistration', 'SubmitApplication', 'Contact', 
  'Search', 'ViewContent', 'Subscribe', 'CustomizeProduct',
  'Donate', 'FindLocation', 'Schedule', 'StartTrial'
];

const ALL_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' }
];

const BatchGenerateAds = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productCreativesMap, setProductCreativesMap] = useState({});
  const [productReportsMap, setProductReportsMap] = useState({});
  
  const [campaignType, setCampaignType] = useState('PRODUCT');

  const [lpType, setLpType] = useState('PRODUCT');
  const [lpTemplateUrl, setLpTemplateUrl] = useState('https://luminaire-style.com/collections/{{product_name}}');
  const [productLpUtm, setProductLpUtm] = useState('utm_source=meta&utm_medium=paid&utm_campaign=ai_batch_{{product_id}}');
  
  const [copyStrategy, setCopyStrategy] = useState('AI_CUSTOM');
  const [unifiedHeadline, setUnifiedHeadline] = useState('Limited Time Offer: Quality You Can Trust');
  const [unifiedBody, setUnifiedBody] = useState('Discover the perfect blend of style and comfort. Shop our latest collection today and enjoy exclusive benefits.');

  const [scheduleType, setScheduleType] = useState('CONTINUOUS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedLocations, setSelectedLocations] = useState([{ code: 'US', name: 'United States' }]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [objective, setObjective] = useState('sales_conversions');
  const [adsetGoal, setAdsetGoal] = useState('in_web_actions');
  const [event, setEvent] = useState('Purchase');

  const [openDropdown, setOpenDropdown] = useState(null); // 'location', 'platform', 'objective', 'event'
  const [locationSearch, setLocationSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [objectiveStage, setObjectiveStage] = useState('goal'); // 'goal' or 'event'

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(() => {
    return localStorage.getItem('has_generated_once') === 'true';
  });

  const [structure, setStructure] = useState({ 
    strategy: 'PER_PRODUCT',
    adsPerSet: 3,
    numAdsets: 3,
    numAdsetsPerProduct: 1
  });
  const [adsetAudiences, setAdsetAudiences] = useState(Array(50).fill('ADV'));
  const [lalOptions, setLalOptions] = useState(['US Purchase 1%']);
  const [intOptions, setIntOptions] = useState([]);
  const [budgetType, setBudgetType] = useState('CBO');
  const [dailyBudget, setDailyBudget] = useState(50);
  const [view, setView] = useState('config');

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(MOCK_ACCOUNTS[0]);

  const selectedCampaign = useMemo(() => 
    MOCK_EXISTING_CAMPAIGNS.find(c => c.id === selectedCampaignId), 
  [selectedCampaignId]);

  const isAnyProductMissingCreatives = useMemo(() => {
    if (selectedProducts.length === 0) return true;
    return selectedProducts.some(p => (productCreativesMap[p.id] || []).length === 0);
  }, [selectedProducts, productCreativesMap]);

  useEffect(() => {
    if (selectedCampaign) {
      setBudgetType(selectedCampaign.budgetType);
      setDailyBudget(selectedCampaign.budget);
    } else {
      setBudgetType('CBO');
      setDailyBudget(50);
    }
  }, [selectedCampaign]);

  const currentObjectiveObj = CAMPAIGN_OBJECTIVES.find(o => o.value === objective);
  const availableGoals = ADSET_GOALS_MAPPING[objective] || [];
  const currentGoalObj = availableGoals.find(g => g.value === adsetGoal);

  const detectedBrand = {
    name: 'Luminaire Vintage',
    logo: 'https://picsum.photos/seed/logo1/100/100',
    url: 'luminaire-style.com',
    goal: currentObjectiveObj?.label || '',
    country: selectedLocations[0]?.name || ''
  };

  const handleUpdateProductCreatives = (productId, creativesOrUpdater) => {
    setProductCreativesMap(prev => {
      const currentCreatives = prev[productId] || [];
      const nextCreatives = typeof creativesOrUpdater === 'function' 
        ? creativesOrUpdater(currentCreatives) 
        : creativesOrUpdater;
      
      // 限制每个产品最多 10 个素材
      const creativesWithId = nextCreatives.slice(0, 10).map(c => ({ ...c, productId }));
      return { ...prev, [productId]: creativesWithId };
    });
  };

  const handleToggleAudienceType = (index) => {
    const types = ['ADV', 'LAL', 'INT'];
    setAdsetAudiences(prev => {
      const currentType = prev[index] || 'ADV';
      const nextType = types[(types.indexOf(currentType) + 1) % types.length];
      const next = [...prev];
      next[index] = nextType;
      return next;
    });
  };

  const handleToggleLalOption = (option) => {
    setLalOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleToggleIntOption = (option) => {
    setIntOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleQuickSchedule = (days) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const toggleLocation = (country) => {
    const isSelected = selectedLocations.some(l => l.code === country.code);
    if (isSelected) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter(l => l.code !== country.code));
      }
    } else {
      setSelectedLocations([...selectedLocations, country]);
    }
  };

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(locationSearch.toLowerCase()) || 
    c.code.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredEvents = STANDARD_EVENTS.filter(ev => 
    ev.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const handlePublishComplete = () => {
    setShowPublishModal(false);
    console.log('Publish complete, redirecting to Ad Manager');
    window.location.hash = '#/ad-manager-v3';
  };

  const CampaignSearchModal = () => {
    const zIndex = useZIndex(true);
    const [search, setSearch] = useState('');
    const filtered = MOCK_EXISTING_CAMPAIGNS.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)
    );

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
        style={{ zIndex }}
      >
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">选择已有投放系列</h3>
            <button onClick={() => setShowCampaignModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={24} /></button>
          </div>
          <div className="p-6 bg-slate-50/50 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" autoFocus placeholder="搜索系列名称或 ID..." 
                className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-indigo-500 transition-all"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 no-scrollbar">
            <div 
              onClick={() => { setSelectedCampaignId(null); setShowCampaignModal(false); }}
              className="p-4 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-lg flex items-center justify-center"><Plus size={20}/></div>
                <span className="text-sm font-black text-slate-400">创建全新系列 (Default)</span>
              </div>
            </div>
            {filtered.map(c => (
              <div 
                key={c.id} 
                onClick={() => { setSelectedCampaignId(c.id); setShowCampaignModal(false); }}
                className="p-4 rounded-xl hover:bg-indigo-50 cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div>
                  <p className="text-sm font-black text-slate-800">{c.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">ID: {c.id} • {c.budgetType}</p>
                </div>
                {selectedCampaignId === c.id && <Check size={18} className="text-indigo-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PublishModal = () => {
    const zIndex = useZIndex(true);
    const LOGO_LINKS = {
      meta: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
      google: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256'
    };

    const [step, setStep] = useState(1);
    const [showAccountChoice, setShowAccountChoice] = useState(true);
    const [selectedAccountType, setSelectedAccountType] = useState(null);
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
      const finalLocations = selectedLocations.map(loc => ({
        value: loc.code.toLowerCase(),
        label: loc.name
      }));

      return {
        campaignObjective: objective,
        adsetGoal: adsetGoal,
        event: event || 'Purchase',
        marketGroups: [
          {
            id: '1',
            targetLocations: finalLocations,
            budgetMode: 'unified',
            unifiedBudget: dailyBudget.toString(),
            kpiType: 'ROAS',
            kpiMode: 'unified',
            unifiedKPI: ''
          }
        ]
      };
    }, [selectedLocations, objective, adsetGoal, event, dailyBudget]);

    const [brandGoalData, setBrandGoalData] = useState(initialBrandGoalData);
    const [validation, setValidation] = useState({ objective: true, marketGroups: true });

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
          <label className="text-[10px] font-bold text-slate-400 tracking-widest">{label}</label>
          <div onClick={onToggle} className={`w-full h-12 px-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
            <span className={`text-sm font-bold ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          {isOpen && (
            <div className="absolute z-[150] top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
              {options.map((opt) => (
                <div key={opt.value} onClick={() => { onChange(opt.value); onToggle(); }} className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}>{opt.label}</div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderStep1 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-50 p-2.5 flex items-center justify-center border border-slate-100"><img src={LOGO_LINKS.meta} alt="Meta" className="w-full h-full object-contain" /></div>
              <div><h3 className="font-black text-slate-800">Meta Ads</h3><p className="text-[10px] font-bold text-slate-400 tracking-widest">Social media platform</p></div>
            </div>
            {platforms.meta.connected ? (
              <div className="space-y-4"><div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50"><p className="text-[10px] font-bold text-indigo-400 mb-1">Connected account</p><p className="text-xs font-black text-indigo-900">{platforms.meta.email}</p></div><button onClick={() => handleDisconnect('meta')} className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors">Disconnect</button></div>
            ) : (
              <button onClick={() => handleConnect('meta')} disabled={!!isConnecting} className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-50">Connect</button>
            )}
            {isConnecting === 'meta' && (<div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"><Loader2 size={32} className="text-indigo-600 animate-spin mb-3" /><p className="text-xs font-black text-slate-900 animate-pulse">Fetching your assets...</p></div>)}
          </div>
          <div className="relative overflow-hidden group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-50 p-2.5 flex items-center justify-center border border-slate-100"><img src={LOGO_LINKS.google} alt="Google" className="w-full h-full object-contain" /></div>
              <div><h3 className="font-black text-slate-800">Google Ads</h3><p className="text-[10px] font-bold text-slate-400 tracking-widest">Search & network</p></div>
            </div>
            {platforms.google.connected ? (
              <div className="space-y-4"><div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50"><p className="text-[10px] font-bold text-amber-500 mb-1">Connected account</p><p className="text-xs font-black text-amber-900">{platforms.google.email}</p></div><button onClick={() => handleDisconnect('google')} className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors">Disconnect</button></div>
            ) : (
              <button onClick={() => handleConnect('google')} disabled={!!isConnecting} className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-50">Connect</button>
            )}
            {isConnecting === 'google' && (<div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"><Loader2 size={32} className="text-indigo-600 animate-spin mb-3" /><p className="text-xs font-black text-slate-900 animate-pulse">Fetching your assets...</p></div>)}
          </div>
        </div>
      </div>
    );

    const renderStep2 = () => {
      const isMeta = connectedPlatform === 'meta';
      const canPublish = isMeta ? (selections.adAccount && selections.fbPage && selections.pixel && selections.event) : (selections.adAccount && selections.conversionDataset && selections.event);
      const options = { adAccount: [{ value: '1', label: 'Main Business Account (129-382-991)' }, { value: '2', label: 'Backup Marketing (442-110-872)' }], fbPage: [{ value: '1', label: 'Eco-Friendly Brand' }, { value: '2', label: 'Daily Lifestyle Store' }], pixel: [{ value: '1', label: 'Primary Web Pixel (Active)' }], metaEvent: [{ value: 'purchase', label: 'Purchase' }, { value: 'add_to_cart', label: 'Add to Cart' }, { value: 'lead', label: 'Lead' }], conversionDataset: [{ value: '1', label: 'Primary Conversions' }, { value: '2', label: 'Secondary Goals' }], googleEvent: [{ value: 'sales', label: 'Sales' }, { value: 'signup', label: 'Signup' }] };
      const handleToggle = (key) => setActiveDropdown(activeDropdown === key ? null : key);
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
            <CustomDropdown label="Select ad account" options={options.adAccount} value={selections.adAccount} onChange={(val) => setSelections({...selections, adAccount: val})} placeholder="Select an account..." isOpen={activeDropdown === 'adAccount'} onToggle={() => handleToggle('adAccount')} />
            {isMeta ? (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Facebook page" options={options.fbPage} value={selections.fbPage} onChange={(val) => setSelections({...selections, fbPage: val})} placeholder="Select a page..." isOpen={activeDropdown === 'fbPage'} onToggle={() => handleToggle('fbPage')} /></div>)}{selections.fbPage && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Tracking pixel" options={options.pixel} value={selections.pixel} onChange={(val) => setSelections({...selections, pixel: val})} placeholder="Select a pixel..." isOpen={activeDropdown === 'pixel'} onToggle={() => handleToggle('pixel')} /></div>)}{selections.pixel && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Event" options={options.metaEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'metaEvent'} onToggle={() => handleToggle('metaEvent')} /></div>)}</>
            ) : (
              <>{selections.adAccount && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Conversion dataset" options={options.conversionDataset} value={selections.conversionDataset} onChange={(val) => setSelections({...selections, conversionDataset: val})} placeholder="Select a dataset..." isOpen={activeDropdown === 'conversionDataset'} onToggle={() => handleToggle('conversionDataset')} /></div>)}{selections.conversionDataset && (<div className="animate-in fade-in slide-in-from-top-2 duration-300"><CustomDropdown label="Optimization event" options={options.googleEvent} value={selections.event} onChange={(val) => setSelections({...selections, event: val})} placeholder="Select an event..." isOpen={activeDropdown === 'googleEvent'} onToggle={() => handleToggle('googleEvent')} /></div>)}</>
            )}
            {!canPublish && selections.adAccount && (<div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold animate-pulse"><AlertCircle size={14} />Please complete all required selections to proceed</div>)}
          </div>
          <button onClick={() => { setActiveDropdown(null); setStep(3); }} disabled={!canPublish} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-30 disabled:grayscale">Publish now <Rocket size={18} /></button>
        </div>
      );
    };

    const renderStep3 = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div><h3 className="text-xl font-black text-slate-900 tracking-tight">Pushing campaigns</h3><p className="text-[11px] font-bold text-slate-400 tracking-widest mt-1">Status: {publishProgress.filter(p => p.status === 'Success').length}/5 Completed</p></div>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center"><Loader2 size={24} className="text-indigo-600 animate-spin" /></div>
          </div>
          <div className="space-y-3">
            {publishProgress.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${p.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : p.status === 'Failure' ? 'bg-red-50 text-red-600' : p.status === 'Publishing' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>{p.status === 'Success' ? <Check size={20} /> : p.status === 'Failure' ? <AlertCircle size={20} /> : p.status === 'Publishing' ? <Loader2 size={20} className="animate-spin" /> : <Layout size={18} />}</div>
                  <div><h4 className="text-sm font-bold text-slate-800">{p.name}</h4><p className={`text-[10px] font-black tracking-widest ${p.status === 'Success' ? 'text-emerald-500' : p.status === 'Failure' ? 'text-red-500' : p.status === 'Publishing' ? 'text-indigo-500' : 'text-slate-400'}`}>{p.status}</p></div>
                </div>
                {p.status === 'Failure' && (<button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><RefreshCw size={14} /></button>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const renderStep4 = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 animate-bounce"><Check size={32} /></div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Publish successful!</h3>
          <p className="text-sm font-medium text-slate-500">Confirm your brand's optimize goal to activate AI optimization</p>
        </div>
        <div className="space-y-8 pr-2 pb-32">
          <div className="transform transition-all hover:shadow-md relative z-[100]"><BudgetKPISection formData={brandGoalData} updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))} updateFormDataDeep={(updates) => setBrandGoalData(p => ({...p, ...updates}))} validation={validation} setValidation={setValidation} /></div>
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm transform transition-all hover:shadow-md relative z-[50]"><ObjectiveSection formData={brandGoalData} updateFormData={(key, val) => setBrandGoalData(p => ({...p, [key]: val}))} validation={validation} setValidation={setValidation} /></div>
        </div>
      </div>
    );

    const renderAccountChoiceStep = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => setSelectedAccountType('own')} className={`relative overflow-hidden cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedAccountType === 'own' ? 'bg-indigo-50 border-indigo-500 shadow-lg shadow-indigo-200/30' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'}`}>{selectedAccountType === 'own' && (<div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"><Check size={14} className="text-white" /></div>)}<div className="flex flex-col items-center text-center space-y-4"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"><span className="text-2xl">👤</span></div><div><h4 className="text-sm font-black text-slate-900 mb-1">Use your own ad account</h4><p className="text-[11px] font-medium text-slate-500">Connect and use your existing accounts</p></div></div></div>
          <div onClick={() => setSelectedAccountType('adsgo')} className={`relative overflow-hidden cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedAccountType === 'adsgo' ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-200/30' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'}`}>{selectedAccountType === 'adsgo' && (<div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"><Check size={14} className="text-white" /></div>)}<div className="flex flex-col items-center text-center space-y-4"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center"><span className="text-2xl">🏢</span></div><div><h4 className="text-sm font-black text-slate-900 mb-1">Use account provided by adsgo</h4><p className="text-[11px] font-medium text-slate-500">Let AdsGo manage your advertising setup</p></div></div></div>
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden" style={{ zIndex }}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPublishModal(false)} />
        {!hideMainModal && (
          <div className={`relative bg-white w-full ${step === 4 ? 'max-w-4xl' : 'max-w-xl'} rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden`}>
            <div className="px-10 pt-10 pb-6 flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${step === 1 ? 'bg-indigo-50 text-indigo-600' : step === 2 ? 'bg-purple-50 text-purple-600' : step === 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>Step {step} of 4</span>
                  <div className="flex gap-1">{[1, 2, 3, 4].map((i) => (<div key={i} className={`h-1 rounded-full transition-all duration-500 ${i < step ? 'w-4 bg-emerald-500' : i === step ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`} />))}</div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{step === 1 && 'Connect ad platform'}{step === 2 && 'Select your assets'}{step === 3 && 'Publishing status'}{step === 4 && 'Confirm brand optimize goal'}</h2>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">{step === 1 && renderStep1()}{step === 2 && renderStep2()}{step === 3 && renderStep3()}{step === 4 && renderStep4()}</div>
            {step === 1 && (
              <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
                <button onClick={() => setShowPublishModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-6 py-2 transition-colors">Cancel</button>
                <button onClick={() => setStep(2)} disabled={!connectedPlatform} className="px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-30 flex items-center gap-2">Select account <ChevronRight size={16} /></button>
              </div>
            )}
            {step === 4 && (
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-white/0 pt-16 z-[200]">
                <button onClick={handlePublishComplete} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl text-base font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-emerald-200/50">Confirm strategy & finish <ArrowRight size={20} /></button>
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
          }
        }} onClose={() => { setShowAccountChoice(false); setShowPublishModal(false); }} selectedAccountType={selectedAccountType} setSelectedAccountType={setSelectedAccountType} renderAccountChoiceStep={renderAccountChoiceStep} />}
        {showAdsgoReminder && <AdsGoReminderModal onClose={() => { setShowAdsgoReminder(false); setShowPublishModal(false); }} setShowPublishModal={setShowPublishModal} />}
      </div>
    );
  };

  return (
    <div className="bg-slate-50/50 min-h-full">
      {/* Top Sticky Account Info Card */}
      {selectedAccount && view === 'config' && (
        <div 
          className="sticky top-0 w-full px-4 md:px-8 py-2 animate-in slide-in-from-top-full duration-500"
          style={{ zIndex: Z_INDEX.HEADER }}
        >
          <div className="max-w-7xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-slate-800 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-400">当前投放广告账户</p>
                <p className="text-sm font-black truncate max-w-xs">{selectedAccount.name}</p>
              </div>
              <div className="h-8 w-px bg-slate-800 mx-2"></div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black tracking-widest text-slate-400">账户 ID</p>
                <p className="text-xs font-bold text-indigo-400">{selectedAccount.id}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAccountSelector(true)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-black tracking-widest transition-all flex items-center gap-2 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Change
            </button>
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-7xl">
          
          {view === 'config' ? (
            <div className="space-y-8 animate-fade-in pb-20">

              {/* Card 1: Targeting & Objectives */}
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Target size={20} /></div>
                   <h3 className="text-xl font-black text-slate-900">投放目标与渠道</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-[10]">
                  {/* Location Selector */}
                  <div className="relative" ref={openDropdown === 'location' ? dropdownRef : null}>
                    <div 
                      onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-indigo-200 transition-all h-full"
                    >
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">投放国家/地区</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin size={16} className="text-indigo-500 shrink-0" />
                          <span className="text-sm font-bold text-slate-700 truncate">
                            {selectedLocations[0]?.name}
                            {selectedLocations.length > 1 && '...'}
                          </span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {openDropdown === 'location' && (
                      <div className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
                        {/* Left: Search & List */}
                        <div className="w-1/2 border-r border-slate-50 flex flex-col">
                          <div className="p-4 border-b border-slate-50">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5" />
                              <input 
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/10"
                                placeholder="Search locations..."
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {filteredCountries.map(c => (
                              <button 
                                key={c.code}
                                onClick={() => toggleLocation(c)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                                  selectedLocations.some(l => l.code === c.code) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {c.name}
                                {selectedLocations.some(l => l.code === c.code) && <Check size={12} />}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Right: Selected */}
                        <div className="w-1/2 bg-slate-50/30 flex flex-col">
                          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 tracking-widest">Selected ({selectedLocations.length})</span>
                          </div>
                          <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar p-4 flex flex-wrap gap-2 content-start">
                            {selectedLocations.map(l => (
                              <div key={l.code} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm animate-in zoom-in">
                                <span className="text-[10px] font-black text-slate-700">{l.code}</span>
                                <button onClick={() => toggleLocation(l)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                  <X size={10} strokeWidth={3} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Platform Selector */}
                  <div className="relative" ref={openDropdown === 'platform' ? dropdownRef : null}>
                    <div 
                      onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-indigo-200 transition-all h-full"
                    >
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">投放渠道媒体</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={platform.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" />
                          <span className="text-sm font-bold text-slate-700 truncate">{platform.name}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {openDropdown === 'platform' && (
                      <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                        {PLATFORMS.map(p => (
                          <button 
                            key={p.id}
                            disabled={p.disabled}
                            onClick={() => {
                              setPlatform(p);
                              setOpenDropdown(null);
                            }}
                            className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                              p.disabled ? 'opacity-40 cursor-not-allowed' : 
                              platform.id === p.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <img src={p.logo} className="w-5 h-5 rounded object-contain shrink-0" alt="" />
                            <span className="text-xs font-bold">{p.name}</span>
                            {p.disabled && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg">COMING SOON</div>
                              </div>
                            )}
                            {!p.disabled && platform.id === p.id && <Check size={12} className="ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Objective Selector */}
                  <div className="relative" ref={openDropdown === 'objective' ? dropdownRef : null}>
                    <div 
                      onClick={() => {
                        setOpenDropdown(openDropdown === 'objective' ? null : 'objective');
                        setObjectiveStage('goal');
                      }}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-indigo-200 transition-all h-full"
                    >
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">核心投放目标</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Target size={16} className="text-indigo-500 shrink-0" />
                          <span className="text-sm font-bold text-slate-700 truncate">{currentObjectiveObj?.label}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform ${openDropdown === 'objective' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {openDropdown === 'objective' && (
                      <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest px-2">Select objective</p>
                        <div className="space-y-1.5">
                          {CAMPAIGN_OBJECTIVES.map(obj => {
                            const Icon = obj.icon;
                            return (
                              <button 
                                key={obj.value}
                                onClick={() => {
                                  setObjective(obj.value);
                                  setAdsetGoal(ADSET_GOALS_MAPPING[obj.value][0].value);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                                  objective === obj.value ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 shadow-sm' : 'hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${objective === obj.value ? 'bg-indigo-500 text-white' : obj.bg + ' ' + obj.color}`}>
                                  <Icon size={18} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold leading-none mb-1">{obj.label}</p>
                                  <p className="text-[9px] font-medium opacity-60 truncate">{obj.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Selector (Cascading) */}
                  <div className="relative" ref={openDropdown === 'event' ? dropdownRef : null}>
                    <div 
                      onClick={() => {
                        setOpenDropdown(openDropdown === 'event' ? null : 'event');
                        setObjectiveStage('goal');
                      }}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2 group cursor-pointer hover:border-indigo-200 transition-all h-full"
                    >
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">转化优化事件</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Zap size={16} className="text-indigo-500 shrink-0" />
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-sm font-bold text-slate-700 truncate">{currentGoalObj?.label}</span>
                            {event && <><ChevronRight size={10} className="text-slate-300 shrink-0" /><span className="text-sm font-bold text-indigo-600 truncate">{event}</span></>}
                          </div>
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform ${openDropdown === 'event' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {openDropdown === 'event' && (
                      <div className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                        {objectiveStage === 'goal' ? (
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 tracking-widest px-2">Select conversion event</p>
                            <div className="space-y-1">
                              {availableGoals.map(goal => (
                                <button
                                  key={goal.value}
                                  onClick={() => {
                                    setAdsetGoal(goal.value);
                                    if (goal.needsEvent) {
                                      setObjectiveStage('event');
                                    } else {
                                      setEvent('');
                                      setOpenDropdown(null);
                                    }
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                                    adsetGoal === goal.value ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'
                                  }`}
                                >
                                  {goal.label}
                                  {goal.needsEvent ? <ArrowRight size={12} className="opacity-40 group-hover:translate-x-1 transition-all" /> : (adsetGoal === goal.value && <CheckCircle2 size={12} />)}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setObjectiveStage('goal')} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                                <ChevronLeft size={16} />
                              </button>
                              <p className="text-[10px] font-black text-slate-400 tracking-widest">BACK</p>
                            </div>
                            <div className="relative px-1">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5" />
                              <input 
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/10"
                                placeholder="Search events..."
                                value={eventSearch}
                                onChange={(e) => setEventSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            <div className="max-h-[240px] overflow-y-auto custom-scrollbar px-1 space-y-1">
                              {filteredEvents.map(ev => (
                                <button
                                  key={ev}
                                  onClick={() => {
                                    setEvent(ev);
                                    setOpenDropdown(null);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                    event === ev ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-slate-50 text-slate-600'
                                  }`}
                                >
                                  {ev}
                                  {event === ev && <Check size={12} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1.5 mt-6">
                  <Info size={12} className="text-indigo-300" />
                  如果您目前无法确定，可以在 URL 分析完成后根据 AI 建议再填写。
                </p>
              </div>

              {/* Card 2: Add Product */}
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><ShoppingBag size={20} /></div>
                   <h3 className="text-xl font-black text-slate-900">添加投放产品</h3>
                </div>
                <ProductSelector 
                  selectedProducts={selectedProducts} 
                  onSelectProducts={setSelectedProducts}
                  productCreatives={productCreativesMap}
                  onUpdateCreatives={handleUpdateProductCreatives}
                  onAnalysisStart={() => { setIsAnalyzing(true); setAnalysisFinished(false); }}
                  onAnalysisComplete={(reports) => { 
                    setIsAnalyzing(false); 
                    setAnalysisFinished(true); 
                    setProductReportsMap(reports);
                  }}
                  onReset={() => {
                    setAnalysisFinished(false);
                    setIsAnalyzing(false);
                  }}
                  hasGeneratedOnce={hasGeneratedOnce}
                  analysisFinished={analysisFinished}
                  isAnalyzing={isAnalyzing}
                  campaignType={campaignType}
                  onCampaignTypeChange={(type) => {
                    setCampaignType(type);
                    setAnalysisFinished(false);
                    setIsAnalyzing(false);
                  }}
                  selectedAccount={selectedAccount}
                  onSelectAccount={setSelectedAccount}
                />
              </div>

              {/* Reminder Component when creatives are missing */}
              {analysisFinished && isAnyProductMissingCreatives && campaignType !== 'CATALOG' && (
                <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-4">
                  <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-200 mb-8">
                    <Plus size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">请先添加至少一个素材</h3>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-md">
                    点击上方产品的 “AI” 或 “上传” 按钮填充创意资产。完成后系统将自动开启 Campaign 架构生成模块。
                  </p>
                </div>
              )}

              {/* Card 3: Strategy & Budget */}
              {analysisFinished && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                 <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-8">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Layers size={20} /></div>
                       <h3 className="text-xl font-black text-slate-900">架构策略与预算</h3>
                    </div>
                    <CampaignPlanView 
                      structure={structure} onStructureChange={setStructure}
                      campaignType={campaignType}
                      budgetType={budgetType} onBudgetTypeChange={setBudgetType}
                      dailyBudget={dailyBudget} onBudgetChange={setDailyBudget}
                      adsetAudiences={adsetAudiences} onToggleAudience={handleToggleAudienceType}
                      lalOptions={lalOptions} onToggleLalOption={handleToggleLalOption}
                      intOptions={intOptions} onToggleIntOption={handleToggleIntOption}
                      selectedProducts={selectedProducts}
                      productCreativesMap={productCreativesMap}
                      isExistingCampaign={!!selectedCampaignId}
                      selectedCampaign={selectedCampaign}
                      onSelectCampaign={() => setShowCampaignModal(true)}
                    />
                 </div>
              )}

              {/* Card 4: Advanced Settings */}
              {analysisFinished && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                 <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-8">
                    <button onClick={() => setAdvancedOpen(!advancedOpen)} className="w-full p-10 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><Settings size={20} /></div>
                           <h3 className="text-xl font-black text-slate-900">高级设置 (落地页 / 文案 / 排期)</h3>
                        </div>
                        <ChevronDown className={`transition-transform duration-300 ${advancedOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {advancedOpen && (
                        <div className="p-10 pt-0 space-y-12 border-t border-slate-50 mt-6">
                           
                           {/* Landing Page Strategy */}
                           <div className="space-y-6 pt-10">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-[10px] font-black text-slate-400 tracking-widest">投放落地页策略</label>
                              <Info size={12} className="text-slate-300" />
                            </div>
                            
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: 'PRODUCT', label: '投放单品落地页', desc: 'Direct Product SKU', icon: <Tag size={18} /> },
                                  { id: 'CATEGORY', label: '投放类目落地页', desc: 'Collection / Search', icon: <Layout size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setLpType(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                                      lpType === opt.id 
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50' 
                                        : 'bg-transparent border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${lpType === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-black ${lpType === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>{opt.label}</p>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {lpType === 'PRODUCT' ? (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                    <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 mb-4">
                                       <div className="flex items-start gap-4">
                                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                            <Target size={20} />
                                          </div>
                                          <div>
                                            <h4 className="text-xs font-black text-slate-900 tracking-tight">自动路由至产品单页</h4>
                                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                                              系统将使用所选产品的原始落地页。您可以在下方为所有单品 URL 统一增加 UTM 追踪参数。
                                            </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">统一 UTM 追踪参数</label>
                                      <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                          <Settings size={22} />
                                        </div>
                                        <input 
                                          type="text"
                                          value={productLpUtm}
                                          onChange={(e) => setProductLpUtm(e.target.value)}
                                          placeholder="utm_source=meta&utm_medium=paid&utm_campaign={{product_id}}"
                                          className="w-full h-14 pl-16 pr-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 focus:shadow-xl transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">落地页模板 URL (支持动态参数)</label>
                                      <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                          <Link2 size={24} />
                                        </div>
                                        <input 
                                          type="text"
                                          value={lpTemplateUrl}
                                          onChange={(e) => setLpTemplateUrl(e.target.value)}
                                          placeholder="https://example.com/collections/{{product_name}}"
                                          className="w-full h-16 pl-16 pr-24 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 focus:shadow-xl transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                           </div>

                           {/* Ad Copy Strategy */}
                           <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-[10px] font-black text-slate-400 tracking-widest">广告文案标题策略</label>
                              <Info size={12} className="text-slate-300" />
                            </div>
                            
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: 'AI_CUSTOM', label: 'AI 为每个产品定制', desc: 'Custom per SKU', icon: <Sparkles size={18} /> },
                                  { id: 'UNIFIED', label: '为所有广告输入统一文案', desc: 'Unified Headlines & Text', icon: <FileText size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setCopyStrategy(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                                      copyStrategy === opt.id 
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50' 
                                        : 'bg-transparent border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${copyStrategy === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-black ${copyStrategy === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>{opt.label}</p>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {copyStrategy === 'AI_CUSTOM' ? (
                                  <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 animate-in fade-in slide-in-from-left-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                          <Sparkles size={24} />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-slate-900 tracking-tight">AI 智能深度定制文案</h4>
                                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">
                                            基于落地页分析报告，Agent 将为每一个产品自动撰写差异化的广告标题和正文，最大化转化率。
                                          </p>
                                        </div>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">统一广告标题</label>
                                      <input 
                                        type="text"
                                        value={unifiedHeadline}
                                        onChange={(e) => setUnifiedHeadline(e.target.value)}
                                        placeholder="输入统一标题..."
                                        className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 focus:shadow-xl transition-all"
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">统一广告正文</label>
                                      <textarea 
                                        value={unifiedBody}
                                        onChange={(e) => setUnifiedBody(e.target.value)}
                                        placeholder="输入统一正文文案..."
                                        className="w-full p-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 h-28 focus:border-indigo-600 focus:shadow-xl transition-all resize-none"
                                      />
                                    </div>
                                  </div>
                                )} 
                              </div>
                            </div>
                           </div>

                           {/* Schedule */}
                           <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                              <label className="text-[10px] font-black text-slate-400 tracking-widest">广告投放排期</label>
                              <Info size={12} className="text-slate-300" />
                            </div>
                            
                            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
                              <div className="flex flex-col gap-3 w-full md:w-80">
                                {[
                                  { id: 'CONTINUOUS', label: '长期投放', desc: 'No End Date', icon: <Clock size={18} /> },
                                  { id: 'SCHEDULED', label: '定期投放', desc: 'Custom Date Range', icon: <Calendar size={18} /> },
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setScheduleType(opt.id)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                                      scheduleType === opt.id 
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50' 
                                        : 'bg-transparent border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${scheduleType === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                                      {opt.icon}
                                    </div>
                                    <div className="text-left">
                                      <p className={`text-xs font-black ${scheduleType === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>{opt.label}</p>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{opt.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 flex flex-col justify-center">
                                {scheduleType === 'CONTINUOUS' ? (
                                  <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 animate-in fade-in slide-in-from-left-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                          <Clock size={24} />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-slate-900 tracking-tight">常青投放模式</h4>
                                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">
                                            广告发布后将立即开始投放，并且不设具体的结束日期，直至您手动暂停或预算消耗完毕。
                                          </p>
                                        </div>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">开始日期</label>
                                        <input 
                                          type="date"
                                          value={startDate}
                                          onChange={(e) => setStartDate(e.target.value)}
                                          className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 transition-all"
                                        />
                                      </div>
                                      <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">结束日期</label>
                                        <input 
                                          type="date"
                                          value={endDate}
                                          onChange={(e) => setEndDate(e.target.value)}
                                          className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 focus:border-indigo-600 transition-all"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 tracking-widest px-1">快速设置时长</label>
                                      <div className="flex gap-3">
                                        {[3, 7, 14, 30].map(days => (
                                          <button
                                            key={days}
                                            onClick={() => handleQuickSchedule(days)}
                                            className="flex-1 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                          >
                                            {days} 天
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )} 
                              </div>
                            </div>
                           </div>

                        </div>
                    )}
                 </div>
              )}

              {/* Preview Button */}
              {analysisFinished && (!isAnyProductMissingCreatives || campaignType === 'CATALOG') && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setView('preview')}
                    className="group relative w-full max-w-4xl py-8 px-16 rounded-[2.5rem] font-black text-2xl flex items-center justify-center bg-slate-900 text-white hover:bg-black shadow-2xl transition-all"
                  >
                    <Sparkles size={28} className="mr-5" />
                    预览发布计划
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Preview View Wrapper - Keeping the original card style for the preview page
            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative mb-20 animate-fade-in">
              <div className="p-10 md:p-14">
                <CampaignPreviewView 
                  structure={structure}
                  budgetType={budgetType} 
                  dailyBudget={dailyBudget}
                  initialAdsetAudiences={adsetAudiences} 
                  productCreativesMap={productCreativesMap}
                  selectedProducts={selectedProducts}
                  brand={detectedBrand}
                  onBack={() => setView('config')}
                  onPublish={() => setShowPublishModal(true)}
                  campaignName={selectedCampaign?.name || 'NEW-AI-CAMPAIGN-001'}
                  optimizationEvent={event}
                  landingPageType={lpType}
                  landingPageTemplate={lpTemplateUrl}
                  productUtm={productLpUtm}
                  copyStrategy={copyStrategy}
                  unifiedHeadline={unifiedHeadline}
                  unifiedBody={unifiedBody}
                  campaignType={campaignType}
                />
              </div>
            </div>
          )}
          
        </div>
      </div>

      {showCampaignModal && <CampaignSearchModal />}
      {showPublishModal && <PublishModal />}
      
      {showAccountSelector && <AccountSelectorModal selectedAccount={selectedAccount} onSelect={setSelectedAccount} onClose={() => setShowAccountSelector(false)} />}

    </div>
  );
};

const AccountChoiceModal = ({ onSelect, onClose, selectedAccountType, setSelectedAccountType, renderAccountChoiceStep }) => {
  const zIndex = useZIndex(true);
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 animate-in fade-in duration-300" style={{ zIndex }}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="px-10 pt-10 pb-6 flex items-center justify-between shrink-0"><h2 className="text-2xl font-black text-slate-900 tracking-tight">Two ways to run your ads</h2><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button></div>
        <div className="flex-1 overflow-y-auto px-10 pb-6 custom-scrollbar">{renderAccountChoiceStep()}</div>
        <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0"><button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-6 py-2 transition-colors">Cancel</button><button onClick={() => onSelect(selectedAccountType)} disabled={!selectedAccountType} className="px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all disabled:opacity-30 flex items-center gap-2">Confirm <ChevronRight size={16} /></button></div>
      </div>
    </div>
  );
};

const AdsGoReminderModal = ({ onClose, setShowPublishModal }) => {
  const zIndex = useZIndex(true);
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 animate-in fade-in duration-300" style={{ zIndex }}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl flex flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
        <div className="flex flex-col items-center text-center space-y-6 pt-4"><div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center animate-bounce"><Loader2 size={40} className="text-emerald-600 animate-spin" /></div><div className="space-y-3"><h3 className="text-lg font-black text-slate-900 tracking-tight">Setting up your dedicated ad account</h3><p className="text-sm font-medium text-slate-600 leading-relaxed">Once your account is ready, you can republish from the <button onClick={() => { setShowPublishModal(false); window.location.href = '/ai-optimize/draft-recom'; }} className="text-indigo-600 hover:text-indigo-700 underline transition-colors bg-transparent border-0 p-0 cursor-pointer">Draft & Recom.</button> page.</p><p className="text-xs font-bold text-slate-500">Contact us at<br/><a href="mailto:support@adsgo.ai" className="text-indigo-600 hover:text-indigo-700 transition-colors">support@adsgo.ai</a> for real-time updates</p></div></div>
      </div>
    </div>
  );
};

const AccountSelectorModal = ({ selectedAccount, onSelect, onClose }) => {
  const zIndex = useZIndex(true);
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
      style={{ zIndex }}
    >
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Briefcase size={24} /></div>
            <div>
              <h4 className="text-xl font-black text-slate-900">切换广告账户</h4>
              <p className="text-slate-400 text-xs font-bold tracking-widest mt-1">Select an active ad account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"><X size={24} /></button>
        </div>
        <div className="space-y-3">
          {MOCK_ACCOUNTS.map(acc => (
            <button
              key={acc.id}
              onClick={() => {
                onSelect(acc);
                onClose();
              }}
              className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
                selectedAccount?.id === acc.id ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`p-2 rounded-lg ${selectedAccount?.id === acc.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Briefcase size={16} /></div>
                <div>
                  <p className={`text-sm font-black ${selectedAccount?.id === acc.id ? 'text-indigo-900' : 'text-slate-600'}`}>{acc.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">ID: {acc.id}</p>
                </div>
              </div>
              {selectedAccount?.id === acc.id && <Check size={20} className="text-indigo-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchGenerateAds;
