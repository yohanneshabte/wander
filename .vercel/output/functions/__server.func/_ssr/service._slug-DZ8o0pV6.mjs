import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as HOUSES } from "./catalog-DfYcD4vg.mjs";
import { n as Route$1 } from "./router-Dx54FkoQ.mjs";
import { t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as displayPrice } from "./rooms-CxF3BkGx.mjs";
import { s as OUTCOMES } from "./taxonomy-BcMkmkiX.mjs";
import { a as getModality, i as TagRow, n as ClaimCard, o as getServiceEvidence, r as HsaCard, t as BenefitChat } from "./evidence-cards-BgHTKsRB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service._slug-DZ8o0pV6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ServicePage() {
	const { slug } = Route$1.useParams();
	const [mode, setMode] = (0, import_react.useState)("load");
	const [service, setService] = (0, import_react.useState)(null);
	const [modality, setModality] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		if (HOUSES.some((h) => h.services.some((s) => s.id === slug))) getServiceEvidence({ data: slug }).then((row) => {
			if (!alive) return;
			setService(row);
			setMode(row ? "service" : "miss");
		});
		else getModality({ data: slug }).then((row) => {
			if (!alive) return;
			setModality(row);
			setMode(row ? "modality" : "miss");
		});
		return () => {
			alive = false;
		};
	}, [slug]);
	if (mode === "load") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-2xl bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-40 animate-pulse rounded-3xl bg-surface-2" })]
	}) });
	if (mode === "miss") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl text-wood",
			children: "Not in the catalog"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/guide",
			className: "mt-5 block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				children: "Open the guide"
			})
		})]
	}) });
	if (mode === "service" && service) {
		const tags = OUTCOMES.filter((t) => service.tags.includes(t.key));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pt-6 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: [
						service.house.name,
						" · ",
						service.service.categoryKey
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight text-wood",
					children: service.service.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: service.service.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-display text-2xl tabular-nums text-wood",
					children: [displayPrice(service.service.listPrice ?? service.service.weekdayPrice), service.service.durationMin ? ` · ${service.service.durationMin} min` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagRow, { tags })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex flex-col gap-3",
					children: service.reimbursement.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HsaCard, { row: r }, r.modalityKey))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
					children: "Checked claims"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-2",
					children: service.claims.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No citation on file for this add-on. Ask the guide or call the desk."
					}) : service.claims.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClaimCard, { claim: c }, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitChat, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: "mt-5 block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						children: "Hold this"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/guide",
					className: "mt-2 block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						children: "All modalities"
					})
				})
			]
		}) });
	}
	if (mode === "modality" && modality) {
		const tags = OUTCOMES.filter((t) => modality.tags.includes(t.key));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pt-6 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: [
						modality.modality.family,
						" · ",
						modality.modality.setting
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight text-wood",
					children: modality.modality.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: modality.modality.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagRow, { tags })
				}),
				modality.reimbursement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HsaCard, { row: modality.reimbursement })
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
					children: "Checked claims"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-2",
					children: modality.claims.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClaimCard, { claim: c }, c.id))
				}),
				modality.services.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
					children: "On a house menu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-col gap-2",
					children: modality.services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/service/$slug",
						params: { slug: s.id },
						className: "block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [s.siteName, s.listPrice ? ` · ${displayPrice(s.listPrice)}` : ""]
						})]
					}) }, s.id))
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "In the industry taxonomy. Not booked at the current house — useful when you pitch a medical spa or peptide clinic later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitChat, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: "mt-5 block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						children: "Book Now"
					})
				})
			]
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-2xl bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-40 animate-pulse rounded-3xl bg-surface-2" })]
	}) });
}
//#endregion
export { ServicePage as component };
