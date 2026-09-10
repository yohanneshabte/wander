//#region node_modules/.nitro/vite/services/ssr/assets/rooms-CxF3BkGx.js
var WCW_IMAGES = [
	"one-pine",
	"two-stones",
	"three-willows",
	"four-lotus",
	"five-reeds",
	"six-dragonflies",
	"seven-moon",
	"eight-stars",
	"nine-cedar"
];
function amenitiesOf(r) {
	return r.amenities.filter((a) => a === "sauna" || a === "steam" || a === "plunge");
}
function roomsOf(house) {
	return house.resources.map((r, i) => ({
		id: r.id,
		number: i + 1,
		name: r.name,
		short: r.short,
		blurb: r.blurb,
		amenities: amenitiesOf(r),
		maxGuests: r.capacity,
		image: house.site.id === "watercourse" && WCW_IMAGES[i] ? `/rooms/${WCW_IMAGES[i]}.jpg` : ""
	}));
}
function displayPrice(n) {
	if (n == null) return "—";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: n % 1 === 0 ? 0 : 2
	}).format(n);
}
//#endregion
export { roomsOf as n, displayPrice as t };
