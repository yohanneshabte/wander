import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-sFykTKZh.mjs";
import { t as authMiddleware } from "./middleware-B2szmp83.mjs";
import { n as HOUSES } from "./catalog-DfYcD4vg.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D5nUfZLJ.js
async function requireOwner(userId) {
	if ((await (await getSql())`
    select role from profiles where user_id = ${userId}
  `)[0]?.role !== "admin") throw new Error("Owner only.");
}
async function seedHouses() {
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from sites`)[0]?.n ?? 0) > 0) return;
	for (const house of HOUSES) {
		const s = house.site;
		await sql`
      insert into sites (
        id, slug, name, tagline, city, address, phone, website, hours_note,
        open_min, close_min, day_cutoff_min, buffer_min, max_concurrent,
        theme, booking_note, pitch
      ) values (
        ${s.id}, ${s.slug}, ${s.name}, ${s.tagline}, ${s.city}, ${s.address},
        ${s.phone}, ${s.website}, ${s.hoursNote}, ${s.openMin}, ${s.closeMin},
        ${s.dayCutoffMin}, ${s.bufferMin}, ${s.maxConcurrent}, ${s.theme},
        ${s.bookingNote}, ${s.pitch}
      )
      on conflict (id) do nothing
    `;
		for (const r of house.resources) await sql`
        insert into resources (id, site_id, name, short, blurb, kind, amenities, capacity, sort)
        values (
          ${r.id}, ${r.siteId}, ${r.name}, ${r.short}, ${r.blurb}, ${r.kind},
          ${r.amenities.join(",")}, ${r.capacity}, ${r.sort}
        )
        on conflict (id) do nothing
      `;
		for (const c of house.categories) await sql`
        insert into categories (id, site_id, key, name, blurb, sort)
        values (${c.id}, ${c.siteId}, ${c.key}, ${c.name}, ${c.blurb}, ${c.sort})
        on conflict (id) do nothing
      `;
		for (const v of house.services) await sql`
        insert into services (
          id, site_id, category_key, name, duration_min, blurb,
          weekday_price, weekend_price, evening_price, list_price,
          per_person, kind, source, sort
        ) values (
          ${v.id}, ${v.siteId}, ${v.categoryKey}, ${v.name}, ${v.durationMin},
          ${v.blurb}, ${v.weekdayPrice}, ${v.weekendPrice}, ${v.eveningPrice},
          ${v.listPrice}, ${v.perPerson}, ${v.kind}, ${v.source}, ${v.sort}
        )
        on conflict (id) do nothing
      `;
		for (const m of house.memberships) await sql`
        insert into memberships (id, site_id, name, price_month, blurb, credits, sort)
        values (
          ${m.id}, ${m.siteId}, ${m.name}, ${m.priceMonth}, ${m.blurb},
          ${m.credits}, ${m.sort}
        )
        on conflict (id) do nothing
      `;
	}
	await sql`
    update bookings set site_id = 'watercourse' where site_id is null
  `;
}
var listHouses_createServerFn_handler = createServerRpc({
	id: "161ddbc6a4fd19fcf5845abe61fea502f2c2bc1e0bb29546630865c969245a84",
	name: "listHouses",
	filename: "src/lib/platform/api.ts"
}, (opts) => listHouses.__executeServer(opts));
var listHouses = createServerFn({ method: "GET" }).handler(listHouses_createServerFn_handler, async () => {
	await seedHouses();
	return HOUSES;
});
var getPlatform_createServerFn_handler = createServerRpc({
	id: "dd65a233b2585849da6eae74660f85d0fd1f68df165423add4e0525dd140dbbb",
	name: "getPlatform",
	filename: "src/lib/platform/api.ts"
}, (opts) => getPlatform.__executeServer(opts));
var getPlatform = createServerFn({ method: "GET" }).handler(getPlatform_createServerFn_handler, async () => {
	await seedHouses();
	const row = (await (await getSql())`
    select * from platform_settings where id = 'global'
  `)[0] ?? {};
	return {
		settings: {
			liveSiteId: String(row.live_site_id ?? "watercourse"),
			previewSiteId: row.preview_site_id ?? null,
			demoMode: row.demo_mode == null ? true : Boolean(row.demo_mode),
			discoveryMode: row.discovery_mode == null ? true : Boolean(row.discovery_mode),
			houseVoice: row.house_voice == null ? true : Boolean(row.house_voice),
			directoryUnlocked: Boolean(row.directory_unlocked)
		},
		houses: HOUSES
	};
});
var savePlatform_createServerFn_handler = createServerRpc({
	id: "ee0a9cdc51b7ea875aa4b033a49f06b5b33c61e741aac7bb994d4a14c240bb7b",
	name: "savePlatform",
	filename: "src/lib/platform/api.ts"
}, (opts) => savePlatform.__executeServer(opts));
var savePlatform = createServerFn({ method: "POST" }).validator((d) => d).middleware([authMiddleware]).handler(savePlatform_createServerFn_handler, async ({ context, data }) => {
	await requireOwner(context.userId);
	await (await getSql())`
      insert into platform_settings (
        id, live_site_id, preview_site_id, demo_mode, discovery_mode, house_voice,
        directory_unlocked, updated_at
      ) values (
        'global', ${data.liveSiteId}, ${data.previewSiteId}, ${data.demoMode},
        ${data.discoveryMode}, ${data.houseVoice}, ${data.directoryUnlocked}, now()
      )
      on conflict (id) do update set
        live_site_id = excluded.live_site_id,
        preview_site_id = excluded.preview_site_id,
        demo_mode = excluded.demo_mode,
        discovery_mode = excluded.discovery_mode,
        house_voice = excluded.house_voice,
        directory_unlocked = excluded.directory_unlocked,
        updated_at = now()
    `;
	return data;
});
var houseEconomics_createServerFn_handler = createServerRpc({
	id: "4ca9b78bc66defb1b6bf9ce6aad32798ecb222b669f586f363a19cf53533c4e7",
	name: "houseEconomics",
	filename: "src/lib/platform/api.ts"
}, (opts) => houseEconomics.__executeServer(opts));
var houseEconomics = createServerFn({ method: "GET" }).handler(houseEconomics_createServerFn_handler, async () => {
	await seedHouses();
	const sql = await getSql();
	return {
		visits: await sql`
    select site_id, count(*)::int as n
    from visits
    where created_at > now() - interval '30 days'
    group by site_id
  `,
		holds: await sql`
    select site_id, count(*)::int as n from bookings group by site_id
  `,
		services: HOUSES.map((h) => ({
			id: h.site.id,
			n: h.services.length
		}))
	};
});
//#endregion
export { getPlatform_createServerFn_handler, houseEconomics_createServerFn_handler, listHouses_createServerFn_handler, savePlatform_createServerFn_handler };
