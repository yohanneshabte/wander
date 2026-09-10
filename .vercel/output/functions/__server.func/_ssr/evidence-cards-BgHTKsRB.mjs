import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { A as createSsrRpc } from "./router-Dx54FkoQ.mjs";
import { n as cn, t as Button } from "./button-DQyYwP_7.mjs";
import { i as HSA_LABEL, n as FDA_LABEL, r as GRADE_LABEL } from "./taxonomy-BcMkmkiX.mjs";
import { t as Textarea } from "./textarea-Bxy0Qmki.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-cards-BgHTKsRB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "GET" }).handler(createSsrRpc("7a3d62a7e41f49961a9f48812a76d36f4779d5cee1b18d9781642f676df5b29a"));
var getModality = createServerFn({ method: "GET" }).validator((key) => key).handler(createSsrRpc("ad3e4d5bad0ab9bbadb4fbf13564a29d9ad4d8d284724ba030784468b5a198f4"));
var getServiceEvidence = createServerFn({ method: "GET" }).validator((serviceId) => serviceId).handler(createSsrRpc("2f242f76a6c644b842d5dc0427250e5f350648013b86e9a89e9ff321cb2a80c8"));
var askGuide = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("3c0d1695989333152d97727b44724066bed7701a69e7a7645b250286938350bb"));
var STARTERS = [
	"Will massage help my low back — and can HSA pay?",
	"I sleep badly. Float or soak?",
	"Is Fire & Ice actually evidence-based recovery?",
	"What about peptide injections here?"
];
function BenefitChat({ tag }) {
	const [lines, setLines] = (0, import_react.useState)([{
		role: "assistant",
		content: "Ask what you want from a visit. I only answer from checked records (NCCIH, AHRQ, PubMed, IRS Pub 502). Not medical advice — and not a promise your plan will reimburse."
	}]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function send(text) {
		const message = text.trim();
		if (!message || busy) return;
		const history = lines;
		setLines((l) => [...l, {
			role: "user",
			content: message
		}]);
		setDraft("");
		setBusy(true);
		try {
			const res = await askGuide({ data: {
				message,
				history,
				tag
			} });
			const reply = res.ok ? res.text : res.error;
			setLines((l) => [...l, {
				role: "assistant",
				content: reply
			}]);
		} catch {
			setLines((l) => [...l, {
				role: "assistant",
				content: "Guide is quiet. Open a service card — the citations are on the page."
			}]);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[28px] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Benefits guide"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex max-h-80 flex-col gap-3 overflow-y-auto",
				children: [lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("rounded-2xl px-3 py-2 text-sm leading-relaxed", line.role === "user" ? "ml-8 bg-sage-soft text-fg" : "mr-4 bg-surface-2 text-fg"),
					children: line.content
				}, i)), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Checking records…"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void send(s),
					className: "min-h-10 rounded-full bg-surface-2 px-3 text-left text-xs text-fg",
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3",
				onSubmit: (e) => {
					e.preventDefault();
					send(draft);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Sleep, back pain, HSA, salt room…",
					className: "min-h-20"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-2 w-full",
					disabled: busy,
					children: "Ask the records"
				})]
			})
		]
	});
}
function HsaCard({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "HSA / FSA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-medium text-wood",
				children: HSA_LABEL[row.hsaFsa]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: row.lmnNote
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: ["FDA: ", FDA_LABEL[row.fda]]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: row.planNote
			})
		]
	});
}
function ClaimCard({ claim }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] font-medium uppercase tracking-wide text-sage",
				children: [
					"Grade ",
					claim.grade,
					" · ",
					GRADE_LABEL[claim.grade]
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed",
				children: claim.claim
			}),
			claim.population ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: ["Who: ", claim.population]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-muted",
				children: claim.caveat
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: claim.sourceUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "underline decoration-border",
					children: [
						claim.sourceName,
						claim.pmid ? ` · PMID ${claim.pmid}` : "",
						claim.year ? ` · ${claim.year}` : ""
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[11px] text-muted",
				children: ["Checked ", claim.reviewedOn]
			})
		]
	});
}
function TagRow({ tags, active, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: tags.map((t) => {
			const chip = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("inline-flex min-h-10 shrink-0 items-center rounded-full px-3 text-sm", active === t.key ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
				children: t.name
			});
			if (!onPick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chip }, t.key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onPick(t.key),
				children: chip
			}, t.key);
		})
	});
}
//#endregion
export { getModality as a, TagRow as i, ClaimCard as n, getServiceEvidence as o, HsaCard as r, BenefitChat as t };
