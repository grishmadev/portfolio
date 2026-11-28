// time is in milliseconds
export function processDuration(time: number): string {
  if (time > 1000) return (time / 1000).toFixed(2) + 's';
  else return time + 'ms';
}

export function processSize(bytes: number): string {
  let size: string;
  let one_mb = 1024 * 1024;
  if (bytes > one_mb) size = (bytes / one_mb).toFixed(2) + 'MB';
  else if (bytes > 1024) size = (bytes / 1024).toFixed(2) + 'KB';
  else size = bytes + 'Bytes';
  return size;
}

const VISITOR_KEY = 'portfolio_visitor_id';

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }

  return id;
}
