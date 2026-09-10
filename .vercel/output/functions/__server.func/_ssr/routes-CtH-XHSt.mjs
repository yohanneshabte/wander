import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as hourOccupancy, w as todayISO } from "./engine-C6YUwjC7.mjs";
import { S as Clock, f as Phone, h as MapPin } from "../_libs/lucide-react.mjs";
import { _ as usePlatform, d as useAllBookings, h as setHousePick } from "./router-Dx54FkoQ.mjs";
import { n as cn, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { n as roomsOf, t as displayPrice } from "./rooms-CxF3BkGx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CtH-XHSt.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const bookings = useAllBookings();
	const { house, settings, houses } = usePlatform();
	const rooms = roomsOf(house);
	const date = todayISO();
	const morning = hourOccupancy(bookings, date, house.site.openMin + 90);
	const evening = hourOccupancy(bookings, date, Math.min(house.site.dayCutoffMin + 60, house.site.closeMin - 60));
	const voice = settings.houseVoice;
	const tel = `tel:+1${house.site.phone.replace(/\D/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: [house.site.city, house.site.id === "watercourse" && voice ? " · since 1980" : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-[2.35rem] leading-[1.05] text-wood",
					children: voice ? house.site.name : "House booking"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-xl leading-snug text-wood",
					children: voice ? house.site.tagline : "One phone hold for any house on the platform."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-fg",
					children: house.site.pitch
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/search",
					className: "mt-3 inline-block text-sm underline decoration-border",
					children: "Search gyms and soaks nearby"
				})
			]
		}),
		settings.directoryUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/directory",
				className: "text-sm underline decoration-border",
				children: "Bay Area directory"
			})
		}) : null,
		settings.discoveryMode && houses.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Try a house"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: houses.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setHousePick(h.site.id),
					className: cn("min-h-12 rounded-2xl px-3 text-left text-sm font-medium", house.site.id === h.site.id ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: h.site.name
				}, h.site.id))
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-[28px] bg-surface-2 shadow-[var(--shadow-border)]",
				children: house.site.id === "watercourse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/hero.jpg",
					alt: "",
					className: "h-56 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-56 flex-col justify-end px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-wood",
						children: "Nine private suites"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "16 therapies · Redwood City"
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/book",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xl",
					className: "w-full rounded-2xl",
					children: "Book Now"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-2 gap-3 px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Earlier today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl text-wood",
						children: morning <= 2 ? "Quiet" : morning >= 5 ? "Busy" : "Open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							Math.round(morning),
							" of ",
							rooms.length,
							" rooms"
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Later"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl text-wood",
						children: evening >= 5 ? "Busy" : evening <= 2 ? "Quiet" : "Filling"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							Math.round(evening),
							" of ",
							rooms.length,
							" rooms"
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-6 space-y-3 px-5",
			children: [
				house.categories.slice(0, 4).map((c) => {
					const sample = house.services.find((s) => s.categoryKey === c.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pitch, {
						title: c.name,
						body: sample ? `${c.blurb} From ${displayPrice(sample.listPrice ?? sample.weekdayPrice)}.` : c.blurb
					}, c.id);
				}),
				settings.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pitch, {
					title: "Still a demo",
					body: house.site.bookingNote
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-wood",
							children: "What am I getting?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: "Checked claims, HSA/FSA notes, not a chatty front desk."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/guide",
							className: "mt-2 inline-block text-sm underline decoration-border",
							children: "Open the benefits guide"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
			className: "mt-8 mb-4 not-italic px-5 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium text-wood",
					children: ["Visit ", house.site.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), house.site.address]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: tel,
						className: "underline decoration-border",
						children: ["Call Now · ", house.site.phone]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-0.5 size-4 shrink-0" }), house.site.hoursNote]
				})
			]
		})
	] });
}
function Pitch({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium text-wood",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-muted",
			children: body
		})]
	});
}
//#endregion
export { Home as component };
