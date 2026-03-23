import { useState, useRef, useCallback, useEffect } from 'react';

export const ROW_HEIGHT = 56;
const BUFFER = 5;

export function useVirtualScroll(totalItems: number) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(top);
    });
  }, []);


  const visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const visibleEnd = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER
  );

  return {
    containerRef,
    handleScroll,
    visibleStart,
    visibleEnd,
    totalHeight: totalItems * ROW_HEIGHT,
    offsetTop: visibleStart * ROW_HEIGHT,
    offsetBottom: (totalItems - visibleEnd) * ROW_HEIGHT,
  };
}


