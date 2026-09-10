import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  adminStats,
  clearHouseHolds,
  deleteBooking,
  listStaffBookings,
  listUsers,
  setUserRole,
  type SpaRole,
  type StaffBooking,
} from "@/lib/spa/api";
import { refreshSpa, useProfile } from "@/lib/spa/store";
import { AdminHouse } from "@/components/admin-house";
import { ROOMS } from "@/lib/spa/rooms";
import { formatRange } from "@/lib/spa/engine";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Stats = Awaited<ReturnType<typeof adminStats>>;
type UserRow = Awaited<ReturnType<typeof listUsers>>[number];

export function AdminDesk() {
  const { role } = useProfile();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [holds, setHolds] = useState<StaffBooking[]>([]);
  const [tab, setTab] = useState<"house" | "stats" | "people" | "holds">("house");

  function reload() {
    adminStats()
      .then(setStats)
      .catch(() => setStats(null));
    listUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
    listStaffBookings()
      .then(setHolds)
      .catch(() => setHolds([]));
  }

  useEffect(() => {
    if (role === "admin") reload();
  }, [role]);

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        Hidden owner tools
      </p>
      <h1 className="font-display text-3xl text-wood">Platform</h1>
      <p className="mt-1 text-sm text-muted">
        Houses, demo flips, traffic. Not linked from the public site.
      </p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {(["house", "stats", "people", "holds"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "min-h-11 rounded-2xl text-sm font-medium capitalize",
              tab === key
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {key}
          </button>
        ))}
      </div>

      {tab === "house" ? <AdminHouse /> : null}
      {tab === "stats" ? <StatsPane stats={stats} /> : null}
      {tab === "people" ? (
        <PeoplePane users={users} onChange={reload} />
      ) : null}
      {tab === "holds" ? (
        <HoldsPane
          holds={holds}
          onChange={() => {
            reload();
            refreshSpa();
          }}
        />
      ) : null}
    </div>
  );
}

function StatsPane({ stats }: { stats: Stats | null }) {
  if (!stats) {
    return <p className="mt-6 text-sm text-muted">Loading visits…</p>;
  }
  const people = Object.fromEntries(stats.people.map((p) => [p.role, p.n]));
  const hits = stats.visits.reduce((a, v) => a + v.n, 0);
  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Pings · 30d" value={hits} />
        <Stat label="Phones / browsers" value={stats.sessions} />
        <Stat label="Phone / app holds" value={stats.guestCount} />
        <Stat
          label="Accounts"
          value={(people.customer ?? 0) + (people.staff ?? 0) + (people.admin ?? 0)}
        />
      </div>
      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Devices
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {stats.devices.length === 0 ? (
          <li className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]">
            No QR scans yet. Open the printed link on a phone to ping.
          </li>
        ) : (
          stats.devices.map((d) => (
            <li
              key={d.device}
              className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]"
            >
              <span>{d.device}</span>
              <span className="tabular-nums text-wood">{d.n}</span>
            </li>
          ))
        )}
      </ul>
      {stats.browsers.length > 0 ? (
        <>
          <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
            Browsers
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {stats.browsers.map((b) => (
              <li
                key={b.browser}
                className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]"
              >
                <span>{b.browser}</span>
                <span className="tabular-nums text-wood">{b.n}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Visits by day
      </h2>
      <div className="mt-2 h-44 rounded-3xl bg-surface px-2 py-3 shadow-[var(--shadow-border)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.byDay}>
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Bar dataKey="n" fill="#4f6b55" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Pages
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {stats.visits.map((v) => (
          <li
            key={v.path}
            className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]"
          >
            <span>{v.path === "/" ? "Home" : v.path.slice(1)}</span>
            <span className="tabular-nums text-wood">{v.n}</span>
          </li>
        ))}
      </ul>
      <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Latest pings
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {stats.recent.map((r, i) => (
          <li
            key={`${r.created_at}-${i}`}
            className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
          >
            <p className="text-sm font-medium">
              {r.device || "Device"} · {r.browser || "Browser"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              {r.path === "/" ? "Home" : r.path} · {r.os} · {r.viewport || r.screen}
              {r.dpr ? ` · ${r.dpr}x` : ""}
              {r.lang ? ` · ${r.lang}` : ""}
              {r.tz ? ` · ${r.tz}` : ""}
              {r.touch ? " · touch" : ""}
              {r.connection ? ` · ${r.connection}` : ""}
            </p>
            {r.referrer ? (
              <p className="mt-1 truncate text-[11px] text-muted">From {r.referrer}</p>
            ) : null}
            <p className="mt-1 text-[11px] text-muted">{formatWhen(r.created_at)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums text-wood">{value}</p>
    </div>
  );
}

function PeoplePane({
  users,
  onChange,
}: {
  users: UserRow[];
  onChange: () => void;
}) {
  async function change(userId: string, role: SpaRole) {
    try {
      await setUserRole({ data: { userId, role } });
      onChange();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update");
    }
  }
  return (
    <ul className="mt-5 flex flex-col gap-2">
      {users.map((u) => (
        <li
          key={u.user_id}
          className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
        >
          <p className="font-medium">{u.name || u.email || "Guest"}</p>
          <p className="text-xs text-muted">{u.email}</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {(["customer", "staff", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => change(u.user_id, r)}
                className={cn(
                  "min-h-10 rounded-xl text-xs font-medium capitalize",
                  u.role === r
                    ? "bg-wood text-wood-fg"
                    : "bg-surface-2 text-muted",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function HoldsPane({
  holds,
  onChange,
}: {
  holds: StaffBooking[];
  onChange: () => void;
}) {
  async function remove(id: string) {
    try {
      await deleteBooking({ data: id });
      onChange();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete");
    }
  }
  async function clearHouse() {
    try {
      await clearHouseHolds();
      onChange();
      toast("House holds cleared.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not clear");
    }
  }
  const mine = holds.filter((h) => h.userId !== "house").slice(0, 40);
  return (
    <div className="mt-5">
      <Button variant="outline" className="w-full" onClick={clearHouse}>
        Clear generated house holds
      </Button>
      <ul className="mt-4 flex flex-col gap-2">
        {mine.length === 0 ? (
          <li className="text-sm text-muted">No guest or desk holds yet.</li>
        ) : (
          mine.map((b) => {
            const room = ROOMS.find((r) => r.id === b.roomId);
            return (
              <li
                key={b.id}
                className="flex items-start justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <div>
                  <p className="font-medium">{room?.name ?? b.roomId}</p>
                  <p className="text-xs text-muted">
                    {b.date} · {formatRange(b.startMin, b.durationMin)}
                    {b.guestName ? ` · ${b.guestName}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="min-h-11 text-sm text-muted"
                  onClick={() => remove(b.id)}
                >
                  Remove
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
