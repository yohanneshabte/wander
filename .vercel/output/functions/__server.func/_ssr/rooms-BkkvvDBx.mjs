//#region node_modules/.nitro/vite/services/ssr/assets/rooms-BkkvvDBx.js
var PHONE = "650-462-2000";
var PHONE_TEL = "tel:+16504622000";
var ADDRESS_FULL = "165 Channing Avenue, Palo Alto, CA 94301";
/** Hidden print QR target. Not linked from public nav. */
var DEMO_URL = "https://flora-berry-ever-island.grok.me";
var DAY_CUTOFF_MIN = 1060;
/** Square card-not-present (online / stored card on file). */
var SQUARE_PERCENT = 2.9;
var ROOMS = [
	{
		id: "one-pine",
		number: 1,
		name: "One Pine",
		short: "Pine",
		blurb: "Multi-jetted wood tub, sauna & cold plunge.",
		amenities: ["sauna", "plunge"],
		maxGuests: 4,
		image: "/rooms/one-pine.jpg"
	},
	{
		id: "two-stones",
		number: 2,
		name: "Two Stones",
		short: "Stones",
		blurb: "Wood tub, sauna, and cold plunge.",
		amenities: ["sauna", "plunge"],
		maxGuests: 4,
		image: "/rooms/two-stones.jpg"
	},
	{
		id: "three-willows",
		number: 3,
		name: "Three Willows",
		short: "Willows",
		blurb: "Private hot tub with steam. Quiet solitude.",
		amenities: ["steam"],
		maxGuests: 3,
		image: "/rooms/three-willows.jpg"
	},
	{
		id: "four-lotus",
		number: 4,
		name: "Four Lotus",
		short: "Lotus",
		blurb: "Hot Tub, shower, and resting area.",
		amenities: [],
		maxGuests: 2,
		image: "/rooms/four-lotus.jpg"
	},
	{
		id: "five-reeds",
		number: 5,
		name: "Five Reeds",
		short: "Reeds",
		blurb: "Hot Tub only. A quieter room for two.",
		amenities: [],
		maxGuests: 2,
		image: "/rooms/five-reeds.jpg"
	},
	{
		id: "six-dragonflies",
		number: 6,
		name: "Six Dragonflies",
		short: "Dragons",
		blurb: "Sauna and therapeutic cold plunge.",
		amenities: ["sauna", "plunge"],
		maxGuests: 4,
		image: "/rooms/six-dragonflies.jpg"
	},
	{
		id: "seven-moon",
		number: 7,
		name: "Seven Moon",
		short: "Moon",
		blurb: "Hot tub with steam. Lantern light.",
		amenities: ["steam"],
		maxGuests: 3,
		image: "/rooms/seven-moon.jpg"
	},
	{
		id: "eight-stars",
		number: 8,
		name: "Eight Stars",
		short: "Stars",
		blurb: "Connecting rooms for groups. Sauna.",
		amenities: ["sauna"],
		maxGuests: 6,
		image: "/rooms/eight-stars.jpg"
	},
	{
		id: "nine-cedar",
		number: 9,
		name: "Nine Cedar",
		short: "Cedar",
		blurb: "Cedar hot tub, sauna, and cold plunge.",
		amenities: ["sauna", "plunge"],
		maxGuests: 4,
		image: "/rooms/nine-cedar.jpg"
	}
];
var ROOM_BY_ID = Object.fromEntries(ROOMS.map((r) => [r.id, r]));
function roomHasHeat(room) {
	return room.amenities.includes("sauna") || room.amenities.includes("steam");
}
function amenityLabel(room) {
	if (!room.amenities.length) return "Hot Tub";
	const extras = [];
	if (room.amenities.includes("sauna")) extras.push("Sauna");
	if (room.amenities.includes("steam")) extras.push("Steam");
	if (room.amenities.includes("plunge")) extras.push("Cold Plunge");
	return `Hot Tub with ${extras.join(" · ")}`;
}
//#endregion
export { PHONE_TEL as a, SQUARE_PERCENT as c, PHONE as i, amenityLabel as l, DAY_CUTOFF_MIN as n, ROOMS as o, DEMO_URL as r, ROOM_BY_ID as s, ADDRESS_FULL as t, roomHasHeat as u };
