import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BUFFER_MIN,
  LATE_FEE_USD,
  LATE_GRACE_MIN,
  MAX_CONCURRENT,
  OPEN_MIN,
  ROOMS,
  ROOM_BY_ID,
} from "@/lib/spa/rooms";
import {
  bookingsOn,
  closeMin,
  formatDateLabel,
  formatTime,
  nextDates,
  nowMinLA,
  occupancyAt,
  parseDate,
  todayISO,
  type Booking,
} from "@/lib/spa/engine";
import {
  downloadIcs,
  formatVisitRange,
  googleCalendarUrl,
} from "@/lib/spa/calendar";
import { useStaffBookings, markLate } from "@/lib/spa/store";
import { lateFeeFor, priceVisit, tierById } from "@/lib/spa/membership";
import { cn, formatMoney } from "@/lib/utils";

const DATES = nextDates(14);
const HOURS_SHOWN = 4;
const PX_PER_HOUR = 68;

function shiftDate(date: string, delta: number) {
  const idx = DATES.indexOf(date);
  const next = DATES[Math.max(0, Math.min(DATES.length - 1, idx + delta))];
  return next ?? date;
}

function snapHour(min: number) {
  return Math.floor(min / 60) * 60;
}

export function StaffCalendar() {
  const all = useStaffBookings();
  const [date, setDate] = useState(todayISO());
  const [mode, setMode] = useState<"floor" | "list">("floor");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [windowStart, setWindowStart] = useState(17 * 60);

  const dayBookings = useMemo(
    () =>
      bookingsOn(all, date).sort(
        (a, b) => a.startMin - b.startMin || a.roomId.localeCompare(b.roomId),
      ),
    [all, date],
  );
  const selected = dayBookings.find((b) => b.id === selectedId) ?? null;
  const close = closeMin(date);

  const peak = useMemo(() => {
    let best = { occ: 0, at: OPEN_MIN };
    for (let t = OPEN_MIN; t < close; t += 15) {
      const occ = occupancyAt(dayBookings, date, t);
      if (occ > best.occ) best = { occ, at: t };
    }
    return best;
  }, [dayBookings, date, close]);

  const maxStart = Math.max(8 * 60, snapHour(close) - HOURS_SHOWN * 60);

  function pan(deltaHours: number) {
    setWindowStart((w) =>
      Math.min(maxStart, Math.max(8 * 60, w + deltaHours * 60)),
    );
    setMode("floor");
  }

  function jumpTo(min: number) {
    setMode("floor");
    setWindowStart(Math.min(maxStart, Math.max(8 * 60, snapHour(min))));
  }

  return (
    <div className="flex flex-col pt-4 pb-8">
      <div className="px-5">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          Front Desk · Calendar
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2 px-5">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous day"
          disabled={date === DATES[0]}
          onClick={() => {
            setDate((d) => shiftDate(d, -1));
            setSelectedId(null);
          }}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="font-display text-2xl leading-tight text-wood">
            {formatDateLabel(date)}
          </h1>
          <p className="text-xs text-muted">
            {dayBookings.length} visits · busiest {formatTime(peak.at)} ·{" "}
            {peak.occ} of {MAX_CONCURRENT}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next day"
          disabled={date === DATES[DATES.length - 1]}
          onClick={() => {
            setDate((d) => shiftDate(d, 1));
            setSelectedId(null);
          }}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DATES.map((d) => {
          const parsed = parseDate(d);
          const selectedDay = d === date;
          const visits = bookingsOn(all, d).length;
          return (
            <button
              key={d}
              onClick={() => {
                setDate(d);
                setSelectedId(null);
              }}
              className={cn(
                "snap-start flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-2.5 py-1",
                selectedDay
                  ? "bg-wood text-wood-fg"
                  : "bg-surface text-fg shadow-[var(--shadow-border)]",
              )}
            >
              <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">
                {d === todayISO() ? "Today" : format(parsed, "EEE")}
              </span>
              <span className="font-display text-lg leading-none">
                {format(parsed, "d")}
              </span>
              <span className="mt-1 text-[10px] tabular-nums opacity-70">
                {visits}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 px-5">
        {(["floor", "list"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={cn(
              "min-h-11 rounded-2xl text-sm font-medium",
              mode === key
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {key === "floor" ? "Floor" : "List"}
          </button>
        ))}
      </div>

      {mode === "floor" ? (
        <FloorGrid
          date={date}
          windowStart={windowStart}
          close={close}
          bookings={dayBookings}
          selectedId={selectedId}
          onPick={setSelectedId}
          onPan={pan}
          onJump={jumpTo}
          canPanLeft={windowStart > 8 * 60}
          canPanRight={windowStart < maxStart}
        />
      ) : (
        <VisitList
          bookings={dayBookings}
          selectedId={selectedId}
          onPick={setSelectedId}
        />
      )}

      <div className="mt-5 px-5">
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            downloadIcs(`watercourse-way-${date}.ics`, dayBookings)
          }
          disabled={!dayBookings.length}
        >
          <Download className="size-4" />
          Add today to Calendar
        </Button>
        <p className="mt-2 text-xs text-muted">
          Opens in Google Calendar or the Calendar app. Demo visits only.
        </p>
      </div>

      {selected ? (
        <BookingSheet booking={selected} onClose={() => setSelectedId(null)} />
      ) : null}
    </div>
  );
}

function FloorGrid({
  date,
  windowStart,
  close,
  bookings,
  selectedId,
  onPick,
  onPan,
  onJump,
  canPanLeft,
  canPanRight,
}: {
  date: string;
  windowStart: number;
  close: number;
  bookings: Booking[];
  selectedId: string | null;
  onPick: (id: string) => void;
  onPan: (deltaHours: number) => void;
  onJump: (min: number) => void;
  canPanLeft: boolean;
  canPanRight: boolean;
}) {
  const windowEnd = windowStart + HOURS_SHOWN * 60;
  const boardWidth = HOURS_SHOWN * PX_PER_HOUR;
  const hours: number[] = [];
  for (let h = 0; h < HOURS_SHOWN; h++) hours.push(windowStart / 60 + h);
  const now = nowMinLA();
  const showNow =
    date === todayISO() && now >= windowStart && now <= Math.min(windowEnd, close);

  function xOf(min: number) {
    return ((min - windowStart) / 60) * PX_PER_HOUR;
  }

  return (
    <div className="mt-3 px-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30"
          disabled={!canPanLeft}
          onClick={() => onPan(-2)}
          aria-label="Earlier hours"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="min-w-0 text-center">
          <p className="text-sm font-medium tabular-nums">
            {formatTime(windowStart)} – {formatTime(windowEnd)}
          </p>
          <div className="mt-0.5 flex justify-center gap-3 text-xs">
            <button type="button" className="text-wood underline" onClick={() => onJump(nowMinLA())}>
              Now
            </button>
            <button type="button" className="text-wood underline" onClick={() => onJump(17 * 60 + 40)}>
              Evening
            </button>
          </div>
        </div>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-border)] disabled:opacity-30"
          disabled={!canPanRight}
          onClick={() => onPan(2)}
          aria-label="Later hours"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="flex h-7">
        <div className="w-16 shrink-0" />
        <div className="relative flex-1" style={{ minWidth: boardWidth }}>
          {hours.map((h) => (
            <span
              key={h}
              className="absolute top-0 text-[11px] tabular-nums text-muted"
              style={{ left: xOf(h * 60) }}
            >
              {formatTime(h * 60).replace(":00 ", "")}
            </span>
          ))}
        </div>
      </div>

      {ROOMS.map((room) => {
        const row = bookings.filter(
          (b) =>
            b.roomId === room.id &&
            b.startMin < windowEnd &&
            b.startMin + b.durationMin + BUFFER_MIN > windowStart,
        );
        return (
          <div key={room.id} className="flex h-14">
            <div className="flex w-16 shrink-0 flex-col justify-center pr-2">
              <p className="text-xs font-medium leading-none text-wood">
                {room.number} {room.short}
              </p>
            </div>
            <div className="relative h-14 flex-1 overflow-hidden rounded-lg bg-surface-2/80">
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute inset-y-0 w-px bg-border/80"
                  style={{ left: xOf(h * 60) }}
                />
              ))}
              {row.map((b) => {
                const left = Math.max(0, xOf(b.startMin));
                const right = Math.min(boardWidth, xOf(b.startMin + b.durationMin));
                const width = Math.max(28, right - left - 2);
                const guest = b.source === "guest";
                const active = b.id === selectedId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onPick(b.id)}
                    className={cn(
                      "absolute top-2.5 h-9 overflow-hidden rounded-lg px-1.5 text-left",
                      guest ? "bg-wood text-wood-fg" : "bg-sage text-primary-fg",
                      active && "ring-2 ring-offset-1 ring-offset-bg ring-wood",
                    )}
                    style={{ left, width }}
                  >
                    <span className="block truncate text-[11px] font-medium leading-4">
                      {formatTime(b.startMin).replace(" ", "")}
                    </span>
                    <span className="block truncate text-[10px] leading-3 opacity-80">
                      {b.guests} {b.guests === 1 ? "guest" : "guests"}
                    </span>
                  </button>
                );
              })}
              {row.map((b) => {
                const left = xOf(b.startMin + b.durationMin);
                const width = (BUFFER_MIN / 60) * PX_PER_HOUR - 2;
                if (left > boardWidth || left + width < 0) return null;
                return (
                  <div
                    key={`${b.id}-turn`}
                    className="buffer-stripe pointer-events-none absolute top-2.5 h-9 rounded-md"
                    style={{ left: Math.max(0, left), width }}
                    title="15-minute turn"
                  />
                );
              })}
              {showNow ? (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-wood"
                  style={{ left: xOf(now) }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
      <p className="mt-2 text-xs text-muted">
        Sage is reserved. Wood is a lobby walk-in on this demo. Stripes are the
        15-minute turn.
      </p>
    </div>
  );
}

function VisitList({
  bookings,
  selectedId,
  onPick,
}: {
  bookings: Booking[];
  selectedId: string | null;
  onPick: (id: string) => void;
}) {
  if (!bookings.length) {
    return (
      <p className="mt-6 px-5 text-sm text-muted">No visits on this day.</p>
    );
  }
  return (
    <ul className="mt-4 flex flex-col gap-2 px-5">
      {bookings.map((b) => {
        const room = ROOM_BY_ID[b.roomId];
        const active = b.id === selectedId;
        return (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => onPick(b.id)}
              className={cn(
                "flex min-h-16 w-full items-center gap-3 rounded-2xl bg-surface px-3 py-2 text-left shadow-[var(--shadow-border)]",
                active && "ring-2 ring-wood",
              )}
            >
              {room ? (
                <img
                  src={room.image}
                  alt=""
                  className="size-12 shrink-0 rounded-xl object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block font-medium leading-tight">
                  {room?.name}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {formatVisitRange(b)} · {b.guests}{" "}
                  {b.guests === 1 ? "guest" : "guests"}
                </span>
              </span>
              {b.source === "guest" ? (
                <span className="shrink-0 text-[11px] font-medium text-wood">
                  Walk-in
                </span>
              ) : b.lateMinutes >= LATE_GRACE_MIN ? (
                <span className="shrink-0 text-[11px] font-medium text-wood">
                  Late
                </span>
              ) : b.memberTier !== "none" ? (
                <span className="shrink-0 text-[11px] font-medium text-sage">
                  Circle
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function BookingSheet({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const room = ROOM_BY_ID[booking.roomId];
  const google = googleCalendarUrl(booking);
  const quote = priceVisit(booking);
  const soakLeft = Math.max(0, booking.durationMin - booking.lateMinutes);
  const late = booking.lateMinutes >= LATE_GRACE_MIN;
  const fee = lateFeeFor(booking);
  const tier = tierById(booking.memberTier);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-wood/25"
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 z-10 mx-auto max-w-lg rounded-t-3xl bg-surface px-5 pt-4 shadow-[var(--shadow-border)]"
        style={{
          bottom: "calc(4.25rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {booking.source === "guest" ? "Lobby walk-in" : "Reserved"}
              {booking.memberTier !== "none" ? ` · ${tier.name}` : ""}
              {booking.paidVia === "square" ? " · Square" : ""}
            </p>
            <h2 className="font-display text-2xl text-wood">{room?.name}</h2>
            <p className="mt-1 text-sm">
              {formatDateLabel(booking.date)}
              <br />
              {formatVisitRange(booking)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-surface-2"
            aria-label="Close details"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="text-sm text-muted">
          {booking.guests} {booking.guests === 1 ? "guest" : "guests"} ·{" "}
          {booking.withSauna ? "Hot Tub with Sauna or Steam" : "Hot Tub"}
          {booking.massageRequest ? " · massage requested" : ""}
          {" · "}
          {formatMoney(quote.due)}
        </p>
        {late ? (
          <p className="mt-2 text-sm text-wood">
            Arrived {booking.lateMinutes} min late · soak {soakLeft} min · end
            still {formatTime(booking.startMin + booking.durationMin)}
            {fee ? ` · ${formatMoney(fee)} late fee` : " · late fee waived"}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Slot ends on time even if they arrive late. After {LATE_GRACE_MIN}{" "}
            min, {formatMoney(LATE_FEE_USD)}
            {tier.waiveLate ? " (House Circle waives it)" : ""}.
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2 pb-4">
          <Button
            variant={late ? "outline" : "primary"}
            className="w-full"
            onClick={() => markLate(booking.id, late ? 0 : 15)}
          >
            {late ? "Clear late mark" : "Mark 15 min late"}
          </Button>
          <a href={google} target="_blank" rel="noreferrer">
            <Button variant="outline" className="w-full">
              <CalendarPlus className="size-4" />
              Add to Google Calendar
            </Button>
          </a>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              downloadIcs(
                `watercourse-${booking.roomId}-${booking.date}.ics`,
                [booking],
              )
            }
          >
            <Download className="size-4" />
            Download .ics
          </Button>
        </div>
      </div>
    </div>
  );
}
