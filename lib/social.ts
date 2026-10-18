import postsJson from "@/data/posts.json";
import ideasJson from "@/data/content-ideas.json";
import socialJson from "@/data/social.json";
import type { ContentIdea, FormatKey, Post } from "./types";

export const posts = postsJson as Post[];
export const contentIdeas = ideasJson as ContentIdea[];
export const social = socialJson;

export const formatName = (k: FormatKey) => social.formats.find((f) => f.key === k)!.name;

/** Likes per format, for the "what works" hint. */
export function byFormat() {
  return social.formats.map((f) => {
    const ps = posts.filter((p) => p.format === f.key);
    const avg = ps.length ? Math.round(ps.reduce((n, p) => n + p.likes, 0) / ps.length) : 0;
    return { key: f.key as FormatKey, name: f.name, count: ps.length, avg };
  });
}

export const fmtDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
