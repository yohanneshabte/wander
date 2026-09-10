import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PHONE_TEL, c as SQUARE_PERCENT, i as PHONE, l as amenityLabel, n as DAY_CUTOFF_MIN, u as roomHasHeat } from "./rooms-BkkvvDBx.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { C as startTimes, S as recommendStart, f as isSlowWindow, g as nextDates, h as maxDurationAt, i as canBook, n as blockReason, o as formatDateLabel, p as isWeekdayMorning, s as formatRange, t as availableRooms, v as occupancyAt, w as todayISO, x as reasonCopy, y as parseDate } from "./engine-C6YUwjC7.mjs";
import { C as ChevronRight, T as Check, d as Plus, f as Phone, m as Minus, w as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as useAllBookings, g as useHouse, s as addBooking } from "./router-Dx54FkoQ.mjs";
import { n as cn, r as formatMoney, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { n as SignInRequired } from "./role-gate-B8D6wAih.mjs";
import { t as Switch } from "./switch-BINkwy1W.mjs";
import { n as roomsOf, t as displayPrice } from "./rooms-CxF3BkGx.mjs";
import { t as Textarea } from "./textarea-Bxy0Qmki.mjs";
import { a as priceVisit, n as DROP_IN, r as MEMBER_TIERS, s as squareTake } from "./membership-B8OO0sfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-DmO0VqD8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SquarePay({ amount, label, onPaid, onBack }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fee = squareTake(amount);
	function pay() {
		setBusy(true);
		window.setTimeout(() => {
			onPaid();
		}, 700);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-surface px-5 py-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Square · demo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl text-wood",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-4xl tabular-nums text-wood",
						children: amount === 0 ? "No charge today" : formatMoney(amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-2xl bg-surface-2 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Visa ···· 4242"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Test card · sandbox · not charged"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							"Online Square is ",
							SQUARE_PERCENT,
							"% + ",
							formatMoney(30 / 100),
							amount > 0 ? ` · ${formatMoney(fee)} on this visit` : "",
							". Recurring Circle dues would use the same card on file."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "xl",
				className: "mt-5 w-full",
				onClick: pay,
				disabled: busy,
				children: busy ? "Charging…" : amount === 0 ? "Hold with Square" : `Pay ${formatMoney(amount)} with Square`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "mt-2 w-full",
				onClick: onBack,
				disabled: busy,
				children: "Back"
			})
		]
	});
}
var DATES = nextDates(14);
var WEEK_SIZE = 7;
var BANDS = [
	{
		id: "morning",
		label: "AM",
		start: 510,
		end: 720
	},
	{
		id: "afternoon",
		label: "PM",
		start: 720,
		end: DAY_CUTOFF_MIN
	},
	{
		id: "evening",
		label: "Eve",
		start: DAY_CUTOFF_MIN,
		end: 1800
	}
];
function bandOf(t) {
	if (t < 720) return "morning";
	if (t < 1060) return "afternoon";
	return "evening";
}
function openStarts(bookings, date, durationMin, band, roomIds) {
	const pool = roomIds ? (id) => roomIds.includes(id) : () => true;
	return startTimes(date, durationMin).filter((t) => {
		if (t % 30 !== 0) return false;
		if (band && bandOf(t) !== band) return false;
		return availableRooms(bookings, date, t, durationMin).some((r) => pool(r.id));
	});
}
function prettyTime(min) {
	const wrapped = (min % 1440 + 1440) % 1440;
	const h = Math.floor(wrapped / 60);
	const m = wrapped % 60;
	const ampm = h >= 12 ? "pm" : "am";
	return `${h % 12 === 0 ? 12 : h % 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}
function durationLabel(min) {
	if (min === 60) return "1 hour";
	if (min === 90) return "90 minutes";
	if (min === 120) return "2 hours";
	if (min === 150) return "2½ hours";
	return "3 hours";
}
function BookFlow() {
	const bookings = useAllBookings();
	const house = useHouse();
	const rooms = roomsOf(house);
	const [cat, setCat] = (0, import_react.useState)(house.categories[0]?.key ?? "rooms");
	const [step, setStep] = (0, import_react.useState)(1);
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [durationMin, setDurationMin] = (0, import_react.useState)(90);
	const [startMin, setStartMin] = (0, import_react.useState)(() => recommendStart(bookings, todayISO(), 90));
	const [roomId, setRoomId] = (0, import_react.useState)(null);
	const [guests, setGuests] = (0, import_react.useState)(2);
	const [withSauna, setWithSauna] = (0, import_react.useState)(true);
	const [massageRequest, setMassageRequest] = (0, import_react.useState)(false);
	const [massageNote, setMassageNote] = (0, import_react.useState)("");
	const [memberTier, setMemberTier] = (0, import_react.useState)("none");
	const [paying, setPaying] = (0, import_react.useState)(false);
	const [confirmed, setConfirmed] = (0, import_react.useState)(null);
	const roomsOpen = (0, import_react.useMemo)(() => rooms.filter((r) => canBook(bookings, date, r.id, startMin, durationMin)), [
		rooms,
		bookings,
		date,
		startMin,
		durationMin
	]);
	const room = rooms.find((r) => r.id === roomId) ?? null;
	const heatOk = room ? roomHasHeat(room) : false;
	const saunaOn = heatOk && withSauna;
	const quote = priceVisit({
		startMin,
		durationMin,
		guests,
		withSauna: saunaOn,
		memberTier
	});
	const slow = isSlowWindow(bookings, date, startMin);
	const durationMax = maxDurationAt(bookings, date, startMin);
	const occNow = occupancyAt(bookings, date, startMin);
	(0, import_react.useEffect)(() => {
		if (durationMin > durationMax) {
			setDurationMin(120);
			toast("2½ and 3 hour visits are for quieter mornings.");
		}
	}, [durationMax, durationMin]);
	(0, import_react.useEffect)(() => {
		if (roomId && roomsOpen.some((r) => r.id === roomId)) return;
		setRoomId(roomsOpen[0]?.id ?? null);
	}, [roomId, roomsOpen]);
	(0, import_react.useEffect)(() => {
		if (room && !roomHasHeat(room)) setWithSauna(false);
	}, [room]);
	(0, import_react.useEffect)(() => {
		const probe = roomId ?? rooms[0].id;
		if (canBook(bookings, date, probe, startMin, durationMin) && roomsOpen.length) return;
		setStartMin(recommendStart(bookings, date, durationMin));
	}, [
		bookings,
		date,
		durationMin
	]);
	function setDuration(next) {
		if (next > 120 && !slow) {
			toast("Longer visits open on weekday mornings and quiet times.");
			return;
		}
		setDurationMin(next);
	}
	async function bookNow() {
		if (!room) {
			toast("Please pick a private hot tub room.");
			return;
		}
		const reason = blockReason(bookings, date, room.id, startMin, durationMin);
		if (reason !== "ok") {
			toast(reasonCopy(reason));
			return;
		}
		try {
			const saved = await addBooking({
				date,
				roomId: room.id,
				startMin,
				durationMin,
				guests,
				withSauna: saunaOn,
				massageRequest,
				massageNote: massageRequest ? massageNote : "",
				memberTier,
				paidVia: "square",
				lateMinutes: 0,
				siteId: house.site.id
			});
			setPaying(false);
			setConfirmed(saved);
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not hold that room.");
			setPaying(false);
		}
	}
	if (confirmed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessCard, {
		booking: confirmed,
		onAgain: () => setConfirmed(null)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col px-5 pb-8 pt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: house.site.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight text-wood",
				children: "Book Now"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: house.site.address
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: house.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCat(c.key),
					className: cn("min-h-10 shrink-0 rounded-full px-3 text-sm", cat === c.key ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: c.name
				}, c.key))
			}),
			cat !== "rooms" && cat !== "core" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuBoard, { houseKey: cat }) : null,
			!paying && (cat === "rooms" || cat === "core") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 grid grid-cols-3 gap-2",
				children: [
					"When",
					"Room",
					"Confirm"
				].map((label, i) => {
					const n = i + 1;
					const active = step === n;
					const done = step > n;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							if (done || n < step) setStep(n);
						},
						className: cn("flex w-full min-h-11 flex-col items-start rounded-2xl px-3 py-2 text-left", active ? "bg-wood text-wood-fg" : "bg-surface text-muted shadow-[var(--shadow-border)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] uppercase tracking-wide opacity-80",
							children: [n, " of 3"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-current",
							children: label
						})]
					}) }, label);
				})
			}) : null,
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhenStep, {
				date,
				durationMin,
				startMin,
				bookings,
				rooms,
				openMin: house.site.openMin,
				closeMin: house.site.closeMin,
				slow,
				occNow,
				onDate: setDate,
				onDuration: setDuration,
				onTime: setStartMin,
				onNext: () => {
					if (!roomsOpen.length) {
						toast("Nothing open at that time — try a quieter hour.");
						return;
					}
					setStep(2);
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});
				}
			}) : null,
			step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomStep, {
				rooms,
				bookings,
				date,
				startMin,
				durationMin,
				roomId,
				onPick: (id) => {
					setRoomId(id);
					const r = rooms.find((x) => x.id === id);
					if (r && roomHasHeat(r)) setWithSauna(true);
				},
				onBack: () => setStep(1),
				onNext: () => {
					if (!room) {
						toast("Choose a private hot tub room.");
						return;
					}
					setStep(3);
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});
				}
			}) : null,
			step === 3 && !paying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmStep, {
				room,
				date,
				startMin,
				durationMin,
				guests,
				heatOk,
				saunaOn,
				massageRequest,
				massageNote,
				memberTier,
				quote,
				onGuests: setGuests,
				onSauna: setWithSauna,
				onMassage: setMassageRequest,
				onNote: setMassageNote,
				onMember: setMemberTier,
				onBack: () => setStep(2),
				onBook: () => setPaying(true)
			}) : null,
			paying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePay, {
				amount: quote.due,
				label: quote.covered ? `${quote.tier.name} credit` : room?.name ?? "Private Hot Tub",
				onPaid: bookNow,
				onBack: () => setPaying(false)
			}) : null
		]
	});
}
function WhenStep({ date, durationMin, startMin, bookings, rooms, openMin, closeMin, slow, occNow, onDate, onDuration, onTime, onNext }) {
	const [view, setView] = (0, import_react.useState)("week");
	const [weekStart, setWeekStart] = (0, import_react.useState)(0);
	const week = DATES.slice(weekStart, weekStart + WEEK_SIZE);
	function pickBand(d, band) {
		const open = openStarts(bookings, d, durationMin, band, rooms.map((r) => r.id)).filter((t) => t >= openMin && t + durationMin <= closeMin);
		if (!open.length) {
			toast("Nothing open in that window.");
			return;
		}
		onDate(d);
		onTime(d === date && bandOf(startMin) === band && open.includes(startMin) ? startMin : open[0]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "How long" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						60,
						90,
						120
					].map((min) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onDuration(min),
						className: cn("min-h-14 rounded-2xl px-2 text-sm font-medium", durationMin === min ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
						children: durationLabel(min)
					}, min))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					children: [150, 180].map((min) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onDuration(min),
							className: cn("min-h-12 rounded-2xl px-2 text-sm", durationMin === min ? "bg-wood text-wood-fg" : !slow && durationMin !== min ? "bg-surface-2 text-muted" : "bg-surface shadow-[var(--shadow-border)]"),
							children: [durationLabel(min), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-[10px] opacity-80",
								children: "off-peak"
							})]
						}, min);
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-3 gap-2",
				children: [
					"week",
					"day",
					"list"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setView(key),
					className: cn("min-h-11 rounded-2xl text-sm font-medium capitalize", view === key ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: key
				}, key))
			}),
			view === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekCal, {
				week,
				weekStart,
				date,
				startMin,
				durationMin,
				bookings,
				onBand: pickBand,
				onPrev: () => setWeekStart(0),
				onNextWeek: () => setWeekStart(WEEK_SIZE)
			}) : null,
			view === "day" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayCal, {
				date,
				startMin,
				durationMin,
				bookings,
				onDate,
				onTime
			}) : null,
			view === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCal, {
				date,
				startMin,
				durationMin,
				bookings,
				onDate,
				onTime
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-wood",
				children: [
					format(parseDate(date), "EEE d"),
					" · ",
					prettyTime(startMin),
					" ·",
					" ",
					durationLabel(durationMin),
					occNow <= 2 ? " · quieter" : occNow >= 5 ? " · busy" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "mt-5 w-full",
				onClick: onNext,
				children: "Continue · pick a room"
			})
		]
	});
}
function WeekCal({ week, weekStart, date, startMin, durationMin, bookings, onBand, onPrev, onNextWeek }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30",
						disabled: weekStart === 0,
						onClick: onPrev,
						"aria-label": "Previous week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							format(parseDate(week[0]), "MMM d"),
							" –",
							" ",
							format(parseDate(week[week.length - 1]), "MMM d")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30",
						disabled: weekStart + WEEK_SIZE >= DATES.length,
						onClick: onNextWeek,
						"aria-label": "Next week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[2.5rem_repeat(7,minmax(0,1fr))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						week.map((d) => {
							const parsed = parseDate(d);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("py-2 text-center", d === date && "text-wood"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-medium uppercase tracking-wide text-muted",
									children: d === todayISO() ? "Now" : format(parsed, "EEE")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-base leading-none",
									children: format(parsed, "d")
								})]
							}, d);
						}),
						BANDS.map((band) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandRow, {
							band,
							week,
							date,
							startMin,
							durationMin,
							bookings,
							onBand
						}, band.id))
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "Number is open starts. Tap a cell to hold that window."
			})
		]
	});
}
function BandRow({ band, week, date, startMin, durationMin, bookings, onBand }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center px-1 text-[11px] font-medium text-muted",
		children: band.label
	}), week.map((d) => {
		const open = openStarts(bookings, d, durationMin, band.id);
		const selected = d === date && bandOf(startMin) === band.id;
		const empty = open.length === 0;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: empty,
			onClick: () => onBand(d, band.id),
			className: cn("m-0.5 flex min-h-11 items-center justify-center rounded-xl text-xs font-medium tabular-nums", empty && "text-muted/50", !empty && !selected && "bg-sage-soft text-sage", selected && "bg-wood text-wood-fg"),
			children: empty ? "—" : open.length
		}, `${d}-${band.id}`);
	})] });
}
function DayCal({ date, startMin, durationMin, bookings, onDate, onTime }) {
	const hours = (0, import_react.useMemo)(() => {
		const close = startTimes(date, durationMin);
		const hs = [];
		for (const t of close) {
			if (t % 30 !== 0) continue;
			const h = Math.floor(t / 60);
			if (!hs.includes(h)) hs.push(h);
		}
		return hs;
	}, [date, durationMin]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: DATES.map((d) => {
				const parsed = parseDate(d);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onDate(d),
					className: cn("snap-start flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-2.5 py-1", d === date ? "bg-wood text-wood-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-medium uppercase tracking-wide opacity-80",
						children: d === todayISO() ? "Today" : format(parsed, "EEE")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg leading-none",
						children: format(parsed, "d")
					})]
				}, d);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-col gap-1.5",
			children: hours.map((h) => {
				const slot = h * 60;
				const options = [slot, h * 60 + 30].filter((t) => availableRooms(bookings, date, t, durationMin).length > 0);
				const selected = options.includes(startMin);
				const empty = options.length === 0;
				const open = options[0] ? availableRooms(bookings, date, options[0], durationMin).length : 0;
				const occ = occupancyAt(bookings, date, slot);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: empty,
					onClick: () => {
						const next = options.find((t) => t === startMin) ?? options[0];
						if (next != null) onTime(next);
					},
					className: cn("flex min-h-12 items-center gap-3 rounded-2xl px-3 text-left", empty && "bg-surface-2 text-muted", !empty && !selected && "bg-surface shadow-[var(--shadow-border)]", selected && "bg-wood text-wood-fg"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-14 shrink-0 text-sm font-medium tabular-nums",
							children: prettyTime(slot).replace(":00 ", " ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("absolute inset-y-0 left-0 rounded-full", selected ? "bg-wood-fg/80" : "bg-sage"),
								style: { width: `${Math.min(100, occ / 6 * 100)}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-16 shrink-0 text-right text-xs opacity-80",
							children: empty ? "Full" : `${open} open`
						})
					]
				}, h);
			})
		})]
	});
}
function ListCal({ date, startMin, durationMin, bookings, onDate, onTime }) {
	const dayTimes = startTimes(date, durationMin).filter((t) => t % 30 === 0 && t < 1060);
	const eveningTimes = startTimes(date, durationMin).filter((t) => t % 30 === 0 && t >= 1060);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: DATES.map((d) => {
					const parsed = parseDate(d);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onDate(d),
						className: cn("snap-start flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-2.5 py-1", d === date ? "bg-wood text-wood-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-medium uppercase tracking-wide opacity-80",
							children: d === todayISO() ? "Today" : format(parsed, "EEE")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg leading-none",
							children: format(parsed, "d")
						})]
					}, d);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Day rates · 8:30am–5:30pm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeGroup, {
					times: dayTimes,
					date,
					durationMin,
					startMin,
					bookings,
					onTime
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Evening rates · 5:40pm–close" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeGroup, {
					times: eveningTimes,
					date,
					durationMin,
					startMin,
					bookings,
					onTime
				})]
			})
		]
	});
}
function TimeGroup({ times, date, durationMin, startMin, bookings, onTime }) {
	const visible = times.filter((t) => availableRooms(bookings, date, t, durationMin).length > 0);
	if (!visible.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Nothing open in this window."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: visible.map((t) => {
			const openCount = availableRooms(bookings, date, t, durationMin).length;
			const selected = t === startMin;
			const morning = isWeekdayMorning(date, t);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onTime(t),
				className: cn("flex min-h-14 items-center justify-between rounded-2xl px-4 text-left", selected ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-medium tabular-nums",
					children: prettyTime(t)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs opacity-80",
					children: morning ? `${openCount} open · quieter morning` : `${openCount} of 9 open`
				})]
			}, t);
		})
	});
}
function RoomStep({ rooms, bookings, date, startMin, durationMin, roomId, onPick, onBack, onNext }) {
	const open = rooms.filter((r) => blockReason(bookings, date, r.id, startMin, durationMin) === "ok");
	const taken = rooms.filter((r) => blockReason(bookings, date, r.id, startMin, durationMin) !== "ok");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-sm text-muted",
				children: [
					prettyTime(startMin),
					" · ",
					durationLabel(durationMin),
					" ·",
					" ",
					open.length,
					" private rooms open"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: open.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomCard, {
					room: r,
					selected: r.id === roomId,
					onClick: () => onPick(r.id)
				}, r.id))
			}),
			taken.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Already reserved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2 opacity-60",
					children: taken.map((r) => {
						const reason = blockReason(bookings, date, r.id, startMin, durationMin);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-surface-2 px-4 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted",
								children: reasonCopy(reason) || "Reserved"
							})]
						}, r.id);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "flex-1",
					onClick: onBack,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-[2]",
					size: "lg",
					onClick: onNext,
					disabled: !roomId,
					children: "Continue"
				})]
			})
		]
	});
}
function RoomCard({ room, selected, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex overflow-hidden rounded-3xl bg-surface text-left shadow-[var(--shadow-border)]", selected && "ring-2 ring-wood"),
		children: [room.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: room.image,
			alt: "",
			className: "h-28 w-24 shrink-0 object-cover outline outline-1 -outline-offset-1 outline-black/10"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 w-24 shrink-0 bg-sage-soft" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col justify-center px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg leading-tight",
					children: room.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted",
					children: amenityLabel(room)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm text-fg/80",
					children: room.blurb
				})
			]
		})]
	});
}
function ConfirmStep({ room, date, startMin, durationMin, guests, heatOk, saunaOn, massageRequest, massageNote, memberTier, quote, onGuests, onSauna, onMassage, onNote, onMember, onBack, onBook }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [
			room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: room.image,
					alt: "",
					className: "h-36 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: room.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: [
							formatDateLabel(date),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							prettyTime(startMin),
							" – ",
							prettyTime(startMin + durationMin),
							" ·",
							" ",
							durationLabel(durationMin)
						]
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Guests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "All prices per person / per hour"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "flex size-12 items-center justify-center rounded-full bg-surface-2",
							onClick: () => onGuests(Math.max(1, guests - 1)),
							"aria-label": "Fewer guests",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-6 text-center font-display text-2xl tabular-nums",
							children: guests
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "flex size-12 items-center justify-center rounded-full bg-surface-2",
							onClick: () => onGuests(Math.min(room?.maxGuests ?? 6, guests + 1)),
							"aria-label": "More guests",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})
					]
				})]
			}),
			heatOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-medium",
					children: "Hot Tub with Sauna or Steam"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted",
					children: [quote.isEvening ? "Evening $28" : "Day $23", " per person / per hour"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: saunaOn,
					onCheckedChange: onSauna
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]",
				children: [
					"Hot Tub only in this room ·",
					" ",
					quote.isEvening ? "evening $23" : "day $18",
					" per person / per hour"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-medium",
					children: "Request a massage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Confirmed by phone · not billed here"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: massageRequest,
					onCheckedChange: onMassage
				})]
			}),
			massageRequest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-3",
				placeholder: "Swedish, deep tissue, couples, after the hot tub…",
				value: massageNote,
				onChange: (e) => onNote(e.target.value)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Circle membership" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [DROP_IN, ...MEMBER_TIERS].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onMember(t.id),
							className: cn("min-h-14 rounded-2xl px-3 py-2 text-left", memberTier === t.id ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] opacity-80",
								children: t.id === "none" ? "Pay this visit" : `${formatMoney(t.price)}/mo`
							})]
						}, t.id))
					}),
					memberTier !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: quote.tier.blurb
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-muted shadow-[var(--shadow-border)]",
				children: [
					"This is a time slot, not a duration. Arrive ",
					10,
					" minutes after start and the soak shortens — next guest still starts on time. Full reserved hour is charged, plus a ",
					formatMoney(15),
					" late fee",
					quote.tier.waiveLate ? " (waived on House Circle)" : "",
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-3xl bg-wood px-5 py-4 text-wood-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide opacity-70",
						children: quote.covered ? `${quote.tier.name} credit` : quote.isEvening || quote.eveningHours > 0 ? "Evening rate" : "Day rate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-4xl tabular-nums leading-none",
						children: formatMoney(quote.due)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm opacity-80",
						children: [
							quote.covered ? `Included in ${formatMoney(quote.tier.price)}/mo dues` : `${formatMoney(quote.hourly)} per person / per hour · ${guests} ${guests === 1 ? "guest" : "guests"}`,
							" · ",
							saunaOn ? "Hot Tub with Sauna or Steam" : "Hot Tub"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "xl",
				className: "mt-5 w-full",
				onClick: onBook,
				disabled: !room,
				children: "Pay with Square"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "mt-2 w-full",
				onClick: onBack,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Back"]
			})
		]
	});
}
function SuccessCard({ booking, onAgain }) {
	const house = useHouse();
	const room = roomsOf(house).find((r) => r.id === booking.roomId);
	const quote = priceVisit(booking);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col px-5 pt-10 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex size-14 items-center justify-center rounded-full bg-sage-soft text-sage",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-7",
					strokeWidth: 2.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 text-center font-display text-3xl text-wood",
				children: "You're booked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-center text-sm text-muted",
				children: ["Demo only — ", house.site.bookingNote]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-border)]",
				children: [room?.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: room.image,
					alt: "",
					className: "h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: room?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: [
								formatDateLabel(booking.date),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								formatRange(booking.startMin, booking.durationMin),
								" ·",
								" ",
								durationLabel(booking.durationMin)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-3xl tabular-nums",
							children: formatMoney(quote.due)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Paid with Square (demo)",
								booking.memberTier !== "none" ? ` · ${quote.tier.name}` : "",
								" ·",
								" ",
								booking.guests,
								" ",
								booking.guests === 1 ? "guest" : "guests",
								" ·",
								" ",
								booking.withSauna ? "Hot Tub with Sauna or Steam" : "Hot Tub",
								booking.massageRequest ? " · massage requested" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: [
								"Time slot, not a duration. Late after ",
								10,
								" min shortens the soak. Full hour",
								quote.tier.waiveLate ? " still billed to Circle." : ` plus ${formatMoney(15)} late fee.`
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: PHONE_TEL,
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5" }),
						"Call Now · ",
						PHONE
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "lg",
				className: "mt-3 w-full",
				onClick: onAgain,
				children: "Book another room"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/calendar",
				className: "mt-3 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "w-full",
					children: "Calendar"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/insights",
				className: "mt-1 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "w-full",
					children: "Front Desk"
				})
			})
		]
	});
}
function MenuBoard({ houseKey }) {
	const house = useHouse();
	const items = house.services.filter((s) => s.categoryKey === houseKey);
	const members = houseKey === "membership" ? house.memberships : [];
	const tel = `tel:+1${house.site.phone.replace(/\D/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Prices from ",
					house.site.website.replace("https://", ""),
					". Hold is a demo — they still confirm on their own booker or phone."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: [items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/service/$slug",
						params: { slug: s.id },
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm tabular-nums text-wood",
									children: [displayPrice(s.listPrice ?? s.weekdayPrice), s.weekendPrice && s.weekendPrice !== s.weekdayPrice ? ` / ${displayPrice(s.weekendPrice)}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: [s.durationMin ? `${s.durationMin} min · ` : "", s.blurb]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-sage",
								children: "Benefits & HSA notes"
							})
						]
					})
				}, s.id)), members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm tabular-nums text-wood",
							children: [formatMoney(m.priceMonth), "/mo"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							m.credits,
							" · ",
							m.blurb
						]
					})]
				}, m.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: tel,
				className: "mt-4 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "w-full",
					children: ["Call to confirm · ", house.site.phone]
				})
			})
		]
	});
}
function SectionLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-2 text-xs font-medium tracking-wide text-muted uppercase",
		children
	});
}
function BookPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInRequired, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookFlow, {}) }) });
}
//#endregion
export { BookPage as component };
