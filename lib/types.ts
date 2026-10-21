// The hub's data model. Everything the dashboard shows is derived from three files in data/:
// pieces.json (the library: every motion graphic already built), sources.json (videos Luke
// records, inspo reels saved, things asked for) and ideas.json (every moment the motion mod
// flagged, with the evidence, the catalog check, the stills and the build).

export type PreviewKind =
  | "signal" | "transition" | "ring" | "dots" | "wave" | "statement" | "name" | "number"
  | "flow" | "compare" | "opener" | "pop" | "topo" | "bars" | "quiet" | "trail" | "map"
  | "load" | "tally" | "relay" | "sweep" | "path" | "video" | "retired";

export type Ground = "bark" | "cream" | "sage" | "amber" | "ink" | "slate";

export interface Variant {
  /** Tracked label shown under the variant in the gallery, e.g. "SWITCHBACK". */
  label: string;
  ground: Ground;
  /** For HTML pieces: the ?look= value that renders this variant. */
  look?: string;
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
  /** Folder under public/pieces/ when the piece is an HTML motion piece in this repo. */
  html?: string;
  /** Preview video under public/ for pieces made elsewhere. */
  video?: string;
  /** Where the full-quality master lives. */
  master?: string;
  builtFrom?: string;
  builtOn: string;
  sample: boolean;
}

/**
 * A whole reel Claude made, ready to post (data/reels.json, the Reels tab). Not a pack piece:
 * reels use pieces, pieces don't hold reels. "animated" reels are built entirely in code;
 * "cut" reels are Claude's edit of filmed clips, with pack pieces laid over them.
 */
export interface Reel {
  /** "R01" to "R99". Never reused. */
  id: string;
  name: string;
  kind: "animated" | "cut";
  /** draft until Luke or Matt approves it; posted once it's on the feed. */
  status: "draft" | "approved" | "posted";
  /** The house format it fits, if any. Animated explainers often fit none of the three. */
  format?: "A" | "B" | "C";
  /** What it shows, in a sentence or two. */
  description: string;
  /** Who asked for it and how it was made. */
  made: string;
  madeOn: string;
  /** Animated reels: length in seconds. A cut's length comes from its edit list. */
  seconds?: number;
  /** Animated reels: folder under public/pieces/ that plays it live on the hub. */
  html?: string;
  /** Cut reels: the edit list in edits/ (without .json), which holds the shot list and the pieces used. */
  edit?: string;
  /** The source in data/sources.json, when the reel was cut from filmed clips. */
  source?: string;
  /** Pack pieces the reel uses, by id. */
  pieces: string[];
  /** Where the full-quality master (or the clips) live. Never in the repo. */
  master: string;
  /** An older id, e.g. the signup reel was logged as M25 before reels had their own tab. */
  was?: string;
}

/** An edit list in edits/: how Claude cut a reel from filmed clips (the video-cut skill). */
export interface EditList {
  source: string;
  slug: string;
  title: string;
  format: "A" | "B" | "C";
  drivePath: string;
  fps: number;
  shots: { clip: string; in: number; out: number; beat: string; why: string }[];
  graphics: { piece: string; look: string; shot: number; offset: number; why: string; glass?: boolean; sound?: string; soundOffset?: number; soundGain?: number }[];
  dropped: { clip: string; why: string }[];
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

// Social: what GearBook posts. From the gearbook repo's docs/marketing/social-identity.md and
// content-idea-bank.md, copied into data/ (posts.json, content-ideas.json, social.json).

export type FormatKey = "A" | "B" | "C";

export interface Post {
  date: string;
  title: string;
  line: string;
  format: FormatKey;
  likes: number;
  comments: number;
  note?: string;
}

export interface ContentIdea {
  id: string;
  format: FormatKey;
  name: string;
  series?: boolean;
  /** A loose window, never a date: content is made in the week of posting. */
  window: string;
  hook: string;
  beats: string[];
  notes?: string[];
  settings?: string[];
  /** Library pieces the edit can reuse. */
  motion?: string[];
}
