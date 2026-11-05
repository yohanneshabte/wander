export const PHONE = "<CLIENT_PHONE>";
export const PHONE_TEL = "tel:<CLIENT_PHONE>";
export const ADDRESS = "<CLIENT_ADDRESS>";
export const ADDRESS_FULL = "<CLIENT_ADDRESS>";
/** Hidden print QR target. Not linked from public nav. */
export const DEMO_URL = "https://flora-berry-ever-island.grok.me";

export const SLOT_MIN = 15;
export const BUFFER_MIN = 15;
export const OPEN_MIN = 8 * 60 + 30;
export const DAY_CUTOFF_MIN = 17 * 60 + 40;
export const MAX_CONCURRENT = 6; // 75% of 9 rooms
export const STANDARD_DURATIONS = [60, 90, 120] as const;
export const PREMIUM_DURATIONS = [150, 180] as const;
export const ALL_DURATIONS = [60, 90, 120, 150, 180] as const;
/** Arrive after start + this, soak shortens and a late fee applies. */
export const LATE_GRACE_MIN = 10;
export const LATE_FEE_USD = 15;
/** Square card-not-present (online / stored card on file). */
export const SQUARE_PERCENT = 2.9;
export const SQUARE_CENTS = 30;

export type Amenity = "sauna" | "steam" | "plunge";

export type Room = {
  id: string;
  number: number;
  name: string;
  short: string;
  blurb: string;
  amenities: Amenity[];
  maxGuests: number;
  image: string;
};

export const ROOMS: Room[] = [
  {
    id: "one-pine",
    number: 1,
    name: "One Pine",
    short: "Pine",
    blurb: "Multi-jetted wood tub, sauna & cold plunge.",
    amenities: ["sauna", "plunge"],
    maxGuests: 4,
    image: "/rooms/one-pine.jpg",
  },
  {
    id: "two-stones",
    number: 2,
    name: "Two Stones",
    short: "Stones",
    blurb: "Wood tub, sauna, and cold plunge.",
    amenities: ["sauna", "plunge"],
    maxGuests: 4,
    image: "/rooms/two-stones.jpg",
  },
  {
    id: "three-willows",
    number: 3,
    name: "Three Willows",
    short: "Willows",
    blurb: "Private hot tub with steam. Quiet solitude.",
    amenities: ["steam"],
    maxGuests: 3,
    image: "/rooms/three-willows.jpg",
  },
  {
    id: "four-lotus",
    number: 4,
    name: "Four Lotus",
    short: "Lotus",
    blurb: "Hot Tub, shower, and resting area.",
    amenities: [],
    maxGuests: 2,
    image: "/rooms/four-lotus.jpg",
  },
  {
    id: "five-reeds",
    number: 5,
    name: "Five Reeds",
    short: "Reeds",
    blurb: "Hot Tub only. A quieter room for two.",
    amenities: [],
    maxGuests: 2,
    image: "/rooms/five-reeds.jpg",
  },
  {
    id: "six-dragonflies",
    number: 6,
    name: "Six Dragonflies",
    short: "Dragons",
    blurb: "Sauna and therapeutic cold plunge.",
    amenities: ["sauna", "plunge"],
    maxGuests: 4,
    image: "/rooms/six-dragonflies.jpg",
  },
  {
    id: "seven-moon",
    number: 7,
    name: "Seven Moon",
    short: "Moon",
    blurb: "Hot tub with steam. Lantern light.",
    amenities: ["steam"],
    maxGuests: 3,
    image: "/rooms/seven-moon.jpg",
  },
  {
    id: "eight-stars",
    number: 8,
    name: "Eight Stars",
    short: "Stars",
    blurb: "Connecting rooms for groups. Sauna.",
    amenities: ["sauna"],
    maxGuests: 6,
    image: "/rooms/eight-stars.jpg",
  },
  {
    id: "nine-cedar",
    number: 9,
    name: "Nine Cedar",
    short: "Cedar",
    blurb: "Cedar hot tub, sauna, and cold plunge.",
    amenities: ["sauna", "plunge"],
    maxGuests: 4,
    image: "/rooms/nine-cedar.jpg",
  },
];

export const ROOM_BY_ID = Object.fromEntries(ROOMS.map((r) => [r.id, r]));

export function roomHasHeat(room: Room) {
  return room.amenities.includes("sauna") || room.amenities.includes("steam");
}

export function amenityLabel(room: Room) {
  if (!room.amenities.length) return "Hot Tub";
  const extras: string[] = [];
  if (room.amenities.includes("sauna")) extras.push("Sauna");
  if (room.amenities.includes("steam")) extras.push("Steam");
  if (room.amenities.includes("plunge")) extras.push("Cold Plunge");
  return `Hot Tub with ${extras.join(" · ")}`;
}
