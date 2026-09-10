import { n as DAY_CUTOFF_MIN, o as ROOMS, u as roomHasHeat } from "./rooms-BkkvvDBx.mjs";
import { n as format, r as addDays, t as parseISO } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-C6YUwjC7.js
function todayISO() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}
function nowMinLA() {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Los_Angeles",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(/* @__PURE__ */ new Date());
	const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
	const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
	return hour * 60 + minute;
}
function parseDate(date) {
	return parseISO(`${date}T12:00:00`);
}
function closeMin(date) {
	const day = parseDate(date).getDay();
	if (day === 5 || day === 6) return 1470;
	return 1410;
}
function isWeekend(date) {
	const day = parseDate(date).getDay();
	return day === 0 || day === 5 || day === 6;
}
function isWeekdayMorning(date, startMin) {
	const day = parseDate(date).getDay();
	return day >= 1 && day <= 4 && startMin < 840;
}
function formatTime(min) {
	const wrapped = (min % 1440 + 1440) % 1440;
	const h = Math.floor(wrapped / 60);
	const m = wrapped % 60;
	const ampm = h >= 12 ? "pm" : "am";
	return `${h % 12 === 0 ? 12 : h % 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}
function formatClock(min) {
	const wrapped = (min % 1440 + 1440) % 1440;
	const h = Math.floor(wrapped / 60);
	const m = wrapped % 60;
	const ampm = h >= 12 ? "pm" : "am";
	const hr = h % 12 === 0 ? 12 : h % 12;
	return m === 0 ? `${hr}${ampm}` : `${hr}:${m.toString().padStart(2, "0")}${ampm}`;
}
function formatRange(startMin, durationMin) {
	return `${formatClock(startMin)} – ${formatClock(startMin + durationMin)}`;
}
function formatDateLabel(date) {
	return format(parseDate(date), "EEEE, MMM d");
}
function occupies(booking, slot) {
	return slot >= booking.startMin && slot < booking.startMin + booking.durationMin + 15;
}
function occupiesSoak(booking, slot) {
	return slot >= booking.startMin && slot < booking.startMin + booking.durationMin;
}
function occupiesBuffer(booking, slot) {
	return slot >= booking.startMin + booking.durationMin && slot < booking.startMin + booking.durationMin + 15;
}
function slotsCovered(startMin, durationMin, includeBuffer) {
	const end = startMin + durationMin + (includeBuffer ? 15 : 0);
	const slots = [];
	for (let t = startMin; t < end; t += 15) slots.push(t);
	return slots;
}
function bookingsOn(bookings, date) {
	return bookings.filter((b) => b.date === date);
}
function occupancyAt(bookings, date, slot) {
	return bookingsOn(bookings, date).filter((b) => occupies(b, slot)).length;
}
function hourOccupancy(bookings, date, hour) {
	const slots = [
		0,
		15,
		30,
		45
	].map((m) => hour * 60 + m);
	return slots.reduce((n, s) => n + occupancyAt(bookings, date, s), 0) / slots.length;
}
function blockReason(bookings, date, roomId, startMin, durationMin) {
	const close = closeMin(date);
	if (startMin < 510 || startMin + durationMin > close) return "closed";
	if (date === todayISO()) {
		if (startMin < Math.ceil(nowMinLA() / 15) * 15) return "past";
	}
	const slots = slotsCovered(startMin, durationMin, true);
	const day = bookingsOn(bookings, date);
	for (const slot of slots) if (occupancyAt(day, date, slot) >= 6) return "staff";
	const conflict = day.find((b) => b.roomId === roomId && slots.some((s) => occupies(b, s)));
	if (conflict) {
		const hitsBuffer = slots.some((s) => occupiesBuffer(conflict, s));
		if (slots.some((s) => occupiesSoak(conflict, s))) return "room";
		if (hitsBuffer) return "buffer";
		return "room";
	}
	return "ok";
}
function canBook(bookings, date, roomId, startMin, durationMin) {
	return blockReason(bookings, date, roomId, startMin, durationMin) === "ok";
}
function reasonCopy(reason) {
	switch (reason) {
		case "past": return "That time already passed.";
		case "closed": return "Past closing.";
		case "room": return "Reserved.";
		case "buffer": return "15-minute turn after the last visit.";
		case "staff": return "All we can take at this hour.";
		default: return "";
	}
}
function availableRooms(bookings, date, startMin, durationMin) {
	return ROOMS.filter((room) => canBook(bookings, date, room.id, startMin, durationMin));
}
function isSlowWindow(bookings, date, startMin) {
	if (isWeekdayMorning(date, startMin)) return true;
	return occupancyAt(bookings, date, startMin) <= 2;
}
function maxDurationAt(bookings, date, startMin) {
	return isSlowWindow(bookings, date, startMin) ? 180 : 120;
}
function rateAt(min, withSauna) {
	if (min >= 1060) return withSauna ? 28 : 23;
	return withSauna ? 23 : 18;
}
function quotePrice(opts) {
	const { startMin, durationMin, guests, withSauna } = opts;
	let total = 0;
	let dayHours = 0;
	let eveningHours = 0;
	for (let t = startMin; t < startMin + durationMin; t += 15) {
		const hours = 15 / 60;
		total += rateAt(t, withSauna) * hours * guests;
		if (t >= 1060) eveningHours += hours;
		else dayHours += hours;
	}
	return {
		total: Math.round(total * 100) / 100,
		hourly: rateAt(startMin, withSauna),
		isEvening: startMin >= DAY_CUTOFF_MIN,
		dayHours,
		eveningHours,
		perPersonHour: rateAt(startMin, withSauna)
	};
}
function startTimes(date, durationMin) {
	const close = closeMin(date);
	const times = [];
	for (let t = 510; t + durationMin <= close; t += 15) times.push(t);
	return times;
}
function heatmapHours(date) {
	const close = closeMin(date);
	const last = Math.min(23, Math.floor((close - 1) / 60));
	const hours = [];
	for (let h = 9; h <= last; h++) hours.push(h);
	return hours;
}
function recommendStart(bookings, date, durationMin) {
	return startTimes(date, durationMin).filter((t) => availableRooms(bookings, date, t, durationMin).length > 0).map((t) => {
		let score = 0;
		if (isWeekdayMorning(date, t)) score += 120;
		const occ = occupancyAt(bookings, date, t);
		score += (6 - occ) * 8;
		score -= Math.abs(t - 600) / 20;
		if (date === todayISO() && t < nowMinLA() + 30) score -= 50;
		return {
			t,
			score
		};
	}).sort((a, b) => b.score - a.score)[0]?.t ?? startTimes(date, durationMin)[0] ?? 510;
}
function nextDates(count = 14) {
	const start = parseISO(`${todayISO()}T12:00:00`);
	return Array.from({ length: count }, (_, i) => format(addDays(start, i), "yyyy-MM-dd"));
}
function hash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function rng(seed) {
	let s = seed;
	return () => {
		s = Math.imul(s, 1664525) + 1013904223 >>> 0;
		return s / 4294967296;
	};
}
function densityFor(date, min) {
	const weekend = isWeekend(date);
	const hour = min / 60;
	if (!weekend && hour < 12) return .16;
	if (!weekend && hour < 17) return .34;
	if (!weekend) return .68;
	if (hour < 12) return .42;
	if (hour < 17) return .62;
	return .86;
}
function pickDuration(r, date, startMin) {
	if (isWeekdayMorning(date, startMin) && r() < .35) return r() < .5 ? 120 : 180;
	const bag = [
		60,
		60,
		90,
		90,
		90,
		120
	];
	return bag[Math.floor(r() * bag.length)];
}
function generateMockBookings(dates) {
	const out = [];
	for (const date of dates) {
		const r = rng(hash(`watercourse:${date}`));
		const close = closeMin(date);
		const rooms = [...ROOMS];
		for (let i = rooms.length - 1; i > 0; i--) {
			const j = Math.floor(r() * (i + 1));
			[rooms[i], rooms[j]] = [rooms[j], rooms[i]];
		}
		for (const room of rooms) {
			let t = 510 + 15 * Math.floor(r() * 4);
			while (t + 60 + 15 <= close) {
				const p = densityFor(date, t);
				if (r() < p) {
					const durationMin = pickDuration(r, date, t);
					if (canBook(out, date, room.id, t, durationMin)) {
						const withSauna = roomHasHeat(room) && r() > .2;
						out.push({
							id: `mock-${date}-${room.id}-${t}`,
							source: "mock",
							date,
							roomId: room.id,
							startMin: t,
							durationMin,
							guests: 1 + Math.floor(r() * Math.min(room.maxGuests, 3)),
							withSauna,
							massageRequest: r() < .18,
							massageNote: "",
							memberTier: r() < .12 ? "anytime" : r() < .2 ? "weekday" : "none",
							paidVia: r() < .35 ? "square" : "desk",
							lateMinutes: r() < .1 ? 15 : 0
						});
						t += durationMin + 15;
						t += 15 * Math.floor(r() * 3);
						continue;
					}
				}
				t += 15 * (r() < .5 ? 2 : 4);
			}
		}
	}
	return out;
}
//#endregion
export { startTimes as C, recommendStart as S, nowMinLA as _, closeMin as a, quotePrice as b, formatTime as c, hourOccupancy as d, isSlowWindow as f, nextDates as g, maxDurationAt as h, canBook as i, generateMockBookings as l, isWeekend as m, blockReason as n, formatDateLabel as o, isWeekdayMorning as p, bookingsOn as r, formatRange as s, availableRooms as t, heatmapHours as u, occupancyAt as v, todayISO as w, reasonCopy as x, parseDate as y };
