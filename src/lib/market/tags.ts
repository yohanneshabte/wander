export type TagKey =
  | "gym"
  | "sauna"
  | "soak"
  | "float"
  | "recovery"
  | "sleep"
  | "pain"
  | "focus"
  | "martial"
  | "skin";

export const VISUAL_TAGS: {
  key: TagKey;
  label: string;
  hint: string;
  kinds: string[];
  match: string[];
}[] = [
  { key: "gym", label: "Workout", hint: "Floor, PT, classes", kinds: ["gym"], match: ["gym", "hiit", "pt", "classes", "coaching"] },
  { key: "sauna", label: "Sauna", hint: "Heat, infrared, steam", kinds: ["sauna_studio", "korean_spa"], match: ["sauna", "infrared", "steam", "halo"] },
  { key: "soak", label: "Soak", hint: "Private tubs", kinds: ["bathhouse"], match: ["soak", "plunge"] },
  { key: "float", label: "Float", hint: "Rest tanks", kinds: ["float_lab"], match: ["float", "rest"] },
  { key: "recovery", label: "Recover", hint: "Cryo, contrast", kinds: [], match: ["cryo", "contrast", "compression", "plunge", "recovery"] },
  { key: "sleep", label: "Sleep", hint: "Nervous system", kinds: [], match: ["float", "rest", "soak"] },
  { key: "pain", label: "Back / pain", hint: "Massage, soak", kinds: [], match: ["massage", "soak", "pemf", "pain"] },
  { key: "focus", label: "Labs", hint: "DEXA, longevity", kinds: ["biotech"], match: ["labs", "dexa", "vo2", "longevity", "iv", "hbot"] },
  { key: "martial", label: "Martial", hint: "Mat, belts", kinds: ["martial"], match: ["classes", "mat"] },
  { key: "skin", label: "Skin", hint: "Med spa", kinds: ["medspa"], match: ["facial", "skin", "laser"] },
];

export const HEALTH_GOALS = VISUAL_TAGS.filter((t) =>
  ["gym", "sauna", "sleep", "pain", "recovery", "focus"].includes(t.key),
);

export function placeMatchesTag(
  place: { kind: string; tags: string[] },
  key: string,
) {
  const tag = VISUAL_TAGS.find((t) => t.key === key);
  if (!tag) return place.tags.includes(key);
  if (tag.kinds.includes(place.kind)) return true;
  return place.tags.some((t) => tag.match.includes(t));
}
