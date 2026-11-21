# Changelog

## 0.3.0-alpha

Personal-use alpha. A client-side dashboard at `/me` for the owner only — not
a marketplace feature, not a business, no venue outreach.

- Water-first protocol (hydration check-ins, warm soak / warm pool), with a
  second modality stacked on top. Default: **contrast** (hot/cold
  alternating). Swap `SECOND_MODALITY` in `src/lib/personal/config.ts`.
- Heat guardrails: gentle ladder from 120–130°F, 20-minute cap, cool-down,
  rest days. Soft, non-medical copy.
- Sauna session log (date, venue, room temp, minutes, cool-down done).
- Sauna studio (unlimited) membership: visits per month and cost per visit.
  Venue name editable (default "Perspire"); no partnership implied.
- At-home kit: infrared back pad (placeholder model) and glove applicators
  (to confirm), a small-area routine, and a panel test log.
- Calendar month view with plans and a plain `.ics` export (no calendar API).
- Owned-gear list: manual entry or pasted order CSV (e.g. Amazon).
- HSA spend tracker toward a ~$3,000/yr target (amounts, dates, categories).
- Credits counter: 4 at Abbey Neuropsychology (to confirm) — counts and dates.

**Data:** everything is in `localStorage` on the device. No new server
routes, tables, or migrations. No medical or health fields (no diagnoses,
symptoms, vitals, or free-text notes). Details: [docs/ALPHA-0.3.md](docs/ALPHA-0.3.md).
