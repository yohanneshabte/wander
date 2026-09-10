import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SQUARE_CENTS, SQUARE_PERCENT } from "@/lib/spa/rooms";
import { squareTake } from "@/lib/spa/membership";
import { formatMoney } from "@/lib/utils";

export function SquarePay({
  amount,
  label,
  onPaid,
  onBack,
}: {
  amount: number;
  label: string;
  onPaid: () => void;
  onBack: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const fee = squareTake(amount);

  function pay() {
    setBusy(true);
    window.setTimeout(() => {
      onPaid();
    }, 700);
  }

  return (
    <div className="mt-6">
      <div className="rounded-3xl bg-surface px-5 py-5 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Square · demo
        </p>
        <p className="mt-1 font-display text-2xl text-wood">{label}</p>
        <p className="mt-4 font-display text-4xl tabular-nums text-wood">
          {amount === 0 ? "No charge today" : formatMoney(amount)}
        </p>
        <div className="mt-4 rounded-2xl bg-surface-2 px-4 py-3">
          <p className="text-sm font-medium">Visa ···· 4242</p>
          <p className="text-xs text-muted">Test card · sandbox · not charged</p>
        </div>
        <p className="mt-3 text-xs text-muted">
          Online Square is {SQUARE_PERCENT}% + {formatMoney(SQUARE_CENTS / 100)}
          {amount > 0 ? ` · ${formatMoney(fee)} on this visit` : ""}. Recurring
          Circle dues would use the same card on file.
        </p>
      </div>
      <Button
        size="xl"
        className="mt-5 w-full"
        onClick={pay}
        disabled={busy}
      >
        {busy ? "Charging…" : amount === 0 ? "Hold with Square" : `Pay ${formatMoney(amount)} with Square`}
      </Button>
      <Button variant="outline" className="mt-2 w-full" onClick={onBack} disabled={busy}>
        Back
      </Button>
    </div>
  );
}
