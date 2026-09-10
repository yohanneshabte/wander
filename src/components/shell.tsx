import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  CalendarRange,
  House,
  LineChart,
  Search,
  Store,
  UserRound,
} from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { consumeDeskCode } from "@/components/auth-form";
import { joinDesk, useProfile } from "@/lib/spa/store";
import { cn } from "@/lib/utils";

export function Shell({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const { role } = useProfile();
  const staff = role === "staff" || role === "admin";
  const store = role === "store";

  useEffect(() => {
    if (!user) return;
    const code = consumeDeskCode();
    if (code) void joinDesk(code).catch(() => {});
  }, [user?.id]);
  const tabs = staff
    ? [
        { to: "/", label: "Home", icon: House },
        { to: "/search", label: "Search", icon: Search },
        { to: "/calendar", label: "Calendar", icon: CalendarRange },
        { to: "/insights", label: "Desk", icon: LineChart },
      ]
    : store
      ? [
          { to: "/", label: "Home", icon: House },
          { to: "/search", label: "Search", icon: Search },
          { to: "/manage", label: "Store", icon: Store },
        ]
      : user
        ? [
            { to: "/", label: "Home", icon: House },
            { to: "/search", label: "Search", icon: Search },
            { to: "/account", label: "Visits", icon: UserRound },
          ]
        : [
            { to: "/", label: "Home", icon: House },
            { to: "/search", label: "Search", icon: Search },
            { to: "/book", label: "Book", icon: CalendarDays },
          ];

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-bg",
        wide ? "max-w-lg md:max-w-4xl" : "max-w-lg",
      )}
    >
      <header className="flex items-center justify-between px-5 pt-3">
        {isPending ? (
          <div className="h-8 w-24 animate-pulse rounded-full bg-surface-2" />
        ) : user ? (
          <Link to="/account" className="text-sm font-medium text-wood">
            {user.displayName ?? user.primaryEmail ?? "Account"}
          </Link>
        ) : (
          <Link
            to="/login"
            search={{ next: pathname }}
            className="text-sm font-medium text-wood"
          >
            Sign in
          </Link>
        )}
        {role === "admin" ? (
          <span className="text-[11px] uppercase tracking-wide text-muted">
            Owner
          </span>
        ) : role === "staff" ? (
          <span className="text-[11px] uppercase tracking-wide text-muted">
            Desk
          </span>
        ) : role === "store" ? (
          <span className="text-[11px] uppercase tracking-wide text-muted">
            Store
          </span>
        ) : (
          <span />
        )}
      </header>
      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 mx-auto border-t border-border bg-surface/95 backdrop-blur-md",
          wide ? "max-w-lg md:max-w-4xl" : "max-w-lg",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul
          className={cn(
            "grid px-1 pt-1",
            tabs.length === 4 ? "grid-cols-4" : "grid-cols-3",
          )}
        >
          {tabs.map((tab) => {
            const active =
              tab.to === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium",
                    active ? "text-wood" : "text-muted",
                  )}
                >
                  <Icon
                    className={cn("size-5", active && "stroke-[2.25]")}
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
