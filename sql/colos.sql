CREATE TABLE IF NOT EXISTS colos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  iata TEXT UNIQUE NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  city text,
  region text,
  cca2 TEXT
);

CREATE INDEX IF NOT EXISTS iata_colos_index ON colos (iata);
