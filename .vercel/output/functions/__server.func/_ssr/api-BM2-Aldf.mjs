import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-sFykTKZh.mjs";
import { n as HOUSES } from "./catalog-DfYcD4vg.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as MODALITIES, c as REIMBURSEMENT, l as mapServiceModalities, o as MODALITY_OUTCOMES, s as OUTCOMES, t as CLAIMS } from "./taxonomy-BcMkmkiX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BM2-Aldf.js
async function seedEvidence() {
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from modalities`)[0]?.n ?? 0) > 0) return;
	for (const m of MODALITIES) await sql`
      insert into modalities (key, name, family, blurb, setting, sort)
      values (${m.key}, ${m.name}, ${m.family}, ${m.blurb}, ${m.setting}, ${m.sort})
      on conflict (key) do nothing
    `;
	for (const t of OUTCOMES) await sql`
      insert into outcome_tags (key, name, family, sort)
      values (${t.key}, ${t.name}, ${t.family}, ${t.sort})
      on conflict (key) do nothing
    `;
	for (const [mod, tag] of MODALITY_OUTCOMES) await sql`
      insert into modality_outcomes (modality_key, tag_key)
      values (${mod}, ${tag})
      on conflict do nothing
    `;
	for (const c of CLAIMS) await sql`
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
	for (const r of REIMBURSEMENT) await sql`
      insert into reimbursement (modality_key, hsa_fsa, fda, lmn_note, plan_note)
      values (${r.modalityKey}, ${r.hsaFsa}, ${r.fda}, ${r.lmnNote}, ${r.planNote})
      on conflict (modality_key) do nothing
    `;
	for (const house of HOUSES) for (const s of house.services) for (const key of mapServiceModalities(s.id, s.categoryKey, s.name)) await sql`
          insert into service_modalities (service_id, modality_key)
          values (${s.id}, ${key})
          on conflict do nothing
        `;
}
var listEvidenceIndex_createServerFn_handler = createServerRpc({
	id: "7a3d62a7e41f49961a9f48812a76d36f4779d5cee1b18d9781642f676df5b29a",
	name: "listEvidenceIndex",
	filename: "src/lib/evidence/api.ts"
}, (opts) => listEvidenceIndex.__executeServer(opts));
var listEvidenceIndex = createServerFn({ method: "GET" }).handler(listEvidenceIndex_createServerFn_handler, async () => {
	await seedEvidence();
	return {
		modalities: MODALITIES,
		outcomes: OUTCOMES,
		claims: CLAIMS,
		reimbursement: REIMBURSEMENT,
		links: MODALITY_OUTCOMES
	};
});
var getModality_createServerFn_handler = createServerRpc({
	id: "ad3e4d5bad0ab9bbadb4fbf13564a29d9ad4d8d284724ba030784468b5a198f4",
	name: "getModality",
	filename: "src/lib/evidence/api.ts"
}, (opts) => getModality.__executeServer(opts));
var getModality = createServerFn({ method: "GET" }).validator((key) => key).handler(getModality_createServerFn_handler, async ({ data: key }) => {
	await seedEvidence();
	const modality = MODALITIES.find((m) => m.key === key);
	if (!modality) return null;
	return {
		modality,
		claims: CLAIMS.filter((c) => c.modalityKey === key),
		reimbursement: REIMBURSEMENT.find((r) => r.modalityKey === key) ?? null,
		tags: MODALITY_OUTCOMES.filter(([m]) => m === key).map(([, t]) => t),
		services: HOUSES.flatMap((h) => h.services.filter((s) => mapServiceModalities(s.id, s.categoryKey, s.name).includes(key)).map((s) => ({
			id: s.id,
			name: s.name,
			siteId: s.siteId,
			siteName: h.site.name,
			categoryKey: s.categoryKey,
			listPrice: s.listPrice ?? s.weekdayPrice,
			durationMin: s.durationMin
		})))
	};
});
var getServiceEvidence_createServerFn_handler = createServerRpc({
	id: "2f242f76a6c644b842d5dc0427250e5f350648013b86e9a89e9ff321cb2a80c8",
	name: "getServiceEvidence",
	filename: "src/lib/evidence/api.ts"
}, (opts) => getServiceEvidence.__executeServer(opts));
var getServiceEvidence = createServerFn({ method: "GET" }).validator((serviceId) => serviceId).handler(getServiceEvidence_createServerFn_handler, async ({ data: serviceId }) => {
	await seedEvidence();
	const service = HOUSES.flatMap((h) => h.services.map((s) => ({
		s,
		house: h
	}))).find((x) => x.s.id === serviceId);
	if (!service) return null;
	const keys = mapServiceModalities(service.s.id, service.s.categoryKey, service.s.name);
	const modalities = MODALITIES.filter((m) => keys.includes(m.key));
	const claims = CLAIMS.filter((c) => keys.includes(c.modalityKey));
	const reimbursement = REIMBURSEMENT.filter((r) => keys.includes(r.modalityKey));
	const tags = [...new Set(MODALITY_OUTCOMES.filter(([m]) => keys.includes(m)).map(([, t]) => t))];
	return {
		service: service.s,
		house: service.house.site,
		modalities,
		claims,
		reimbursement,
		tags
	};
});
var askGuide_createServerFn_handler = createServerRpc({
	id: "3c0d1695989333152d97727b44724066bed7701a69e7a7645b250286938350bb",
	name: "askGuide",
	filename: "src/lib/evidence/api.ts"
}, (opts) => askGuide.__executeServer(opts));
var askGuide = createServerFn({ method: "POST" }).validator((d) => d).handler(askGuide_createServerFn_handler, async ({ data }) => {
	await seedEvidence();
	const q = data.message.trim().slice(0, 500);
	if (!q) return {
		ok: false,
		error: "Say what you want help with."
	};
	const hay = `${q} ${data.tag ?? ""}`.toLowerCase();
	const matchedMods = MODALITIES.filter((m) => hay.includes(m.key.replace("_", " ")) || hay.includes(m.name.toLowerCase()) || m.name.toLowerCase().split(" ").some((w) => w.length > 4 && hay.includes(w)));
	const matchedTags = OUTCOMES.filter((t) => hay.includes(t.key) || hay.includes(t.name.toLowerCase()));
	let keys = new Set(matchedMods.map((m) => m.key));
	for (const t of matchedTags) for (const [m, tag] of MODALITY_OUTCOMES) if (tag === t.key) keys.add(m);
	if (hay.includes("hsa") || hay.includes("fsa") || hay.includes("reimburse") || hay.includes("irs")) for (const r of REIMBURSEMENT) keys.add(r.modalityKey);
	if (hay.includes("peptide") || hay.includes("injection") || hay.includes("bpc")) keys.add("peptide_injection");
	if (keys.size === 0) keys = /* @__PURE__ */ new Set([
		"massage_swedish",
		"float_rest",
		"hydrotherapy"
	]);
	const records = [...keys].slice(0, 6).map((key) => {
		return {
			modality: MODALITIES.find((m) => m.key === key),
			claims: CLAIMS.filter((c) => c.modalityKey === key),
			reimbursement: REIMBURSEMENT.find((r) => r.modalityKey === key),
			services: HOUSES.flatMap((h) => h.services.filter((s) => mapServiceModalities(s.id, s.categoryKey, s.name).includes(key)).slice(0, 3).map((s) => `${s.name} @ ${h.site.name}`))
		};
	});
	const apiKey = process.env.XAI_API_KEY;
	const fallback = fallbackReply(q, records);
	if (!apiKey) return {
		ok: true,
		text: fallback,
		records
	};
	const context = JSON.stringify(records.map((r) => ({
		modality: r.modality.name,
		key: r.modality.key,
		claims: r.claims.map((c) => ({
			claim: c.claim,
			grade: c.grade,
			source: c.sourceName,
			pmid: c.pmid,
			caveat: c.caveat
		})),
		hsa: r.reimbursement,
		book: r.services
	})));
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 420,
				temperature: .2,
				messages: [{
					role: "system",
					content: "You are a benefits guide on a spa booking demo. Use ONLY the EVIDENCE JSON. Do not invent PMIDs, studies, or FDA approvals. If it is not in the JSON, say you do not have a checked record. Always say this is not medical advice and not a promise their HSA/FSA will pay. Prefer short mobile paragraphs. Name a bookable service from the JSON when you can. Peptide injections are clinical, not a tub add-on."
				}, {
					role: "user",
					content: `EVIDENCE JSON:\n${context}\n\nGuest: ${q}`
				}]
			})
		});
		if (!res.ok) return {
			ok: true,
			text: fallback,
			records
		};
		return {
			ok: true,
			text: (await res.json()).choices?.[0]?.message?.content?.trim() || fallback,
			records
		};
	} catch {
		return {
			ok: true,
			text: fallback,
			records
		};
	}
});
function fallbackReply(q, records) {
	const first = records[0];
	if (!first) return "I only answer from checked records. Try pain, sleep, HSA, float, or massage.";
	return `${first.claims[0]?.claim ?? first.modality.blurb}${first.reimbursement ? ` HSA/FSA: ${first.reimbursement.hsaFsa} — ${first.reimbursement.lmnNote}` : ""}${first.services[0] ? ` On the menu: ${first.services[0]}.` : ""} Not medical advice — records are cited on the service page. You asked: “${q.slice(0, 80)}”.`;
}
//#endregion
export { askGuide_createServerFn_handler, getModality_createServerFn_handler, getServiceEvidence_createServerFn_handler, listEvidenceIndex_createServerFn_handler };
