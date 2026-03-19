import { useState, useEffect, useCallback, useRef } from 'react';
import ChatPanel from './ChatPanel';
import GalleryPanel from './GalleryPanel';
import ConnectPlatformModal from './modals/ConnectPlatformModal';
import ImagePreviewModal from './modals/ImagePreviewModal';
import {
  SOURCES, PRODUCTS, STYLES,
  buildResultUrls,
  INITIAL_GALLERY, INITIAL_CARD1, INITIAL_CARD2, INITIAL_CARD3, INITIAL_CARD4,
} from './constants';

export default function AIGenerate() {
  const [activeStep, setActiveStep] = useState(1);
  const [card1, setCard1] = useState({ ...INITIAL_CARD1 });
  const [card2, setCard2] = useState({ ...INITIAL_CARD2 });
  const [card3, setCard3] = useState({ ...INITIAL_CARD3 });
  const [card4, setCard4] = useState({ ...INITIAL_CARD4, ratios: new Set(INITIAL_CARD4.ratios) });
  const [gallery, setGallery] = useState([...INITIAL_GALLERY]);
  const [generating, setGenerating] = useState(false);
  const [sources, setSources] = useState(SOURCES.map(s => ({ ...s })));
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const generatingRef = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (openDropdown && !e.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openDropdown]);

  // Escape key closes preview
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && previewImage) setPreviewImage(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [previewImage]);

  // ─── Step Actions ───────────────────────────────
  const confirmStep = useCallback((n) => setActiveStep(n + 1), []);
  const changeStep = useCallback((n) => setActiveStep(n), []);

  const selectSource = useCallback((id) => {
    const src = sources.find(s => s.id === id);
    if (id === 'url') {
      setCard1(prev => ({ ...prev, source: id, phase: 'url-input' }));
    } else if (src?.status === 'connected') {
      setCard1(prev => ({ ...prev, source: id, phase: 'product-list' }));
    } else {
      setConnectingPlatform(id);
    }
  }, [sources]);

  const selectProduct = useCallback((i, url) => {
    setCard1(prev => ({ ...prev, product: i, url: url || prev.url }));
  }, []);

  const changePhase = useCallback((phase) => {
    setCard1(prev => ({ ...prev, phase }));
  }, []);

  const selectImage = useCallback((i) => {
    setCard2({ selectedIdx: i });
  }, []);

  const setBrowsing = useCallback((val) => {
    setCard3(prev => ({ ...prev, browsing: val }));
  }, []);

  const selectTemplate = useCallback((styleId) => {
    setCard3(prev => ({ ...prev, selectedStyle: styleId, browsing: false }));
    setActiveStep(4);
  }, []);

  const setRequirements = useCallback((val) => {
    setCard4(prev => ({ ...prev, requirements: val }));
  }, []);

  const setQuantity = useCallback((q) => {
    setCard4(prev => ({ ...prev, quantity: q }));
    setOpenDropdown(null);
  }, []);

  const toggleRatio = useCallback((r) => {
    setCard4(prev => {
      const newRatios = new Set(prev.ratios);
      if (newRatios.has(r)) {
        newRatios.delete(r);
        if (newRatios.size === 0) newRatios.add(r);
      } else {
        newRatios.add(r);
      }
      return { ...prev, ratios: newRatios };
    });
  }, []);

  const toggleDropdown = useCallback((name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  // ─── Connect Platform ──────────────────────────
  const handleConnect = useCallback(() => {
    setSources(prev => prev.map(s =>
      s.id === connectingPlatform ? { ...s, status: 'connected', desc: 'demo-account' } : s
    ));
    setConnectingPlatform(null);
    setCard1(prev => ({ ...prev, source: connectingPlatform, phase: 'product-list' }));
  }, [connectingPlatform]);

  // ─── New Task ──────────────────────────────────
  const newTask = useCallback(() => {
    setActiveStep(1);
    setCard1({ ...INITIAL_CARD1 });
    setCard2({ ...INITIAL_CARD2 });
    setCard3({ ...INITIAL_CARD3 });
    setCard4({ ...INITIAL_CARD4, ratios: new Set(INITIAL_CARD4.ratios) });
    setOpenDropdown(null);
  }, []);

  // ─── Generate ──────────────────────────────────
  const handleGenerate = useCallback(() => {
    if (activeStep < 4 || generatingRef.current) return;
    generatingRef.current = true;
    setGenerating(true);

    const pIdx = card1.product || 0;
    const p = PRODUCTS[pIdx];
    const style = STYLES.find(s => s.id === card3.selectedStyle) || STYLES[0];
    const ratios = [...card4.ratios];
    const qty = card4.quantity;
    const batchId = Date.now();

    const genEntry = {
      id: batchId,
      status: 'generating',
      product: { name: p.name, productIdx: pIdx, source: card1.source || 'shopify' },
      image: { selectedIdx: card2.selectedIdx },
      template: { selectedStyle: card3.selectedStyle, styleName: style.name },
      settings: { quantity: qty, ratios },
      createdAt: 'Just now',
      results: [],
    };

    setGallery(prev => [genEntry, ...prev]);

    setTimeout(() => {
      setGallery(prev => prev.map(b =>
        b.id === batchId
          ? { ...b, status: 'done', results: buildResultUrls(qty, ratios, batchId % 1000) }
          : b
      ));
      generatingRef.current = false;
      setGenerating(false);
    }, 3000);
  }, [activeStep, card1, card2, card3, card4]);

  // ─── Regenerate ────────────────────────────────
  const regenerateBatch = useCallback((batchId) => {
    const batch = gallery.find(b => b.id === batchId);
    if (!batch || generatingRef.current) return;

    setCard1({ phase: 'product-list', source: batch.product.source, product: batch.product.productIdx, url: '' });
    setCard2({ selectedIdx: batch.image.selectedIdx });
    setCard3({ mode: 'ai', selectedStyle: batch.template.selectedStyle, browsing: false });
    setCard4({ requirements: '', quantity: batch.settings.quantity, ratios: new Set(batch.settings.ratios) });
    setActiveStep(4);

    // Trigger generate on next tick after state updates
    setTimeout(() => {
      generatingRef.current = false;
      // We need to manually trigger since state may not have updated yet for the callback
      const p = PRODUCTS[batch.product.productIdx];
      const style = STYLES.find(s => s.id === batch.template.selectedStyle) || STYLES[0];
      const ratios = [...batch.settings.ratios];
      const qty = batch.settings.quantity;
      const newBatchId = Date.now();

      generatingRef.current = true;
      setGenerating(true);

      const genEntry = {
        id: newBatchId,
        status: 'generating',
        product: { name: p.name, productIdx: batch.product.productIdx, source: batch.product.source },
        image: { selectedIdx: batch.image.selectedIdx },
        template: { selectedStyle: batch.template.selectedStyle, styleName: style.name },
        settings: { quantity: qty, ratios },
        createdAt: 'Just now',
        results: [],
      };

      setGallery(prev => [genEntry, ...prev]);

      setTimeout(() => {
        setGallery(prev => prev.map(b =>
          b.id === newBatchId
            ? { ...b, status: 'done', results: buildResultUrls(qty, ratios, newBatchId % 1000) }
            : b
        ));
        generatingRef.current = false;
        setGenerating(false);
      }, 3000);
    }, 50);
  }, [gallery]);

  // ─── Preview ───────────────────────────────────
  const openPreview = useCallback((src, ratio) => {
    setPreviewImage({ src, ratio });
  }, []);

  const connectPlatformName = connectingPlatform
    ? sources.find(s => s.id === connectingPlatform)?.name || ''
    : '';

  return (
    <div className="h-[calc(100vh-130px)] flex gap-6">
      <ChatPanel
        activeStep={activeStep}
        card1={card1}
        card2={card2}
        card3={card3}
        card4={card4}
        sources={sources}
        openDropdown={openDropdown}
        generating={generating}
        onSelectSource={selectSource}
        onSelectProduct={selectProduct}
        onConfirmStep={confirmStep}
        onChangeStep={changeStep}
        onChangePhase={changePhase}
        onSelectImage={selectImage}
        onSetBrowsing={setBrowsing}
        onSelectTemplate={selectTemplate}
        onSetRequirements={setRequirements}
        onSetQuantity={setQuantity}
        onToggleRatio={toggleRatio}
        onToggleDropdown={toggleDropdown}
        onNewTask={newTask}
        onGenerate={handleGenerate}
      />
      <GalleryPanel
        gallery={gallery}
        onRegenerate={regenerateBatch}
        onPreview={openPreview}
      />
      <ConnectPlatformModal
        isOpen={!!connectingPlatform}
        platformName={connectPlatformName}
        onClose={() => setConnectingPlatform(null)}
        onConnect={handleConnect}
      />
      <ImagePreviewModal
        isOpen={!!previewImage}
        src={previewImage?.src || ''}
        ratio={previewImage?.ratio || ''}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
