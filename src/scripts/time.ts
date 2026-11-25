export function getUTCTime(): string {
  const utcTime = new Date().toISOString().slice(11, 16);
  return utcTime;
}

export function getLocalTime(): string {
  const localTime = new Date().toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return localTime;
}
