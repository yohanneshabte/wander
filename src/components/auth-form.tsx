import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { joinDesk } from "@/lib/spa/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CODE_KEY = "spa-desk-code";

const fieldClass =
  "h-12 w-full rounded-2xl bg-surface px-4 text-base shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AuthForm({ next = "/" }: { next?: string }) {
  const [side, setSide] = useState<"guest" | "desk">("guest");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"email" | string | null>(null);

  const dest = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  async function goHome() {
    if (side === "desk" && code.trim()) {
      try {
        await joinDesk(code);
      } catch (err) {
        toast(err instanceof Error ? err.message : "Desk code did not match");
      }
    }
    window.location.assign(dest);
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!authEnabled || busy) return;
    setBusy("email");
    const creds = { email: email.trim(), password };
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          ...creds,
          name: name.trim() || "Guest",
        });
        if (error) {
          const msg = error.message ?? "Could not create account";
          if (/already|exist|registered/i.test(msg)) {
            const retry = await authClient.signIn.email(creds);
            if (retry.error) throw new Error(retry.error.message ?? msg);
          } else {
            throw new Error(msg);
          }
        }
      } else {
        const { error } = await authClient.signIn.email(creds);
        if (error) {
          const msg = error.message ?? "Could not sign in";
          if (/not found|invalid|incorrect/i.test(msg)) {
            throw new Error("Email or password did not match. Try Create account.");
          }
          throw new Error(msg);
        }
      }
      await authClient.getSession();
      await goHome();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Sign in failed");
      setBusy(null);
    }
  }

  function onSocial(providerId: string, label: string) {
    if (!authEnabled || busy) return;
    setBusy(providerId);
    if (side === "desk" && code.trim()) {
      try {
        sessionStorage.setItem(CODE_KEY, code.trim());
      } catch {
        /* ignore */
      }
    }
    // Call signIn from the tap — it must start before any extra await.
    void signIn(providerId, {
      callbackURL: dest,
      errorCallbackURL: "/login",
    }).catch((err: unknown) => {
      toast(
        err instanceof Error
          ? err.message
          : `${label} did not open. Try email below.`,
      );
      setBusy(null);
    });
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2">
        {(["guest", "desk"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSide(key)}
            className={cn(
              "min-h-12 rounded-2xl text-base font-medium",
              side === key
                ? "bg-wood text-wood-fg"
                : "bg-surface text-fg shadow-[var(--shadow-border)]",
            )}
          >
            {key === "guest" ? "Guest" : "Desk"}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {side === "guest"
          ? "Google, X, or email. Then hold a private hot tub."
          : "Same buttons, plus the desk code from the owner."}
      </p>

      {side === "desk" ? (
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Desk code
          </span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={fieldClass}
            autoComplete="off"
            autoCapitalize="none"
            placeholder="From the owner"
          />
        </label>
      ) : null}

      {authEnabled ? (
        <div className="mt-4 flex flex-col gap-2">
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              disabled={busy !== null}
              onClick={() => onSocial(p.providerId, p.label)}
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-wood text-base font-medium text-wood-fg disabled:opacity-50"
            >
              <SocialMark label={p.label} />
              {busy === p.providerId
                ? `Opening ${p.label}…`
                : `Continue with ${p.label}`}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>
      )}

      <p className="mt-5 text-center text-xs font-medium uppercase tracking-wide text-muted">
        Or email
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={cn(
            "min-h-11 rounded-2xl text-sm font-medium",
            mode === "signin"
              ? "bg-sage text-primary-fg"
              : "bg-surface text-fg shadow-[var(--shadow-border)]",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "min-h-11 rounded-2xl text-sm font-medium",
            mode === "signup"
              ? "bg-sage text-primary-fg"
              : "bg-surface text-fg shadow-[var(--shadow-border)]",
          )}
        >
          Create account
        </button>
      </div>
      <form className="mt-3 flex flex-col gap-3" onSubmit={onEmail}>
        {mode === "signup" ? (
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={fieldClass}
            autoComplete="name"
          />
        ) : null}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={fieldClass}
          autoComplete="email"
          autoCapitalize="none"
          inputMode="email"
        />
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password · 8+ characters"
          className={fieldClass}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        <Button type="submit" size="lg" className="w-full" disabled={busy !== null}>
          {busy === "email"
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : "Sign in with email"}
        </Button>
      </form>
    </div>
  );
}

function SocialMark({ label }: { label: string }) {
  if (label === "Google") {
    return (
      <span className="grid size-6 place-items-center rounded-full bg-wood-fg text-sm font-bold text-wood">
        G
      </span>
    );
  }
  return (
    <span className="grid size-6 place-items-center rounded-full bg-wood-fg text-sm font-bold text-wood">
      X
    </span>
  );
}

export function consumeDeskCode() {
  try {
    const code = sessionStorage.getItem(CODE_KEY);
    if (code) sessionStorage.removeItem(CODE_KEY);
    return code;
  } catch {
    return null;
  }
}
