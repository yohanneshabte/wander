import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import {
  CLAIMS,
  MODALITIES,
  MODALITY_OUTCOMES,
  OUTCOMES,
  REIMBURSEMENT,
  mapServiceModalities,
} from "./taxonomy";
import { HOUSES } from "@/lib/platform/catalog";

async function seedEvidence() {
  const sql = await getSql();
  const n = await sql<{ n: number }>`select count(*)::int as n from modalities`;
  if ((n[0]?.n ?? 0) > 0) return;

  for (const m of MODALITIES) {
    await sql`
      insert into modalities (key, name, family, blurb, setting, sort)
      values (${m.key}, ${m.name}, ${m.family}, ${m.blurb}, ${m.setting}, ${m.sort})
      on conflict (key) do nothing
    `;
  }
  for (const t of OUTCOMES) {
    await sql`
      insert into outcome_tags (key, name, family, sort)
      values (${t.key}, ${t.name}, ${t.family}, ${t.sort})
      on conflict (key) do nothing
    `;
  }
  for (const [mod, tag] of MODALITY_OUTCOMES) {
    await sql`
      insert into modality_outcomes (modality_key, tag_key)
      values (${mod}, ${tag})
      on conflict do nothing
    `;
  }
  for (const c of CLAIMS) {
    await sql`
      insert into evidence_claims (
        id, modality_key, claim, grade, population, caveat,
        source_name, source_url, pmid, year, reviewed_on
      ) values (
        ${c.id}, ${c.modalityKey}, ${c.claim}, ${c.grade}, ${c.population},
        ${c.caveat}, ${c.sourceName}, ${c.sourceUrl}, ${c.pmid}, ${c.year},
        ${c.reviewedOn}
      )
      on conflict (id) do nothing
    `;
  }
  for (const r of REIMBURSEMENT) {
    await sql`
      insert into reimbursement (modality_key, hsa_fsa, fda, lmn_note, plan_note)
      values (${r.modalityKey}, ${r.hsaFsa}, ${r.fda}, ${r.lmnNote}, ${r.planNote})
      on conflict (modality_key) do nothing
    `;
  }
  for (const house of HOUSES) {
    for (const s of house.services) {
      for (const key of mapServiceModalities(s.id, s.categoryKey, s.name)) {
        await sql`
          insert into service_modalities (service_id, modality_key)
          values (${s.id}, ${key})
          on conflict do nothing
        `;
      }
    }
  }
}

export const listEvidenceIndex = createServerFn({ method: "GET" }).handler(
  async () => {
    await seedEvidence();
    return {
      modalities: MODALITIES,
      outcomes: OUTCOMES,
      claims: CLAIMS,
      reimbursement: REIMBURSEMENT,
      links: MODALITY_OUTCOMES,
    };
  },
);

export const getModality = createServerFn({ method: "GET" })
  .validator((key: string) => key)
  .handler(async ({ data: key }) => {
    await seedEvidence();
    const modality = MODALITIES.find((m) => m.key === key);
    if (!modality) return null;
    const claims = CLAIMS.filter((c) => c.modalityKey === key);
    const reimbursement = REIMBURSEMENT.find((r) => r.modalityKey === key) ?? null;
    const tags = MODALITY_OUTCOMES.filter(([m]) => m === key).map(([, t]) => t);
    const services = HOUSES.flatMap((h) =>
      h.services
        .filter((s) => mapServiceModalities(s.id, s.categoryKey, s.name).includes(key))
        .map((s) => ({
          id: s.id,
          name: s.name,
          siteId: s.siteId,
          siteName: h.site.name,
          categoryKey: s.categoryKey,
          listPrice: s.listPrice ?? s.weekdayPrice,
          durationMin: s.durationMin,
        })),
    );
    return { modality, claims, reimbursement, tags, services };
  });

export const getServiceEvidence = createServerFn({ method: "GET" })
  .validator((serviceId: string) => serviceId)
  .handler(async ({ data: serviceId }) => {
    await seedEvidence();
    const service = HOUSES.flatMap((h) =>
      h.services.map((s) => ({ s, house: h })),
    ).find((x) => x.s.id === serviceId);
    if (!service) return null;
    const keys = mapServiceModalities(service.s.id, service.s.categoryKey, service.s.name);
    const modalities = MODALITIES.filter((m) => keys.includes(m.key));
    const claims = CLAIMS.filter((c) => keys.includes(c.modalityKey));
    const reimbursement = REIMBURSEMENT.filter((r) => keys.includes(r.modalityKey));
    const tags = [
      ...new Set(
        MODALITY_OUTCOMES.filter(([m]) => keys.includes(m)).map(([, t]) => t),
      ),
    ];
    return {
      service: service.s,
      house: service.house.site,
      modalities,
      claims,
      reimbursement,
      tags,
    };
  });

