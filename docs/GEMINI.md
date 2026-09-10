# Merging the Gemini branch

`gemini` is a snapshot of
[yohanneshabte/scheduling-optimizer](https://github.com/yohanneshabte/scheduling-optimizer)
(2026-09-08). That repo was a stub (`README` + MIT LICENSE) from an earlier
Gemini pass. **This Grok tree on `main` is ahead** — occupancy engine, Search,
auth, multi-house, evidence.

## Keep main ahead

```bash
git fetch origin
git checkout main
# inspect, do not merge-blind
git log --oneline main..gemini
git diff main...gemini
```

If Gemini later grows real files:

1. Branch from `main`: `git checkout -b merge/gemini`
2. `git merge --no-ff gemini` (or cherry-pick specific commits)
3. Resolve in favor of `src/lib/spa/engine.ts` and `src/lib/market/` unless
   Gemini has a clearly better occupancy or UI bit
4. PR into `main`

Do not rewind `main` to `gemini`.
