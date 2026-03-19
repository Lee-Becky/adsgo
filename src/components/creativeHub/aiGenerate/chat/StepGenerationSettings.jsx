import { useState } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { AiMessage } from './ChatMessage';
import { SUGGESTIONS, QTY_OPTIONS, RATIO_OPTIONS } from '../constants';
import { getNextModalZIndex } from '../../../../constants/zIndex';

export default function StepGenerationSettings({
  card4,
  openDropdown,
  onSetRequirements,
  onSetQuantity,
  onToggleRatio,
  onToggleDropdown,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <AiMessage text="Almost there! Customize your generation settings, or use the AI defaults">
      <div className="space-y-3">
        {/* Requirements */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">
              Special Requirements <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-[10px] text-primary-500 hover:text-primary-600 font-medium transition-colors flex items-center gap-0.5"
            >
              <Sparkles className="w-3 h-3" />Suggestions
            </button>
          </div>
          <input
            type="text"
            placeholder="e.g. add a discount badge, holiday feel..."
            value={card4.requirements}
            onChange={(e) => onSetRequirements(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
          {showSuggestions && (
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSetRequirements(s);
                    setShowSuggestions(false);
                  }}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Quantity</label>
          <div className="relative" data-dropdown="qty">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleDropdown('qty'); }}
              className={`w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                openDropdown === 'qty' ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span>{card4.quantity} creative{card4.quantity > 1 ? 's' : ''}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openDropdown === 'qty' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'qty' && (
              <div
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                style={{ zIndex: getNextModalZIndex() }}
              >
                <div className="py-1">
                  {QTY_OPTIONS.map(q => (
                    <button
                      key={q}
                      onClick={(e) => { e.stopPropagation(); onSetQuantity(q); }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                        card4.quantity === q ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {q} creative{q > 1 ? 's' : ''}
                      {card4.quantity === q && <Check className="w-4 h-4 text-primary-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Aspect Ratio <span className="text-gray-400 font-normal">(multi-select)</span>
          </label>
          <div className="relative" data-dropdown="ratio">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleDropdown('ratio'); }}
              className={`w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                openDropdown === 'ratio' ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="truncate">{[...card4.ratios].join(', ')}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openDropdown === 'ratio' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'ratio' && (
              <div
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                style={{ zIndex: getNextModalZIndex() }}
              >
                <div className="py-1">
                  {RATIO_OPTIONS.map(r => {
                    const active = card4.ratios.has(r.v);
                    return (
                      <button
                        key={r.v}
                        onClick={(e) => { e.stopPropagation(); onToggleRatio(r.v); }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                          active ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{r.label} <span className={`text-xs ${active ? 'text-primary-400' : 'text-gray-400'}`}>{r.tip}</span></span>
                        {active && <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AiMessage>
  );
}
