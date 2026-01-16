import React, { useState, useRef, useEffect } from 'react';
import { Eye, Target, Zap, Edit2, ChevronDown, ChevronUp, X, Check, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { createPortal } from 'react-dom';

// Platform icon URLs
const META_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256';
const GOOGLE_ICON_URL = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256';

// Tooltip component with portal
const Tooltip = ({ accounts, title, platform, buttonRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }, [buttonRef]);

  return createPortal(
    <div 
      className="fixed bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-[999999] min-w-[200px]"
      style={{ top: position.top, left: position.left }}
    >
      <div className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-100">{title}</div>
      {accounts.map((account, index) => (
        <div key={index} className="text-xs text-slate-600 py-1 flex justify-between">
          <span>{account.name}</span>
          <span className="text-slate-400">({account.id})</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

const DashboardInsightsHeader = ({ 
  onRuleLibraryClick,
  onEditBrandConfig,
  onCollapseToggle,
  isCollapsed,
  onActiveTabChange,
  activeTab: propActiveTab
}) => {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [activeTab, setActiveTab] = useState(propActiveTab || 'meta');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const buttonRef = useRef(null);
  const metaButtonRef = useRef(null);
  const googleButtonRef = useRef(null);

  // Sync with prop if provided
  React.useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onActiveTabChange?.(tab);
  };

  const metaAccounts = [
    { name: 'AdsGo Official', id: '1234567890' },
    { name: 'AdsGo Performance', id: '0987654321' },
    { name: 'AdsGo Retargeting', id: '1122334455' }
  ];

  const googleAccounts = [
    { name: 'AdsGo Search', id: 'GA-123456' },
    { name: 'AdsGo Display', id: 'GA-789012' },
    { name: 'AdsGo YouTube', id: 'GA-345678' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative z-10">
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          {/* Left: Dashboard Insights Title + Meta/Google Tabs */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-blue-500" />
              <h2 className="text-sm font-black text-slate-800 tracking-wide">Optimization Overview</h2>
            </div>
            
            {/* All/Meta/Google Tabs */}
            <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'all' 
                    ? 'bg-white text-blue-600 shadow-sm font-bold' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <svg 
                  viewBox="0 0 1024 1024" 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-4 h-4 ${activeTab === 'all' ? 'text-blue-600' : 'text-slate-600'}`}
                >
                  <path 
                    d="M927.2352 594.88c-32.192-19.2-64.384-19.2-96.576-12.8-25.728 6.4-45.056 19.2-57.92 31.936L682.4992 562.944c6.4-12.8 6.4-31.936 6.4-51.072 0-19.2-6.4-31.936-6.4-51.072l90.176-51.072c25.728 25.6 57.92 38.336 90.112 38.336 19.328 0 45.056-6.4 64.384-19.2 64.384-38.272 83.712-114.88 45.056-172.352-19.328-31.936-45.056-51.072-77.248-57.472-32.192-6.4-70.848-6.4-96.576 12.8-32.192 19.136-51.52 44.672-57.92 76.608-6.4 19.136-6.4 44.672 0 63.808l-90.176 51.072c-25.728-19.136-57.92-38.272-90.112-44.672V250.112a123.264 123.264 0 0 0 96.576-121.28A128.64 128.64 0 0 0 528.0672 1.152a128.64 128.64 0 0 0-128.768 127.68c0 57.472 38.656 108.544 96.576 121.28v102.144c-32.192 12.8-64.384 31.936-90.112 51.072l-90.176-51.072c6.4-19.136 6.4-44.672 0-63.808-6.4-31.936-25.728-63.872-57.92-76.608-32.192-19.2-64.384-25.6-96.576-12.8-32.192 6.4-64.384 25.6-77.248 57.472-12.864 31.936-25.792 63.872-12.864 95.744 6.4 31.936 25.728 63.872 57.92 76.608 19.328 12.8 45.056 19.2 64.384 19.2 32.192 0 64.384-12.8 90.112-38.336l90.176 51.072c0 19.2-6.4 31.936-6.4 51.072 0 19.2 6.4 31.936 6.4 51.072l-90.176 51.072c-12.8-19.2-38.592-25.536-57.92-31.936-32.192-12.8-64.384-6.4-96.576 12.8-32.192 12.8-51.52 44.672-57.92 76.608-12.928 31.936-6.4 63.808 12.8 95.744 19.392 31.936 45.12 51.072 77.312 57.472 12.864 6.4 19.328 6.4 32.192 6.4 19.328 0 45.056-6.4 64.384-19.2 32.192-19.136 51.52-44.672 57.92-76.608 6.4-19.136 6.4-44.672 0-63.808l90.176-51.072c25.728 19.136 57.92 38.272 90.112 44.672v102.144c-57.92 19.2-96.576 70.208-96.576 127.68a128.64 128.64 0 0 0 128.768 127.68 128.64 128.64 0 0 0 128.768-127.68c0-57.472-38.656-108.544-96.576-121.28v-102.144c32.192-6.4 64.384-25.6 90.112-51.072l90.176 51.072c-6.4 19.2-6.4 44.672 0 63.808 6.4 32 32.192 57.472 57.92 76.608 19.328 12.8 45.056 19.2 64.384 19.2 12.864 0 19.328 0 32.192-6.4 32.192-6.4 57.92-31.936 77.248-57.472 38.656-63.808 19.328-140.416-45.056-172.352z m-128.768-293.696c6.4-19.136 12.864-31.872 32.192-38.272 12.864-6.4 19.328-6.4 32.192-6.4h19.328c19.328 6.4 32.192 12.8 38.592 31.936 19.328 31.936 6.464 70.208-25.728 89.344-32.192 19.2-70.848 6.4-90.112-25.536-6.4-12.8-6.4-31.872-6.4-51.072z m-547.2 51.072c-19.328 31.936-57.984 38.336-90.176 25.6-12.864-12.8-25.728-25.6-32.192-38.4 0-19.072 0-38.272 6.4-51.008 12.928-12.8 25.792-25.6 38.656-31.936 19.328 0 38.656 0 51.52 6.4 12.864 6.4 25.728 19.2 32.192 38.272 0 19.2 0 38.336-6.4 51.072z m6.4 370.304c-6.4 19.2-12.864 31.936-32.192 38.272-12.864 6.4-32.192 6.4-51.52 6.4-19.328-6.4-32.192-12.8-38.592-31.936-6.464-12.8-12.928-31.872-6.464-51.072 6.4-19.136 12.864-31.872 32.192-38.272 12.864-6.4 19.328-6.4 32.192-6.4h19.328c19.328 6.4 32.192 12.8 38.592 31.936 6.464 12.8 6.464 31.936 6.464 51.072z m206.016-593.728c0-38.272 25.728-63.808 64.384-63.808s64.384 25.536 64.384 63.808c0 38.336-25.728 63.872-64.384 63.872s-64.384-25.6-64.384-63.872z m128.768 766.08c0 38.336-25.728 63.872-64.384 63.872s-64.384-25.6-64.384-63.872 25.728-63.808 64.384-63.808 64.384 25.536 64.384 63.808zM528.0672 607.616c-51.52 0-96.576-44.672-96.576-95.744s45.056-95.744 96.576-95.744c51.52 0 96.576 44.672 96.576 95.744s-45.056 95.744-96.576 95.744z m392.704 127.68c-6.4 12.8-19.264 25.6-38.592 32-19.328 6.336-32.192 0-51.52-6.4-12.864-6.4-25.728-19.2-32.192-38.4-6.4-19.072 0-31.872 6.4-51.008 12.928-19.2 32.256-31.936 57.984-31.936 12.864 0 19.328 0 32.192 6.4 32.192 19.2 38.656 57.472 25.728 89.344z" 
                    fill="currentColor"
                  />
                </svg>
                <span className="text-xs">Omnichannel</span>
              </button>
              <div className={`relative group ${activeTab === 'meta' ? '' : ''}`}
                onMouseEnter={() => setHoveredPlatform('meta')}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <button
                  ref={metaButtonRef}
                  onClick={() => handleTabChange('meta')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'meta' 
                      ? 'bg-white text-blue-700 shadow-sm font-bold' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <img src={META_ICON_URL} alt="Meta" className="w-4 h-4 rounded" />
                  <span className="text-xs">Meta</span>
                </button>
                {hoveredPlatform === 'meta' && (
                  <Tooltip 
                    accounts={metaAccounts} 
                    title="Meta Accounts Connected" 
                    platform="meta"
                    buttonRef={metaButtonRef}
                  />
                )}
              </div>
              <div 
                className={`relative group ${activeTab === 'google' ? '' : ''}`}
                onMouseEnter={() => setHoveredPlatform('google')}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <button
                  ref={googleButtonRef}
                  onClick={() => handleTabChange('google')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'google' 
                      ? 'bg-white text-blue-600 shadow-sm font-bold' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <img src={GOOGLE_ICON_URL} alt="Google" className="w-4 h-4 rounded" />
                  <span className="text-xs">Google</span>
                </button>
                {hoveredPlatform === 'google' && (
                  <Tooltip 
                    accounts={googleAccounts} 
                    title="Google Accounts Connected" 
                    platform="google"
                    buttonRef={googleButtonRef}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Budget Info + Rules Library + Collapse Button */}
          <div className="flex items-center gap-3">
            {/* Budget Info with Modal */}
            <div>
              <button 
                ref={buttonRef}
                onClick={() => setShowBudgetModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-sm hover:bg-blue-100 transition-colors"
              >
                <Target size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold text-slate-600">
                  DailyBudget$500, Purchase, ROAS{'>'}5
                </span>
                <Edit2 size={10} className="text-slate-400" />
              </button>
            </div>

            {/* Rules Library Button */}
            <button 
              onClick={onRuleLibraryClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shadow-sm border bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Zap size={10} className="text-blue-500" />
              <span className="text-[10px] font-black tracking-tight">Rules Library</span>
            </button>

            {/* Collapse/Expand Button - Hide when activeTab is 'google' */}
            {activeTab !== 'google' && (
              <button
                onClick={onCollapseToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm text-slate-600 hover:text-slate-800 group"
              >
                <span className="text-[11px] font-bold">{isCollapsed ? 'Expand' : 'Collapse'}</span>
                {isCollapsed ? (
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Budget Goal Modal */}
      {showBudgetModal && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBudgetModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Target size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Optimization Goal</h3>
                    <p className="text-sm text-blue-100">Configure your budget strategy</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBudgetModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Current Goal - Structured Card */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-indigo-900">Current Optimization Goal</h4>
                  </div>
                  
                  {/* Row 1: Daily Budget */}
                  <div className="mb-3 pb-3 border-b border-indigo-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700">Daily Budget</span>
                      <span className="text-sm font-bold text-indigo-900">$500</span>
                    </div>
                  </div>
                  
                  {/* Row 2: Purchase & ROAS */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-700">Purchase</span>
                      <span className="text-sm font-bold text-indigo-900">Conversion Goal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-indigo-700">ROAS Target</span>
                      <span className="text-sm font-bold text-green-600">{'>'} 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                onClick={() => {
                  setShowBudgetModal(false);
                  onEditBrandConfig();
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Go to modify
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DashboardInsightsHeader;
