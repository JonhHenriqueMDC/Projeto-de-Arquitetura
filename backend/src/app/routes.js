// src/app/routes.js
import { Router } from "express";

export const routes = Router();

// ========= DISCENTES =========

// Buscar discente por ID
routes.get("/discentes/:id", async (req, res) => {
  try {
    const { discenteController } = req.container;
    await discenteController.getDiscente(req, res);
  } catch (error) {
    console.error("Erro na rota de discente:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Listar todos os discentes do cache local
routes.get("/discentes", async (req, res) => {
  try {
    const { discenteController } = req.container;
    await discenteController.listarTodos(req, res);
  } catch (error) {
    console.error("Erro na rota de listar discentes:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Sincronizar discentes com a API externa msAluno
routes.post("/discentes/sincronizar", async (req, res) => {
  try {
    const { discenteController } = req.container;
    console.log("[ROTAS] Chamando discenteController.sincronizar()");
    await discenteController.sincronizar(req, res);
  } catch (error) {
    console.error("Erro na rota de sincronização de discentes:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// ========= DISCIPLINAS =========

routes.get("/disciplinas", (req, res) => {
  const { disciplinaController } = req.container;
  return disciplinaController.listarDisciplinas(req, res);
});

// ========= LIVROS / BIBLIOTECA =========

routes.get("/livros", (req, res) => {
  const { bibliotecaController } = req.container;
  return bibliotecaController.listarLivros(req, res);
});

// ========= SIMULAÇÕES =========

// Simular nova matrícula
routes.post("/simulacoes/matriculas", async (req, res, next) => {
  try {
    const { simulacaoController } = req.container;
    await simulacaoController.criarMatricula(req, res, next);
  } catch (error) {
    console.error("Erro ao criar matrícula:", error);
    next(error);
  }
});

// Cancelar matrícula simulada
routes.delete("/simulacoes/matriculas/:id", async (req, res, next) => {
  try {
    const { simulacaoController } = req.container;
    await simulacaoController.cancelarMatricula(req, res, next);
  } catch (error) {
    console.error("Erro ao cancelar matrícula:", error);
    next(error);
  }
});

// Simular nova reserva de livro
routes.post("/simulacoes/reservas", async (req, res, next) => {
  try {
    const { simulacaoController } = req.container;
    await simulacaoController.criarReserva(req, res, next);
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    next(error);
  }
});

// Cancelar reserva simulada
routes.delete("/simulacoes/reservas/:id", async (req, res, next) => {
  try {
    const { simulacaoController } = req.container;
    await simulacaoController.cancelarReserva(req, res, next);
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    next(error);
  }
});

// Obter estado atual das simulações (lista de matrículas e reservas)
routes.get("/simulacoes/estado", async (req, res, next) => {
  try {
    const { simulacaoController } = req.container;
    await simulacaoController.getEstado(req, res, next);
  } catch (error) {
    console.error("Erro ao obter estado:", error);
    next(error);
  }
});
