import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { LISTING_SEED, type ListingCard } from "./listings";
import { KIND_MENU } from "@/lib/directory/prospects";
import type { PlaceKind } from "@/lib/directory/prospects";

const STORE_CODES: Record<string, string> = {
  walnut: "perspire-wc",
  bms: "bms-sc",
  piedmont: "piedmont-springs",
};

async function seedListings() {
  const sql = await getSql();
  for (const p of LISTING_SEED) {
    await sql`
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
}

function toCard(row: Record<string, unknown>): ListingCard {
  const tags = String(row.tags ?? "")
    .split(",")
    .filter(Boolean);
  return {
    id: String(row.id),
    name: String(row.name),
    region: row.region as ListingCard["region"],
    city: String(row.city),
    address: String(row.address ?? ""),
    lat: Number(row.lat),
    lng: Number(row.lng),
    kind: row.kind as PlaceKind,
    tags,
    bookingGap: row.booking_gap as ListingCard["bookingGap"],
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
    cancelNote: String(row.cancel_note ?? ""),
  };
}

async function profile(userId: string) {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select user_id, role, name, email, store_id, goals from profiles where user_id = ${userId}
  `;
  return rows[0] ?? null;
}

function isAdmin(row: Record<string, unknown> | null) {
  return row?.role === "admin";
}

async function assertStore(userId: string, listingId: string) {
  const me = await profile(userId);
  if (!me) throw new Error("Sign in.");
  if (isAdmin(me)) return me;
  if (me.role === "store" && String(me.store_id ?? "") === listingId) return me;
  throw new Error("This listing is not your store.");
}

export const searchListings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      q?: string;
      region?: string;
      kind?: string;
      tag?: string;
      maxPrice?: number;
      has3d?: boolean;
      goals?: string[];
    }) => d,
  )
  .handler(async ({ data }) => {
    await seedListings();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from listings where listed = true
    `;
    let cards = rows.map(toCard);
    for (const c of cards) {
      const menu = KIND_MENU[c.kind] ?? [];
      const paid = menu.filter((s) => s.listPrice > 0).map((s) => s.listPrice);
      c.fromPrice = paid.length ? Math.min(...paid) : 0;
      if (!c.coverUrl) c.coverUrl = `/listings/${c.kind === "gym" ? "gym" : "bath"}.jpg`;
    }
    if (data.region && data.region !== "all") {
      cards = cards.filter((c) => c.region === data.region);
    }
    if (data.kind && data.kind !== "all") {
      cards = cards.filter((c) => c.kind === data.kind);
    }
    if (data.tag) {
      const t = data.tag;
      cards = cards.filter((c) => {
        if (t === "gym") return c.kind === "gym" || c.kind === "martial" || c.tags.includes("gym");
        if (t === "sauna")
          return (
            c.kind === "sauna_studio" ||
            c.kind === "korean_spa" ||
            c.kind === "bathhouse" ||
            c.tags.includes("sauna") ||
            c.tags.includes("infrared")
          );
        if (t === "sleep") return c.tags.includes("float") || c.tags.includes("rest") || c.tags.includes("soak");
        if (t === "pain") return c.tags.includes("massage") || c.tags.includes("soak") || c.tags.includes("pemf");
        if (t === "recovery")
          return c.tags.some((x) => ["contrast", "cryo", "plunge", "compression"].includes(x));
        if (t === "focus") return c.kind === "biotech" || c.tags.includes("float");
        return c.tags.includes(t);
      });
    }
    if (data.maxPrice) cards = cards.filter((c) => c.fromPrice <= data.maxPrice!);
    if (data.has3d) cards = cards.filter((c) => c.tour3dUrl);
    if (data.q?.trim()) {
      const q = data.q.trim().toLowerCase();
      cards = cards.filter((c) =>
        `${c.name} ${c.city} ${c.kind} ${c.tags.join(" ")} ${c.pitch}`.toLowerCase().includes(q),
      );
    }
    if (data.goals?.length) {
      const want = new Set(data.goals);
      cards = cards
        .map((c) => {
          let hit = 0;
          for (const t of c.tags) if (want.has(t) || [...want].some((g) => t.includes(g))) hit += 1;
          if (want.has("gym") && (c.kind === "gym" || c.kind === "martial")) hit += 2;
          if (want.has("sauna") && (c.kind === "sauna_studio" || c.kind === "korean_spa" || c.kind === "bathhouse"))
            hit += 2;
          return { c, hit };
        })
        .sort((a, b) => b.hit - a.hit)
        .map((x) => x.c);
    }
    return cards;
  });

export const getListing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await seedListings();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from listings where id = ${id} and listed = true
    `;
    if (!rows[0]) return null;
    const card = toCard(rows[0]);
    const menu = KIND_MENU[card.kind] ?? [];
    const paid = menu.filter((s) => s.listPrice > 0).map((s) => s.listPrice);
    card.fromPrice = paid.length ? Math.min(...paid) : 0;
    const media = await sql<{ id: string; kind: string; url: string; caption: string }>`
      select id, kind, url, caption from listing_media where listing_id = ${id} order by sort
    `;
    return { listing: card, menu, media };
  });

