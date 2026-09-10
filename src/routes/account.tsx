import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Shell } from "@/components/shell";
import { SignInRequired } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { joinDesk, useMyBookings, useProfile } from "@/lib/spa/store";
import { ROOMS } from "@/lib/spa/rooms";
import { formatDateLabel, formatRange } from "@/lib/spa/engine";
import { saveGoals } from "@/lib/market/api";
import { GOAL_OPTIONS } from "@/lib/market/listings";
import { refreshSpa } from "@/lib/spa/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  return (
    <Shell>
      <SignInRequired next="/account">
        <AccountBody />
      </SignInRequired>
    </Shell>
  );
}

function AccountBody() {
  const { user } = useCurrentUserState();
  const { profile, role } = useProfile();
  const bookings = useMyBookings();
  const [code, setCode] = useState("");
  const staff = role === "staff" || role === "admin";
  const store = role === "store";
  const selected = new Set(profile?.goals ?? []);

  async function claim() {
    try {
      const next = await joinDesk(code);
      toast(
        next.role === "admin"
          ? "Owner access is on."
          : next.role === "store"
            ? "Store portal is on — only your house."
            : "Desk access is on.",
      );
      setCode("");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Code did not match");
    }
  }

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {role === "admin" ? "Owner" : role === "staff" ? "Desk" : "Guest"}
      </p>
      <h1 className="font-display text-3xl text-wood">
        {user?.displayName ?? profile?.name ?? "Your visits"}
      </h1>
      <div className="mt-4 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
        <UserButton />
      </div>

      {staff ? (
        <p className="mt-4 text-sm text-muted">
          You can open the floor calendar and Front Desk. Owner tools stay off
          the public menu.
        </p>
      ) : store ? (
        <p className="mt-4 text-sm text-muted">
          Store portal is on. Other houses cannot see your guests.
        </p>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            I run a house
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Desk or store code"
              className="h-12 flex-1 rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
            />
            <Button className="h-12" onClick={claim} disabled={!code.trim()}>
              Join
            </Button>
          </div>
        </div>
      )}

      <h2 className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">
        Health goals
      </h2>
      <p className="mt-1 text-sm text-muted">
        Rank gyms and soaks around you. One account, several houses.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {GOAL_OPTIONS.map((g) => {
          const on = selected.has(g.key);
          return (
            <button
              key={g.key}
              type="button"
              className={cn(
                "min-h-10 rounded-full px-3 text-sm",
                on ? "bg-wood text-wood-fg" : "bg-surface shadow-[var(--shadow-border)]",
              )}
              onClick={() => {
                const next = new Set(selected);
                if (on) next.delete(g.key);
                else next.add(g.key);
                void saveGoals({ data: [...next] })
                  .then(() => {
                    refreshSpa();
                    toast("Goals saved.");
                  })
                  .catch(() => toast("Could not save goals"));
              }}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      <h2 className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">
        My holds
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {bookings.length === 0 ? (
          <li className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]">
            No rooms held yet.
          </li>
        ) : (
          bookings.map((b) => {
            const room = ROOMS.find((r) => r.id === b.roomId);
            return (
              <li
                key={b.id}
                className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <p className="font-medium">{room?.name ?? b.roomId}</p>
                <p className="text-sm text-muted">
                  {formatDateLabel(b.date)} · {formatRange(b.startMin, b.durationMin)}
                </p>
              </li>
            );
          })
        )}
      </ul>
      <Link to="/book" className="mt-6 block">
        <Button size="lg" className="w-full">
          Book Now
        </Button>
      </Link>
    </div>
  );
}
