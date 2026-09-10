import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { RoleGate } from "@/components/role-gate";
import { listProspects } from "@/lib/directory/api";
import {
  GAP_LABEL,
  KIND_LABEL,
  PROSPECTS,
  REGION_LABEL,
  type BookingGap,
  type PlaceKind,
  type Prospect,
  type Region,
} from "@/lib/directory/prospects";
import { ANCHORS, miles } from "@/lib/directory/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  return (
    <Shell wide>
      <RoleGate allow={["admin"]}>
        <DirectoryDesk />
      </RoleGate>
    </Shell>
  );
}

function DirectoryDesk() {
  const [rows, setRows] = useState<Prospect[]>(PROSPECTS);
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [kind, setKind] = useState<PlaceKind | "all">("all");
  const [gap, setGap] = useState<BookingGap | "all">("all");
  const [tag, setTag] = useState("");
  const [anchor, setAnchor] = useState<keyof typeof ANCHORS>("sanLeandro");

  useEffect(() => {
    listProspects()
      .then(setRows)
      .catch(() => setRows(PROSPECTS));
  }, []);

  const tags = useMemo(() => {
    const s = new Set<string>();
    for (const r of rows) for (const t of r.tags) s.add(t);
    return [...s].sort();
  }, [rows]);

  const origin = ANCHORS[anchor];
  const filtered = rows
    .filter((p) => (region === "all" ? true : p.region === region))
    .filter((p) => (kind === "all" ? true : p.kind === kind))
    .filter((p) => (gap === "all" ? true : p.bookingGap === gap))
    .filter((p) => (tag ? p.tags.includes(tag) : true))
    .filter((p) => {
      if (!q.trim()) return true;
      const hay = `${p.name} ${p.city} ${p.kind} ${p.tags.join(" ")} ${p.pitch}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    })
    .map((p) => ({ p, dist: miles(origin, p) }))
    .sort((a, b) => a.dist - b.dist);

  const pitchable = filtered.filter(
    (x) => x.p.bookingGap === "phone" || x.p.bookingGap === "walkin" || x.p.bookingGap === "weak_web",
  );

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Hidden · owner only · not on the public QR
      </p>
      <h1 className="font-display text-3xl text-wood">Bay Area directory</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {rows.length} modeled prospects. Gym, infrared, bathhouse, Korean spa,
        longevity. Not affiliated — a private hit list until you research each
        house. OSM dump failed from this sandbox; this is a curated fill of the
        same schema.
      </p>

      <label className="mt-4 block text-sm">
        <span className="text-xs text-muted">Search</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 text-base shadow-[var(--shadow-border)]"
          placeholder="sauna, Fremont, peptides, desk…"
        />
      </label>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {(["all", "east", "west", "south"] as const).map((r) => (
          <Chip key={r} on={region === r} onClick={() => setRegion(r)}>
            {r === "all" ? "All bays" : REGION_LABEL[r]}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Chip on={kind === "all"} onClick={() => setKind("all")}>
          Any kind
        </Chip>
        {(Object.keys(KIND_LABEL) as PlaceKind[]).map((k) => (
          <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
            {KIND_LABEL[k]}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {(["all", "phone", "walkin", "weak_web", "app"] as const).map((g) => (
          <Chip key={g} on={gap === g} onClick={() => setGap(g)}>
            {g === "all" ? "Any booking" : GAP_LABEL[g]}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Chip on={!tag} onClick={() => setTag("")}>
          Any tag
        </Chip>
        {tags.map((t) => (
          <Chip key={t} on={tag === t} onClick={() => setTag(t)}>
            {t}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(ANCHORS) as (keyof typeof ANCHORS)[]).map((k) => (
          <Chip key={k} on={anchor === k} onClick={() => setAnchor(k)}>
            Near {ANCHORS[k].label}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">
        {filtered.length} shown · {pitchable.length} still phone / walk-in / weak web
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {filtered.map(({ p, dist }) => (
          <li key={p.id}>
            <Link
              to="/directory/$id"
              params={{ id: p.id }}
              className="block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs tabular-nums text-muted">{dist.toFixed(1)} mi</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {p.city} · {KIND_LABEL[p.kind]} · {GAP_LABEL[p.bookingGap]}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-fg/80">{p.pitch}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 shrink-0 rounded-full px-3 text-sm",
        on ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]",
      )}
    >
      {children}
    </button>
  );
}
