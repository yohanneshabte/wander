/**
 * House seed: Watercourse (phone bathhouse) + SoliVana (online control).
 * Not affiliated — modeled from public pages for the pitch.
 */
import type { HouseCatalog, Membership, Resource, Service, Site } from "./types";

function site(partial: Site): Site {
  return partial;
}

function res(
  siteId: string,
  n: number,
  id: string,
  name: string,
  short: string,
  blurb: string,
  amenities: string[],
  capacity: number,
  kind = "room",
): Resource {
  return {
    id,
    siteId,
    name,
    short,
    blurb,
    kind,
    amenities,
    capacity,
    sort: n,
  };
}

function svc(
  siteId: string,
  categoryKey: string,
  n: number,
  name: string,
  durationMin: number,
  prices: {
    weekday?: number;
    weekend?: number;
    evening?: number;
    list?: number;
  },
  blurb: string,
  opts: Partial<Service> = {},
): Service {
  return {
    id: `${siteId}-${categoryKey}-${n}`,
    siteId,
    categoryKey,
    name,
    durationMin,
    blurb,
    weekdayPrice: prices.weekday ?? null,
    weekendPrice: prices.weekend ?? null,
    eveningPrice: prices.evening ?? null,
    listPrice: prices.list ?? prices.weekday ?? prices.weekend ?? null,
    perPerson: opts.perPerson ?? false,
    kind: opts.kind ?? "appointment",
    source: opts.source ?? "",
    sort: n,
  };
}

function mem(
  siteId: string,
  n: number,
  name: string,
  priceMonth: number,
  credits: string,
  blurb: string,
): Membership {
  return {
    id: `${siteId}-m${n}`,
    siteId,
    name,
    priceMonth,
    credits,
    blurb,
    sort: n,
  };
}

