import { useEffect, useState } from "react";
import { HEALTH_GOALS } from "@/lib/market/tags";
import { readGoals, toggleGoal, weekCount } from "@/lib/market/goals-local";
import { TagIcon } from "@/components/tag-chip";
import { cn } from "@/lib/utils";
import type { TagKey } from "@/lib/market/tags";

const TARGET = 3;

export function HealthFollow({
  active,
  onPick,
}: {
  active: string;
  onPick: (key: string) => void;
}) {
  const [goals, setGoals] = useState<string[]>([]);
  const [, setN] = useState(0);

  useEffect(() => {
    setGoals(readGoals());
    const on = () => {
      setGoals(readGoals());
      setN((x) => x + 1);
    };
    window.addEventListener("wander-goals", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("wander-goals", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Follow your week
      </p>
      <p className="mt-1 text-xs text-muted">
        Tap a ring to filter Search. It fills when you hold a session this week.
        Target is three.
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {HEALTH_GOALS.map((g) => {
          const n = Math.min(weekCount(g.key), TARGET);
          const pinned = goals.includes(g.key);
          const on = active === g.key;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => {
                if (!goals.includes(g.key)) setGoals(toggleGoal(g.key));
                onPick(on ? "" : g.key);
              }}
              className={cn(
                "flex min-w-[4.6rem] flex-col items-center gap-1 rounded-2xl px-2 py-2",
                on ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]",
              )}
            >
              <Ring n={n} on={on} tag={g.key} />
              <span className="text-[11px] font-medium">{g.label}</span>
              <span className={cn("text-[10px] tabular-nums", on ? "opacity-70" : "text-muted")}>
                {n}/{TARGET}
                {pinned ? " · on" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Ring({ n, on, tag }: { n: number; on: boolean; tag: TagKey }) {
  const pct = n / TARGET;
  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  return (
    <span className="relative grid size-11 place-items-center">
      <svg viewBox="0 0 40 40" className="absolute inset-0 size-11 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={on ? "opacity-20" : "text-sage-soft"}
        />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          className={on ? "text-wood-fg" : "text-sage"}
        />
      </svg>
      <TagIcon tag={tag} className="relative size-4" />
    </span>
  );
}
