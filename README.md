# Wander

Phone-first booking for gyms, soaks, and recovery houses. One account, many
floors. Built as a pitch for Watercourse Way (Palo Alto) and generalized into
a Bay Area marketplace.

**This software is not affiliated with Watercourse Way, SoliVana, Perspire, or
any listed house.** Catalog rows are modeled from public pages for a demo.
Do not present them as partners until you have a written yes.

## What it does

| Who | What |
| --- | --- |
| Guest | Book a room, Search nearby (offline, 100 miles), benefits guide |
| Member | Health-week rings, holds across houses, goals |
| Desk | Floor calendar, 15-min clean buffer, 75% concurrent cap |
| Store | Isolated portal for one listing |
| Owner | Hidden `/admin` — houses, traffic, demo toggles |

Live pitch: [flora-berry-ever-island.grok.me](https://flora-berry-ever-island.grok.me)

## Repo layout (fuzzy-search these)

```
src/lib/spa/engine.ts       occupancy, buffer, 75% cap, slow-hour stretch
src/lib/spa/api.ts          bookings, visits, desk codes, site partition
src/lib/platform/           multi-house catalog + profit sliders
src/lib/market/search.ts    offline Search (no network)
src/lib/market/tags.ts      workout / sauna / soak chips
src/lib/evidence/           HSA/FSA + grounded claims
src/lib/directory/          100-mile prospect dump (owner-gated public dir)
migrations/                 numbered SQL, never edit applied files
docs/                       architecture, security, gemini merge
```

## Run

```bash
npm install
cp .env.example .env.local   # optional; empty DATABASE_URL → PGLite
npm run dev                  # 0.0.0.0:8080
```

Demo codes (change before production): desk `channing`, owner `lotus`,
store `walnut` / `bms` / `piedmont`. See [docs/SECURITY.md](docs/SECURITY.md).

## Branches

| Branch | What |
| --- | --- |
| `main` | This Grok build — **ahead**. Merge into here. |
| `gemini` | Snapshot of [scheduling-optimizer](https://github.com/yohanneshabte/scheduling-optimizer) so you can cherry-pick. |

Merge notes: [docs/GEMINI.md](docs/GEMINI.md)

## License

MIT. See [LICENSE](LICENSE).
