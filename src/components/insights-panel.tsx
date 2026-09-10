import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { CircleSim } from "@/components/circle-sim";
import {
  LATE_FEE_USD,
  LATE_GRACE_MIN,
  MAX_CONCURRENT,
  ROOMS,
  SQUARE_CENTS,
  SQUARE_PERCENT,
} from "@/lib/spa/rooms";
import {
  heatmapHours,
  hourOccupancy,
  isWeekend,
  nextDates,
} from "@/lib/spa/engine";
import { squareTake } from "@/lib/spa/membership";
import { useAllBookings } from "@/lib/spa/store";
import { useHouse } from "@/lib/platform/store";
import { cn, formatMoney } from "@/lib/utils";

const DAYS = 30;
const LIFT = 0.2;

export function InsightsPanel() {
  const bookings = useAllBookings();
  const { site } = useHouse();

  const [tab, setTab] = useState<"desk" | "circle">("desk");
  const [bookingsPerDay, setBookingsPerDay] = useState(20);
  const [ticket, setTicket] = useState(150);
  const [occupancy, setOccupancy] = useState(60);
  const [costs, setCosts] = useState(40);
  const [latePct, setLatePct] = useState(12);

  const gross = bookingsPerDay * ticket * DAYS;
  const lateRev = bookingsPerDay * DAYS * (latePct / 100) * LATE_FEE_USD;
  const square = squareTake(gross + lateRev, bookingsPerDay * DAYS);
  const revenue = gross + lateRev;
  const net = revenue - square;
  const profit = net * (1 - costs / 100);
  const liftedRevenue = revenue * (1 + LIFT);
  const liftedProfit = (liftedRevenue - squareTake(liftedRevenue, bookingsPerDay * DAYS)) * (1 - costs / 100);

  const pattern = useMemo(() => occupancyPattern(bookings), [bookings]);
  const overstaff = occupancy > 75;

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {site.name}
      </p>
      <h1 className="font-display text-3xl leading-tight text-wood">
        Front Desk
      </h1>
      <p className="mt-1 text-sm text-muted">
        Walk-in math for this house, then membership.
      </p>
      <Link to="/calendar" className="mt-4 block">
        <Button variant="outline" className="w-full">
          Open the floor calendar
        </Button>
      </Link>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(["desk", "circle"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "min-h-11 rounded-2xl text-sm font-medium",
              tab === key
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {key === "desk" ? "Desk" : "Circle"}
          </button>
        ))}
      </div>

      {tab === "circle" ? (
        <CircleSim walkInRevenue={gross} costsPct={costs} />
      ) : (
        <DeskTab
          bookingsPerDay={bookingsPerDay}
          ticket={ticket}
          occupancy={occupancy}
          costs={costs}
          latePct={latePct}
          revenue={revenue}
          profit={profit}
          lateRev={lateRev}
          square={square}
          liftedProfit={liftedProfit}
          overstaff={overstaff}
          pattern={pattern}
          onBookings={setBookingsPerDay}
          onTicket={setTicket}
          onOccupancy={setOccupancy}
          onCosts={setCosts}
          onLate={setLatePct}
        />
      )}

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Live holds sit on the calendar. Owner tools for accounts and visit
        counts stay off the public menu.
      </p>
    </div>
  );
}

