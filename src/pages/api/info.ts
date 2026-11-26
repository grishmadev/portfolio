import type { APIRoute } from "astro";

const table: [string, string][] = [["BOM", "Bombay"], ["DEL", "Delhi"], ["SIN", "Singapore"], ["LHR", "London"], ["SFO", "San Fransisco"], ["MAA", "Chennai"]];

const lookup = new Map<string, string>(table);

export const GET: APIRoute = ({ request }) => {
  const cfray = request.headers.get('CF-Ray');
  const datacenter = cfray?.split('-')[1];
  const valid = cfray && datacenter;
  const location = valid && lookup.get(datacenter);
  return new Response(JSON.stringify({
    location: location || "Unknown"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
