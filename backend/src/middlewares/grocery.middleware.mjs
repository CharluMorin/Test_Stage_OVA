const NAME_MAX_LENGTH = 100;

export function validateItem(req, res, next) {
  const { name, quantity, unit_price } = req.body ?? {};
  const messages = [];

  if (typeof name !== 'string' || name.trim() === '') {
    messages.push('Le nom de l\'article est requis');
  } else if (name.trim().length > NAME_MAX_LENGTH) {
    messages.push(`Le nom doit contenir ${NAME_MAX_LENGTH} caractères ou moins`);
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    messages.push('La quantité doit être un entier >= 1');
  }

  if (typeof unit_price !== 'number' || !Number.isFinite(unit_price) || unit_price <= 0) {
    messages.push('Le prix unitaire doit être un nombre plus grand que 0');
  }

  if (messages.length > 0) {
    const error = new Error(messages.join('\n'));
    error.statusCode = 400;
    return next(error);
  }

  req.body = { name: name.trim(), quantity, unit_price };
  next();
}

export function validateItemId(req, res, next) {
  const { id } = req.params;

  if (
    !id ||
    String(id).trim() === '' ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    const error = new Error('Identifiant d\'article invalide.');
    error.statusCode = 400;
    return next(error);
  }

  next();
}