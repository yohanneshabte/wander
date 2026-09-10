import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Check, ChevronLeft, ChevronRight, Minus, Phone, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SquarePay } from "@/components/square-pay";
import {
  amenityLabel,
  DAY_CUTOFF_MIN,
  LATE_FEE_USD,
  LATE_GRACE_MIN,
  OPEN_MIN,
  PHONE,
  PHONE_TEL,
  roomHasHeat,
  ROOMS,
} from "@/lib/spa/rooms";
import {
  availableRooms,
  blockReason,
  canBook,
  formatDateLabel,
  formatRange,
  isSlowWindow,
  isWeekdayMorning,
  maxDurationAt,
  nextDates,
  occupancyAt,
  parseDate,
  reasonCopy,
  recommendStart,
  startTimes,
  todayISO,
  type Booking,
} from "@/lib/spa/engine";
import {
  DROP_IN,
  MEMBER_TIERS,
  priceVisit,
  type MemberTierId,
} from "@/lib/spa/membership";
import { useAllBookings, addBooking } from "@/lib/spa/store";
import { useHouse } from "@/lib/platform/store";
import { displayPrice, roomsOf } from "@/lib/platform/rooms";
import { cn, formatMoney } from "@/lib/utils";

const DATES = nextDates(14);
const WEEK_SIZE = 7;

type CalView = "week" | "day" | "list";
type Band = "morning" | "afternoon" | "evening";

const BANDS: { id: Band; label: string; start: number; end: number }[] = [
  { id: "morning", label: "AM", start: OPEN_MIN, end: 12 * 60 },
  { id: "afternoon", label: "PM", start: 12 * 60, end: DAY_CUTOFF_MIN },
  { id: "evening", label: "Eve", start: DAY_CUTOFF_MIN, end: 30 * 60 },
];

function bandOf(t: number): Band {
  if (t < 12 * 60) return "morning";
  if (t < DAY_CUTOFF_MIN) return "afternoon";
  return "evening";
}

function openStarts(
  bookings: Booking[],
  date: string,
  durationMin: number,
  band?: Band,
  roomIds?: string[],
) {
  const pool = roomIds
    ? (id: string) => roomIds.includes(id)
    : () => true;
  return startTimes(date, durationMin).filter((t) => {
    if (t % 30 !== 0) return false;
    if (band && bandOf(t) !== band) return false;
    return availableRooms(bookings, date, t, durationMin).some((r) => pool(r.id));
  });
}

