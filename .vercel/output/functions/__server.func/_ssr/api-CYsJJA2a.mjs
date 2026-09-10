import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-sFykTKZh.mjs";
import { g as nextDates, i as canBook, l as generateMockBookings } from "./engine-C6YUwjC7.mjs";
import { t as authMiddleware } from "./middleware-B2szmp83.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CYsJJA2a.js
var VISIT_PATHS = /* @__PURE__ */ new Set([
	"/",
	"/book",
	"/calendar",
	"/insights",
	"/login",
	"/admin",
	"/account",
	"/try",
	"/guide",
	"/search",
	"/explore",
	"/manage"
]);
function asBool(v) {
	return v === true || v === 1;
}
function toBooking(row) {
	const source = row.source === "desk" ? "guest" : row.source === "house" ? "mock" : row.source;
	return {
		id: row.id,
		userId: row.user_id,
		guestName: row.guest_name ?? "",
		source: source === "guest" ? "guest" : "mock",
		date: row.date,
		roomId: row.room_id,
		startMin: Number(row.start_min),
		durationMin: Number(row.duration_min),
		guests: Number(row.guests),
		withSauna: asBool(row.with_sauna),
		massageRequest: asBool(row.massage_request),
		massageNote: row.massage_note ?? "",
		memberTier: row.member_tier || "none",
		paidVia: row.paid_via || "desk",
		lateMinutes: Number(row.late_minutes) || 0
	};
}
function occupancyView(row) {
	const b = toBooking(row);
	return {
		id: b.id,
		source: b.source,
		date: b.date,
		roomId: b.roomId,
		startMin: b.startMin,
		durationMin: b.durationMin,
		guests: b.guests,
		withSauna: b.withSauna,
		massageRequest: b.massageRequest,
		massageNote: "",
		memberTier: b.memberTier,
		paidVia: b.paidVia,
		lateMinutes: b.lateMinutes
	};
}
async function loadProfile(userId, email, name) {
	const sql = await getSql();
	await sql`
    insert into profiles (user_id, role, name, email)
    values (${userId}, 'customer', ${name ?? ""}, ${email ?? null})
    on conflict (user_id) do update set
      email = coalesce(excluded.email, profiles.email),
      name = case
        when excluded.name <> '' then excluded.name
        else profiles.name
      end
  `;
	const row = (await sql`
    select user_id, role, name, email, store_id, goals from profiles where user_id = ${userId}
  `)[0];
	const raw = String(row.role ?? "customer");
	const role = raw === "admin" || raw === "staff" || raw === "store" ? raw : "customer";
	const goals = String(row.goals ?? "").split(",").filter(Boolean);
	return {
		userId: String(row.user_id),
		role,
		name: String(row.name ?? ""),
		email: row.email ?? null,
		storeId: row.store_id ?? null,
		goals
	};
}
function staffRole(role) {
	return role === "staff" || role === "admin" || role === "store";
}
async function houseSeed() {
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from bookings`)[0]?.n ?? 0) > 0) return;
	const mock = generateMockBookings(nextDates(16));
	for (const b of mock) await sql`
      insert into bookings (
        id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      ) values (
        ${b.id}, 'house', 'house', ${b.date}, ${b.roomId}, ${b.startMin},
        ${b.durationMin}, ${b.guests}, ${b.withSauna}, ${b.massageRequest},
        ${b.massageNote}, ${b.memberTier}, ${b.paidVia}, ${b.lateMinutes}, ''
      )
    `;
}
function clip(value, n) {
	return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, n);
}
function cleanPing(raw) {
	const path = clip(raw.path, 64).split("?")[0] || "/";
	if (!VISIT_PATHS.has(path) && !path.startsWith("/service/") && !path.startsWith("/directory/") && !path.startsWith("/explore/")) return null;
	const dpr = Number(raw.dpr);
	return {
		path,
		sessionId: clip(raw.sessionId, 64) || "anon",
		siteId: clip(raw.siteId, 32) || "watercourse",
		device: clip(raw.device, 24) || "Other",
		os: clip(raw.os, 24) || "Other",
		browser: clip(raw.browser, 24) || "Other",
		screen: clip(raw.screen, 24),
		viewport: clip(raw.viewport, 24),
		dpr: Number.isFinite(dpr) ? Math.min(Math.max(dpr, .5), 8) : 1,
		lang: clip(raw.lang, 24),
		tz: clip(raw.tz, 64),
		touch: Math.max(0, Math.min(Number(raw.touch) || 0, 20)),
		connection: clip(raw.connection, 32),
		referrer: clip(raw.referrer, 180),
		ua: clip(raw.ua, 240)
	};
}
var pingVisit_createServerFn_handler = createServerRpc({
	id: "2b95c2966de4362ed00d7971a114e71f02a622fa27a974ce4467cf689f46b23f",
	name: "pingVisit",
	filename: "src/lib/spa/api.ts"
}, (opts) => pingVisit.__executeServer(opts));
var pingVisit = createServerFn({ method: "POST" }).validator((raw) => raw).handler(pingVisit_createServerFn_handler, async ({ data }) => {
	const ping = cleanPing(data);
	if (!ping) return;
	await (await getSql())`
      insert into visits (
        path, session_id, site_id, device, os, browser, screen, viewport, dpr,
        lang, tz, touch, connection, referrer, ua
      ) values (
        ${ping.path}, ${ping.sessionId}, ${ping.siteId}, ${ping.device}, ${ping.os},
        ${ping.browser}, ${ping.screen}, ${ping.viewport}, ${ping.dpr},
        ${ping.lang}, ${ping.tz}, ${ping.touch}, ${ping.connection},
        ${ping.referrer}, ${ping.ua}
      )
    `;
});
var listOccupancy_createServerFn_handler = createServerRpc({
	id: "9bd794bb20dca1dd2892a8b83b8a171a80812c32fa5998da730f1ce3224cb6ab",
	name: "listOccupancy",
	filename: "src/lib/spa/api.ts"
}, (opts) => listOccupancy.__executeServer(opts));
var listOccupancy = createServerFn({ method: "GET" }).validator((d) => d ?? {}).handler(listOccupancy_createServerFn_handler, async ({ data }) => {
	await houseSeed();
	return (await (await getSql())`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings
      where coalesce(site_id, 'watercourse') = ${data.siteId || "watercourse"}
    `).map(occupancyView);
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "0cc2d6aa2c990b65808e47f847646a88f523860eec5e4ccdb069c8de59d670bb",
	name: "getMyProfile",
	filename: "src/lib/spa/api.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return loadProfile(context.userId);
});
var claimDesk_createServerFn_handler = createServerRpc({
	id: "b73274ba055c8a734624c583ccdd31ecfad29201d804914c06cf86f4c7724c6f",
	name: "claimDesk",
	filename: "src/lib/spa/api.ts"
}, (opts) => claimDesk.__executeServer(opts));
var claimDesk = createServerFn({ method: "POST" }).validator((code) => code.trim().toLowerCase()).middleware([authMiddleware]).handler(claimDesk_createServerFn_handler, async ({ context, data: code }) => {
	const DESK = "channing";
	const OWNER = "lotus";
	if (code !== DESK && code !== OWNER) throw new Error("That desk code did not match.");
	const next = code === OWNER ? "admin" : "staff";
	const role = (await loadProfile(context.userId)).role === "admin" ? "admin" : next === "admin" ? "admin" : "staff";
	await (await getSql())`update profiles set role = ${role} where user_id = ${context.userId}`;
	return loadProfile(context.userId);
});
var createBooking_createServerFn_handler = createServerRpc({
	id: "2f1953c3b23d29fb7241edde0f3bd5c3c48a2fa2c28c3f5321f58d4ba8aecd8b",
	name: "createBooking",
	filename: "src/lib/spa/api.ts"
}, (opts) => createBooking.__executeServer(opts));
var createBooking = createServerFn({ method: "POST" }).validator((b) => b).middleware([authMiddleware]).handler(createBooking_createServerFn_handler, async ({ context, data }) => {
	await houseSeed();
	const sql = await getSql();
	const siteId = data.siteId || "watercourse";
	const all = (await sql`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings
      where coalesce(site_id, 'watercourse') = ${siteId}
    `).map(toBooking);
	if (!canBook(all, data.date, data.roomId, data.startMin, data.durationMin)) throw new Error("That room is no longer open.");
	const source = staffRole((await loadProfile(context.userId)).role) && data.guestName ? "desk" : "guest";
	const id = `b-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
	await sql`
      insert into bookings (
        id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name, site_id
      ) values (
        ${id}, ${context.userId}, ${source}, ${data.date}, ${data.roomId},
        ${data.startMin}, ${data.durationMin}, ${data.guests}, ${data.withSauna},
        ${data.massageRequest}, ${data.massageNote}, ${data.memberTier},
        ${data.paidVia}, ${data.lateMinutes}, ${data.guestName ?? ""}, ${siteId}
      )
      )
    `;
	return toBooking((await sql`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings where id = ${id}
    `)[0]);
});
var listMyBookings_createServerFn_handler = createServerRpc({
	id: "e226af5ec0c9aacf42b9d4a2a46073f0ee67133000b31f61ac1c6bc9b7429726",
	name: "listMyBookings",
	filename: "src/lib/spa/api.ts"
}, (opts) => listMyBookings.__executeServer(opts));
var listMyBookings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyBookings_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings
      where user_id = ${context.userId}
      order by date, start_min
    `).map(toBooking);
});
var listStaffBookings_createServerFn_handler = createServerRpc({
	id: "12b8d372329868430fad5df9403abd210ba504b12c99ab502ab14b9d17d7182e",
	name: "listStaffBookings",
	filename: "src/lib/spa/api.ts"
}, (opts) => listStaffBookings.__executeServer(opts));
var listStaffBookings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaffBookings_createServerFn_handler, async ({ context }) => {
	const me = await loadProfile(context.userId);
	if (!staffRole(me.role)) throw new Error("Desk only.");
	await houseSeed();
	const sql = await getSql();
	const siteFilter = me.role === "store" ? me.storeId || "__none__" : me.role === "staff" ? "watercourse" : null;
	return (siteFilter ? await sql`
          select id, user_id, source, date, room_id, start_min, duration_min, guests,
            with_sauna, massage_request, massage_note, member_tier, paid_via,
            late_minutes, guest_name
          from bookings
          where coalesce(site_id, 'watercourse') = ${siteFilter}
        ` : await sql`
          select id, user_id, source, date, room_id, start_min, duration_min, guests,
            with_sauna, massage_request, massage_note, member_tier, paid_via,
            late_minutes, guest_name
          from bookings
        `).map(toBooking);
});
var markBookingLate_createServerFn_handler = createServerRpc({
	id: "64caf484fd0b12dcbc888c4ef1ee1f46eaf00d86526fe573e3e44a7c64588972",
	name: "markBookingLate",
	filename: "src/lib/spa/api.ts"
}, (opts) => markBookingLate.__executeServer(opts));
var markBookingLate = createServerFn({ method: "POST" }).validator((d) => d).middleware([authMiddleware]).handler(markBookingLate_createServerFn_handler, async ({ context, data }) => {
	const me = await loadProfile(context.userId);
	if (!staffRole(me.role)) throw new Error("Desk only.");
	const sql = await getSql();
	if (me.role === "store") {
		await sql`
        update bookings set late_minutes = ${data.lateMinutes}
        where id = ${data.id} and coalesce(site_id, 'watercourse') = ${me.storeId ?? "__none__"}
      `;
		return;
	}
	await sql`update bookings set late_minutes = ${data.lateMinutes} where id = ${data.id}`;
});
var deleteBooking_createServerFn_handler = createServerRpc({
	id: "b50a4959f81fd29c5adb877e6c782ba03fbff028e5592351c2f8d776e5e83521",
	name: "deleteBooking",
	filename: "src/lib/spa/api.ts"
}, (opts) => deleteBooking.__executeServer(opts));
var deleteBooking = createServerFn({ method: "POST" }).validator((id) => id).middleware([authMiddleware]).handler(deleteBooking_createServerFn_handler, async ({ context, data: id }) => {
	const me = await loadProfile(context.userId);
	const sql = await getSql();
	if (me.role === "admin" || me.role === "staff") {
		await sql`delete from bookings where id = ${id}`;
		return;
	}
	if (me.role === "store") {
		await sql`
        delete from bookings
        where id = ${id} and coalesce(site_id, 'watercourse') = ${me.storeId ?? "__none__"}
      `;
		return;
	}
	await sql`delete from bookings where id = ${id} and user_id = ${context.userId}`;
});
var listUsers_createServerFn_handler = createServerRpc({
	id: "11db39beb3d1e685008fe68a9f7263cafaabc6c147b19319076486dbcd0495b4",
	name: "listUsers",
	filename: "src/lib/spa/api.ts"
}, (opts) => listUsers.__executeServer(opts));
var listUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listUsers_createServerFn_handler, async ({ context }) => {
	if ((await loadProfile(context.userId)).role !== "admin") throw new Error("Owner only.");
	return (await getSql())`select user_id, role, name, email, created_at::text from profiles order by created_at desc`;
});
var setUserRole_createServerFn_handler = createServerRpc({
	id: "e9565ada5ccbc3fbfe780858a71eea87698c67bce1351a4a2bef879cd9363e23",
	name: "setUserRole",
	filename: "src/lib/spa/api.ts"
}, (opts) => setUserRole.__executeServer(opts));
var setUserRole = createServerFn({ method: "POST" }).validator((d) => d).middleware([authMiddleware]).handler(setUserRole_createServerFn_handler, async ({ context, data }) => {
	if ((await loadProfile(context.userId)).role !== "admin") throw new Error("Owner only.");
	if (![
		"customer",
		"staff",
		"admin",
		"store"
	].includes(data.role)) return;
	await (await getSql())`update profiles set role = ${data.role} where user_id = ${data.userId}`;
});
var adminStats_createServerFn_handler = createServerRpc({
	id: "aa4763cfd695ef0cff025462bfd6994733d8a249fa99c6faea602ae31f6ba9d9",
	name: "adminStats",
	filename: "src/lib/spa/api.ts"
}, (opts) => adminStats.__executeServer(opts));
var adminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminStats_createServerFn_handler, async ({ context }) => {
	if ((await loadProfile(context.userId)).role !== "admin") throw new Error("Owner only.");
	const sql = await getSql();
	const visits = await sql`
      select path, count(*)::int as n
      from visits
      where created_at > now() - interval '30 days'
      group by path
      order by n desc
    `;
	const byDay = await sql`
      select created_at::date::text as day, count(*)::int as n
      from visits
      where created_at > now() - interval '14 days'
      group by created_at::date
      order by day
    `;
	const devices = await sql`
      select coalesce(nullif(device, ''), 'Unknown') as device, count(*)::int as n
      from visits
      where created_at > now() - interval '30 days'
      group by 1
      order by n desc
    `;
	const browsers = await sql`
      select coalesce(nullif(browser, ''), 'Unknown') as browser, count(*)::int as n
      from visits
      where created_at > now() - interval '30 days'
      group by 1
      order by n desc
    `;
	const sessions = await sql`
      select count(distinct session_id)::int as n
      from visits
      where created_at > now() - interval '30 days'
        and session_id is not null
        and session_id <> ''
    `;
	const recent = await sql`
      select path, device, os, browser, screen, viewport, dpr, lang, tz,
        touch, connection, referrer, created_at::text
      from visits
      order by created_at desc
      limit 40
    `;
	const people = await sql`
      select role, count(*)::int as n from profiles group by role
    `;
	const holds = await sql`select count(*)::int as n from bookings`;
	const guests = await sql`
      select count(*)::int as n from bookings where source in ('guest', 'desk')
    `;
	return {
		visits,
		byDay,
		devices,
		browsers,
		sessions: sessions[0]?.n ?? 0,
		recent: recent.map((r) => ({
			...r,
			dpr: r.dpr == null ? null : Number(r.dpr)
		})),
		people,
		bookingCount: holds[0]?.n ?? 0,
		guestCount: guests[0]?.n ?? 0
	};
});
var clearHouseHolds_createServerFn_handler = createServerRpc({
	id: "1bf28b04ca9ffc4c1b289f7c4a43d46b20d5f949ec8fef8203f0ba28018ff613",
	name: "clearHouseHolds",
	filename: "src/lib/spa/api.ts"
}, (opts) => clearHouseHolds.__executeServer(opts));
var clearHouseHolds = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clearHouseHolds_createServerFn_handler, async ({ context }) => {
	if ((await loadProfile(context.userId)).role !== "admin") throw new Error("Owner only.");
	await (await getSql())`delete from bookings where user_id = 'house'`;
});
//#endregion
export { adminStats_createServerFn_handler, claimDesk_createServerFn_handler, clearHouseHolds_createServerFn_handler, createBooking_createServerFn_handler, deleteBooking_createServerFn_handler, getMyProfile_createServerFn_handler, listMyBookings_createServerFn_handler, listOccupancy_createServerFn_handler, listStaffBookings_createServerFn_handler, listUsers_createServerFn_handler, markBookingLate_createServerFn_handler, pingVisit_createServerFn_handler, setUserRole_createServerFn_handler };
