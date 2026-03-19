import { useRef, useEffect } from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { AiMessage, UserBubble } from './chat/ChatMessage';
import StepSourceSelect from './chat/StepSourceSelect';
import StepConfirmImage from './chat/StepConfirmImage';
import StepConfirmTemplate from './chat/StepConfirmTemplate';
import StepGenerationSettings from './chat/StepGenerationSettings';
import {
  SOURCES, PRODUCTS, PRODUCT_IMAGES, STYLES,
  productImg, templateImg, SOURCE_ICONS,
} from './constants';

export default function ChatPanel({
  activeStep, card1, card2, card3, card4,
  sources, openDropdown, generating,
  onSelectSource, onSelectProduct, onConfirmStep, onChangeStep,
  onChangePhase, onSelectImage, onSetBrowsing, onSelectTemplate,
  onSetRequirements, onSetQuantity, onToggleRatio, onToggleDropdown,
  onNewTask, onGenerate,
}) {
  const chatFlowRef = useRef(null);

  useEffect(() => {
    if (chatFlowRef.current) {
      setTimeout(() => {
        chatFlowRef.current.scrollTo({ top: chatFlowRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  }, [activeStep, card1, card2, card3]);

  const isReady = activeStep >= 4;
  const style = STYLES.find(s => s.id === card3.selectedStyle) || STYLES[0];
  const buttonText = isReady
    ? `Generate ${card4.quantity} creatives \u00b7 ${card4.ratios.size} sizes \u00b7 ${style.name}`
    : 'Complete all steps to generate';

  // Step 1 user bubble content
  const renderStep1UserBubble = () => {
    const src = (sources || SOURCES).find(s => s.id === card1.source);
    if (card1.source === 'url') {
      return (
        <UserBubble onChangeStep={() => onChangeStep(1)}>
          <div className="w-6 h-6 rounded bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-500">
            {SOURCE_ICONS.globe}
          </div>
          <span className="text-gray-900 font-medium truncate">{card1.url || 'Product URL'}</span>
        </UserBubble>
      );
    }
    const p = card1.product !== null ? PRODUCTS[card1.product] : null;
    return (
      <UserBubble onChangeStep={() => onChangeStep(1)}>
        {p && <img src={p.pic} className="w-6 h-6 rounded object-cover flex-shrink-0" alt="" />}
        <span className="text-gray-900 font-medium truncate">{p ? p.name : src?.name || ''}</span>
        <span className="text-xs text-gray-400">{src?.name || ''}</span>
      </UserBubble>
    );
  };

  // Step 2 user bubble
  const renderStep2UserBubble = () => {
    const pIdx = card1.product || 0;
    const img = PRODUCT_IMAGES[card2.selectedIdx];
    return (
      <UserBubble onChangeStep={() => onChangeStep(2)}>
        <img src={productImg(pIdx, card2.selectedIdx)} className="w-6 h-6 rounded object-cover flex-shrink-0" alt="" />
        <span className="text-gray-900 font-medium">{img.label}</span>
        <span className="text-[10px] text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded-full">AI Pick</span>
      </UserBubble>
    );
  };

  // Step 3 user bubble
  const renderStep3UserBubble = () => {
    const styleObj = STYLES.find(s => s.id === card3.selectedStyle) || STYLES[0];
    const sIdx = STYLES.indexOf(styleObj);
    return (
      <UserBubble onChangeStep={() => onChangeStep(3)}>
        <img src={templateImg(sIdx >= 0 ? sIdx : 0)} className="w-6 h-6 rounded object-cover flex-shrink-0" alt="" />
        <span className="text-gray-900 font-medium">{styleObj.name}</span>
      </UserBubble>
    );
  };

  return (
    <div className="w-[400px] flex-shrink-0 bg-white rounded-[20px] border border-[#F0F0F0] card-shadow flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Chat flow */}
      <div ref={chatFlowRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Step 1 */}
        {activeStep === 1 ? (
          <StepSourceSelect
            card1={card1}
            sources={sources}
            onSelectSource={onSelectSource}
            onSelectProduct={onSelectProduct}
            onConfirmStep={onConfirmStep}
            onChangePhase={onChangePhase}
          />
        ) : (
          <AiMessage text="What product would you like to promote?" />
        )}

        {/* Step 1 → 2 transition */}
        {activeStep > 1 && (
          <>
            {renderStep1UserBubble()}
            {activeStep === 2 ? (
              <StepConfirmImage
                card1={card1}
                card2={card2}
                onSelectImage={onSelectImage}
                onConfirmStep={onConfirmStep}
              />
            ) : (
              <AiMessage text="I found the best image for your product" />
            )}
          </>
        )}

        {/* Step 2 → 3 transition */}
        {activeStep > 2 && (
          <>
            {renderStep2UserBubble()}
            {activeStep === 3 ? (
              <StepConfirmTemplate
                card3={card3}
                onSetBrowsing={onSetBrowsing}
                onSelectTemplate={onSelectTemplate}
                onConfirmStep={onConfirmStep}
              />
            ) : (
              <AiMessage text="I recommend this creative template for your product" />
            )}
          </>
        )}

        {/* Step 3 → 4 transition */}
        {activeStep > 3 && (
          <>
            {renderStep3UserBubble()}
            <StepGenerationSettings
              card4={card4}
              openDropdown={openDropdown}
              onSetRequirements={onSetRequirements}
              onSetQuantity={onSetQuantity}
              onToggleRatio={onToggleRatio}
              onToggleDropdown={onToggleDropdown}
            />
          </>
        )}
      </div>

      {/* Sticky bottom: Generate */}
      <div className="px-5 py-4 border-t border-gray-100">
        <button
          onClick={onGenerate}
          disabled={!isReady || generating}
          className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg text-sm font-medium shadow-sm shadow-primary-500/20 hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-500"
        >
          <Sparkles className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
