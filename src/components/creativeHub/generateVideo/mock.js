export const FORM_LANGS = ['英语', '中文 (普通话)'];

function seededImg(seed, w, h) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/** Kreado Step1 底部三种视频类型卡片 */
export const VIDEO_TYPES = [
  { id: 'handheld', title: '手持商品类视频', desc: '第一人称视角，真实感展示产品细节', cover: seededImg('kreado-type-handheld', 400, 300) },
  { id: 'tryon', title: '商品虚拟试穿视频', desc: 'AI 模特上身实拍，展示穿搭效果', cover: seededImg('kreado-type-tryon', 400, 300) },
  { id: 'explain', title: '产品讲解视频', desc: '口播带货风格，深度讲解卖点', cover: seededImg('kreado-type-explain', 400, 300) },
];

/** Kreado Step2 输出语种下拉（与产品内列表对齐，演示精简版） */
export const LANG_OPTIONS = [
  '英语',
  '中文 (普通话)',
  '西班牙语',
  '葡萄牙语',
  '日语',
  '韩语',
  '法语',
  '德语',
];

export const SCRIPT_STYLES = [
  'UGC分享',
  '痛点引导',
  '情感共鸣',
  '潮流引导',
  '生活趣味',
  '真实体验',
  '功能科普',
  '快速展示',
  '秒杀式',
];

export const DURATIONS = ['8s', '16s', '24s', '32s', '40s', '48s', '56s'];
export const RESOLUTIONS = ['720P清晰', '1080P高清', '4K超清'];
export const QUALITIES = ['快速生成', '高质量'];
export const RATIOS = ['9:16 竖屏', '16:9 横屏'];

export const DEFAULT_FORM = {
  productName: '',
  audience: '',
  coreSelling: '',
  lang: '英语',
  promotion: '',
  cta: '',
};

export const DEFAULT_SETTINGS = {
  duration: '16s',
  resolution: '1080P高清',
  quality: '快速生成',
  ratio: '9:16 竖屏',
};

export const DEFAULT_STEP5 = {
  voiceover:
    'There is magic in the unpredictable. This floral scent is my daily spark of joy. Discover your signature moment today.',
  actionPrompt:
    'The subject gently cradles the product with both hands, brings it closer to the camera, then smiles naturally as light shifts across the scene.',
  autoVoice: true,
  requiredKeyframeId: '',
  optionalKeyframeId: '',
};

export const ASSET_LIBRARY = Array.from({ length: 12 }).map((_, i) => ({
  id: `asset_${i + 1}`,
  name: `Asset ${i + 1}`,
  src: seededImg(`adsgo-video-asset-${i + 1}`, 360, 360),
}));

export function buildMockScripts({ form, settings, selectedStyleKeys }) {
  const base = [
    {
      title: 'Emotional connection with the product',
      style: selectedStyleKeys[0] || '情感共鸣',
      body:
        `Hook: “You deserve a little glow-up.”\n` +
        `Problem: Busy days, dull skin.\n` +
        `Solution: ${form.productName || 'Your product'} — ${form.coreSelling || 'hydration + glow'}.\n` +
        `Offer: ${form.promotion || 'Limited-time deal'}.\n` +
        `CTA: ${form.cta || 'Shop now'}.\n` +
        `Specs: ${settings.duration} · ${settings.ratio} · ${settings.resolution} · ${settings.quality}`,
    },
    {
      title: 'Finding the perfect signature pick',
      style: selectedStyleKeys[1] || 'UGC分享',
      body:
        `UGC intro: “I tried this for 7 days…”\n` +
        `3 key benefits: (1) Fast absorption (2) No sticky feel (3) Visible glow.\n` +
        `For: ${form.audience || 'your target audience'}.\n` +
        `Offer: ${form.promotion || 'Limited-time deal'}.\n` +
        `CTA: ${form.cta || 'Shop now'}.\n` +
        `Specs: ${settings.duration} · ${settings.ratio} · ${settings.resolution} · ${settings.quality}`,
    },
    {
      title: 'Product introduction and experience',
      style: selectedStyleKeys[2] || '功能科普',
      body:
        `Explain: what it is + how to use.\n` +
        `Why it works: ${form.coreSelling || 'key selling points'}.\n` +
        `Social proof: “Loved by thousands of customers.”\n` +
        `CTA: ${form.cta || 'Shop now'}.\n` +
        `Specs: ${settings.duration} · ${settings.ratio} · ${settings.resolution} · ${settings.quality}`,
    },
  ];

  return base.map((s, idx) => ({ ...s, id: `script_${Date.now()}_${idx}` }));
}

