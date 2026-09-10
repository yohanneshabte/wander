import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as SQUARE_PERCENT, o as ROOMS } from "./rooms-BkkvvDBx.mjs";
import { d as hourOccupancy, g as nextDates, m as isWeekend, u as heatmapHours } from "./engine-C6YUwjC7.mjs";
import { d as useAllBookings, g as useHouse } from "./router-Dx54FkoQ.mjs";
import { n as cn, r as formatMoney, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as RoleGate } from "./role-gate-B8D6wAih.mjs";
import { t as Slider } from "./slider-DUZMdURT.mjs";
import { a as Cell, i as Bar, n as YAxis, o as ResponsiveContainer, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
import { o as simulateCircle, r as MEMBER_TIERS, s as squareTake, t as DEFAULT_MEMBER_ROOMS } from "./membership-B8OO0sfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-B0LWv56s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CircleSim({ walkInRevenue, costsPct }) {
	const [members, setMembers] = (0, import_react.useState)(80);
	const [tierId, setTierId] = (0, import_react.useState)("anytime");
	const [hoursUsed, setHoursUsed] = (0, import_react.useState)(5);
	const [extraHours, setExtraHours] = (0, import_react.useState)(1);
	const [cannibalPct, setCannibalPct] = (0, import_react.useState)(40);
	const [latePct, setLatePct] = (0, import_react.useState)(12);
	const [roomIds, setRoomIds] = (0, import_react.useState)(DEFAULT_MEMBER_ROOMS);
	const sim = (0, import_react.useMemo)(() => simulateCircle({
		members,
		tierId,
		hoursUsed,
		extraHours,
		cannibalPct,
		latePct,
		roomIds,
		walkInRevenue,
		costsPct
	}), [
		members,
		tierId,
		hoursUsed,
		extraHours,
		cannibalPct,
		latePct,
		roomIds,
		walkInRevenue,
		costsPct
	]);
	const ahead = sim.delta >= 0;
	function toggleRoom(id) {
		setRoomIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Perspire-style Circle: monthly dues, included hours, extra at a member rate. Pick which private rooms members fill first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-3 gap-2",
				children: MEMBER_TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setTierId(t.id);
						setHoursUsed(Math.min(t.hours, t.id === "house" ? 10 : t.hours));
					},
					className: cn("min-h-16 rounded-2xl px-2 py-2 text-center", tierId === t.id ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[11px] font-medium leading-tight",
							children: t.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-display text-lg leading-none",
							children: formatMoney(t.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[10px] opacity-80",
							children: t.tag
						})
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: sim.tier.blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
					label: "Today profit",
					value: formatMoney(sim.todayProfit),
					hint: "Walk-in desk, after Square"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
					label: "With Circle",
					value: formatMoney(sim.newProfit),
					hint: ahead ? "Members add money" : "Dues don't cover displaced visits"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-3xl bg-wood px-5 py-4 text-wood-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide uppercase opacity-70",
						children: ahead ? "Circle adds" : "Circle trails"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-3xl tabular-nums",
						children: [
							ahead ? "+" : "",
							formatMoney(sim.delta),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-base font-sans opacity-80",
								children: "/ mo"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed opacity-90",
						children: [
							members,
							" on ",
							sim.tier.name,
							" at ",
							formatMoney(sim.tier.price),
							": dues",
							" ",
							formatMoney(sim.mrr),
							", extra hours ",
							formatMoney(sim.extraRev),
							", late fees ",
							formatMoney(sim.lateRev),
							". Replaces ",
							formatMoney(sim.cannibal),
							" of walk-in. Square takes ",
							formatMoney(sim.square),
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-6 rounded-3xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob$1, {
						label: "Circle members",
						value: String(members),
						min: 0,
						max: 250,
						step: 5,
						sliderValue: members,
						onChange: setMembers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob$1, {
						label: "Hours used / member",
						value: `${hoursUsed} hr`,
						min: 1,
						max: 16,
						step: 1,
						sliderValue: hoursUsed,
						onChange: setHoursUsed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob$1, {
						label: "Extra hours billed",
						value: `${extraHours} hr`,
						min: 0,
						max: 8,
						step: .5,
						sliderValue: extraHours,
						onChange: setExtraHours
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob$1, {
						label: "Walk-in replaced",
						value: `${cannibalPct}%`,
						min: 0,
						max: 80,
						step: 5,
						sliderValue: cannibalPct,
						onChange: setCannibalPct
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob$1, {
						label: "Late arrivals",
						value: `${latePct}%`,
						min: 0,
						max: 40,
						step: 1,
						sliderValue: latePct,
						onChange: setLatePct
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-wood",
						children: "Member rooms"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"Circle holds these first on weekday mornings. Morning load on the selected rooms ≈ ",
							sim.morningLift.toFixed(1),
							" of 6."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: ROOMS.map((r) => {
							const on = roomIds.includes(r.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleRoom(r.id),
								className: cn("min-h-12 rounded-2xl px-2 text-xs font-medium", on ? "bg-sage text-primary-fg" : "bg-surface text-muted shadow-[var(--shadow-border)]"),
								children: [
									r.number,
									" ",
									r.short
								]
							}, r.id);
						})
					})
				]
			})
		]
	});
}
function Stat$1({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-2xl tabular-nums leading-none text-wood",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted",
				children: hint
			})
		]
	});
}
function Knob$1({ label, value, min, max, step, sliderValue, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-baseline justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg tabular-nums",
			children: value
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
		min,
		max,
		step,
		value: [sliderValue],
		onValueChange: (v) => onChange(v[0] ?? sliderValue)
	})] });
}
var DAYS = 30;
function InsightsPanel() {
	const bookings = useAllBookings();
	const { site } = useHouse();
	const [tab, setTab] = (0, import_react.useState)("desk");
	const [bookingsPerDay, setBookingsPerDay] = (0, import_react.useState)(20);
	const [ticket, setTicket] = (0, import_react.useState)(150);
	const [occupancy, setOccupancy] = (0, import_react.useState)(60);
	const [costs, setCosts] = (0, import_react.useState)(40);
	const [latePct, setLatePct] = (0, import_react.useState)(12);
	const gross = bookingsPerDay * ticket * DAYS;
	const lateRev = bookingsPerDay * DAYS * (latePct / 100) * 15;
	const square = squareTake(gross + lateRev, bookingsPerDay * DAYS);
	const revenue = gross + lateRev;
	const profit = (revenue - square) * (1 - costs / 100);
	const liftedRevenue = revenue * 1.2;
	const liftedProfit = (liftedRevenue - squareTake(liftedRevenue, bookingsPerDay * DAYS)) * (1 - costs / 100);
	const pattern = (0, import_react.useMemo)(() => occupancyPattern(bookings), [bookings]);
	const overstaff = occupancy > 75;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: site.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight text-wood",
				children: "Front Desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Walk-in math for this house, then membership."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/calendar",
				className: "mt-4 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "w-full",
					children: "Open the floor calendar"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-2 gap-2",
				children: ["desk", "circle"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(key),
					className: cn("min-h-11 rounded-2xl text-sm font-medium", tab === key ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: key === "desk" ? "Desk" : "Circle"
				}, key))
			}),
			tab === "circle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleSim, {
				walkInRevenue: gross,
				costsPct: costs
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskTab, {
				bookingsPerDay,
				ticket,
				occupancy,
				costs,
				latePct,
				revenue,
				profit,
				lateRev,
				square,
				liftedProfit,
				overstaff,
				pattern,
				onBookings: setBookingsPerDay,
				onTicket: setTicket,
				onOccupancy: setOccupancy,
				onCosts: setCosts,
				onLate: setLatePct
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs leading-relaxed text-muted",
				children: "Live holds sit on the calendar. Owner tools for accounts and visit counts stay off the public menu."
			})
		]
	});
}
function DeskTab({ bookingsPerDay, ticket, occupancy, costs, latePct, revenue, profit, lateRev, square, liftedProfit, overstaff, pattern, onBookings, onTicket, onOccupancy, onCosts, onLate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Monthly revenue",
				value: formatMoney(revenue),
				hint: `${bookingsPerDay}/day · ${formatMoney(ticket)} ticket`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Monthly profit",
				value: formatMoney(profit),
				hint: `${costs}% costs · Square ${formatMoney(square)}`
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-3xl bg-wood px-5 py-4 text-wood-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide uppercase opacity-70",
					children: "With dead slots filled"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums",
						children: formatMoney(liftedProfit)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm opacity-80",
						children: "profit · +20%"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm leading-relaxed opacity-90",
					children: [
						"Filling dead slots with 2-hour off-peak packages and cutting phone-tag no-shows could add about 20%. Late arrivals after",
						" ",
						10,
						" minutes keep the original end time and add",
						" ",
						formatMoney(15),
						" — about ",
						formatMoney(lateRev),
						" a month at",
						" ",
						latePct,
						"%."
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-6 rounded-3xl bg-surface p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
					label: "Bookings per day",
					value: String(bookingsPerDay),
					min: 4,
					max: 40,
					step: 1,
					sliderValue: bookingsPerDay,
					onChange: onBookings
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
					label: "Average ticket",
					value: formatMoney(ticket),
					min: 40,
					max: 320,
					step: 5,
					sliderValue: ticket,
					onChange: onTicket
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
					label: "Occupancy",
					value: `${occupancy}%`,
					min: 20,
					max: 95,
					step: 1,
					sliderValue: occupancy,
					onChange: onOccupancy
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
					label: "Costs",
					value: `${costs}%`,
					min: 15,
					max: 70,
					step: 1,
					sliderValue: costs,
					onChange: onCosts
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
					label: "Late arrivals",
					value: `${latePct}%`,
					min: 0,
					max: 40,
					step: 1,
					sliderValue: latePct,
					onChange: onLate
				}),
				overstaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-wood",
					children: "Past 75% the floor gets crushed. Six of nine private rooms is the cap this demo will not cross."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						occupancy,
						"% leaves weekday mornings open. Staff ceiling is",
						" ",
						Math.round(6 / ROOMS.length * 100),
						"% — ",
						6,
						" of",
						" ",
						ROOMS.length,
						" rooms. Square online is ",
						SQUARE_PERCENT,
						"% +",
						" ",
						formatMoney(30 / 100),
						" per visit."
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-wood",
					children: "Where mornings sit empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Average private rooms reserved this week."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-48 rounded-3xl bg-surface px-2 pt-4 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: pattern,
							barSize: 28,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: {
										fill: "var(--color-muted)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									hide: true,
									domain: [0, 9]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "rooms",
									radius: [
										8,
										8,
										4,
										4
									],
									children: pattern.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: row.name === "Morning" ? "var(--color-sage)" : "var(--color-wood)" }, row.name))
								})
							]
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-wood",
				children: "Rules already in the calendar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "A time slot, not a duration",
						body: `Arrive after the start and the soak shortens. The next guest still starts on time. After 10 minutes a ${formatMoney(15)} late fee applies, on top of the full reserved hour.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "15-minute turn",
						body: "Every visit is followed by a cleaning turn. The next guest cannot land on a wet room."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "Never pack the floor",
						body: "Never more than six of nine private rooms at once. Evenings can look full without crushing staff."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "Pay with Square",
						body: "Demo checkout on Book Now. Recurring Circle dues would sit on a Square card on file — same rail they already use at the desk."
					})
				]
			})]
		})
	] });
}
function occupancyPattern(bookings) {
	const dates = nextDates(14);
	const buckets = {
		Morning: {
			sum: 0,
			n: 0
		},
		Afternoon: {
			sum: 0,
			n: 0
		},
		Evening: {
			sum: 0,
			n: 0
		},
		Weekend: {
			sum: 0,
			n: 0
		}
	};
	for (const date of dates) for (const hour of heatmapHours(date)) {
		const occ = hourOccupancy(bookings, date, hour);
		const key = isWeekend(date) ? "Weekend" : hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
		buckets[key].sum += occ;
		buckets[key].n += 1;
	}
	return Object.keys(buckets).map((name) => ({
		name,
		rooms: Math.round((buckets[name].n ? buckets[name].sum / buckets[name].n : 0) * 10) / 10
	}));
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-2xl tabular-nums leading-none text-wood",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted",
				children: hint
			})
		]
	});
}
function Knob({ label, value, min, max, step, sliderValue, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-baseline justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg tabular-nums",
			children: value
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
		min,
		max,
		step,
		value: [sliderValue],
		onValueChange: (v) => onChange(v[0] ?? sliderValue)
	})] });
}
function Rule({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-wood",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-muted",
			children: body
		})]
	});
}
function InsightsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: ["staff", "admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightsPanel, {})
	}) });
}
//#endregion
export { InsightsPage as component };
