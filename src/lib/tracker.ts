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
