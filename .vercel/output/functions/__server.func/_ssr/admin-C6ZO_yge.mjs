import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as ROOMS } from "./rooms-BkkvvDBx.mjs";
import { s as formatRange } from "./engine-C6YUwjC7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as listStaffBookings, E as deleteBooking, O as listUsers, T as clearHouseHolds, _ as usePlatform, h as setHousePick, k as setUserRole, p as useProfile, u as refreshSpa, v as houseEconomics, w as adminStats } from "./router-Dx54FkoQ.mjs";
import { n as cn, r as formatMoney, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as RoleGate } from "./role-gate-B8D6wAih.mjs";
import { t as Slider } from "./slider-DUZMdURT.mjs";
import { t as Switch } from "./switch-BINkwy1W.mjs";
import { t as displayPrice } from "./rooms-CxF3BkGx.mjs";
import { i as Bar, n as YAxis, o as ResponsiveContainer, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C6ZO_yge.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAYS = 30;
var NO_SHOW_RECOVER = .65;
var DEAD_SLOT_LIFT = .12;
var MEMBER_ATTACH = .18;
function defaultProfit(house) {
	const avg = house.services.map((s) => s.listPrice ?? s.weekdayPrice ?? 0).filter((n) => n > 40 && n < 400).reduce((a, b, _, arr) => a + b / arr.length, 0) || 130;
	const dues = house.memberships.reduce((a, m) => a + m.priceMonth, 0) / Math.max(1, house.memberships.length) || 0;
	if (house.site.id === "solivana") return {
		sessionsPerDay: 14,
		avgTicket: Math.round(avg),
		occupancy: 55,
		costs: 38,
		members: 40,
		avgDues: Math.round(dues) || 239,
		noShowPct: 8
	};
	return {
		sessionsPerDay: 20,
		avgTicket: Math.round(avg) || 150,
		occupancy: 60,
		costs: 40,
		members: 25,
		avgDues: Math.round(dues) || 159,
		noShowPct: 12
	};
}
function assessProfit(house, i) {
	const walkIn = i.sessionsPerDay * i.avgTicket * DAYS * (i.occupancy / 100);
	const dues = i.members * i.avgDues;
	const gross = walkIn + dues;
	const recovered = walkIn * (i.noShowPct / 100) * NO_SHOW_RECOVER;
	const deadSlots = walkIn * DEAD_SLOT_LIFT;
	const extraMembers = i.sessionsPerDay * DAYS * MEMBER_ATTACH * .15 * i.avgDues;
	const lift = recovered + deadSlots + extraMembers;
	const after = gross + lift;
	const costNow = gross * (i.costs / 100);
	const costAfter = after * (i.costs / 100);
	const profit = gross - costNow;
	const profitAfter = after - costAfter;
	const capacity = house.resources.length * Math.max(1, (house.site.closeMin - house.site.openMin) / 60) * DAYS;
	const used = i.sessionsPerDay * DAYS;
	return {
		gross,
		dues,
		walkIn,
		profit,
		after,
		profitAfter,
		lift,
		liftPct: gross ? lift / gross : 0,
		used,
		capacity,
		util: capacity ? used / capacity : 0,
		sentence: sentence(house, lift, profitAfter - profit)
	};
}
function sentence(house, lift, extraProfit) {
	if (house.site.id === "solivana") return `Filling weekday 11–2 slots with 45-min Mini Float and Core packs, plus cutting no-shows with a card on file, could add about ${formatMoney(lift)} / month (~${formatMoney(extraProfit)} profit) without new rooms.`;
	return `Filling dead weekday mornings with 2-hour off-peak soaks and cutting phone-tag no-shows could add about ${formatMoney(lift)} / month (~${formatMoney(extraProfit)} profit) on the same nine rooms.`;
}
function AdminHouse() {
	const { settings, houses, house, save } = usePlatform();
	const [draft, setDraft] = (0, import_react.useState)(settings);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [counts, setCounts] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setDraft(settings), [settings]);
	(0, import_react.useEffect)(() => {
		houseEconomics().then(setCounts).catch(() => setCounts(null));
	}, []);
	async function persist(next) {
		setDraft(next);
		setBusy(true);
		try {
			await save(next);
			setHousePick(null);
			toast("House settings saved.");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: "Flip the live house for a lobby demo. Discovery lets a guest try another house from Home without signing in as owner."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Live house"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: houses.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => persist({
						...draft,
						liveSiteId: h.site.id,
						previewSiteId: h.site.id
					}),
					className: cn("min-h-14 rounded-2xl px-3 text-left text-sm font-medium", draft.liveSiteId === h.site.id ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: [h.site.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-[11px] font-normal opacity-80",
						children: [
							h.site.city,
							" · ",
							h.services.length,
							" services"
						]
					})]
				}, h.site.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-5 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Demo mode",
						hint: "Banners, mock occupancy, no real card charge.",
						on: draft.demoMode,
						onChange: (demoMode) => persist({
							...draft,
							demoMode
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Self-serve discovery",
						hint: "Home shows a house switcher so a manager can try SoliVana or Watercourse without a login.",
						on: draft.discoveryMode,
						onChange: (discoveryMode) => persist({
							...draft,
							discoveryMode
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "House voice",
						hint: "On: use that spa’s own words. Off: generic platform copy for a cold pitch.",
						on: draft.houseVoice,
						onChange: (houseVoice) => persist({
							...draft,
							houseVoice
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Unlock directory on public pages",
						hint: "OFF by default. The printed QR stays Watercourse. Turn on only after you research affiliation — then Home can grow a Bay Area search.",
						on: draft.directoryUnlocked,
						onChange: (directoryUnlocked) => persist({
							...draft,
							directoryUnlocked
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: "Store portals: a house signs in, then enters walnut / bms / piedmont on Visits. They only see their own guests. Explore is for signed-in members — not the printed QR."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/directory",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-4 w-full",
					children: "Open hidden Bay Area directory"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: busy ? "Saving…" : "Changes apply to the public pages."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Catalog, {
				house,
				counts
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profit, { house })
		]
	});
}
function Toggle({ label, hint, on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-start justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block text-xs leading-relaxed text-muted",
			children: hint
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: on,
			onCheckedChange: onChange
		})]
	});
}
function Catalog({ house, counts }) {
	const [open, setOpen] = (0, import_react.useState)(house.categories[0]?.key ?? "");
	const visits = counts?.visits.find((v) => v.site_id === house.site.id)?.n ?? 0;
	const holds = counts?.holds.find((v) => v.site_id === house.site.id)?.n ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Menu scraped from their site"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					house.site.website.replace("https://", ""),
					" · ",
					visits,
					" pings · ",
					holds,
					" holds"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: house.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(c.key),
					className: cn("min-h-10 rounded-full px-3 text-sm", open === c.key ? "bg-sage text-primary-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: c.name
				}, c.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: [house.services.filter((s) => s.categoryKey === open).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
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
						s.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted",
							children: ["Source ", s.source]
						}) : null
					]
				}, s.id)), open === "membership" || open === house.categories.find((c) => c.key === "membership")?.key ? house.memberships.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
				}, m.id)) : null]
			})
		]
	});
}
function Profit({ house }) {
	const seed = (0, import_react.useMemo)(() => defaultProfit(house), [house.site.id]);
	const [sessions, setSessions] = (0, import_react.useState)(seed.sessionsPerDay);
	const [ticket, setTicket] = (0, import_react.useState)(seed.avgTicket);
	const [occupancy, setOccupancy] = (0, import_react.useState)(seed.occupancy);
	const [costs, setCosts] = (0, import_react.useState)(seed.costs);
	const [members, setMembers] = (0, import_react.useState)(seed.members);
	const [dues, setDues] = (0, import_react.useState)(seed.avgDues);
	const [noShow, setNoShow] = (0, import_react.useState)(seed.noShowPct);
	(0, import_react.useEffect)(() => {
		const d = defaultProfit(house);
		setSessions(d.sessionsPerDay);
		setTicket(d.avgTicket);
		setOccupancy(d.occupancy);
		setCosts(d.costs);
		setMembers(d.members);
		setDues(d.avgDues);
		setNoShow(d.noShowPct);
	}, [house.site.id]);
	const a = assessProfit(house, {
		sessionsPerDay: sessions,
		avgTicket: ticket,
		occupancy,
		costs,
		members,
		avgDues: dues,
		noShowPct: noShow
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Profit if they switch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: a.sentence
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
					label: "This month",
					value: formatMoney(a.profit)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
					label: "With fill + no-show cut",
					value: formatMoney(a.profitAfter)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-36 rounded-3xl bg-surface px-2 py-3 shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: [{
							name: "Now",
							n: Math.round(a.profit)
						}, {
							name: "After",
							n: Math.round(a.profitAfter)
						}],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "n",
								fill: "#4f6b55",
								radius: [
									8,
									8,
									0,
									0
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "Sessions / day",
				value: sessions,
				min: 4,
				max: 40,
				on: setSessions
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "Average ticket",
				value: ticket,
				min: 40,
				max: 400,
				on: setTicket,
				money: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "Occupancy %",
				value: occupancy,
				min: 20,
				max: 95,
				on: setOccupancy
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "Costs %",
				value: costs,
				min: 20,
				max: 70,
				on: setCosts
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "Members",
				value: members,
				min: 0,
				max: 120,
				on: setMembers
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "Avg dues",
				value: dues,
				min: 0,
				max: 800,
				on: setDues,
				money: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
				label: "No-show %",
				value: noShow,
				min: 0,
				max: 30,
				on: setNoShow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"Tickets from their published menu. Capacity ",
					house.resources.length,
					" rooms × open hours. Not a promise — a desk math sheet for the pitch."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "mt-4 w-full",
				onClick: () => setHousePick(house.site.id),
				children: "Preview this house as a guest"
			})
		]
	});
}
function Stat$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl text-wood",
			children: value
		})]
	});
}
function Knob({ label, value, min, max, on, money }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-3 block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center justify-between text-xs text-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-fg",
				children: money ? formatMoney(value) : value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			className: "mt-2",
			min,
			max,
			value: [value],
			onValueChange: (v) => on(v[0] ?? value)
		})]
	});
}
function AdminDesk() {
	const { role } = useProfile();
	const [stats, setStats] = (0, import_react.useState)(null);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [holds, setHolds] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("house");
	function reload() {
		adminStats().then(setStats).catch(() => setStats(null));
		listUsers().then(setUsers).catch(() => setUsers([]));
		listStaffBookings().then(setHolds).catch(() => setHolds([]));
	}
	(0, import_react.useEffect)(() => {
		if (role === "admin") reload();
	}, [role]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Hidden owner tools"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-wood",
				children: "Platform"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Houses, demo flips, traffic. Not linked from the public site."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-4 gap-2",
				children: [
					"house",
					"stats",
					"people",
					"holds"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(key),
					className: cn("min-h-11 rounded-2xl text-sm font-medium capitalize", tab === key ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: key
				}, key))
			}),
			tab === "house" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHouse, {}) : null,
			tab === "stats" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsPane, { stats }) : null,
			tab === "people" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeoplePane, {
				users,
				onChange: reload
			}) : null,
			tab === "holds" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldsPane, {
				holds,
				onChange: () => {
					reload();
					refreshSpa();
				}
			}) : null
		]
	});
}
function StatsPane({ stats }) {
	if (!stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-6 text-sm text-muted",
		children: "Loading visits…"
	});
	const people = Object.fromEntries(stats.people.map((p) => [p.role, p.n]));
	const hits = stats.visits.reduce((a, v) => a + v.n, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pings · 30d",
						value: hits
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Phones / browsers",
						value: stats.sessions
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Phone / app holds",
						value: stats.guestCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Accounts",
						value: (people.customer ?? 0) + (people.staff ?? 0) + (people.admin ?? 0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Devices"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: stats.devices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]",
					children: "No QR scans yet. Open the printed link on a phone to ping."
				}) : stats.devices.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.device }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-wood",
						children: d.n
					})]
				}, d.device))
			}),
			stats.browsers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Browsers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: stats.browsers.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b.browser }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-wood",
						children: b.n
					})]
				}, b.browser))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Visits by day"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-44 rounded-3xl bg-surface px-2 py-3 shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: stats.byDay,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "n",
								fill: "#4f6b55",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Pages"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: stats.visits.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: v.path === "/" ? "Home" : v.path.slice(1) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-wood",
						children: v.n
					})]
				}, v.path))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Latest pings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: stats.recent.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								r.device || "Device",
								" · ",
								r.browser || "Browser"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs leading-relaxed text-muted",
							children: [
								r.path === "/" ? "Home" : r.path,
								" · ",
								r.os,
								" · ",
								r.viewport || r.screen,
								r.dpr ? ` · ${r.dpr}x` : "",
								r.lang ? ` · ${r.lang}` : "",
								r.tz ? ` · ${r.tz}` : "",
								r.touch ? " · touch" : "",
								r.connection ? ` · ${r.connection}` : ""
							]
						}),
						r.referrer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 truncate text-[11px] text-muted",
							children: ["From ", r.referrer]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-muted",
							children: formatWhen(r.created_at)
						})
					]
				}, `${r.created_at}-${i}`))
			})
		]
	});
}
function formatWhen(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleString("en-US", {
		timeZone: "America/Los_Angeles",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl tabular-nums text-wood",
			children: value
		})]
	});
}
function PeoplePane({ users, onChange }) {
	async function change(userId, role) {
		try {
			await setUserRole({ data: {
				userId,
				role
			} });
			onChange();
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not update");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-5 flex flex-col gap-2",
		children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: u.name || u.email || "Guest"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: u.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-3 gap-1",
					children: [
						"customer",
						"staff",
						"admin"
					].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => change(u.user_id, r),
						className: cn("min-h-10 rounded-xl text-xs font-medium capitalize", u.role === r ? "bg-wood text-wood-fg" : "bg-surface-2 text-muted"),
						children: r
					}, r))
				})
			]
		}, u.user_id))
	});
}
function HoldsPane({ holds, onChange }) {
	async function remove(id) {
		try {
			await deleteBooking({ data: id });
			onChange();
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not delete");
		}
	}
	async function clearHouse() {
		try {
			await clearHouseHolds();
			onChange();
			toast("House holds cleared.");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not clear");
		}
	}
	const mine = holds.filter((h) => h.userId !== "house").slice(0, 40);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			className: "w-full",
			onClick: clearHouse,
			children: "Clear generated house holds"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 flex flex-col gap-2",
			children: mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "No guest or desk holds yet."
			}) : mine.map((b) => {
				const room = ROOMS.find((r) => r.id === b.roomId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: room?.name ?? b.roomId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							b.date,
							" · ",
							formatRange(b.startMin, b.durationMin),
							b.guestName ? ` · ${b.guestName}` : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm text-muted",
						onClick: () => remove(b.id),
						children: "Remove"
					})]
				}, b.id);
			})
		})]
	});
}
function AdminPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
			allow: ["admin"],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDesk, {})
		})
	});
}
//#endregion
export { AdminPage as component };
