import { useState } from 'react';
import { Globe, ChevronRight, Search, Check, ShoppingBag, Share2, LayoutGrid } from 'lucide-react';
import { CHAT_PRODUCTS, MY_PRODUCTS, THIRD_PARTY_PLATFORMS } from '../constants';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Lucide-icon fallback for "my-products"
function MyProductsIcon({ size = 15 }) {
  return <LayoutGrid size={size} />;
}

function ThirdPartyIcon({ size = 15 }) {
  return <Globe size={size} />;
}

export default function StepSourceSelect({
  chatPhase,
  chatSource,
  chatThirdPartyPlatform,
  chatProductIdx,
  chatProductCategoryFilter,
  chatSearchQuery,
  chatUrlValue,
  chatUrlError,
  chatIsSyncing,
  onSetPhase,
  onSetSource,
  onSetThirdPartyPlatform,
  onSetProductIdx,
  onSetProductCategoryFilter,
  onSetSearchQuery,
  onSetUrlValue,
  onSetUrlError,
  onConfirmStep,
  onOpenConnectModal,
}) {
  const isValidUrl = v => /^https?:\/\/.+/.test(v.trim());

  const handleUrlContinue = () => {
    if (!chatUrlValue) return;
    if (!isValidUrl(chatUrlValue)) {
      onSetUrlError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    onSetUrlError(null);
    onSetSource('url');
    onSetProductIdx(0);
    onConfirmStep(1);
  };

  // ── Phase: source-select ────────────────────────────────
  if (chatPhase === 'source-select') {
    return (
      <div className="w-[440px]">
        <p className="text-[14px] text-gray-500 mb-3">Paste your product link to continue.</p>

        {/* Primary: URL input */}
        <div className="mb-3 rounded-xl border border-primary-200 bg-primary-50/30">
          <div className="flex items-center gap-3 px-3.5 pt-3 pb-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-50 text-primary-500">
              <Globe size={15} />
            </div>
            <p className="text-[16px] font-medium text-gray-900 leading-tight">Product URL</p>
          </div>
          <div className="px-3.5 pb-3.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="url"
                  value={chatUrlValue}
                  autoFocus
                  onChange={e => { onSetUrlValue(e.target.value); if (chatUrlError) onSetUrlError(null); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleUrlContinue(); }}
                  placeholder="https://example.com/product-page"
                  className={cn(
                    'w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all',
                    chatUrlError
                      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                      : 'border-gray-200 focus:border-primary-500'
                  )}
                />
              </div>
              <button
                onClick={handleUrlContinue}
                disabled={!chatUrlValue}
                className="px-4 h-10 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 shadow-sm shadow-primary-500/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all shrink-0 whitespace-nowrap"
              >
                Continue
              </button>
            </div>
            {chatUrlError && (
              <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full border border-error-500 inline-flex items-center justify-center shrink-0 text-[9px] font-bold">!</span>
                {chatUrlError}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-3">
          <span className="text-[14px] text-gray-500">Or select your product from below.</span>
        </div>

        {/* Secondary sources */}
        <div className="space-y-1.5">
          {[
            { id: 'myproducts', name: 'My Products',          desc: 'Select from your products in AdsGo',        Icon: MyProductsIcon },
            { id: 'thirdparty', name: 'Third-party Products', desc: 'Select from Shopify, Meta Catalog, Google MC', Icon: ThirdPartyIcon },
          ].map(src => (
            <button
              key={src.id}
              onClick={() => {
                onSetSource(src.id);
                if (src.id === 'thirdparty') {
                  onSetPhase('thirdparty-select');
                } else {
                  onSetPhase('product-list');
                }
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/40 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-50 text-primary-500">
                <src.Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-medium text-gray-900 leading-tight">{src.name}</p>
                <p className="text-[12px] text-gray-500 leading-tight mt-0.5">{src.desc}</p>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-400 shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Phase: thirdparty-select ────────────────────────────
  if (chatPhase === 'thirdparty-select') {
    return (
      <div className="w-[440px]">
        <p className="text-[14px] text-gray-500 mb-3">Select a platform to import your product from.</p>
        <div className="space-y-1.5">
          {THIRD_PARTY_PLATFORMS.map(platform => {
            const isConnected = platform.status === 'connected';
            const PlatformIcon = platform.id === 'shopify' ? ShoppingBag : platform.id === 'meta' ? Share2 : Globe;
            return (
              <button
                key={platform.id}
                onClick={() => {
                  onSetThirdPartyPlatform(platform.id);
                  if (isConnected) {
                    onSetPhase('product-list');
                  } else {
                    onOpenConnectModal(platform.name);
                  }
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/40 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-gray-100">
                  <PlatformIcon size={16} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium text-gray-900 leading-tight">{platform.name}</p>
                  <p className="text-[12px] text-gray-500 leading-tight mt-0.5">{platform.desc}</p>
                </div>
                {isConnected && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-success-50 text-success-500 shrink-0 mr-1 flex items-center gap-1">
                    <Check size={10} strokeWidth={2.5} />
                    Connected
                  </span>
                )}
                <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-400 shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <button
            onClick={() => { onSetPhase('source-select'); onSetSource(null); }}
            className="px-6 h-10 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 hover:text-primary-600 hover:border-primary-500 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: product-list ─────────────────────────────────
  if (chatPhase === 'product-list') {
    const activeProducts = chatSource === 'myproducts' ? MY_PRODUCTS : CHAT_PRODUCTS;
    const allCats = ['All', ...Array.from(new Set(activeProducts.map(p => p.cat)))];
    const filteredProducts = activeProducts.filter(p => {
      const matchesCat = chatProductCategoryFilter === 'All' || p.cat === chatProductCategoryFilter;
      const q = chatSearchQuery.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });

    const handleBack = () => {
      if (chatSource === 'thirdparty') {
        onSetPhase('thirdparty-select');
      } else {
        onSetPhase('source-select');
        onSetSource(null);
      }
      onSetProductIdx(null);
      onSetSearchQuery('');
    };

    return (
      <div className="w-[440px]">
        {chatIsSyncing ? (
          <div className="flex flex-col items-center justify-center h-[380px] gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-[16px] font-medium animate-shimmer">Syncing your products…</span>
          </div>
        ) : activeProducts.length === 0 ? (
          <>
            <div className="flex flex-col items-center justify-center h-[340px] gap-3">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="opacity-60">
                <rect width="120" height="120" rx="12" fill="#F5F0FF"/>
                <path d="M40 80V50L60 35L80 50V80H40Z" stroke="#7033F5" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <path d="M52 80V65H68V80" stroke="#7033F5" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <circle cx="60" cy="52" r="4" fill="#C3A2FE"/>
              </svg>
              <div className="text-center max-w-xs">
                <p className="text-[16px] font-semibold text-gray-800">No Products Yet</p>
                <p className="text-[14px] text-gray-400 mt-1">
                  Add products to AdsGo to get started.{' '}
                  <button className="text-primary-500 hover:text-primary-600 transition-colors font-medium">Learn more</button>
                </p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="px-6 h-10 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 hover:text-primary-600 hover:border-primary-500 transition-all"
            >
              Back
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-[14px] text-gray-500 mb-3">
                {chatSource === 'myproducts' ? 'Here are your products synced to AdsGo. Please select one product to continue.'
                  : chatSource === 'thirdparty' && chatThirdPartyPlatform === 'shopify' ? 'Here are your Shopify products. Please select one product to continue.'
                  : chatSource === 'thirdparty' && chatThirdPartyPlatform === 'meta' ? 'Here are your Meta Catalog products. Please select one product to continue.'
                  : chatSource === 'thirdparty' && chatThirdPartyPlatform === 'gmc' ? 'Here are your Google MC products. Please select one product to continue.'
                  : 'Here are your products. Please select one product to continue.'}
              </p>

              {/* Category filter chips */}
              {allCats.length > 2 && (
                <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
                  {allCats.map(cat => (
                    <button
                      key={cat}
                      onClick={() => onSetProductCategoryFilter(cat)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[13px] font-medium transition-all border shrink-0',
                        chatProductCategoryFilter === cat
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={chatSearchQuery}
                  onChange={e => onSetSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Product list */}
              <div className="space-y-1 h-[280px] overflow-y-auto custom-scrollbar px-0.5 py-0.5">
                {filteredProducts.length > 0 ? filteredProducts.map(product => {
                  const origIdx = CHAT_PRODUCTS.indexOf(product);
                  const isSelected = chatProductIdx === origIdx;
                  return (
                    <button
                      key={origIdx}
                      onClick={() => onSetProductIdx(origIdx)}
                      className={cn(
                        'w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left',
                        isSelected ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-500/20' : 'border-transparent hover:bg-gray-50'
                      )}
                    >
                      <img src={product.pic} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium truncate', isSelected ? 'text-primary-700' : 'text-gray-900')}>{product.name}</p>
                        <p className={cn('text-[13px] truncate', isSelected ? 'text-primary-400' : 'text-gray-400')}>{product.url ?? product.cat}</p>
                      </div>
                      <span className={cn('text-[14px] font-semibold shrink-0', isSelected ? 'text-primary-600' : 'text-gray-500')}>{product.price}</span>
                    </button>
                  );
                }) : (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-60">
                      <rect width="80" height="80" rx="8" fill="#F5F0FF"/>
                      <circle cx="35" cy="35" r="14" stroke="#7033F5" strokeWidth="2" fill="none"/>
                      <path d="M45 45L55 55" stroke="#7033F5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div className="text-center max-w-xs">
                      <p className="text-[16px] font-semibold text-gray-800">No Results Found</p>
                      <p className="text-[14px] text-gray-400 mt-1 break-words">No products match "{chatSearchQuery}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleBack}
                className="px-6 h-10 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 hover:text-primary-600 hover:border-primary-500 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => onConfirmStep(1)}
                disabled={chatProductIdx === null}
                className="px-6 h-10 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 shadow-sm shadow-primary-500/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Phase: url-input (back-navigation only) ─────────────
  if (chatPhase === 'url-input') {
    return (
      <div className="w-[440px]">
        <p className="text-[14px] text-gray-500 mb-3">Paste your product URL below.</p>
        <div className="relative">
          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            value={chatUrlValue}
            autoFocus
            onChange={e => { onSetUrlValue(e.target.value); if (chatUrlError) onSetUrlError(null); }}
            onKeyDown={e => { if (e.key === 'Enter') handleUrlContinue(); }}
            placeholder="https://example.com/product-page"
            className={cn(
              'w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all',
              chatUrlError ? 'border-error-500' : 'border-gray-300 focus:border-primary-500'
            )}
          />
        </div>
        {chatUrlError && (
          <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full border border-error-500 inline-flex items-center justify-center shrink-0 text-[9px] font-bold">!</span>
            {chatUrlError}
          </p>
        )}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => { onSetPhase('source-select'); onSetSource(null); onSetUrlError(null); }}
            className="px-6 h-10 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 hover:text-primary-600 hover:border-primary-500 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleUrlContinue}
            disabled={!chatUrlValue}
            className="px-6 h-10 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 shadow-sm shadow-primary-500/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}
