import { Upload, Sparkles } from 'lucide-react';
import { AiMessage } from './ChatMessage';
import { PRODUCT_IMAGES, productImg } from '../constants';

export default function StepConfirmImage({ card1, card2, onSelectImage, onConfirmStep }) {
  const pIdx = card1.product || 0;
  const selIdx = card2.selectedIdx;
  const mainImg = PRODUCT_IMAGES[selIdx];

  return (
    <AiMessage text="I found the best image for your product">
      {/* Main image */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ maxWidth: 200 }}>
        <div className="aspect-square">
          <img src={productImg(pIdx, selIdx)} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-600 border border-primary-200">
          <Sparkles className="w-3 h-3 mr-0.5" />AI Pick
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-1.5">{mainImg.reason || mainImg.label}</p>

      {/* Thumbnails */}
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {PRODUCT_IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => onSelectImage(i)}
            className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
              i === selIdx ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img src={productImg(pIdx, i)} alt={img.label} className="w-full h-full object-cover" />
          </button>
        ))}
        <label className="w-10 h-10 rounded-md border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all flex-shrink-0">
          <Upload className="w-4 h-4 text-gray-400" />
          <input type="file" className="hidden" accept="image/*" />
        </label>
      </div>

      <button
        onClick={() => onConfirmStep(2)}
        className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 transition-all"
      >
        Use This Image &rarr;
      </button>
    </AiMessage>
  );
}
