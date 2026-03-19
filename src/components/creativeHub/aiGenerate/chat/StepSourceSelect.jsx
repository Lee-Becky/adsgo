import { useState } from 'react';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { AiMessage } from './ChatMessage';
import { SOURCES, PRODUCTS, SOURCE_ICONS } from '../constants';

export default function StepSourceSelect({ card1, sources, onSelectSource, onSelectProduct, onConfirmStep, onChangePhase }) {
  const [isFetching, setIsFetching] = useState(false);
  const [urlValue, setUrlValue] = useState(card1.url);

  const handleFetch = () => {
    if (!urlValue) return;
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      onSelectProduct(0, urlValue);
      onConfirmStep(1);
    }, 1200);
  };

  const BackButton = () => (
    <button
      onClick={() => onChangePhase('source-select')}
      className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors flex items-center gap-1 mb-2"
    >
      <ArrowLeft className="w-3 h-3" /> Change source
    </button>
  );

  // Phase: source-select
  if (card1.phase === 'source-select') {
    return (
      <AiMessage text="What product would you like to promote?">
        <div className="space-y-2">
          {(sources || SOURCES).map(s => {
            const connected = s.status === 'connected';
            const disconnected = s.status === 'disconnected';
            return (
              <button
                key={s.id}
                onClick={() => onSelectSource(s.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all text-left text-sm"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  connected ? 'bg-success-50 text-success-500' : disconnected ? 'bg-gray-100 text-gray-400' : 'bg-primary-50 text-primary-500'
                }`}>
                  {SOURCE_ICONS[s.icon]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{s.name}</p>
                  <p className="text-xs text-gray-500 leading-tight">{s.desc}</p>
                </div>
                {connected && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" />}
                {disconnected && <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">Connect</span>}
              </button>
            );
          })}
        </div>
      </AiMessage>
    );
  }

  // Phase: url-input
  if (card1.phase === 'url-input') {
    return (
      <AiMessage text="Paste your product URL below">
        <BackButton />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {SOURCE_ICONS.globe && <span className="text-gray-400 [&>svg]:w-4 [&>svg]:h-4">{SOURCE_ICONS.globe}</span>}
            </div>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://example.com/product-page"
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={isFetching}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 transition-all whitespace-nowrap disabled:opacity-50"
          >
            {isFetching ? <><Loader2 className="animate-spin h-4 w-4 inline mr-1.5" />Fetching...</> : 'Fetch'}
          </button>
        </div>
        {isFetching && (
          <div className="grid grid-cols-6 gap-1.5 mt-2">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        )}
      </AiMessage>
    );
  }

  // Phase: product-list
  if (card1.phase === 'product-list') {
    const src = (sources || SOURCES).find(s => s.id === card1.source);
    return (
      <AiMessage text={`Here are your ${src?.name || ''} products`}>
        <BackButton />
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <div className="space-y-0.5 max-h-[240px] overflow-y-auto">
          {PRODUCTS.map((p, i) => {
            const sel = card1.product === i;
            return (
              <button
                key={i}
                onClick={() => onSelectProduct(i)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left ${
                  sel ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <img src={p.pic} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${sel ? 'text-primary-700' : 'text-gray-900'}`}>{p.name}</p>
                  <p className="text-xs text-gray-500">{p.cat}</p>
                </div>
                <span className={`text-xs font-medium ${sel ? 'text-primary-600' : 'text-gray-500'}`}>{p.price}</span>
              </button>
            );
          })}
        </div>
        {card1.product !== null && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => onConfirmStep(1)}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 transition-all"
            >
              Continue with this product &rarr;
            </button>
          </div>
        )}
      </AiMessage>
    );
  }

  return null;
}
