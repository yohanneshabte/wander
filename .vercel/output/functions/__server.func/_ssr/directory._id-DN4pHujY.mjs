import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as REGION_LABEL, i as PROSPECTS, n as KIND_LABEL, r as KIND_MENU, t as GAP_LABEL } from "./prospects-CbbhFEIU.mjs";
import { i as Route$4 } from "./router-Dx54FkoQ.mjs";
import { r as formatMoney, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as RoleGate } from "./role-gate-B8D6wAih.mjs";
import { t as getProspect } from "./api-CM5mYyN0.mjs";
import { r as similarTo } from "./geo-DWjIw1bc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/directory._id-DN4pHujY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlacePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: ["admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceDesk, {})
	}) });
}
function PlaceDesk() {
	const { id } = Route$4.useParams();
	const [place, setPlace] = (0, import_react.useState)(PROSPECTS.find((p) => p.id === id) ?? null);
	(0, import_react.useEffect)(() => {
		getProspect({ data: id }).then((row) => setPlace(row)).catch(() => setPlace(PROSPECTS.find((p) => p.id === id) ?? null));
	}, [id]);
	if (!place) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Not in the hidden dump."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/directory",
			className: "mt-4 block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				children: "Directory"
			})
		})]
	});
	const menu = KIND_MENU[place.kind];
	const near = similarTo(place, PROSPECTS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: [
					REGION_LABEL[place.region],
					" · ",
					KIND_LABEL[place.kind],
					" · hidden"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight text-wood",
				children: place.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: place.address
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-medium",
				children: GAP_LABEL[place.bookingGap]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed",
				children: place.pitch
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: place.source
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: place.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-surface px-3 py-1 text-xs shadow-[var(--shadow-border)]",
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Modeled menu (not their official booker)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: menu.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular-nums",
							children: formatMoney(s.listPrice)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [s.durationMin ? `${s.durationMin} min · ` : "", s.blurb]
					})]
				}, s.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Similar nearby"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: near.map(({ p, dist }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/directory/$id",
					params: { id: p.id },
					className: "block rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]",
					children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-xs text-muted",
						children: [
							p.city,
							" · ",
							dist.toFixed(1),
							" mi · ",
							GAP_LABEL[p.bookingGap]
						]
					})]
				}) }, p.id))
			}),
			place.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: place.website,
				className: "mt-5 block text-sm underline decoration-border",
				children: "Their site"
			}) : null,
			place.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: place.phone
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/directory",
				className: "mt-6 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "w-full",
					children: "Back to filters"
				})
			})
		]
	});
}
//#endregion
export { PlacePage as component };
