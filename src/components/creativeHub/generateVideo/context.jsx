import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { reducer, initialState } from './reducer';
import { buildFinalMetaGrid, buildMockKeyframes } from './mock';

const VideoWizardContext = createContext(null);

export function VideoWizardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const busyRef = useRef(state.busy);
  useEffect(() => {
    busyRef.current = state.busy;
  }, [state.busy]);

  const derived = useMemo(() => ({
    keyframes: buildMockKeyframes(state.selectedAssets),
    canGenerateScripts:
      !!state.form.productName?.trim() &&
      !!state.form.audience?.trim() &&
      !!state.form.coreSelling?.trim() &&
      state.selectedAssets.size >= 3,
    canGenerateStoryboard:
      !!state.selectedActorId &&
      !!state.selectedScriptId &&
      !!state.step5.requiredKeyframeId,
    selectedScript: state.scripts.find((s) => s.id === state.selectedScriptId) || null,
    selectedActor: state.actors.find((a) => a.id === state.selectedActorId) || null,
    finalMeta: buildFinalMetaGrid({
      form: state.form,
      settings: state.settings,
      clipsLength: state.clips.length,
    }),
  }), [state]);

  const value = useMemo(
    () => ({ state, dispatch, derived, busyRef }),
    [state, derived],
  );

  return (
    <VideoWizardContext.Provider value={value}>
      {children}
    </VideoWizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(VideoWizardContext);
  if (!ctx) throw new Error('useWizard must be used within VideoWizardProvider');
  return ctx;
}
