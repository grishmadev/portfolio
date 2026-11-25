import { getConcurrentUser, heartbeat } from "@lib/tracker";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { id } = await request.json() as { id: string };
  heartbeat(id);
  return new Response(JSON.stringify({
    total: getConcurrentUser()
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
