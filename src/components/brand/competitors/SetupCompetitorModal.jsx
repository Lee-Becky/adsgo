import React, { useState } from 'react';
import { X, Plus, Trash2, Globe, Link, FileText, Image as ImageIcon } from 'lucide-react';

const SetupCompetitorModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    logo: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Brand name is required';
    if (!formData.link) newErrors.link = 'Website URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: Date.now(),
      logo: formData.logo || 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256'
    });
    setFormData({ name: '', link: '', logo: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header Area */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100/80">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Competitor</h2>
              <p className="text-[13px] font-semibold text-slate-400">Track and analyze your market rivals.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-10 py-10 space-y-8">
          {/* Main Info Row: Logo Left, Name & URL Right */}
          <div className="flex gap-10 items-start">
            {/* Logo Column */}
            <div className="space-y-3 shrink-0">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 ml-1">
                <ImageIcon size={12} className="text-indigo-400" />
                Logo
              </label>
              <label className="cursor-pointer group block">
                <div className="w-[120px] h-[120px] rounded-[36px] bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all flex items-center justify-center overflow-hidden shadow-inner relative">
                  {formData.logo ? (
                    <>
                      <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Upload size={24} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-300 group-hover:text-indigo-500 transition-colors">
                      <Plus size={32} strokeWidth={2.5} />
                      <span className="text-[11px] font-bold tracking-tight">Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              {formData.logo && (
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, logo: ''})}
                  className="w-full flex items-center justify-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors py-1"
                >
                  <Trash2 size={10} />
                  Remove Logo
                </button>
              )}
            </div>

            {/* Fields Column */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 ml-1">
                  <Globe size={12} className="text-indigo-400" />
                  Competitor Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full h-[54px] bg-slate-50 border-none rounded-[18px] px-5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-[6px] focus:ring-indigo-500/10 transition-all shadow-inner ${errors.name ? 'ring-2 ring-rose-500/30' : ''}`}
                    placeholder="e.g. Acme Corp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-rose-500">{errors.name}</p>}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 ml-1">
                  <Link size={12} className="text-indigo-400" />
                  Website URL <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className={`w-full h-[54px] bg-slate-50 border-none rounded-[18px] px-5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-[6px] focus:ring-indigo-500/10 transition-all shadow-inner ${errors.link ? 'ring-2 ring-rose-500/30' : ''}`}
                    placeholder="https://www.competitor.com"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                  {errors.link && <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-rose-500">{errors.link}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 ml-1">
              <FileText size={12} className="text-indigo-400" />
              Description
            </label>
            <textarea
              className="w-full bg-slate-50 border-none rounded-[24px] px-6 py-5 text-sm font-bold text-slate-600 placeholder:text-slate-300 focus:ring-[6px] focus:ring-indigo-500/10 transition-all shadow-inner min-h-[140px] resize-none leading-relaxed"
              placeholder="What do they do differently? Note their strengths..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Action Footer */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[60px] rounded-[20px] font-black text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] h-[60px] rounded-[20px] bg-slate-900 text-white font-black text-sm hover:bg-black transition-all shadow-[0_16px_32px_-8px_rgba(0,0,0,0.3)] active:scale-95 flex items-center justify-center gap-2"
            >
              Add Competitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupCompetitorModal;
