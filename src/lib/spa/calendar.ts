import { ADDRESS_FULL } from "./rooms";
import {
  formatTime,
  type Booking,
} from "./engine";
import { ROOM_BY_ID } from "./rooms";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function localStamp(date: string, minutes: number) {
  const wrap = minutes;
  const dayOffset = Math.floor(wrap / (24 * 60));
  const min = ((wrap % (24 * 60)) + 24 * 60) % (24 * 60);
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + dayOffset, 0, 0, 0));
  const ymd = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
  const h = Math.floor(min / 60);
  const mm = min % 60;
  return `${ymd}T${pad(h)}${pad(mm)}00`;
}

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function bookingTitle(booking: Booking) {
  const room = ROOM_BY_ID[booking.roomId];
  return `${room?.name ?? "Private Hot Tub"} · Watercourse Way`;
}

export function bookingDetails(booking: Booking) {
  const bits = [
    `${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`,
    booking.withSauna ? "Hot Tub with Sauna or Steam" : "Hot Tub",
    booking.massageRequest ? "Massage requested (confirm by phone)" : null,
    "Demo reservation — real tubs are booked by calling <CLIENT_PHONE>",
  ].filter(Boolean);
  return bits.join("\n");
}

export function googleCalendarUrl(booking: Booking) {
  const start = localStamp(booking.date, booking.startMin);
  const end = localStamp(booking.date, booking.startMin + booking.durationMin);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: bookingTitle(booking),
    dates: `${start}/${end}`,
    ctz: "America/Los_Angeles",
    location: ADDRESS_FULL,
    details: bookingDetails(booking),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function vevent(booking: Booking) {
  const room = ROOM_BY_ID[booking.roomId];
  const start = localStamp(booking.date, booking.startMin);
  const end = localStamp(booking.date, booking.startMin + booking.durationMin);
  const uid = `${booking.id}@watercourseway.demo`;
  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${localStamp(booking.date, booking.startMin)}`,
    `DTSTART;TZID=America/Los_Angeles:${start}`,
    `DTEND;TZID=America/Los_Angeles:${end}`,
    `SUMMARY:${icsEscape(bookingTitle(booking))}`,
    `LOCATION:${icsEscape(ADDRESS_FULL)}`,
    `DESCRIPTION:${icsEscape(bookingDetails(booking))}`,
    room ? `CATEGORIES:${icsEscape(room.name)}` : null,
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function icsForBookings(bookings: Booking[]) {
  const events = bookings.map(vevent).join("\r\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Watercourse Way//Front Desk Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Watercourse Way Private Hot Tub Rooms",
    "X-WR-TIMEZONE:America/Los_Angeles",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, bookings: Booking[]) {
  const blob = new Blob([icsForBookings(bookings)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function formatVisitRange(booking: Booking) {
  return `${formatTime(booking.startMin)} – ${formatTime(booking.startMin + booking.durationMin)}`;
}
