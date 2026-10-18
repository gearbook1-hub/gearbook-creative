// The hub's data model. Everything the dashboard shows is derived from three files in data/:
// pieces.json (the library: every motion graphic already built), sources.json (videos Luke
// records, inspo reels saved, things asked for) and ideas.json (every moment the motion mod
// flagged, with the evidence, the catalog check, the stills and the build).

export type PreviewKind =
  | "signal" | "transition" | "ring" | "dots" | "wave" | "statement" | "name" | "number"
  | "flow" | "compare" | "opener" | "pop" | "topo" | "bars" | "quiet" | "trail" | "map"
  | "load" | "tally" | "relay" | "sweep" | "path" | "retired";

export type Ground = "bark" | "cream" | "sage" | "amber" | "ink" | "slate";

export interface Variant {
  /** Tracked label shown under the variant in the gallery, e.g. "SWITCHBACK". */
  label: string;
  ground: Ground;
}

export interface Piece {
  /** Library id, "M01" to "M99". Never reused. */
  id: string;
  name: string;
  version: number;
  status: "live" | "retired";
  /** What it does and when to reach for it. The scout reads this to decide if a moment is already covered. */
  description: string;
  /** What the piece can and cannot show; the scout quotes this in its catalog check. */
  covers: string;
  preview: PreviewKind;
  ground: Ground;
  variants: Variant[];
  /** Export formats rendered for every variant, e.g. ["9:16", "1:1", "16:9"]. */
  formats: string[];
  /** Props the piece takes, so it can be re-rendered with new words or numbers. */
  variables: string[];
  /** Remotion composition id when the piece is built in this repo. */
  composition?: string;
  builtFrom?: string;
  builtOn: string;
  sample: boolean;
}

export type SourceKind = "video" | "inspo" | "request";

export interface Source {
  id: string;
  kind: SourceKind;
  title: string;
  /** How the source is referred to in the log, e.g. "Member spotlight video". */
  shortName: string;
  date: string;
  link?: string;
  /** Timestamped transcript lines. Sample text is marked by `sample: true`. */
  transcript: { t: string; text: string }[];
  /** Library pieces this video's edit already used. */
  usedPieces: string[];
  sample: boolean;
}

export type IdeaStatus = "pitched" | "approved" | "passed" | "stills" | "picked" | "building" | "built" | "waiting";

export interface CatalogCheck {
  piece: string;
  verdict: string;
}

export interface Still {
  letter: "A" | "B" | "C";
  name: string;
  line: string;
  ground: Ground;
}

export interface Idea {
  id: string;
  name: string;
  sourceId: string;
  /** "0:22" for videos; empty for inspo and requests. */
  at?: string;
  /** The exact line that triggered the idea. */
  quote: string;
  pitch: string;
  catalogCheck: CatalogCheck[];
  /** Why nothing in the library already works, in one line. */
  whyNew: string;
  status: IdeaStatus;
  waitingOn?: string;
  pitchedOn: string;
  stills?: Still[];
  pickedLetters?: string[];
  note?: string;
  builtAs?: string;
  renderCheck?: { t: string; pass: boolean; note: string }[];
}
