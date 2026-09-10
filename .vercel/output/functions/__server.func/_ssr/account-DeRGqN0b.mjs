import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./server-D92Swi5E.mjs";
import { t as GOAL_OPTIONS } from "./listings-0HuyaAlv.mjs";
import { o as ROOMS } from "./rooms-BkkvvDBx.mjs";
import { o as formatDateLabel, s as formatRange } from "./engine-C6YUwjC7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { M as useCurrentUserState, S as saveGoals, c as joinDesk, f as useMyBookings, j as useCurrentUser, p as useProfile, u as refreshSpa } from "./router-Dx54FkoQ.mjs";
import { n as cn, t as Button } from "./button-DQyYwP_7.mjs";
import { t as Shell } from "./shell-BUPmUIGj.mjs";
import { n as SignInRequired } from "./role-gate-B8D6wAih.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-DeRGqN0b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AccountPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInRequired, {
		next: "/account",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBody, {})
	}) });
}
function AccountBody() {
	const { user } = useCurrentUserState();
	const { profile, role } = useProfile();
	const bookings = useMyBookings();
	const [code, setCode] = (0, import_react.useState)("");
	const staff = role === "staff" || role === "admin";
	const store = role === "store";
	const selected = new Set(profile?.goals ?? []);
	async function claim() {
		try {
			const next = await joinDesk(code);
			toast(next.role === "admin" ? "Owner access is on." : next.role === "store" ? "Store portal is on — only your house." : "Desk access is on.");
			setCode("");
		} catch (err) {
			toast(err instanceof Error ? err.message : "Code did not match");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: role === "admin" ? "Owner" : role === "staff" ? "Desk" : "Guest"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-wood",
				children: user?.displayName ?? profile?.name ?? "Your visits"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
			}),
			staff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "You can open the floor calendar and Front Desk. Owner tools stay off the public menu."
			}) : store ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Store portal is on. Other houses cannot see your guests."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "I run a house"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: code,
						onChange: (e) => setCode(e.target.value),
						placeholder: "Desk or store code",
						className: "h-12 flex-1 rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "h-12",
						onClick: claim,
						disabled: !code.trim(),
						children: "Join"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Health goals"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Rank gyms and soaks around you. One account, several houses."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: GOAL_OPTIONS.map((g) => {
					const on = selected.has(g.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("min-h-10 rounded-full px-3 text-sm", on ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]"),
						onClick: () => {
							const next = new Set(selected);
							if (on) next.delete(g.key);
							else next.add(g.key);
							saveGoals({ data: [...next] }).then(() => {
								refreshSpa();
								toast("Goals saved.");
							}).catch(() => toast("Could not save goals"));
						},
						children: g.name
					}, g.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-xs font-medium uppercase tracking-wide text-muted",
				children: "My holds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: bookings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]",
					children: "No rooms held yet."
				}) : bookings.map((b) => {
					const room = ROOMS.find((r) => r.id === b.roomId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: room?.name ?? b.roomId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								formatDateLabel(b.date),
								" · ",
								formatRange(b.startMin, b.durationMin)
							]
						})]
					}, b.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/book",
				className: "mt-6 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					children: "Book Now"
				})
			})
		]
	});
}
//#endregion
export { AccountPage as component };
