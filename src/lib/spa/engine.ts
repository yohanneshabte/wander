import { addDays, format, parseISO } from "date-fns";
import {
  BUFFER_MIN,
  DAY_CUTOFF_MIN,
  MAX_CONCURRENT,
  OPEN_MIN,
  ROOMS,
  SLOT_MIN,
  roomHasHeat,
  type Room,
} from "./rooms";
import type { MemberTierId, PaidVia } from "./membership";

export type Booking = {
  id: string;
  source: "mock" | "guest";
  date: string;
  roomId: string;
  startMin: number;
  durationMin: number;
  guests: number;
  withSauna: boolean;
  massageRequest: boolean;
  massageNote: string;
  memberTier: MemberTierId;
  paidVia: PaidVia;
  lateMinutes: number;
};

export function todayISO() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });
}

export function nowMinLA() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function parseDate(date: string) {
  return parseISO(`${date}T12:00:00`);
}

export function closeMin(date: string) {
  const day = parseDate(date).getDay();
  if (day === 5 || day === 6) return 24 * 60 + 30;
  return 23 * 60 + 30;
}

export function isWeekend(date: string) {
  const day = parseDate(date).getDay();
  return day === 0 || day === 5 || day === 6;
}

export function isWeekdayMorning(date: string, startMin: number) {
  const day = parseDate(date).getDay();
  return day >= 1 && day <= 4 && startMin < 14 * 60;
}

