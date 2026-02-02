import React, { useState } from 'react';
import { 
  Palette, Type, Sparkles, MessageSquare, 
  Ban, Heart, Languages, Save, Plus, X, Check,
  Fingerprint, Edit3
} from 'lucide-react';

const BrandKits = () => {
  const [isSaved, setIsSaved] = useState(false);

  const [brandKits, setBrandKits] = useState({
    colors: [
      { id: 1, hex: '#5C3A21', label: 'Primary' },
      { id: 2, hex: '#A08E7E', label: 'Secondary 1' },
      { id: 3, hex: '#E5B27F', label: 'Secondary 2' }
    ],
    fonts: ['Noto Sans Display', 'Noto Serif Japanese', 'Jost', 'Arial'],
    visualStyle: 'Heritage-inspired designs with modern comfort',
    tone: 'Direct and informative, focusing on practical details',
    forbiddenWords: ['cheap', 'low quality'],
    preferredPhrases: ['Heritage', 'Timeless aesthetics', 'Functional clothing'],
    languagePreference: ['English (US)']
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleColorChange = (id, hex) => {
    setBrandKits(prev => ({
      ...prev,
      colors: prev.colors.map(c => c.id === id ? { ...c, hex } : c)
    }));
  };

  const addColor = () => {
    if (brandKits.colors.length >= 3) return;
    const newId = Date.now();
    setBrandKits(prev => ({
      ...prev,
      colors: [...prev.colors, { id: newId, hex: '#4F46E5', label: `Secondary ${prev.colors.length}` }]
    }));
  };

  const removeColor = (id) => {
    if (brandKits.colors.length <= 1) return;
    setBrandKits(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      {/* Top Floating Save Area - Matching BasicInfo style */}
      <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-md border-b border-slate-100/50 py-3 px-10">
        <div className="max-w-[1400px] mx-auto flex justify-end">
          <button 
            onClick={handleSave} 
            className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            {isSaved ? 'Saved' : 'Save Kits'}
          </button>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto py-12 px-8 space-y-10 animate-in fade-in duration-1000">
          
          {/* 1. Visual Identity & Standards Unified Card */}
          <div className="grid grid-cols-1 relative z-10">
            <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Brand Colors Section */}
                <Field label="Brand colors" icon={Palette}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {brandKits.colors.map((color) => (
                      <div key={color.id} className="group relative flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-md">
                        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl shadow-inner border border-black/5">
                          <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Edit3 size={16} className="text-white drop-shadow-sm" />
                            <input 
                              type="color" 
                              value={color.hex} 
                              onChange={(e) => handleColorChange(color.id, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-slate-400 truncate">{color.label}</div>
                          <div className="text-sm font-mono font-bold text-slate-700 uppercase select-none">
                            {color.hex}
                          </div>
                        </div>
                        {brandKits.colors.length > 1 && (
                          <button 
                            onClick={() => removeColor(color.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    {brandKits.colors.length < 3 && (
                      <button 
                        onClick={addColor}
                        className="flex items-center justify-center gap-2 h-[74px] border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 hover:text-indigo-400 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                      >
                        <Plus size={18} />
                        <span className="text-xs font-bold">Add Color</span>
                      </button>
                    )}
                  </div>
                </Field>

                {/* Typography & Language Section */}
                <div className="flex flex-col gap-10">
                  <Field label="Typography" icon={Type}>
                    <TagCloud 
                      tags={brandKits.fonts} 
                      onTagsChange={(t) => setBrandKits({...brandKits, fonts: t})} 
                      color="indigo" 
                      placeholder="+ Font" 
                    />
                  </Field>

                  <Field label="Marketing language preference" icon={Languages}>
                    <TagCloud 
                      tags={brandKits.languagePreference} 
                      onTagsChange={(t) => setBrandKits({...brandKits, languagePreference: t})} 
                      color="indigo" 
                      placeholder="+ Language" 
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Style & Tone Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Visual Style Card */}
            <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col gap-8">
              <Field label="Brand visual style" icon={Sparkles}>
                <textarea 
                  className="w-full h-full min-h-[100px] bg-slate-50 border-none rounded-[24px] p-5 text-sm font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner"
                  value={brandKits.visualStyle}
                  onChange={(e) => setBrandKits({...brandKits, visualStyle: e.target.value})}
                  placeholder="Describe your brand's visual style type..."
                />
              </Field>
            </div>
            
            {/* Brand Tone Card */}
            <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col gap-8">
              <Field label="Brand voice & tone" icon={MessageSquare}>
                <textarea 
                  className="w-full h-full min-h-[100px] bg-slate-50 border-none rounded-[24px] p-5 text-sm font-medium leading-relaxed text-slate-600 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner"
                  value={brandKits.tone}
                  onChange={(e) => setBrandKits({...brandKits, tone: e.target.value})}
                  placeholder="How does your brand communicate?"
                />
              </Field>
            </div>
          </div>

          {/* 3. Preference & Taboos Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Brand Preference Card */}
            <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm space-y-8 flex flex-col">
              <Field label="Brand preference" icon={Heart}>
                <TagCloud 
                  tags={brandKits.preferredPhrases} 
                  onTagsChange={(t) => setBrandKits({...brandKits, preferredPhrases: t})} 
                  color="indigo" 
                  placeholder="+ Content" 
                />
              </Field>
            </div>

            {/* Brand Taboos Card */}
            <div className="p-8 bg-rose-50 border border-rose-100/50 rounded-[32px] space-y-8 flex flex-col">
              <Field label="Brand taboos" icon={Ban}>
                <div className="space-y-4">
                  <TagCloud 
                    tags={brandKits.forbiddenWords} 
                    onTagsChange={(t) => setBrandKits({...brandKits, forbiddenWords: t})} 
                    color="rose" 
                    placeholder="+ Content" 
                  />
                  <p className="text-[10px] text-rose-400 font-bold leading-relaxed">
                    Content and concepts that must not appear in any brand marketing materials.
                  </p>
                </div>
              </Field>
            </div>
          </div>

          <footer className="pt-8 pb-4 flex flex-col items-center gap-2 opacity-10">
            <Fingerprint size={24} />
            <p className="text-[10px] font-bold">Digital kit signature v1.0 pro</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-4 flex flex-col">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-indigo-400" />}
      <h3 className="text-[11px] font-bold text-slate-400 tracking-tight">{label}</h3>
    </div>
    <div className="relative">{children}</div>
  </div>
)

const TagCloud = ({ tags = [], onTagsChange, color = "indigo", placeholder }) => {
  const [val, setVal] = useState('')
  const colorStyles = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100",
    rose: "bg-white border-rose-100 text-rose-700 hover:bg-rose-50"
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t, i) => (
        <span key={i} className={`pl-3 pr-2 py-1 border rounded-xl text-[12px] font-bold flex items-center gap-1.5 group/tag transition-all hover:shadow-sm ${colorStyles[color]}`}>
          {t}
          <button onClick={() => onTagsChange(tags.filter((_, idx) => idx !== i))} className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-500 transition-all"><X size={10} strokeWidth={3} /></button>
        </span>
      ))}
      <input 
        className="text-[12px] font-bold bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 outline-none w-24 placeholder:text-slate-300 focus:border-indigo-300 focus:bg-white transition-all shadow-inner"
        placeholder={placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && val) {
            e.preventDefault()
            onTagsChange([...tags, val])
            setVal('')
          }
        }}
      />
    </div>
  )
}

export default BrandKits;