export function buildMockActors(lang) {
  const list = [
    { id: 'actor_1', name: 'Ava', desc: 'Warm, friendly, high trust', cover: seededImg('adsgo-actor-1', 640, 480) },
    { id: 'actor_2', name: 'Mia', desc: 'Clean, premium, soft energy', cover: seededImg('adsgo-actor-2', 640, 480) },
    { id: 'actor_3', name: 'Noah', desc: 'Direct, energetic, conversion-driven', cover: seededImg('adsgo-actor-3', 640, 480) },
  ];

  // Keep interface stable; lang reserved for later locale variations.
  void lang;
  return list;
}

export function buildMockKeyframes(selectedAssets) {
  const ids = Array.from(selectedAssets);
  const fallback = ASSET_LIBRARY.slice(0, 6).map((a) => a.id);

  const userPicks = ids.length ? ids : [];
  const combined = [...userPicks];
  for (const fId of fallback) {
    if (combined.length >= 6) break;
    if (!combined.includes(fId)) combined.push(fId);
  }
  const pool = combined.slice(0, 6);

  const frames = pool.map((id, i) => {
    const a = ASSET_LIBRARY.find((x) => x.id === id) || ASSET_LIBRARY[i % ASSET_LIBRARY.length];
    return {
      id: `kf_${id}`,
      src: a.src,
    };
  });

  return {
    required: frames.slice(0, 3),
    optional: frames.slice(3, 6),
  };
}

export function buildMockStoryboardVideoUrl() {
  return `https://example.com/mock-storyboard-${Date.now()}.mp4`;
}

export function buildMockFinalVideoUrl() {
  return `https://example.com/mock-final-${Date.now()}.mp4`;
}

export const VIDEO_EXAMPLES = [
  { id: 'ex-1', title: '护肤精华液', thumb: seededImg('adsgo-example-1', 180, 320), duration: '15s' },
  { id: 'ex-2', title: '无线耳机', thumb: seededImg('adsgo-example-2', 180, 320), duration: '20s' },
  { id: 'ex-3', title: '运动鞋款', thumb: seededImg('adsgo-example-3', 180, 320), duration: '12s' },
  { id: 'ex-4', title: '智能手表', thumb: seededImg('adsgo-example-4', 180, 320), duration: '18s' },
  { id: 'ex-5', title: '香氛蜡烛', thumb: seededImg('adsgo-example-5', 180, 320), duration: '10s' },
];

export const SCENE_THUMBNAILS = [
  { id: 'scene-1', src: seededImg('adsgo-scene-1', 320, 180), label: '场景 1' },
  { id: 'scene-2', src: seededImg('adsgo-scene-2', 320, 180), label: '场景 2' },
];

/** Step 6 — 分镜视频片段（缩略图竖版近似 9:16） */
export function buildMockClips() {
  return [
    {
      id: `clip_${Date.now()}`,
      title: '分镜 1',
      thumb: seededImg('adsgo-clip-1', 360, 640),
    },
  ];
}

/** Step 7 — 右侧规格栅格（与 Kreado 成片页信息维度对齐，值为演示） */
export function buildFinalMetaGrid({ form, settings, clipsLength }) {
  return [
    { label: '视频类型', value: '产品讲解', hint: '' },
    { label: '分镜数', value: `${clipsLength || 1} 个`, hint: '' },
    { label: '时长', value: settings.duration || '8s', hint: '' },
    { label: '语言', value: form.lang || '英语', hint: '' },
    { label: '比例', value: settings.ratio || '9:16 竖屏', hint: '' },
    { label: '清晰度', value: settings.resolution || '720P清晰', hint: '' },
  ];
}

