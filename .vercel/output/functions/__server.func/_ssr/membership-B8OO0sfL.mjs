import { c as SQUARE_PERCENT, n as DAY_CUTOFF_MIN, o as ROOMS } from "./rooms-BkkvvDBx.mjs";
import { b as quotePrice } from "./engine-C6YUwjC7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/membership-B8OO0sfL.js
var MEMBER_TIERS = [
	{
		id: "weekday",
		name: "Weekday Soak",
		tag: "4 hours",
		price: 99,
		hours: 4,
		extraTub: 14,
		extraHeat: 18,
		eveningIncluded: false,
		waiveLate: false,
		blurb: "Four hours before 5:40pm. Extra day hours at the member rate. Fills the quiet morning rooms."
	},
	{
		id: "anytime",
		name: "Anytime Soak",
		tag: "8 hours",
		price: 159,
		hours: 8,
		extraTub: 16,
		extraHeat: 20,
		eveningIncluded: true,
		waiveLate: false,
		blurb: "Eight hours any day, including evening. One late-fee waiver a month."
	},
	{
		id: "house",
		name: "House Circle",
		tag: "Unlimited day",
		price: 199,
		hours: 16,
		extraTub: 18,
		extraHeat: 22,
		eveningIncluded: true,
		waiveLate: true,
		blurb: "Unlimited weekday day soaks, four evening hours, late fee waived, first hold on member rooms."
	}
];
var DROP_IN = {
	id: "none",
	name: "Drop-in",
	tag: "Per visit",
	price: 0,
	hours: 0,
	extraTub: 18,
	extraHeat: 23,
	eveningIncluded: true,
	waiveLate: false,
	blurb: "Day and evening rates, billed per person per hour."
};
function tierById(id) {
	if (id === "none") return DROP_IN;
	return MEMBER_TIERS.find((t) => t.id === id) ?? DROP_IN;
}
function lateFeeFor(opts) {
	if (opts.lateMinutes < 10) return 0;
	if (tierById(opts.memberTier).waiveLate) return 0;
	return 15;
}
function squareTake(amount, txns = 1) {
	if (amount <= 0) return 0;
	return Math.round((amount * (SQUARE_PERCENT / 100) + 30 / 100 * txns) * 100) / 100;
}
function priceVisit(opts) {
	const drop = quotePrice(opts);
	const tier = tierById(opts.memberTier ?? "none");
	const evening = opts.startMin >= DAY_CUTOFF_MIN;
	const hours = opts.durationMin / 60;
	let soak = drop.total;
	let covered = false;
	if (tier.id !== "none") {
		if ((!evening || tier.eveningIncluded) && hours <= tier.hours) {
			soak = 0;
			covered = true;
		} else {
			const extra = opts.withSauna ? tier.extraHeat : tier.extraTub;
			soak = Math.round(extra * hours * opts.guests * 100) / 100;
		}
	}
	const late = lateFeeFor({
		lateMinutes: opts.lateMinutes ?? 0,
		memberTier: tier.id
	});
	const due = Math.round((soak + late) * 100) / 100;
	return {
		...drop,
		dropInTotal: drop.total,
		soak,
		covered,
		lateFee: late,
		due,
		squareFee: squareTake(due),
		net: Math.round((due - squareTake(due)) * 100) / 100,
		tier
	};
}
function simulateCircle(s) {
	const tier = tierById(s.tierId);
	const mrr = s.members * tier.price;
	const extraRev = s.members * s.extraHours * ((tier.extraTub + tier.extraHeat) / 2);
	const memberHours = s.members * (s.hoursUsed + s.extraHours);
	const cannibal = Math.min(s.walkInRevenue * (s.cannibalPct / 100), memberHours * 22);
	const visits = s.members * Math.max(1, s.hoursUsed);
	const lateRev = tier.waiveLate ? 0 : visits * (s.latePct / 100) * 15;
	const remainingWalkIn = Math.max(0, s.walkInRevenue - cannibal);
	const gross = remainingWalkIn + mrr + extraRev + lateRev;
	const square = squareTake(gross, s.members + visits * .25);
	const todayGross = s.walkInRevenue;
	const todayNet = todayGross - squareTake(todayGross, 600);
	const newNet = gross - square;
	const todayProfit = todayNet * (1 - s.costsPct / 100);
	const newProfit = newNet * (1 - s.costsPct / 100);
	const roomShare = s.roomIds.length / ROOMS.length || 1;
	const morningLift = Math.min(6, 1.4 + s.members * .035 * roomShare);
	return {
		tier,
		mrr,
		extraRev,
		cannibal,
		lateRev,
		remainingWalkIn,
		gross,
		square,
		newNet,
		todayNet,
		todayProfit,
		newProfit,
		delta: newProfit - todayProfit,
		memberHours,
		morningLift,
		roomCount: s.roomIds.length
	};
}
var DEFAULT_MEMBER_ROOMS = ROOMS.slice(0, 4).map((r) => r.id);
//#endregion
export { priceVisit as a, tierById as c, lateFeeFor as i, DROP_IN as n, simulateCircle as o, MEMBER_TIERS as r, squareTake as s, DEFAULT_MEMBER_ROOMS as t };
