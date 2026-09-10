/**
 * Bookings, visit pings, desk codes. Staff/store queries are site-partitioned.
 * Occupancy rules stay in engine.ts — this file is I/O.
 */
import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  canBook,
  generateMockBookings,
  nextDates,
  type Booking,
} from "./engine";
import type { MemberTierId, PaidVia } from "./membership";
import type { VisitPing } from "./device";

export type SpaRole = "customer" | "staff" | "admin" | "store";

export type Profile = {
  userId: string;
  role: SpaRole;
  name: string;
  email: string | null;
  storeId: string | null;
  goals: string[];
};

export type StaffBooking = Booking & {
  userId: string;
  guestName: string;
};

const VISIT_PATHS = new Set([
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
  "/manage",
]);

type BookingRow = {
  id: string;
  user_id: string;
  source: string;
  date: string;
  room_id: string;
  start_min: number;
  duration_min: number;
  guests: number;
  with_sauna: boolean | number;
  massage_request: boolean | number;
  massage_note: string;
  member_tier: string;
  paid_via: string;
  late_minutes: number;
  guest_name: string;
};

function asBool(v: boolean | number) {
  return v === true || v === 1;
}

function toBooking(row: BookingRow): StaffBooking {
  const source =
    row.source === "desk" ? "guest" : row.source === "house" ? "mock" : row.source;
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
    memberTier: (row.member_tier as MemberTierId) || "none",
    paidVia: (row.paid_via as PaidVia) || "desk",
    lateMinutes: Number(row.late_minutes) || 0,
  };
}

function occupancyView(row: BookingRow): Booking {
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
    lateMinutes: b.lateMinutes,
  };
}

async function loadProfile(
  userId: string,
  email?: string | null,
  name?: string | null,
) {
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
  const rows = await sql<Record<string, unknown>>`
    select user_id, role, name, email, store_id, goals from profiles where user_id = ${userId}
  `;
  const row = rows[0]!;
  const raw = String(row.role ?? "customer");
  const role: SpaRole =
    raw === "admin" || raw === "staff" || raw === "store" ? raw : "customer";
  const goals = String(row.goals ?? "")
    .split(",")
    .filter(Boolean);
  return {
    userId: String(row.user_id),
    role,
    name: String(row.name ?? ""),
    email: (row.email as string | null) ?? null,
    storeId: (row.store_id as string | null) ?? null,
    goals,
  } satisfies Profile;
}

function staffRole(role: SpaRole) {
  return role === "staff" || role === "admin" || role === "store";
}

async function houseSeed() {
  const sql = await getSql();
  const count = await sql<{ n: number }>`select count(*)::int as n from bookings`;
  if ((count[0]?.n ?? 0) > 0) return;
  const mock = generateMockBookings(nextDates(16));
  for (const b of mock) {
    await sql`
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
}

function clip(value: unknown, n: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

function cleanPing(raw: VisitPing): VisitPing | null {
  const path = clip(raw.path, 64).split("?")[0] || "/";
  if (
    !VISIT_PATHS.has(path) &&
    !path.startsWith("/service/") &&
    !path.startsWith("/directory/") &&
    !path.startsWith("/explore/")
  )
    return null;
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
    dpr: Number.isFinite(dpr) ? Math.min(Math.max(dpr, 0.5), 8) : 1,
    lang: clip(raw.lang, 24),
    tz: clip(raw.tz, 64),
    touch: Math.max(0, Math.min(Number(raw.touch) || 0, 20)),
    connection: clip(raw.connection, 32),
    referrer: clip(raw.referrer, 180),
    ua: clip(raw.ua, 240),
  };
}

export const pingVisit = createServerFn({ method: "POST" })
  .validator((raw: VisitPing) => raw)
  .handler(async ({ data }) => {
    const ping = cleanPing(data);
    if (!ping) return;
    const sql = await getSql();
    await sql`
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

export const listOccupancy = createServerFn({ method: "GET" })
  .validator((d?: { siteId?: string }) => d ?? {})
  .handler(async ({ data }) => {
    await houseSeed();
    const sql = await getSql();
    const siteId = data.siteId || "watercourse";
    const rows = await sql<BookingRow>`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings
      where coalesce(site_id, 'watercourse') = ${siteId}
    `;
    return rows.map(occupancyView);
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return loadProfile(context.userId);
  });

export const claimDesk = createServerFn({ method: "POST" })
  .validator((code: string) => code.trim().toLowerCase())
  .middleware([authMiddleware])
  .handler(async ({ context, data: code }) => {
    const DESK = (process.env.WANDER_DESK_CODE || "channing").toLowerCase();
    const OWNER = (process.env.WANDER_OWNER_CODE || "lotus").toLowerCase();
    if (code !== DESK && code !== OWNER) {
      throw new Error("That desk code did not match.");
    }
    const next: SpaRole = code === OWNER ? "admin" : "staff";
    const me = await loadProfile(context.userId);
    const role: SpaRole =
      me.role === "admin" ? "admin" : next === "admin" ? "admin" : "staff";
    const sql = await getSql();
    await sql`update profiles set role = ${role} where user_id = ${context.userId}`;
    return loadProfile(context.userId);
  });

export type NewBooking = {
  date: string;
  roomId: string;
  startMin: number;
  durationMin: number;
  guests: number;
  withSauna: boolean;
  massageRequest: boolean;
  massageNote: string;
  memberTier: MemberTierId;
  paidVia: PaidVia;
  lateMinutes: number;
  guestName?: string;
  siteId?: string;
};

export const createBooking = createServerFn({ method: "POST" })
  .validator((b: NewBooking) => b)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await houseSeed();
    const sql = await getSql();
    const siteId = data.siteId || "watercourse";
    const rows = await sql<BookingRow>`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings
      where coalesce(site_id, 'watercourse') = ${siteId}
    `;
    const all = rows.map(toBooking);
    if (
      !canBook(all, data.date, data.roomId, data.startMin, data.durationMin)
    ) {
      throw new Error("That room is no longer open.");
    }
    const me = await loadProfile(context.userId);
    const source = staffRole(me.role) && data.guestName ? "desk" : "guest";
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
    const saved = await sql<BookingRow>`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings where id = ${id}
    `;
    return toBooking(saved[0]!);
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<BookingRow>`
      select id, user_id, source, date, room_id, start_min, duration_min, guests,
        with_sauna, massage_request, massage_note, member_tier, paid_via,
        late_minutes, guest_name
      from bookings
      where user_id = ${context.userId}
      order by date, start_min
    `;
    return rows.map(toBooking);
  });

