import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { PROSPECTS } from "./prospects";
import type { Prospect } from "./prospects";

async function requireOwner(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ role: string }>`
    select role from profiles where user_id = ${userId}
  `;
  if (rows[0]?.role !== "admin") throw new Error("Owner only.");
}

async function seedProspects() {
  const sql = await getSql();
  const n = await sql<{ n: number }>`select count(*)::int as n from prospects`;
  if ((n[0]?.n ?? 0) > 0) return;
  for (const p of PROSPECTS) {
    await sql`
      insert into prospects (
        id, name, region, city, address, lat, lng, kind, tags, booking_gap,
        phone, website, pitch, source, public
      ) values (
        ${p.id}, ${p.name}, ${p.region}, ${p.city}, ${p.address}, ${p.lat},
        ${p.lng}, ${p.kind}, ${p.tags.join(",")}, ${p.bookingGap}, ${p.phone},
        ${p.website}, ${p.pitch}, ${p.source}, false
      )
      on conflict (id) do nothing
    `;
  }
}

function asProspect(row: {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  kind: string;
  tags: string;
  booking_gap: string;
  phone: string;
  website: string;
  pitch: string;
  source: string;
}): Prospect {
  return {
    id: row.id,
    name: row.name,
    region: row.region as Prospect["region"],
    city: row.city,
    address: row.address,
    lat: Number(row.lat),
    lng: Number(row.lng),
    kind: row.kind as Prospect["kind"],
    tags: row.tags ? row.tags.split(",").filter(Boolean) : [],
    bookingGap: row.booking_gap as Prospect["bookingGap"],
    phone: row.phone,
    website: row.website,
    pitch: row.pitch,
    source: row.source,
  };
}

export const listProspects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    await seedProspects();
    return PROSPECTS;
  });

export const getProspect = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireOwner(context.userId);
    await seedProspects();
    return PROSPECTS.find((p) => p.id === id) ?? null;
  });
