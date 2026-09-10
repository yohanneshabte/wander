import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { todayISO, hourOccupancy } from "@/lib/spa/engine";
import { useAllBookings } from "@/lib/spa/store";
import { setHousePick, usePlatform } from "@/lib/platform/store";
import { roomsOf } from "@/lib/platform/rooms";
import { displayPrice } from "@/lib/platform/rooms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const bookings = useAllBookings();
  const { house, settings, houses } = usePlatform();
  const rooms = roomsOf(house);
  const date = todayISO();
  const morning = hourOccupancy(bookings, date, house.site.openMin + 90);
  const evening = hourOccupancy(bookings, date, Math.min(house.site.dayCutoffMin + 60, house.site.closeMin - 60));
  const voice = settings.houseVoice;
  const tel = `tel:+1${house.site.phone.replace(/\D/g, "")}`;

  return (
    <Shell>
      <div className="px-5 pt-6">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {house.site.city}
          {house.site.id === "watercourse" && voice ? " · since 1980" : ""}
        </p>
        <h1 className="mt-1 font-display text-[2.35rem] leading-[1.05] text-wood">
          {voice ? house.site.name : "House booking"}
        </h1>
        <p className="mt-2 font-display text-xl leading-snug text-wood">
          {voice ? house.site.tagline : "One phone hold for any house on the platform."}
        </p>
        <p className="mt-3 text-base leading-relaxed text-fg">{house.site.pitch}</p>
        <Link to="/search" className="mt-3 inline-block text-sm underline decoration-border">
          Search gyms and soaks nearby
        </Link>
      </div>

      {settings.directoryUnlocked ? (
        <div className="mt-4 px-5">
          <Link to="/directory" className="text-sm underline decoration-border">
            Bay Area directory
          </Link>
        </div>
      ) : null}

      {settings.discoveryMode && houses.length > 1 ? (
        <div className="mt-4 px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Try a house
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {houses.map((h) => (
              <button
                key={h.site.id}
                type="button"
                onClick={() => setHousePick(h.site.id)}
                className={cn(
                  "min-h-12 rounded-2xl px-3 text-left text-sm font-medium",
                  house.site.id === h.site.id
                    ? "bg-wood text-wood-fg"
                    : "bg-surface shadow-[var(--shadow-border)]",
                )}
              >
                {h.site.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 px-5">
        <div className="overflow-hidden rounded-[28px] bg-surface-2 shadow-[var(--shadow-border)]">
          {house.site.id === "watercourse" ? (
            <img
              src="/hero.jpg"
              alt=""
              className="h-56 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
            />
          ) : (
            <div className="flex h-56 flex-col justify-end px-5 py-5">
              <p className="font-display text-2xl text-wood">Nine private suites</p>
              <p className="mt-1 text-sm text-muted">16 therapies · Redwood City</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 px-5">
        <Link to="/book">
          <Button size="xl" className="w-full rounded-2xl">
            Book Now
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 px-5">
        <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Earlier today</p>
          <p className="mt-1 font-display text-xl text-wood">
            {morning <= 2 ? "Quiet" : morning >= 5 ? "Busy" : "Open"}
          </p>
          <p className="text-xs text-muted">
            {Math.round(morning)} of {rooms.length} rooms
          </p>
        </div>
        <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Later</p>
          <p className="mt-1 font-display text-xl text-wood">
            {evening >= 5 ? "Busy" : evening <= 2 ? "Quiet" : "Filling"}
          </p>
          <p className="text-xs text-muted">
            {Math.round(evening)} of {rooms.length} rooms
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-3 px-5">
        {house.categories.slice(0, 4).map((c) => {
          const sample = house.services.find((s) => s.categoryKey === c.key);
          return (
            <Pitch
              key={c.id}
              title={c.name}
              body={
                sample
                  ? `${c.blurb} From ${displayPrice(sample.listPrice ?? sample.weekdayPrice)}.`
                  : c.blurb
              }
            />
          );
        })}
        {settings.demoMode ? (
          <Pitch title="Still a demo" body={house.site.bookingNote} />
        ) : null}
        <li className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="font-medium text-wood">What am I getting?</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Checked claims, HSA/FSA notes, not a chatty front desk.
          </p>
          <Link to="/guide" className="mt-2 inline-block text-sm underline decoration-border">
            Open the benefits guide
          </Link>
        </li>
      </ul>

      <address className="mt-8 mb-4 not-italic px-5 text-sm text-muted">
        <p className="font-medium text-wood">Visit {house.site.name}</p>
        <p className="mt-2 flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          {house.site.address}
        </p>
        <p className="mt-2 flex items-center gap-2">
          <Phone className="size-4 shrink-0" />
          <a href={tel} className="underline decoration-border">
            Call Now · {house.site.phone}
          </a>
        </p>
        <p className="mt-2 flex items-start gap-2">
          <Clock className="mt-0.5 size-4 shrink-0" />
          {house.site.hoursNote}
        </p>
      </address>
    </Shell>
  );
}

function Pitch({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="font-medium text-wood">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </li>
  );
}
