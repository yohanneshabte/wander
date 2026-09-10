import { i as PROSPECTS, r as KIND_MENU } from "./prospects-CbbhFEIU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listings-0HuyaAlv.js
var GOAL_OPTIONS = [
	{
		key: "gym",
		name: "Start gym",
		tags: [
			"gym",
			"hiit",
			"pt",
			"classes"
		]
	},
	{
		key: "sauna",
		name: "Sauna habit",
		tags: [
			"sauna",
			"infrared",
			"soak"
		]
	},
	{
		key: "sleep",
		name: "Sleep",
		tags: [
			"float",
			"rest",
			"soak"
		]
	},
	{
		key: "pain",
		name: "Pain / back",
		tags: [
			"massage",
			"soak",
			"pemf"
		]
	},
	{
		key: "recovery",
		name: "Recovery",
		tags: [
			"contrast",
			"cryo",
			"plunge",
			"compression"
		]
	},
	{
		key: "focus",
		name: "Clearer head",
		tags: [
			"float",
			"labs",
			"longevity"
		]
	}
];
function coverFor(kind) {
	if (kind === "gym" || kind === "martial") return "/listings/gym.jpg";
	if (kind === "sauna_studio" || kind === "korean_spa") return "/listings/sauna.jpg";
	if (kind === "float_lab") return "/listings/float.jpg";
	if (kind === "biotech") return "/listings/lab.jpg";
	if (kind === "medspa") return "/listings/medspa.jpg";
	return "/listings/bath.jpg";
}
function fromPrice(kind) {
	const paid = KIND_MENU[kind].filter((s) => s.listPrice > 0).map((s) => s.listPrice);
	return paid.length ? Math.min(...paid) : 0;
}
function neighborhoodOf(p) {
	const part = p.address.split(",")[0]?.trim() ?? p.city;
	return part.length < 40 ? part : p.city;
}
function asCard(p, extra) {
	return {
		...p,
		neighborhood: neighborhoodOf(p),
		fromPrice: fromPrice(p.kind),
		coverUrl: coverFor(p.kind),
		tour3dUrl: extra?.tour3dUrl ?? "",
		guestsMax: extra?.guestsMax ?? (p.kind === "gym" ? 12 : 4),
		instantBook: extra?.instantBook ?? (p.id === "watercourse-ref" || p.id === "solivana-ref"),
		houseRules: extra?.houseRules ?? "Quiet rooms. No glass. Late fee after 10 minutes.",
		cancelNote: extra?.cancelNote ?? "24-hour hold. Desk may move a late guest.",
		...extra
	};
}
var LISTING_SEED = PROSPECTS.map((p) => asCard(p, p.id === "watercourse-ref" ? {
	coverUrl: "/hero.jpg",
	instantBook: true
} : void 0));
//#endregion
export { LISTING_SEED as n, GOAL_OPTIONS as t };
