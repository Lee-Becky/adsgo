import React, { useState, useEffect } from 'react';
import { 
  X, ArrowLeft, Loader2, Info, ChevronDown, 
  Sparkles, Target, User, Layers, Edit2, Trash2,
  Search, ChevronRight, Image as ImageIcon, Plus
} from 'lucide-react';

// --- Shared Internal Components ---

const TagEditor = ({ tags = [], onTagsChange, placeholder, label = "" }) => {
  const [val, setVal] = useState('');
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((t, i) => (
        <span 
          key={i} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F4FF] border border-[#E0E7FF] rounded-2xl text-[13px] font-black text-[#312E81] transition-all hover:bg-[#E0E7FF] animate-in zoom-in-95 duration-200 cursor-default group/tag shadow-sm"
        >
          {t}
          <button 
            onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} 
            className="text-[#94A3B8] hover:text-[#EF4444] transition-colors"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </span>
      ))}
      
      <div className="relative group/input min-w-[120px]">
        <input 
          className="bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-2xl px-4 py-2 text-[13px] font-bold text-[#64748B] outline-none w-full transition-all focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 shadow-inner placeholder:text-[#CBD5E1]"
          placeholder={tags.length === 0 ? placeholder : `+ ${label}`}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && val.trim()) {
              e.preventDefault();
              if (!tags.includes(val.trim())) {
                onTagsChange([...tags, val.trim()]);
              }
              setVal('');
            }
          }}
        />
      </div>
    </div>
  );
};

