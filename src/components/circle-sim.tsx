import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ROOMS } from "@/lib/spa/rooms";
import {
  DEFAULT_MEMBER_ROOMS,
  MEMBER_TIERS,
  simulateCircle,
  type MemberTierId,
} from "@/lib/spa/membership";
import { cn, formatMoney } from "@/lib/utils";

export function CircleSim({
  walkInRevenue,
  costsPct,
}: {
  walkInRevenue: number;
  costsPct: number;
}) {
  const [members, setMembers] = useState(80);
  const [tierId, setTierId] = useState<Exclude<MemberTierId, "none">>("anytime");
  const [hoursUsed, setHoursUsed] = useState(5);
  const [extraHours, setExtraHours] = useState(1);
  const [cannibalPct, setCannibalPct] = useState(40);
  const [latePct, setLatePct] = useState(12);
  const [roomIds, setRoomIds] = useState<string[]>(DEFAULT_MEMBER_ROOMS);

  const sim = useMemo(
    () =>
      simulateCircle({
        members,
        tierId,
        hoursUsed,
        extraHours,
        cannibalPct,
        latePct,
        roomIds,
        walkInRevenue,
        costsPct,
      }),
    [
      members,
      tierId,
      hoursUsed,
      extraHours,
      cannibalPct,
      latePct,
      roomIds,
      walkInRevenue,
      costsPct,
    ],
  );

  const ahead = sim.delta >= 0;

  function toggleRoom(id: string) {
    setRoomIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  return (
    <div className="mt-5">
      <p className="text-sm text-muted">
        Perspire-style Circle: monthly dues, included hours, extra at a member
        rate. Pick which private rooms members fill first.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {MEMBER_TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTierId(t.id as Exclude<MemberTierId, "none">);
              setHoursUsed(Math.min(t.hours, t.id === "house" ? 10 : t.hours));
            }}
            className={cn(
              "min-h-16 rounded-2xl px-2 py-2 text-center",
              tierId === t.id
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            <span className="block text-[11px] font-medium leading-tight">
              {t.name}
            </span>
            <span className="mt-1 block font-display text-lg leading-none">
              {formatMoney(t.price)}
            </span>
            <span className="mt-1 block text-[10px] opacity-80">{t.tag}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{sim.tier.blurb}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat
          label="Today profit"
          value={formatMoney(sim.todayProfit)}
          hint="Walk-in desk, after Square"
        />
        <Stat
          label="With Circle"
          value={formatMoney(sim.newProfit)}
          hint={ahead ? "Members add money" : "Dues don't cover displaced visits"}
        />
      </div>

      <div className="mt-4 rounded-3xl bg-wood px-5 py-4 text-wood-fg">
        <p className="text-xs font-medium tracking-wide uppercase opacity-70">
          {ahead ? "Circle adds" : "Circle trails"}
        </p>
        <p className="mt-1 font-display text-3xl tabular-nums">
          {ahead ? "+" : ""}
          {formatMoney(sim.delta)}
          <span className="ml-1 text-base font-sans opacity-80">/ mo</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed opacity-90">
          {members} on {sim.tier.name} at {formatMoney(sim.tier.price)}: dues{" "}
          {formatMoney(sim.mrr)}, extra hours {formatMoney(sim.extraRev)}, late
          fees {formatMoney(sim.lateRev)}. Replaces {formatMoney(sim.cannibal)} of
          walk-in. Square takes {formatMoney(sim.square)}.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-6 rounded-3xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <Knob
          label="Circle members"
          value={String(members)}
          min={0}
          max={250}
          step={5}
          sliderValue={members}
          onChange={setMembers}
        />
        <Knob
          label="Hours used / member"
          value={`${hoursUsed} hr`}
          min={1}
          max={16}
          step={1}
          sliderValue={hoursUsed}
          onChange={setHoursUsed}
        />
        <Knob
          label="Extra hours billed"
          value={`${extraHours} hr`}
          min={0}
          max={8}
          step={0.5}
          sliderValue={extraHours}
          onChange={setExtraHours}
        />
        <Knob
          label="Walk-in replaced"
          value={`${cannibalPct}%`}
          min={0}
          max={80}
          step={5}
          sliderValue={cannibalPct}
          onChange={setCannibalPct}
        />
        <Knob
          label="Late arrivals"
          value={`${latePct}%`}
          min={0}
          max={40}
          step={1}
          sliderValue={latePct}
          onChange={setLatePct}
        />
      </div>

      <section className="mt-6">
        <h2 className="font-display text-xl text-wood">Member rooms</h2>
        <p className="mt-1 text-sm text-muted">
          Circle holds these first on weekday mornings. Morning load on the
          selected rooms ≈ {sim.morningLift.toFixed(1)} of 6.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {ROOMS.map((r) => {
            const on = roomIds.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleRoom(r.id)}
                className={cn(
                  "min-h-12 rounded-2xl px-2 text-xs font-medium",
                  on
                    ? "bg-sage text-primary-fg"
                    : "bg-surface text-muted shadow-[var(--shadow-border)]",
                )}
              >
                {r.number} {r.short}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums leading-none text-wood">
        {value}
      </p>
      <p className="mt-2 text-[11px] text-muted">{hint}</p>
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  sliderValue,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  sliderValue: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="font-display text-lg tabular-nums">{value}</p>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[sliderValue]}
        onValueChange={(v) => onChange(v[0] ?? sliderValue)}
      />
    </div>
  );
}
