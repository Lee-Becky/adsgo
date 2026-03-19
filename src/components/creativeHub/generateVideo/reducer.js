import {
  ASSET_LIBRARY,
  DEFAULT_FORM,
  DEFAULT_SETTINGS,
  DEFAULT_STEP5,
  VIDEO_TYPES,
} from './mock';

export const initialState = {
  activeStep: 1,
  maxReached: 1,

  inputMode: 'url',
  url: 'https://example.com/products/serum',
  sourceUrl: '',
  videoTypeId: VIDEO_TYPES[0]?.id || 'handheld',
  storyboardTab: 'k1',

  form: { ...DEFAULT_FORM },
  settings: { ...DEFAULT_SETTINGS },
  selectedStyleKeys: ['情感共鸣'],
  selectedAssets: new Set([ASSET_LIBRARY[0].id, ASSET_LIBRARY[1].id, ASSET_LIBRARY[2].id]),

  scripts: [],
  selectedScriptId: null,

  actors: [],
  selectedActorId: null,

  step5: { ...DEFAULT_STEP5 },

  clips: [],
  clipsGenerating: false,

  finalVideoUrl: '',
  finalGeneratedAt: null,

  busy: {
    analyzing: false,
    scripting: false,
    matching: false,
    submittingStoryboard: false,
    finalCompose: false,
  },
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, activeStep: action.payload };

    case 'BUMP_REACHED':
      return { ...state, maxReached: Math.max(state.maxReached, action.payload) };

    case 'SET_INPUT_MODE':
      return { ...state, inputMode: action.payload };

    case 'SET_URL':
      return { ...state, url: action.payload };

    case 'SET_SOURCE_URL':
      return { ...state, sourceUrl: action.payload };

    case 'SET_VIDEO_TYPE':
      return { ...state, videoTypeId: action.payload };

    case 'SET_STORYBOARD_TAB':
      return { ...state, storyboardTab: action.payload };

    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'TOGGLE_STYLE': {
      const k = action.payload;
      const prev = state.selectedStyleKeys;
      const next = prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k];
      return { ...state, selectedStyleKeys: next.slice(0, 3) };
    }

    case 'TOGGLE_ASSET': {
      const id = action.payload;
      const next = new Set(state.selectedAssets);
      if (next.has(id)) next.delete(id);
      else if (next.size < 5) next.add(id);
      return { ...state, selectedAssets: next };
    }

    case 'SET_SCRIPTS':
      return { ...state, scripts: action.payload };

    case 'SELECT_SCRIPT':
      return { ...state, selectedScriptId: action.payload };

    case 'SET_ACTORS':
      return { ...state, actors: action.payload };

    case 'SELECT_ACTOR':
      return { ...state, selectedActorId: action.payload };

    case 'UPDATE_STEP5':
      return { ...state, step5: { ...state.step5, ...action.payload } };

    case 'SET_CLIPS':
      return { ...state, clips: action.payload };

    case 'SET_CLIPS_GENERATING':
      return { ...state, clipsGenerating: action.payload };

    case 'MOVE_CLIP': {
      const { index, dir } = action.payload;
      const next = [...state.clips];
      const j = index + dir;
      if (j < 0 || j >= next.length) return state;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...state, clips: next };
    }

    case 'ADD_CLIP':
      return { ...state, clips: [...state.clips, action.payload] };

    case 'SET_FINAL':
      return {
        ...state,
        finalVideoUrl: action.payload.url,
        finalGeneratedAt: action.payload.generatedAt,
      };

    case 'SET_BUSY':
      return { ...state, busy: { ...state.busy, ...action.payload } };

    case 'RESET_ALL':
      return { ...initialState, selectedAssets: new Set(initialState.selectedAssets) };

    default:
      return state;
  }
}
