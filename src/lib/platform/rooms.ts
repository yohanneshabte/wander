import type { Amenity, Room } from "@/lib/spa/rooms";
import type { HouseCatalog, Resource } from "./types";

const WCW_IMAGES = [
  "one-pine",
  "two-stones",
  "three-willows",
  "four-lotus",
  "five-reeds",
  "six-dragonflies",
  "seven-moon",
  "eight-stars",
  "nine-cedar",
];

function amenitiesOf(r: Resource): Amenity[] {
  return r.amenities.filter(
    (a): a is Amenity => a === "sauna" || a === "steam" || a === "plunge",
  );
}

export function roomsOf(house: HouseCatalog): Room[] {
  return house.resources.map((r, i) => ({
    id: r.id,
    number: i + 1,
    name: r.name,
    short: r.short,
    blurb: r.blurb,
    amenities: amenitiesOf(r),
    maxGuests: r.capacity,
    image:
      house.site.id === "watercourse" && WCW_IMAGES[i]
        ? `/rooms/${WCW_IMAGES[i]}.jpg`
        : "",
  }));
}

export function displayPrice(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}
