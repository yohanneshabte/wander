import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-B2szmp83.mjs";
import { A as createSsrRpc } from "./router-Dx54FkoQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CM5mYyN0.js
var listProspects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2d9afee01c3c04f20dbf58b72284b534d6a6314e36b015ad9e00fb057878d667"));
var getProspect = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("dda187e2a288e9faec55b32c3e5a2ad25db10725959e6ce3af8783015db09ced"));
//#endregion
export { listProspects as n, getProspect as t };
