"use client";

import { useEffect, useRef, useState } from "react";

// The reel's stats fill in after their labels: blank first, then the number rolls up.
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(value); return; }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now() + 450;
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / 900));
        if (now >= start) setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return (
    <div ref={ref} className={className} aria-label={String(value)}>
      {shown === null ? " " : shown}
    </div>
  );
}
