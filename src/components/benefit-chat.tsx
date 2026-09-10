import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askGuide } from "@/lib/evidence/api";
import { cn } from "@/lib/utils";

const STARTERS = [
  "Will massage help my low back — and can HSA pay?",
  "I sleep badly. Float or soak?",
  "Is Fire & Ice actually evidence-based recovery?",
  "What about peptide injections here?",
];

type Line = { role: "user" | "assistant"; content: string };

export function BenefitChat({ tag }: { tag?: string }) {
  const [lines, setLines] = useState<Line[]>([
    {
      role: "assistant",
      content:
        "Ask what you want from a visit. I only answer from checked records (NCCIH, AHRQ, PubMed, IRS Pub 502). Not medical advice — and not a promise your plan will reimburse.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    const history = lines;
    setLines((l) => [...l, { role: "user", content: message }]);
    setDraft("");
    setBusy(true);
    try {
      const res = await askGuide({
        data: { message, history, tag },
      });
      const reply = res.ok ? res.text : res.error;
      setLines((l) => [...l, { role: "assistant", content: reply }]);
    } catch {
      setLines((l) => [
        ...l,
        {
          role: "assistant",
          content: "Guide is quiet. Open a service card — the citations are on the page.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[28px] bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Benefits guide
      </p>
      <div className="mt-3 flex max-h-80 flex-col gap-3 overflow-y-auto">
        {lines.map((line, i) => (
          <p
            key={i}
            className={cn(
              "rounded-2xl px-3 py-2 text-sm leading-relaxed",
              line.role === "user"
                ? "ml-8 bg-sage-soft text-fg"
                : "mr-4 bg-surface-2 text-fg",
            )}
          >
            {line.content}
          </p>
        ))}
        {busy ? (
          <p className="text-xs text-muted">Checking records…</p>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void send(s)}
            className="min-h-10 rounded-full bg-surface-2 px-3 text-left text-xs text-fg"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Sleep, back pain, HSA, salt room…"
          className="min-h-20"
        />
        <Button type="submit" className="mt-2 w-full" disabled={busy}>
          Ask the records
        </Button>
      </form>
    </div>
  );
}
