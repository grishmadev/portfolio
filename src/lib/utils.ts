import type { APIRoute } from "astro";

export const context = {
  request: new Request('http://localhost'),
  params: {}
} as Parameters<APIRoute>[0];


// export async function getCfPlatform() {
//   const platform = getPlatformProxy({
//     configPath: "./wrangler.jsonc"
//   });
//   return platform;
// }
