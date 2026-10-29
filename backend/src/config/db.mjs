import Database from 'better-sqlite3';
import fs from 'node:fs';

fs.mkdirSync('data', { recursive: true });

const db = new Database('data/grocery.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS grocery (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL CHECK (length(trim(name)) > 0),
    quantity   INTEGER NOT NULL CHECK (quantity >= 1),
    unit_price REAL    NOT NULL CHECK (unit_price > 0)
  )
`);

export default db;