const SearchableSelect = ({ options, value, onChange, placeholder, isSearchable = true, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-500/5' : error ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
      >
        <span className={!value ? 'text-slate-300' : ''}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-full bg-white border border-slate-100 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearchable && (
            <div className="p-3 border-b border-slate-50 bg-slate-50/50">
              <input 
                autoFocus
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-400"
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
                className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer mb-1 last:mb-0 ${value === opt.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'}`}
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

  const getFilteredTree = () => {
    if (!searchTerm) return options;
    return options.map(parent => ({
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
    for (const parent of options) {
      const child = parent.children?.find(c => c.value === value);
      if (child) return child.label;
      if (parent.value === value) return parent.label;
    }
    return placeholder;
  };

  useEffect(() => {
    if (value && !hoveredParent) {
      const parent = options.find(p => p.children?.some(c => c.value === value));
      if (parent) setHoveredParent(parent);
    }
  }, [value, options]);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-500/5' : error ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
      >
        <span className={!value ? 'text-slate-300' : ''}>{getDisplayValue()}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-[560px] bg-white border border-slate-100 rounded-[24px] shadow-2xl flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 h-[380px]">
          <div className={`w-[240px] border-r border-slate-100 flex flex-col bg-slate-50/30`}>
            {isSearchable && (
              <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all"
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
                  className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all mb-1 flex items-center justify-between group ${hoveredParent?.value === parent.value ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                >
                  <span className="truncate pr-2">{parent.label}</span>
                  {parent.children?.length > 0 && <ChevronRight size={14} className={`transition-transform ${hoveredParent?.value === parent.value ? 'translate-x-0.5 opacity-100' : 'opacity-30'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white flex flex-col">
            <div className="p-4 border-b border-slate-50">
              <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                      className={`px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${value === child.value ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                    <Layers size={20} className="opacity-20" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter opacity-40">
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

// --- Main Modal Component ---

const SetupProductModal = ({ isOpen, onClose, onCreate, initialData = {} }) => {
  const [productForm, setProductForm] = useState({
    name: 'AdsGo AI – Your 24/7 AI Ad Expert',
    url: '',
    category: '',
    description: 'Start your campaign today to achieve these results with AdsGo AI. *Results are estimates based on AdsGo AI historical campaign data. Actual performance may vary.',
    priceRange: '',
    type: 'Physical Goods',
    usps: [''],
    positioning: {
      valueProposition: [],
      features: [],
      usageScenarios: [],
      painPoints: [],
      buyingMotivations: []
    },
    audience: [
      { id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }
    ],
    assets: [],
    ...initialData
  });

  const [formErrors, setFormErrors] = useState({});

  const updateForm = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const updatePositioning = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      positioning: { ...prev.positioning, [field]: value }
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!productForm.name?.trim()) errors.name = 'Product Name is required';
    if (!productForm.url?.trim()) errors.url = 'Product URL is required';
    if (!productForm.category) errors.category = 'Category is required';
    if (!productForm.type) errors.type = 'Product Type is required';
    
    const hasAssets = true; 
    if (!hasAssets) {
      errors.assets = 'At least one asset is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    onCreate(productForm);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-white rounded-[40px] animate-in fade-in duration-300">
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-8 pb-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 font-sans">Setup your product</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-10 pb-32 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="space-y-16 pb-6 pt-8">
            
            {/* 1. Basic Info Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-sans">Basic Info</h4>
                  <p className="text-[10px] text-slate-400 font-medium font-sans">Core details that help us describe and highlight your product.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                      Product Name <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={productForm.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none shadow-sm transition-all ${formErrors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-400'}`}
                    />
                    {formErrors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-in slide-in-from-top-1">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                      Product URL <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={productForm.url}
                      onChange={(e) => updateForm('url', e.target.value)}
                      placeholder="https://example.com/product"
                      className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none shadow-sm transition-all ${formErrors.url ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-400'}`}
                    />
                    {formErrors.url && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-in slide-in-from-top-1">{formErrors.url}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-8 items-start">
                  <div className="col-span-5 space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                      Category <span className="text-rose-500 font-black">*</span>
                    </label>
                    <SearchableTreeSelect 
                      options={[
                        { 
                          value: 'Business', label: 'Business Services', 
                          children: [
                            { value: 'Marketing', label: 'Marketing & Advertising' },
                            { value: 'Consulting', label: 'Business Consulting' }
                          ] 
                        },
                        { 
                          value: 'Tech', label: 'Technology', 
                          children: [
                            { value: 'AI', label: 'Artificial Intelligence' },
                            { value: 'Software', label: 'Software Development' }
                          ] 
                        }
                      ]}
                      value={productForm.category}
                      onChange={(val) => updateForm('category', val)}
                      placeholder="Select Category"
                      error={formErrors.category}
                    />
                    {formErrors.category && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-in slide-in-from-top-1">{formErrors.category}</p>}
                  </div>
                  <div className="col-span-4 space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                      Price Range
                    </label>
                    <input 
                      type="text" 
                      value={productForm.priceRange}
                      onChange={(e) => updateForm('priceRange', e.target.value)}
                      placeholder="e.g. $10 - $50"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="col-span-3 space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                      Product Type <span className="text-rose-500 font-black">*</span>
                    </label>
                    <SearchableSelect 
                      isSearchable={false}
                      options={[
                        { value: 'Physical Goods', label: 'Physical Goods' },
                        { value: 'Service', label: 'Service' },
                        { value: 'Non-type', label: 'Non-type' }
                      ]}
                      value={productForm.type}
                      onChange={(val) => updateForm('type', val)}
                      placeholder="Type"
                      error={formErrors.type}
                    />
                    {formErrors.type && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-in slide-in-from-top-1">{formErrors.type}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                    <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                    Product Description
                  </label>
                  <div className="relative">
                    <textarea 
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 min-h-[140px] resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none shadow-sm transition-all"
                      value={productForm.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                    />
                    <div className="absolute bottom-4 right-5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">
                      <span className="text-[10px] text-slate-400 font-black">{productForm.description.length}/5000</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Selling Points (USPs) Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans">Selling Points (USPs)</h4>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">Highlight the unique benefits of your product (Max 20).</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{productForm.usps.length}/20</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {productForm.usps.map((usp, i) => (
                  <div key={i} className="flex items-center gap-3 group animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex-1 relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-focus-within/input:bg-amber-100 group-focus-within/input:border-amber-200 group-focus-within/input:text-amber-600 transition-all">
                        {i + 1}
                      </div>
                      <input 
                        type="text" 
                        value={usp}
                        onChange={(e) => {
                          const newUsps = [...productForm.usps];
                          newUsps[i] = e.target.value;
                          updateForm('usps', newUsps);
                        }}
                        placeholder="e.g., AI Auto Management"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 placeholder:text-slate-300 transition-all shadow-sm"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newUsps = productForm.usps.filter((_, idx) => idx !== i);
                        updateForm('usps', newUsps.length > 0 ? newUsps : ['']);
                      }}
                      className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                {productForm.usps.length < 20 && (
                  <button 
                    onClick={() => updateForm('usps', [...productForm.usps, ''])}
                    className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/30 transition-all text-xs font-black shadow-sm"
                  >
                    <Plus size={16} strokeWidth={3} /> Add Selling Point
                  </button>
                )}
              </div>
            </section>

            {/* 3. Product Positioning Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-sans">Product Positioning</h4>
                  <p className="text-[10px] text-slate-400 font-medium font-sans">Define your market stance and core value.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                    <div className="w-1 h-3 bg-purple-400 rounded-full" />
                    Product Value Proposition
                  </label>
                  <TagEditor 
                    tags={productForm.positioning.valueProposition}
                    onTagsChange={(tags) => updatePositioning('valueProposition', tags)}
                    placeholder="+ Proposition"
                    label="Proposition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-purple-400 rounded-full" />
                      Product Feature Keywords
                    </label>
                    <TagEditor 
                      tags={productForm.positioning.features}
                      onTagsChange={(tags) => updatePositioning('features', tags)}
                      placeholder="+ Keyword"
                      label="Keyword"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-purple-400 rounded-full" />
                      Product Usage Scenarios
                    </label>
                    <TagEditor 
                      tags={productForm.positioning.usageScenarios}
                      onTagsChange={(tags) => updatePositioning('usageScenarios', tags)}
                      placeholder="+ Scenario"
                      label="Scenario"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-purple-400 rounded-full" />
                      Audience Pain Points / Needs
                    </label>
                    <TagEditor 
                      tags={productForm.positioning.painPoints}
                      onTagsChange={(tags) => updatePositioning('painPoints', tags)}
                      placeholder="+ Point"
                      label="Point"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-3 bg-purple-400 rounded-full" />
                      User Buying Motivations
                    </label>
                    <TagEditor 
                      tags={productForm.positioning.buyingMotivations}
                      onTagsChange={(tags) => updatePositioning('buyingMotivations', tags)}
                      placeholder="+ Motivation"
                      label="Motivation"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Audience Profile Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans">Audience Profile</h4>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">Describe your ideal target customers.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {productForm.audience.map((profile, idx) => (
                  <div key={profile.id} className="p-10 bg-slate-50/50 border border-slate-100 rounded-[40px] space-y-8 relative group animate-in zoom-in-95 duration-300 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[20px] bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-200/50">
                          <User size={28} strokeWidth={2.5} />
                        </div>
                        <div className="group/name relative">
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={profile.name}
                              onChange={(e) => {
                                const newAudience = productForm.audience.map(a => 
                                  a.id === profile.id ? { ...a, name: e.target.value } : a
                                );
                                updateForm('audience', newAudience);
                              }}
                              className="bg-transparent border-none p-0 text-xl font-black text-slate-900 focus:ring-0 outline-none w-auto min-w-[150px]"
                              placeholder="Audience Name"
                            />
                            <Edit2 size={16} className="text-slate-300 group-hover/name:text-emerald-500 transition-colors cursor-pointer" />
                          </div>
                          <p className="text-xs text-slate-400 font-bold tracking-tight mt-0.5">Set specific targeting rules for this audience</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newAudience = productForm.audience.filter(a => a.id !== profile.id);
                          updateForm('audience', newAudience.length > 0 ? newAudience : [{ id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }]);
                        }}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-100"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                            <div className="w-1 h-3 bg-emerald-400 rounded-full" />
                            Age Range
                          </label>
                          <input 
                            type="text" 
                            value={profile.age}
                            onChange={(e) => {
                              const newAudience = productForm.audience.map(a => 
                                a.id === profile.id ? { ...a, age: e.target.value } : a
                              );
                              updateForm('audience', newAudience);
                            }}
                            placeholder="e.g. 25-45"
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none shadow-sm transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                            <div className="w-1 h-3 bg-emerald-400 rounded-full" />
                            Gender
                          </label>
                          <SearchableSelect 
                            isSearchable={false}
                            options={[
                              { value: 'All', label: 'All Genders' },
                              { value: 'Male', label: 'Male' },
                              { value: 'Female', label: 'Female' }
                            ]}
                            value={profile.gender}
                            onChange={(val) => {
                              const newAudience = productForm.audience.map(a => 
                                a.id === profile.id ? { ...a, gender: val } : a
                              );
                              updateForm('audience', newAudience);
                            }}
                            placeholder="Select Gender"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                        <div className="w-1 h-3 bg-emerald-400 rounded-full" />
                        Audience Traits / Interests
                      </label>
                      <TagEditor 
                        tags={profile.traits}
                        onTagsChange={(tags) => {
                          const newAudience = productForm.audience.map(a => 
                            a.id === profile.id ? { ...a, traits: tags } : a
                          );
                          updateForm('audience', newAudience);
                        }}
                        placeholder="+ Interest"
                        label="Interest"
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => updateForm('audience', [...productForm.audience, { id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }])}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all text-sm font-black flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus size={18} strokeWidth={3} /> Add Audience Profile
                </button>
              </div>
            </section>

            {/* 5. Assets Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans">Assets <span className="text-rose-500 font-black">*</span></h4>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">Upload product images or video assets.</p>
                  </div>
                </div>
                {formErrors.assets && <p className="text-[10px] text-rose-500 font-black animate-pulse">{formErrors.assets}</p>}
              </div>
              
              <div className="grid grid-cols-5 gap-5">
                <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group shadow-sm hover:shadow-md active:scale-[0.98]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:shadow-inner transition-all">
                      <Plus size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-wider">Upload</span>
                  </div>
                </div>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-square bg-white border border-slate-100 rounded-[32px] relative overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <img src={`https://picsum.photos/seed/setup${i}/400/400`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <button className="w-10 h-10 bg-white rounded-xl text-slate-900 hover:bg-indigo-50 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-90">
                        <Edit2 size={16} strokeWidth={2.5} />
                      </button>
                      <button className="w-10 h-10 bg-white rounded-xl text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-90">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-black/5 shadow-sm">
                       <ImageIcon size={12} className="text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-6 flex items-center justify-between border-t border-slate-50 bg-white/90 backdrop-blur-md z-20">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all font-sans"
            >
              Discard
            </button>
            <button 
              onClick={handleCreate}
              className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 font-sans"
            >
              Create product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProductModal;
