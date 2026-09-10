import { useEffect } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useHouse } from "@/lib/platform/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { next: string; error?: string } => ({
    next:
      typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")
        ? s.next
        : "/",
    ...(typeof s.error === "string" ? { error: s.error } : {}),
  }),
  component: Login,
});

function Login() {
  const { next, error } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const house = useHouse();

  useEffect(() => {
    if (error) toast("Google or X sign-in did not finish. Try again or use email.");
  }, [error]);

  if (isPending) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-lg bg-bg px-5 pt-8">
        <div className="h-8 w-40 animate-pulse rounded-2xl bg-surface-2" />
        <div className="mt-4 h-48 animate-pulse rounded-3xl bg-surface-2" />
      </div>
    );
  }
  if (user) return <Navigate to={next} />;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-bg px-5 pb-10 pt-8">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {house.site.name}
      </p>
      <h1 className="font-display text-3xl leading-tight text-wood">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-muted">
        Tap Google or X, or use email. Same account for guests and the desk.
      </p>
      <div className="mt-6">
        <AuthForm next={next} />
      </div>
      <p className="mt-8 text-center text-xs leading-relaxed text-muted">
        Demo only — {house.site.bookingNote}
      </p>
      <Link to="/" className="mt-4 block min-h-11 text-center text-sm text-wood">
        Back home
      </Link>
    </div>
  );
}
