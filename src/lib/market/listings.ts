import {
  KIND_MENU,
  PROSPECTS,
  type PlaceKind,
  type Prospect,
} from "@/lib/directory/prospects";

export const GOAL_OPTIONS = [
  { key: "gym", name: "Start gym", tags: ["gym", "hiit", "pt", "classes"] },
  { key: "sauna", name: "Sauna habit", tags: ["sauna", "infrared", "soak"] },
  { key: "sleep", name: "Sleep", tags: ["float", "rest", "soak"] },
  { key: "pain", name: "Pain / back", tags: ["massage", "soak", "pemf"] },
  { key: "recovery", name: "Recovery", tags: ["contrast", "cryo", "plunge", "compression"] },
  { key: "focus", name: "Clearer head", tags: ["float", "labs", "longevity"] },
] as const;

export function coverFor(kind: PlaceKind) {
  if (kind === "gym" || kind === "martial") return "/listings/gym.jpg";
  if (kind === "sauna_studio" || kind === "korean_spa") return "/listings/sauna.jpg";
  if (kind === "float_lab") return "/listings/float.jpg";
  if (kind === "biotech") return "/listings/lab.jpg";
  if (kind === "medspa") return "/listings/medspa.jpg";
  return "/listings/bath.jpg";
}

export function fromPrice(kind: PlaceKind) {
  const menu = KIND_MENU[kind];
  const paid = menu.filter((s) => s.listPrice > 0).map((s) => s.listPrice);
  return paid.length ? Math.min(...paid) : 0;
}

export function neighborhoodOf(p: Prospect) {
  const part = p.address.split(",")[0]?.trim() ?? p.city;
  return part.length < 40 ? part : p.city;
}

export type ListingCard = Prospect & {
  neighborhood: string;
  fromPrice: number;
  coverUrl: string;
  tour3dUrl: string;
  guestsMax: number;
  instantBook: boolean;
  houseRules: string;
  cancelNote: string;
};

export function asCard(p: Prospect, extra?: Partial<ListingCard>): ListingCard {
  return {
    ...p,
    neighborhood: neighborhoodOf(p),
    fromPrice: fromPrice(p.kind),
    coverUrl: coverFor(p.kind),
    tour3dUrl: extra?.tour3dUrl ?? "",
    guestsMax: extra?.guestsMax ?? (p.kind === "gym" ? 12 : 4),
    instantBook: extra?.instantBook ?? (p.id === "watercourse-ref" || p.id === "solivana-ref"),
    houseRules: extra?.houseRules ?? "Quiet rooms. No glass. Late fee after 10 minutes.",
    cancelNote: extra?.cancelNote ?? "24-hour hold. Desk may move a late guest.",
    ...extra,
  };
}

export const LISTING_SEED: ListingCard[] = PROSPECTS.map((p) =>
  asCard(p, p.id === "watercourse-ref" ? { coverUrl: "/hero.jpg", instantBook: true } : undefined),
);
