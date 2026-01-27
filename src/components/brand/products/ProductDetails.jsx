import React, { useState } from 'react';
import { 
  ArrowLeft, Info, Plus, Trash2, 
  ChevronDown, HelpCircle, AlertCircle,
  Play, ImageIcon, FileText, ExternalLink
} from 'lucide-react';

const ProductDetails = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState('basicInfo');
  
  // Local state for editing
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category ? product.category.split('>').pop().trim() : 'Marketing & Advertising',
    description: product?.description || '',
    usps: product?.usps || [''],
  });

  const handleUSPChange = (index, value) => {
    const newUSPs = [...formData.usps];
    newUSPs[index] = value;
    setFormData({ ...formData, usps: newUSPs });
  };

  const addUSP = () => {
    setFormData({ ...formData, usps: [...formData.usps, ''] });
  };

  const removeUSP = (index) => {
    const newUSPs = formData.usps.filter((_, i) => i !== index);
    setFormData({ ...formData, usps: newUSPs.length ? newUSPs : [''] });
  };

  const assetSections = [
    { 
      id: 'mainPhoto', 
      title: 'Product main photo', 
      subtitle: 'A clear view of the product by itself. View examples',
      placeholder: true,
      hint: true
    },
    { 
      id: 'detailedShots', 
      title: 'Product detailed shots', 
      subtitle: 'Extra visuals of the product that give a fuller look or highlight specific parts. View examples' 
    },
    { 
      id: 'demo', 
      title: 'Product demo', 
      subtitle: 'Demonstrate how the product works — from setup steps to someone actively using it in real situations. View examples' 
    },
    { 
      id: 'review', 
      title: 'Customer review / testimonial', 
      subtitle: 'Customer feedback, quotes, social proof, or user experiences. View examples' 
    },
    { 
      id: 'lifestyle', 
      title: 'Lifestyle', 
      subtitle: 'The product in a natural environment or everyday scene. View examples' 
    },
    { 
      id: 'painpoints', 
      title: 'Painpoints', 
      subtitle: 'Highlight the frustrations or difficult situations before using the product. View examples' 
    },
    { 
      id: 'comparison', 
      title: 'Comparison', 
      subtitle: 'Shows clear before-and-after differences or comparisons. View examples' 
    },
    { 
      id: 'outcome', 
      title: 'Result / Outcome', 
      subtitle: 'Shows the positive results or improvements achieved after using the product. View examples' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Product Details for Ads</h1>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
          Save
        </button>
      </header>

      <div className="flex-1 max-w-[1200px] mx-auto w-full p-8 flex gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 flex flex-col gap-4">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
              <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-yellow-500/80 leading-relaxed font-medium">
                Important product details are missing. Add them now to improve visibility.
              </p>
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('basicInfo')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'basicInfo' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Basic Info
              </button>
              <button 
                onClick={() => setActiveTab('assets')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'assets' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Assets
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 space-y-12 pb-24">
          
          {/* Basic Info Section */}
          <section id="basicInfo" className="bg-[#111111] border border-gray-800 rounded-2xl p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-1">Basic Info</h2>
              <p className="text-xs text-gray-500">Core details that help us describe and highlight your product.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 tracking-wider">
                  Product name <span className="text-rose-500">*</span>
                  <HelpCircle size={12} className="text-gray-600" />
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 tracking-wider">
                  Category <HelpCircle size={12} className="text-gray-600" />
                </label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-sm appearance-none focus:outline-none focus:border-indigo-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Marketing & Advertising</option>
                    <option>Pet Travel Accessories</option>
                    <option>Men's Clothing</option>
                    <option>Medical Services</option>
                    <option>Cleaning Supplies</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 tracking-wider">
                Product description <HelpCircle size={12} className="text-gray-600" />
              </label>
              <div className="relative">
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-4 text-sm min-h-[120px] focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe your product..."
                />
                <span className="absolute bottom-4 right-4 text-[10px] text-gray-600">
                  {formData.description.length}/5000
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 tracking-wider">
                Selling points (USPs) <HelpCircle size={12} className="text-gray-600" />
              </label>
              <div className="space-y-3">
                {formData.usps.map((usp, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                      {index + 1}
                    </div>
                    <input 
                      type="text"
                      value={usp}
                      onChange={(e) => handleUSPChange(index, e.target.value)}
                      className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder={`USP ${index + 1}`}
                    />
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={addUSP}
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                      <button 
                        onClick={() => removeUSP(index)}
                        className="p-2 text-gray-500 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Assets Section */}
          <section id="assets" className="bg-[#111111] border border-gray-800 rounded-2xl p-8 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Assets</h2>
                <p className="text-xs text-gray-500">Upload and organize all your product visuals for easy use in videos.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Asset template:</span>
                <div className="relative">
                  <select className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-1.5 text-xs font-medium pr-8 appearance-none focus:outline-none">
                    <option>Physical goods</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {assetSections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-sm font-bold">{section.title}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">{section.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {/* Add Button */}
                    <div className="aspect-square bg-[#0a0a0a] border-2 border-dashed border-gray-800 rounded-xl flex items-center justify-center hover:border-gray-700 hover:bg-white/5 transition-all cursor-pointer">
                      <Plus size={24} className="text-gray-600" />
                    </div>
                    
                    {/* Placeholder Hint for Main Photo */}
                    {section.hint && (
                      <div className="col-span-3 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex gap-6 items-center">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                             <img src="https://via.placeholder.com/30" className="w-6 h-6 rounded-md" alt="" />
                             <span className="text-[10px] text-gray-400">Transparent Image ✅</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <img src="https://via.placeholder.com/30" className="w-6 h-6 rounded-md" alt="" />
                             <span className="text-[10px] text-gray-400">Blurry Image ❌</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                             <img src="https://via.placeholder.com/30" className="w-6 h-6 rounded-md" alt="" />
                             <span className="text-[10px] text-gray-400">Solid / Clean background ✅</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <img src="https://via.placeholder.com/30" className="w-6 h-6 rounded-md" alt="" />
                             <span className="text-[10px] text-gray-400">Messy background ❌</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Others Section */}
              <div className="space-y-4 border-t border-gray-800 pt-10">
                <h3 className="text-sm font-bold tracking-wider text-gray-500">Others</h3>
                <p className="text-[10px] text-gray-600 -mt-2">Assets without specific labels</p>
                <div className="grid grid-cols-5 gap-3">
                  {product?.assets?.others?.map((asset) => (
                    <div key={asset.id} className="aspect-video relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group">
                      <img src={asset.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={20} className="text-white fill-white opacity-80" />
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                        {asset.duration}
                      </div>
                    </div>
                  ))}
                  <div className="aspect-video relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                     <div className="text-center">
                       <p className="text-sm font-bold text-white">17 more assets</p>
                     </div>
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
