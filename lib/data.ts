import piecesJson from "@/data/pieces.json";
import sourcesJson from "@/data/sources.json";
import ideasJson from "@/data/ideas.json";
import type { Idea, Piece, Source, SourceKind } from "./types";

export const pieces = piecesJson as Piece[];
export const sources = sourcesJson as Source[];
export const ideas = ideasJson as Idea[];

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