type ChatTurn = { role: "user" | "assistant"; content: string };

export const askGuide = createServerFn({ method: "POST" })
  .validator((d: { message: string; history: ChatTurn[]; tag?: string }) => d)
  .handler(async ({ data }) => {
    await seedEvidence();
    const q = data.message.trim().slice(0, 500);
    if (!q) return { ok: false as const, error: "Say what you want help with." };

    const hay = `${q} ${data.tag ?? ""}`.toLowerCase();
    const matchedMods = MODALITIES.filter(
      (m) =>
        hay.includes(m.key.replace("_", " ")) ||
        hay.includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().split(" ").some((w) => w.length > 4 && hay.includes(w)),
    );
    const matchedTags = OUTCOMES.filter((t) => hay.includes(t.key) || hay.includes(t.name.toLowerCase()));
    let keys = new Set(matchedMods.map((m) => m.key));
    for (const t of matchedTags) {
      for (const [m, tag] of MODALITY_OUTCOMES) {
        if (tag === t.key) keys.add(m);
      }
    }
    if (hay.includes("hsa") || hay.includes("fsa") || hay.includes("reimburse") || hay.includes("irs")) {
      for (const r of REIMBURSEMENT) keys.add(r.modalityKey);
    }
    if (hay.includes("peptide") || hay.includes("injection") || hay.includes("bpc")) {
      keys.add("peptide_injection");
    }
    if (keys.size === 0) {
      keys = new Set(["massage_swedish", "float_rest", "hydrotherapy"]);
    }

    const records = [...keys].slice(0, 6).map((key) => {
      const modality = MODALITIES.find((m) => m.key === key)!;
      return {
        modality,
        claims: CLAIMS.filter((c) => c.modalityKey === key),
        reimbursement: REIMBURSEMENT.find((r) => r.modalityKey === key),
        services: HOUSES.flatMap((h) =>
          h.services
            .filter((s) => mapServiceModalities(s.id, s.categoryKey, s.name).includes(key))
            .slice(0, 3)
            .map((s) => `${s.name} @ ${h.site.name}`),
        ),
      };
    });

    const apiKey = process.env.XAI_API_KEY;
    const fallback = fallbackReply(q, records);
    if (!apiKey) return { ok: true as const, text: fallback, records };

    const context = JSON.stringify(
      records.map((r) => ({
        modality: r.modality.name,
        key: r.modality.key,
        claims: r.claims.map((c) => ({
          claim: c.claim,
          grade: c.grade,
          source: c.sourceName,
          pmid: c.pmid,
          caveat: c.caveat,
        })),
        hsa: r.reimbursement,
        book: r.services,
      })),
    );

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 420,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You are a benefits guide on a spa booking demo. Use ONLY the EVIDENCE JSON. Do not invent PMIDs, studies, or FDA approvals. If it is not in the JSON, say you do not have a checked record. Always say this is not medical advice and not a promise their HSA/FSA will pay. Prefer short mobile paragraphs. Name a bookable service from the JSON when you can. Peptide injections are clinical, not a tub add-on.",
            },
            {
              role: "user",
              content: `EVIDENCE JSON:\n${context}\n\nGuest: ${q}`,
            },
          ],
        }),
      });
      if (!res.ok) return { ok: true as const, text: fallback, records };
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim() || fallback;
      return { ok: true as const, text, records };
    } catch {
      return { ok: true as const, text: fallback, records };
    }
  });

function fallbackReply(
  q: string,
  records: {
    modality: (typeof MODALITIES)[number];
    claims: typeof CLAIMS;
    reimbursement?: (typeof REIMBURSEMENT)[number];
    services: string[];
  }[],
) {
  const first = records[0];
  if (!first) {
    return "I only answer from checked records. Try pain, sleep, HSA, float, or massage.";
  }
  const claim = first.claims[0]?.claim ?? first.modality.blurb;
  const hsa = first.reimbursement
    ? ` HSA/FSA: ${first.reimbursement.hsaFsa} — ${first.reimbursement.lmnNote}`
    : "";
  const book = first.services[0] ? ` On the menu: ${first.services[0]}.` : "";
  return `${claim}${hsa}${book} Not medical advice — records are cited on the service page. You asked: “${q.slice(0, 80)}”.`;
}
