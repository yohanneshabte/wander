# Security

## Never commit

- `.env`, `.env.local`, `BETTER_AUTH_SECRET`, `DATABASE_URL`
- OAuth client secrets (`GROK_AUTH_CLIENT_SECRET`)
- `XAI_API_KEY`
- Device visit dumps with personal data

`.gitignore` already drops those. If you paste a secret into chat, rotate it.

## Demo codes

`WANDER_DESK_CODE`, `WANDER_OWNER_CODE`, `WANDER_STORE_CODES` default to the
lobby demo (`desk-a` / `desk-b` / `desk-c`). **Change them** before any real
desk uses a deploy. Anyone who reads this repo can type those codes.

## Tenancy

Server functions that list other people's bookings use `authMiddleware` and
filter by `context.userId` or `profiles.store_id`. Occupancy heatmaps are
public per house but omit guest names. Do not add a client-supplied `userId`.

## Tracking

`/try` and page beacons store device profile (UA, screen, tz) for the printed
QR. That table is owner-only. Do not expose `/admin` in the public nav.

## Affiliation

Prospect listings are **not** partners. Do not email them from this repo.
Unlock the public directory only after you research each house.
