export function notFound(req, res, next) {
  const error = new Error(`Route ${req.method} ${req.originalUrl} pas trouvée`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode ?? error.status ?? 500;
  let message = error.message;

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "JSON payload invalide";
  }

  if (statusCode === 500) {
    console.error(error);
    message = "Erreur interne du serveur";
  }

  return res.status(statusCode).json({
    status: statusCode,
    path: req.originalUrl,
    message,
    timestamp: new Date().toISOString(),
  });
}
