import type { Prospect } from "./prospects";

export const ANCHORS = {
  sanLeandro: { lat: 37.7249, lng: -122.1561, label: "San Leandro" },
  paloAlto: { lat: 37.4419, lng: -122.143, label: "Palo Alto" },
  sanJose: { lat: 37.3382, lng: -121.8863, label: "San Jose" },
};

export function miles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function similarTo(place: Prospect, all: Prospect[], n = 5) {
  return all
    .filter((p) => p.id !== place.id)
    .map((p) => {
      const tagHit = p.tags.filter((t) => place.tags.includes(t)).length;
      const kind = p.kind === place.kind ? 2 : 0;
      const region = p.region === place.region ? 1 : 0;
      const dist = miles(place, p);
      const score = tagHit * 3 + kind + region - dist / 20;
      return { p, score, dist };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}
