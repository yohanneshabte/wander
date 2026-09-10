import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { BenefitChat } from "@/components/benefit-chat";
import { TagRow } from "@/components/evidence-cards";
import { MODALITIES, OUTCOMES, MODALITY_OUTCOMES } from "@/lib/evidence/taxonomy";
import { useHouse } from "@/lib/platform/store";
import { mapServiceModalities } from "@/lib/evidence/taxonomy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guide")({ component: GuidePage });

function GuidePage() {
  const house = useHouse();
  const [tag, setTag] = useState<string>("");
  const keys = useMemo(() => {
    if (!tag) return new Set(MODALITIES.map((m) => m.key));
    return new Set(
      MODALITY_OUTCOMES.filter(([, t]) => t === tag).map(([m]) => m),
    );
  }, [tag]);
  const offered = useMemo(() => {
    const set = new Set<string>();
    for (const s of house.services) {
      for (const k of mapServiceModalities(s.id, s.categoryKey, s.name)) set.add(k);
    }
    return set;
  }, [house.site.id]);

  const list = MODALITIES.filter((m) => keys.has(m.key));

  return (
    <Shell>
      <div className="px-5 pt-6 pb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Checked records
        </p>
        <h1 className="font-display text-3xl leading-tight text-wood">
          What am I getting?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Industry tags, HSA/FSA notes from IRS Pub 502, and citations you can
          open. Not medical advice. {house.site.name} only offers the cards
          marked on this floor.
        </p>

        <div className="mt-5">
          <TagRow
            tags={[{ key: "", name: "All" }, ...OUTCOMES]}
            active={tag}
            onPick={setTag}
          />
        </div>

        <ul className="mt-5 flex flex-col gap-2">
          {list.map((m) => (
            <li key={m.key}>
              <Link
                to="/service/$slug"
                params={{ slug: m.key }}
                className={cn(
                  "block rounded-2xl px-4 py-3 shadow-[var(--shadow-border)]",
                  offered.has(m.key) ? "bg-surface" : "bg-surface-2",
                )}
              >
                <p className="font-medium">{m.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {m.blurb}
                  {offered.has(m.key)
                    ? ` · on ${house.site.name}`
                    : " · taxonomy only — not on this floor"}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <BenefitChat tag={tag || undefined} />
        </div>

        <Link to="/book" className="mt-5 block">
          <Button size="lg" className="w-full">
            Hold a room
          </Button>
        </Link>
      </div>
    </Shell>
  );
}
