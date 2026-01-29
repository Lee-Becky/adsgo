import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Check, Scissors, Fingerprint } from 'lucide-react';
import ObjectiveSection from './optimizeGoals/ObjectiveSection';
import BudgetKPISection from './optimizeGoals/BudgetKPISection';
import AssetSection from './optimizeGoals/AssetSection';

const ImageCropper = ({ imageSrc, onCrop, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const handleApply = () => {
    const canvas = document.createElement('canvas');
    const img = imgRef.current;
    
    canvas.width = 512;
    canvas.height = 512;
    
    const ctx = canvas.getContext('2d');
    
    // Simplified center crop
    ctx.drawImage(
      img,
      0, 0, img.naturalWidth, img.naturalHeight,
      0, 0, 512, 512
    );
    
    onCrop(canvas.toDataURL('image/png'));
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md p-6">
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[500px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Scissors size={20} />
            </div>
            <h4 className="font-bold text-slate-900">Crop Logo to 1:1</h4>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        
        <div className="relative aspect-square bg-slate-100 overflow-hidden" ref={containerRef}>
          <img 
            ref={imgRef}
            src={imageSrc} 
            alt="To crop" 
            className="w-full h-full object-cover"
            style={{ 
              transform: `scale(${zoom})`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div className="absolute inset-0 border-[40px] border-slate-900/40 pointer-events-none">
            <div className="w-full h-full border-2 border-white/50 shadow-[0_0_0_9999px_rgba(15,23,42,0.4)]" />
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="0.01" 
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} strokeWidth={3} />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateBrandModal = ({ isOpen, onClose, onCreate }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [brandForm, setBrandForm] = useState({
    name: '',
    url: '',
    logo: null,
    // Optimize Goals fields
    campaignObjective: '',
    adsetGoal: '',
    event: '',
    marketGroups: [
      {
        id: crypto.randomUUID(),
        targetLocations: [],
        budgetMode: 'unified',
        unifiedBudget: '',
        splitBudgets: {},
        kpiType: 'ROAS',
        kpiMode: 'unified',
        unifiedKPI: '',
        splitKPIs: {}
      }
    ],
    adScopeAccounts: [],
    assetLoading: false,
    optimizePreferences: []
  });

  const [tempImage, setTempImage] = useState(null);
  const [validation, setValidation] = useState({
    objective: false,
    marketGroups: false,
    assets: false
  });
  
  const fileInputRef = useRef(null);

  const getValidationErrors = () => {
    const newErrors = {};
    if (!brandForm.name?.trim()) newErrors.name = 'Brand name is required';
    if (!brandForm.url?.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(brandForm.url.startsWith('http') ? brandForm.url : `https://${brandForm.url}`);
      } catch (e) {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (!validation.objective) {
      newErrors.objective = 'Please complete Promote Objective settings';
    }
    if (!validation.marketGroups) {
      newErrors.marketGroups = 'Please complete Budget & Performance KPI settings';
    }

    return newErrors;
  };

  useEffect(() => {
    if (isSubmitted) {
      setErrors(getValidationErrors());
    }
  }, [brandForm, validation, isSubmitted]);

  const updateFormData = (key, value) => {
    setBrandForm(prev => ({ ...prev, [key]: value }));
  };

  const updateFormDataDeep = (updates) => {
    setBrandForm(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newErrors = getValidationErrors();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onCreate(brandForm);
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropComplete = (croppedUrl) => {
    setBrandForm(prev => ({
      ...prev,
      logo: {
        url: croppedUrl
      }
    }));
    setTempImage(null);
  };

  const removeLogo = () => {
    setBrandForm(prev => ({ ...prev, logo: null }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
        <div 
          className="w-full max-w-[960px] max-h-[90vh] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-10 pt-10 pb-6 flex items-center justify-between shrink-0">
            <h3 className="text-2xl font-bold text-slate-900">Create New Brand</h3>
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form id="create-brand-form" onSubmit={handleSubmit} className="px-10 pb-32 space-y-8">
              {/* Basic Info Section */}
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-in fade-in duration-700">
                <header className="px-10 py-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
                      <Fingerprint size={16} />
                    </div>
                    <h2 className="text-sm font-black text-slate-900">Brand Identity <span className="text-rose-500 ml-1">*</span></h2>
                  </div>
                </header>
                <div className="p-10 space-y-8">
                  <div className="flex gap-10">
                    {/* Logo Section */}
                    <div className="space-y-3 shrink-0">
                      <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                        <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                        Brand Logo
                      </label>
                      <div className="relative">
                        {brandForm.logo ? (
                          <div className="relative group w-32 h-32">
                            <img 
                              src={brandForm.logo.url} 
                              alt="Logo preview" 
                              className="w-full h-full object-cover rounded-[24px] border border-slate-100 shadow-sm"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px] flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white text-indigo-600 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                              >
                                <Scissors size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="p-2 bg-white text-rose-500 shadow-lg rounded-xl hover:scale-110 active:scale-95 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group"
                          >
                            <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">Upload</span>
                            <span className="text-[9px] font-medium mt-1 opacity-60">1:1 Required</span>
                          </button>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    {/* Fields Section */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                      {/* Brand Name */}
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                          <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                          Brand Name <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={brandForm.name}
                          onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. AdsGo AI"
                          className={`w-full bg-white border rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none shadow-sm transition-all ${isSubmitted && errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-400'}`}
                        />
                        {isSubmitted && errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name}</p>}
                      </div>

                      {/* Brand URL */}
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-2">
                          <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                          Brand URL <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={brandForm.url}
                          onChange={(e) => setBrandForm(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://www.example.com"
                          className={`w-full bg-white border rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none shadow-sm transition-all ${isSubmitted && errors.url ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-400'}`}
                        />
                        {isSubmitted && errors.url && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.url}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimize Goal Sections */}
              <div className="space-y-8 pb-10">
                <div className={isSubmitted && errors.objective ? 'ring-2 ring-rose-500 rounded-[32px] p-1' : ''}>
                  <ObjectiveSection 
                    formData={brandForm}
                    updateFormData={updateFormData}
                    validation={validation}
                    setValidation={setValidation}
                  />
                  {isSubmitted && errors.objective && <p className="text-xs font-bold text-rose-500 mt-2 ml-4">{errors.objective}</p>}
                </div>

                <div className={isSubmitted && errors.marketGroups ? 'ring-2 ring-rose-500 rounded-[32px] p-1' : ''}>
                  <BudgetKPISection 
                    formData={brandForm}
                    updateFormData={updateFormData}
                    updateFormDataDeep={updateFormDataDeep}
                    validation={validation}
                    setValidation={setValidation}
                  />
                  {isSubmitted && errors.marketGroups && <p className="text-xs font-bold text-rose-500 mt-2 ml-4">{errors.marketGroups}</p>}
                </div>

                <AssetSection 
                  formData={brandForm}
                  updateFormData={updateFormData}
                  validation={validation}
                  setValidation={setValidation}
                />
              </div>
            </form>
          </div>

          {/* Footer Actions (Sticky) */}
          <div className="px-10 py-8 bg-white/90 backdrop-blur-md border-t border-slate-50 flex items-center justify-end gap-4 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="create-brand-form"
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              Create Brand
            </button>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {tempImage && (
        <ImageCropper 
          imageSrc={tempImage}
          onCrop={handleCropComplete}
          onCancel={() => setTempImage(null)}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}} />
    </>
  );
};

export default CreateBrandModal;
