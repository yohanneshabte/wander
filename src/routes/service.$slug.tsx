import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { BenefitChat } from "@/components/benefit-chat";
import { ClaimCard, HsaCard, TagRow } from "@/components/evidence-cards";
import { getModality, getServiceEvidence } from "@/lib/evidence/api";
import { OUTCOMES } from "@/lib/evidence/taxonomy";
import { displayPrice } from "@/lib/platform/rooms";
import { HOUSES } from "@/lib/platform/catalog";

export const Route = createFileRoute("/service/$slug")({
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const [mode, setMode] = useState<"service" | "modality" | "miss" | "load">(
    "load",
  );
  const [service, setService] = useState<Awaited<
    ReturnType<typeof getServiceEvidence>
  > | null>(null);
  const [modality, setModality] = useState<Awaited<
    ReturnType<typeof getModality>
  > | null>(null);

  useEffect(() => {
    let alive = true;
    const asService = HOUSES.some((h) => h.services.some((s) => s.id === slug));
    if (asService) {
      getServiceEvidence({ data: slug }).then((row) => {
        if (!alive) return;
        setService(row);
        setMode(row ? "service" : "miss");
      });
    } else {
      getModality({ data: slug }).then((row) => {
        if (!alive) return;
        setModality(row);
        setMode(row ? "modality" : "miss");
      });
    }
    return () => {
      alive = false;
    };
  }, [slug]);

  if (mode === "load") {
    return (
      <Shell>
        <div className="px-5 pt-10">
          <div className="h-8 w-40 animate-pulse rounded-2xl bg-surface-2" />
          <div className="mt-4 h-40 animate-pulse rounded-3xl bg-surface-2" />
        </div>
      </Shell>
    );
  }

  if (mode === "miss") {
    return (
      <Shell>
        <div className="px-5 pt-10">
          <h1 className="font-display text-3xl text-wood">Not in the catalog</h1>
          <Link to="/guide" className="mt-5 block">
            <Button className="w-full">Open the guide</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  if (mode === "service" && service) {
    const tags = OUTCOMES.filter((t) => service.tags.includes(t.key));
    return (
      <Shell>
        <div className="px-5 pt-6 pb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {service.house.name} · {service.service.categoryKey}
          </p>
          <h1 className="font-display text-3xl leading-tight text-wood">
            {service.service.name}
          </h1>
          <p className="mt-2 text-sm text-muted">{service.service.blurb}</p>
          <p className="mt-3 font-display text-2xl tabular-nums text-wood">
            {displayPrice(service.service.listPrice ?? service.service.weekdayPrice)}
            {service.service.durationMin
              ? ` · ${service.service.durationMin} min`
              : ""}
          </p>
          <div className="mt-4">
            <TagRow tags={tags} />
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {service.reimbursement.map((r) => (
              <HsaCard key={r.modalityKey} row={r} />
            ))}
          </div>
          <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
            Checked claims
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {service.claims.length === 0 ? (
              <p className="text-sm text-muted">
                No citation on file for this add-on. Ask the guide or call the desk.
              </p>
            ) : (
              service.claims.map((c) => <ClaimCard key={c.id} claim={c} />)
            )}
          </div>
          <div className="mt-6">
            <BenefitChat />
          </div>
          <Link to="/book" className="mt-5 block">
            <Button size="lg" className="w-full">
              Hold this
            </Button>
          </Link>
          <Link to="/guide" className="mt-2 block">
            <Button variant="outline" className="w-full">
              All modalities
            </Button>
          </Link>
        </div>
      </Shell>
    );
  }

  if (mode === "modality" && modality) {
    const tags = OUTCOMES.filter((t) => modality.tags.includes(t.key));
    return (
      <Shell>
        <div className="px-5 pt-6 pb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {modality.modality.family} · {modality.modality.setting}
          </p>
          <h1 className="font-display text-3xl leading-tight text-wood">
            {modality.modality.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {modality.modality.blurb}
          </p>
          <div className="mt-4">
            <TagRow tags={tags} />
          </div>
          {modality.reimbursement ? (
            <div className="mt-5">
              <HsaCard row={modality.reimbursement} />
            </div>
          ) : null}
          <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
            Checked claims
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {modality.claims.map((c) => (
              <ClaimCard key={c.id} claim={c} />
            ))}
          </div>
          {modality.services.length ? (
            <>
              <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
                On a house menu
              </h2>
              <ul className="mt-2 flex flex-col gap-2">
                {modality.services.map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/service/$slug"
                      params={{ slug: s.id }}
                      className="block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
                    >
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted">
                        {s.siteName}
                        {s.listPrice ? ` · ${displayPrice(s.listPrice)}` : ""}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">
              In the industry taxonomy. Not booked at the current house — useful
              when you pitch a medical spa or peptide clinic later.
            </p>
          )}
          <div className="mt-6">
            <BenefitChat />
          </div>
          <Link to="/book" className="mt-5 block">
            <Button size="lg" className="w-full">
              Book Now
            </Button>
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="px-5 pt-10">
        <div className="h-8 w-40 animate-pulse rounded-2xl bg-surface-2" />
        <div className="mt-4 h-40 animate-pulse rounded-3xl bg-surface-2" />
      </div>
    </Shell>
  );
}
