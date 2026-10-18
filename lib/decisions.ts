"use client";

import { useCallback, useEffect, useState } from "react";

// Approve / pass / notes from Pulse. The hub is a static site, so decisions are kept in this
// browser (localStorage) until applied to data/ideas.json with scripts/apply-decisions.mjs.
export type Decision = { decision?: "approved" | "passed"; note?: string; at?: string };
export type Decisions = Record<string, Decision>;

const KEY = "gearbook-creative:decisions";
const EVENT = "gearbook-creative:decisions-changed";

function load(): Decisions {
  try { return JSON.parse(window.localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decisions>({});

  useEffect(() => {
    setDecisions(load());
    const sync = () => setDecisions(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);

  const update = useCallback((id: string, patch: Decision) => {
    const next = { ...load(), [id]: { ...load()[id], ...patch, at: new Date().toISOString() } };
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked: keep in memory */ }
    setDecisions(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const clear = useCallback(() => {
    try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
    setDecisions({});
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { decisions, update, clear };
}
