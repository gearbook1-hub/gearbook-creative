import piecesJson from "@/data/pieces.json";
import sourcesJson from "@/data/sources.json";
import ideasJson from "@/data/ideas.json";
import reelsJson from "@/data/reels.json";
import s08 from "@/edits/S08-huss-valley.json";
import type { EditList, Idea, Piece, Reel, Source, SourceKind } from "./types";

export const pieces = piecesJson as Piece[];
export const sources = sourcesJson as Source[];
export const ideas = ideasJson as Idea[];
export const reels = reelsJson as Reel[];

// Edit lists the Reels tab reads. A new cut reel adds its edit list here too.
const EDITS: Record<string, EditList> = { "S08-huss-valley": s08 as EditList };

export function editList(name?: string) {
  return name ? EDITS[name] : undefined;
}

/** A cut's length in seconds, from its shot list. */
export function cutSeconds(e: EditList) {
  return e.shots.reduce((n, s) => n + (s.out - s.in), 0);
}

export const livePieces = pieces.filter((p) => p.status === "live");

export function piece(id: string) {
  return pieces.find((p) => p.id === id);
}

export function source(id: string) {
  return sources.find((s) => s.id === id);
}

/** "Member spotlight video 0:22", "a reel I saved", "I asked for it". */
export function sourceLabel(idea: Idea) {
  const s = source(idea.sourceId);
  if (!s) return idea.sourceId;
  return idea.at ? `${s.shortName} ${idea.at}` : s.shortName;
}

export const SOURCE_KINDS: { kind: SourceKind; title: string }[] = [
  { kind: "video", title: "Videos I record" },
  { kind: "inspo", title: "Inspo I save" },
  { kind: "request", title: "Things I ask for" },
];

export function ideasFrom(kind: SourceKind) {
  return ideas.filter((i) => source(i.sourceId)?.kind === kind);
}

export function stats() {
  const finishedFiles = livePieces.reduce((n, p) => n + p.variants.length * p.formats.length, 0);
  const builtWithoutPick = ideas.filter(
    (i) => i.status === "built" && i.stills && (!i.pickedLetters || i.pickedLetters.length === 0),
  ).length;
  return {
    pieces: livePieces.length,
    finishedFiles,
    ideasPitched: ideas.length,
    built: ideas.filter((i) => i.status === "built").length,
    builtWithoutPick,
  };
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
