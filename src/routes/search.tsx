import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, Sparkle } from "lucide-react";
import { Shell } from "@/components/shell";
import { TagChip } from "@/components/tag-chip";
import { HealthFollow } from "@/components/health-follow";
import { searchPlaces, RADIUS_MI } from "@/lib/market/search";
import { VISUAL_TAGS, type TagKey } from "@/lib/market/tags";
import { KIND_LABEL } from "@/lib/directory/prospects";
import { ANCHORS } from "@/lib/directory/geo";
import { formatMoney, cn } from "@/lib/utils";
import { readGoals } from "@/lib/market/goals-local";

type Search = { q?: string; tag?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    q: typeof raw.q === "string" ? raw.q : undefined,
    tag: typeof raw.tag === "string" ? raw.tag : undefined,
  }),
  component: SearchPage,
});

function SearchPage() {
  const nav = Route.useSearch();
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(nav.q ?? "");
  const [anchor, setAnchor] = useState<keyof typeof ANCHORS>("sanLeandro");
  const [goals, setGoals] = useState<string[]>([]);
  const tag = nav.tag ?? "";
  const q = nav.q ?? "";

  useEffect(() => {
    const on = () => setGoals(readGoals());
    on();
    window.addEventListener("wander-goals", on);
    return () => window.removeEventListener("wander-goals", on);
  }, []);

  const hits = useMemo(
    () =>
      searchPlaces({
        q,
        tag,
        anchor,
        radius: RADIUS_MI,
        goals,
      }),
    [q, tag, anchor, goals.join(",")],
  );

  function commit(next: Search) {
    void navigate({
      to: "/search",
      search: { q: next.q || undefined, tag: next.tag || undefined },
    });
  }

  return (
    <Shell>
      <div className="px-5 pt-8 pb-8">
        <div className="flex flex-col items-center text-center">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            <Sparkle className="size-3.5 text-sage" strokeWidth={2} />
            Search · offline · 100 miles
          </p>
          <h1 className="mt-2 font-sans text-[2.4rem] font-semibold tracking-tight text-wood">
            wander
          </h1>
        </div>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            commit({ q: draft, tag });
          }}
        >
          <label className="flex min-h-14 items-center gap-3 rounded-full bg-surface px-5 shadow-[var(--shadow-border)]">
            <SearchIcon className="size-5 text-muted" strokeWidth={1.75} />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Sauna, gym, Oakland, DEXA…"
              className="h-14 flex-1 bg-transparent text-base outline-none"
              enterKeyHint="search"
            />
          </label>
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {VISUAL_TAGS.map((t) => (
            <TagChip
              key={t.key}
              tag={t.key}
              on={tag === t.key}
              onClick={() => commit({ q, tag: tag === t.key ? "" : t.key })}
            />
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(ANCHORS) as (keyof typeof ANCHORS)[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setAnchor(k)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-3 text-sm",
                anchor === k ? "bg-sage text-primary-fg" : "bg-surface shadow-[var(--shadow-border)]",
              )}
            >
              {ANCHORS[k].label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <HealthFollow active={tag} onPick={(key) => commit({ q, tag: key })} />
        </div>

        <p className="mt-5 text-xs text-muted">
          {hits.length} places within {RADIUS_MI} miles
          {q ? ` for “${q}”` : ""}
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {hits.map((p) => (
            <li key={p.id}>
              <Link to="/explore/$id" params={{ id: p.id }} className="block">
                <article className="overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]">
                  <img
                    src={p.coverUrl}
                    alt=""
                    className="h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                  />
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm tabular-nums text-wood">
                        from {formatMoney(p.fromPrice)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {p.city} · {p.dist.toFixed(1)} mi · {KIND_LABEL[p.kind]}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 4).map((t) => {
                        const known = VISUAL_TAGS.find((v) => v.match.includes(t) || v.key === t);
                        return (
                          <span
                            key={t}
                            className="rounded-full bg-sage-soft px-2 py-0.5 text-[11px] text-sage"
                          >
                            {known?.label ?? t}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
