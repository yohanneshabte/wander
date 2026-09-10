import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-sFykTKZh.mjs";
import { i as PROSPECTS } from "./prospects-CbbhFEIU.mjs";
import { t as authMiddleware } from "./middleware-B2szmp83.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BBMDjVRs.js
async function requireOwner(userId) {
	if ((await (await getSql())`
    select role from profiles where user_id = ${userId}
  `)[0]?.role !== "admin") throw new Error("Owner only.");
}
async function seedProspects() {
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from prospects`)[0]?.n ?? 0) > 0) return;
	for (const p of PROSPECTS) await sql`
      insert into prospects (
        id, name, region, city, address, lat, lng, kind, tags, booking_gap,
        phone, website, pitch, source, public
      ) values (
        ${p.id}, ${p.name}, ${p.region}, ${p.city}, ${p.address}, ${p.lat},
        ${p.lng}, ${p.kind}, ${p.tags.join(",")}, ${p.bookingGap}, ${p.phone},
        ${p.website}, ${p.pitch}, ${p.source}, false
      )
      on conflict (id) do nothing
    `;
}
var listProspects_createServerFn_handler = createServerRpc({
	id: "2d9afee01c3c04f20dbf58b72284b534d6a6314e36b015ad9e00fb057878d667",
	name: "listProspects",
	filename: "src/lib/directory/api.ts"
}, (opts) => listProspects.__executeServer(opts));
var listProspects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProspects_createServerFn_handler, async ({ context }) => {
	await requireOwner(context.userId);
	await seedProspects();
	return PROSPECTS;
});
var getProspect_createServerFn_handler = createServerRpc({
	id: "dda187e2a288e9faec55b32c3e5a2ad25db10725959e6ce3af8783015db09ced",
	name: "getProspect",
	filename: "src/lib/directory/api.ts"
}, (opts) => getProspect.__executeServer(opts));
var getProspect = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getProspect_createServerFn_handler, async ({ context, data: id }) => {
	await requireOwner(context.userId);
	await seedProspects();
	return PROSPECTS.find((p) => p.id === id) ?? null;
});
//#endregion
export { getProspect_createServerFn_handler, listProspects_createServerFn_handler };
