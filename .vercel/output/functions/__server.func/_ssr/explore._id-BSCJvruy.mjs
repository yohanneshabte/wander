import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as REGION_LABEL, n as KIND_LABEL, r as KIND_MENU, t as GAP_LABEL } from "./prospects-CbbhFEIU.mjs";
import { w as todayISO } from "./engine-C6YUwjC7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { M as useCurrentUserState, h as setHousePick, p as useProfile, r as Route$2, u as refreshSpa, x as requestHold } from "./router-Dx54FkoQ.mjs";
import { r as formatMoney, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { a as noteWeekHit, i as VISUAL_TAGS, n as TagChip, o as placeById, s as placeMatchesTag } from "./goals-local-Bquhw7Qj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore._id-BSCJvruy.js
var import_jsx_runtime = require_jsx_runtime();
function RoomTour({ url, title }) {
	if (!url) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-[28px] bg-wood px-5 py-10 text-wood-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide opacity-70",
				children: "3D room"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl leading-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed opacity-80",
				children: "Store can paste a Matterport or Kuula link. Until then, this is the hold — not a fake walkthrough."
			})
		]
	});
	if (!/^https:\/\//i.test(url)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: url,
		className: "block rounded-2xl bg-surface px-4 py-3 text-sm",
		children: "Open 3D view"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title: `3D tour of ${title}`,
			src: url,
			className: "h-56 w-full",
			allow: "xr-spatial-tracking; fullscreen; web-share",
			loading: "lazy"
		})
	});
}
function ListingPage() {
	const { id } = Route$2.useParams();
	const navigate = useNavigate();
	const { user } = useCurrentUserState();
	const { role } = useProfile();
	const listing = placeById(id);
	if (!listing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Not in the 100-mile catalog."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/search",
			className: "mt-4 block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				children: "Search"
			})
		})]
	}) });
	const menu = KIND_MENU[listing.kind];
	const live = listing.id === "watercourse-ref" || listing.id === "solivana-ref";
	const listingId = listing.id;
	const tags = VISUAL_TAGS.filter((t) => placeMatchesTag(listing, t.key));
	async function hold(serviceName) {
		if (!user) {
			await navigate({
				to: "/login",
				search: { next: `/explore/${id}` }
			});
			return;
		}
		try {
			if (live) {
				setHousePick(listingId === "solivana-ref" ? "solivana" : "watercourse");
				await navigate({ to: "/book" });
				return;
			}
			const saved = await requestHold({ data: {
				listingId,
				serviceName,
				date: todayISO()
			} });
			for (const t of tags) noteWeekHit(t.key, todayISO());
			refreshSpa();
			toast(`Hold at ${saved.house}.`);
			await navigate({ to: "/account" });
		} catch (err) {
			toast(err instanceof Error ? err.message : "Could not hold");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: listing.coverUrl,
				alt: "",
				className: "h-52 w-full rounded-[28px] object-cover outline outline-1 -outline-offset-1 outline-black/10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs font-medium uppercase tracking-wide text-muted",
				children: [
					REGION_LABEL[listing.region],
					" · ",
					KIND_LABEL[listing.kind]
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight text-wood text-balance",
				children: listing.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: listing.address
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-display text-2xl tabular-nums text-wood",
				children: ["from ", formatMoney(listing.fromPrice)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-pretty",
				children: listing.pitch
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: GAP_LABEL[listing.bookingGap]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagChip, {
					tag: t.key,
					onClick: () => navigate({
						to: "/search",
						search: { tag: t.key }
					})
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomTour, {
					url: listing.tour3dUrl,
					title: listing.name
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Menu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: menu.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [s.durationMin ? `${s.durationMin} min · ` : "", s.blurb]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular-nums",
							children: formatMoney(s.listPrice)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "mt-1",
							onClick: () => void hold(s.name),
							children: user ? "Hold" : "Sign in to hold"
						})]
					})]
				}, s.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "House rules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted",
						children: listing.houseRules
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: listing.cancelNote
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/search",
				className: "mt-6 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "w-full",
					children: "Back to Search"
				})
			}),
			role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Owner: this listing is modeled, not affiliated."
			}) : null
		]
	}) });
}
//#endregion
export { ListingPage as component };
