import {
  findAllItems,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems,
} from "../models/grocery.model.mjs";

function buildResponse(req, status, message, data) {
  const body = {
    status,
    path: req.originalUrl,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== undefined) body.data = data;

  return body;
}

function notFoundError() {
  const error = new Error("Article non trouvé");
  error.statusCode = 404;
  return error;
}

export function getAllItems(req, res) {
  const items = findAllItems();

  res
    .status(200)
    .json(buildResponse(req, 200, "Liste des articles récupérée avec succès", items));
}

export function addItem(req, res) {
  const { name, quantity, unit_price } = req.body;
  const item = createItem({ name, quantity, unit_price });

  res
    .status(201)
    .location(`/grocery/${item.id}`)
    .json(buildResponse(req, 201, "Article ajouté avec succès", item));
}

export function modifyItem(req, res, next) {
  const id = Number(req.params.id);
  const { name, quantity, unit_price } = req.body;
  const item = updateItem(id, { name, quantity, unit_price });

  if (!item) return next(notFoundError());

  res
    .status(200)
    .json(buildResponse(req, 200, "Article mis à jour avec succès", item));
}

export function removeItem(req, res, next) {
  const id = Number(req.params.id);

  if (!deleteItem(id)) return next(notFoundError());

  res.status(200).json(buildResponse(req, 200, "Article supprimé avec succès"));
}

export function removeAllItems(req, res) {
  deleteAllItems();

  res
    .status(200)
    .json(buildResponse(req, 200, "Liste des articles vidée avec succès"));
}