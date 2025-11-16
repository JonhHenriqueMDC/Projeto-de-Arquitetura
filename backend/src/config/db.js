
import pkg from "pg";
import { env } from "./env.js";
import { logger } from "../shared/logging/logger.js";

const { Pool } = pkg;

if (!env.DATABASE_URL) {
  logger.warn(
    "DATABASE_URL/DB_URL não está configurado. Recursos que dependem do banco podem falhar."
  );
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
});

pool.on("connect", () => {
  logger.info("Conectado ao banco de dados");
});

pool.on("error", (err) => {
  logger.error("Erro na conexão com o banco de dados:", err);
});
