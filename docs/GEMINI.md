# Merging the Gemini branch

`gemini` is the Watercourse demo from
[scheduling-optimizer](https://github.com/yohanneshabte/scheduling-optimizer)
(`feat/watercourse-booking-demo-…`, Vite + React pages).

Useful files on that branch (not on `main`):

- `src/pages/BookPage.tsx` — earlier 3-step book
- `src/pages/CalendarPage.tsx`, `InsightsPage.tsx`
- `src/lib/config.ts`, `src/lib/seed.ts` — rooms/rates seed

**`main` (this Grok tree) is ahead:** occupancy engine with 15-min buffer +
75% cap, Search, auth, multi-house, evidence, store partition.

## Keep main ahead

```bash
git fetch origin
git checkout main
git log --oneline main..gemini
git diff main...gemini --stat
```

To lift a Gemini idea:

```bash
git checkout -b merge/gemini-book
git checkout gemini -- src/pages/BookPage.tsx   # example
# rewrite into src/components/book-flow.tsx, do not dual-stack
git commit -am "port Gemini book UX"
```

Do not `git merge gemini` into `main` blindly — trees diverged (Vite SPA vs
TanStack Start). Cherry-pick UX, keep engine.ts.
