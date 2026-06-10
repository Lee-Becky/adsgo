import { useState, useEffect } from 'react';

/**
 * 响应式 hook：监听 CSS media query 变化。
 * 例如：const isLgUp = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query) {
  const getMatch = () => (typeof window !== 'undefined' && window.matchMedia)
    ? window.matchMedia(query).matches
    : false;
  const [matches, setMatches] = useState(getMatch);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, [query]);
  return matches;
}

export default useMediaQuery;
