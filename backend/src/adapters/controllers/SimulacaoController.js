// src/adapters/controllers/SimulacaoController.js

export class SimulacaoController {
  constructor(
    matricularDisciplinaUseCase,
    cancelarMatriculaUseCase,
    reservarLivroUseCase,
    cancelarReservaUseCase
  ) {
    this.matricularDisciplinaUseCase = matricularDisciplinaUseCase;
    this.cancelarMatriculaUseCase = cancelarMatriculaUseCase;
    this.reservarLivroUseCase = reservarLivroUseCase;
    this.cancelarReservaUseCase = cancelarReservaUseCase;
  }

  /* ======================================================
   * ALIASES para compatibilizar com as rotas:
   * - criarMatricula   -> usa this.matricular
   * - criarReserva     -> usa this.reservar
   * - getEstado        -> retorno simples por enquanto
   * ===================================================== */

  async criarMatricula(req, res, next) {
    return this.matricular(req, res, next);
  }

  async criarReserva(req, res, next) {
    return this.reservar(req, res, next);
  }

  async getEstado(req, res, next) {
    try {
      // Aqui podemos melhorar depois para realmente listar
      // as matrículas/reservas dos repositórios.
      return res.json({
        mensagem:
          "Endpoint de estado de simulações ainda não foi totalmente implementado.",
        matriculas: [],
        reservas: [],
      });
    } catch (error) {
      console.error("[SimulacaoController] Erro em getEstado:", error);
      if (next) return next(error);
      return res
        .status(500)
        .json({ erro: "Erro ao obter estado das simulações." });
    }
  }

  /* ======================================================
   * MÉTODOS PRINCIPAIS
   * ===================================================== */

  async matricular(req, res, next) {
    try {
      const { idDiscente, idDisciplina } = req.body;

      if (!idDiscente || !idDisciplina) {
        return res.status(400).json({
          erro: "idDiscente e idDisciplina são obrigatórios.",
        });
      }

      const resultado = await this.matricularDisciplinaUseCase.execute({
        idDiscente,
        idDisciplina,
      });

      return res.status(201).json({
        mensagem: "Matrícula criada com sucesso!",
        matricula: resultado,
      });
    } catch (error) {
      console.error("[SimulacaoController] Erro ao matricular:", error);
      if (next) return next(error);
      return res.status(500).json({ erro: "Erro ao criar matrícula." });
    }
  }

  async cancelarMatricula(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await this.cancelarMatriculaUseCase.execute(id);

      return res.json({
        mensagem: "Matrícula cancelada com sucesso.",
        resultado,
      });
    } catch (error) {
      console.error("[SimulacaoController] Erro ao cancelar matrícula:", error);
      if (next) return next(error);
      return res.status(500).json({ erro: "Erro ao cancelar matrícula." });
    }
  }

  async reservar(req, res, next) {
    try {
      const { idDiscente, idLivro } = req.body;

      if (!idDiscente || !idLivro) {
        return res.status(400).json({
          erro: "idDiscente e idLivro são obrigatórios.",
        });
      }

      const resultado = await this.reservarLivroUseCase.execute({
        matriculaDiscente: idDiscente,
        codigoLivro: idLivro,
      });

      return res.status(201).json({
        mensagem: "Reserva criada com sucesso!",
        reserva: resultado,
      });
    } catch (error) {
      console.error("[SimulacaoController] Erro ao reservar livro:", error);
      if (next) return next(error);
      return res.status(500).json({ erro: "Erro ao criar reserva." });
    }
  }

  async cancelarReserva(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await this.cancelarReservaUseCase.execute(id);

      return res.json({
        mensagem: "Reserva cancelada com sucesso.",
        resultado,
      });
    } catch (error) {
      console.error("[SimulacaoController] Erro ao cancelar reserva:", error);
      if (next) return next(error);
      return res.status(500).json({ erro: "Erro ao cancelar reserva." });
    }
  }
}
