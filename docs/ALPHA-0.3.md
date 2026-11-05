# 0.3 alpha — personal dashboard

Personal-use only. `/me` is a client-side tool for the repo owner. Existing
venue apps stay the booking layer; venues here are names plus links.

| File | What |
| --- | --- |
| `src/lib/personal/config.ts` | `SECOND_MODALITY` (one swap point), venues, defaults |
| `src/lib/personal/protocol.ts` | water layer, modality layers, heat ladder, guardrails, home kit |
| `src/lib/personal/calc.ts` | pure helpers: visits/month, cost per visit, credits, HSA, CSV, `.ics` |
| `src/lib/personal/store.ts` | device-only `localStorage` (`wander-personal-v1`) |
| `src/routes/me.tsx` | the dashboard |

## Second modality

Repo evidence did not name it. Catalog/tags mention cold plunge, steam,
"contrast" (Recover chip hint, SoliVana "Fire & Ice" contrast suites), so the
default is **contrast** (hot and cold alternating). Change `SECOND_MODALITY`
to `"cold_plunge"` or `"steam"` to swap.

## Data rules

- Stored: dates, venue names, room temp, minutes, yes/no checks, gear names
  and prices, HSA amounts and categories, credit counts and dates.
- Not stored: diagnoses, symptoms, vitals, or free-text notes. Nothing leaves
  the browser; no server tables or migrations were added.
- Copy is soft and non-medical. No detox or health claims.
