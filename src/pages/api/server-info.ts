import type { ViewLocation } from '@lib/data';
import { getColoMap } from '@lib/tracker';
import { insertViewerLocation } from '@lib/utils';
import type { APIRoute } from 'astro';
const started = new Date();

export const GET: APIRoute = async ({ request }) => {
  const cf = (
    request as Request & {
      cf?: IncomingRequestCfProperties;
    }
  ).cf;
  const map = await getColoMap();
  return Response.json({
    // cf,
    startedAt: started,
    colo: cf?.colo,
    edgeLocation: cf?.colo ? map.get(cf?.colo)?.city : undefined,
    edgeLat: cf?.colo ? map.get(cf?.colo)?.lat : undefined,
    edgeLon: cf?.colo ? map.get(cf?.colo)?.lon : undefined,
    country: cf?.country,
    city: cf?.city,
    region: cf?.region,
    timezone: cf?.timezone,
    latitude: cf?.latitude,
    longitude: cf?.longitude,
    asn: cf?.asn,
    asOrganization: cf?.asOrganization,
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

export const POST: APIRoute = async ({ request }) => {
  let visitorId = request.headers.get('X-Visitor-Key');

  if (typeof visitorId !== 'string' || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
    return Response.json({ error: 'Invalid visitor ID' }, { status: 400 });
  }

  const cf = (
    request as Request & {
      cf?: IncomingRequestCfProperties;
    }
  ).cf;

  if (cf?.longitude && cf?.latitude && cf?.city && cf?.region && cf?.colo) {
    const location: ViewLocation = {
      lon: Number(cf.longitude),
      lat: Number(cf.latitude),
      city: cf.city,
      region: cf.region,
      colo: cf.colo,
    };

    await insertViewerLocation(location, visitorId);
  }

  return Response.json({ success: true });
};
