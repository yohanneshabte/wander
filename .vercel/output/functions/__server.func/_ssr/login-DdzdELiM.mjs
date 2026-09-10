import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { M as useCurrentUserState, g as useHouse, o as Route$8 } from "./router-Dx54FkoQ.mjs";
import { t as AuthForm } from "./auth-form-CXhnJ5ya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DdzdELiM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { next, error } = Route$8.useSearch();
	const { user, isPending } = useCurrentUserState();
	const house = useHouse();
	(0, import_react.useEffect)(() => {
		if (error) toast("Google or X sign-in did not finish. Try again or use email.");
	}, [error]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh w-full max-w-lg bg-bg px-5 pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-2xl bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-48 animate-pulse rounded-3xl bg-surface-2" })]
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: next });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh w-full max-w-lg bg-bg px-5 pb-10 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: house.site.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight text-wood",
				children: "Sign in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Tap Google or X, or use email. Same account for guests and the desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthForm, { next })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-center text-xs leading-relaxed text-muted",
				children: ["Demo only — ", house.site.bookingNote]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 block min-h-11 text-center text-sm text-wood",
				children: "Back home"
			})
		]
	});
}
//#endregion
export { Login as component };
