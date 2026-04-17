import { Check } from 'lucide-react';
import { CHAT_PRODUCT_IMAGES } from '../constants';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function StepConfirmImage({
  chatImportPhase,
  chatProductIdx,
  chatSelectedImages,
  chatProductTitle,
  chatTargetAudience,
  chatSellingPoints,
  chatOriginalPrice,
  chatPromoPrice,
  chatPromoText,
  chatBrandColors,
  chatHasLogo,
  chatEditingColorIdx,
  onToggleImage,
  onSetProductTitle,
  onSetTargetAudience,
  onSetSellingPoint,
  onSetOriginalPrice,
  onSetPromoPrice,
  onSetPromoText,
  onSetBrandColor,
  onSetHasLogo,
  onSetEditingColorIdx,
  onConfirmStep,
}) {
  // ── Importing phase ─────────────────────────────────────
  if (chatImportPhase === 'importing') {
    return (
      <div className="w-[440px] flex flex-col items-center justify-center py-10 gap-4">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <span className="text-base font-medium animate-shimmer">Importing product info…</span>
      </div>
    );
  }

  // ── Picking / done phase ────────────────────────────────
  if (chatImportPhase === 'picking' || chatImportPhase === 'done') {
    return (
      <div className="w-[520px] space-y-5">
        {/* Product Images grid */}
        <div>
          <p className="text-[14px] font-medium text-gray-700 mb-2">Select product image</p>
          <div className="grid grid-cols-5 gap-2">
            {CHAT_PRODUCT_IMAGES.slice(0, 10).map((url, i) => {
              const isSelected = chatSelectedImages.has(i);
              const isAiPick = i === 0;
              return (
                <button
                  key={i}
                  onClick={() => onToggleImage(i)}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                    isSelected
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-transparent hover:border-gray-300'
                  )}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary-500/10 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                  {isAiPick && (
                    <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded text-[9px] font-bold bg-primary-500 text-white leading-none">
                      AI Pick
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product info form */}
        <div className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
          <p className="text-[13px] font-semibold text-gray-700">Product Info</p>

          {/* Title */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 block mb-1">Product Title</label>
            <input
              type="text"
              value={chatProductTitle}
              onChange={e => onSetProductTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="e.g. Ceramic Face Wash"
            />
          </div>

          {/* Target audience */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 block mb-1">Target Audience</label>
            <input
              type="text"
              value={chatTargetAudience}
              onChange={e => onSetTargetAudience(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="e.g. Women ages 20-35, skincare enthusiasts"
            />
          </div>

          {/* Selling points */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 block mb-1">Key Selling Points</label>
            <div className="space-y-1.5">
              {chatSellingPoints.map((sp, i) => (
                <input
                  key={i}
                  type="text"
                  value={sp}
                  onChange={e => onSetSellingPoint(i, e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder={`Selling point ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Pricing row */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[12px] font-medium text-gray-500 block mb-1">Original Price</label>
              <input
                type="text"
                value={chatOriginalPrice}
                onChange={e => onSetOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="$99.00"
              />
            </div>
            <div className="flex-1">
              <label className="text-[12px] font-medium text-gray-500 block mb-1">Promo Price</label>
              <input
                type="text"
                value={chatPromoPrice}
                onChange={e => onSetPromoPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="$69.00"
              />
            </div>
          </div>

          {/* Promo text */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 block mb-1">
              Promo Text <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={chatPromoText}
              onChange={e => onSetPromoText(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="e.g. Limited time — save $30 today!"
            />
          </div>

          {/* Brand colors + logo toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[12px] font-medium text-gray-500 block mb-1">Brand Colors</label>
              <div className="flex gap-2">
                {chatBrandColors.map((color, i) => (
                  <div key={i} className="relative">
                    <button
                      onClick={() => onSetEditingColorIdx(chatEditingColorIdx === i ? null : i)}
                      className="w-7 h-7 rounded-lg border-2 border-white shadow ring-1 ring-gray-200 hover:ring-primary-400 transition-all"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    {chatEditingColorIdx === i && (
                      <input
                        type="color"
                        value={color}
                        onChange={e => onSetBrandColor(i, e.target.value)}
                        className="absolute opacity-0 cursor-pointer w-7 h-7"
                        style={{ top: '100%', left: 0, zIndex: 10, position: 'absolute' }}
                        autoFocus
                        onBlur={() => onSetEditingColorIdx(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logo toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-500">Include Logo</span>
              <button
                onClick={() => onSetHasLogo(!chatHasLogo)}
                className={cn(
                  'w-9 h-5 rounded-full transition-colors relative shrink-0',
                  chatHasLogo ? 'bg-primary-500' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                    chatHasLogo ? 'translate-x-4' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Continue CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => onConfirmStep(2)}
            disabled={chatSelectedImages.size === 0}
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
