import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as ROOMS, s as ROOM_BY_ID, t as ADDRESS_FULL } from "./rooms-BkkvvDBx.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { _ as nowMinLA, a as closeMin, c as formatTime, g as nextDates, o as formatDateLabel, r as bookingsOn, v as occupancyAt, w as todayISO, y as parseDate } from "./engine-C6YUwjC7.mjs";
import { C as ChevronRight, O as CalendarPlus, t as X, w as ChevronLeft, x as Download } from "../_libs/lucide-react.mjs";
import { l as markLate, m as useStaffBookings } from "./router-Dx54FkoQ.mjs";
import { n as cn, r as formatMoney, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as RoleGate } from "./role-gate-B8D6wAih.mjs";
import { a as priceVisit, c as tierById, i as lateFeeFor } from "./membership-B8OO0sfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-B0yoWkwV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function pad(n) {
	return n.toString().padStart(2, "0");
}
function localStamp(date, minutes) {
	const wrap = minutes;
	const dayOffset = Math.floor(wrap / 1440);
	const min = (wrap % 1440 + 1440) % 1440;
	const [y, m, d] = date.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d + dayOffset, 0, 0, 0));
	const ymd = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
	const h = Math.floor(min / 60);
	const mm = min % 60;
	return `${ymd}T${pad(h)}${pad(mm)}00`;
}
function icsEscape(value) {
	return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function bookingTitle(booking) {
	return `${ROOM_BY_ID[booking.roomId]?.name ?? "Private Hot Tub"} · Watercourse Way`;
}
function bookingDetails(booking) {
	return [
		`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`,
		booking.withSauna ? "Hot Tub with Sauna or Steam" : "Hot Tub",
		booking.massageRequest ? "Massage requested (confirm by phone)" : null,
		"Demo reservation — real tubs are booked by calling 650-462-2000"
	].filter(Boolean).join("\n");
}
function googleCalendarUrl(booking) {
	const start = localStamp(booking.date, booking.startMin);
	const end = localStamp(booking.date, booking.startMin + booking.durationMin);
	return `https://calendar.google.com/calendar/render?${new URLSearchParams({
		action: "TEMPLATE",
		text: bookingTitle(booking),
		dates: `${start}/${end}`,
		ctz: "America/Los_Angeles",
		location: ADDRESS_FULL,
		details: bookingDetails(booking)
	}).toString()}`;
}
function vevent(booking) {
	const room = ROOM_BY_ID[booking.roomId];
	const start = localStamp(booking.date, booking.startMin);
	const end = localStamp(booking.date, booking.startMin + booking.durationMin);
	return [
		"BEGIN:VEVENT",
		`UID:${`${booking.id}@watercourseway.demo`}`,
		`DTSTAMP:${localStamp(booking.date, booking.startMin)}`,
		`DTSTART;TZID=America/Los_Angeles:${start}`,
		`DTEND;TZID=America/Los_Angeles:${end}`,
		`SUMMARY:${icsEscape(bookingTitle(booking))}`,
		`LOCATION:${icsEscape(ADDRESS_FULL)}`,
		`DESCRIPTION:${icsEscape(bookingDetails(booking))}`,
		room ? `CATEGORIES:${icsEscape(room.name)}` : null,
		"END:VEVENT"
	].filter(Boolean).join("\r\n");
}
function icsForBookings(bookings) {
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Watercourse Way//Front Desk Demo//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"X-WR-CALNAME:Watercourse Way Private Hot Tub Rooms",
		"X-WR-TIMEZONE:America/Los_Angeles",
		bookings.map(vevent).join("\r\n"),
		"END:VCALENDAR"
	].join("\r\n");
}
function downloadIcs(filename, bookings) {
	const blob = new Blob([icsForBookings(bookings)], { type: "text/calendar;charset=utf-8" });
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
function formatVisitRange(booking) {
	return `${formatTime(booking.startMin)} – ${formatTime(booking.startMin + booking.durationMin)}`;
}
var DATES = nextDates(14);
var HOURS_SHOWN = 4;
var PX_PER_HOUR = 68;
function shiftDate(date, delta) {
	const idx = DATES.indexOf(date);
	return DATES[Math.max(0, Math.min(DATES.length - 1, idx + delta))] ?? date;
}
function snapHour(min) {
	return Math.floor(min / 60) * 60;
}
function StaffCalendar() {
	const all = useStaffBookings();
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [mode, setMode] = (0, import_react.useState)("floor");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [windowStart, setWindowStart] = (0, import_react.useState)(1020);
	const dayBookings = (0, import_react.useMemo)(() => bookingsOn(all, date).sort((a, b) => a.startMin - b.startMin || a.roomId.localeCompare(b.roomId)), [all, date]);
	const selected = dayBookings.find((b) => b.id === selectedId) ?? null;
	const close = closeMin(date);
	const peak = (0, import_react.useMemo)(() => {
		let best = {
			occ: 0,
			at: 510
		};
		for (let t = 510; t < close; t += 15) {
			const occ = occupancyAt(dayBookings, date, t);
			if (occ > best.occ) best = {
				occ,
				at: t
			};
		}
		return best;
	}, [
		dayBookings,
		date,
		close
	]);
	const maxStart = Math.max(480, snapHour(close) - 240);
	function pan(deltaHours) {
		setWindowStart((w) => Math.min(maxStart, Math.max(480, w + deltaHours * 60)));
		setMode("floor");
	}
	function jumpTo(min) {
		setMode("floor");
		setWindowStart(Math.min(maxStart, Math.max(480, snapHour(min))));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col pt-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Front Desk · Calendar"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2 px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Previous day",
						disabled: date === DATES[0],
						onClick: () => {
							setDate((d) => shiftDate(d, -1));
							setSelectedId(null);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl leading-tight text-wood",
							children: formatDateLabel(date)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								dayBookings.length,
								" visits · busiest ",
								formatTime(peak.at),
								" ·",
								" ",
								peak.occ,
								" of ",
								6
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Next day",
						disabled: date === DATES[DATES.length - 1],
						onClick: () => {
							setDate((d) => shiftDate(d, 1));
							setSelectedId(null);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto px-5 pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: DATES.map((d) => {
					const parsed = parseDate(d);
					const selectedDay = d === date;
					const visits = bookingsOn(all, d).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setDate(d);
							setSelectedId(null);
						},
						className: cn("snap-start flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-2.5 py-1", selectedDay ? "bg-wood text-wood-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium uppercase tracking-wide opacity-80",
								children: d === todayISO() ? "Today" : format(parsed, "EEE")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg leading-none",
								children: format(parsed, "d")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-[10px] tabular-nums opacity-70",
								children: visits
							})
						]
					}, d);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-2 gap-2 px-5",
				children: ["floor", "list"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode(key),
					className: cn("min-h-11 rounded-2xl text-sm font-medium", mode === key ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: key === "floor" ? "Floor" : "List"
				}, key))
			}),
			mode === "floor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloorGrid, {
				date,
				windowStart,
				close,
				bookings: dayBookings,
				selectedId,
				onPick: setSelectedId,
				onPan: pan,
				onJump: jumpTo,
				canPanLeft: windowStart > 480,
				canPanRight: windowStart < maxStart
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitList, {
				bookings: dayBookings,
				selectedId,
				onPick: setSelectedId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: () => downloadIcs(`watercourse-way-${date}.ics`, dayBookings),
					disabled: !dayBookings.length,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Add today to Calendar"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted",
					children: "Opens in Google Calendar or the Calendar app. Demo visits only."
				})]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingSheet, {
				booking: selected,
				onClose: () => setSelectedId(null)
			}) : null
		]
	});
}
function FloorGrid({ date, windowStart, close, bookings, selectedId, onPick, onPan, onJump, canPanLeft, canPanRight }) {
	const windowEnd = windowStart + 240;
	const boardWidth = 272;
	const hours = [];
	for (let h = 0; h < HOURS_SHOWN; h++) hours.push(windowStart / 60 + h);
	const now = nowMinLA();
	const showNow = date === todayISO() && now >= windowStart && now <= Math.min(windowEnd, close);
	function xOf(min) {
		return (min - windowStart) / 60 * PX_PER_HOUR;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30",
						disabled: !canPanLeft,
						onClick: () => onPan(-2),
						"aria-label": "Earlier hours",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium tabular-nums",
							children: [
								formatTime(windowStart),
								" – ",
								formatTime(windowEnd)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex justify-center gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-wood underline",
								onClick: () => onJump(nowMinLA()),
								children: "Now"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-wood underline",
								onClick: () => onJump(1060),
								children: "Evening"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30",
						disabled: !canPanRight,
						onClick: () => onPan(2),
						"aria-label": "Later hours",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex-1",
					style: { minWidth: boardWidth },
					children: hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-0 text-[11px] tabular-nums text-muted",
						style: { left: xOf(h * 60) },
						children: formatTime(h * 60).replace(":00 ", "")
					}, h))
				})]
			}),
			ROOMS.map((room) => {
				const row = bookings.filter((b) => b.roomId === room.id && b.startMin < windowEnd && b.startMin + b.durationMin + 15 > windowStart);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-16 shrink-0 flex-col justify-center pr-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium leading-none text-wood",
							children: [
								room.number,
								" ",
								room.short
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-14 flex-1 overflow-hidden rounded-lg bg-surface-2/80",
						children: [
							hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 w-px bg-border/80",
								style: { left: xOf(h * 60) }
							}, h)),
							row.map((b) => {
								const left = Math.max(0, xOf(b.startMin));
								const right = Math.min(boardWidth, xOf(b.startMin + b.durationMin));
								const width = Math.max(28, right - left - 2);
								const guest = b.source === "guest";
								const active = b.id === selectedId;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onPick(b.id),
									className: cn("absolute top-2.5 h-9 overflow-hidden rounded-lg px-1.5 text-left", guest ? "bg-wood text-wood-fg" : "bg-sage text-primary-fg", active && "ring-2 ring-offset-1 ring-offset-bg ring-wood"),
									style: {
										left,
										width
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-[11px] font-medium leading-4",
										children: formatTime(b.startMin).replace(" ", "")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block truncate text-[10px] leading-3 opacity-80",
										children: [
											b.guests,
											" ",
											b.guests === 1 ? "guest" : "guests"
										]
									})]
								}, b.id);
							}),
							row.map((b) => {
								const left = xOf(b.startMin + b.durationMin);
								const width = 15 / 60 * PX_PER_HOUR - 2;
								if (left > boardWidth || left + width < 0) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "buffer-stripe pointer-events-none absolute top-2.5 h-9 rounded-md",
									style: {
										left: Math.max(0, left),
										width
									},
									title: "15-minute turn"
								}, `${b.id}-turn`);
							}),
							showNow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-wood",
								style: { left: xOf(now) }
							}) : null
						]
					})]
				}, room.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "Sage is reserved. Wood is a lobby walk-in on this demo. Stripes are the 15-minute turn."
			})
		]
	});
}
function VisitList({ bookings, selectedId, onPick }) {
	if (!bookings.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-6 px-5 text-sm text-muted",
		children: "No visits on this day."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 flex flex-col gap-2 px-5",
		children: bookings.map((b) => {
			const room = ROOM_BY_ID[b.roomId];
			const active = b.id === selectedId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onPick(b.id),
				className: cn("flex min-h-16 w-full items-center gap-3 rounded-2xl bg-surface px-3 py-2 text-left shadow-[var(--shadow-border)]", active && "ring-2 ring-wood"),
				children: [
					room ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: room.image,
						alt: "",
						className: "size-12 shrink-0 rounded-xl object-cover outline outline-1 -outline-offset-1 outline-black/10"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium leading-tight",
							children: room?.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block text-sm text-muted",
							children: [
								formatVisitRange(b),
								" · ",
								b.guests,
								" ",
								b.guests === 1 ? "guest" : "guests"
							]
						})]
					}),
					b.source === "guest" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[11px] font-medium text-wood",
						children: "Walk-in"
					}) : b.lateMinutes >= 10 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[11px] font-medium text-wood",
						children: "Late"
					}) : b.memberTier !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[11px] font-medium text-sage",
						children: "Circle"
					}) : null
				]
			}) }, b.id);
		})
	});
}
function BookingSheet({ booking, onClose }) {
	const room = ROOM_BY_ID[booking.roomId];
	const google = googleCalendarUrl(booking);
	const quote = priceVisit(booking);
	const soakLeft = Math.max(0, booking.durationMin - booking.lateMinutes);
	const late = booking.lateMinutes >= 10;
	const fee = lateFeeFor(booking);
	const tier = tierById(booking.memberTier);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "absolute inset-0 bg-wood/25",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-0 z-10 mx-auto max-w-lg rounded-t-3xl bg-surface px-5 pt-4 shadow-[var(--shadow-border)]",
			style: { bottom: "calc(4.25rem + env(safe-area-inset-bottom))" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted",
							children: [
								booking.source === "guest" ? "Lobby walk-in" : "Reserved",
								booking.memberTier !== "none" ? ` · ${tier.name}` : "",
								booking.paidVia === "square" ? " · Square" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl text-wood",
							children: room?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: [
								formatDateLabel(booking.date),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								formatVisitRange(booking)
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex size-11 items-center justify-center rounded-full bg-surface-2",
						"aria-label": "Close details",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						booking.guests,
						" ",
						booking.guests === 1 ? "guest" : "guests",
						" ·",
						" ",
						booking.withSauna ? "Hot Tub with Sauna or Steam" : "Hot Tub",
						booking.massageRequest ? " · massage requested" : "",
						" · ",
						formatMoney(quote.due)
					]
				}),
				late ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-wood",
					children: [
						"Arrived ",
						booking.lateMinutes,
						" min late · soak ",
						soakLeft,
						" min · end still ",
						formatTime(booking.startMin + booking.durationMin),
						fee ? ` · ${formatMoney(fee)} late fee` : " · late fee waived"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Slot ends on time even if they arrive late. After ",
						10,
						" ",
						"min, ",
						formatMoney(15),
						tier.waiveLate ? " (House Circle waives it)" : "",
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2 pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: late ? "outline" : "primary",
							className: "w-full",
							onClick: () => markLate(booking.id, late ? 0 : 15),
							children: late ? "Clear late mark" : "Mark 15 min late"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: google,
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "Add to Google Calendar"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full",
							onClick: () => downloadIcs(`watercourse-${booking.roomId}-${booking.date}.ics`, [booking]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download .ics"]
						})
					]
				})
			]
		})]
	});
}
function CalendarPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: ["staff", "admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffCalendar, {})
	}) });
}
//#endregion
export { CalendarPage as component };
