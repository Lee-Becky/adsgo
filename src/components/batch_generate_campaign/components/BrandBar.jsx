import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

const BrandBar = ({ brand, onSave, onIgnore, isSaved }) => {
  if (isSaved) {
    return (
      <div className="bg-[#F5F1FF] border-b border-[#7033F5]/15 px-6 py-2 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-[#7033F5] flex items-center justify-center text-white font-bold text-xs">
            {brand.name.charAt(0)}
          </div>
          <div>
            <span className="text-sm font-semibold text-[#5E26D6]">{brand.name}</span>
            <span className="mx-2 text-[#7033F5]/40">|</span>
            <span className="text-xs text-[#7033F5] font-mono">{brand.url}</span>
          </div>
          <div className="flex items-center bg-green-100 px-2 py-0.5 rounded text-[10px] text-green-700 font-bold uppercase tracking-wider">
            <ShieldCheck size={12} className="mr-1" />
            品牌已加密保护
          </div>
        </div>
        <div className="text-xs text-[#7033F5]/70">
          目标: {brand.goal === 'Sales' ? '销量' : brand.goal} • {brand.country === 'United States (US)' ? '美国' : brand.country}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm animate-slide-down">
      <div className="flex items-center space-x-4">
        <img src={brand.logo} alt="Brand" className="w-10 h-10 rounded shadow-sm object-cover" />
        <div>
          <h4 className="text-sm font-bold text-gray-900">检测到品牌: {brand.name}</h4>
          <p className="text-xs text-gray-500">{brand.url} • {brand.goal} • {brand.country}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onIgnore}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
        <button 
          onClick={onSave}
          className="bg-[#7033F5] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#5221CF] transition-colors shadow-sm"
        >
          确认保存品牌信息
        </button>
      </div>
    </div>
  );
};

export default BrandBar;