const lonMin = -169;
const lonMax = 191;
const latMin = -56;
const latMax = 83;

function mercatorY(lat: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

export function latLonToLocalPx(
  lat: number,
  lon: number,
  width: number,
  height: number,
) {
  const nx = (lon - lonMin) / (lonMax - lonMin);

  const yMin = mercatorY(latMin);
  const yMax = mercatorY(latMax);
  const y = mercatorY(lat);
  // In screen/SVG space, y increases downward, so higher latitude = smaller y
  const ny = (yMax - y) / (yMax - yMin);

  return {
    x: nx * width,
    y: ny * height,
  };
}

export function placeCurrentDot(lon: number, lat: number, id: string) {
  const img = document.querySelector<HTMLImageElement>('#data-map-img');
  const dot = document.getElementById(id) as HTMLElement;
  if (!img || !dot || Number.isNaN(lat) || Number.isNaN(lon)) return;

  const w = img.clientWidth;
  const h = img.clientHeight;
  if (!w || !h) return;

  const { x, y } = latLonToLocalPx(lat, lon, w, h);
  // Account for box padding if dot is positioned inside `box`
  const offsetLeft = img.offsetLeft + x;
  const offsetTop = img.offsetTop + y;

  dot.style.left = `${offsetLeft}px`;
  dot.style.top = `${offsetTop}px`;
  dot.classList.remove('hidden');
}

export function placeViewers(coords: { lon: number; lat: number }[]) {
  const box = document.getElementById('data-map-box') as HTMLElement;
  if (!box) return;
  let divider = coords.length;
  let opacity = 1;
  for (const { lon, lat } of coords) {
    const dot = document.createElement('div');
    dot.className = `absolute w-2 h-2 rounded-full bg-red-700 -translate-x-1/2 -translate-y-1/2 pointer-events-none`;
    const { x, y } = latLonToLocalPx(
      lat,
      lon,
      box.clientWidth,
      box.clientHeight,
    );
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.opacity = opacity.toString();
    box.appendChild(dot);
    opacity -= 1 / divider;
  }
}

export function placeServers(coords: { lon: number; lat: number }[]) {
  const box = document.querySelector<HTMLElement>('#data-map-box');
  if (!box) return;

  box.querySelectorAll('[data-server-dot]').forEach((n) => n.remove());

  for (const { lon, lat } of coords) {
    const dot = document.createElement('div');
    dot.setAttribute('data-server-dot', '');
    dot.className =
      'absolute w-2 h-2 rounded-full bg-(--primary-violet) -translate-x-1/2 -translate-y-1/2 pointer-events-none';

    const { x, y } = latLonToLocalPx(
      lat,
      lon,
      box.clientWidth,
      box.clientHeight,
    );
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    box.appendChild(dot);
  }
}

export function placeArrow(viewers: any[]) {
  const box = document.querySelector<HTMLElement>('#data-map-box');
  const img = box?.querySelector<HTMLImageElement>('img');
  if (!box || !img) return;

  let canvas = box.querySelector<HTMLCanvasElement>('canvas[data-lines]');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute('data-lines', '');
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    box.appendChild(canvas);
  }

  const dpr = window.devicePixelRatio || 1;
  const boxW = box.clientWidth;
  const boxH = box.clientHeight;
  canvas.width = Math.round(boxW * dpr);
  canvas.height = Math.round(boxH * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, boxW, boxH);

  const w = img.clientWidth;
  const h = img.clientHeight;

  ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
  ctx.lineWidth = 1.5;
  const serversNeeded = [];
  for (const v of viewers) {
    serversNeeded.push({ lat: v.edgeLat, lon: v.edgeLon });

    const p1 = latLonToLocalPx(v.lat, v.lon, w, h);
    const p2 = latLonToLocalPx(v.edgeLat, v.edgeLon, w, h);

    ctx.beginPath();
    ctx.moveTo(img.offsetLeft + p1.x, img.offsetTop + p1.y);
    ctx.lineTo(img.offsetLeft + p2.x, img.offsetTop + p2.y);
    ctx.stroke();
  }
  placeServers(serversNeeded);
}

const legend = [
  ['Viewers', 'red'],
  ['Servers', '#7008e7'],
  ['Connections', 'green'],
];

export function setMapLegend(id: string) {
  const box = document.getElementById(id) as HTMLElement;
  for (const l of legend) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '4px';
    div.style.justifyContent = 'justify-between';
    div.style.alignItems = 'center';
    const color = document.createElement('div');
    color.style.backgroundColor = l[1];
    color.style.width = '16px';
    color.style.height = '12px';
    div.appendChild(color);
    const text = document.createElement('span');
    text.innerText = l[0];
    div.appendChild(text);
    box.appendChild(div);
  }
}
