# Architecture

Wander is a TanStack Start (Vite + React) app. Server functions talk to
Postgres (Neon when `DATABASE_URL` is set, else PGLite). Auth is Better Auth
with Google / X / email.

## Layers

1. **Occupancy engine** (`src/lib/spa/engine.ts`) — pure functions. 15-minute
   cleaning buffer after every session. Never more than 75% of rooms busy at
   once. Prefers empty weekday mornings. Slow hours can stretch to 2–3h.
2. **House catalog** (`src/lib/platform/catalog.ts`) — Watercourse (phone
   bathhouse) and SoliVana (already-online control). Hours, rates, rooms.
3. **Search catalog** (`src/lib/market/search.ts`) — client-side, works
   offline. Filters the 100-mile prospect list by tag, query, and distance.
4. **Evidence** (`src/lib/evidence/`) — modality → outcome claims with grades
   A–E. Chat may only cite seeded claims.
5. **Tenancy** — `bookings.site_id` + `profiles.store_id`. Store role can only
   read/write its listing. Staff sees Watercourse. Owner sees all.

## Roles

`customer` | `staff` | `store` | `admin`

Claim via codes on `/account` (`claimDesk` / `claimStore`). Codes come from
env (`WANDER_*`) so a public fork does not ship a live owner password.

## Routes worth searching

- `/` pitch home (QR-safe)
- `/search` public Google-style search
- `/book` 3-step hold
- `/calendar` desk Gantt
- `/insights` revenue sliders + Circle membership sim
- `/manage` store portal
- `/admin` owner only, no public link
- `/guide` + `/service/$slug` benefits + HSA notes
- `/try` print QR card (static grok.me URL)

## Pricing (Watercourse-shaped)

Day (before 5:30pm): $18 tub / $23 tub+sauna per person per hour.
Evening: $23 / $28. Late fee after 10 minutes. Massage is a phone confirm.
