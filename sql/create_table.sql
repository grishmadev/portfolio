CREATE TABLE IF NOT EXISTS viewer_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  city TEXT,
  region TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  colo TEXT
);

CREATE INDEX IF NOT EXISTS idx_viewer_locations_id ON viewer_locations (id DESC);