function DeskTab({
  bookingsPerDay,
  ticket,
  occupancy,
  costs,
  latePct,
  revenue,
  profit,
  lateRev,
  square,
  liftedProfit,
  overstaff,
  pattern,
  onBookings,
  onTicket,
  onOccupancy,
  onCosts,
  onLate,
}: {
  bookingsPerDay: number;
  ticket: number;
  occupancy: number;
  costs: number;
  latePct: number;
  revenue: number;
  profit: number;
  lateRev: number;
  square: number;
  liftedProfit: number;
  overstaff: boolean;
  pattern: { name: string; rooms: number }[];
  onBookings: (n: number) => void;
  onTicket: (n: number) => void;
  onOccupancy: (n: number) => void;
  onCosts: (n: number) => void;
  onLate: (n: number) => void;
}) {
  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Stat
          label="Monthly revenue"
          value={formatMoney(revenue)}
          hint={`${bookingsPerDay}/day · ${formatMoney(ticket)} ticket`}
        />
        <Stat
          label="Monthly profit"
          value={formatMoney(profit)}
          hint={`${costs}% costs · Square ${formatMoney(square)}`}
        />
      </div>

      <div className="mt-4 rounded-3xl bg-wood px-5 py-4 text-wood-fg">
        <p className="text-xs font-medium tracking-wide uppercase opacity-70">
          With dead slots filled
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="font-display text-3xl tabular-nums">
            {formatMoney(liftedProfit)}
          </p>
          <p className="text-sm opacity-80">profit · +20%</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed opacity-90">
          Filling dead slots with 2-hour off-peak packages and cutting
          phone-tag no-shows could add about 20%. Late arrivals after{" "}
          {LATE_GRACE_MIN} minutes keep the original end time and add{" "}
          {formatMoney(LATE_FEE_USD)} — about {formatMoney(lateRev)} a month at{" "}
          {latePct}%.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 rounded-3xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <Knob
          label="Bookings per day"
          value={String(bookingsPerDay)}
          min={4}
          max={40}
          step={1}
          sliderValue={bookingsPerDay}
          onChange={onBookings}
        />
        <Knob
          label="Average ticket"
          value={formatMoney(ticket)}
          min={40}
          max={320}
          step={5}
          sliderValue={ticket}
          onChange={onTicket}
        />
        <Knob
          label="Occupancy"
          value={`${occupancy}%`}
          min={20}
          max={95}
          step={1}
          sliderValue={occupancy}
          onChange={onOccupancy}
        />
        <Knob
          label="Costs"
          value={`${costs}%`}
          min={15}
          max={70}
          step={1}
          sliderValue={costs}
          onChange={onCosts}
        />
        <Knob
          label="Late arrivals"
          value={`${latePct}%`}
          min={0}
          max={40}
          step={1}
          sliderValue={latePct}
          onChange={onLate}
        />
        {overstaff ? (
          <p className="text-sm text-wood">
            Past 75% the floor gets crushed. Six of nine private rooms is the cap
            this demo will not cross.
          </p>
        ) : (
          <p className="text-sm text-muted">
            {occupancy}% leaves weekday mornings open. Staff ceiling is{" "}
            {Math.round((MAX_CONCURRENT / ROOMS.length) * 100)}% — {MAX_CONCURRENT} of{" "}
            {ROOMS.length} rooms. Square online is {SQUARE_PERCENT}% +{" "}
            {formatMoney(SQUARE_CENTS / 100)} per visit.
          </p>
        )}
      </div>

      <section className="mt-6">
        <h2 className="font-display text-xl text-wood">Where mornings sit empty</h2>
        <p className="mt-1 text-sm text-muted">
          Average private rooms reserved this week.
        </p>
        <div className="mt-3 h-48 rounded-3xl bg-surface px-2 pt-4 shadow-[var(--shadow-border)]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pattern} barSize={28}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 9]} />
              <Bar dataKey="rooms" radius={[8, 8, 4, 4]}>
                {pattern.map((row) => (
                  <Cell
                    key={row.name}
                    fill={
                      row.name === "Morning"
                        ? "var(--color-sage)"
                        : "var(--color-wood)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl text-wood">
          Rules already in the calendar
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          <Rule
            title="A time slot, not a duration"
            body={`Arrive after the start and the soak shortens. The next guest still starts on time. After ${LATE_GRACE_MIN} minutes a ${formatMoney(LATE_FEE_USD)} late fee applies, on top of the full reserved hour.`}
          />
          <Rule
            title="15-minute turn"
            body="Every visit is followed by a cleaning turn. The next guest cannot land on a wet room."
          />
          <Rule
            title="Never pack the floor"
            body="Never more than six of nine private rooms at once. Evenings can look full without crushing staff."
          />
          <Rule
            title="Pay with Square"
            body="Demo checkout on Book Now. Recurring Circle dues would sit on a Square card on file — same rail they already use at the desk."
          />
        </ul>
      </section>
    </>
  );
}

function occupancyPattern(bookings: ReturnType<typeof useAllBookings>) {
  const dates = nextDates(14);
  const buckets = {
    Morning: { sum: 0, n: 0 },
    Afternoon: { sum: 0, n: 0 },
    Evening: { sum: 0, n: 0 },
    Weekend: { sum: 0, n: 0 },
  };
  for (const date of dates) {
    for (const hour of heatmapHours(date)) {
      const occ = hourOccupancy(bookings, date, hour);
      const weekend = isWeekend(date);
      const key = weekend
        ? "Weekend"
        : hour < 12
          ? "Morning"
          : hour < 17
            ? "Afternoon"
            : "Evening";
      buckets[key].sum += occ;
      buckets[key].n += 1;
    }
  }
  return (Object.keys(buckets) as Array<keyof typeof buckets>).map((name) => ({
    name,
    rooms:
      Math.round((buckets[name].n ? buckets[name].sum / buckets[name].n : 0) * 10) /
      10,
  }));
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

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-sm font-medium text-wood">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </li>
  );
}
