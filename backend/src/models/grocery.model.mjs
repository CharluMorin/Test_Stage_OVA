import db from "../config/db.mjs";

export function findAllItems() {
  const query = `SELECT * FROM grocery`;

  return db.prepare(query).all();
}

export function findItemById(id) {
  const query = `SELECT * FROM grocery
    WHERE id = ?`;

  return db.prepare(query).get(id) ?? null;
}

export function createItem(item) {
  const { name, quantity, unit_price } = item;

  const query = `INSERT INTO grocery (name, quantity, unit_price)
    VALUES (?, ?, ?)
    RETURNING *`;

  return db.prepare(query).get(name, quantity, unit_price);
}

export function updateItem(id, item) {
  const { name, quantity, unit_price } = item;

  const query = `UPDATE grocery
    SET
      name = ?,
      quantity = ?,
      unit_price = ?
    WHERE id = ?
    RETURNING *`;

  return db.prepare(query).get(name, quantity, unit_price, id) ?? null;
}

export function deleteItem(id) {
  const query = `
    DELETE FROM grocery
    WHERE id = ?
  `;

  return db.prepare(query).run(id).changes > 0;
}

export function deleteAllItems() {
  db.prepare("DELETE FROM grocery").run();
}