export const myStore = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedListings();
    const me = await profile(context.userId);
    if (!me) throw new Error("Sign in.");
    if (me.role !== "store" && me.role !== "admin") {
      throw new Error("Store desk only.");
    }
    const sql = await getSql();
    const id = me.role === "admin" ? "watercourse-ref" : String(me.store_id ?? "");
    if (!id) throw new Error("No store attached.");
    const rows = await sql<Record<string, unknown>>`select * from listings where id = ${id}`;
    const listing = rows[0] ? toCard(rows[0]) : null;
    const holds = await sql<{
      id: string;
      date: string;
      room_id: string;
      start_min: number;
      duration_min: number;
      guest_name: string;
      user_id: string;
    }>`
      select id, date, room_id, start_min, duration_min, guest_name, user_id
      from bookings
      where coalesce(site_id, 'watercourse') = ${id === "watercourse-ref" ? "watercourse" : id}
      order by date, start_min
    `;
    const media = await sql<{ id: string; kind: string; url: string; caption: string }>`
      select id, kind, url, caption from listing_media where listing_id = ${id} order by sort
    `;
    return { listing, holds, media, storeId: id };
  });

export const saveListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      id: string;
      pitch: string;
      houseRules: string;
      cancelNote: string;
      tour3dUrl: string;
      coverUrl: string;
      phone: string;
      guestsMax: number;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    await assertStore(context.userId, data.id);
    const sql = await getSql();
    await sql`
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

export const addMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { listingId: string; url: string; kind: "photo" | "tour3d"; caption: string }) => d)
  .handler(async ({ context, data }) => {
    await assertStore(context.userId, data.listingId);
    const url = data.url.trim().slice(0, 500);
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      throw new Error("Use an https link or a path on this app.");
    }
    const sql = await getSql();
    const id = `m-${Date.now()}`;
    await sql`
      insert into listing_media (id, listing_id, kind, url, caption, sort)
      values (${id}, ${data.listingId}, ${data.kind}, ${url}, ${data.caption.slice(0, 80)}, 0)
    `;
    if (data.kind === "tour3d") {
      await sql`update listings set tour3d_url = ${url} where id = ${data.listingId}`;
    }
    return { ok: true, id };
  });

export const saveGoals = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((goals: string[]) => goals)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const keys = data.filter((g) => GOAL_KEYS.has(g)).slice(0, 6);
    await sql`update profiles set goals = ${keys.join(",")} where user_id = ${context.userId}`;
    return keys;
  });

const GOAL_KEYS = new Set(["gym", "sauna", "sleep", "pain", "recovery", "focus"]);

export const claimStore = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((code: string) => code.trim().toLowerCase())
  .handler(async ({ context, data: code }) => {
    const listingId = STORE_CODES[code];
    if (!listingId) throw new Error("That store code did not match.");
    const me = await profile(context.userId);
    if (me?.role === "admin") return { role: "admin", storeId: listingId };
    const sql = await getSql();
    await sql`
      update profiles set role = 'store', store_id = ${listingId}
      where user_id = ${context.userId} and role <> 'admin'
    `;
    return { role: "store" as const, storeId: listingId };
  });

export const requestHold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { listingId: string; serviceName: string; date: string }) => d)
  .handler(async ({ context, data }) => {
    await seedListings();
    const sql = await getSql();
    const listing = await sql<{ id: string; name: string }>`
      select id, name from listings where id = ${data.listingId} and listed = true
    `;
    if (!listing[0]) throw new Error("Listing not found.");
    const me = await profile(context.userId);
    const id = `b-${Date.now()}-${Math.floor(Math.random() * 999)}`;
    const siteId =
      data.listingId === "watercourse-ref" ? "watercourse" : data.listingId;
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
    return { id, house: listing[0].name };
  });

export { STORE_CODES };
