import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PHONE_TEL, i as PHONE, r as DEMO_URL, t as ADDRESS_FULL } from "./rooms-BkkvvDBx.mjs";
import { t as Button } from "./button-DQyYwP_7.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/try-rJCr-8Eb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function DeskCard({ url }) {
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let alive = true;
		import_lib.toDataURL(url, {
			width: 512,
			margin: 1,
			color: {
				dark: "#3F2A1D",
				light: "#00000000"
			},
			errorCorrectionLevel: "M"
		}).then((data) => {
			if (alive) setSrc(data);
		});
		return () => {
			alive = false;
		};
	}, [url]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "desk-card flex flex-col rounded-[28px] bg-surface px-6 py-7 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted",
				children: "Palo Alto · since 1980"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-[1.85rem] leading-tight text-wood",
				children: "Watercourse Way"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-base leading-snug text-wood",
				children: "A Journey for the Spirit, a respite for the body"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-fg",
				children: "Book the room on your phone instead of waiting 30 minutes at the desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-5 size-44 rounded-2xl bg-bg p-2",
				children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "Scan to open the Book Now demo",
					className: "size-full"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full rounded-xl bg-surface-2" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 break-all text-[11px] text-muted",
				children: url
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-wood",
				children: "Open in Safari · no account · no payment"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: [
					"Demo only — real Private Hot Tub Rooms are still booked by calling",
					" ",
					PHONE,
					". ",
					ADDRESS_FULL,
					"."
				]
			})
		]
	});
}
function TryPage() {
	function printCard() {
		window.print();
	}
	async function shareCard() {
		const payload = {
			title: "Watercourse Way · Book Now demo",
			text: "Try booking a private hot tub room on your phone. Demo only.",
			url: DEMO_URL
		};
		if (navigator.share) try {
			await navigator.share(payload);
			return;
		} catch {}
		await navigator.clipboard.writeText(DEMO_URL);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh w-full max-w-lg bg-bg px-5 pb-10 pt-6 print:max-w-none print:bg-white print:px-0 print:pt-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-hide",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: "Desk card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl leading-tight text-wood",
						children: "Hand this to the desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "No login. They scan, tap Book Now, and try a room. Print two on a letter page at FedEx and leave one at 165 Channing."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 print:mt-0 print:grid print:grid-cols-2 print:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskCard, { url: DEMO_URL }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 hidden print:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskCard, { url: DEMO_URL })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-hide mt-5 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xl",
						className: "w-full",
						onClick: printCard,
						children: "Print desk cards"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "lg",
						className: "w-full",
						onClick: shareCard,
						children: "Share or copy the link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/book",
						className: "block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "lg",
							className: "w-full",
							children: "Try Book Now now"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full",
							children: "Home"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: PHONE_TEL,
						className: "pt-2 text-center text-sm text-muted",
						children: ["Real tubs: Call Now · ", PHONE]
					})
				]
			})
		]
	});
}
//#endregion
export { TryPage as component };
