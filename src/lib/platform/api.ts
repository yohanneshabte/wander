import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { HOUSES } from "./catalog";
import type { HouseCatalog, PlatformSettings, Site } from "./types";

async function requireOwner(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ role: string }>`
    select role from profiles where user_id = ${userId}
  `;
  if (rows[0]?.role !== "admin") throw new Error("Owner only.");
}

async function seedHouses() {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from sites`;
  if ((existing[0]?.n ?? 0) > 0) return;
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
    for (const r of house.resources) {
      await sql`
        insert into resources (id, site_id, name, short, blurb, kind, amenities, capacity, sort)
        values (
          ${r.id}, ${r.siteId}, ${r.name}, ${r.short}, ${r.blurb}, ${r.kind},
          ${r.amenities.join(",")}, ${r.capacity}, ${r.sort}
        )
        on conflict (id) do nothing
      `;
    }
    for (const c of house.categories) {
      await sql`
        insert into categories (id, site_id, key, name, blurb, sort)
        values (${c.id}, ${c.siteId}, ${c.key}, ${c.name}, ${c.blurb}, ${c.sort})
        on conflict (id) do nothing
      `;
    }
    for (const v of house.services) {
      await sql`
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
    }
    for (const m of house.memberships) {
      await sql`
        insert into memberships (id, site_id, name, price_month, blurb, credits, sort)
        values (
          ${m.id}, ${m.siteId}, ${m.name}, ${m.priceMonth}, ${m.blurb},
          ${m.credits}, ${m.sort}
        )
        on conflict (id) do nothing
      `;
    }
  }
  await sql`
    update bookings set site_id = 'watercourse' where site_id is null
  `;
}

function num(v: unknown) {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export const listHouses = createServerFn({ method: "GET" }).handler(async () => {
  await seedHouses();
  return HOUSES;
});

export const getPlatform = createServerFn({ method: "GET" }).handler(async () => {
  await seedHouses();
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select * from platform_settings where id = 'global'
  `;
  const row = rows[0] ?? {};
  const settings: PlatformSettings = {
    liveSiteId: String(row.live_site_id ?? "watercourse"),
    previewSiteId: (row.preview_site_id as string | null) ?? null,
    demoMode: row.demo_mode == null ? true : Boolean(row.demo_mode),
    discoveryMode: row.discovery_mode == null ? true : Boolean(row.discovery_mode),
    houseVoice: row.house_voice == null ? true : Boolean(row.house_voice),
    directoryUnlocked: Boolean(row.directory_unlocked),
  };
  return { settings, houses: HOUSES };
});

export const savePlatform = createServerFn({ method: "POST" })
  .validator((d: PlatformSettings) => d)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireOwner(context.userId);
    const sql = await getSql();
    await sql`
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

export type HouseRow = Site;

export const houseEconomics = createServerFn({ method: "GET" }).handler(async () => {
  await seedHouses();
  const sql = await getSql();
  const visits = await sql<{ site_id: string | null; n: number }>`
    select site_id, count(*)::int as n
    from visits
    where created_at > now() - interval '30 days'
    group by site_id
  `;
  const holds = await sql<{ site_id: string | null; n: number }>`
    select site_id, count(*)::int as n from bookings group by site_id
  `;
  return { visits, holds, services: HOUSES.map((h) => ({ id: h.site.id, n: h.services.length })) };
});

export { num };
export type { HouseCatalog };
