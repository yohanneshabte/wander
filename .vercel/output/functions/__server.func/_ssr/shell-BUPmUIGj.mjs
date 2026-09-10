import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as CalendarRange, E as ChartLine, g as House, k as CalendarDays, o as Store, r as UserRound, u as Search } from "../_libs/lucide-react.mjs";
import { M as useCurrentUserState, c as joinDesk, p as useProfile } from "./router-Dx54FkoQ.mjs";
import { n as cn } from "./button-DQyYwP_7.mjs";
import { n as consumeDeskCode } from "./auth-form-CXhnJ5ya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-BUPmUIGj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Shell({ children, wide }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user, isPending } = useCurrentUserState();
	const { role } = useProfile();
	const staff = role === "staff" || role === "admin";
	const store = role === "store";
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const code = consumeDeskCode();
		if (code) joinDesk(code).catch(() => {});
	}, [user?.id]);
	const tabs = staff ? [
		{
			to: "/",
			label: "Home",
			icon: House
		},
		{
			to: "/search",
			label: "Search",
			icon: Search
		},
		{
			to: "/calendar",
			label: "Calendar",
			icon: CalendarRange
		},
		{
			to: "/insights",
			label: "Desk",
			icon: ChartLine
		}
	] : store ? [
		{
			to: "/",
			label: "Home",
			icon: House
		},
		{
			to: "/search",
			label: "Search",
			icon: Search
		},
		{
			to: "/manage",
			label: "Store",
			icon: Store
		}
	] : user ? [
		{
			to: "/",
			label: "Home",
			icon: House
		},
		{
			to: "/search",
			label: "Search",
			icon: Search
		},
		{
			to: "/account",
			label: "Visits",
			icon: UserRound
		}
	] : [
		{
			to: "/",
			label: "Home",
			icon: House
		},
		{
			to: "/search",
			label: "Search",
			icon: Search
		},
		{
			to: "/book",
			label: "Book",
			icon: CalendarDays
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-auto flex min-h-dvh w-full flex-col bg-bg", wide ? "max-w-lg md:max-w-4xl" : "max-w-lg"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-5 pt-3",
				children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-24 animate-pulse rounded-full bg-surface-2" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account",
					className: "text-sm font-medium text-wood",
					children: user.displayName ?? user.primaryEmail ?? "Account"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					search: { next: pathname },
					className: "text-sm font-medium text-wood",
					children: "Sign in"
				}), role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Owner"
				}) : role === "staff" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Desk"
				}) : role === "store" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Store"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: cn("fixed inset-x-0 bottom-0 z-40 mx-auto border-t border-border bg-surface/95 backdrop-blur-md", wide ? "max-w-lg md:max-w-4xl" : "max-w-lg"),
				style: { paddingBottom: "env(safe-area-inset-bottom)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cn("grid px-1 pt-1", tabs.length === 4 ? "grid-cols-4" : "grid-cols-3"),
					children: tabs.map((tab) => {
						const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
						const Icon = tab.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: tab.to,
							className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium", active ? "text-wood" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: cn("size-5", active && "stroke-[2.25]"),
								strokeWidth: active ? 2.25 : 1.75
							}), tab.label]
						}) }, tab.to);
					})
				})
			})
		]
	});
}
//#endregion
export { Shell as t };
