import { type coloLocation } from './data';
import { getColosData } from './utils';

const connections = new Map<string, number>();

export function heartbeat(id: string) {
  connections.set(id, Date.now());
}

export function getConcurrentUser(): number {
  const now = Date.now();
  const timeout = 20 * 1000; // 20 secs

  for (const [id, lastSeen] of connections) {
    if (now - lastSeen >= timeout) {
      connections.delete(id);
    }
  }

  return connections.size;
}

let memoryCache: Map<string, coloLocation> | null = null;

export async function getColoMap(): Promise<Map<string, coloLocation>> {
  if (memoryCache) return memoryCache;
  let list;
  const dbData = await getColosData();
  if (dbData.length) {
    list = dbData;
  } else {
    const res = await fetch('https://speed.cloudflare.com/locations', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:161.0) Gecko/20100101 Firefox/161.0',
        Accept: 'application/json,text/plain,*/*',
        Referer:
          '[https://speed.cloudflare.com/](https://speed.cloudflare.com/)',
      },
      cf: { cacheTtl: 86400, cacheEverything: true },
    });
    if (!res.ok) {
      console.error('Failed to fetch Cloudflare locations:', res.statusText);
      return new Map();
    }
    list = (await res.json()) as coloLocation[];
  }
  memoryCache = new Map(list.map((item) => [item.iata, item]));
  return memoryCache;
}
