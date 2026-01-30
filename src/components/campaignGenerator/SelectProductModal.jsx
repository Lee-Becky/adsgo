import React, { useState } from 'react';
import { X, Search, Plus, Package, Check, Globe } from 'lucide-react';
import { MOCK_PRODUCTS } from '../brand/products/mockData';

const SelectProductModal = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div 
        className="w-full max-w-[1000px] bg-slate-50/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8 flex-1">
            <h3 className="text-2xl font-bold text-slate-900 whitespace-nowrap">Select a product</h3>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
              <Plus size={18} />
              New products
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content - Grid */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedId(product.id)}
                className={`group relative flex flex-col bg-white rounded-3xl p-4 border-2 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  selectedId === product.id ? 'border-indigo-600 ring-4 ring-indigo-500/5 shadow-lg' : 'border-slate-100 hover:border-indigo-100'
                }`}
              >
                <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Package size={48} strokeWidth={1} />
                    </div>
                  )}
                  {selectedId === product.id && (
                    <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Check size={20} strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-[40px] leading-tight mb-2">{product.name}</h4>
                <div className="flex items-center gap-1.5 text-indigo-600 mt-auto min-w-0">
                  <Globe size={12} className="shrink-0" />
                  <span className="text-[10px] font-bold truncate opacity-70">{product.url}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-white/50 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedId}
            onClick={() => onSelect(selectedId)}
            className={`px-10 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-95 ${
              selectedId 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            Use this product
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectProductModal;
