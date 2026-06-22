import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

const BrandBar = ({ brand, onSave, onIgnore, isSaved }) => {
  if (isSaved) {
    return (
      <div className="bg-primary-50 border-b border-primary-500/15 px-6 py-2 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
            {brand.name.charAt(0)}
          </div>
          <div>
            <span className="text-sm font-semibold text-primary-700">{brand.name}</span>
            <span className="mx-2 text-primary-500/40">|</span>
            <span className="text-xs text-primary-500 font-mono">{brand.url}</span>
          </div>
          <div className="flex items-center bg-success-50 px-2 py-0.5 rounded-tag text-xs text-success-700 font-medium">
            <ShieldCheck size={12} className="mr-1" />
            品牌已加密保护
          </div>
        </div>
        <div className="text-xs text-primary-500/70">
          目标: {brand.goal === 'Sales' ? '销量' : brand.goal} • {brand.country === 'United States (US)' ? '美国' : brand.country}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 adsgo-card-shadow animate-slide-down">
      <div className="flex items-center space-x-4">
        <img src={brand.logo} alt="Brand" className="w-10 h-10 rounded-base shadow-adsgo-card object-cover" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">检测到品牌: {brand.name}</h4>
          <p className="text-xs text-neutral-500">{brand.url} • {brand.goal} • {brand.country}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onIgnore}
          className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
        >
          <X size={18} />
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center justify-center bg-primary-500 text-white px-4 py-2 rounded-base text-sm font-medium hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 focus:outline-none focus:shadow-primary-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          确认保存品牌信息
        </button>
      </div>
    </div>
  );
};

export default BrandBar;
