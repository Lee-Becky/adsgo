import {
  buildMockActors,
  buildMockClips,
  buildMockFinalVideoUrl,
  buildMockScripts,
} from './mock';

export function runAnalyze(dispatch, state, busyRef) {
  if (busyRef.current.analyzing) return;
  dispatch({ type: 'SET_BUSY', payload: { analyzing: true } });
  dispatch({ type: 'SET_STEP', payload: 2 });
  dispatch({ type: 'BUMP_REACHED', payload: 2 });
  if (state.inputMode === 'url') {
    dispatch({ type: 'SET_SOURCE_URL', payload: state.url.trim() });
  }

  setTimeout(() => {
    if (state.inputMode === 'url') {
      dispatch({
        type: 'UPDATE_FORM',
        payload: {
          productName: state.form.productName || 'Organic Face Serum 50ml',
          audience: state.form.audience || 'Skincare lovers, 20–35, focus on hydration & glow.',
          coreSelling:
            state.form.coreSelling ||
            'Clinically backed hydrating serum with lightweight texture. Fast absorption, visible glow in 7 days.',
          promotion: state.form.promotion || 'New launch — 20% OFF for first-time customers',
          cta: state.form.cta || 'Shop now',
          lang: state.form.lang || '英语',
        },
      });
    }
    dispatch({ type: 'SET_BUSY', payload: { analyzing: false } });
  }, 1200);
}

export function runGenerateScripts(dispatch, state, busyRef) {
  if (busyRef.current.scripting) return;
  dispatch({ type: 'SET_BUSY', payload: { scripting: true } });
  dispatch({ type: 'SET_STEP', payload: 3 });
  dispatch({ type: 'BUMP_REACHED', payload: 3 });
  dispatch({ type: 'SELECT_SCRIPT', payload: null });

  setTimeout(() => {
    dispatch({
      type: 'SET_SCRIPTS',
      payload: buildMockScripts({
        form: state.form,
        settings: state.settings,
        selectedStyleKeys: state.selectedStyleKeys,
      }),
    });
    dispatch({ type: 'SET_BUSY', payload: { scripting: false } });
  }, 1400);
}

export function selectScriptAndMatch(dispatch, state, busyRef, scriptId) {
  if (busyRef.current.matching) return;
  dispatch({ type: 'SELECT_SCRIPT', payload: scriptId });
  dispatch({ type: 'SET_BUSY', payload: { matching: true } });
  dispatch({ type: 'SET_STEP', payload: 4 });
  dispatch({ type: 'BUMP_REACHED', payload: 4 });

  setTimeout(() => {
    dispatch({ type: 'SET_ACTORS', payload: buildMockActors(state.form.lang) });
    dispatch({ type: 'SET_BUSY', payload: { matching: false } });
  }, 900);
}

export function selectActorAndAdvance(dispatch, actorId) {
  dispatch({ type: 'SELECT_ACTOR', payload: actorId });
  dispatch({ type: 'SET_STEP', payload: 5 });
  dispatch({ type: 'BUMP_REACHED', payload: 5 });
}

export function runSubmitStoryboard(dispatch, busyRef) {
  if (busyRef.current.submittingStoryboard) return;
  dispatch({ type: 'SET_BUSY', payload: { submittingStoryboard: true } });

  setTimeout(() => {
    dispatch({ type: 'SET_BUSY', payload: { submittingStoryboard: false } });
    dispatch({ type: 'SET_STEP', payload: 6 });
    dispatch({ type: 'BUMP_REACHED', payload: 6 });
    dispatch({ type: 'SET_CLIPS_GENERATING', payload: true });
    dispatch({ type: 'SET_CLIPS', payload: [] });

    setTimeout(() => {
      dispatch({ type: 'SET_CLIPS', payload: buildMockClips() });
      dispatch({ type: 'SET_CLIPS_GENERATING', payload: false });
    }, 2800);
  }, 900);
}

export function runComposeFinal(dispatch, busyRef) {
  if (busyRef.current.finalCompose) return;
  dispatch({ type: 'SET_BUSY', payload: { finalCompose: true } });

  setTimeout(() => {
    dispatch({
      type: 'SET_FINAL',
      payload: { url: buildMockFinalVideoUrl(), generatedAt: new Date() },
    });
    dispatch({ type: 'SET_BUSY', payload: { finalCompose: false } });
    dispatch({ type: 'SET_STEP', payload: 7 });
    dispatch({ type: 'BUMP_REACHED', payload: 7 });
  }, 1600);
}

export function polishCoreSelling(dispatch, state) {
  const t = state.form.coreSelling?.trim() || '';
  if (t.includes('【AI 润色】')) return;
  dispatch({
    type: 'UPDATE_FORM',
    payload: {
      coreSelling: `${t}\n\n【AI 润色】强化「即涂即吸收、7 天可见光泽」等利益点，语气更贴近短视频口播。`,
    },
  });
}

export function polishVoiceover(dispatch, state) {
  const t = state.step5.voiceover?.trim() || '';
  if (t.includes('【AI 润色】')) return;
  dispatch({
    type: 'UPDATE_STEP5',
    payload: {
      voiceover: `${t}\n\n【AI 润色】加入短停顿与结尾行动号召，利于转化。`,
    },
  });
}
