import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  const cf = (request as Request & {
    cf?: IncomingRequestCfProperties;
  }).cf;
  return Response.json({
    colo: cf?.colo,
    country: cf?.country,
    city: cf?.city,
    region: cf?.region,
    timezone: cf?.timezone,
    // latitude: cf?.latitude,
    // longitude: cf?.longitude,
    // asn: cf?.asn,
    tlsVersion: cf?.tlsVersion,
    httpProtocol: cf?.httpProtocol,
    clientTcpRtt: cf?.clientTcpRtt,
    clientQuicRtt: cf?.clientQuicRtt,
    tlsCipher: cf?.tlsCipher,
    tlsClientHelloLength: cf?.tlsClientHelloLength,
    ...(cf?.edgeL4 ? cf?.edgeL4 : {}),
    botManagement: cf?.botManagement,
  });
};
