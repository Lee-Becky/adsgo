import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ArrowLeft, Loader2, Info, ChevronDown, 
  Sparkles, Target, User, Layers, Edit2, Trash2,
  Search, ChevronRight, Image as ImageIcon, Plus,
  HelpCircle, AlertCircle, History, Download, FileText
} from 'lucide-react';

// --- Shared Internal Components (Synced with SetupProductModal) ---

const TagEditor = ({ tags = [], onTagsChange, placeholder, label = "" }) => {
  const [val, setVal] = useState('');
  const safeTags = Array.isArray(tags) ? tags : [];
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {safeTags.map((t, i) => (
        <span 
          key={i} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F4FF] border border-[#E0E7FF] rounded-2xl text-[13px] font-black text-[#312E81] transition-all hover:bg-[#E0E7FF] animate-in zoom-in-95 duration-200 cursor-default group/tag shadow-sm"
        >
          {t}
          <button 
            onClick={() => onTagsChange(safeTags.filter((_, idx) => idx !== i))} 
            className="text-[#94A3B8] hover:text-[#EF4444] transition-colors"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </span>
      ))}
      
      <div className="relative group/input min-w-[120px]">
        <input 
          className="bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-2xl px-4 py-2 text-[13px] font-bold text-[#64748B] outline-none w-full transition-all focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 shadow-inner placeholder:text-[#CBD5E1]"
          placeholder={safeTags.length === 0 ? placeholder : `+ ${label}`}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && val.trim()) {
              e.preventDefault();
              if (!safeTags.includes(val.trim())) {
                onTagsChange([...safeTags, val.trim()]);
              }
              setVal('');
            }
          }}
        />
      </div>
    </div>
  );
};

