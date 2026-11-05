import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { setHousePick, usePlatform } from "@/lib/platform/store";
import { assessProfit, defaultProfit } from "@/lib/platform/profit";
import { displayPrice } from "@/lib/platform/rooms";
import type { HouseCatalog, PlatformSettings } from "@/lib/platform/types";
import { houseEconomics } from "@/lib/platform/api";
import { cn, formatMoney } from "@/lib/utils";
import { toast } from "sonner";

export function AdminHouse() {
  const { settings, houses, house, save } = usePlatform();
  const [draft, setDraft] = useState<PlatformSettings>(settings);
  const [busy, setBusy] = useState(false);
  const [counts, setCounts] = useState<Awaited<ReturnType<typeof houseEconomics>> | null>(null);

  useEffect(() => setDraft(settings), [settings]);
  useEffect(() => {
    houseEconomics()
      .then(setCounts)
      .catch(() => setCounts(null));
  }, []);

  async function persist(next: PlatformSettings) {
    setDraft(next);
    setBusy(true);
    try {
      await save(next);
      setHousePick(null);
      toast("House settings saved.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5">
      <p className="text-sm leading-relaxed text-muted">
        Flip the live house for a lobby demo. Discovery lets a guest try another
        house from Home without signing in as owner.
      </p>

      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Live house
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {houses.map((h) => (
          <button
            key={h.site.id}
            type="button"
            onClick={() => persist({ ...draft, liveSiteId: h.site.id, previewSiteId: h.site.id })}
            className={cn(
              "min-h-14 rounded-2xl px-3 text-left text-sm font-medium",
              draft.liveSiteId === h.site.id
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {h.site.name}
            <span className="mt-0.5 block text-[11px] font-normal opacity-80">
              {h.site.city} · {h.services.length} services
            </span>
          </button>
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        <Toggle
          label="Demo mode"
          hint="Banners, mock occupancy, no real card charge."
          on={draft.demoMode}
          onChange={(demoMode) => persist({ ...draft, demoMode })}
        />
        <Toggle
          label="Self-serve discovery"
          hint="Home shows a house switcher so a manager can try SoliVana or Watercourse without a login."
          on={draft.discoveryMode}
          onChange={(discoveryMode) => persist({ ...draft, discoveryMode })}
        />
        <Toggle
          label="House voice"
          hint="On: use that spa’s own words. Off: generic platform copy for a cold pitch."
          on={draft.houseVoice}
          onChange={(houseVoice) => persist({ ...draft, houseVoice })}
        />
        <Toggle
          label="Unlock directory on public pages"
          hint="OFF by default. The printed QR stays Watercourse. Turn on only after you research affiliation — then Home can grow a Bay Area search."
          on={draft.directoryUnlocked}
          onChange={(directoryUnlocked) => persist({ ...draft, directoryUnlocked })}
        />
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Store portals: a house signs in, then enters desk-c / desk-d / desk-e on
        Visits. They only see their own guests. Explore is for signed-in
        members — not the printed QR.
      </p>
      <Link to="/directory">
        <Button variant="outline" className="mt-4 w-full">
          Open hidden Bay Area directory
        </Button>
      </Link>
      <p className="mt-3 text-xs text-muted">{busy ? "Saving…" : "Changes apply to the public pages."}</p>

      <Catalog house={house} counts={counts} />
      <Profit house={house} />
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">{hint}</span>
      </span>
      <Switch checked={on} onCheckedChange={onChange} />
    </label>
  );
}

function Catalog({
  house,
  counts,
}: {
  house: HouseCatalog;
  counts: Awaited<ReturnType<typeof houseEconomics>> | null;
}) {
  const [open, setOpen] = useState<string>(house.categories[0]?.key ?? "");
  const visits = counts?.visits.find((v) => v.site_id === house.site.id)?.n ?? 0;
  const holds = counts?.holds.find((v) => v.site_id === house.site.id)?.n ?? 0;
  return (
    <div className="mt-8">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
        Menu scraped from their site
      </h2>
      <p className="mt-1 text-sm text-muted">
        {house.site.website.replace("https://", "")} · {visits} pings · {holds} holds
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {house.categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setOpen(c.key)}
            className={cn(
              "min-h-10 rounded-full px-3 text-sm",
              open === c.key
                ? "bg-sage text-primary-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {house.services
          .filter((s) => s.categoryKey === open)
          .map((s) => (
            <li
              key={s.id}
              className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-sm tabular-nums text-wood">
                  {displayPrice(s.listPrice ?? s.weekdayPrice)}
                  {s.weekendPrice && s.weekendPrice !== s.weekdayPrice
                    ? ` / ${displayPrice(s.weekendPrice)}`
                    : ""}
                </p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {s.durationMin ? `${s.durationMin} min · ` : ""}
                {s.blurb}
              </p>
              {s.source ? (
                <p className="mt-1 text-[11px] text-muted">Source {s.source}</p>
              ) : null}
            </li>
          ))}
        {open === "membership" || open === house.categories.find((c) => c.key === "membership")?.key ? (
          house.memberships.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-sm tabular-nums text-wood">
                  {formatMoney(m.priceMonth)}/mo
                </p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {m.credits} · {m.blurb}
              </p>
            </li>
          ))
        ) : null}
      </ul>
    </div>
  );
}

function Profit({ house }: { house: HouseCatalog }) {
  const seed = useMemo(() => defaultProfit(house), [house.site.id]);
  const [sessions, setSessions] = useState(seed.sessionsPerDay);
  const [ticket, setTicket] = useState(seed.avgTicket);
  const [occupancy, setOccupancy] = useState(seed.occupancy);
  const [costs, setCosts] = useState(seed.costs);
  const [members, setMembers] = useState(seed.members);
  const [dues, setDues] = useState(seed.avgDues);
  const [noShow, setNoShow] = useState(seed.noShowPct);

  useEffect(() => {
    const d = defaultProfit(house);
    setSessions(d.sessionsPerDay);
    setTicket(d.avgTicket);
    setOccupancy(d.occupancy);
    setCosts(d.costs);
    setMembers(d.members);
    setDues(d.avgDues);
    setNoShow(d.noShowPct);
  }, [house.site.id]);

  const a = assessProfit(house, {
    sessionsPerDay: sessions,
    avgTicket: ticket,
    occupancy,
    costs,
    members,
    avgDues: dues,
    noShowPct: noShow,
  });

  return (
    <div className="mt-8">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
        Profit if they switch
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{a.sentence}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="This month" value={formatMoney(a.profit)} />
        <Stat label="With fill + no-show cut" value={formatMoney(a.profitAfter)} />
      </div>
      <div className="mt-3 h-36 rounded-3xl bg-surface px-2 py-3 shadow-[var(--shadow-border)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: "Now", n: Math.round(a.profit) },
              { name: "After", n: Math.round(a.profitAfter) },
            ]}
          >
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis hide />
            <Bar dataKey="n" fill="#4f6b55" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Knob label="Sessions / day" value={sessions} min={4} max={40} on={setSessions} />
      <Knob label="Average ticket" value={ticket} min={40} max={400} on={setTicket} money />
      <Knob label="Occupancy %" value={occupancy} min={20} max={95} on={setOccupancy} />
      <Knob label="Costs %" value={costs} min={20} max={70} on={setCosts} />
      <Knob label="Members" value={members} min={0} max={120} on={setMembers} />
      <Knob label="Avg dues" value={dues} min={0} max={800} on={setDues} money />
      <Knob label="No-show %" value={noShow} min={0} max={30} on={setNoShow} />
      <p className="mt-3 text-xs text-muted">
        Tickets from their published menu. Capacity {house.resources.length} rooms × open hours.
        Not a promise — a desk math sheet for the pitch.
      </p>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => setHousePick(house.site.id)}
      >
        Preview this house as a guest
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl text-wood">{value}</p>
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  on,
  money,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  on: (n: number) => void;
  money?: boolean;
}) {
  return (
    <label className="mt-3 block">
      <span className="flex items-center justify-between text-xs text-muted">
        {label}
        <span className="tabular-nums text-fg">
          {money ? formatMoney(value) : value}
        </span>
      </span>
      <Slider
        className="mt-2"
        min={min}
        max={max}
        value={[value]}
        onValueChange={(v) => on(v[0] ?? value)}
      />
    </label>
  );
}