function prettyTime(min: number) {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function durationLabel(min: number) {
  if (min === 60) return "1 hour";
  if (min === 90) return "90 minutes";
  if (min === 120) return "2 hours";
  if (min === 150) return "2½ hours";
  return "3 hours";
}

export function BookFlow() {
  const bookings = useAllBookings();
  const house = useHouse();
  const rooms = roomsOf(house);
  const [cat, setCat] = useState(house.categories[0]?.key ?? "rooms");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState(todayISO());
  const [durationMin, setDurationMin] = useState(90);
  const [startMin, setStartMin] = useState(() =>
    recommendStart(bookings, todayISO(), 90),
  );
  const [roomId, setRoomId] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [withSauna, setWithSauna] = useState(true);
  const [massageRequest, setMassageRequest] = useState(false);
  const [massageNote, setMassageNote] = useState("");
  const [memberTier, setMemberTier] = useState<MemberTierId>("none");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const roomsOpen = useMemo(
    () =>
      rooms.filter((r) =>
        canBook(bookings, date, r.id, startMin, durationMin),
      ),
    [rooms, bookings, date, startMin, durationMin],
  );
  const room = rooms.find((r) => r.id === roomId) ?? null;
  const heatOk = room ? roomHasHeat(room) : false;
  const saunaOn = heatOk && withSauna;
  const quote = priceVisit({
    startMin,
    durationMin,
    guests,
    withSauna: saunaOn,
    memberTier,
  });
  const slow = isSlowWindow(bookings, date, startMin);
  const durationMax = maxDurationAt(bookings, date, startMin);
  const occNow = occupancyAt(bookings, date, startMin);

  useEffect(() => {
    if (durationMin > durationMax) {
      setDurationMin(120);
      toast("2½ and 3 hour visits are for quieter mornings.");
    }
  }, [durationMax, durationMin]);

  useEffect(() => {
    if (roomId && roomsOpen.some((r) => r.id === roomId)) return;
    setRoomId(roomsOpen[0]?.id ?? null);
  }, [roomId, roomsOpen]);

  useEffect(() => {
    if (room && !roomHasHeat(room)) setWithSauna(false);
  }, [room]);

  useEffect(() => {
    const probe = roomId ?? rooms[0]!.id;
    if (canBook(bookings, date, probe, startMin, durationMin) && roomsOpen.length)
      return;
    setStartMin(recommendStart(bookings, date, durationMin));
  }, [bookings, date, durationMin]); // eslint-disable-line react-hooks/exhaustive-deps

  function setDuration(next: number) {
    if (next > 120 && !slow) {
      toast("Longer visits open on weekday mornings and quiet times.");
      return;
    }
    setDurationMin(next);
  }

  async function bookNow() {
    if (!room) {
      toast("Please pick a private hot tub room.");
      return;
    }
    const reason = blockReason(bookings, date, room.id, startMin, durationMin);
    if (reason !== "ok") {
      toast(reasonCopy(reason));
      return;
    }
    try {
      const saved = await addBooking({
        date,
        roomId: room.id,
        startMin,
        durationMin,
        guests,
        withSauna: saunaOn,
        massageRequest,
        massageNote: massageRequest ? massageNote : "",
        memberTier,
        paidVia: "square",
        lateMinutes: 0,
        siteId: house.site.id,
      });
      setPaying(false);
      setConfirmed(saved);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not hold that room.");
      setPaying(false);
    }
  }

  if (confirmed) {
    return <SuccessCard booking={confirmed} onAgain={() => setConfirmed(null)} />;
  }

  return (
    <div className="flex flex-col px-5 pb-8 pt-5">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {house.site.name}
      </p>
      <h1 className="font-display text-3xl leading-tight text-wood">Book Now</h1>
      <p className="mt-1 text-sm text-muted">{house.site.address}</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {house.categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCat(c.key)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-3 text-sm",
              cat === c.key
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {cat !== "rooms" && cat !== "core" ? (
        <MenuBoard houseKey={cat} />
      ) : null}

      {!paying && (cat === "rooms" || cat === "core") ? (
        <ol className="mt-5 grid grid-cols-3 gap-2">
          {(["When", "Room", "Confirm"] as const).map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3;
            const active = step === n;
            const done = step > n;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    if (done || n < step) setStep(n);
                  }}
                  className={cn(
                    "flex w-full min-h-11 flex-col items-start rounded-2xl px-3 py-2 text-left",
                    active
                      ? "bg-wood text-wood-fg"
                      : "bg-surface text-muted shadow-[var(--shadow-border)]",
                  )}
                >
                  <span className="text-[10px] uppercase tracking-wide opacity-80">
                    {n} of 3
                  </span>
                  <span className="text-sm font-medium text-current">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}

      {step === 1 ? (
        <WhenStep
          date={date}
          durationMin={durationMin}
          startMin={startMin}
          bookings={bookings}
          rooms={rooms}
          openMin={house.site.openMin}
          closeMin={house.site.closeMin}
          slow={slow}
          occNow={occNow}
          onDate={setDate}
          onDuration={setDuration}
          onTime={setStartMin}
          onNext={() => {
            if (!roomsOpen.length) {
              toast("Nothing open at that time — try a quieter hour.");
              return;
            }
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : null}

      {step === 2 ? (
        <RoomStep
          rooms={rooms}
          bookings={bookings}
          date={date}
          startMin={startMin}
          durationMin={durationMin}
          roomId={roomId}
          onPick={(id) => {
            setRoomId(id);
            const r = rooms.find((x) => x.id === id);
            if (r && roomHasHeat(r)) setWithSauna(true);
          }}
          onBack={() => setStep(1)}
          onNext={() => {
            if (!room) {
              toast("Choose a private hot tub room.");
              return;
            }
            setStep(3);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : null}

      {step === 3 && !paying ? (
        <ConfirmStep
          room={room}
          date={date}
          startMin={startMin}
          durationMin={durationMin}
          guests={guests}
          heatOk={heatOk}
          saunaOn={saunaOn}
          massageRequest={massageRequest}
          massageNote={massageNote}
          memberTier={memberTier}
          quote={quote}
          onGuests={setGuests}
          onSauna={setWithSauna}
          onMassage={setMassageRequest}
          onNote={setMassageNote}
          onMember={setMemberTier}
          onBack={() => setStep(2)}
          onBook={() => setPaying(true)}
        />
      ) : null}

      {paying ? (
        <SquarePay
          amount={quote.due}
          label={
            quote.covered
              ? `${quote.tier.name} credit`
              : room?.name ?? "Private Hot Tub"
          }
          onPaid={bookNow}
          onBack={() => setPaying(false)}
        />
      ) : null}
    </div>
  );
}

function WhenStep({
  date,
  durationMin,
  startMin,
  bookings,
  rooms,
  openMin,
  closeMin,
  slow,
  occNow,
  onDate,
  onDuration,
  onTime,
  onNext,
}: {
  date: string;
  durationMin: number;
  startMin: number;
  bookings: Booking[];
  rooms: typeof ROOMS;
  openMin: number;
  closeMin: number;
  slow: boolean;
  occNow: number;
  onDate: (d: string) => void;
  onDuration: (n: number) => void;
  onTime: (n: number) => void;
  onNext: () => void;
}) {
  const [view, setView] = useState<CalView>("week");
  const [weekStart, setWeekStart] = useState(0);
  const week = DATES.slice(weekStart, weekStart + WEEK_SIZE);

  function pickBand(d: string, band: Band) {
    const open = openStarts(
      bookings,
      d,
      durationMin,
      band,
      rooms.map((r) => r.id),
    ).filter((t) => t >= openMin && t + durationMin <= closeMin);
    if (!open.length) {
      toast("Nothing open in that window.");
      return;
    }
    onDate(d);
    const keep =
      d === date && bandOf(startMin) === band && open.includes(startMin);
    onTime(keep ? startMin : open[0]!);
  }

  return (
    <div className="mt-6">
      <div>
        <SectionLabel>How long</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {[60, 90, 120].map((min) => (
            <button
              key={min}
              onClick={() => onDuration(min)}
              className={cn(
                "min-h-14 rounded-2xl px-2 text-sm font-medium",
                durationMin === min
                  ? "bg-wood text-wood-fg"
                  : "bg-surface shadow-[var(--shadow-border)]",
              )}
            >
              {durationLabel(min)}
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[150, 180].map((min) => {
            const locked = !slow && durationMin !== min;
            return (
              <button
                key={min}
                onClick={() => onDuration(min)}
                className={cn(
                  "min-h-12 rounded-2xl px-2 text-sm",
                  durationMin === min
                    ? "bg-wood text-wood-fg"
                    : locked
                      ? "bg-surface-2 text-muted"
                      : "bg-surface shadow-[var(--shadow-border)]",
                )}
              >
                {durationLabel(min)}
                <span className="mt-0.5 block text-[10px] opacity-80">
                  off-peak
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {(["week", "day", "list"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={cn(
              "min-h-11 rounded-2xl text-sm font-medium capitalize",
              view === key
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {key}
          </button>
        ))}
      </div>

      {view === "week" ? (
        <WeekCal
          week={week}
          weekStart={weekStart}
          date={date}
          startMin={startMin}
          durationMin={durationMin}
          bookings={bookings}
          onBand={pickBand}
          onPrev={() => setWeekStart(0)}
          onNextWeek={() => setWeekStart(WEEK_SIZE)}
        />
      ) : null}

      {view === "day" ? (
        <DayCal
          date={date}
          startMin={startMin}
          durationMin={durationMin}
          bookings={bookings}
          onDate={onDate}
          onTime={onTime}
        />
      ) : null}

      {view === "list" ? (
        <ListCal
          date={date}
          startMin={startMin}
          durationMin={durationMin}
          bookings={bookings}
          onDate={onDate}
          onTime={onTime}
        />
      ) : null}

      <p className="mt-4 text-sm text-wood">
        {format(parseDate(date), "EEE d")} · {prettyTime(startMin)} ·{" "}
        {durationLabel(durationMin)}
        {occNow <= 2 ? " · quieter" : occNow >= 5 ? " · busy" : ""}
      </p>

      <Button size="lg" className="mt-5 w-full" onClick={onNext}>
        Continue · pick a room
      </Button>
    </div>
  );
}

function WeekCal({
  week,
  weekStart,
  date,
  startMin,
  durationMin,
  bookings,
  onBand,
  onPrev,
  onNextWeek,
}: {
  week: string[];
  weekStart: number;
  date: string;
  startMin: number;
  durationMin: number;
  bookings: Booking[];
  onBand: (d: string, band: Band) => void;
  onPrev: () => void;
  onNextWeek: () => void;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30"
          disabled={weekStart === 0}
          onClick={onPrev}
          aria-label="Previous week"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-medium">
          {format(parseDate(week[0]!), "MMM d")} –{" "}
          {format(parseDate(week[week.length - 1]!), "MMM d")}
        </p>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30"
          disabled={weekStart + WEEK_SIZE >= DATES.length}
          onClick={onNextWeek}
          aria-label="Next week"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-border)]">
        <div className="grid grid-cols-[2.5rem_repeat(7,minmax(0,1fr))]">
          <div />
          {week.map((d) => {
            const parsed = parseDate(d);
            const selected = d === date;
            return (
              <div
                key={d}
                className={cn("py-2 text-center", selected && "text-wood")}
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                  {d === todayISO() ? "Now" : format(parsed, "EEE")}
                </p>
                <p className="font-display text-base leading-none">
                  {format(parsed, "d")}
                </p>
              </div>
            );
          })}
          {BANDS.map((band) => (
            <BandRow
              key={band.id}
              band={band}
              week={week}
              date={date}
              startMin={startMin}
              durationMin={durationMin}
              bookings={bookings}
              onBand={onBand}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        Number is open starts. Tap a cell to hold that window.
      </p>
    </div>
  );
}

function BandRow({
  band,
  week,
  date,
  startMin,
  durationMin,
  bookings,
  onBand,
}: {
  band: (typeof BANDS)[number];
  week: string[];
  date: string;
  startMin: number;
  durationMin: number;
  bookings: Booking[];
  onBand: (d: string, b: Band) => void;
}) {
  return (
    <>
      <div className="flex items-center px-1 text-[11px] font-medium text-muted">
        {band.label}
      </div>
      {week.map((d) => {
        const open = openStarts(bookings, d, durationMin, band.id);
        const selected = d === date && bandOf(startMin) === band.id;
        const empty = open.length === 0;
        return (
          <button
            key={`${d}-${band.id}`}
            type="button"
            disabled={empty}
            onClick={() => onBand(d, band.id)}
            className={cn(
              "m-0.5 flex min-h-11 items-center justify-center rounded-xl text-xs font-medium tabular-nums",
              empty && "text-muted/50",
              !empty && !selected && "bg-sage-soft text-sage",
              selected && "bg-wood text-wood-fg",
            )}
          >
            {empty ? "—" : open.length}
          </button>
        );
      })}
    </>
  );
}

function DayCal({
  date,
  startMin,
  durationMin,
  bookings,
  onDate,
  onTime,
}: {
  date: string;
  startMin: number;
  durationMin: number;
  bookings: Booking[];
  onDate: (d: string) => void;
  onTime: (n: number) => void;
}) {
  const hours = useMemo(() => {
    const close = startTimes(date, durationMin);
    const hs: number[] = [];
    for (const t of close) {
      if (t % 30 !== 0) continue;
      const h = Math.floor(t / 60);
      if (!hs.includes(h)) hs.push(h);
    }
    return hs;
  }, [date, durationMin]);

  return (
    <div className="mt-4">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DATES.map((d) => {
          const parsed = parseDate(d);
          const selected = d === date;
          return (
            <button
              key={d}
              onClick={() => onDate(d)}
              className={cn(
                "snap-start flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-2.5 py-1",
                selected
                  ? "bg-wood text-wood-fg"
                  : "bg-surface text-fg shadow-[var(--shadow-border)]",
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                {d === todayISO() ? "Today" : format(parsed, "EEE")}
              </span>
              <span className="font-display text-lg leading-none">
                {format(parsed, "d")}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {hours.map((h) => {
          const slot = h * 60;
          const half = h * 60 + 30;
          const options = [slot, half].filter(
            (t) => availableRooms(bookings, date, t, durationMin).length > 0,
          );
          const selected = options.includes(startMin);
          const empty = options.length === 0;
          const open = options[0]
            ? availableRooms(bookings, date, options[0], durationMin).length
            : 0;
          const occ = occupancyAt(bookings, date, slot);
          return (
            <button
              key={h}
              type="button"
              disabled={empty}
              onClick={() => {
                const next = options.find((t) => t === startMin) ?? options[0];
                if (next != null) onTime(next);
              }}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-2xl px-3 text-left",
                empty && "bg-surface-2 text-muted",
                !empty && !selected && "bg-surface shadow-[var(--shadow-border)]",
                selected && "bg-wood text-wood-fg",
              )}
            >
              <span className="w-14 shrink-0 text-sm font-medium tabular-nums">
                {prettyTime(slot).replace(":00 ", " ")}
              </span>
              <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    selected ? "bg-wood-fg/80" : "bg-sage",
                  )}
                  style={{ width: `${Math.min(100, (occ / 6) * 100)}%` }}
                />
              </span>
              <span className="w-16 shrink-0 text-right text-xs opacity-80">
                {empty ? "Full" : `${open} open`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListCal({
  date,
  startMin,
  durationMin,
  bookings,
  onDate,
  onTime,
}: {
  date: string;
  startMin: number;
  durationMin: number;
  bookings: Booking[];
  onDate: (d: string) => void;
  onTime: (n: number) => void;
}) {
  const dayTimes = startTimes(date, durationMin).filter(
    (t) => t % 30 === 0 && t < DAY_CUTOFF_MIN,
  );
  const eveningTimes = startTimes(date, durationMin).filter(
    (t) => t % 30 === 0 && t >= DAY_CUTOFF_MIN,
  );
  return (
    <div className="mt-4">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DATES.map((d) => {
          const parsed = parseDate(d);
          const selected = d === date;
          return (
            <button
              key={d}
              onClick={() => onDate(d)}
              className={cn(
                "snap-start flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-2.5 py-1",
                selected
                  ? "bg-wood text-wood-fg"
                  : "bg-surface text-fg shadow-[var(--shadow-border)]",
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                {d === todayISO() ? "Today" : format(parsed, "EEE")}
              </span>
              <span className="font-display text-lg leading-none">
                {format(parsed, "d")}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        <SectionLabel>Day rates · 8:30am–5:30pm</SectionLabel>
        <TimeGroup
          times={dayTimes}
          date={date}
          durationMin={durationMin}
          startMin={startMin}
          bookings={bookings}
          onTime={onTime}
        />
      </div>
      <div className="mt-5">
        <SectionLabel>Evening rates · 5:40pm–close</SectionLabel>
        <TimeGroup
          times={eveningTimes}
          date={date}
          durationMin={durationMin}
          startMin={startMin}
          bookings={bookings}
          onTime={onTime}
        />
      </div>
    </div>
  );
}

function TimeGroup({
  times,
  date,
  durationMin,
  startMin,
  bookings,
  onTime,
}: {
  times: number[];
  date: string;
  durationMin: number;
  startMin: number;
  bookings: Booking[];
  onTime: (n: number) => void;
}) {
  const visible = times.filter(
    (t) => availableRooms(bookings, date, t, durationMin).length > 0,
  );
  if (!visible.length) {
    return <p className="text-sm text-muted">Nothing open in this window.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      {visible.map((t) => {
        const openCount = availableRooms(bookings, date, t, durationMin).length;
        const selected = t === startMin;
        const morning = isWeekdayMorning(date, t);
        return (
          <button
            key={t}
            onClick={() => onTime(t)}
            className={cn(
              "flex min-h-14 items-center justify-between rounded-2xl px-4 text-left",
              selected
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            <span className="text-base font-medium tabular-nums">
              {prettyTime(t)}
            </span>
            <span className="text-xs opacity-80">
              {morning
                ? `${openCount} open · quieter morning`
                : `${openCount} of 9 open`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RoomStep({
  rooms,
  bookings,
  date,
  startMin,
  durationMin,
  roomId,
  onPick,
  onBack,
  onNext,
}: {
  rooms: typeof ROOMS;
  bookings: Booking[];
  date: string;
  startMin: number;
  durationMin: number;
  roomId: string | null;
  onPick: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const open = rooms.filter(
    (r) => blockReason(bookings, date, r.id, startMin, durationMin) === "ok",
  );
  const taken = rooms.filter(
    (r) => blockReason(bookings, date, r.id, startMin, durationMin) !== "ok",
  );

  return (
    <div className="mt-6">
      <p className="mb-4 text-sm text-muted">
        {prettyTime(startMin)} · {durationLabel(durationMin)} ·{" "}
        {open.length} private rooms open
      </p>
      <div className="flex flex-col gap-3">
        {open.map((r) => (
          <RoomCard
            key={r.id}
            room={r}
            selected={r.id === roomId}
            onClick={() => onPick(r.id)}
          />
        ))}
      </div>
      {taken.length ? (
        <div className="mt-6">
          <SectionLabel>Already reserved</SectionLabel>
          <div className="flex flex-col gap-2 opacity-60">
            {taken.map((r) => {
              const reason = blockReason(
                bookings,
                date,
                r.id,
                startMin,
                durationMin,
              );
              return (
                <div
                  key={r.id}
                  className="rounded-2xl bg-surface-2 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {reasonCopy(reason) || "Reserved"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ChevronLeft className="size-4" />
          Back
        </Button>
        <Button className="flex-[2]" size="lg" onClick={onNext} disabled={!roomId}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function RoomCard({
  room,
  selected,
  onClick,
}: {
  room: (typeof ROOMS)[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex overflow-hidden rounded-3xl bg-surface text-left shadow-[var(--shadow-border)]",
        selected && "ring-2 ring-wood",
      )}
    >
      {room.image ? (
        <img
          src={room.image}
          alt=""
          className="h-28 w-24 shrink-0 object-cover outline outline-1 -outline-offset-1 outline-black/10"
        />
      ) : (
        <div className="h-28 w-24 shrink-0 bg-sage-soft" />
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
        <p className="font-display text-lg leading-tight">{room.name}</p>
        <p className="mt-0.5 text-xs text-muted">{amenityLabel(room)}</p>
        <p className="mt-1 line-clamp-2 text-sm text-fg/80">{room.blurb}</p>
      </div>
    </button>
  );
}

function ConfirmStep({
  room,
  date,
  startMin,
  durationMin,
  guests,
  heatOk,
  saunaOn,
  massageRequest,
  massageNote,
  memberTier,
  quote,
  onGuests,
  onSauna,
  onMassage,
  onNote,
  onMember,
  onBack,
  onBook,
}: {
  room: (typeof ROOMS)[number] | null;
  date: string;
  startMin: number;
  durationMin: number;
  guests: number;
  heatOk: boolean;
  saunaOn: boolean;
  massageRequest: boolean;
  massageNote: string;
  memberTier: MemberTierId;
  quote: ReturnType<typeof priceVisit>;
  onGuests: (n: number) => void;
  onSauna: (v: boolean) => void;
  onMassage: (v: boolean) => void;
  onNote: (v: string) => void;
  onMember: (t: MemberTierId) => void;
  onBack: () => void;
  onBook: () => void;
}) {
  return (
    <div className="mt-6">
      {room ? (
        <div className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-border)]">
          <img
            src={room.image}
            alt=""
            className="h-36 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
          />
          <div className="px-4 py-3">
            <p className="font-display text-2xl">{room.name}</p>
            <p className="mt-1 text-sm">
              {formatDateLabel(date)}
              <br />
              {prettyTime(startMin)} – {prettyTime(startMin + durationMin)} ·{" "}
              {durationLabel(durationMin)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
        <div>
          <p className="text-sm font-medium">Guests</p>
          <p className="text-xs text-muted">All prices per person / per hour</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex size-12 items-center justify-center rounded-full bg-surface-2"
            onClick={() => onGuests(Math.max(1, guests - 1))}
            aria-label="Fewer guests"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-6 text-center font-display text-2xl tabular-nums">
            {guests}
          </span>
          <button
            className="flex size-12 items-center justify-center rounded-full bg-surface-2"
            onClick={() => onGuests(Math.min(room?.maxGuests ?? 6, guests + 1))}
            aria-label="More guests"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {heatOk ? (
        <label className="mt-3 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
          <span>
            <span className="block text-sm font-medium">
              Hot Tub with Sauna or Steam
            </span>
            <span className="text-xs text-muted">
              {quote.isEvening ? "Evening $28" : "Day $23"} per person / per hour
            </span>
          </span>
          <Switch checked={saunaOn} onCheckedChange={onSauna} />
        </label>
      ) : (
        <p className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]">
          Hot Tub only in this room ·{" "}
          {quote.isEvening ? "evening $23" : "day $18"} per person / per hour
        </p>
      )}

      <label className="mt-3 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
        <span>
          <span className="block text-sm font-medium">Request a massage</span>
          <span className="text-xs text-muted">
            Confirmed by phone · not billed here
          </span>
        </span>
        <Switch checked={massageRequest} onCheckedChange={onMassage} />
      </label>
      {massageRequest ? (
        <Textarea
          className="mt-3"
          placeholder="Swedish, deep tissue, couples, after the hot tub…"
          value={massageNote}
          onChange={(e) => onNote(e.target.value)}
        />
      ) : null}

      <div className="mt-5">
        <SectionLabel>Circle membership</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[DROP_IN, ...MEMBER_TIERS].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onMember(t.id)}
              className={cn(
                "min-h-14 rounded-2xl px-3 py-2 text-left",
                memberTier === t.id
                  ? "bg-wood text-wood-fg"
                  : "bg-surface shadow-[var(--shadow-border)]",
              )}
            >
              <span className="block text-sm font-medium">{t.name}</span>
              <span className="text-[11px] opacity-80">
                {t.id === "none" ? "Pay this visit" : `${formatMoney(t.price)}/mo`}
              </span>
            </button>
          ))}
        </div>
        {memberTier !== "none" ? (
          <p className="mt-2 text-xs text-muted">{quote.tier.blurb}</p>
        ) : null}
      </div>

      <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-muted shadow-[var(--shadow-border)]">
        This is a time slot, not a duration. Arrive {LATE_GRACE_MIN} minutes after
        start and the soak shortens — next guest still starts on time. Full
        reserved hour is charged, plus a {formatMoney(LATE_FEE_USD)} late fee
        {quote.tier.waiveLate ? " (waived on House Circle)" : ""}.
      </p>

      <div className="mt-5 rounded-3xl bg-wood px-5 py-4 text-wood-fg">
        <p className="text-xs uppercase tracking-wide opacity-70">
          {quote.covered
            ? `${quote.tier.name} credit`
            : quote.isEvening || quote.eveningHours > 0
              ? "Evening rate"
              : "Day rate"}
        </p>
        <p className="mt-1 font-display text-4xl tabular-nums leading-none">
          {formatMoney(quote.due)}
        </p>
        <p className="mt-2 text-sm opacity-80">
          {quote.covered
            ? `Included in ${formatMoney(quote.tier.price)}/mo dues`
            : `${formatMoney(quote.hourly)} per person / per hour · ${guests} ${
                guests === 1 ? "guest" : "guests"
              }`}
          {" · "}
          {saunaOn ? "Hot Tub with Sauna or Steam" : "Hot Tub"}
        </p>
      </div>

      <Button size="xl" className="mt-5 w-full" onClick={onBook} disabled={!room}>
        Pay with Square
      </Button>
      <Button variant="outline" className="mt-2 w-full" onClick={onBack}>
        <ChevronLeft className="size-4" />
        Back
      </Button>
    </div>
  );
}

function SuccessCard({
  booking,
  onAgain,
}: {
  booking: Booking;
  onAgain: () => void;
}) {
  const house = useHouse();
  const room = roomsOf(house).find((r) => r.id === booking.roomId);
  const quote = priceVisit(booking);
  return (
    <div className="flex flex-col px-5 pt-10 pb-8">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage-soft text-sage">
        <Check className="size-7" strokeWidth={2.5} />
      </div>
      <h1 className="mt-5 text-center font-display text-3xl text-wood">
        You're booked
      </h1>
      <p className="mt-2 text-center text-sm text-muted">
        Demo only — {house.site.bookingNote}
      </p>
      <div className="mt-6 overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-border)]">
        {room?.image ? (
          <img
            src={room.image}
            alt=""
            className="h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
          />
        ) : null}
        <div className="px-5 py-4">
          <p className="font-display text-2xl">{room?.name}</p>
          <p className="mt-1 text-sm">
            {formatDateLabel(booking.date)}
            <br />
            {formatRange(booking.startMin, booking.durationMin)} ·{" "}
            {durationLabel(booking.durationMin)}
          </p>
          <p className="mt-3 font-display text-3xl tabular-nums">
            {formatMoney(quote.due)}
          </p>
          <p className="text-xs text-muted">
            Paid with Square (demo)
            {booking.memberTier !== "none" ? ` · ${quote.tier.name}` : ""} ·{" "}
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"} ·{" "}
            {booking.withSauna ? "Hot Tub with Sauna or Steam" : "Hot Tub"}
            {booking.massageRequest ? " · massage requested" : ""}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Time slot, not a duration. Late after {LATE_GRACE_MIN} min shortens
            the soak. Full hour
            {quote.tier.waiveLate
              ? " still billed to Circle."
              : ` plus ${formatMoney(LATE_FEE_USD)} late fee.`}
          </p>
        </div>
      </div>
      <a href={PHONE_TEL} className="mt-5">
        <Button size="lg" className="w-full">
          <Phone className="size-5" />
          Call Now · {PHONE}
        </Button>
      </a>
      <Button variant="outline" size="lg" className="mt-3 w-full" onClick={onAgain}>
        Book another room
      </Button>
      <Link to="/calendar" className="mt-3 block">
        <Button variant="ghost" className="w-full">
          Calendar
        </Button>
      </Link>
      <Link to="/insights" className="mt-1 block">
        <Button variant="ghost" className="w-full">
          Front Desk
        </Button>
      </Link>
    </div>
  );
}

function MenuBoard({ houseKey }: { houseKey: string }) {
  const house = useHouse();
  const items = house.services.filter((s) => s.categoryKey === houseKey);
  const members =
    houseKey === "membership" ? house.memberships : [];
  const tel = `tel:+1${house.site.phone.replace(/\D/g, "")}`;
  return (
    <div className="mt-5">
      <p className="text-sm text-muted">
        Prices from {house.site.website.replace("https://", "")}. Hold is a demo —
        they still confirm on their own booker or phone.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
          >
            <Link to="/service/$slug" params={{ slug: s.id }} className="block">
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
              <p className="mt-1 text-xs text-sage">Benefits & HSA notes</p>
            </Link>
          </li>
        ))}
        {members.map((m) => (
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
        ))}
      </ul>
      <a href={tel} className="mt-4 block">
        <Button size="lg" className="w-full">
          Call to confirm · {house.site.phone}
        </Button>
      </a>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">
      {children}
    </h2>
  );
}
