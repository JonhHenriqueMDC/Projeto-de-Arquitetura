// src/adapters/controllers/DiscenteController.js
export class DiscenteController {
  constructor(consultarDiscenteUseCase, alunoService) {
    this.consultarDiscenteUseCase = consultarDiscenteUseCase;
    this.alunoService = alunoService;
  }

  async getDiscente(req, res) {
    const { id } = req.params;

    try {
      const discente = await this.consultarDiscenteUseCase.execute(id);
      return res.status(200).json(discente);
    } catch (err) {
      console.error("Erro ao buscar discente:", err);

      if (err.codigo === "NOT_FOUND") {
        return res.status(404).json({ erro: "Discente não encontrado." });
      }

      if (
        err.message ===
        "Falha ao consultar serviço de aluno e nenhum cache disponível."
      ) {
        return res.status(503).json({
          erro:
            "Serviço de alunos indisponível e nenhum dado local encontrado.",
        });
      }

      return res
        .status(500)
        .json({ erro: "Erro ao buscar discente. Tente novamente." });
    }
  }

  // GET /api/discentes  (lista todos do cache local)
  async listarTodos(req, res) {
    try {
      const alunos = await this.alunoService.listarTodosLocal();
      return res.status(200).json(alunos);
    } catch (err) {
      console.error("Erro ao listar discentes:", err);
      return res
        .status(500)
        .json({ erro: "Erro ao listar discentes a partir do cache local." });
    }
  }

  // POST /api/discentes/sincronizar
  async sincronizar(req, res) {
    try {
      console.log("[DiscenteController] Iniciando sincronização de discentes...");

      // se quiser forçar ignorando os 10 min, dá pra mandar ?force=true
      const force = req.query.force === "true";

      const info = await this.alunoService.sincronizarDiscentes(force);

      const mensagem = info.pulou
        ? "Sincronização ignorada (já foi feita há menos de 10 minutos)."
        : "Discentes sincronizados com sucesso.";

      return res.status(200).json({
        mensagem,
        ultimoSync: info.ultimoSync,
        totalCache: info.totalCache,
        pulou: info.pulou,
      });
    } catch (err) {
      console.error("Erro ao sincronizar discentes:", err);
      return res
        .status(500)
        .json({ erro: "Erro ao sincronizar discentes com msAluno." });
    }
  }
}
