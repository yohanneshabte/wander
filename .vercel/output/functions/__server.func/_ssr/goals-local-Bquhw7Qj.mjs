import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as LISTING_SEED } from "./listings-0HuyaAlv.mjs";
import { A as Bath, _ as HeartPulse, a as Swords, b as Dumbbell, l as Snowflake, n as Waves, p as Moon, s as Sparkles, v as FlaskConical, y as Flame } from "../_libs/lucide-react.mjs";
import { n as cn } from "./button-DQyYwP_7.mjs";
import { n as miles, t as ANCHORS } from "./geo-DWjIw1bc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goals-local-Bquhw7Qj.js
var import_jsx_runtime = require_jsx_runtime();
var VISUAL_TAGS = [
	{
		key: "gym",
		label: "Workout",
		hint: "Floor, PT, classes",
		kinds: ["gym"],
		match: [
			"gym",
			"hiit",
			"pt",
			"classes",
			"coaching"
		]
	},
	{
		key: "sauna",
		label: "Sauna",
		hint: "Heat, infrared, steam",
		kinds: ["sauna_studio", "korean_spa"],
		match: [
			"sauna",
			"infrared",
			"steam",
			"halo"
		]
	},
	{
		key: "soak",
		label: "Soak",
		hint: "Private tubs",
		kinds: ["bathhouse"],
		match: ["soak", "plunge"]
	},
	{
		key: "float",
		label: "Float",
		hint: "Rest tanks",
		kinds: ["float_lab"],
		match: ["float", "rest"]
	},
	{
		key: "recovery",
		label: "Recover",
		hint: "Cryo, contrast",
		kinds: [],
		match: [
			"cryo",
			"contrast",
			"compression",
			"plunge",
			"recovery"
		]
	},
	{
		key: "sleep",
		label: "Sleep",
		hint: "Nervous system",
		kinds: [],
		match: [
			"float",
			"rest",
			"soak"
		]
	},
	{
		key: "pain",
		label: "Back / pain",
		hint: "Massage, soak",
		kinds: [],
		match: [
			"massage",
			"soak",
			"pemf",
			"pain"
		]
	},
	{
		key: "focus",
		label: "Labs",
		hint: "DEXA, longevity",
		kinds: ["biotech"],
		match: [
			"labs",
			"dexa",
			"vo2",
			"longevity",
			"iv",
			"hbot"
		]
	},
	{
		key: "martial",
		label: "Martial",
		hint: "Mat, belts",
		kinds: ["martial"],
		match: ["classes", "mat"]
	},
	{
		key: "skin",
		label: "Skin",
		hint: "Med spa",
		kinds: ["medspa"],
		match: [
			"facial",
			"skin",
			"laser"
		]
	}
];
var HEALTH_GOALS = VISUAL_TAGS.filter((t) => [
	"gym",
	"sauna",
	"sleep",
	"pain",
	"recovery",
	"focus"
].includes(t.key));
function placeMatchesTag(place, key) {
	const tag = VISUAL_TAGS.find((t) => t.key === key);
	if (!tag) return place.tags.includes(key);
	if (tag.kinds.includes(place.kind)) return true;
	return place.tags.some((t) => tag.match.includes(t));
}
var ICONS = {
	gym: Dumbbell,
	sauna: Flame,
	soak: Bath,
	float: Waves,
	recovery: Snowflake,
	sleep: Moon,
	pain: HeartPulse,
	focus: FlaskConical,
	martial: Swords,
	skin: Sparkles
};
function TagIcon({ tag, className }) {
	const Icon = ICONS[tag] ?? Sparkles;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className: cn("size-4", className),
		strokeWidth: 1.75
	});
}
function TagChip({ tag, on, onClick, count }) {
	const meta = VISUAL_TAGS.find((t) => t.key === tag);
	if (!meta) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm", on ? "bg-wood text-wood-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("grid size-7 place-items-center rounded-full", on ? "bg-wood-fg/15" : "bg-sage-soft text-sage"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagIcon, { tag })
			}),
			meta.label,
			typeof count === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] tabular-nums opacity-70",
				children: count
			}) : null
		]
	});
}
function searchPlaces(opts = {}) {
	const origin = ANCHORS[opts.anchor ?? "sanLeandro"];
	const radius = opts.radius ?? 100;
	const q = (opts.q ?? "").trim().toLowerCase();
	let rows = LISTING_SEED.map((p) => ({
		...p,
		dist: miles(origin, p)
	})).filter((p) => p.dist <= radius);
	if (opts.tag) rows = rows.filter((p) => placeMatchesTag(p, opts.tag));
	if (opts.maxPrice) rows = rows.filter((p) => p.fromPrice <= opts.maxPrice);
	if (q) rows = rows.filter((p) => `${p.name} ${p.city} ${p.kind} ${p.tags.join(" ")} ${p.pitch}`.toLowerCase().includes(q));
	if (opts.goals?.length) {
		const g = opts.goals;
		rows.sort((a, b) => score(b, g) - score(a, g) || a.dist - b.dist);
	} else rows.sort((a, b) => a.dist - b.dist);
	return rows;
}
function score(p, goals) {
	return goals.reduce((n, g) => n + (placeMatchesTag(p, g) ? 2 : 0), 0);
}
function placeById(id) {
	return LISTING_SEED.find((p) => p.id === id) ?? null;
}
var GOALS_KEY = "wander-goals";
var WEEK_KEY = "wander-week";
function readGoals() {
	try {
		const raw = localStorage.getItem(GOALS_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
	} catch {
		return [];
	}
}
function writeGoals(goals) {
	try {
		localStorage.setItem(GOALS_KEY, JSON.stringify(goals.slice(0, 6)));
		window.dispatchEvent(new Event("wander-goals"));
	} catch {}
}
function toggleGoal(key) {
	const cur = new Set(readGoals());
	if (cur.has(key)) cur.delete(key);
	else cur.add(key);
	writeGoals([...cur]);
	return [...cur];
}
function noteWeekHit(tag, date) {
	try {
		const raw = localStorage.getItem(WEEK_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		const rows = Array.isArray(parsed) ? parsed : [];
		rows.push({
			date,
			tag
		});
		localStorage.setItem(WEEK_KEY, JSON.stringify(rows.slice(-40)));
		window.dispatchEvent(new Event("wander-goals"));
	} catch {}
}
function weekCount(tag) {
	try {
		const raw = localStorage.getItem(WEEK_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		const cutoff = Date.now() - 6048e5;
		return parsed.filter((h) => h.tag === tag && new Date(h.date).getTime() >= cutoff).length;
	} catch {
		return 0;
	}
}
//#endregion
export { noteWeekHit as a, readGoals as c, weekCount as d, VISUAL_TAGS as i, searchPlaces as l, TagChip as n, placeById as o, TagIcon as r, placeMatchesTag as s, HEALTH_GOALS as t, toggleGoal as u };