export const listStaffBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await loadProfile(context.userId);
    if (!staffRole(me.role)) throw new Error("Desk only.");
    await houseSeed();
    const sql = await getSql();
    const siteFilter =
      me.role === "store"
        ? me.storeId || "__none__"
        : me.role === "staff"
          ? "watercourse"
          : null;
    const rows = siteFilter
      ? await sql<BookingRow>`
          select id, user_id, source, date, room_id, start_min, duration_min, guests,
            with_sauna, massage_request, massage_note, member_tier, paid_via,
            late_minutes, guest_name
          from bookings
          where coalesce(site_id, 'watercourse') = ${siteFilter}
        `
      : await sql<BookingRow>`
          select id, user_id, source, date, room_id, start_min, duration_min, guests,
            with_sauna, massage_request, massage_note, member_tier, paid_via,
            late_minutes, guest_name
          from bookings
        `;
    return rows.map(toBooking);
  });

export const markBookingLate = createServerFn({ method: "POST" })
  .validator((d: { id: string; lateMinutes: number }) => d)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
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

export const deleteBooking = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
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

export const listUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await loadProfile(context.userId);
    if (me.role !== "admin") throw new Error("Owner only.");
    const sql = await getSql();
    return sql<{
      user_id: string;
      role: string;
      name: string;
      email: string | null;
      created_at: string;
    }>`select user_id, role, name, email, created_at::text from profiles order by created_at desc`;
  });

export const setUserRole = createServerFn({ method: "POST" })
  .validator((d: { userId: string; role: SpaRole }) => d)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const me = await loadProfile(context.userId);
    if (me.role !== "admin") throw new Error("Owner only.");
    if (!["customer", "staff", "admin", "store"].includes(data.role)) return;
    const sql = await getSql();
    await sql`update profiles set role = ${data.role} where user_id = ${data.userId}`;
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await loadProfile(context.userId);
    if (me.role !== "admin") throw new Error("Owner only.");
    const sql = await getSql();
    const visits = await sql<{ path: string; n: number }>`
      select path, count(*)::int as n
      from visits
      where created_at > now() - interval '30 days'
      group by path
      order by n desc
    `;
    const byDay = await sql<{ day: string; n: number }>`
      select created_at::date::text as day, count(*)::int as n
      from visits
      where created_at > now() - interval '14 days'
      group by created_at::date
      order by day
    `;
    const devices = await sql<{ device: string; n: number }>`
      select coalesce(nullif(device, ''), 'Unknown') as device, count(*)::int as n
      from visits
      where created_at > now() - interval '30 days'
      group by 1
      order by n desc
    `;
    const browsers = await sql<{ browser: string; n: number }>`
      select coalesce(nullif(browser, ''), 'Unknown') as browser, count(*)::int as n
      from visits
      where created_at > now() - interval '30 days'
      group by 1
      order by n desc
    `;
    const sessions = await sql<{ n: number }>`
      select count(distinct session_id)::int as n
      from visits
      where created_at > now() - interval '30 days'
        and session_id is not null
        and session_id <> ''
    `;
    const recent = await sql<{
      path: string;
      device: string | null;
      os: string | null;
      browser: string | null;
      screen: string | null;
      viewport: string | null;
      dpr: number | string | null;
      lang: string | null;
      tz: string | null;
      touch: number | null;
      connection: string | null;
      referrer: string | null;
      created_at: string;
    }>`
      select path, device, os, browser, screen, viewport, dpr, lang, tz,
        touch, connection, referrer, created_at::text
      from visits
      order by created_at desc
      limit 40
    `;
    const people = await sql<{ role: string; n: number }>`
      select role, count(*)::int as n from profiles group by role
    `;
    const holds = await sql<{ n: number }>`select count(*)::int as n from bookings`;
    const guests = await sql<{ n: number }>`
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
        dpr: r.dpr == null ? null : Number(r.dpr),
      })),
      people,
      bookingCount: holds[0]?.n ?? 0,
      guestCount: guests[0]?.n ?? 0,
    };
  });

export const clearHouseHolds = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await loadProfile(context.userId);
    if (me.role !== "admin") throw new Error("Owner only.");
    const sql = await getSql();
    await sql`delete from bookings where user_id = 'house'`;
  });
