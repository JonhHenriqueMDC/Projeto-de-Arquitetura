// src/app/server.js
import express from "express";
import cors from "cors";

import { routes } from "./routes.js";
import { requestLogger } from "../shared/middleware/requestLogger.js";
import { errorHandler } from "../shared/middleware/errorHandler.js";
import { construirContainer } from "../config/container.js";

const app = express();
const container = construirContainer();

// CORS – libera o front (Vite)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Se quiser em dev pode ser só: app.use(cors());

app.use(express.json());

// injeta container (DIP bonitão)
app.use((req, res, next) => {
  req.container = container;
  next();
});

// logger próprio da aplicação
app.use(requestLogger);

// prefixo /api para todas as rotas
app.use("/api", routes);

// preflight para CORS
app.options("*", cors());

// middleware global de erro
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API Biblioteca rodando em http://localhost:${PORT}`);
});
