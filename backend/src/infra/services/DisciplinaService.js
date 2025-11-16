// src/infra/services/DisciplinaService.js
import { IDisciplinaService } from "../../core/ports/IDisciplinaService.js";
import { Disciplina } from "../../core/domain/entities/Disciplina.js";
import { DisciplinaCacheRepository } from "../repositories/DisciplinaCacheRepository.js";

export class DisciplinaService extends IDisciplinaService {
  constructor(disciplinaApiClient) {
    super();

    this.disciplinaApiClient = disciplinaApiClient;
    this.baseUrl = disciplinaApiClient?.baseUrl;

    // Fonte de verdade: disciplina_cache no banco
    this.cacheRepo = new DisciplinaCacheRepository();
  }

  /* ========== Helpers de banco / API ========== */

  // Lê todas as disciplinas do banco (disciplina_cache)
  async carregarDoBanco() {
    const rows = await this.cacheRepo.findAll();

    return rows.map(
      (row) =>
        new Disciplina({
          id: row.id,
          nome: row.nome,
          curso: row.curso,
          vagas: row.vagas,
        })
    );
  }

  /**
   * Usa a API externa para popular/atualizar o banco.
   * Depois disso, o consumo normal é sempre via banco.
   */
  async sincronizarComServicoExterno() {
    if (!this.baseUrl) {
      throw new Error("Base URL do serviço de disciplinas não configurada.");
    }

    console.log(
      "[DisciplinaService] Sincronizando disciplinas do serviço externo..."
    );

    const resp = await fetch(this.baseUrl);
    if (!resp.ok) {
      throw new Error(
        `Serviço de disciplinas retornou status ${resp.status}`
      );
    }

    const data = await resp.json();
    const listaBruta = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
      ? data.items
      : [];

    console.log(
      `[DisciplinaService] API retornou ${listaBruta.length} disciplinas`
    );

    const disciplinas = listaBruta.map(
      (item) =>
        new Disciplina({
          id: item.id,
          nome: item.nome,
          curso: item.curso,
          vagas: item.vagas ?? 0,
        })
    );

    // Grava/atualiza no disciplina_cache
    await this.cacheRepo.saveOrUpdateMany(
      disciplinas.map((d) => ({
        id: d.id,
        nome: d.nome,
        curso: d.curso,
        vagas: d.vagas,
      }))
    );

    console.log("[DisciplinaService] Sincronização concluída.");

    // Depois da sync, sempre usar o banco
    return this.carregarDoBanco();
  }

  /* ========== Métodos da interface ========== */

  async listarTodas() {
    // 1) tenta ler do banco
    const doBanco = await this.carregarDoBanco();

    // se já tem coisa no banco, usa só ele
    if (doBanco.length > 0) {
      return doBanco;
    }

    // 2) se o banco estiver vazio, popular com a API
    return this.sincronizarComServicoExterno();
  }

  async buscarPorCodigo(idDisciplina) {
    const id = Number(idDisciplina);

    // lê do banco primeiro
    let disciplinas = await this.carregarDoBanco();

    // se o banco estiver vazio (primeira vez), sincroniza com API
    if (disciplinas.length === 0) {
      disciplinas = await this.sincronizarComServicoExterno();
    }

    const encontrada = disciplinas.find((d) => d.id === id);
    if (!encontrada) {
      throw new Error("Disciplina não encontrada.");
    }
    return encontrada;
  }
}