export function formatTime(min: number) {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatClock(min: number) {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hr}${ampm}` : `${hr}:${m.toString().padStart(2, "0")}${ampm}`;
}

export function formatRange(startMin: number, durationMin: number) {
  return `${formatClock(startMin)} – ${formatClock(startMin + durationMin)}`;
}

export function formatDateLabel(date: string) {
  return format(parseDate(date), "EEEE, MMM d");
}

export function occupies(booking: Booking, slot: number) {
  return (
    slot >= booking.startMin &&
    slot < booking.startMin + booking.durationMin + BUFFER_MIN
  );
}

export function occupiesSoak(booking: Booking, slot: number) {
  return (
    slot >= booking.startMin && slot < booking.startMin + booking.durationMin
  );
}

export function occupiesBuffer(booking: Booking, slot: number) {
  return (
    slot >= booking.startMin + booking.durationMin &&
    slot < booking.startMin + booking.durationMin + BUFFER_MIN
  );
}

export function slotsCovered(
  startMin: number,
  durationMin: number,
  includeBuffer: boolean,
) {
  const end = startMin + durationMin + (includeBuffer ? BUFFER_MIN : 0);
  const slots: number[] = [];
  for (let t = startMin; t < end; t += SLOT_MIN) slots.push(t);
  return slots;
}

export function bookingsOn(bookings: Booking[], date: string) {
  return bookings.filter((b) => b.date === date);
}

export function occupancyAt(bookings: Booking[], date: string, slot: number) {
  return bookingsOn(bookings, date).filter((b) => occupies(b, slot)).length;
}

export function hourOccupancy(bookings: Booking[], date: string, hour: number) {
  const slots = [0, 15, 30, 45].map((m) => hour * 60 + m);
  const sum = slots.reduce((n, s) => n + occupancyAt(bookings, date, s), 0);
  return sum / slots.length;
}

export type BlockReason =
  | "past"
  | "closed"
  | "room"
  | "buffer"
  | "staff"
  | "ok";

export function blockReason(
  bookings: Booking[],
  date: string,
  roomId: string,
  startMin: number,
  durationMin: number,
): BlockReason {
  const close = closeMin(date);
  if (startMin < OPEN_MIN || startMin + durationMin > close) return "closed";
  if (date === todayISO()) {
    const soon = Math.ceil(nowMinLA() / SLOT_MIN) * SLOT_MIN;
    if (startMin < soon) return "past";
  }
  const slots = slotsCovered(startMin, durationMin, true);
  const day = bookingsOn(bookings, date);
  for (const slot of slots) {
    if (occupancyAt(day, date, slot) >= MAX_CONCURRENT) return "staff";
  }
  const conflict = day.find(
    (b) =>
      b.roomId === roomId &&
      slots.some((s) => occupies(b, s)),
  );
  if (conflict) {
    const hitsBuffer = slots.some((s) => occupiesBuffer(conflict, s));
    const hitsSoak = slots.some((s) => occupiesSoak(conflict, s));
    if (hitsSoak) return "room";
    if (hitsBuffer) return "buffer";
    return "room";
  }
  return "ok";
}

export function canBook(
  bookings: Booking[],
  date: string,
  roomId: string,
  startMin: number,
  durationMin: number,
) {
  return blockReason(bookings, date, roomId, startMin, durationMin) === "ok";
}

export function reasonCopy(reason: BlockReason) {
  switch (reason) {
    case "past":
      return "That time already passed.";
    case "closed":
      return "Past closing.";
    case "room":
      return "Reserved.";
    case "buffer":
      return "15-minute turn after the last visit.";
    case "staff":
      return "All we can take at this hour.";
    default:
      return "";
  }
}

export function availableRooms(
  bookings: Booking[],
  date: string,
  startMin: number,
  durationMin: number,
) {
  return ROOMS.filter((room) =>
    canBook(bookings, date, room.id, startMin, durationMin),
  );
}

export function isSlowWindow(
  bookings: Booking[],
  date: string,
  startMin: number,
) {
  if (isWeekdayMorning(date, startMin)) return true;
  return occupancyAt(bookings, date, startMin) <= 2;
}

export function maxDurationAt(
  bookings: Booking[],
  date: string,
  startMin: number,
) {
  return isSlowWindow(bookings, date, startMin) ? 180 : 120;
}

export function rateAt(min: number, withSauna: boolean) {
  const evening = min >= DAY_CUTOFF_MIN;
  if (evening) return withSauna ? 28 : 23;
  return withSauna ? 23 : 18;
}

export function quotePrice(opts: {
  startMin: number;
  durationMin: number;
  guests: number;
  withSauna: boolean;
}) {
  const { startMin, durationMin, guests, withSauna } = opts;
  let total = 0;
  let dayHours = 0;
  let eveningHours = 0;
  for (let t = startMin; t < startMin + durationMin; t += SLOT_MIN) {
    const hours = SLOT_MIN / 60;
    total += rateAt(t, withSauna) * hours * guests;
    if (t >= DAY_CUTOFF_MIN) eveningHours += hours;
    else dayHours += hours;
  }
  return {
    total: Math.round(total * 100) / 100,
    hourly: rateAt(startMin, withSauna),
    isEvening: startMin >= DAY_CUTOFF_MIN,
    dayHours,
    eveningHours,
    perPersonHour: rateAt(startMin, withSauna),
  };
}

export function startTimes(date: string, durationMin: number) {
  const close = closeMin(date);
  const times: number[] = [];
  for (let t = OPEN_MIN; t + durationMin <= close; t += SLOT_MIN) {
    times.push(t);
  }
  return times;
}

export function heatmapHours(date: string) {
  const close = closeMin(date);
  const last = Math.min(23, Math.floor((close - 1) / 60));
  const hours: number[] = [];
  for (let h = 9; h <= last; h++) hours.push(h);
  return hours;
}

export function recommendStart(
  bookings: Booking[],
  date: string,
  durationMin: number,
) {
  const scored = startTimes(date, durationMin)
    .filter((t) => availableRooms(bookings, date, t, durationMin).length > 0)
    .map((t) => {
      let score = 0;
      if (isWeekdayMorning(date, t)) score += 120;
      const occ = occupancyAt(bookings, date, t);
      score += (MAX_CONCURRENT - occ) * 8;
      score -= Math.abs(t - 10 * 60) / 20;
      if (date === todayISO() && t < nowMinLA() + 30) score -= 50;
      return { t, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.t ?? startTimes(date, durationMin)[0] ?? OPEN_MIN;
}

export function nextDates(count = 14) {
  const start = parseISO(`${todayISO()}T12:00:00`);
  return Array.from({ length: count }, (_, i) =>
    format(addDays(start, i), "yyyy-MM-dd"),
  );
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function densityFor(date: string, min: number) {
  const weekend = isWeekend(date);
  const hour = min / 60;
  if (!weekend && hour < 12) return 0.16;
  if (!weekend && hour < 17) return 0.34;
  if (!weekend) return 0.68;
  if (hour < 12) return 0.42;
  if (hour < 17) return 0.62;
  return 0.86;
}

function pickDuration(r: () => number, date: string, startMin: number) {
  if (isWeekdayMorning(date, startMin) && r() < 0.35) {
    return r() < 0.5 ? 120 : 180;
  }
  const bag = [60, 60, 90, 90, 90, 120];
  return bag[Math.floor(r() * bag.length)]!;
}

export function generateMockBookings(dates: string[]): Booking[] {
  const out: Booking[] = [];
  for (const date of dates) {
    const r = rng(hash(`watercourse:${date}`));
    const close = closeMin(date);
    const rooms = [...ROOMS];
    for (let i = rooms.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [rooms[i], rooms[j]] = [rooms[j]!, rooms[i]!];
    }
    for (const room of rooms) {
      let t = OPEN_MIN + SLOT_MIN * Math.floor(r() * 4);
      while (t + 60 + BUFFER_MIN <= close) {
        const p = densityFor(date, t);
        if (r() < p) {
          const durationMin = pickDuration(r, date, t);
          if (canBook(out, date, room.id, t, durationMin)) {
            const withSauna = roomHasHeat(room) && r() > 0.2;
            out.push({
              id: `mock-${date}-${room.id}-${t}`,
              source: "mock",
              date,
              roomId: room.id,
              startMin: t,
              durationMin,
              guests: 1 + Math.floor(r() * Math.min(room.maxGuests, 3)),
              withSauna,
              massageRequest: r() < 0.18,
              massageNote: "",
              memberTier:
                r() < 0.12 ? "anytime" : r() < 0.2 ? "weekday" : "none",
              paidVia: r() < 0.35 ? "square" : "desk",
              lateMinutes: r() < 0.1 ? 15 : 0,
            });
            t += durationMin + BUFFER_MIN;
            t += SLOT_MIN * Math.floor(r() * 3);
            continue;
          }
        }
        t += SLOT_MIN * (r() < 0.5 ? 2 : 4);
      }
    }
  }
  return out;
}

export function heatTone(occ: number) {
  if (occ >= 5.5) return "full";
  if (occ >= 4) return "busy";
  if (occ >= 2.5) return "mid";
  if (occ >= 1) return "open";
  return "empty";
}

export function suggestedCopy(date: string, startMin: number, occ: number) {
  if (isWeekdayMorning(date, startMin)) {
    return "Weekday morning — fill this first.";
  }
  if (occ >= 5) return "Evening rush. Staff cap is in play.";
  if (isWeekend(date)) return "Weekend. Expect a wait at the desk.";
  return "Quiet enough for a longer soak.";
}

export function roomFor(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
