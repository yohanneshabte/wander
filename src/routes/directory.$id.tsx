import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { RoleGate } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { getProspect } from "@/lib/directory/api";
import {
  GAP_LABEL,
  KIND_LABEL,
  KIND_MENU,
  PROSPECTS,
  REGION_LABEL,
  type Prospect,
} from "@/lib/directory/prospects";
import { similarTo } from "@/lib/directory/geo";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/directory/$id")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: PlacePage,
});

function PlacePage() {
  return (
    <Shell>
      <RoleGate allow={["admin"]}>
        <PlaceDesk />
      </RoleGate>
    </Shell>
  );
}

function PlaceDesk() {
  const { id } = Route.useParams();
  const [place, setPlace] = useState<Prospect | null>(
    PROSPECTS.find((p) => p.id === id) ?? null,
  );

  useEffect(() => {
    getProspect({ data: id })
      .then((row) => setPlace(row))
      .catch(() => setPlace(PROSPECTS.find((p) => p.id === id) ?? null));
  }, [id]);

  if (!place) {
    return (
      <div className="px-5 pt-10">
        <p className="text-sm text-muted">Not in the hidden dump.</p>
        <Link to="/directory" className="mt-4 block">
          <Button className="w-full">Directory</Button>
        </Link>
      </div>
    );
  }

  const menu = KIND_MENU[place.kind];
  const near = similarTo(place, PROSPECTS);

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {REGION_LABEL[place.region]} · {KIND_LABEL[place.kind]} · hidden
      </p>
      <h1 className="font-display text-3xl leading-tight text-wood">{place.name}</h1>
      <p className="mt-2 text-sm text-muted">{place.address}</p>
      <p className="mt-1 text-sm font-medium">{GAP_LABEL[place.bookingGap]}</p>
      <p className="mt-3 text-sm leading-relaxed">{place.pitch}</p>
      <p className="mt-2 text-xs text-muted">{place.source}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {place.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-surface px-3 py-1 text-xs shadow-[var(--shadow-border)]"
          >
            {t}
          </span>
        ))}
      </div>

      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Modeled menu (not their official booker)
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {menu.map((s) => (
          <li
            key={s.name}
            className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-sm tabular-nums">{formatMoney(s.listPrice)}</p>
            </div>
            <p className="mt-1 text-xs text-muted">
              {s.durationMin ? `${s.durationMin} min · ` : ""}
              {s.blurb}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Similar nearby
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {near.map(({ p, dist }) => (
          <li key={p.id}>
            <Link
              to="/directory/$id"
              params={{ id: p.id }}
              className="block rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]"
            >
              {p.name}
              <span className="mt-0.5 block text-xs text-muted">
                {p.city} · {dist.toFixed(1)} mi · {GAP_LABEL[p.bookingGap]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {place.website ? (
        <a href={place.website} className="mt-5 block text-sm underline decoration-border">
          Their site
        </a>
      ) : null}
      {place.phone ? (
        <p className="mt-2 text-sm text-muted">{place.phone}</p>
      ) : null}

      <Link to="/directory" className="mt-6 block">
        <Button variant="outline" className="w-full">
          Back to filters
        </Button>
      </Link>
    </div>
  );
}
