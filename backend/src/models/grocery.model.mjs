import db from '../config/db.mjs';

export async function findAllItems() {
  const query = 
  `SELECT * FROM grocery`;

  return db.prepare(query).all();
}

export async function findItemById(id) {
  const query = 
  `SELECT * FROM grocery
    WHERE id = ?`;

  return db.prepare(query).get(id) ?? null;
}

export async function createItem(item) {
  const { name, quantity, unit_price } = item;

  const query = 
  `INSERT INTO grocery (name, quantity, unit_price)
    VALUES (?, ?, ?)
    RETURNING *`;

  return db.prepare(query).get(name, quantity, unit_price);
}

export async function updateItem(id, item) {
  const { name, quantity, unit_price } = item;

  const query = 
  `UPDATE grocery
    SET
      name = ?,
      quantity = ?,
      unit_price = ?
    WHERE id = ?
    RETURNING *`;

  return db.prepare(query).get(name, quantity, unit_price, id) ?? null;
}

export async function deleteItem(id) {
  const query = `
    DELETE FROM grocery
    WHERE id = ?
  `;

  return db.prepare(query).run(id).changes > 0;
}

export async function deleteAllItems() {
  db.prepare('DELETE FROM grocery').run();
}