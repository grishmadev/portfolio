import type { APIRoute } from "astro";
const started = Date.now();
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({ startedAt: started }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
