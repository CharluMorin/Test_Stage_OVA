import {
  findAllItems,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems,
} from "../models/grocery.model.mjs";

function response(req, status, message, data) {
  const response = {
    status,
    path: req.originalUrl,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== undefined) response.data = data;

  return response;
}

export async function getAllItems(req, res, next) {
  try {
    const items = await findAllItems();

    res.location("/grocery");
    return res
      .status(200)
      .json(
        response(req, 200, "Liste des articles récupérée avec succès", items),
      );
  } catch (err) {
    next(err);
  }
}

export async function addItem(req, res, next) {
  const { name, quantity, unit_price } = req.body;

  try {
    const item = await createItem({ name, quantity, unit_price });

    res.location(`/grocery/${item.id}`);
    return res
      .status(201)
      .json(response(req, 201, "Item ajouté avec succès", item));
  } catch (err) {
    next(err);
  }
}

export async function modifyItem(req, res, next) {
  const id = Number(req.params.id);
  const { name, quantity, unit_price } = req.body;

  try {
    const item = await updateItem(id, { name, quantity, unit_price });

    if (!item) {
      const error = new Error("Article non trouvé");
      error.statusCode = 404;
      return next(error);
    }

    res.location(`/grocery/${id}`);
    return res
      .status(200)
      .json(response(req, 200, "Article mis à jour avec succès", item));
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  const id = Number(req.params.id);

  try {
    const deleted = await deleteItem(id);

    if (!deleted) {
      const error = new Error("Article non trouvé");
      error.statusCode = 404;
      return next(error);
    }

    res.location("/grocerylist");
    return res
      .status(200)
      .json(response(req, 200, "Article supprimé avec succès"));
  } catch (err) {
    next(err);
  }
}

export async function removeAllItems(req, res, next) {
  try {
    await deleteAllItems();

    res.location("/grocery_list");
    return res
      .status(200)
      .json(response(req, 200, "Liste des articles vidée avec succès"));
  } catch (err) {
    next(err);
  }
}
