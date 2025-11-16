// src/config/env.js
import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  DATABASE_URL: process.env.DATABASE_URL ?? process.env.DB_URL,

  DB_SSL: process.env.DB_SSL,

  ALUNO_API_BASE_URL: process.env.ALUNO_API_BASE_URL,
  DISCIPLINA_API_BASE_URL: process.env.DISCIPLINA_API_BASE_URL,
  BIBLIOTECA_API_BASE_URL: process.env.BIBLIOTECA_API_BASE_URL,
};
