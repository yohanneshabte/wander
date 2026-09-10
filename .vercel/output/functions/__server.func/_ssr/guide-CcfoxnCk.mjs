import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as useHouse } from "./router-Dx54FkoQ.mjs";
import { n as cn, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { a as MODALITIES, l as mapServiceModalities, o as MODALITY_OUTCOMES, s as OUTCOMES } from "./taxonomy-BcMkmkiX.mjs";
import { i as TagRow, t as BenefitChat } from "./evidence-cards-BgHTKsRB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-CcfoxnCk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GuidePage() {
	const house = useHouse();
	const [tag, setTag] = (0, import_react.useState)("");
	const keys = (0, import_react.useMemo)(() => {
		if (!tag) return new Set(MODALITIES.map((m) => m.key));
		return new Set(MODALITY_OUTCOMES.filter(([, t]) => t === tag).map(([m]) => m));
	}, [tag]);
	const offered = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const s of house.services) for (const k of mapServiceModalities(s.id, s.categoryKey, s.name)) set.add(k);
		return set;
	}, [house.site.id]);
	const list = MODALITIES.filter((m) => keys.has(m.key));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Checked records"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight text-wood",
				children: "What am I getting?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: [
					"Industry tags, HSA/FSA notes from IRS Pub 502, and citations you can open. Not medical advice. ",
					house.site.name,
					" only offers the cards marked on this floor."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagRow, {
					tags: [{
						key: "",
						name: "All"
					}, ...OUTCOMES],
					active: tag,
					onPick: setTag
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 flex flex-col gap-2",
				children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/service/$slug",
					params: { slug: m.key },
					className: cn("block rounded-2xl px-4 py-3 shadow-[var(--shadow-border)]", offered.has(m.key) ? "bg-surface" : "bg-surface-2"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: m.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: [m.blurb, offered.has(m.key) ? ` · on ${house.site.name}` : " · taxonomy only — not on this floor"]
					})]
				}) }, m.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitChat, { tag: tag || void 0 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/book",
				className: "mt-5 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					children: "Hold a room"
				})
			})
		]
	}) });
}
//#endregion
export { GuidePage as component };
