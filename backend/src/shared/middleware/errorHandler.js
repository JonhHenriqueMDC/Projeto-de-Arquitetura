
import { logger } from "../logging/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error("Erro não tratado:", err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Ocorreu um erro interno inesperado. Tente novamente mais tarde.";

  res.status(statusCode).json({
    erro: message
  });
}
