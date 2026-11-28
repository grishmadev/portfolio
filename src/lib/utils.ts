import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import type { coloLocation, ViewLocation } from './data';

export const context = {
  request: new Request('http://localhost'),
  params: {},
} as Parameters<APIRoute>[0];

export type Location = {
  lon: number;
  lat: number;
};

export async function executeSql(query: string, ...args: (string | number)[]) {
  const db = env.portfolio_db;
  const result = await db
    .prepare(query)
    .bind(...args)
    .all();
  return result;
}

export async function getViewerLocations(last: number): Promise<Location[]> {
  const { success, results } = await executeSql(
    'SELECT v.colo, v.lon as vlon, v.lat as vlat, c.lon as clon, c.lat as clat, c.region as cregion FROM viewer_locations v LEFT JOIN colos c WHERE c.iata = v.colo ORDER BY created_at DESC LIMIT ?',
    last,
  );
  if (!success) {
    console.error('Failed to fetch viewer locations:', results);
    return [];
  }
  const locations: Location[] = results.map((row: any) => ({
    lon: row.vlon,
    lat: row.vlat,
    colo: row.colo,
    edgeLon: row.clon,
    edgeLat: row.clat,
  }));
  return locations;
}

export async function insertViewerLocation(
  location: ViewLocation,
  id: string,
): Promise<void> {
  const THIRTY_MIN_SEC = 30 * 60; // use * 1000 if created_at is in ms
  const cutoff = Math.floor(Date.now() / 1000) - THIRTY_MIN_SEC;

  const { success } = await executeSql(
    `INSERT INTO viewer_locations (lon, lat, city, region, colo, visitor_id, created_at)
     SELECT ?, ?, ?, ?, ?, ?, ?
     WHERE NOT EXISTS (
       SELECT 1 FROM viewer_locations
       WHERE visitor_id = ? AND created_at > ?
     )`,
    location.lon,
    location.lat,
    location.city,
    location.region,
    location.colo,
    id,
    Math.floor(Date.now() / 1000),
    id,
    cutoff,
  );

  if (!success) console.error('Failed to insert viewer location:');
}

export async function getColosData(): Promise<coloLocation[]> {
  const { success, results } = await executeSql('SELECT * FROM colos');
  if (!success) {
    console.error('Failed to get data from D1');
    return [];
  }
  return results as coloLocation[];
}