const watercourse: HouseCatalog = {
  site: site({
    id: "watercourse",
    slug: "watercourse",
    name: "Watercourse Way",
    tagline: "A journey for the spirit, a respite for the body",
    city: "Palo Alto",
    address: "165 Channing Avenue, Palo Alto, CA 94301",
    phone: "650-462-2000",
    website: "https://watercourseway.com",
    hoursNote: "Sun–Thu 8am–11:30pm · Fri–Sat 8am–12:30am",
    openMin: 8 * 60 + 30,
    closeMin: 23 * 60 + 30,
    dayCutoffMin: 17 * 60 + 40,
    bufferMin: 15,
    maxConcurrent: 6,
    theme: "cream",
    bookingNote:
      "Private Hot Tub Rooms are still booked by calling 650-462-2000. Massage and facials also sit on Booker.",
    pitch: "Book the room on your phone instead of waiting 30 minutes at the desk.",
  }),
  resources: [
    res("watercourse", 1, "one-pine", "One Pine", "Pine", "Multi-jetted wood tub, sauna & cold plunge.", ["sauna", "plunge"], 4),
    res("watercourse", 2, "two-stones", "Two Stones", "Stones", "Wood tub, sauna, and cold plunge.", ["sauna", "plunge"], 4),
    res("watercourse", 3, "three-willows", "Three Willows", "Willows", "Private hot tub with steam.", ["steam"], 3),
    res("watercourse", 4, "four-lotus", "Four Lotus", "Lotus", "Hot tub, shower, and resting area.", [], 2),
    res("watercourse", 5, "five-reeds", "Five Reeds", "Reeds", "Hot tub only. Quieter room for two.", [], 2),
    res("watercourse", 6, "six-dragonflies", "Six Dragonflies", "Dragons", "Sauna and therapeutic cold plunge.", ["sauna", "plunge"], 4),
    res("watercourse", 7, "seven-moon", "Seven Moon", "Moon", "Hot tub with steam. Lantern light.", ["steam"], 3),
    res("watercourse", 8, "eight-stars", "Eight Stars", "Stars", "Connecting rooms for groups. Sauna.", ["sauna"], 6),
    res("watercourse", 9, "nine-cedar", "Nine Cedar", "Cedar", "Cedar hot tub, sauna, and cold plunge.", ["sauna", "plunge"], 4),
  ],
  categories: [
    { id: "wc-rooms", siteId: "watercourse", key: "rooms", name: "Private Hot Tub Rooms", blurb: "Nine rooms. Day and evening rates per person, per hour.", sort: 1 },
    { id: "wc-massage", siteId: "watercourse", key: "massage", name: "Massage", blurb: "Swedish, deep tissue, prenatal. Booker or phone.", sort: 2 },
    { id: "wc-facial", siteId: "watercourse", key: "facial", name: "Facial", blurb: "Skin rituals. 48-hour cancel.", sort: 3 },
    { id: "wc-spa", siteId: "watercourse", key: "spa", name: "Spa treatments", blurb: "Wraps, scrubs, breathing-room rituals.", sort: 4 },
    { id: "wc-packages", siteId: "watercourse", key: "packages", name: "Tub + massage", blurb: "Soak then table. Phone hold.", sort: 5 },
    { id: "wc-membership", siteId: "watercourse", key: "membership", name: "Circle", blurb: "Hours on file, extra at member rate.", sort: 6 },
  ],
  services: [
    svc("watercourse", "rooms", 1, "Day Hot Tub", 60, { weekday: 18, evening: 23 }, "Before 5:40pm. Per person, per hour.", { kind: "resource", perPerson: true, source: "watercourseway.com/tub-rates" }),
    svc("watercourse", "rooms", 2, "Day Hot Tub with Sauna or Steam", 60, { weekday: 23, evening: 28 }, "Premium rooms. Per person, per hour.", { kind: "resource", perPerson: true, source: "watercourseway.com/tub-rates" }),
    svc("watercourse", "rooms", 3, "Evening Hot Tub", 60, { list: 23, evening: 23 }, "After 5:40pm. Per person, per hour.", { kind: "resource", perPerson: true, source: "watercourseway.com/tub-rates" }),
    svc("watercourse", "rooms", 4, "Evening Hot Tub with Sauna or Steam", 60, { list: 28, evening: 28 }, "After 5:40pm, premium rooms.", { kind: "resource", perPerson: true, source: "watercourseway.com/tub-rates" }),
    svc("watercourse", "massage", 1, "Swedish 60", 60, { weekday: 163, weekend: 175 }, "Full-hour Swedish with stones and warm towels.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 2, "Swedish 90", 90, { weekday: 244, weekend: 262 }, "90-minute Swedish.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 3, "Swedish 120", 120, { weekday: 326, weekend: 350 }, "Two-hour Swedish.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 4, "Deep Tissue 60", 60, { weekday: 175, weekend: 190 }, "Targeted deep muscle therapy.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 5, "Deep Tissue 90", 90, { weekday: 262, weekend: 285 }, "90-minute deep tissue.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 6, "Prenatal 60", 60, { weekday: 175, weekend: 190 }, "Prenatal table work.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 7, "Prenatal 90", 90, { weekday: 262, weekend: 285 }, "90-minute prenatal.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "massage", 8, "Aromatherapy add-on", 0, { list: 10 }, "Pure essential oils on any massage.", { kind: "addon", source: "watercourseway.com/massage" }),
    svc("watercourse", "facial", 1, "Facial Infusion Skin Ritual", 60, { list: 290 }, "60-minute infusion facial.", { source: "watercourseway.com/facial-infusion-skin-ritual" }),
    svc("watercourse", "spa", 1, "Relax & Refresh", 60, { list: 200 }, "Face and foot treatment, 60 min.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "spa", 2, "Dry brush and massage", 60, { weekday: 158, weekend: 163 }, "Circulation brush then massage.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "spa", 3, "Body wrap and massage", 60, { weekday: 168, weekend: 173 }, "Soothing wrap then massage.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "spa", 4, "Body scrub and massage", 60, { weekday: 168, weekend: 173 }, "Purifying scrub then massage.", { source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "spa", 5, "Soothing Savannah Honey", 90, { list: 275 }, "90-minute honey treatment.", { source: "watercourseway.com/rates" }),
    svc("watercourse", "spa", 6, "Champagne Chocolate", 90, { list: 280 }, "90-minute chocolate treatment.", { source: "watercourseway.com/rates" }),
    svc("watercourse", "packages", 1, "Tub + Swedish, day", 120, { weekday: 198, weekend: 215 }, "1 hour tub then 1 hour Swedish.", { kind: "package", source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "packages", 2, "Premium tub + Swedish, day", 120, { weekday: 216, weekend: 235 }, "Tub with sauna/steam then Swedish.", { kind: "package", source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "packages", 3, "Tub + deep tissue, day", 120, { weekday: 210, weekend: 230 }, "1 hour tub then deep tissue.", { kind: "package", source: "watercourseway.com/massage/rates" }),
    svc("watercourse", "packages", 4, "Premium tub + deep tissue, day", 120, { weekday: 228, weekend: 250 }, "Premium tub then deep tissue.", { kind: "package", source: "watercourseway.com/massage/rates" }),
  ],
  memberships: [
    mem("watercourse", 1, "Weekday Soak", 99, "4 day hours", "Fills quiet weekday mornings. Extra hours at member rate."),
    mem("watercourse", 2, "Anytime Soak", 159, "8 hours any day", "Evenings included. One late-fee waiver a month."),
    mem("watercourse", 3, "House Circle", 199, "Unlimited weekday day", "Four evening hours, late fee waived, first hold."),
  ],
};

const solivana: HouseCatalog = {
  site: site({
    id: "solivana",
    slug: "solivana",
    name: "SoliVana Wellness",
    tagline: "Where Silicon Valley comes to reset",
    city: "Redwood City",
    address: "1922 El Camino Real, Redwood City, CA 94063",
    phone: "650-564-4325",
    website: "https://solivana.com",
    hoursNote: "Daily 11am–8pm",
    openMin: 11 * 60,
    closeMin: 20 * 60,
    dayCutoffMin: 17 * 60,
    bufferMin: 15,
    maxConcurrent: 7,
    theme: "lab",
    bookingNote:
      "They book at solivanaspa.floathelm.com today. This demo holds a suite on the phone — no real payment.",
    pitch: "Nine private suites. Sixteen therapies. Book the reset without the phone tag.",
  }),
  resources: [
    res("solivana", 1, "sv-float-a", "REST Float A", "Float A", "Zero-gravity tank. 1,100 lbs Epsom salt.", ["float"], 1, "tank"),
    res("solivana", 2, "sv-float-b", "REST Float B", "Float B", "Second private float suite.", ["float"], 1, "tank"),
    res("solivana", 3, "sv-fi-small", "Fire & Ice Small", "F&I S", "Infrared sauna + cold plunge. 1–2 people.", ["sauna", "plunge"], 2, "suite"),
    res("solivana", 4, "sv-fi-large", "Fire & Ice Large", "F&I L", "Contrast suite for up to four, same party.", ["sauna", "plunge"], 4, "suite"),
    res("solivana", 5, "sv-salt", "Salt Room", "Halo", "Halotherapy. Dry salt air.", ["salt"], 4, "suite"),
    res("solivana", 6, "sv-presso", "Pressotherapy", "Presso", "Lymphatic compression suit.", [], 1, "table"),
    res("solivana", 7, "sv-pemf", "PEMF / Red Light", "PEMF", "Cellular recovery bay.", ["light"], 1, "bay"),
    res("solivana", 8, "sv-vizr", "NeuroVIZR", "Vizr", "Light and sound brain reset.", [], 2, "bay"),
    res("solivana", 9, "sv-scan", "Scan & Bioenergetics", "Scan", "Body composition and NES scan.", [], 1, "bay"),
  ],
  categories: [
    { id: "sv-core", siteId: "solivana", key: "core", name: "Core reset", blurb: "Float, Fire & Ice, Pressotherapy.", sort: 1 },
    { id: "sv-signature", siteId: "solivana", key: "signature", name: "Signature", blurb: "Halo, PEMF, red light, NeuroVIZR.", sort: 2 },
    { id: "sv-scan", siteId: "solivana", key: "scan", name: "Scans", blurb: "Non-medical educational assessments.", sort: 3 },
    { id: "sv-packages", siteId: "solivana", key: "packages", name: "Packs", blurb: "Sampler, 5-packs, couples.", sort: 4 },
    { id: "sv-group", siteId: "solivana", key: "group", name: "Groups", blurb: "Half-day reset and corporate.", sort: 5 },
    { id: "sv-membership", siteId: "solivana", key: "membership", name: "Clubs", blurb: "Monthly credits, mix and match.", sort: 6 },
  ],
  services: [
    svc("solivana", "core", 1, "Mini Float", 45, { list: 110 }, "Shorter introduction to floating.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 2, "Regular Float", 60, { list: 130 }, "Standard 60-minute REST float.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 3, "Long Float", 90, { list: 210 }, "Ninety minutes. Rare and deep.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 4, "Fire & Ice Small · 1p · 45", 45, { list: 115 }, "Infrared + plunge, one person.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 5, "Fire & Ice Small · 1p · 60", 60, { list: 130 }, "Standard contrast, one person.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 6, "Fire & Ice Small · 1p · 90", 90, { list: 190 }, "Long contrast, one person.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 7, "Fire & Ice Small · 2p · 60", 60, { list: 160 }, "Small suite for two.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 8, "Fire & Ice Large · 1p · 60", 60, { list: 160 }, "Large suite, one person.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 9, "Fire & Ice Large · 2p · 60", 60, { list: 180 }, "Large suite for two.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 10, "Fire & Ice Large · 4p · 60", 60, { list: 190 }, "Large suite, same party up to four.", { kind: "resource", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "core", 11, "Pressotherapy", 60, { list: 155 }, "Lymphatic compression. Full-body.", { kind: "appointment", source: "solivana.com/half-day-reset" }),
    svc("solivana", "core", 12, "First Core visit", 60, { list: 99 }, "New-client Core at $99 (reg. $130).", { source: "solivana.com" }),
    svc("solivana", "signature", 1, "Halotherapy", 60, { list: 75 }, "30 min salt + 30 min lounge.", { kind: "resource", source: "solivanalab.com/experiences/halotherapy" }),
    svc("solivana", "signature", 2, "PEMF Therapy", 20, { list: 75 }, "Pulsed electromagnetic field, 20 min.", { source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "signature", 3, "EMTT", 20, { list: 75 }, "High-frequency pulsed magnetic therapy.", { source: "solivana.com/emtt-2" }),
    svc("solivana", "signature", 4, "NeuroVIZR Brain Reset", 30, { list: 65 }, "Light and sound cognitive reset.", { source: "solivana.com/pricing/packages" }),
    svc("solivana", "signature", 5, "Red Light", 20, { list: 65 }, "Cellular recovery light bay.", { source: "solivana.com/pricing/packages" }),
    svc("solivana", "scan", 1, "Body Composition Scan", 20, { list: 65 }, "Non-medical educational scan.", { source: "solivana.com/half-day-reset" }),
    svc("solivana", "scan", 2, "Bioenergetics Assessment", 45, { list: 130 }, "NES scan plus on-site support.", { source: "solivana.com/bioenergetics" }),
    svc("solivana", "packages", 1, "SoliVana Sampler", 240, { list: 390 }, "Float + Halo + Fire & Ice + Pressotherapy. $520 value.", { kind: "package", source: "solivana.com/pricing/a-la-carte" }),
    svc("solivana", "packages", 2, "Core 5-pack", 300, { list: 575 }, "Five 60-min core sessions. $115 each.", { kind: "package", source: "solivana.com/pricing/packages" }),
    svc("solivana", "packages", 3, "Signature 5-pack", 150, { list: 325 }, "Halo, red light, PEMF, or NeuroVIZR.", { kind: "package", source: "solivana.com/pricing/packages" }),
    svc("solivana", "packages", 4, "Escape for Two", 300, { list: 525 }, "2 float, 1 Fire & Ice for two, 2 halo.", { kind: "package", source: "solivana.com/pricing/packages" }),
    svc("solivana", "packages", 5, "Fire & Ice for Two · 5-pack", 300, { list: 625 }, "$125 per 60-min suite for two.", { kind: "package", source: "solivana.com/pricing/packages" }),
    svc("solivana", "packages", 6, "Sleep Liberation", 600, { list: 920 }, "10 sessions / 4 weeks. Float, presso, PEMF, NeuroVIZR.", { kind: "package", source: "solivana.com/pricing/packages" }),
    svc("solivana", "group", 1, "Half-day Float & Restore", 210, { list: 499 }, "Per person, 4–6 people, 3.5 hrs.", { kind: "group", perPerson: true, source: "solivana.com/half-day-reset" }),
    svc("solivana", "group", 2, "Half-day Fire & Reset", 180, { list: 499 }, "Per person, 4–6 people, 3 hrs.", { kind: "group", perPerson: true, source: "solivana.com/half-day-reset" }),
    svc("solivana", "group", 3, "Corporate on-site day", 360, { list: 3500 }, "Starting at $3,500. Five stations.", { kind: "group", source: "solivanalab.com/corporate-wellness" }),
  ],
  memberships: [
    mem("solivana", 1, "Inner Circle", 99, "1 core / month", "Float, Fire & Ice, or Pressotherapy. 3-month minimum. $130 value."),
    mem("solivana", 2, "Club 2", 239, "2 core / month", "Mix and match 60-min core therapies."),
    mem("solivana", 3, "Club 3", 239, "1 core + 2 signature + scan", "Monthly reset with progress scan."),
    mem("solivana", 4, "Club 5", 379, "2 core + 3 signature", "Lifestyle cadence. Mix and match."),
    mem("solivana", 5, "Club 8", 749, "4 core + 4 signature + scans", "Full protocol. Bioenergetics included."),
  ],
};

export const HOUSES: HouseCatalog[] = [watercourse, solivana];
export const HOUSE_BY_ID = Object.fromEntries(HOUSES.map((h) => [h.site.id, h]));

export const DEFAULT_SETTINGS = {
  liveSiteId: "watercourse",
  previewSiteId: null as string | null,
  demoMode: true,
  discoveryMode: true,
  houseVoice: true,
  directoryUnlocked: false,
};
