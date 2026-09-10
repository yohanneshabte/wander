import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-D92Swi5E.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as joinDesk } from "./router-Dx54FkoQ.mjs";
import { n as cn, t as Button } from "./button-DQyYwP_7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-form-CXhnJ5ya.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CODE_KEY = "spa-desk-code";
var fieldClass = "h-12 w-full rounded-2xl bg-surface px-4 text-base shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring";
function AuthForm({ next = "/" }) {
	const [side, setSide] = (0, import_react.useState)("guest");
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const dest = next.startsWith("/") && !next.startsWith("//") ? next : "/";
	async function goHome() {
		if (side === "desk" && code.trim()) try {
			await joinDesk(code);
		} catch (err) {
			toast(err instanceof Error ? err.message : "Desk code did not match");
		}
		window.location.assign(dest);
	}
	async function onEmail(e) {
		e.preventDefault();
		if (busy) return;
		setBusy("email");
		const creds = {
			email: email.trim(),
			password
		};
		try {
			if (mode === "signup") {
				const { error } = await authClient.signUp.email({
					...creds,
					name: name.trim() || "Guest"
				});
				if (error) {
					const msg = error.message ?? "Could not create account";
					if (/already|exist|registered/i.test(msg)) {
						const retry = await authClient.signIn.email(creds);
						if (retry.error) throw new Error(retry.error.message ?? msg);
					} else throw new Error(msg);
				}
			} else {
				const { error } = await authClient.signIn.email(creds);
				if (error) {
					const msg = error.message ?? "Could not sign in";
					if (/not found|invalid|incorrect/i.test(msg)) throw new Error("Email or password did not match. Try Create account.");
					throw new Error(msg);
				}
			}
			await authClient.getSession();
			await goHome();
		} catch (err) {
			toast(err instanceof Error ? err.message : "Sign in failed");
			setBusy(null);
		}
	}
	function onSocial(providerId, label) {
		if (busy) return;
		setBusy(providerId);
		if (side === "desk" && code.trim()) try {
			sessionStorage.setItem(CODE_KEY, code.trim());
		} catch {}
		signIn(providerId, {
			callbackURL: dest,
			errorCallbackURL: "/login"
		}).catch((err) => {
			toast(err instanceof Error ? err.message : `${label} did not open. Try email below.`);
			setBusy(null);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: ["guest", "desk"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSide(key),
					className: cn("min-h-12 rounded-2xl text-base font-medium", side === key ? "bg-wood text-wood-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
					children: key === "guest" ? "Guest" : "Desk"
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: side === "guest" ? "Google, X, or email. Then hold a private hot tub." : "Same buttons, plus the desk code from the owner."
			}),
			side === "desk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 block text-xs font-medium uppercase tracking-wide text-muted",
					children: "Desk code"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: code,
					onChange: (e) => setCode(e.target.value),
					className: fieldClass,
					autoComplete: "off",
					autoCapitalize: "none",
					placeholder: "From the owner"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy !== null,
					onClick: () => onSocial(p.providerId, p.label),
					className: "flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-wood text-base font-medium text-wood-fg disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialMark, { label: p.label }), busy === p.providerId ? `Opening ${p.label}…` : `Continue with ${p.label}`]
				}, p.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-center text-xs font-medium uppercase tracking-wide text-muted",
				children: "Or email"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("signin"),
					className: cn("min-h-11 rounded-2xl text-sm font-medium", mode === "signin" ? "bg-sage text-primary-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
					children: "Sign in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("signup"),
					className: cn("min-h-11 rounded-2xl text-sm font-medium", mode === "signup" ? "bg-sage text-primary-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
					children: "Create account"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex flex-col gap-3",
				onSubmit: onEmail,
				children: [
					mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Name",
						className: fieldClass,
						autoComplete: "name"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Email",
						className: fieldClass,
						autoComplete: "email",
						autoCapitalize: "none",
						inputMode: "email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "password",
						minLength: 8,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Password · 8+ characters",
						className: fieldClass,
						autoComplete: mode === "signup" ? "new-password" : "current-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						className: "w-full",
						disabled: busy !== null,
						children: busy === "email" ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in with email"
					})
				]
			})
		]
	});
}
function SocialMark({ label }) {
	if (label === "Google") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-6 place-items-center rounded-full bg-wood-fg text-sm font-bold text-wood",
		children: "G"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-6 place-items-center rounded-full bg-wood-fg text-sm font-bold text-wood",
		children: "X"
	});
}
function consumeDeskCode() {
	try {
		const code = sessionStorage.getItem(CODE_KEY);
		if (code) sessionStorage.removeItem(CODE_KEY);
		return code;
	} catch {
		return null;
	}
}
//#endregion
export { consumeDeskCode as n, AuthForm as t };
