import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-sFykTKZh.mjs";
import { r as KIND_MENU } from "./prospects-CbbhFEIU.mjs";
import { n as LISTING_SEED } from "./listings-0HuyaAlv.mjs";
import { t as authMiddleware } from "./middleware-B2szmp83.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BxoSYq97.js
var STORE_CODES = {
	walnut: "perspire-wc",
	bms: "bms-sc",
	piedmont: "piedmont-springs"
};
async function seedListings() {
	const sql = await getSql();
	for (const p of LISTING_SEED) await sql`
      insert into listings (
        id, name, region, city, address, neighborhood, lat, lng, kind, tags,
        booking_gap, phone, website, pitch, house_rules, cancel_note, cover_url,
        tour3d_url, guests_max, instant_book, listed, source
      ) values (
        ${p.id}, ${p.name}, ${p.region}, ${p.city}, ${p.address}, ${p.neighborhood},
        ${p.lat}, ${p.lng}, ${p.kind}, ${p.tags.join(",")}, ${p.bookingGap},
        ${p.phone}, ${p.website}, ${p.pitch}, ${p.houseRules}, ${p.cancelNote},
        ${p.coverUrl}, ${p.tour3dUrl}, ${p.guestsMax}, ${p.instantBook}, true,
        ${p.source}
      )
      on conflict (id) do nothing
    `;
}
function toCard(row) {
	const tags = String(row.tags ?? "").split(",").filter(Boolean);
	return {
		id: String(row.id),
		name: String(row.name),
		region: row.region,
		city: String(row.city),
		address: String(row.address ?? ""),
		lat: Number(row.lat),
		lng: Number(row.lng),
		kind: row.kind,
		tags,
		bookingGap: row.booking_gap,
		phone: String(row.phone ?? ""),
		website: String(row.website ?? ""),
		pitch: String(row.pitch ?? ""),
		source: String(row.source ?? ""),
		neighborhood: String(row.neighborhood ?? row.city),
		fromPrice: 0,
		coverUrl: String(row.cover_url ?? ""),
		tour3dUrl: String(row.tour3d_url ?? ""),
		guestsMax: Number(row.guests_max) || 4,
		instantBook: Boolean(row.instant_book),
		houseRules: String(row.house_rules ?? ""),
		cancelNote: String(row.cancel_note ?? "")
	};
}
async function profile(userId) {
	return (await (await getSql())`
    select user_id, role, name, email, store_id, goals from profiles where user_id = ${userId}
  `)[0] ?? null;
}
function isAdmin(row) {
	return row?.role === "admin";
}
async function assertStore(userId, listingId) {
	const me = await profile(userId);
	if (!me) throw new Error("Sign in.");
	if (isAdmin(me)) return me;
	if (me.role === "store" && String(me.store_id ?? "") === listingId) return me;
	throw new Error("This listing is not your store.");
}
var searchListings_createServerFn_handler = createServerRpc({
	id: "dec1ba9485f77fa8dd5e3b2c06baef8bfba29661c4ea900011fca1e97aed61d6",
	name: "searchListings",
	filename: "src/lib/market/api.ts"
}, (opts) => searchListings.__executeServer(opts));
var searchListings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(searchListings_createServerFn_handler, async ({ data }) => {
	await seedListings();
	let cards = (await (await getSql())`
      select * from listings where listed = true
    `).map(toCard);
	for (const c of cards) {
		const paid = (KIND_MENU[c.kind] ?? []).filter((s) => s.listPrice > 0).map((s) => s.listPrice);
		c.fromPrice = paid.length ? Math.min(...paid) : 0;
		if (!c.coverUrl) c.coverUrl = `/listings/${c.kind === "gym" ? "gym" : "bath"}.jpg`;
	}
	if (data.region && data.region !== "all") cards = cards.filter((c) => c.region === data.region);
	if (data.kind && data.kind !== "all") cards = cards.filter((c) => c.kind === data.kind);
	if (data.tag) {
		const t = data.tag;
		cards = cards.filter((c) => {
			if (t === "gym") return c.kind === "gym" || c.kind === "martial" || c.tags.includes("gym");
			if (t === "sauna") return c.kind === "sauna_studio" || c.kind === "korean_spa" || c.kind === "bathhouse" || c.tags.includes("sauna") || c.tags.includes("infrared");
			if (t === "sleep") return c.tags.includes("float") || c.tags.includes("rest") || c.tags.includes("soak");
			if (t === "pain") return c.tags.includes("massage") || c.tags.includes("soak") || c.tags.includes("pemf");
			if (t === "recovery") return c.tags.some((x) => [
				"contrast",
				"cryo",
				"plunge",
				"compression"
			].includes(x));
			if (t === "focus") return c.kind === "biotech" || c.tags.includes("float");
			return c.tags.includes(t);
		});
	}
	if (data.maxPrice) cards = cards.filter((c) => c.fromPrice <= data.maxPrice);
	if (data.has3d) cards = cards.filter((c) => c.tour3dUrl);
	if (data.q?.trim()) {
		const q = data.q.trim().toLowerCase();
		cards = cards.filter((c) => `${c.name} ${c.city} ${c.kind} ${c.tags.join(" ")} ${c.pitch}`.toLowerCase().includes(q));
	}
	if (data.goals?.length) {
		const want = new Set(data.goals);
		cards = cards.map((c) => {
			let hit = 0;
			for (const t of c.tags) if (want.has(t) || [...want].some((g) => t.includes(g))) hit += 1;
			if (want.has("gym") && (c.kind === "gym" || c.kind === "martial")) hit += 2;
			if (want.has("sauna") && (c.kind === "sauna_studio" || c.kind === "korean_spa" || c.kind === "bathhouse")) hit += 2;
			return {
				c,
				hit
			};
		}).sort((a, b) => b.hit - a.hit).map((x) => x.c);
	}
	return cards;
});
var getListing_createServerFn_handler = createServerRpc({
	id: "49daf2d10f93ce5b292f957617d58d5a7b7560ac42d2ba61309d85b93d9922b9",
	name: "getListing",
	filename: "src/lib/market/api.ts"
}, (opts) => getListing.__executeServer(opts));
var getListing = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getListing_createServerFn_handler, async ({ data: id }) => {
	await seedListings();
	const sql = await getSql();
	const rows = await sql`
      select * from listings where id = ${id} and listed = true
    `;
	if (!rows[0]) return null;
	const card = toCard(rows[0]);
	const menu = KIND_MENU[card.kind] ?? [];
	const paid = menu.filter((s) => s.listPrice > 0).map((s) => s.listPrice);
	card.fromPrice = paid.length ? Math.min(...paid) : 0;
	return {
		listing: card,
		menu,
		media: await sql`
      select id, kind, url, caption from listing_media where listing_id = ${id} order by sort
    `
	};
});
var myStore_createServerFn_handler = createServerRpc({
	id: "954683b3ebb51999e48e03dfc461795215e6c57f4b2384d5b10bb028b26dfe06",
	name: "myStore",
	filename: "src/lib/market/api.ts"
}, (opts) => myStore.__executeServer(opts));
var myStore = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myStore_createServerFn_handler, async ({ context }) => {
	await seedListings();
	const me = await profile(context.userId);
	if (!me) throw new Error("Sign in.");
	if (me.role !== "store" && me.role !== "admin") throw new Error("Store desk only.");
	const sql = await getSql();
	const id = me.role === "admin" ? "watercourse-ref" : String(me.store_id ?? "");
	if (!id) throw new Error("No store attached.");
	const rows = await sql`select * from listings where id = ${id}`;
	return {
		listing: rows[0] ? toCard(rows[0]) : null,
		holds: await sql`
      select id, date, room_id, start_min, duration_min, guest_name, user_id
      from bookings
      where coalesce(site_id, 'watercourse') = ${id === "watercourse-ref" ? "watercourse" : id}
      order by date, start_min
    `,
		media: await sql`
      select id, kind, url, caption from listing_media where listing_id = ${id} order by sort
    `,
		storeId: id
	};
});
var saveListing_createServerFn_handler = createServerRpc({
	id: "99aa885806cadb998f2a055820055c8d147b158faaa52760dc5e92a48d3fa5d6",
	name: "saveListing",
	filename: "src/lib/market/api.ts"
}, (opts) => saveListing.__executeServer(opts));
var saveListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveListing_createServerFn_handler, async ({ context, data }) => {
	await assertStore(context.userId, data.id);
	await (await getSql())`
      update listings set
        pitch = ${data.pitch.slice(0, 400)},
        house_rules = ${data.houseRules.slice(0, 400)},
        cancel_note = ${data.cancelNote.slice(0, 200)},
        tour3d_url = ${data.tour3dUrl.slice(0, 400)},
        cover_url = ${data.coverUrl.slice(0, 400)},
        phone = ${data.phone.slice(0, 40)},
        guests_max = ${Math.max(1, Math.min(data.guestsMax, 40))},
        updated_at = now()
      where id = ${data.id}
    `;
	return { ok: true };
});
var addMedia_createServerFn_handler = createServerRpc({
	id: "7753b7239d79b1aef4f78f6d94a33c2902750b4aefd40fae7e4528f4064b388c",
	name: "addMedia",
	filename: "src/lib/market/api.ts"
}, (opts) => addMedia.__executeServer(opts));
var addMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addMedia_createServerFn_handler, async ({ context, data }) => {
	await assertStore(context.userId, data.listingId);
	const url = data.url.trim().slice(0, 500);
	if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) throw new Error("Use an https link or a path on this app.");
	const sql = await getSql();
	const id = `m-${Date.now()}`;
	await sql`
      insert into listing_media (id, listing_id, kind, url, caption, sort)
      values (${id}, ${data.listingId}, ${data.kind}, ${url}, ${data.caption.slice(0, 80)}, 0)
    `;
	if (data.kind === "tour3d") await sql`update listings set tour3d_url = ${url} where id = ${data.listingId}`;
	return {
		ok: true,
		id
	};
});
var saveGoals_createServerFn_handler = createServerRpc({
	id: "6d33c5c4282ff4430b2bf1829dada59113c29156d5f31361a4df736186e18c2c",
	name: "saveGoals",
	filename: "src/lib/market/api.ts"
}, (opts) => saveGoals.__executeServer(opts));
var saveGoals = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((goals) => goals).handler(saveGoals_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const keys = data.filter((g) => GOAL_KEYS.has(g)).slice(0, 6);
	await sql`update profiles set goals = ${keys.join(",")} where user_id = ${context.userId}`;
	return keys;
});
var GOAL_KEYS = /* @__PURE__ */ new Set([
	"gym",
	"sauna",
	"sleep",
	"pain",
	"recovery",
	"focus"
]);
var claimStore_createServerFn_handler = createServerRpc({
	id: "5033babc1b4bbbcd17b9bc5f61f37fcfa02ceb823482e578c511a58b3e6797d8",
	name: "claimStore",
	filename: "src/lib/market/api.ts"
}, (opts) => claimStore.__executeServer(opts));
var claimStore = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((code) => code.trim().toLowerCase()).handler(claimStore_createServerFn_handler, async ({ context, data: code }) => {
	const listingId = STORE_CODES[code];
	if (!listingId) throw new Error("That store code did not match.");
	if ((await profile(context.userId))?.role === "admin") return {
		role: "admin",
		storeId: listingId
	};
	await (await getSql())`
      update profiles set role = 'store', store_id = ${listingId}
      where user_id = ${context.userId} and role <> 'admin'
    `;
	return {
		role: "store",
		storeId: listingId
	};
});
var requestHold_createServerFn_handler = createServerRpc({
	id: "18b359e500c2e5278a6af2f51c474b34f858f96a194a6aec86261de4e3babd92",
	name: "requestHold",
	filename: "src/lib/market/api.ts"
}, (opts) => requestHold.__executeServer(opts));
var requestHold = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(requestHold_createServerFn_handler, async ({ context, data }) => {
	await seedListings();
	const sql = await getSql();
	const listing = await sql`
      select id, name from listings where id = ${data.listingId} and listed = true
    `;
	if (!listing[0]) throw new Error("Listing not found.");
	const me = await profile(context.userId);
	const id = `b-${Date.now()}-${Math.floor(Math.random() * 999)}`;
	const siteId = data.listingId === "watercourse-ref" ? "watercourse" : data.listingId;
	await sql`
      insert into bookings (
        id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name, site_id
      ) values (
        ${id}, ${context.userId}, 'guest', ${data.date}, ${`${data.listingId}::hold`},
        600, 60, 1, false, false, ${data.serviceName.slice(0, 80)}, 'none', 'hold',
        0, ${String(me?.name ?? "")}, ${siteId}
      )
    `;
	return {
		id,
		house: listing[0].name
	};
});
//#endregion
export { addMedia_createServerFn_handler, claimStore_createServerFn_handler, getListing_createServerFn_handler, myStore_createServerFn_handler, requestHold_createServerFn_handler, saveGoals_createServerFn_handler, saveListing_createServerFn_handler, searchListings_createServerFn_handler };
