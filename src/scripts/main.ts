import { getLocalTime, getUTCTime } from '@scripts/time';
import { getVisitorId, processDuration, processSize } from './utils';

export function setDOMTime(localId: string, utcId: string) {
  let local = document.getElementById(localId) as HTMLElement;
  local.innerHTML = 'Local: ' + getLocalTime();
  let utc = document.getElementById(utcId) as HTMLElement;
  utc.innerHTML = 'UTC: ' + getUTCTime();
}

export async function setDOMHeartbeat() {
  const heartbeatResponse = await fetch('/api/heartbeat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: getVisitorId() }),
  });
  const { total } = (await heartbeatResponse.json()) as { total: number };
  const users = document.getElementById('users') as HTMLElement;
  users.innerHTML = total.toString() + ' Watcher' + (total > 1 ? 's' : '');
}

let lasttime = Date.now();
let syncRate = 100;

export function setSyncRate(id: string, interval: number): number {
  const now = Date.now();
  const actualInterval = now - lasttime;
  lasttime = now;
  const deviation = Math.abs(actualInterval - interval);
  syncRate = Math.max(0, 100 - (deviation / 1000) * 100);
  const displayRate = syncRate.toFixed(2);
  const element = document.getElementById(id) as HTMLElement;
  element.innerHTML = 'SYNC: ' + displayRate + '%';
  return syncRate;
}

export enum SyncType {
  NOMINAL = 'NOMINAL',
  OK = 'OK',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export function setSyncStatus(id: string, percentage: number) {
  const elem = document.getElementById(id) as HTMLElement;
  if (percentage > 90) {
    elem.innerHTML = SyncType.NOMINAL;
    elem.style.color = 'green';
  } else if (percentage > 60) {
    elem.innerHTML = SyncType.OK;
    elem.style.color = 'cyan';
  } else if (percentage > 30) {
    elem.innerHTML = SyncType.CRITICAL;
    elem.style.color = 'orange';
  } else {
    elem.innerHTML = SyncType.EMERGENCY;
    elem.style.color = 'red';
  }
}

export type PerformaceMetrics = {
  tcpHandshake: number;
  dnsLookup: number;
  totalDuration: number;
  ttfb: number;
  transferSize: number;
  encodedBodySize: number;
};
export function getPerformance(): PerformaceMetrics {
  const nav = performance.getEntriesByType(
    'navigation',
  )[0] as PerformanceNavigationTiming;
  const timing = {
    tcpHandshake: nav.connectEnd - nav.connectStart,
    dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
    // total time from start to finish
    totalDuration: nav.duration,
    ttfb: nav.responseStart - nav.requestStart,
    transferSize: nav.transferSize,
    encodedBodySize: nav.encodedBodySize,
  };
  return timing;
}

const perf = getPerformance();
export function setTTFB(id: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = 'TTFB: ' + processDuration(perf.ttfb);
}

export function setTransferSize(id: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = 'Total Transfer: ' + processSize(perf.transferSize);
}

export function setAliveFrom(id: string, date: number) {
  const elem = document.getElementById(id) as HTMLElement;
  const from = new Date(date).toLocaleString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    year: '2-digit',
    month: 'short',
  });
  elem.innerHTML = 'Alive from: ' + from;
}

export function setRtt(id: string, rtt: number) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.textContent = 'TCP RTT: ' + rtt + 'ms';
}

export function setQuic(id: string, rtt: number) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.textContent = 'QUIC RTT: ' + (rtt != 0 ? rtt.toString() + 'ms' : 'N/A');
}

export function setHelloLen(id: string, length: number) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.textContent = 'Hello Length: ' + processSize(length);
}

export function setDeliveryRate(id: string, length: number) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.textContent = 'Delivery Rate: ' + processSize(length) + '/s';
}

/*
 * Used to draw and animate circle
 **/
export function drawCircle(id: string, perc: number) {
  const circle = document.getElementById(id) as HTMLElement;
  if (perc > 80) circle.style.background = 'green';
  else if (perc > 50) circle.style.background = 'yellow';
  else if (perc > 30) circle.style.background = 'orange';
  else circle.style.background = 'red';
  animateCircle(id, 1.3);
}

export function animateCircle(id: string, size: number) {
  const circle = document.getElementById(id) as HTMLElement;
  circle.animate(
    [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0.0, transform: `scale(${size})` },
    ],
    {
      duration: 1500,
      iterations: Infinity,
      easing: 'linear',
    },
  );
}

type RepoCount = { name: string; repos: number };
export function getLangHeirarchy(
  response: { language: string }[],
): RepoCount[] {
  const result: RepoCount[] = [];
  const map = new Map<string, number>();
  for (const r of response) {
    if (!r.language) continue;
    const count = map.get(r.language);
    if (count) map.set(r.language, count + 1);
    else map.set(r.language, 1);
  }
  for (const [name, count] of map.entries()) {
    result.push({
      name,
      repos: count,
    });
  }
  result.sort((a, b) => a.repos - b.repos);
  return result;
}

export function setTLSCipher(id: string, cipher: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = cipher;
}

export function setEdgeLocation(id: string, location: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = location;
}

export function setTLSVersion(id: string, version: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = version;
}

export function setHTTPProtocol(id: string, protocol: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = protocol;
}

export function setLocation(id: string, location: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = location;
}

export function setOrg(id: string, org: string) {
  const elem = document.getElementById(id) as HTMLElement;
  elem.innerHTML = org;
}
