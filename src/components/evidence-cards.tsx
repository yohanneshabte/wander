import {
  FDA_LABEL,
  GRADE_LABEL,
  HSA_LABEL,
  type EvidenceClaim,
  type Reimbursement,
} from "@/lib/evidence/taxonomy";
import { cn } from "@/lib/utils";

export function HsaCard({ row }: { row: Reimbursement }) {
  return (
    <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        HSA / FSA
      </p>
      <p className="mt-1 font-medium text-wood">{HSA_LABEL[row.hsaFsa]}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{row.lmnNote}</p>
      <p className="mt-2 text-xs text-muted">FDA: {FDA_LABEL[row.fda]}</p>
      <p className="mt-1 text-xs text-muted">{row.planNote}</p>
    </div>
  );
}

export function ClaimCard({ claim }: { claim: EvidenceClaim }) {
  return (
    <article className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-[11px] font-medium uppercase tracking-wide text-sage">
        Grade {claim.grade} · {GRADE_LABEL[claim.grade]}
      </p>
      <p className="mt-1 text-sm leading-relaxed">{claim.claim}</p>
      {claim.population ? (
        <p className="mt-2 text-xs text-muted">Who: {claim.population}</p>
      ) : null}
      <p className="mt-1 text-xs leading-relaxed text-muted">{claim.caveat}</p>
      <p className="mt-2 text-xs">
        <a
          href={claim.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-border"
        >
          {claim.sourceName}
          {claim.pmid ? ` · PMID ${claim.pmid}` : ""}
          {claim.year ? ` · ${claim.year}` : ""}
        </a>
      </p>
      <p className="mt-1 text-[11px] text-muted">Checked {claim.reviewedOn}</p>
    </article>
  );
}

export function TagRow({
  tags,
  active,
  onPick,
}: {
  tags: { key: string; name: string }[];
  active?: string;
  onPick?: (key: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tags.map((t) => {
        const chip = (
          <span
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center rounded-full px-3 text-sm",
              active === t.key
                ? "bg-wood text-wood-fg"
                : "bg-surface shadow-[var(--shadow-border)]",
            )}
          >
            {t.name}
          </span>
        );
        if (!onPick) return <span key={t.key}>{chip}</span>;
        return (
          <button key={t.key} type="button" onClick={() => onPick(t.key)}>
            {chip}
          </button>
        );
      })}
    </div>
  );
}
