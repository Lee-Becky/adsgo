import { useState, useMemo, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useOnboardingTour } from '../../onboarding/useOnboardingTour';
import OnboardingSpotlight from '../../onboarding/OnboardingSpotlight';
import HistoryPanel from './HistoryPanel';
import ChatPanel from './ChatPanel';
import HistoryDetailPanel from './HistoryDetailPanel';
import RegeneratePanel from './RegeneratePanel';
import DiscardModal from './modals/DiscardModal';
import {
  CHAT_PRODUCTS,
  CHAT_PRODUCT_INFO,
  HISTORY_SEED,
  EXAMPLE_CASES,
} from './constants';

function formatTimeLabel() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  const min = m.toString().padStart(2, '0');
  return `${hour}:${min} ${ampm}`;
}

export default function AIGenerate() {
  const { isActive, tourSubStep, endTour } = useOnboardingTour(4);
  const aiGenerateMainRef = useRef(null);

  // ─── View & History ──────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState('new'); // 'new' | 'history'
  const [items, setItems] = useState(HISTORY_SEED);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [selectedHistoryVariationIndex, setSelectedHistoryVariationIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState(new Set());
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

  // ─── Regeneration ─────────────────────────────────────────────────────────
  const [showRegenerateChat, setShowRegenerateChat] = useState(false);
  const [regenChatInput, setRegenChatInput] = useState('');
  const [regenInitialImages, setRegenInitialImages] = useState([]);
  const [regenIsMultiple, setRegenIsMultiple] = useState(false);

  // ─── Generation state ─────────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditGenerating, setIsEditGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ─── Edit modal ───────────────────────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  // ─── Toast & Modals ───────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [chatConnectModal, setChatConnectModal] = useState(null);

  // ─── Chat Flow ────────────────────────────────────────────────────────────
  const [chatStep, setChatStep] = useState(1);
  const [chatPhase, setChatPhase] = useState('source-select');
  const [chatSource, setChatSource] = useState(null);
  const [chatThirdPartyPlatform, setChatThirdPartyPlatform] = useState(null);
  const [chatProductIdx, setChatProductIdx] = useState(null);
  const [chatSelectedImages, setChatSelectedImages] = useState(new Set());
  const [chatSelectedTemplates, setChatSelectedTemplates] = useState(new Set());
  const [chatRatios, setChatRatios] = useState(new Set(['1:1']));
  const [chatQuantity, setChatQuantity] = useState(3);
  const [chatRequirements, setChatRequirements] = useState('');
  const [chatIsFetching, setChatIsFetching] = useState(false);
  const [chatUrlValue, setChatUrlValue] = useState('');
  const [chatUrlError, setChatUrlError] = useState(null);
  const [chatImportPhase, setChatImportPhase] = useState(null);
  const [chatIsSyncing, setChatIsSyncing] = useState(false);
  const [chatTemplateCategory, setChatTemplateCategory] = useState('Recommended');
  const [chatProductCategoryFilter, setChatProductCategoryFilter] = useState('All');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatSuggestionPage, setChatSuggestionPage] = useState(0);
  // Product info (Step 2)
  const [chatProductTitle, setChatProductTitle] = useState('');
  const [chatTargetAudience, setChatTargetAudience] = useState('');
  const [chatSellingPoints, setChatSellingPoints] = useState(['', '', '']);
  const [chatOriginalPrice, setChatOriginalPrice] = useState('');
  const [chatPromoPrice, setChatPromoPrice] = useState('');
  const [chatPromoText, setChatPromoText] = useState('');
  const [chatBrandColors, setChatBrandColors] = useState(['#7033F5', '#F5F1FF', '#FFFFFF']);
  const [chatEditingColorIdx, setChatEditingColorIdx] = useState(null);
  const [chatHasLogo, setChatHasLogo] = useState(false);

  const selectedHistoryIdRef = useRef(null);

  // ─── Sync selected history id ref ─────────────────────────────────────────
  useEffect(() => {
    selectedHistoryIdRef.current = selectedHistory?.id ?? null;
  }, [selectedHistory?.id]);

  // ─── Reset variation state when selected history changes ──────────────────
  useEffect(() => {
    setSelectedHistoryVariationIndex(0);
    setSelectedVariations(
      selectedHistory?.imageCount && selectedHistory.imageCount > 1 ? new Set([0]) : new Set()
    );
  }, [selectedHistory?.id]);

  // ─── Close regen chat when switching history items ─────────────────────────
  useEffect(() => {
    setShowRegenerateChat(false);
    setRegenChatInput('');
  }, [selectedHistory?.id]);

  // ─── Populate product info when step 2 is entered ─────────────────────────
  useEffect(() => {
    if (chatStep !== 2) return;
    const info = chatProductIdx !== null ? CHAT_PRODUCT_INFO[chatProductIdx] : null;
    if (info) {
      setChatProductTitle(info.title);
      setChatTargetAudience(info.audience);
      setChatSellingPoints([...info.sellingPoints]);
      setChatOriginalPrice(info.originalPrice);
      setChatPromoPrice(info.promoPrice);
      setChatPromoText(info.promoText);
      setChatBrandColors([...info.brandColors]);
    } else {
      setChatProductTitle('Imported Product');
      setChatTargetAudience('General audience');
      setChatSellingPoints(['High quality materials', 'Fast shipping', 'Money-back guarantee']);
      setChatOriginalPrice('$99.00');
      setChatPromoPrice('$69.00');
      setChatPromoText('Special offer — limited time only!');
      setChatBrandColors(['#7033F5', '#F5F1FF', '#FFFFFF']);
    }
    setChatHasLogo(false);
    setChatSelectedImages(prev => (prev.size === 0 ? new Set([0]) : prev));
  }, [chatStep]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Sorted & grouped history ──────────────────────────────────────────────
  const sortedAndGroupedHistory = useMemo(() => {
    const allItems = [...items].sort((a, b) => b.timestamp - a.timestamp);

    const groups = { 'Today': [], 'Yesterday': [], 'Past 7 Days': [], 'Past 30 Days': [] };
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 1000 * 60 * 60 * 24;

    allItems.forEach(item => {
      const itemDate = new Date(item.timestamp);
      const startOfItemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const dayDiff = Math.floor((startOfToday.getTime() - startOfItemDay.getTime()) / msPerDay);

      let key;
      if (dayDiff <= 0) key = 'Today';
      else if (dayDiff === 1) key = 'Yesterday';
      else if (dayDiff <= 7) key = 'Past 7 Days';
      else if (dayDiff <= 30) key = 'Past 30 Days';
      else key = item.date || itemDate.toLocaleDateString('en-US');

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    const orderedKeys = ['Today', 'Yesterday', 'Past 7 Days', 'Past 30 Days'];
    const orderedGroups = {};
    orderedKeys.forEach(k => { if (groups[k]?.length) orderedGroups[k] = groups[k]; });
    Object.entries(groups).forEach(([k, v]) => {
      if (!orderedKeys.includes(k) && v.length) orderedGroups[k] = v;
    });
    return orderedGroups;
  }, [items]);

  // ─── Chat handlers ────────────────────────────────────────────────────────
  const resetChat = () => {
    setChatStep(1);
    setChatSource(null);
    setChatPhase('source-select');
    setChatProductIdx(null);
    setChatSelectedImages(new Set());
    setChatSelectedTemplates(new Set());
    setChatRatios(new Set(['1:1']));
    setChatQuantity(3);
    setChatRequirements('');
    setChatIsFetching(false);
    setChatUrlValue('');
    setChatUrlError(null);
    setChatImportPhase(null);
    setChatIsSyncing(false);
    setChatTemplateCategory('Recommended');
    setChatProductCategoryFilter('All');
    setChatThirdPartyPlatform(null);
    setChatSearchQuery('');
    setChatSuggestionPage(0);
    setChatProductTitle('');
    setChatTargetAudience('');
    setChatSellingPoints(['', '', '']);
    setChatOriginalPrice('');
    setChatPromoPrice('');
    setChatPromoText('');
    setChatBrandColors(['#7033F5', '#F5F1FF', '#FFFFFF']);
    setChatHasLogo(false);
    setChatEditingColorIdx(null);
  };

  const startNew = () => {
    setSelectedHistory(null);
    setViewMode('new');
    resetChat();
  };

  const handleNewCreativeClick = () => {
    const isOnStep1 = viewMode === 'new' && !selectedHistory && chatStep === 1;
    const hasProgress = viewMode === 'new' && !selectedHistory && chatStep > 1;
    if (isOnStep1) {
      showToast("You're already creating a new creative!");
    } else if (hasProgress) {
      setShowDiscardModal(true);
    } else {
      startNew();
    }
  };

  const chatConfirmStep = (step) => {
    if (step === 1) {
      setChatStep(2);
      setChatImportPhase('importing');
      setTimeout(() => setChatImportPhase('picking'), 1400);
      setTimeout(() => setChatImportPhase('done'), 2600);
    } else {
      setChatStep(step + 1);
    }
  };

  const chatChangeStep = (step) => {
    setChatStep(step);
    if (step <= 1) {
      setChatPhase('source-select');
      setChatProductIdx(null);
      setChatSource(null);
      setChatImportPhase(null);
      setChatSearchQuery('');
      setChatProductCategoryFilter('All');
      setChatThirdPartyPlatform(null);
    }
    if (step <= 2) {
      setChatSelectedImages(new Set());
    }
    if (step <= 3) {
      setChatSelectedTemplates(new Set());
      setChatTemplateCategory('Recommended');
    }
  };

  // ─── Generate from chat ───────────────────────────────────────────────────
  const handleChatGenerate = () => {
    const product = chatProductIdx !== null ? CHAT_PRODUCTS[chatProductIdx] : CHAT_PRODUCTS[0];
    const ratiosArr = [...chatRatios];
    const newItem = {
      id: Date.now(),
      type: 'image',
      status: 'processing',
      prompt: chatRequirements || `${product?.name ?? 'Product'} — AI Generated`,
      productTitle: chatProductTitle || product?.name || 'Product',
      productUrl: product?.url || 'https://producturl',
      date: 'Today',
      timestamp: Date.now(),
      preview: null,
      ratio: ratiosArr[0] || '1:1',
      imageCount: chatQuantity,
      isNew: false,
    };
    const newItemId = newItem.id;
    setItems(prev => [newItem, ...prev]);
    setSelectedHistory(newItem);
    setViewMode('history');
    resetChat();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setShowSuccess(true);
      const previewPool = [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      ];
      const picked = previewPool[Math.floor(Math.random() * previewPool.length)];
      const tl = formatTimeLabel();
      setItems(prev => prev.map(item =>
        item.id === newItemId ? { ...item, status: 'completed', preview: picked, timeLabel: tl } : item
      ));
      setSelectedHistory(prev =>
        prev && prev.id === newItemId ? { ...prev, status: 'completed', preview: picked, timeLabel: tl } : prev
      );
      setTimeout(() => setShowSuccess(false), 5000);
    }, 4000);
  };

  // ─── Regenerate / Edit ────────────────────────────────────────────────────
  const handleEditSubmit = (promptOverride) => {
    const prompt = promptOverride ?? editPrompt;
    if (!selectedHistory || !prompt.trim()) return;
    const base = items.find(i => i.id === selectedHistory.id) ?? selectedHistory;

    const existingVersions = base.versions ?? [{
      label: 'Version 1',
      prompt: base.prompt,
      preview: base.preview,
      previews: base.previews,
      status: 'completed',
      timestamp: base.timestamp,
      timeLabel: base.timeLabel,
    }];

    const regenTimestamp = Date.now();
    const regenTimeLabel = formatTimeLabel();
    const newVersion = {
      label: `Version ${existingVersions.length + 1}`,
      prompt: prompt.trim(),
      preview: null,
      status: 'processing',
      timestamp: regenTimestamp,
      timeLabel: regenTimeLabel,
    };

    const withProcessing = {
      ...base,
      versions: [...existingVersions, newVersion],
      activeVersionIdx: existingVersions.length,
      timestamp: regenTimestamp,
      date: 'Today',
    };

    setItems(prev => prev.map(i => i.id === base.id ? withProcessing : i));
    setSelectedHistory(withProcessing);
    setShowEditModal(false);
    setEditPrompt('');
    setIsEditGenerating(true);

    setTimeout(() => {
      setIsEditGenerating(false);
      const doneVersion = {
        ...newVersion,
        preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        status: 'completed',
      };
      const isStillViewing = selectedHistoryIdRef.current === base.id;
      const completed = {
        ...base,
        versions: [...existingVersions, doneVersion],
        activeVersionIdx: existingVersions.length,
        isNew: !isStillViewing,
        timestamp: regenTimestamp,
        date: 'Today',
        timeLabel: regenTimeLabel,
      };
      setItems(prev => prev.map(i => i.id === base.id ? completed : i));
      if (isStillViewing) {
        setSelectedHistory(completed);
        setSelectedHistoryVariationIndex(0);
        setSelectedVariations((completed.imageCount ?? 1) > 1 ? new Set([0]) : new Set());
      }
    }, 4000);
  };

  const submitRegenerateChat = () => {
    if (!regenChatInput.trim()) return;
    handleEditSubmit(regenChatInput);
    setSelectedVariations(new Set());
    setShowRegenerateChat(false);
    setRegenChatInput('');
  };

  // ─── History selection ────────────────────────────────────────────────────
  const handleSelectHistory = (item) => {
    setSelectedHistory(item);
    setViewMode('history');
    if (item.isNew) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isNew: false } : i));
    }
  };

  const handleSelectExample = (ex) => {
    setSelectedHistory({
      id: Number('9000' + ex.id.replace('ex', '')),
      type: 'image',
      status: 'completed',
      prompt: ex.prompt,
      productTitle: ex.prompt,
      productUrl: ex.productUrl,
      date: 'Examples',
      timestamp: 0,
      preview: ex.preview,
      ratio: ex.ratio,
      imageCount: ex.imageCount,
    });
    setViewMode('history');
  };

  // ─── Retry failed item ────────────────────────────────────────────────────
  const handleRetry = (item) => {
    const retryTimestamp = Date.now();
    const updated = { ...item, status: 'processing', preview: null, timestamp: retryTimestamp, date: 'Today' };
    setSelectedHistory(updated);
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const completed = {
        ...updated,
        status: 'completed',
        preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=675&fit=crop',
        timestamp: retryTimestamp,
      };
      setSelectedHistory(completed);
      setItems(prev => prev.map(i => i.id === item.id ? completed : i));
    }, 4000);
  };

  // ─── Connect modal confirm ────────────────────────────────────────────────
  const handleConnectConfirm = () => {
    setChatConnectModal(null);
    setChatPhase('product-list');
    setChatIsSyncing(true);
    setTimeout(() => setChatIsSyncing(false), 2200);
  };

  const isCenterInRow = showRegenerateChat && selectedHistory;

  return (
    <>
    <div ref={aiGenerateMainRef} className="h-[calc(100vh-130px)] flex gap-6 overflow-hidden">
      {/* Left: History sidebar */}
      <HistoryPanel
        sortedAndGroupedHistory={sortedAndGroupedHistory}
        selectedHistory={selectedHistory}
        onSelectHistory={handleSelectHistory}
        onNewCreativeClick={handleNewCreativeClick}
        onSelectExample={handleSelectExample}
      />

      {/* Center + Right */}
      <div className={`flex-1 min-w-0 min-h-0 flex gap-6 ${isCenterInRow ? 'flex-row' : 'flex-col'}`}>
        {/* New Creative chat (shown when viewMode=new) */}
        {viewMode === 'new' && !selectedHistory && (
          <ChatPanel
            chatStep={chatStep}
            chatPhase={chatPhase}
            chatSource={chatSource}
            chatThirdPartyPlatform={chatThirdPartyPlatform}
            chatProductIdx={chatProductIdx}
            chatProductCategoryFilter={chatProductCategoryFilter}
            chatSearchQuery={chatSearchQuery}
            chatUrlValue={chatUrlValue}
            chatUrlError={chatUrlError}
            chatIsSyncing={chatIsSyncing}
            chatImportPhase={chatImportPhase}
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
            chatTemplateCategory={chatTemplateCategory}
            chatSelectedTemplates={chatSelectedTemplates}
            chatQuantity={chatQuantity}
            chatRatios={chatRatios}
            chatRequirements={chatRequirements}
            chatSuggestionPage={chatSuggestionPage}
            onSetPhase={setChatPhase}
            onSetSource={setChatSource}
            onSetThirdPartyPlatform={setChatThirdPartyPlatform}
            onSetProductIdx={setChatProductIdx}
            onSetProductCategoryFilter={setChatProductCategoryFilter}
            onSetSearchQuery={setChatSearchQuery}
            onSetUrlValue={setChatUrlValue}
            onSetUrlError={setChatUrlError}
            onToggleImage={(i) => setChatSelectedImages(prev => {
              const next = new Set(prev);
              next.has(i) ? next.delete(i) : next.add(i);
              return next;
            })}
            onSetProductTitle={setChatProductTitle}
            onSetTargetAudience={setChatTargetAudience}
            onSetSellingPoint={(i, v) => setChatSellingPoints(prev => prev.map((sp, idx) => idx === i ? v : sp))}
            onSetOriginalPrice={setChatOriginalPrice}
            onSetPromoPrice={setChatPromoPrice}
            onSetPromoText={setChatPromoText}
            onSetBrandColor={(i, v) => setChatBrandColors(prev => prev.map((c, idx) => idx === i ? v : c))}
            onSetHasLogo={setChatHasLogo}
            onSetEditingColorIdx={setChatEditingColorIdx}
            onSetTemplateCategory={setChatTemplateCategory}
            onToggleTemplate={(key) => setChatSelectedTemplates(prev => {
              const next = new Set(prev);
              next.has(key) ? next.delete(key) : next.add(key);
              return next;
            })}
            onSetQuantity={setChatQuantity}
            onSetRatios={setChatRatios}
            onSetRequirements={setChatRequirements}
            onSetSuggestionPage={setChatSuggestionPage}
            onConfirmStep={chatConfirmStep}
            onChangeStep={chatChangeStep}
            onOpenConnectModal={(platformName) => setChatConnectModal(platformName)}
            onGenerate={handleChatGenerate}
          />
        )}

        {/* History detail (shown when selectedHistory is set) */}
        {selectedHistory && (
          <HistoryDetailPanel
            selectedHistory={selectedHistory}
            isGenerating={isGenerating}
            isEditGenerating={isEditGenerating}
            showVersionDropdown={showVersionDropdown}
            showSaveDropdown={showSaveDropdown}
            showDownloadDropdown={showDownloadDropdown}
            selectedHistoryVariationIndex={selectedHistoryVariationIndex}
            selectedVariations={selectedVariations}
            showRegenerateChat={showRegenerateChat}
            onSetShowVersionDropdown={setShowVersionDropdown}
            onSetShowSaveDropdown={setShowSaveDropdown}
            onSetShowDownloadDropdown={setShowDownloadDropdown}
            onSetSelectedHistory={setSelectedHistory}
            onSetItems={setItems}
            onSetSelectedHistoryVariationIndex={setSelectedHistoryVariationIndex}
            onSetSelectedVariations={setSelectedVariations}
            onSetShowRegenerateChat={setShowRegenerateChat}
            onSetRegenInitialImages={setRegenInitialImages}
            onSetRegenIsMultiple={setRegenIsMultiple}
            onSetRegenChatInput={setRegenChatInput}
            onRetry={handleRetry}
          />
        )}

        {/* Regenerate panel (right side when active) */}
        {showRegenerateChat && selectedHistory && (
          <RegeneratePanel
            regenInitialImages={regenInitialImages}
            regenIsMultiple={regenIsMultiple}
            regenChatInput={regenChatInput}
            onSetRegenChatInput={setRegenChatInput}
            onSetShowRegenerateChat={setShowRegenerateChat}
            onSubmit={submitRegenerateChat}
          />
        )}
      </div>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}

      {/* Discard modal */}
      <DiscardModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={startNew}
      />

      {/* Connect platform modal */}
      {chatConnectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm"
          onClick={() => setChatConnectModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900">Connect {chatConnectModal}</h3>
              <button
                onClick={() => setChatConnectModal(null)}
                className="p-2 hover:bg-neutral-100 text-neutral-400 rounded-full transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto">
                <Sparkles size={28} className="text-primary-500" />
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-900">Connect {chatConnectModal} Account</p>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                  Sync your product catalog to select products directly from your store.
                </p>
              </div>
              <button
                onClick={handleConnectConfirm}
                className="w-full px-4 h-10 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 whitespace-nowrap transition-all shadow-sm shadow-primary-500/20"
              >
                Connect {chatConnectModal}
              </button>
              <button
                onClick={() => setChatConnectModal(null)}
                className="w-full px-4 py-2 text-neutral-500 text-sm font-medium rounded-full hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
          <div className="bg-white border border-primary-100 shadow-lg rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2.5">
            <Sparkles size={15} className="text-primary-500 shrink-0" />
            <span className="text-primary-800">{toast}</span>
          </div>
        </div>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div className="fixed top-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
          <div className="bg-white border shadow-lg rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2.5" style={{ borderColor: '#10B981' }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#10B981' }}>
              <span className="text-white text-[10px] font-bold">✓</span>
            </div>
            <span className="text-neutral-700">Creative generated successfully!</span>
          </div>
        </div>
      )}
    </div>

    {isActive && tourSubStep === 3 && (
      <OnboardingSpotlight
        targetRef={aiGenerateMainRef}
        stepLabel="4/4"
        title="AI 生成创意"
        body="不想手动上传？在这里通过 AI 对话式流程，基于产品信息自动生成广告素材，生成结果可直接保存回创意库"
        onSkip={endTour}
        onNext={endTour}
        nextText="我了解了"
      />
    )}
    </>
  );
}
