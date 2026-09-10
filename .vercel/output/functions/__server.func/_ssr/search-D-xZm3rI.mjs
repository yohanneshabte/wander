import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as KIND_LABEL } from "./prospects-CbbhFEIU.mjs";
import { c as Sparkle, u as Search } from "../_libs/lucide-react.mjs";
import { a as Route$6 } from "./router-Dx54FkoQ.mjs";
import { n as cn, r as formatMoney } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as ANCHORS } from "./geo-DWjIw1bc.mjs";
import { c as readGoals, d as weekCount, i as VISUAL_TAGS, l as searchPlaces, n as TagChip, r as TagIcon, t as HEALTH_GOALS, u as toggleGoal } from "./goals-local-Bquhw7Qj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-D-xZm3rI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TARGET = 3;
function HealthFollow({ active, onPick }) {
	const [goals, setGoals] = (0, import_react.useState)([]);
	const [, setN] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setGoals(readGoals());
		const on = () => {
			setGoals(readGoals());
			setN((x) => x + 1);
		};
		window.addEventListener("wander-goals", on);
		window.addEventListener("storage", on);
		return () => {
			window.removeEventListener("wander-goals", on);
			window.removeEventListener("storage", on);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wide text-muted",
			children: "Follow your week"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: "Tap a ring to filter Search. It fills when you hold a session this week. Target is three."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-2 overflow-x-auto pb-1",
			children: HEALTH_GOALS.map((g) => {
				const n = Math.min(weekCount(g.key), TARGET);
				const pinned = goals.includes(g.key);
				const on = active === g.key;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (!goals.includes(g.key)) setGoals(toggleGoal(g.key));
						onPick(on ? "" : g.key);
					},
					className: cn("flex min-w-[4.6rem] flex-col items-center gap-1 rounded-2xl px-2 py-2", on ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
							n,
							on,
							tag: g.key
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium",
							children: g.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("text-[10px] tabular-nums", on ? "opacity-70" : "text-muted"),
							children: [
								n,
								"/",
								TARGET,
								pinned ? " · on" : ""
							]
						})
					]
				}, g.key);
			})
		})
	] });
}
function Ring({ n, on, tag }) {
	const pct = n / TARGET;
	const r = 16;
	const c = 2 * Math.PI * r;
	const dash = c * pct;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative grid size-11 place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 40 40",
			className: "absolute inset-0 size-11 -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "20",
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3",
				className: on ? "opacity-20" : "text-sage-soft"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "20",
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3",
				strokeDasharray: `${dash} ${c}`,
				strokeLinecap: "round",
				className: on ? "text-wood-fg" : "text-sage"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagIcon, {
			tag,
			className: "relative size-4"
		})]
	});
}
function SearchPage() {
	const nav = Route$6.useSearch();
	const navigate = Route$6.useNavigate();
	const [draft, setDraft] = (0, import_react.useState)(nav.q ?? "");
	const [anchor, setAnchor] = (0, import_react.useState)("sanLeandro");
	const [goals, setGoals] = (0, import_react.useState)([]);
	const tag = nav.tag ?? "";
	const q = nav.q ?? "";
	(0, import_react.useEffect)(() => {
		const on = () => setGoals(readGoals());
		on();
		window.addEventListener("wander-goals", on);
		return () => window.removeEventListener("wander-goals", on);
	}, []);
	const hits = (0, import_react.useMemo)(() => searchPlaces({
		q,
		tag,
		anchor,
		radius: 100,
		goals
	}), [
		q,
		tag,
		anchor,
		goals.join(",")
	]);
	function commit(next) {
		navigate({
			to: "/search",
			search: {
				q: next.q || void 0,
				tag: next.tag || void 0
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-8 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, {
						className: "size-3.5 text-sage",
						strokeWidth: 2
					}), "Search · offline · 100 miles"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-sans text-[2.4rem] font-semibold tracking-tight text-wood",
					children: "wander"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				className: "mt-5",
				onSubmit: (e) => {
					e.preventDefault();
					commit({
						q: draft,
						tag
					});
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-14 items-center gap-3 rounded-full bg-surface px-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "size-5 text-muted",
						strokeWidth: 1.75
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Sauna, gym, Oakland, DEXA…",
						className: "h-14 flex-1 bg-transparent text-base outline-none",
						enterKeyHint: "search"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: VISUAL_TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagChip, {
					tag: t.key,
					on: tag === t.key,
					onClick: () => commit({
						q,
						tag: tag === t.key ? "" : t.key
					})
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: Object.keys(ANCHORS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAnchor(k),
					className: cn("min-h-10 shrink-0 rounded-full px-3 text-sm", anchor === k ? "bg-sage text-primary-fg" : "bg-surface shadow-[var(--shadow-border)]"),
					children: ANCHORS[k].label
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthFollow, {
					active: tag,
					onPick: (key) => commit({
						q,
						tag: key
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-xs text-muted",
				children: [
					hits.length,
					" places within ",
					100,
					" miles",
					q ? ` for “${q}”` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-3",
				children: hits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/explore/$id",
					params: { id: p.id },
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.coverUrl,
							alt: "",
							className: "h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm tabular-nums text-wood",
										children: ["from ", formatMoney(p.fromPrice)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: [
										p.city,
										" · ",
										p.dist.toFixed(1),
										" mi · ",
										KIND_LABEL[p.kind]
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-1.5",
									children: p.tags.slice(0, 4).map((t) => {
										const known = VISUAL_TAGS.find((v) => v.match.includes(t) || v.key === t);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-sage-soft px-2 py-0.5 text-[11px] text-sage",
											children: known?.label ?? t
										}, t);
									})
								})
							]
						})]
					})
				}) }, p.id))
			})
		]
	}) });
}
//#endregion
export { SearchPage as component };
