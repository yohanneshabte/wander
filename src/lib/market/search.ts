import { LISTING_SEED, type ListingCard } from "./listings";
import { ANCHORS, miles } from "@/lib/directory/geo";
import { placeMatchesTag } from "./tags";

export const RADIUS_MI = 100;

export type PlaceHit = ListingCard & { dist: number };

export type SearchQuery = {
  q?: string;
  tag?: string;
  maxPrice?: number;
  anchor?: keyof typeof ANCHORS;
  radius?: number;
  goals?: string[];
};

export function searchPlaces(opts: SearchQuery = {}): PlaceHit[] {
  const origin = ANCHORS[opts.anchor ?? "sanLeandro"];
  const radius = opts.radius ?? RADIUS_MI;
  const q = (opts.q ?? "").trim().toLowerCase();
  let rows: PlaceHit[] = LISTING_SEED.map((p) => ({
    ...p,
    dist: miles(origin, p),
  })).filter((p) => p.dist <= radius);

  if (opts.tag) rows = rows.filter((p) => placeMatchesTag(p, opts.tag!));
  if (opts.maxPrice) rows = rows.filter((p) => p.fromPrice <= opts.maxPrice!);
  if (q) {
    rows = rows.filter((p) =>
      `${p.name} ${p.city} ${p.kind} ${p.tags.join(" ")} ${p.pitch}`.toLowerCase().includes(q),
    );
  }
  if (opts.goals?.length) {
    const g = opts.goals;
    rows.sort((a, b) => score(b, g) - score(a, g) || a.dist - b.dist);
  } else {
    rows.sort((a, b) => a.dist - b.dist);
  }
  return rows;
}

function score(p: PlaceHit, goals: string[]) {
  return goals.reduce((n, g) => n + (placeMatchesTag(p, g) ? 2 : 0), 0);
}

export function placeById(id: string) {
  return LISTING_SEED.find((p) => p.id === id) ?? null;
}
