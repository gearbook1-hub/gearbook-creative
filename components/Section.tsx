"use client";

import { useEffect, useRef, useState } from "react";

// A numbered section. When it scrolls into the middle of the screen it "lights", the way the
// reel lights each section as the narration reaches it: the number turns amber and any
// `.glow` cards inside light up one after another (and stay lit).
export function Section({ num, title, id, children }: { num: string; title: string; id?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || lit) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setLit(true);
      io.disconnect();
      el.querySelectorAll<HTMLElement>(".glow").forEach((card, i) => {
        window.setTimeout(() => card.setAttribute("data-lit", "true"), 350 + i * 450);
      });
    }, { rootMargin: "-35% 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [lit]);

  return (
    <section ref={ref} className="section" id={id} data-lit={lit}>
      <div className="section-head">
        <span className="section-num">{num}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}
