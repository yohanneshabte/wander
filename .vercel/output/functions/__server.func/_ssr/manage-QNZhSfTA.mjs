import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as formatDateLabel, s as formatRange } from "./engine-C6YUwjC7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as saveListing, b as myStore, y as addMedia } from "./router-Dx54FkoQ.mjs";
import { t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { t as RoleGate } from "./role-gate-B8D6wAih.mjs";
import { t as Textarea } from "./textarea-Bxy0Qmki.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/manage-QNZhSfTA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManagePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: ["store", "admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageDesk, {})
	}) });
}
function ManageDesk() {
	const [data, setData] = (0, import_react.useState)(null);
	const [pitch, setPitch] = (0, import_react.useState)("");
	const [rules, setRules] = (0, import_react.useState)("");
	const [cancel, setCancel] = (0, import_react.useState)("");
	const [tour, setTour] = (0, import_react.useState)("");
	const [cover, setCover] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [mediaUrl, setMediaUrl] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	function hydrate() {
		myStore().then((row) => {
			setData(row);
			if (row.listing) {
				setPitch(row.listing.pitch);
				setRules(row.listing.houseRules);
				setCancel(row.listing.cancelNote);
				setTour(row.listing.tour3dUrl);
				setCover(row.listing.coverUrl);
				setPhone(row.listing.phone);
			}
		}).catch((err) => toast(err instanceof Error ? err.message : "Store locked"));
	}
	(0, import_react.useEffect)(() => {
		hydrate();
	}, []);
	if (!data?.listing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-5 pt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No store on this account."
		})
	});
	const listing = data.listing;
	async function save() {
		setBusy(true);
		try {
			await saveListing({ data: {
				id: listing.id,
				pitch,
				houseRules: rules,
				cancelNote: cancel,
				tour3dUrl: tour,
				coverUrl: cover,
				phone,
				guestsMax: listing.guestsMax
			} });
			toast("Listing saved — only your store.");
			hydrate();
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	async function media() {
		if (!mediaUrl.trim()) return;
		setBusy(true);
		try {
			await addMedia({ data: {
				listingId: listing.id,
				url: mediaUrl.trim(),
				kind: mediaUrl.includes("matterport") || mediaUrl.includes("kuula") ? "tour3d" : "photo",
				caption: "Store upload"
			} });
			setMediaUrl("");
			toast("Media attached.");
			hydrate();
		} catch (err) {
			toast(err instanceof Error ? err.message : "Link rejected");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Store portal · partitioned"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-wood",
				children: listing.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "You only see holds for this house. Other stores are sealed off."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-5 block text-sm",
				children: ["Pitch", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-1",
					value: pitch,
					onChange: (e) => setPitch(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["House rules", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-1",
					value: rules,
					onChange: (e) => setRules(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["Cancel note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
					value: cancel,
					onChange: (e) => setCancel(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["3D tour URL (Matterport, Kuula)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
					value: tour,
					onChange: (e) => setTour(e.target.value),
					placeholder: "https://my.matterport.com/show/?m=…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["Cover image URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
					value: cover,
					onChange: (e) => setCover(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm",
				children: ["Phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
					value: phone,
					onChange: (e) => setPhone(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4 w-full",
				onClick: () => void save(),
				disabled: busy,
				children: "Save listing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Add photo or 3D link"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "min-h-12 flex-1 rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
					value: mediaUrl,
					onChange: (e) => setMediaUrl(e.target.value),
					placeholder: "https://…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "h-12",
					onClick: () => void media(),
					disabled: busy,
					children: "Add"
				})]
			}),
			data.media.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: data.media.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "truncate text-xs text-muted",
					children: [
						m.kind,
						" · ",
						m.url
					]
				}, m.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Holds on this floor only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: data.holds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 text-sm text-muted",
					children: "No holds yet."
				}) : data.holds.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: h.guest_name || "Guest"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							formatDateLabel(h.date),
							" · ",
							formatRange(h.start_min, h.duration_min)
						]
					})]
				}, h.id))
			})
		]
	});
}
//#endregion
export { ManagePage as component };
