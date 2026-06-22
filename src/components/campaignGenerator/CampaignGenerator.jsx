import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Loader2, Command, Zap } from 'lucide-react';
import { UrlInputStep } from './UrlInputStep';
import { AnalysisResultsStep } from './AnalysisResultsStep';
import { CampaignEditorStep } from './CampaignEditorStep';
import { ConfigurePublishStep } from './ConfigurePublishStep';
import { PublishReviewStep } from './PublishReviewStep';
import PublishCampaignModal from './PublishCampaignModal';

const LOGO_LINKS = {
  meta: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256',
  google: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256',
  tiktok: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=256',
  bing: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bing.com&size=256'
};

const ANALYSIS_SEQUENCE = [
  { 
    id: 'screenshot', 
    title: 'Website architecture scan', 
    tools: ['Chromium headless', 'DOM parser', 'Asset auditor'],
    logs: [
      'Establishing secure connection to {url}...',
      'Capturing responsive viewport at 1920x1080...',
      'Analyzing layout hierarchy and navigation tree...',
      'Deep link crawling initiated (32 internal pages found).'
    ],
    visual: 'screenshot',
    insight: 'Clean, modern UI detected with high focus on product benefits. User path leads clearly to "Get started".'
  },
  { 
    id: 'brand', 
    title: 'Brand identity deep-dive', 
    tools: ['Color extractor', 'Sentiment AI', 'Font matcher'],
    logs: [
      'Extracting hex codes from CSS root...',
      'Scanning brand copy for linguistic patterns...',
      'Analyzing logo geometric balance...',
      'Matched 14 key brand attributes.'
    ],
    insight: 'Persona: Innovative leader. Color harmony: Indigo/Lavender. Brand tone: Authoritative yet accessible.'
  },
  { 
    id: 'product', 
    title: 'Product positioning', 
    tools: ['Market classifier', 'Value prop engine'],
    logs: [
      'Benchmarking against 1,200+ industry peers...',
      'Categorizing product vertical: Enterprise SaaS...',
      'Analyzing feature-to-benefit mapping...',
      'Defining core value propositions...'
    ],
    insight: 'Positioned as an "Efficiency multiplier". High disruption potential in the productivity vertical.'
  },
  { 
    id: 'usp', 
    title: 'Extracting core selling points', 
    tools: ['Benefit miner', 'Feature scraper'],
    logs: [
      'Deconstructing header H1 and H2 tags...',
      'Correlating client testimonials with features...',
      'Filtering for 3 major USPs...',
      'Scanning for compliance and trust badges...'
    ],
    insight: 'Top USPs: 1. Neural processing speed, 2. Global distribution network, 3. One-click integration.'
  },
  { 
    id: 'audience', 
    title: 'Audience persona generation', 
    tools: ['Demographic AI', 'Interest mapper'],
    logs: [
      'Cross-referencing historical conversion data...',
      'Clustering behavioral patterns into segments...',
      'Mapping high-intent interest keywords...',
      'Persona modeling complete (5 segments).'
    ],
    insight: 'Primary target: Mid-level PMs at Tech startups (24-38). Interest spikes in "Agile" and "Workflow automation".'
  },
  { 
    id: 'competitors', 
    title: 'Competitive intelligence', 
    tools: ['Market tracker', 'Pricing scout'],
    logs: [
      'Identifying major competitors in vertical...',
      'Scraping publicly available feature sets...',
      'Analyzing competitor ad spend patterns...',
      'SWOT analysis generation initiated...'
    ],
    insight: 'Competitors: Jira, Notion, Linear. Competitive gap: Superior AI-driven budget optimization logic.'
  },
  { 
    id: 'budget', 
    title: 'Budget & KPI strategy', 
    tools: ['CPA calculator', 'Forecasting model'],
    logs: [
      'Simulating ad auctions for top locations...',
      'Predicting conversion rates based on historicals...',
      'Calculating optimal spend for maximum ROAS...',
      'KPI hierarchy defined.'
    ],
    insight: 'Recommended daily: $45-$120. Target CPA: < $32.00. Expected ROAS: 3.8x within 30-day window.'
  },
  { 
    id: 'media', 
    title: 'Media & geo distribution', 
    tools: ['Platform matcher', 'Geo engine'],
    logs: [
      'Evaluating platform-specific performance signals...',
      'Mapping audience concentration by region...',
      'Calculating CPM/CPC trends for Meta vs Google...',
      'Final strategy assembly.'
    ],
    insight: 'Primary focus: Meta (US/UK). Secondary: LinkedIn (B2B focus). Geo priority: Tier-1 English speaking markets.'
  }
];

