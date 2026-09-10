import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { n as auth } from "./server-D92Swi5E.mjs";
import { t as authMiddleware } from "./middleware-B2szmp83.mjs";
import { n as HOUSES, r as HOUSE_BY_ID, t as DEFAULT_SETTINGS } from "./catalog-DfYcD4vg.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dx54FkoQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var pingVisit = createServerFn({ method: "POST" }).validator((raw) => raw).handler(createSsrRpc("2b95c2966de4362ed00d7971a114e71f02a622fa27a974ce4467cf689f46b23f"));
var listOccupancy = createServerFn({ method: "GET" }).validator((d) => d ?? {}).handler(createSsrRpc("9bd794bb20dca1dd2892a8b83b8a171a80812c32fa5998da730f1ce3224cb6ab"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0cc2d6aa2c990b65808e47f847646a88f523860eec5e4ccdb069c8de59d670bb"));
var claimDesk = createServerFn({ method: "POST" }).validator((code) => code.trim().toLowerCase()).middleware([authMiddleware]).handler(createSsrRpc("b73274ba055c8a734624c583ccdd31ecfad29201d804914c06cf86f4c7724c6f"));
var createBooking = createServerFn({ method: "POST" }).validator((b) => b).middleware([authMiddleware]).handler(createSsrRpc("2f1953c3b23d29fb7241edde0f3bd5c3c48a2fa2c28c3f5321f58d4ba8aecd8b"));
var listMyBookings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e226af5ec0c9aacf42b9d4a2a46073f0ee67133000b31f61ac1c6bc9b7429726"));
var listStaffBookings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("12b8d372329868430fad5df9403abd210ba504b12c99ab502ab14b9d17d7182e"));
var markBookingLate = createServerFn({ method: "POST" }).validator((d) => d).middleware([authMiddleware]).handler(createSsrRpc("64caf484fd0b12dcbc888c4ef1ee1f46eaf00d86526fe573e3e44a7c64588972"));
var deleteBooking = createServerFn({ method: "POST" }).validator((id) => id).middleware([authMiddleware]).handler(createSsrRpc("b50a4959f81fd29c5adb877e6c782ba03fbff028e5592351c2f8d776e5e83521"));
var listUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("11db39beb3d1e685008fe68a9f7263cafaabc6c147b19319076486dbcd0495b4"));
var setUserRole = createServerFn({ method: "POST" }).validator((d) => d).middleware([authMiddleware]).handler(createSsrRpc("e9565ada5ccbc3fbfe780858a71eea87698c67bce1351a4a2bef879cd9363e23"));
var adminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("aa4763cfd695ef0cff025462bfd6994733d8a249fa99c6faea602ae31f6ba9d9"));
var clearHouseHolds = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1bf28b04ca9ffc4c1b289f7c4a43d46b20d5f949ec8fef8203f0ba28018ff613"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("dec1ba9485f77fa8dd5e3b2c06baef8bfba29661c4ea900011fca1e97aed61d6"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("49daf2d10f93ce5b292f957617d58d5a7b7560ac42d2ba61309d85b93d9922b9"));
var myStore = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("954683b3ebb51999e48e03dfc461795215e6c57f4b2384d5b10bb028b26dfe06"));
var saveListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("99aa885806cadb998f2a055820055c8d147b158faaa52760dc5e92a48d3fa5d6"));
var addMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("7753b7239d79b1aef4f78f6d94a33c2902750b4aefd40fae7e4528f4064b388c"));
var saveGoals = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((goals) => goals).handler(createSsrRpc("6d33c5c4282ff4430b2bf1829dada59113c29156d5f31361a4df736186e18c2c"));
var claimStore = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((code) => code.trim().toLowerCase()).handler(createSsrRpc("5033babc1b4bbbcd17b9bc5f61f37fcfa02ceb823482e578c511a58b3e6797d8"));
var requestHold = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("18b359e500c2e5278a6af2f51c474b34f858f96a194a6aec86261de4e3babd92"));
var SID = "spa-visit-sid";
function clip(value, n) {
	return value.replace(/\s+/g, " ").trim().slice(0, n);
}
function readHouse() {
	try {
		return sessionStorage.getItem("spa-house-pick") || "watercourse";
	} catch {
		return "watercourse";
	}
}
function readSessionId() {
	try {
		let id = sessionStorage.getItem(SID);
		if (!id) {
			id = crypto.randomUUID();
			sessionStorage.setItem(SID, id);
		}
		return id;
	} catch {
		return "anon";
	}
}
function parseUa(ua) {
	return {
		device: /iPhone/i.test(ua) ? "iPhone" : /iPad/i.test(ua) ? "iPad" : /Android/i.test(ua) ? "Android" : /Macintosh|Mac OS X/i.test(ua) ? "Mac" : /Windows/i.test(ua) ? "Windows" : /CrOS/i.test(ua) ? "Chromebook" : /Linux/i.test(ua) ? "Linux" : "Other",
		os: /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Android/i.test(ua) ? "Android" : /Mac OS X/i.test(ua) ? "macOS" : /Windows/i.test(ua) ? "Windows" : "Other",
		browser: /Edg\//i.test(ua) ? "Edge" : /OPR\/|Opera/i.test(ua) ? "Opera" : /Chrome\//i.test(ua) ? "Chrome" : /Safari\//i.test(ua) ? "Safari" : /Firefox\//i.test(ua) ? "Firefox" : "Other"
	};
}
function snapshotVisit(path) {
	if (typeof window === "undefined") return null;
	const nav = navigator;
	const ua = nav.userAgent || "";
	const parsed = parseUa(ua);
	const net = nav.connection;
	const conn = net?.effectiveType ? net.downlink ? `${net.effectiveType} · ${net.downlink}Mb` : net.effectiveType : "";
	return {
		path,
		sessionId: readSessionId(),
		siteId: readHouse(),
		device: parsed.device,
		os: parsed.os,
		browser: parsed.browser,
		screen: `${screen.width}×${screen.height}`,
		viewport: `${window.innerWidth}×${window.innerHeight}`,
		dpr: Number(window.devicePixelRatio || 1),
		lang: clip(nav.language || "", 24),
		tz: clip(Intl.DateTimeFormat().resolvedOptions().timeZone || "", 64),
		touch: Number(nav.maxTouchPoints || 0),
		connection: clip(conn, 32),
		referrer: clip(document.referrer || "", 180),
		ua: clip(ua, 240)
	};
}
createServerFn({ method: "GET" }).handler(createSsrRpc("161ddbc6a4fd19fcf5845abe61fea502f2c2bc1e0bb29546630865c969245a84"));
var getPlatform = createServerFn({ method: "GET" }).handler(createSsrRpc("dd65a233b2585849da6eae74660f85d0fd1f68df165423add4e0525dd140dbbb"));
var savePlatform = createServerFn({ method: "POST" }).validator((d) => d).middleware([authMiddleware]).handler(createSsrRpc("ee0a9cdc51b7ea875aa4b033a49f06b5b33c61e741aac7bb994d4a14c240bb7b"));
var houseEconomics = createServerFn({ method: "GET" }).handler(createSsrRpc("4ca9b78bc66defb1b6bf9ce6aad32798ecb222b669f586f363a19cf53533c4e7"));
var PICK_KEY = "spa-house-pick";
function readPick() {
	try {
		return sessionStorage.getItem(PICK_KEY);
	} catch {
		return null;
	}
}
function setHousePick(id) {
	try {
		if (id) sessionStorage.setItem(PICK_KEY, id);
		else sessionStorage.removeItem(PICK_KEY);
	} catch {}
	window.dispatchEvent(new Event("spa-house"));
}
function usePlatform() {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [houses, setHouses] = (0, import_react.useState)(HOUSES);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setPick(readPick());
		const on = () => setPick(readPick());
		window.addEventListener("spa-house", on);
		return () => window.removeEventListener("spa-house", on);
	}, []);
	(0, import_react.useEffect)(() => {
		let alive = true;
		getPlatform().then((p) => {
			if (!alive) return;
			setSettings(p.settings);
			setHouses(p.houses);
			setReady(true);
		}).catch(() => {
			if (alive) setReady(true);
		});
		return () => {
			alive = false;
		};
	}, []);
	const siteId = (settings.discoveryMode ? pick : null) || settings.previewSiteId || settings.liveSiteId;
	const house = HOUSE_BY_ID[siteId] ?? houses[0] ?? HOUSES[0];
	async function save(next) {
		const saved = await savePlatform({ data: next });
		setSettings(saved);
		return saved;
	}
	return {
		settings,
		houses,
		house,
		ready,
		save,
		pick: siteId
	};
}
function useHouse() {
	return usePlatform().house;
}
var tick = create((set) => ({
	n: 0,
	bump: () => set((s) => ({ n: s.n + 1 }))
}));
function refreshSpa() {
	tick.getState().bump();
}
function useAllBookings() {
	const n = tick((s) => s.n);
	const house = useHouse();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		listOccupancy({ data: { siteId: house.site.id } }).then((r) => {
			if (alive) setRows(r);
		}).catch(() => {
			if (alive) setRows([]);
		});
		return () => {
			alive = false;
		};
	}, [n, house.site.id]);
	return rows;
}
function useStaffBookings() {
	const n = tick((s) => s.n);
	const { user } = useCurrentUserState();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setRows([]);
			return;
		}
		let alive = true;
		listStaffBookings().then((r) => {
			if (alive) setRows(r);
		}).catch(() => {
			if (alive) setRows([]);
		});
		return () => {
			alive = false;
		};
	}, [n, user?.id]);
	return rows;
}
function useMyBookings() {
	const n = tick((s) => s.n);
	const { user } = useCurrentUserState();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setRows([]);
			return;
		}
		let alive = true;
		listMyBookings().then((r) => {
			if (alive) setRows(r);
		}).catch(() => {
			if (alive) setRows([]);
		});
		return () => {
			alive = false;
		};
	}, [n, user?.id]);
	return rows;
}
function useProfile() {
	const n = tick((s) => s.n);
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user) {
			setProfile(null);
			setReady(true);
			return;
		}
		let alive = true;
		setReady(false);
		getMyProfile().then((p) => {
			if (!alive) return;
			setProfile(p);
			setReady(true);
		}).catch(() => {
			if (!alive) return;
			setProfile(null);
			setReady(true);
		});
		return () => {
			alive = false;
		};
	}, [
		n,
		user?.id,
		isPending
	]);
	return {
		profile,
		role: profile?.role ?? "customer",
		ready
	};
}
async function addBooking(input) {
	const saved = await createBooking({ data: input });
	refreshSpa();
	return saved;
}
async function markLate(id, lateMinutes) {
	await markBookingLate({ data: {
		id,
		lateMinutes
	} });
	refreshSpa();
}
async function joinDesk(code) {
	try {
		const profile = await claimDesk({ data: code });
		refreshSpa();
		return profile;
	} catch (err) {
		const store = await claimStore({ data: code });
		refreshSpa();
		return store;
	}
}
var lastPing = {
	path: "",
	at: 0
};
function recordVisit(path) {
	const snap = snapshotVisit(path);
	if (!snap) return;
	const now = Date.now();
	if (snap.path === lastPing.path && now - lastPing.at < 2e3) return;
	lastPing = {
		path: snap.path,
		at: now
	};
	pingVisit({ data: snap }).catch(() => {});
}
/** HTML5 visit ping on every public page, including the printed QR URL. */
function VisitBeacon() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		recordVisit(pathname);
	}, [pathname]);
	return null;
}
function HouseTheme() {
	const { house } = usePlatform();
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.house = house.site.theme;
	}, [house.site.theme]);
	return null;
}
var styles_default = "/assets/styles-CVUuoAMy.css";
var APP_NAME = "Watercourse Way";
var Route$18 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Book a private hot-tub room at Watercourse Way from your phone. 165 Channing Ave, Palo Alto."
			},
			{
				name: "theme-color",
				content: "#F3EBDD"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Shippori+Mincho:wght@500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HouseTheme, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitBeacon, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					toastOptions: { className: "font-sans bg-surface text-fg border-border shadow-[var(--shadow-border)]" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$16 = () => import("./routes-CtH-XHSt.mjs");
var Route$17 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./account-DeRGqN0b.mjs");
var Route$16 = createFileRoute("/account")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin-C6ZO_yge.mjs");
var Route$15 = createFileRoute("/admin")({
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./book-DmO0VqD8.mjs");
var Route$14 = createFileRoute("/book")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./calendar-B0yoWkwV.mjs");
var Route$13 = createFileRoute("/calendar")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./directory-qJo_hhdH.mjs");
var Route$12 = createFileRoute("/directory")({
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./explore-DuqJxxaX.mjs");
var Route$11 = createFileRoute("/explore")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./guide-CcfoxnCk.mjs");
var Route$10 = createFileRoute("/guide")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./insights-B0LWv56s.mjs");
var Route$9 = createFileRoute("/insights")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./login-DdzdELiM.mjs");
var Route$8 = createFileRoute("/login")({
	validateSearch: (s) => ({
		next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : "/",
		...typeof s.error === "string" ? { error: s.error } : {}
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./manage-QNZhSfTA.mjs");
var Route$7 = createFileRoute("/manage")({
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./search-D-xZm3rI.mjs");
var Route$6 = createFileRoute("/search")({
	validateSearch: (raw) => ({
		q: typeof raw.q === "string" ? raw.q : void 0,
		tag: typeof raw.tag === "string" ? raw.tag : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./try-rJCr-8Eb.mjs");
var Route$5 = createFileRoute("/try")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./directory._id-DN4pHujY.mjs");
var Route$4 = createFileRoute("/directory/$id")({
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./explore.index-CuK3r70R.mjs");
var Route$3 = createFileRoute("/explore/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./explore._id-BSCJvruy.mjs");
var Route$2 = createFileRoute("/explore/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./service._slug-DZ8o0pV6.mjs");
var Route$1 = createFileRoute("/service/$slug")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AccountRoute = Route$16.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$18
});
var AdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$18
});
var BookRoute = Route$14.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => Route$18
});
var CalendarRoute = Route$13.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => Route$18
});
var DirectoryRoute = Route$12.update({
	id: "/directory",
	path: "/directory",
	getParentRoute: () => Route$18
});
var ExploreRoute = Route$11.update({
	id: "/explore",
	path: "/explore",
	getParentRoute: () => Route$18
});
var GuideRoute = Route$10.update({
	id: "/guide",
	path: "/guide",
	getParentRoute: () => Route$18
});
var InsightsRoute = Route$9.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => Route$18
});
var LoginRoute = Route$8.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$18
});
var ManageRoute = Route$7.update({
	id: "/manage",
	path: "/manage",
	getParentRoute: () => Route$18
});
var SearchRoute = Route$6.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$18
});
var TryRoute = Route$5.update({
	id: "/try",
	path: "/try",
	getParentRoute: () => Route$18
});
var DirectoryIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DirectoryRoute
});
var ExploreIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => ExploreRoute
});
var ExploreIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ExploreRoute
});
var ServiceSlugRoute = Route$1.update({
	id: "/service/$slug",
	path: "/service/$slug",
	getParentRoute: () => Route$18
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$18
});
var DirectoryRouteChildren = { DirectoryIdRoute };
var DirectoryRouteWithChildren = DirectoryRoute._addFileChildren(DirectoryRouteChildren);
var ExploreRouteChildren = {
	ExploreIdRoute,
	ExploreIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AccountRoute,
	AdminRoute,
	BookRoute,
	CalendarRoute,
	DirectoryRoute: DirectoryRouteWithChildren,
	ExploreRoute: ExploreRoute._addFileChildren(ExploreRouteChildren),
	GuideRoute,
	InsightsRoute,
	LoginRoute,
	ManageRoute,
	SearchRoute,
	TryRoute,
	ServiceSlugRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { createSsrRpc as A, saveListing as C, listStaffBookings as D, deleteBooking as E, useCurrentUserState as M, listUsers as O, saveGoals as S, clearHouseHolds as T, usePlatform as _, Route$6 as a, myStore as b, joinDesk as c, useAllBookings as d, useMyBookings as f, useHouse as g, setHousePick as h, Route$4 as i, useCurrentUser as j, setUserRole as k, markLate as l, useStaffBookings as m, Route$1 as n, Route$8 as o, useProfile as p, Route$2 as r, addBooking as s, router_exports as t, refreshSpa as u, houseEconomics as v, adminStats as w, requestHold as x, addMedia as y };
