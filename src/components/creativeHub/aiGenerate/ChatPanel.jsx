import { useRef, useEffect } from 'react';
import { Undo2, Link as LinkIcon, Globe, Sparkles } from 'lucide-react';
import StepSourceSelect from './chat/StepSourceSelect';
import StepConfirmImage from './chat/StepConfirmImage';
import StepConfirmTemplate from './chat/StepConfirmTemplate';
import StepGenerationSettings from './chat/StepGenerationSettings';
import { AiAvatar, CHAT_PRODUCTS, CHAT_TEMPLATES } from './constants';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// A message bubble from the AI
function AiMessage({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5"><AiAvatar uid="msg" /></div>
      <p className="text-[16px] text-[#141414] mt-2">{text}</p>
    </div>
  );
}

// A user reply bubble with optional "undo" button
function UserBubble({ onUndo, children }) {
  return (
    <div className="flex justify-end">
      <div className="group/bubble relative flex items-center gap-2.5 bg-primary-50 rounded-xl rounded-tr-sm px-3.5 py-2.5">
        {children}
        {onUndo && (
          <button
            onClick={onUndo}
            className="absolute -bottom-8 right-0 w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-primary-500 hover:border-primary-300 transition-colors opacity-0 group-hover/bubble:opacity-100"
          >
            <Undo2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ChatPanel({
  // State
  chatStep,
  chatPhase,
  chatSource,
  chatThirdPartyPlatform,
  chatProductIdx,
  chatProductCategoryFilter,
  chatSearchQuery,
  chatUrlValue,
  chatUrlError,
  chatIsSyncing,
  chatImportPhase,
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
  chatTemplateCategory,
  chatSelectedTemplates,
  chatQuantity,
  chatRatios,
  chatRequirements,
  chatSuggestionPage,
  // Callbacks
  onSetPhase,
  onSetSource,
  onSetThirdPartyPlatform,
  onSetProductIdx,
  onSetProductCategoryFilter,
  onSetSearchQuery,
  onSetUrlValue,
  onSetUrlError,
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
  onSetTemplateCategory,
  onToggleTemplate,
  onSetQuantity,
  onSetRatios,
  onSetRequirements,
  onSetSuggestionPage,
  onConfirmStep,
  onChangeStep,
  onOpenConnectModal,
  onGenerate,
}) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when step or phase changes
  useEffect(() => {
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
    return () => clearTimeout(timer);
  }, [chatStep, chatPhase, chatImportPhase, chatTemplateCategory]);

  // ── Step 1 user bubble ─────────────────────────────────
  const renderStep1Bubble = () => {
    const product = chatProductIdx !== null ? CHAT_PRODUCTS[chatProductIdx] : null;
    return (
      <UserBubble onUndo={() => onChangeStep(1)}>
        {chatSource === 'url' ? (
          <>
            <div className="w-9 h-9 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
              <LinkIcon size={16} className="text-primary-500" />
            </div>
            <p className="text-[16px] text-primary-700">{chatUrlValue || 'URL Import'}</p>
          </>
        ) : product ? (
          <>
            <img src={product.pic} alt="" className="w-9 h-9 rounded-md object-cover shrink-0" />
            <p className="text-[16px] text-primary-700">{product.name}</p>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-primary-500" />
            </div>
            <p className="text-[16px] text-primary-700">Uploaded</p>
          </>
        )}
      </UserBubble>
    );
  };

  // ── Step 2 user bubble ─────────────────────────────────
  const renderStep2Bubble = () => {
    const imgUrl = chatSelectedImages.size > 0
      ? `https://images.unsplash.com/photo-1556228720-195a672e8a03?w=40&h=40&fit=crop`
      : null;
    return (
      <UserBubble onUndo={() => onChangeStep(2)}>
        {imgUrl && <img src={imgUrl} alt="" className="w-9 h-9 rounded-md object-cover shrink-0" />}
        <p className="text-[16px] text-primary-700">{chatProductTitle || 'Product Image Selected'}</p>
        <span className="text-[10px] text-primary-500 bg-primary-100 px-1.5 py-0.5 rounded-full shrink-0">AI Pick</span>
      </UserBubble>
    );
  };

  // ── Step 3 user bubble ─────────────────────────────────
  const renderStep3Bubble = () => {
    const selectedList = [...chatSelectedTemplates];
    const firstTemplate = selectedList.length > 0
      ? CHAT_TEMPLATES.find((_, i) => `${CHAT_TEMPLATES[i]?.style}-${i}-${CHAT_TEMPLATES[i]?.url}` === selectedList[0])
      : null;

    return (
      <UserBubble onUndo={() => onChangeStep(3)}>
        {selectedList.length > 0 ? (
          <>
            {firstTemplate && (
              <img src={firstTemplate.url} alt="" className="w-9 h-9 rounded-md object-cover shrink-0" />
            )}
            <p className="text-[16px] text-primary-700">
              {selectedList.length === 1 ? `${firstTemplate?.style ?? 'Template'} Style` : `${selectedList.length} Templates`}
            </p>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <p className="text-[16px] text-primary-700">AI Auto-Generate</p>
          </>
        )}
      </UserBubble>
    );
  };

  return (
    <main className="flex-1 min-h-0 bg-white rounded-[20px] border border-[#F0F0F0] card-shadow overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F5] bg-gray-50/50 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">
            <AiAvatar uid="hdr" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-gray-900">AdsGo Creative Expert</h3>
            <div className="flex items-center gap-1.5 text-[14px] text-gray-400 font-normal mt-0.5">
              <span>New AI Creative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 custom-scrollbar">

        {/* ══ STEP 1 ══ */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5"><AiAvatar uid="s1" /></div>
          <div className="flex-1 pt-0.5">
            <p className="text-[16px] text-[#141414] mt-2 mb-3">
              Which product would you like to create ad creatives for?
            </p>
            {chatStep === 1 && (
              <StepSourceSelect
                chatPhase={chatPhase}
                chatSource={chatSource}
                chatThirdPartyPlatform={chatThirdPartyPlatform}
                chatProductIdx={chatProductIdx}
                chatProductCategoryFilter={chatProductCategoryFilter}
                chatSearchQuery={chatSearchQuery}
                chatUrlValue={chatUrlValue}
                chatUrlError={chatUrlError}
                chatIsSyncing={chatIsSyncing}
                onSetPhase={onSetPhase}
                onSetSource={onSetSource}
                onSetThirdPartyPlatform={onSetThirdPartyPlatform}
                onSetProductIdx={onSetProductIdx}
                onSetProductCategoryFilter={onSetProductCategoryFilter}
                onSetSearchQuery={onSetSearchQuery}
                onSetUrlValue={onSetUrlValue}
                onSetUrlError={onSetUrlError}
                onConfirmStep={onConfirmStep}
                onOpenConnectModal={onOpenConnectModal}
              />
            )}
          </div>
        </div>

        {/* ══ STEP 1 → 2 ══ */}
        {chatStep > 1 && (
          <>
            <div className="pb-4">{renderStep1Bubble()}</div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><AiAvatar uid="s2" /></div>
              <div className="flex-1 pt-0.5">
                <p className="text-[16px] text-[#141414] mt-2 mb-3">
                  Great! Let me confirm the product details and pick the best image.
                </p>
                {chatStep === 2 && (
                  <StepConfirmImage
                    chatImportPhase={chatImportPhase}
                    chatProductIdx={chatProductIdx}
                    chatSelectedImages={chatSelectedImages}
                    chatProductTitle={chatProductTitle}
                    chatTargetAudience={chatTargetAudience}
                    chatSellingPoints={chatSellingPoints}
                    chatOriginalPrice={chatOriginalPrice}
                    chatPromoPrice={chatPromoPrice}
                    chatPromoText={chatPromoText}
                    chatBrandColors={chatBrandColors}
                    chatHasLogo={chatHasLogo}
                    chatEditingColorIdx={chatEditingColorIdx}
                    onToggleImage={onToggleImage}
                    onSetProductTitle={onSetProductTitle}
                    onSetTargetAudience={onSetTargetAudience}
                    onSetSellingPoint={onSetSellingPoint}
                    onSetOriginalPrice={onSetOriginalPrice}
                    onSetPromoPrice={onSetPromoPrice}
                    onSetPromoText={onSetPromoText}
                    onSetBrandColor={onSetBrandColor}
                    onSetHasLogo={onSetHasLogo}
                    onSetEditingColorIdx={onSetEditingColorIdx}
                    onConfirmStep={onConfirmStep}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ STEP 2 → 3 ══ */}
        {chatStep > 2 && (
          <>
            <div className="pb-4">{renderStep2Bubble()}</div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><AiAvatar uid="s3" /></div>
              <div className="flex-1 pt-0.5">
                <p className="text-[16px] text-[#141414] mt-2 mb-3">
                  Now select a creative template style, or let AI choose automatically.
                </p>
                {chatStep === 3 && (
                  <StepConfirmTemplate
                    chatTemplateCategory={chatTemplateCategory}
                    chatSelectedTemplates={chatSelectedTemplates}
                    onSetTemplateCategory={onSetTemplateCategory}
                    onToggleTemplate={onToggleTemplate}
                    onConfirmStep={onConfirmStep}
                    onChangeStep={onChangeStep}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ STEP 3 → 4 ══ */}
        {chatStep > 3 && (
          <>
            <div className="pb-4">{renderStep3Bubble()}</div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><AiAvatar uid="s4" /></div>
              <div className="flex-1 pt-0.5">
                <p className="text-[16px] text-[#141414] mt-2 mb-3">
                  Almost there! Customize your generation settings.
                </p>
                <StepGenerationSettings
                  chatQuantity={chatQuantity}
                  chatRatios={chatRatios}
                  chatRequirements={chatRequirements}
                  chatSuggestionPage={chatSuggestionPage}
                  chatSelectedTemplates={chatSelectedTemplates}
                  onSetQuantity={onSetQuantity}
                  onSetRatios={onSetRatios}
                  onSetRequirements={onSetRequirements}
                  onSetSuggestionPage={onSetSuggestionPage}
                  onGenerate={onGenerate}
                />
              </div>
            </div>
          </>
        )}

        <div ref={chatEndRef} />
      </div>
    </main>
  );
}
