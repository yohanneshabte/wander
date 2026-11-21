/** Water first, then the second modality. Soft, non-medical copy only — no detox or health claims. */
import { SECOND_MODALITY, type ModalityKey } from "./config";

export type Step = { title: string; detail: string };
export type Layer = { key: string; name: string; intro: string; steps: Step[] };

export const WATER_LAYER: Layer = {
  key: "water",
  name: "Water first",
  intro: "The base layer. Start here every session, before any heat or cold.",
  steps: [
    {
      title: "Hydration check-in",
      detail: "Have a glass of water before you go in. Bring a bottle.",
    },
    {
      title: "Warm soak or warm pool",
      detail: "Ease in with 10–15 minutes of warm water at a comfortable temperature.",
    },
    { title: "Mid-session sip", detail: "Step out, sit, and sip water between rounds." },
    {
      title: "Closing check-in",
      detail: "Another glass of water and a few quiet minutes before you leave.",
    },
  ],
};

export const MODALITIES: Record<ModalityKey, Layer> = {
  contrast: {
    key: "contrast",
    name: "Contrast (hot and cold)",
    intro:
      "Alternate warm and cool on top of the water layer. Go gently and stop whenever you like.",
    steps: [
      { title: "Warm round", detail: "Sauna or warm soak, well inside the time cap below." },
      { title: "Cool round", detail: "A cool shower or short, comfortable cold plunge. Ease in." },
      { title: "Rest", detail: "Sit for a few minutes and sip water." },
      {
        title: "Repeat or finish",
        detail: "Two or three rounds is plenty. End on whatever feels comfortable.",
      },
    ],
  },
  cold_plunge: {
    key: "cold_plunge",
    name: "Cold plunge",
    intro: "A short, cool dip after the water layer.",
    steps: [
      { title: "Ease in", detail: "Lower in slowly and keep it brief." },
      { title: "Warm back up", detail: "Towel off, dress warmly, sip water." },
    ],
  },
  steam: {
    key: "steam",
    name: "Steam",
    intro: "A gentle steam round after the water layer.",
    steps: [
      {
        title: "Short round",
        detail: "Sit low where it is cooler; stay well inside the time cap.",
      },
      { title: "Cool down", detail: "Cool shower, then rest and sip water." },
    ],
  },
};

export const SECOND_LAYER: Layer = MODALITIES[SECOND_MODALITY];

/** Gentle heat ladder: start low, step up slowly. °F. */
export const HEAT_LADDER = [
  { stage: "Start", range: "120–130°F", minutes: "10–15 min" },
  { stage: "Settle", range: "130–140°F", minutes: "15 min" },
  { stage: "Comfortable max", range: "140–150°F", minutes: "up to 20 min" },
];

export const HEAT_CAP_MIN = 20;

export const GUARDRAILS = [
  `Keep any single heat round to ${HEAT_CAP_MIN} minutes or less.`,
  "Always cool down after heat — shower, shade, and water.",
  "Build in rest days between heat days.",
  "Step up the ladder slowly; there is no rush to go hotter.",
  "If anything feels off, stop and cool down.",
];

/** At-home kit: the user's existing infrared panels. Small-area routine. */
export const HOME_KIT = {
  items: [
    { name: "Infrared back pad", model: "Model TBD (placeholder)" },
    { name: "Glove applicators (to confirm)", model: "Model TBD" },
  ],
  routine: [
    "One area at a time.",
    "Lowest setting.",
    "Short timer — set it before you start.",
    "Skin check after: if it looks or feels too warm, stop.",
  ],
  notice: "Never sleep on a pad.",
  manualFirst: "The device manual comes first. Follow it over anything here.",
};