const TypewriterText = ({ text, duration = 5000, onUpdate, isFirstGeneration }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentLength = Math.floor(progress * text.length);
      
      const newText = text.slice(0, currentLength);
      setDisplayedText(newText);
      if (onUpdate) onUpdate();

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [text, duration]);

  return <span>{displayedText}</span>;
};

export const CampaignGenerator = ({ hasGenerated, setHasGenerated, firstGeneratedUrl, setFirstGeneratedUrl, savedConfig, setSavedConfig, onPageChange }) => {
  const [url, setUrl] = useState(firstGeneratedUrl || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showConfigurePublish, setShowConfigurePublish] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showPublishReview, setShowPublishReview] = useState(false);
  const [publishConfig, setPublishReviewConfig] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const scrollRef = useRef(null);
  const endOfListRef = useRef(null);

  const avatars = [
    { id: 1, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { id: 2, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: 3, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { id: 'ai', isAi: true },
    { id: 4, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilith' },
    { id: 5, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper' },
  ];

  const handlePublishClick = () => {
    setShowPublishModal(true);
  };

  const handlePublishComplete = () => {
    setShowPublishModal(false);
    console.log('Publish complete, redirecting to Ad Manager');
    if (onPageChange) {
      onPageChange('adManagerV3');
    } else {
      window.location.hash = '#/ad-manager-v3';
    }
  };

  const handleStartAnalysis = () => {
    if (!url) return;
    // Removed setHasGenerated(true) from here
    setIsAnalyzing(true);
    setVisibleItems([]);
    setCurrentStepIndex(0);
    setShowFinalResults(false);
    setShowEditor(false);
  };

  useEffect(() => {
    if (isAnalyzing && currentStepIndex < ANALYSIS_SEQUENCE.length) {
      const step = ANALYSIS_SEQUENCE[currentStepIndex];
      // Each step takes 5 seconds for typewriter + 1 second buffer
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, step]);
        setCurrentStepIndex(prev => prev + 1);
      }, currentStepIndex === 0 ? 1200 : 6000); 
      return () => clearTimeout(timer);
    } else if (isAnalyzing && currentStepIndex === ANALYSIS_SEQUENCE.length) {
      const timer = setTimeout(() => setShowFinalResults(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, currentStepIndex]);

  const handleScroll = () => {
    if (isAnalyzing && endOfListRef.current) {
      endOfListRef.current.scrollIntoView({ 
        behavior: 'auto',
        block: 'end'
      });
    }
  };

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    handleScroll();
  }, [visibleItems, currentStepIndex, isAnalyzing]);

  // Loading timer for building process
  useEffect(() => {
    if (isBuilding && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isBuilding && countdown === 0) {
      setIsBuilding(false);
      setShowPublishReview(true);
    }
  }, [isBuilding, countdown]);

  if (isBuilding) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary-50" />
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" 
              style={{ animationDuration: '2s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">{countdown}s</span>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-neutral-900">Building your strategy...</h2>
            <p className="text-neutral-500 leading-relaxed">
              AdsGo is constructing the best-practice ad strategy structure based on your configuration.
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showPublishReview) {
    return (
      <>
        <PublishReviewStep 
          config={publishConfig}
          LOGO_LINKS={LOGO_LINKS}
          onBack={() => {
            setShowPublishReview(false);
            setShowConfigurePublish(true);
          }}
          onPublish={handlePublishClick}
        />
        <PublishCampaignModal 
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          LOGO_LINKS={LOGO_LINKS}
          onComplete={handlePublishComplete}
          publishConfig={{
            ...savedConfig,
            ...publishConfig,
            locations: publishConfig?.locations || savedConfig?.locations,
            budget: publishConfig?.estimatedDailyBudget || savedConfig?.dailyLimit
          }}
        />
      </>
    );
  }

  if (showConfigurePublish) {
    return (
      <ConfigurePublishStep 
        product={selectedProduct}
        savedConfig={savedConfig}
        LOGO_LINKS={LOGO_LINKS}
        onBack={() => setShowConfigurePublish(false)}
        onConfirm={(config) => {
          setPublishReviewConfig(config);
          setIsBuilding(true);
          setCountdown(10);
          setShowConfigurePublish(false);
        }}
      />
    );
  }

  if (showEditor) {
    return (
      <>
        <CampaignEditorStep 
          onBack={() => setShowEditor(false)} 
          finalUrl={url} 
          LOGO_LINKS={LOGO_LINKS}
          onPublish={handlePublishClick}
        />
        <PublishCampaignModal 
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          LOGO_LINKS={LOGO_LINKS}
          onComplete={handlePublishComplete}
          publishConfig={{
            ...savedConfig,
            ...publishConfig,
            locations: publishConfig?.locations || savedConfig?.locations,
            budget: publishConfig?.estimatedDailyBudget || savedConfig?.dailyLimit
          }}
        />
      </>
    );
  }

  if (showFinalResults) {
    return (
      <AnalysisResultsStep 
        onBack={() => {
          setShowFinalResults(false);
          setIsAnalyzing(false);
          setVisibleItems([]);
        }} 
        onGenerate={(config) => {
         ConfigurePublishStep // This is the correct moment to mark the user as non-first-generation
          if (!hasGenerated) {
            setFirstGeneratedUrl(url);
            setHasGenerated(true); 
          }
          setSavedConfig(config);
          setShowEditor(true);
        }}
        LOGO_LINKS={LOGO_LINKS}
        initialUrl={url}
      />
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAFAFA] flex flex-col items-center py-16 px-6 overflow-y-auto" ref={scrollRef}>
        <div className="w-full max-w-4xl space-y-16">
          <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium bg-white px-6 py-3 rounded-full border border-neutral-100 shadow-sm self-start">
            <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
            <span>AI neural deep research: <span className="text-neutral-900 font-bold underline decoration-primary-200">{url}</span></span>
          </div>
          <div className="space-y-20 pb-48">
            {visibleItems.map((item, index) => (
              <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-6 text-left">
                  <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                    {item.title}
                  </h3>
                  <div className="pl-5 space-y-6 border-l-2 border-neutral-100">
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool, ti) => (
                        <div key={ti} className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
                          <Command className="w-3 h-3" />
                          {tool}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 py-2 text-left">
                      {item.logs.map((log, li) => (
                        <div key={li} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${li * 200}ms` }}>
                          <span className="text-neutral-200 text-[10px]">●</span>
                          <p className="text-neutral-500 font-medium text-sm leading-relaxed text-left">{log.replace('{url}', url)}</p>
                        </div>
                      ))}
                    </div>
                    {item.visual === 'screenshot' && (
                      <div className="rounded-[2rem] border border-neutral-200 overflow-hidden shadow-2xl shadow-neutral-200/50 max-w-2xl transition-all hover:scale-[1.01]">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" alt="Captured UI" className="w-full h-auto" />
                      </div>
                    )}
                    <div className="p-6 bg-white rounded-[1.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/20 max-w-3xl relative group text-left">
                      <div className="flex items-center gap-3 mb-3 text-primary-600 text-left">
                        <Zap className="w-4 h-4 fill-primary-600" />
                        <span className="text-[10px] font-bold tracking-wider text-left">Insights captured</span>
                      </div>
                      <p className="text-neutral-700 text-base font-semibold leading-relaxed text-left">
                        <TypewriterText 
                          text={item.insight} 
                          duration={5000} 
                          onUpdate={handleScroll}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {currentStepIndex < ANALYSIS_SEQUENCE.length && (
              <div className="flex items-center gap-4 text-primary-600 animate-pulse pl-5">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold tracking-wider">Processing {ANALYSIS_SEQUENCE[currentStepIndex].title}...</span>
              </div>
            )}
            <div ref={endOfListRef} className="h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <UrlInputStep 
        url={url} 
        setUrl={setUrl} 
        handleStartAnalysis={handleStartAnalysis} 
        avatars={avatars}
        isFirstGeneration={!hasGenerated}
        firstGeneratedUrl={firstGeneratedUrl}
        savedConfig={savedConfig}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
          setShowConfigurePublish(true);
        }}
      />

      <PublishCampaignModal 
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        LOGO_LINKS={LOGO_LINKS}
        onComplete={handlePublishComplete}
        publishConfig={{
          ...savedConfig,
          ...publishConfig,
          locations: publishConfig?.locations || savedConfig?.locations,
          budget: publishConfig?.estimatedDailyBudget || savedConfig?.dailyLimit
        }}
      />
    </>
  );
};
