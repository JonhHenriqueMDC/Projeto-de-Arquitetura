// src/infra/db/postgresClient.js
import pg from "pg";
import { env } from "../../config/env.js";

const { Pool } = pg;

// Define SSL: em produção ou se DB_SSL = "true"
const ssl =
  env.NODE_ENV === "production" || env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : false;

if (!env.DATABASE_URL) {
  console.warn(
    "[WARN] DATABASE_URL/DB_URL não definida. " +
      "O Pool tentará usar configuração padrão (localhost:5432)."
  );
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl,
});

pool.on("connect", () => {
  console.log("[INFO] Conectado ao banco de dados");
});

pool.on("error", (err) => {
  console.error("[ERRO] Erro no pool do Postgres:", err);
});

export async function query(text, params) {
  const inicio = Date.now();
  const res = await pool.query(text, params);
  const duracao = Date.now() - inicio;

  return res;
}

export { pool };
