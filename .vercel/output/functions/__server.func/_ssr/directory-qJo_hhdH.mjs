import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as REGION_LABEL, i as PROSPECTS, n as KIND_LABEL, t as GAP_LABEL } from "./prospects-CbbhFEIU.mjs";
import { n as cn } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as RoleGate } from "./role-gate-B8D6wAih.mjs";
import { n as listProspects } from "./api-CM5mYyN0.mjs";
import { n as miles, t as ANCHORS } from "./geo-DWjIw1bc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/directory-qJo_hhdH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DirectoryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
			allow: ["admin"],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryDesk, {})
		})
	});
}
function DirectoryDesk() {
	const [rows, setRows] = (0, import_react.useState)(PROSPECTS);
	const [q, setQ] = (0, import_react.useState)("");
	const [region, setRegion] = (0, import_react.useState)("all");
	const [kind, setKind] = (0, import_react.useState)("all");
	const [gap, setGap] = (0, import_react.useState)("all");
	const [tag, setTag] = (0, import_react.useState)("");
	const [anchor, setAnchor] = (0, import_react.useState)("sanLeandro");
	(0, import_react.useEffect)(() => {
		listProspects().then(setRows).catch(() => setRows(PROSPECTS));
	}, []);
	const tags = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		for (const r of rows) for (const t of r.tags) s.add(t);
		return [...s].sort();
	}, [rows]);
	const origin = ANCHORS[anchor];
	const filtered = rows.filter((p) => region === "all" ? true : p.region === region).filter((p) => kind === "all" ? true : p.kind === kind).filter((p) => gap === "all" ? true : p.bookingGap === gap).filter((p) => tag ? p.tags.includes(tag) : true).filter((p) => {
		if (!q.trim()) return true;
		return `${p.name} ${p.city} ${p.kind} ${p.tags.join(" ")} ${p.pitch}`.toLowerCase().includes(q.trim().toLowerCase());
	}).map((p) => ({
		p,
		dist: miles(origin, p)
	})).sort((a, b) => a.dist - b.dist);
	const pitchable = filtered.filter((x) => x.p.bookingGap === "phone" || x.p.bookingGap === "walkin" || x.p.bookingGap === "weak_web");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Hidden · owner only · not on the public QR"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-wood",
				children: "Bay Area directory"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: [rows.length, " modeled prospects. Gym, infrared, bathhouse, Korean spa, longevity. Not affiliated — a private hit list until you research each house. OSM dump failed from this sandbox; this is a curated fill of the same schema."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Search"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 text-base shadow-[var(--shadow-border)]",
					placeholder: "sauna, Fremont, peptides, desk…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: [
					"all",
					"east",
					"west",
					"south"
				].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: region === r,
					onClick: () => setRegion(r),
					children: r === "all" ? "All bays" : REGION_LABEL[r]
				}, r))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: kind === "all",
					onClick: () => setKind("all"),
					children: "Any kind"
				}), Object.keys(KIND_LABEL).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: kind === k,
					onClick: () => setKind(k),
					children: KIND_LABEL[k]
				}, k))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: [
					"all",
					"phone",
					"walkin",
					"weak_web",
					"app"
				].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: gap === g,
					onClick: () => setGap(g),
					children: g === "all" ? "Any booking" : GAP_LABEL[g]
				}, g))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: !tag,
					onClick: () => setTag(""),
					children: "Any tag"
				}), tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: tag === t,
					onClick: () => setTag(t),
					children: t
				}, t))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: Object.keys(ANCHORS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					on: anchor === k,
					onClick: () => setAnchor(k),
					children: ["Near ", ANCHORS[k].label]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-muted",
				children: [
					filtered.length,
					" shown · ",
					pitchable.length,
					" still phone / walk-in / weak web"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: filtered.map(({ p, dist }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/directory/$id",
					params: { id: p.id },
					className: "block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tabular-nums text-muted",
								children: [dist.toFixed(1), " mi"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								p.city,
								" · ",
								KIND_LABEL[p.kind],
								" · ",
								GAP_LABEL[p.bookingGap]
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-fg/80",
							children: p.pitch
						})
					]
				}) }, p.id))
			})
		]
	});
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-10 shrink-0 rounded-full px-3 text-sm", on ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
		children
	});
}
//#endregion
export { DirectoryPage as component };