const AssetGrid = ({ title, subtitle, assets = [], onAssetsChange, maxCount = 99, showExamples = false, isExpandable = false, isExpanded = false, onToggle }) => {
  const safeAssets = Array.isArray(assets) ? assets : [];
  const needsMoreCard = isExpandable && !isExpanded && safeAssets.length > 4;
  const displayAssets = needsMoreCard ? safeAssets.slice(0, 3) : safeAssets;
  const moreCount = safeAssets.length - 3;
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newAssets = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));

    if (onAssetsChange) {
      onAssetsChange([...safeAssets, ...newAssets].slice(0, maxCount));
    }
    e.target.value = '';
  };

  const removeAsset = (index) => {
    if (onAssetsChange) {
      onAssetsChange(safeAssets.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple={maxCount > 1}
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-info-400 rounded-full" />
            <h5 className="text-[13px] font-black text-neutral-900">{title}</h5>
          </div>
          <p className="text-[10px] text-neutral-400 font-medium leading-tight">{subtitle}</p>
        </div>
      </div>

      <div className={`flex flex-wrap gap-4 items-start ${isExpandable && !isExpanded ? 'overflow-hidden max-h-[140px]' : ''}`}>
        {safeAssets.length < maxCount && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-[140px] aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-all group active:scale-[0.97] shrink-0"
          >
            <Plus size={32} className="text-neutral-300 group-hover:text-primary-500 transition-colors" />
          </div>
        )}

        {displayAssets.map((asset, i) => (
          <div key={i} className="w-[140px] aspect-square bg-white border border-neutral-100 rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all shrink-0">
            <img src={asset.url || `https://picsum.photos/seed/${title}${i}/300/300`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => removeAsset(i)}
                className="p-2 bg-white rounded-xl text-rose-500 shadow-lg hover:scale-110 active:scale-90 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {needsMoreCard && (
          <div 
            onClick={onToggle}
            className="w-[140px] aspect-square bg-neutral-900 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-black transition-all shadow-xl group shrink-0"
          >
            <span className="text-lg font-black text-white">{moreCount} more</span>
            <span className="text-[10px] font-bold text-white/60 mt-1">assets</span>
          </div>
        )}

        {isExpandable && isExpanded && (
          <div 
            onClick={onToggle}
            className="w-[140px] aspect-square bg-neutral-100 border border-neutral-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-all group shrink-0"
          >
            <ChevronRight size={24} className="text-neutral-400 rotate-180 mb-1" />
            <span className="text-[10px] font-black text-neutral-500">Collapse</span>
          </div>
        )}

        {showExamples && (
          <div className="flex-1 min-w-[300px] bg-neutral-50/80 border border-neutral-100 rounded-xl p-5 flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center relative shadow-sm">
                  <img src="/Transparent image.webp" alt="" className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-neutral-500">Transparent image</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center relative shadow-sm">
                  <img src="/Blurry image.webp" alt="" className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <X size={12} strokeWidth={3} className="text-white" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-neutral-500">Blurry image</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center relative shadow-sm">
                  <img src="/Solid Clean background.webp" alt="" className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-neutral-500">Solid / Clean background</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center relative shadow-sm">
                  <img src="/Messy background.webp" alt="" className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <X size={12} strokeWidth={3} className="text-white" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-neutral-500">Messy background</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchableSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedOption = safeOptions.find(opt => opt.value === value);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-neutral-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary-400 ring-4 ring-primary-500/5' : error ? 'border-rose-400' : 'border-neutral-200 hover:border-neutral-300 shadow-sm'}`}
      >
        <span className={!value ? 'text-neutral-300' : ''}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-full bg-white border border-neutral-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearchable && (
            <div className="p-3 border-b border-neutral-50 bg-neutral-50/50">
              <input 
                autoFocus
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary-400"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <div className="max-h-[240px] overflow-y-auto p-2">
            {filteredOptions.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer mb-1 last:mb-0 ${value === opt.value ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-50'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchableTreeSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredParent, setHoveredParent] = useState(null);
  const safeOptions = Array.isArray(options) ? options : [];

  const getFilteredTree = () => {
    if (!searchTerm) return safeOptions;
    return safeOptions.map(parent => ({
      ...parent,
      children: parent.children ? parent.children.filter(child => 
        child.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.label.toLowerCase().includes(searchTerm.toLowerCase())
      ) : []
    })).filter(parent => (parent.children && parent.children.length > 0) || parent.label.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filteredTree = getFilteredTree();
  
  const getDisplayValue = () => {
    if (!value) return placeholder;
    for (const parent of safeOptions) {
      const child = parent.children?.find(c => c.value === value);
      if (child) return child.label;
      if (parent.value === value) return parent.label;
    }
    return placeholder;
  };

  useEffect(() => {
    if (value && !hoveredParent) {
      const parent = safeOptions.find(p => p.children?.some(c => c.value === value));
      if (parent) setHoveredParent(parent);
    }
  }, [value, safeOptions]);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-neutral-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary-400 ring-4 ring-primary-500/5' : error ? 'border-rose-400' : 'border-neutral-200 hover:border-neutral-300 shadow-sm'}`}
      >
        <span className={!value ? 'text-neutral-300' : ''}>{getDisplayValue()}</span>
        <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-[560px] bg-white border border-neutral-100 rounded-xl shadow-2xl flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 h-[380px]">
          <div className={`w-[240px] border-r border-neutral-100 flex flex-col bg-neutral-50/30`}>
            {isSearchable && (
              <div className="p-4 border-b border-neutral-100 bg-white sticky top-0 z-10">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    autoFocus
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:border-primary-400 transition-all"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {filteredTree.map((parent) => (
                <div 
                  key={parent.value}
                  onMouseEnter={() => setHoveredParent(parent)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all mb-1 flex items-center justify-between group ${hoveredParent?.value === parent.value ? 'bg-white text-primary-600 shadow-sm border border-neutral-100' : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'}`}
                >
                  <span className="truncate pr-2">{parent.label}</span>
                  {parent.children?.length > 0 && <ChevronRight size={14} className={`transition-transform ${hoveredParent?.value === parent.value ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white flex flex-col">
            <div className="p-4 border-b border-neutral-50">
              <h6 className="text-[10px] font-black text-neutral-400">
                {hoveredParent ? hoveredParent.label : 'Select Category'}
              </h6>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {hoveredParent?.children?.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                  {hoveredParent.children.map((child) => (
                    <div 
                      key={child.value}
                      onClick={() => {
                        onChange(child.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${value === child.value ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}`}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-300 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                    <Layers size={20} className="opacity-20" />
                  </div>
                  <p className="text-[10px] font-bold tracking-tighter opacity-40">
                    {hoveredParent ? 'No sub-categories' : 'Hover a category to view details'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---

const ProductDetails = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState('basicInfo');
  
  const [productForm, setProductForm] = useState({
    name: product?.name || '',
    url: product?.url || '',
    category: product?.category || '',
    description: product?.description || '',
    priceRange: product?.priceRange || '',
    type: product?.type || 'Non-type',
    usps: Array.isArray(product?.usps) ? product.usps : [''],
    positioning: {
      valueProposition: product?.positioning?.valueProposition || [],
      features: product?.positioning?.features || [],
      usageScenarios: product?.positioning?.usageScenarios || [],
      painPoints: product?.positioning?.painPoints || [],
      buyingMotivations: product?.positioning?.buyingMotivations || []
    },
    audience: Array.isArray(product?.audience) && product.audience.length > 0 
      ? product.audience 
      : [{ id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }],
    assets: {
      main: product?.assets?.main || [],
      detailed: product?.assets?.detailed || [],
      demo: product?.assets?.demo || [],
      testimonial: product?.assets?.testimonial || [],
      lifestyle: product?.assets?.lifestyle || [],
      painpoints: product?.assets?.painpoints || [],
      comparison: product?.assets?.comparison || [],
      result: product?.assets?.result || [],
      others: product?.assets?.others || [],
      problem: product?.assets?.problem || [],
      intro: product?.assets?.intro || [],
      action: product?.assets?.action || [],
      environment: product?.assets?.environment || [],
      team: product?.assets?.team || []
    },
    historicalRecords: {
      audienceTags: product?.historicalRecords?.audienceTags || ['Tech Enthusiasts', '25-35 Years Old', 'Mobile First'],
      creativeTags: product?.historicalRecords?.creativeTags || ['Cinematic', 'Minimalist Style', 'UGC Content'],
      report: product?.historicalRecords?.report || 'product analysis report.md'
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    detailed: false, others: false, problem: false, intro: false,
    action: false, result: false, testimonial: false, environment: false,
    team: false, comparison: false
  });

  const scrollContainerRef = useRef(null);
  const sectionRefs = {
    basicInfo: useRef(null),
    usps: useRef(null),
    positioning: useRef(null),
    audience: useRef(null),
    assets: useRef(null),
    historical: useRef(null)
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateForm = (field, value) => {
    setProductForm(prev => {
      if (field === 'type' && value !== prev.type) {
        let newAssets = { ...prev.assets };
        if (value === 'Non-type') {
          const allAssets = Object.keys(prev.assets).reduce((acc, key) => [...acc, ...(prev.assets[key] || [])], []);
          const uniqueAssets = Array.from(new Map(allAssets.map(item => [item.url, item])).values());
          Object.keys(newAssets).forEach(key => newAssets[key] = []);
          newAssets.others = uniqueAssets;
        } else if (prev.type === 'Non-type' && (value === 'Physical Goods' || value === 'Service')) {
          const existingOthers = [...(prev.assets.others || [])];
          Object.keys(newAssets).forEach(key => { if (key !== 'others') newAssets[key] = []; });
          newAssets.others = existingOthers;
        }
        return { ...prev, [field]: value, assets: newAssets };
      }
      return { ...prev, [field]: value };
    });
  };

  const updatePositioning = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      positioning: { ...prev.positioning, [field]: value }
    }));
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const [id, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 px-8 py-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="pointer-events-auto p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-white rounded-full transition-all shadow-sm border border-neutral-100 bg-white/50"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
          </div>
        </div>
        <button className="pointer-events-auto px-10 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all active:scale-95">
          Save changes
        </button>
      </header>

      <div className="flex-1 max-w-[1400px] mx-auto w-full p-10 flex gap-12">
        {/* Left Sidebar Navigation */}
        <aside className="w-72 shrink-0">
          <div className="sticky top-32 space-y-6">
            <nav className="p-3 bg-white border border-neutral-100 rounded-2xl shadow-sm space-y-1">
              {[
                { id: 'basicInfo', label: 'Basic Info', icon: Info, color: 'indigo' },
                { id: 'usps', label: 'Selling Points', icon: Sparkles, color: 'amber' },
                { id: 'positioning', label: 'Product Positioning', icon: Target, color: 'purple' },
                { id: 'audience', label: 'Audience Profile', icon: User, color: 'emerald' },
                { id: 'assets', label: 'Product Assets', icon: Layers, color: 'blue' },
                { id: 'historical', label: 'High-Performance', icon: History, color: 'rose' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                    activeTab === tab.id 
                      ? `bg-${tab.color}-50 text-${tab.color}-600` 
                      : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600'
                  }`}
                >
                  <tab.icon size={20} className={activeTab === tab.id ? `text-${tab.color}-500` : 'text-neutral-300 group-hover:text-neutral-400'} />
                  <span className="text-sm font-black tracking-tight">{tab.label}</span>
                  {activeTab === tab.id && <div className={`w-1.5 h-1.5 rounded-full bg-${tab.color}-500 ml-auto`} />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <main ref={scrollContainerRef} className="flex-1 space-y-16 pb-32">
          
          <section ref={sectionRefs.basicInfo} className="bg-white border border-neutral-100 rounded-2xl p-10 shadow-sm space-y-10 scroll-mt-32">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
                <Info size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-neutral-900">Basic Info</h4>
                <p className="text-xs text-neutral-400 font-bold">Core details that help us describe and highlight your product.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-3 bg-primary-400 rounded-full" />
                    Product Name <span className="text-rose-500 font-black">*</span>
                  </label>
                  <input type="text" value={productForm.name || ''} onChange={(e) => updateForm('name', e.target.value)} className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-700 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 focus:outline-none transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-3 bg-primary-400 rounded-full" />
                    Product URL <span className="text-rose-500 font-black">*</span>
                  </label>
                  <input type="text" value={productForm.url || ''} onChange={(e) => updateForm('url', e.target.value)} placeholder="https://example.com/product" className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-700 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 focus:outline-none transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-5 space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-3 bg-primary-400 rounded-full" />
                    Category <span className="text-rose-500 font-black">*</span>
                  </label>
                  <SearchableTreeSelect options={[{ value: 'Business', label: 'Business Services', children: [{ value: 'Marketing', label: 'Marketing' }] }, { value: 'Tech', label: 'Technology', children: [{ value: 'AI', label: 'AI Tools' }] }]} value={productForm.category} onChange={(val) => updateForm('category', val)} placeholder="Select Category" />
                </div>
                <div className="col-span-4 space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-3 bg-primary-400 rounded-full" />
                    Price Range
                  </label>
                  <input type="text" value={productForm.priceRange || ''} onChange={(e) => updateForm('priceRange', e.target.value)} placeholder="e.g. $10 - $50" className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-700 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 focus:outline-none transition-all shadow-sm" />
                </div>
                <div className="col-span-3 space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-3 bg-primary-400 rounded-full" />
                    Product Type <span className="text-rose-500 font-black">*</span>
                  </label>
                  <SearchableSelect isSearchable={false} options={[{ value: 'Physical Goods', label: 'Physical Goods' }, { value: 'Service', label: 'Service' }, { value: 'Non-type', label: 'Non-type' }]} value={productForm.type} onChange={(val) => updateForm('type', val)} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary-400 rounded-full" />
                  Product Description
                </label>
                <div className="relative">
                  <textarea className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-5 text-sm font-bold text-neutral-700 min-h-[160px] resize-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm" value={productForm.description || ''} onChange={(e) => updateForm('description', e.target.value)} />
                  <div className="absolute bottom-4 right-6 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg"><span className="text-[10px] text-neutral-400 font-black">{(productForm.description || '').length}/5000</span></div>
                </div>
              </div>
            </div>
          </section>

          <section ref={sectionRefs.usps} className="bg-white border border-neutral-100 rounded-2xl p-10 shadow-sm space-y-10 scroll-mt-32">
            <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-warning-50 flex items-center justify-center text-warning-600 shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-neutral-900">Selling Points (USPs)</h4>
                  <p className="text-xs text-neutral-400 font-bold">Highlight the unique benefits of your product.</p>
                </div>
              </div>
              <span className="px-4 py-1 bg-neutral-100 rounded-full text-[10px] font-black text-neutral-500">{(productForm.usps || []).length}/20</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {(productForm.usps || ['']).map((usp, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1 relative group/input">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[11px] font-black text-neutral-400 group-focus-within/input:bg-warning-100 group-focus-within/input:text-warning-600 transition-all">{i + 1}</div>
                    <input type="text" value={usp} onChange={(e) => { const newUsps = [...(productForm.usps || [''])]; newUsps[i] = e.target.value; updateForm('usps', newUsps); }} placeholder="e.g., AI Auto Management" className="w-full bg-white border border-neutral-200 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold text-neutral-700 focus:border-warning-400 focus:ring-4 focus:ring-warning-500/5 outline-none transition-all shadow-sm" />
                  </div>
                  <button onClick={() => { const newUsps = (productForm.usps || []).filter((_, idx) => idx !== i); updateForm('usps', newUsps.length > 0 ? newUsps : ['']); }} className="p-3 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                </div>
              ))}
              {(productForm.usps || []).length < 20 && (
                <button onClick={() => updateForm('usps', [...(productForm.usps || []), ''])} className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 hover:border-warning-300 hover:text-warning-600 hover:bg-warning-50/30 transition-all font-black text-xs shadow-sm"><Plus size={18} strokeWidth={3} /> Add Selling Point</button>
              )}
            </div>
          </section>

          <section ref={sectionRefs.positioning} className="bg-white border border-neutral-100 rounded-2xl p-10 shadow-sm space-y-10 scroll-mt-32">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                <Target size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-neutral-900">Product Positioning</h4>
                <p className="text-xs text-neutral-400 font-bold">Define your market stance and core value.</p>
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-purple-400 rounded-full" />Value Proposition</label>
                <TagEditor tags={productForm.positioning?.valueProposition || []} onTagsChange={(tags) => updatePositioning('valueProposition', tags)} placeholder="+ Proposition" label="Proposition" />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-purple-400 rounded-full" />Feature Keywords</label>
                  <TagEditor tags={productForm.positioning?.features || []} onTagsChange={(tags) => updatePositioning('features', tags)} placeholder="+ Keyword" label="Keyword" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-purple-400 rounded-full" />Usage Scenarios</label>
                  <TagEditor tags={productForm.positioning?.usageScenarios || []} onTagsChange={(tags) => updatePositioning('usageScenarios', tags)} placeholder="+ Scenario" label="Scenario" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-purple-400 rounded-full" />Pain Points</label>
                  <TagEditor tags={productForm.positioning?.painPoints || []} onTagsChange={(tags) => updatePositioning('painPoints', tags)} placeholder="+ Point" label="Point" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-purple-400 rounded-full" />Buying Motivations</label>
                  <TagEditor tags={productForm.positioning?.buyingMotivations || []} onTagsChange={(tags) => updatePositioning('buyingMotivations', tags)} placeholder="+ Motivation" label="Motivation" />
                </div>
              </div>
            </div>
          </section>

          <section ref={sectionRefs.audience} className="bg-white border border-neutral-100 rounded-2xl p-10 shadow-sm space-y-10 scroll-mt-32">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-success-50 flex items-center justify-center text-success-600 shadow-sm">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-neutral-900">Audience Profile</h4>
                <p className="text-xs text-neutral-400 font-bold">Describe your ideal target customers.</p>
              </div>
            </div>
            <div className="space-y-10">
              {(productForm.audience || []).map((profile, idx) => (
                <div key={profile.id} className="p-10 bg-neutral-50/50 border border-neutral-100 rounded-2xl space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:border-success-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-success-100 flex items-center justify-center text-success-600 shadow-inner"><User size={28} strokeWidth={2.5} /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <input type="text" value={profile.name || ''} onChange={(e) => { const newAudience = (productForm.audience || []).map(a => a.id === profile.id ? { ...a, name: e.target.value } : a); updateForm('audience', newAudience); }} className="bg-transparent border-none p-0 text-xl font-black text-neutral-900 focus:ring-0 outline-none w-auto min-w-[150px]" />
                          <Edit2 size={16} className="text-neutral-300 group-hover:text-success-500 transition-colors" />
                        </div>
                        <p className="text-xs text-neutral-400 font-bold">Set specific targeting rules</p>
                      </div>
                    </div>
                    <button onClick={() => { const newAudience = (productForm.audience || []).filter(a => a.id !== profile.id); updateForm('audience', newAudience.length > 0 ? newAudience : [{ id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }]); }} className="p-3 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-success-400 rounded-full" />Age Range</label>
                      <input type="text" value={profile.age || ''} onChange={(e) => { const newAudience = (productForm.audience || []).map(a => a.id === profile.id ? { ...a, age: e.target.value } : a); updateForm('audience', newAudience); }} placeholder="e.g. 25-45" className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-700 focus:border-success-400 focus:ring-4 focus:ring-success-500/5 outline-none shadow-sm transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-success-400 rounded-full" />Gender</label>
                      <SearchableSelect isSearchable={false} options={[{ value: 'All', label: 'All Genders' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]} value={profile.gender || 'All'} onChange={(val) => { const newAudience = (productForm.audience || []).map(a => a.id === profile.id ? { ...a, gender: val } : a); updateForm('audience', newAudience); }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2"><div className="w-1 h-3 bg-success-400 rounded-full" />Interests / Traits</label>
                    <TagEditor tags={profile.traits || []} onTagsChange={(tags) => { const newAudience = (productForm.audience || []).map(a => a.id === profile.id ? { ...a, traits: tags } : a); updateForm('audience', newAudience); }} placeholder="+ Interest" label="Interest" />
                  </div>
                </div>
              ))}
              <button onClick={() => updateForm('audience', [...(productForm.audience || []), { id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }])} className="w-full py-5 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 hover:border-success-300 hover:text-success-600 hover:bg-success-50/30 transition-all font-black text-sm flex items-center justify-center gap-2 shadow-sm"><Plus size={20} strokeWidth={3} /> Add Audience Profile</button>
            </div>
          </section>

          <section ref={sectionRefs.assets} className="bg-white border border-neutral-100 rounded-2xl p-10 shadow-sm space-y-12 scroll-mt-32">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-info-50 flex items-center justify-center text-info-600 shadow-sm">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-neutral-900">Product Assets</h4>
                <p className="text-xs text-neutral-400 font-bold">Manage images and videos for your ad creative.</p>
              </div>
            </div>

            {productForm.type === 'Physical Goods' ? (
              <div className="space-y-16">
                <AssetGrid title="Product main photo" subtitle="A clear view of the product by itself." maxCount={1} assets={productForm.assets?.main} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, main: a })} showExamples={(productForm.assets?.main || []).length === 0} />
                <AssetGrid title="Product detailed shots" subtitle="Extra visuals highlighting specific parts." assets={productForm.assets?.detailed} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, detailed: a })} isExpandable isExpanded={expandedSections.detailed} onToggle={() => toggleSection('detailed')} />
                <AssetGrid title="Product demo" subtitle="Demonstrate how the product works." assets={productForm.assets?.demo} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, demo: a })} />
                <AssetGrid title="Customer testimonial" subtitle="Customer feedback and social proof." assets={productForm.assets?.testimonial} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, testimonial: a })} />
                <AssetGrid title="Lifestyle" subtitle="The product in a natural environment." assets={productForm.assets?.lifestyle} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, lifestyle: a })} />
                <AssetGrid title="Painpoints" subtitle="Highlight frustrations before using the product." assets={productForm.assets?.painpoints} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, painpoints: a })} />
                <AssetGrid title="Comparison" subtitle="Before-and-after differences." assets={productForm.assets?.comparison} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, comparison: a })} />
                <AssetGrid title="Result / Outcome" subtitle="Positive results achieved after use." assets={productForm.assets?.result} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, result: a })} />
                <AssetGrid title="Others" subtitle="Assets without specific labels" assets={productForm.assets?.others} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, others: a })} isExpandable isExpanded={expandedSections.others} onToggle={() => toggleSection('others')} />
              </div>
            ) : productForm.type === 'Service' ? (
              <div className="space-y-16">
                <AssetGrid title="Problem / Pain points" subtitle="The issue customers face before your service." assets={productForm.assets?.problem} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, problem: a })} isExpandable isExpanded={expandedSections.problem} onToggle={() => toggleSection('problem')} />
                <AssetGrid title="Business intro" subtitle="Introduce your company or brand identity." assets={productForm.assets?.intro} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, intro: a })} isExpandable isExpanded={expandedSections.intro} onToggle={() => toggleSection('intro')} />
                <AssetGrid title="Service in action" subtitle="Process while delivering the service." assets={productForm.assets?.action} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, action: a })} isExpandable isExpanded={expandedSections.action} onToggle={() => toggleSection('action')} />
                <AssetGrid title="Result / Outcome" subtitle="Positive result after service is completed." assets={productForm.assets?.result} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, result: a })} isExpandable isExpanded={expandedSections.result} onToggle={() => toggleSection('result')} />
                <AssetGrid title="Customer testimonial" subtitle="Quotes and user experiences." assets={productForm.assets?.testimonial} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, testimonial: a })} isExpandable isExpanded={expandedSections.testimonial} onToggle={() => toggleSection('testimonial')} />
                <AssetGrid title="Service Environment" subtitle="Real service setting and layout." assets={productForm.assets?.environment} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, environment: a })} isExpandable isExpanded={expandedSections.environment} onToggle={() => toggleSection('environment')} />
                <AssetGrid title="Team portrait" subtitle="Features your service team." assets={productForm.assets?.team} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, team: a })} isExpandable isExpanded={expandedSections.team} onToggle={() => toggleSection('team')} />
                <AssetGrid title="Comparison" subtitle="Before-and-after differences." assets={productForm.assets?.comparison} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, comparison: a })} isExpandable isExpanded={expandedSections.comparison} onToggle={() => toggleSection('comparison')} />
                <AssetGrid title="Others" subtitle="Assets without specific labels" assets={productForm.assets?.others} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, others: a })} isExpandable isExpanded={expandedSections.others} onToggle={() => toggleSection('others')} />
              </div>
            ) : (
              <AssetGrid title="Assets" subtitle="Upload product images or video assets." assets={productForm.assets?.others} onAssetsChange={(a) => updateForm('assets', { ...productForm.assets, others: a })} isExpandable isExpanded={expandedSections.others} onToggle={() => toggleSection('others')} />
            )}
          </section>

          {/* 6. Conversion Performance Section */}
          <section ref={sectionRefs.historical} className="bg-white border border-neutral-100 rounded-2xl p-10 shadow-sm space-y-10 scroll-mt-32 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm">
                <History size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-neutral-900">High-Performance</h4>
                <p className="text-xs text-neutral-400 font-bold">Data-driven insights from previous high-performing campaigns.</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                  <div className="w-1 h-3 bg-rose-400 rounded-full" />
                  High-conversion Audience Tags
                </label>
                <TagEditor 
                  tags={productForm.historicalRecords.audienceTags} 
                  onTagsChange={(tags) => setProductForm(prev => ({
                    ...prev, 
                    historicalRecords: { ...prev.historicalRecords, audienceTags: tags }
                  }))}
                  placeholder="+ Audience Tag"
                  label="Tag"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                  <div className="w-1 h-3 bg-rose-400 rounded-full" />
                  High-conversion Creative Tags
                </label>
                <TagEditor 
                  tags={productForm.historicalRecords.creativeTags} 
                  onTagsChange={(tags) => setProductForm(prev => ({
                    ...prev, 
                    historicalRecords: { ...prev.historicalRecords, creativeTags: tags }
                  }))}
                  placeholder="+ Creative Tag"
                  label="Tag"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-neutral-400 flex items-center gap-2">
                  <div className="w-1 h-3 bg-rose-400 rounded-full" />
                  Report
                </label>
                <div className="max-w-md group">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 flex items-center justify-between transition-all hover:bg-white hover:shadow-xl hover:border-rose-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-neutral-700">{productForm.historicalRecords.report}</p>
                        <p className="text-[10px] text-neutral-400 font-bold mt-0.5">
                          {new Date().toLocaleString('zh-CN', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit',
                            hour12: false 
                          }).replace(/\//g, '-')}
                        </p>
                      </div>
                    </div>
                    <button className="p-3 bg-white text-neutral-400 hover:text-primary-600 rounded-xl shadow-sm border border-neutral-50 hover:scale-110 transition-all active:scale-95">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;
