/** Personal 0.3 alpha: one swap point for the second modality and the venue list. */

export type ModalityKey = "contrast" | "cold_plunge" | "steam";

/**
 * Second modality stacked on the water-first layer. Repo evidence did not name
 * one, so contrast (hot/cold alternating) is the default. Swap this one value.
 */
export const SECOND_MODALITY: ModalityKey = "contrast";

/** Venues are names + external links only. Their own apps stay the booking layer. No affiliation. */
export type Venue = { id: string; name: string; url: string };

export const VENUES: Venue[] = [
  { id: "watercourse", name: "Watercourse Way", url: "https://watercourseway.com" },
  { id: "perspire", name: "Perspire", url: "https://www.perspiresaunastudio.com" },
  { id: "first-fire", name: "First Fire", url: "" },
  { id: "home", name: "Home", url: "" },
];

/** Unlimited membership, labeled generically; the venue name is editable in the UI. */
export const MEMBERSHIP_DEFAULT = {
  label: "Sauna studio (unlimited)",
  venueName: "Perspire",
  monthlyPrice: 0,
};

/** Credit counter: counts, dates, venue name only. */
export const CREDITS_DEFAULT = {
  label: "Abbey Neuropsychology (to confirm)",
  total: 4,
};

/** HSA yearly target, editable. */
export const HSA_TARGET_DEFAULT = 3000;

export const HSA_CATEGORIES = [
  "Sauna / heat",
  "Soak / water",
  "Credits / sessions",
  "At-home gear",
  "Other",
] as const;
