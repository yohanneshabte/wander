import { Link, Navigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useProfile } from "@/lib/spa/store";
import { Button } from "@/components/ui/button";
import type { SpaRole } from "@/lib/spa/api";

export function RoleGate({
  allow,
  children,
}: {
  allow: SpaRole[];
  children: React.ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const { ready, role } = useProfile();

  if (isPending || (user && !ready)) {
    return (
      <div className="px-5 pt-10">
        <div className="h-10 w-40 animate-pulse rounded-2xl bg-surface-2" />
        <div className="mt-4 h-40 animate-pulse rounded-3xl bg-surface-2" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" search={{ next: "/account" }} />;
  }
  if (!role || !allow.includes(role)) {
    return (
      <div className="px-5 pt-10">
        <h1 className="font-display text-3xl text-wood">Wrong desk</h1>
        <p className="mt-2 text-sm text-muted">
          This page is partitioned. Store owners use Manage. Watercourse desk
          uses Calendar. Guests book from Explore.
        </p>
        <Link to="/account" className="mt-5 block">
          <Button size="lg" className="w-full">
            Open my account
          </Button>
        </Link>
        <Link to="/book" className="mt-3 block">
          <Button variant="outline" size="lg" className="w-full">
            Book Now
          </Button>
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}

export function SignInRequired({
  children,
  next = "/book",
}: {
  children: React.ReactNode;
  next?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="px-5 pt-10">
        <div className="h-10 w-40 animate-pulse rounded-2xl bg-surface-2" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" search={{ next }} />;
  return <>{children}</>;
}
