import { useState } from 'react';
import { Sparkles, X, Upload } from 'lucide-react';
import { AiMessage } from './ChatMessage';
import { TEMPLATE_LIB, templateImg } from '../constants';

const FILTER_STYLES = ['All', 'Minimal', 'Lifestyle', 'Bold'];

export default function StepConfirmTemplate({ card3, onSetBrowsing, onSelectTemplate, onConfirmStep }) {
  const [filterStyle, setFilterStyle] = useState('All');

  // AI auto-generate mode (default)
  if (!card3.browsing) {
    return (
      <AiMessage text="I recommend this creative template for your product">
        <div className="p-3 bg-primary-50 rounded-xl border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-gray-900">AI Auto-Generate</h4>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary-100 text-primary-600">Recommended</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                AI analyzes your product and creates the optimal creative template automatically
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => onSetBrowsing(true)}
            className="text-xs text-gray-500 hover:text-primary-600 font-medium transition-colors"
          >
            Use creative templates
          </button>
          <button
            onClick={() => onConfirmStep(3)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 transition-all"
          >
            Continue &rarr;
          </button>
        </div>
      </AiMessage>
    );
  }

  // Browse templates mode
  const filteredTemplates = filterStyle === 'All'
    ? TEMPLATE_LIB
    : TEMPLATE_LIB.filter(t => t.style === filterStyle);

  return (
    <AiMessage text="Browse and pick a template style">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1.5">
          {FILTER_STYLES.map(s => (
            <button
              key={s}
              onClick={() => setFilterStyle(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                s === filterStyle ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => onSetBrowsing(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {filteredTemplates.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onSelectTemplate(t.style.toLowerCase())}
            className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-300 transition-all"
          >
            <img src={templateImg(TEMPLATE_LIB.indexOf(t) + 3)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <label className="flex items-center justify-center w-full py-2 mt-1.5 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all group">
        <Upload className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary-500 transition-colors mr-1" />
        <span className="text-xs text-gray-600">
          <span className="text-primary-600 font-medium">Upload</span> template
        </span>
        <input type="file" className="hidden" accept="image/*" />
      </label>
    </AiMessage>
  );
}
