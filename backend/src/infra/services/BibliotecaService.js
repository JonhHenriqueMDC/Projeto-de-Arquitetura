// src/infra/services/BibliotecaService.js
import { IBibliotecaService } from "../../core/ports/IBibliotecaService.js";
import { Livro } from "../../core/domain/entities/Livro.js";
import { LivroCacheRepository } from "../repositories/LivroCacheRepository.js";

export class BibliotecaService extends IBibliotecaService {
  constructor(bibliotecaApiClient) {
    super();

    this.bibliotecaApiClient = bibliotecaApiClient;
    this.baseUrl = bibliotecaApiClient?.baseUrl;

    // Agora só usamos o banco como fonte de verdade
    this.cacheRepo = new LivroCacheRepository();
  }

  /* ================= Helpers de banco/API ================= */

  // Lê todos os livros do banco (livro_cache)
  async carregarDoBanco() {
    const rows = await this.cacheRepo.findAll();

    return rows.map(
      (row) =>
        new Livro({
          id: row.id,
          titulo: row.titulo,
          autor: row.autor,
          ano: row.ano,
          status: row.status,
        })
    );
  }

  /**
   * Sincroniza com o serviço externo APENAS para popular/atualizar o banco.
   * Nunca usamos a API como fonte de verdade para o status.
   */
  async sincronizarComServicoExterno() {
    if (!this.baseUrl) {
      throw new Error("Base URL do serviço de biblioteca não configurada.");
    }

    console.log(
      "[BibliotecaService] Sincronizando livros do serviço externo..."
    );

    const resp = await fetch(this.baseUrl);
    if (!resp.ok) {
      throw new Error(
        `Serviço de biblioteca retornou status ${resp.status}`
      );
    }

    const data = await resp.json();
    const listaBruta = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
      ? data.items
      : [];

    console.log(
      `[BibliotecaService] API retornou ${listaBruta.length} livros`
    );

    const livros = listaBruta.map(
      (item) =>
        new Livro({
          id: item.id,
          titulo: item.titulo,
          autor: item.autor,
          ano: item.ano ? Number(item.ano) : null,
          // status da API só serve como valor inicial
          status: item.status ?? "Disponível",
        })
    );

    // Grava/atualiza no banco
    await this.cacheRepo.saveOrUpdateMany(
      livros.map((l) => ({
        id: l.id,
        titulo: l.titulo,
        autor: l.autor,
        ano: l.ano,
        status: l.status,
      }))
    );

    console.log("[BibliotecaService] Sincronização concluída.");

    // Depois de sincronizar, sempre usamos o banco
    return this.carregarDoBanco();
  }

  /* ================= Métodos da interface ================= */

  async listarLivros() {
    // 1) Sempre tenta ler do banco primeiro
    const doBanco = await this.carregarDoBanco();

    if (doBanco.length > 0) {
      // aqui o status é SEMPRE o status do banco (Disponível/Indisponível)
      return doBanco;
    }

    // 2) Se o banco estiver vazio, sincroniza com a API externa
    return this.sincronizarComServicoExterno();
  }

  async buscarPorCodigo(idLivro) {
    const id = Number(idLivro);

    // Lê direto do banco também
    let livros = await this.carregarDoBanco();

    // Se por algum motivo ainda não houver nada no banco, sincroniza
    if (livros.length === 0) {
      livros = await this.sincronizarComServicoExterno();
    }

    const encontrado = livros.find((l) => l.id === id);

    if (!encontrado) {
      throw new Error("Livro não encontrado.");
    }

    return encontrado;
  }
}
