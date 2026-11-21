/** Personal 0.3 alpha dashboard: water-first protocol + logs, all kept on this device. */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { HSA_CATEGORIES, VENUES } from "@/lib/personal/config";
import {
  GUARDRAILS,
  HEAT_CAP_MIN,
  HEAT_LADDER,
  HOME_KIT,
  SECOND_LAYER,
  WATER_LAYER,
  type Layer,
} from "@/lib/personal/protocol";
import {
  buildIcs,
  costPerVisit,
  creditsLeft,
  heatReminders,
  hsaYearTotal,
  monthGrid,
  monthKey,
  needsRestDay,
  parseGearCsv,
  uid,
  visitsByMonth,
} from "@/lib/personal/calc";
import { downloadText, usePersonal } from "@/lib/personal/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me")({ component: MePage });

const today = () => new Date().toLocaleDateString("en-CA");
const money = (n: number) => `$${n.toFixed(2)}`;
const field = "h-11 w-full rounded-xl bg-surface px-3 text-sm shadow-[var(--shadow-border)]";
const card = "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-4">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted">{title}</h2>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </section>
  );
}

function LayerCard({ layer, n }: { layer: Layer; n: number }) {
  return (
    <div className={card}>
      <p className="text-xs text-muted">Layer {n}</p>
      <p className="font-medium">{layer.name}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{layer.intro}</p>
      <ol className="mt-2 flex flex-col gap-1.5 text-sm">
        {layer.steps.map((s, i) => (
          <li key={s.title}>
            <span className="font-medium">
              {i + 1}. {s.title}
            </span>
            <span className="text-muted"> — {s.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Del({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs text-muted underline">
      Remove
    </button>
  );
}

function MePage() {
  const { data, update, ready, clearAll } = usePersonal();
  const venueNames = VENUES.map((v) => v.name);

  // Sauna session form
  const [s, setS] = useState({
    date: today(),
    venue: venueNames[0],
    tempF: 125,
    minutes: 15,
    coolDown: true,
  });
  const sessionNudges = heatReminders(s, HEAT_CAP_MIN);

  // IR panel test form
  const [p, setP] = useState({
    date: today(),
    device: HOME_KIT.items[0].name,
    area: "Lower back",
    setting: "Lowest",
    minutes: 10,
    skinCheck: true,
  });

  // Planned + calendar
  const now = new Date();
  const [cal, setCal] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [plan, setPlan] = useState({
    date: today(),
    time: "09:00",
    title: `Water + ${SECOND_LAYER.name}`,
    venue: venueNames[0],
  });
  const grid = useMemo(() => monthGrid(cal.y, cal.m), [cal]);

  // Gear
  const [g, setG] = useState({ name: "", date: today(), price: "" });
  const [csv, setCsv] = useState("");
  const [csvMsg, setCsvMsg] = useState("");

  // HSA
  const [h, setH] = useState({ date: today(), amount: "", category: HSA_CATEGORIES[0] as string });
  const year = now.getFullYear();
  const hsaTotal = hsaYearTotal(data.hsa, year);
  const hsaPct =
    data.hsaTarget > 0 ? Math.min(100, Math.round((hsaTotal / data.hsaTarget) * 100)) : 0;

  const mem = data.membership;
  const visits = visitsByMonth(data.sessions, mem.venueName);
  const thisMonth = visits.find(([k]) => k === monthKey(today()))?.[1] ?? 0;
  const cpv = costPerVisit(mem.monthlyPrice, thisMonth);
  const left = creditsLeft(data.credits.total, data.credits.used);

  return (
    <Shell>
      <div className="px-5 pt-6 pb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Personal · 0.3 alpha
        </p>
        <h1 className="font-display text-3xl leading-tight text-wood">My recovery</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A personal log. Everything stays in this browser on this device. Book through each venue’s
          own site or app. Not medical advice.
        </p>

        <nav className="mt-4 flex flex-wrap gap-2 text-xs">
          {[
            ["protocol", "Protocol"],
            ["log", "Sauna log"],
            ["membership", "Membership"],
            ["kit", "At-home kit"],
            ["calendar", "Calendar"],
            ["gear", "Gear"],
            ["hsa", "HSA"],
            ["credits", "Credits"],
            ["venues", "Venues"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full bg-surface-2 px-3 py-1.5">
              {label}
            </a>
          ))}
        </nav>

        <Section id="protocol" title="Protocol">
          <LayerCard layer={WATER_LAYER} n={1} />
          <LayerCard layer={SECOND_LAYER} n={2} />
          <div className={card}>
            <p className="font-medium">Heat, gently</p>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {HEAT_LADDER.map((r) => (
                  <tr key={r.stage} className="border-t border-border first:border-0">
                    <td className="py-1.5 font-medium">{r.stage}</td>
                    <td className="py-1.5">{r.range}</td>
                    <td className="py-1.5 text-right text-muted">{r.minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-2 list-disc pl-5 text-xs leading-relaxed text-muted">
              {GUARDRAILS.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="log" title="Sauna session log">
          <div className={cn(card, "grid grid-cols-2 gap-2")}>
            <label className="text-xs text-muted">
              Date
              <input
                type="date"
                className={field}
                value={s.date}
                onChange={(e) => setS({ ...s, date: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Venue
              <select
                className={field}
                value={s.venue}
                onChange={(e) => setS({ ...s, venue: e.target.value })}
              >
                {venueNames.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted">
              Room temp (°F)
              <input
                type="number"
                inputMode="numeric"
                className={field}
                value={s.tempF}
                onChange={(e) => setS({ ...s, tempF: Number(e.target.value) })}
              />
            </label>
            <label className="text-xs text-muted">
              Minutes
              <input
                type="number"
                inputMode="numeric"
                className={field}
                value={s.minutes}
                onChange={(e) => setS({ ...s, minutes: Number(e.target.value) })}
              />
            </label>
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.coolDown}
                onChange={(e) => setS({ ...s, coolDown: e.target.checked })}
              />{" "}
              Cool-down done
            </label>
            {sessionNudges.length ? (
              <p className="col-span-2 text-xs text-muted">{sessionNudges.join(" ")}</p>
            ) : null}
            <Button
              className="col-span-2"
              onClick={() =>
                update((d) => ({ ...d, sessions: [{ id: uid(), ...s }, ...d.sessions] }))
              }
            >
              Log session
            </Button>
          </div>
          {needsRestDay(data.sessions) ? (
            <p className="text-xs text-muted">
              Back-to-back heat days logged — a rest day might feel good next.
            </p>
          ) : null}
          {data.sessions.map((r) => (
            <div key={r.id} className={cn(card, "flex items-center justify-between text-sm")}>
              <span>
                {r.date} · {r.venue} · {r.tempF}°F · {r.minutes} min
                {r.coolDown ? " · cooled down" : ""}
              </span>
              <Del
                onClick={() =>
                  update((d) => ({ ...d, sessions: d.sessions.filter((x) => x.id !== r.id) }))
                }
              />
            </div>
          ))}
        </Section>

        <Section id="membership" title="Membership">
          <div className={cn(card, "grid grid-cols-2 gap-2")}>
            <p className="col-span-2 font-medium">{mem.label}</p>
            <label className="text-xs text-muted">
              Venue name
              <input
                className={field}
                value={mem.venueName}
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    membership: { ...d.membership, venueName: e.target.value },
                  }))
                }
              />
            </label>
            <label className="text-xs text-muted">
              Monthly price ($)
              <input
                type="number"
                inputMode="decimal"
                className={field}
                value={mem.monthlyPrice || ""}
                placeholder="0"
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    membership: { ...d.membership, monthlyPrice: Number(e.target.value) },
                  }))
                }
              />
            </label>
            <p className="col-span-2 text-sm">
              This month: <b>{thisMonth}</b> visit{thisMonth === 1 ? "" : "s"} ·{" "}
              {cpv === null
                ? "cost per visit shows once you log a visit and a price"
                : `${money(cpv)} per visit`}
            </p>
            {visits.length ? (
              <ul className="col-span-2 text-xs text-muted">
                {visits.map(([k, n]) => (
                  <li key={k}>
                    {k}: {n} visits
                    {costPerVisit(mem.monthlyPrice, n) !== null
                      ? ` · ${money(costPerVisit(mem.monthlyPrice, n)!)} each`
                      : ""}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="col-span-2 text-xs text-muted">
              Visits come from the sauna log entries at this venue.
            </p>
          </div>
        </Section>

        <Section id="kit" title="At-home kit">
          <div className={card}>
            <ul className="text-sm">
              {HOME_KIT.items.map((i) => (
                <li key={i.name}>
                  <span className="font-medium">{i.name}</span>{" "}
                  <span className="text-muted">· {i.model}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-medium">Small-area routine</p>
            <ol className="list-decimal pl-5 text-xs leading-relaxed text-muted">
              {HOME_KIT.routine.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
            <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-xs font-medium">
              {HOME_KIT.notice} {HOME_KIT.manualFirst}
            </p>
          </div>
          <div className={cn(card, "grid grid-cols-2 gap-2")}>
            <p className="col-span-2 font-medium">Panel test log</p>
            <label className="text-xs text-muted">
              Date
              <input
                type="date"
                className={field}
                value={p.date}
                onChange={(e) => setP({ ...p, date: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Device
              <select
                className={field}
                value={p.device}
                onChange={(e) => setP({ ...p, device: e.target.value })}
              >
                {HOME_KIT.items.map((i) => (
                  <option key={i.name}>{i.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted">
              Area
              <input
                className={field}
                value={p.area}
                onChange={(e) => setP({ ...p, area: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Setting
              <input
                className={field}
                value={p.setting}
                onChange={(e) => setP({ ...p, setting: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Timer (min)
              <input
                type="number"
                inputMode="numeric"
                className={field}
                value={p.minutes}
                onChange={(e) => setP({ ...p, minutes: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-end gap-2 pb-3 text-sm">
              <input
                type="checkbox"
                checked={p.skinCheck}
                onChange={(e) => setP({ ...p, skinCheck: e.target.checked })}
              />{" "}
              Skin check done
            </label>
            <Button
              className="col-span-2"
              variant="sage"
              onClick={() =>
                update((d) => ({ ...d, panelTests: [{ id: uid(), ...p }, ...d.panelTests] }))
              }
            >
              Log panel test
            </Button>
          </div>
          {data.panelTests.map((r) => (
            <div key={r.id} className={cn(card, "flex items-center justify-between text-sm")}>
              <span>
                {r.date} · {r.device} · {r.area} · {r.setting} · {r.minutes} min
                {r.skinCheck ? " · skin checked" : ""}
              </span>
              <Del
                onClick={() =>
                  update((d) => ({ ...d, panelTests: d.panelTests.filter((x) => x.id !== r.id) }))
                }
              />
            </div>
          ))}
        </Section>

        <Section id="calendar" title="Calendar">
          <div className={card}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="px-2 text-lg"
                aria-label="Previous month"
                onClick={() =>
                  setCal(cal.m === 0 ? { y: cal.y - 1, m: 11 } : { y: cal.y, m: cal.m - 1 })
                }
              >
                ‹
              </button>
              <p className="font-medium">
                {new Date(cal.y, cal.m, 1).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                type="button"
                className="px-2 text-lg"
                aria-label="Next month"
                onClick={() =>
                  setCal(cal.m === 11 ? { y: cal.y + 1, m: 0 } : { y: cal.y, m: cal.m + 1 })
                }
              >
                ›
              </button>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="text-muted">
                  {d}
                </span>
              ))}
              {grid.map((day, i) => {
                const logged = day && data.sessions.some((x) => x.date === day);
                const planned = day && data.planned.some((x) => x.date === day);
                return (
                  <span
                    key={i}
                    className={cn(
                      "flex h-9 flex-col items-center justify-center rounded-lg",
                      day === today() && "ring-1 ring-ring",
                      logged && "bg-sage-soft",
                    )}
                  >
                    {day ? Number(day.slice(8)) : ""}
                    {planned ? <span className="size-1 rounded-full bg-wood" /> : null}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted">Shaded = logged session · dot = planned</p>
          </div>
          <div className={cn(card, "grid grid-cols-2 gap-2")}>
            <label className="text-xs text-muted">
              Date
              <input
                type="date"
                className={field}
                value={plan.date}
                onChange={(e) => setPlan({ ...plan, date: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Time
              <input
                type="time"
                className={field}
                value={plan.time}
                onChange={(e) => setPlan({ ...plan, time: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Title
              <input
                className={field}
                value={plan.title}
                onChange={(e) => setPlan({ ...plan, title: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Venue
              <select
                className={field}
                value={plan.venue}
                onChange={(e) => setPlan({ ...plan, venue: e.target.value })}
              >
                {venueNames.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <Button
              variant="outline"
              onClick={() =>
                update((d) => ({
                  ...d,
                  planned: [...d.planned, { id: uid(), ...plan }].sort((a, b) =>
                    a.date.localeCompare(b.date),
                  ),
                }))
              }
            >
              Add plan
            </Button>
            <Button
              variant="outline"
              disabled={!data.planned.length}
              onClick={() =>
                downloadText("wander-plan.ics", buildIcs(data.planned), "text/calendar")
              }
            >
              Export .ics
            </Button>
          </div>
          {data.planned.map((r) => (
            <div key={r.id} className={cn(card, "flex items-center justify-between text-sm")}>
              <span>
                {r.date} {r.time} · {r.title} · {r.venue}
              </span>
              <Del
                onClick={() =>
                  update((d) => ({ ...d, planned: d.planned.filter((x) => x.id !== r.id) }))
                }
              />
            </div>
          ))}
        </Section>

        <Section id="gear" title="Owned gear">
          <div className={cn(card, "grid grid-cols-2 gap-2")}>
            <label className="col-span-2 text-xs text-muted">
              Item
              <input
                className={field}
                value={g.name}
                onChange={(e) => setG({ ...g, name: e.target.value })}
                placeholder="e.g. infrared back pad"
              />
            </label>
            <label className="text-xs text-muted">
              Date
              <input
                type="date"
                className={field}
                value={g.date}
                onChange={(e) => setG({ ...g, date: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Price ($)
              <input
                type="number"
                inputMode="decimal"
                className={field}
                value={g.price}
                onChange={(e) => setG({ ...g, price: e.target.value })}
              />
            </label>
            <Button
              className="col-span-2"
              variant="outline"
              disabled={!g.name.trim()}
              onClick={() => {
                update((d) => ({
                  ...d,
                  gear: [
                    {
                      id: uid(),
                      name: g.name.trim(),
                      date: g.date,
                      price: Number(g.price) || 0,
                      source: "Manual",
                    },
                    ...d.gear,
                  ],
                }));
                setG({ ...g, name: "", price: "" });
              }}
            >
              Add item
            </Button>
            <label className="col-span-2 text-xs text-muted">
              Or paste an order CSV (header row with a title/product name column)
              <textarea
                className="mt-1 h-24 w-full rounded-xl bg-surface p-3 text-xs shadow-[var(--shadow-border)]"
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
                placeholder={'Order Date,Title,Item Total\n2026-03-02,"Infrared back pad",89.99'}
              />
            </label>
            <Button
              className="col-span-2"
              variant="outline"
              disabled={!csv.trim()}
              onClick={() => {
                const rows = parseGearCsv(csv);
                update((d) => ({
                  ...d,
                  gear: [...rows.map((r) => ({ id: uid(), ...r })), ...d.gear],
                }));
                setCsvMsg(
                  rows.length
                    ? `Added ${rows.length} item${rows.length === 1 ? "" : "s"}.`
                    : "No rows found — check the header row.",
                );
                if (rows.length) setCsv("");
              }}
            >
              Import CSV
            </Button>
            {csvMsg ? <p className="col-span-2 text-xs text-muted">{csvMsg}</p> : null}
          </div>
          {data.gear.map((r) => (
            <div key={r.id} className={cn(card, "flex items-center justify-between gap-2 text-sm")}>
              <span className="min-w-0 truncate">
                {r.name} · {r.date || "no date"}
                {r.price ? ` · ${money(r.price)}` : ""} · {r.source}
              </span>
              <Del
                onClick={() => update((d) => ({ ...d, gear: d.gear.filter((x) => x.id !== r.id) }))}
              />
            </div>
          ))}
        </Section>

        <Section id="hsa" title={`HSA spend · ${year}`}>
          <div className={cn(card, "grid grid-cols-2 gap-2")}>
            <p className="col-span-2 text-sm">
              <b>{money(hsaTotal)}</b> of {money(data.hsaTarget)} this year
            </p>
            <div className="col-span-2 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-sage" style={{ width: `${hsaPct}%` }} />
            </div>
            <label className="text-xs text-muted">
              Yearly target ($)
              <input
                type="number"
                inputMode="decimal"
                className={field}
                value={data.hsaTarget}
                onChange={(e) => update((d) => ({ ...d, hsaTarget: Number(e.target.value) }))}
              />
            </label>
            <label className="text-xs text-muted">
              Date
              <input
                type="date"
                className={field}
                value={h.date}
                onChange={(e) => setH({ ...h, date: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Amount ($)
              <input
                type="number"
                inputMode="decimal"
                className={field}
                value={h.amount}
                onChange={(e) => setH({ ...h, amount: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted">
              Category
              <select
                className={field}
                value={h.category}
                onChange={(e) => setH({ ...h, category: e.target.value })}
              >
                {HSA_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <Button
              className="col-span-2"
              variant="outline"
              disabled={!(Number(h.amount) > 0)}
              onClick={() => {
                update((d) => ({
                  ...d,
                  hsa: [
                    { id: uid(), date: h.date, amount: Number(h.amount), category: h.category },
                    ...d.hsa,
                  ],
                }));
                setH({ ...h, amount: "" });
              }}
            >
              Add spend
            </Button>
            <p className="col-span-2 text-xs text-muted">
              Amounts, dates, and categories only. Check eligibility with your plan.
            </p>
          </div>
          {data.hsa.map((r) => (
            <div key={r.id} className={cn(card, "flex items-center justify-between text-sm")}>
              <span>
                {r.date} · {money(r.amount)} · {r.category}
              </span>
              <Del
                onClick={() => update((d) => ({ ...d, hsa: d.hsa.filter((x) => x.id !== r.id) }))}
              />
            </div>
          ))}
        </Section>

        <Section id="credits" title="Credits">
          <div className={card}>
            <p className="font-medium">{data.credits.label}</p>
            <p className="mt-1 text-sm">
              <b>{data.credits.used.length}</b> used · <b>{left}</b> left of {data.credits.total}
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={left === 0}
                onClick={() =>
                  update((d) => ({
                    ...d,
                    credits: {
                      ...d.credits,
                      used: [...d.credits.used, { id: uid(), date: today() }],
                    },
                  }))
                }
              >
                Use one today
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={!data.credits.used.length}
                onClick={() =>
                  update((d) => ({
                    ...d,
                    credits: { ...d.credits, used: d.credits.used.slice(0, -1) },
                  }))
                }
              >
                Undo last
              </Button>
            </div>
            {data.credits.used.length ? (
              <p className="mt-2 text-xs text-muted">
                Used on: {data.credits.used.map((u) => u.date).join(", ")}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted">Counts and dates only.</p>
          </div>
        </Section>

        <Section id="venues" title="Venues">
          <p className="text-xs text-muted">
            Book through each venue’s own site or app. Names only — no affiliation.
          </p>
          {VENUES.filter((v) => v.id !== "home").map((v) => (
            <div key={v.id} className={cn(card, "flex items-center justify-between text-sm")}>
              <span className="font-medium">{v.name}</span>
              {v.url ? (
                <a href={v.url} target="_blank" rel="noreferrer" className="text-xs underline">
                  Open site
                </a>
              ) : (
                <span className="text-xs text-muted">Use their app</span>
              )}
            </div>
          ))}
        </Section>

        <div className="mt-8 flex flex-col gap-2">
          <p className="text-xs text-muted">
            {ready ? "Saved in this browser only. Nothing is sent to a server." : "Loading…"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm("Clear all personal data on this device?")) clearAll();
            }}
          >
            Clear my data on this device
          </Button>
          <Link to="/" className="text-center text-sm text-muted underline">
            Home
          </Link>
        </div>
      </div>
    </Shell>
  );
}
