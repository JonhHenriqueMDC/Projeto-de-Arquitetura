// src/infra/services/AlunoService.js
import { query } from "../db/postgresClient.js";
import { env } from "../../config/env.js";

export class AlunoService {
  // Mantém assinatura esperada pelo container, mas não usamos o apiClient aqui
  constructor(_alunoApiClient) {
    this._alunoApiClient = _alunoApiClient;

    this.cache = new Map(); // chave: id (string) → aluno
    this.cacheCarregadoDoBanco = false;
    this.ultimoSync = null; // Date
  }

  /* ===================== CACHE / BANCO ===================== */

  async carregarCacheDoBanco() {
    const sql = `
      SELECT id, nome, curso, modalidade, status
      FROM mini_arquitetura.aluno_cache
    `;
    const result = await query(sql);

    this.cache.clear();
    for (const row of result.rows) {
      const aluno = {
        id: row.id,
        nome: row.nome,
        curso: row.curso,
        modalidade: row.modalidade,
        status: row.status,
      };
      this.cache.set(String(aluno.id), aluno);
    }

    this.cacheCarregadoDoBanco = true;
    console.log("[AlunoService] Cache carregado do banco. Total:", this.cache.size);
  }

  async salvarOuAtualizarNoBanco(aluno) {
    const sql = `
      INSERT INTO mini_arquitetura.aluno_cache (id, nome, curso, modalidade, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE
      SET nome = EXCLUDED.nome,
          curso = EXCLUDED.curso,
          modalidade = EXCLUDED.modalidade,
          status = EXCLUDED.status
    `;
    const params = [
      aluno.id,
      aluno.nome,
      aluno.curso ?? null,
      aluno.modalidade ?? null,
      aluno.status ?? null,
    ];

    await query(sql, params);
  }

  /* ===================== CHAMADA EXTERNA ===================== */

  async buscarTodosNaApiExterna() {
    const url = env.ALUNO_API_BASE_URL;
    console.log("[AlunoService] Chamando API externa msAluno:", url);

    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`Serviço externo msAluno retornou status ${resp.status}`);
    }

    const data = await resp.json();

    if (!Array.isArray(data)) {
      throw new Error("Resposta inesperada de msAluno (esperado array).");
    }

    return data;
  }

  async sincronizarComServicoExterno() {
    console.log("[AlunoService] Sincronizando discentes do serviço externo...");

    const lista = await this.buscarTodosNaApiExterna();

    for (const item of lista) {
      const aluno = {
        id: item.id,
        nome: item.nome,
        curso: item.curso,
        modalidade: item.modalidade,
        status: item.status,
      };

      await this.salvarOuAtualizarNoBanco(aluno);
      this.cache.set(String(aluno.id), aluno);
    }

    this.cacheCarregadoDoBanco = true;
    this.ultimoSync = new Date();

    console.log(
      "[AlunoService] Sincronização concluída. Total em cache:",
      this.cache.size,
      "| ultimoSync:",
      this.ultimoSync.toISOString()
    );
  }

  async garantirCache() {
    // 1) tenta carregar do banco se ainda não carregou
    if (!this.cacheCarregadoDoBanco) {
      try {
        await this.carregarCacheDoBanco();
      } catch (err) {
        console.error(
          "[AlunoService] Erro ao carregar cache do banco:",
          err.message || err
        );
      }
    }

    // 2) se ainda não tem nada, tenta sincronizar uma vez
    if (!this.cacheCarregadoDoBanco || this.cache.size === 0) {
      await this.sincronizarComServicoExterno();
    }
  }

  /* ===================== THROTTLE 10 MIN ===================== */

  /**
   * Sincroniza com msAluno **no máximo a cada 10 minutos**.
   * - Se for chamado antes disso → NÃO chama msAluno, só retorna info.
   * - Se for depois disso → chama msAluno, atualiza cache e retorna info.
   */
  async sincronizarDiscentes(force = false) {
    const agora = new Date();
    const DEZ_MINUTOS_MS = 10 * 60 * 1000;

    if (!force && this.ultimoSync && agora - this.ultimoSync < DEZ_MINUTOS_MS) {
      console.log("[AlunoService] Sync ignorado (menos de 10 min do último).", {
        ultimoSync: this.ultimoSync.toISOString(),
        totalCache: this.cache.size,
      });

      return {
        pulou: true,
        ultimoSync: this.ultimoSync,
        totalCache: this.cache.size,
      };
    }

    // Aqui sim vai bater na API externa e atualizar o cache
    await this.sincronizarComServicoExterno();

    return {
      pulou: false,
      ultimoSync: this.ultimoSync,
      totalCache: this.cache.size,
    };
  }

  /* ===================== MÉTODOS USADOS PELOS USE CASES ===================== */

  // usado em ConsultarDiscenteUseCase
  async buscarPorMatricula(idOuMatricula) {
    const chave = String(idOuMatricula);

    try {
      await this.garantirCache();
    } catch (err) {
      console.error(
        "[AlunoService] Erro ao garantir cache:",
        err.message || err
      );
      throw new Error(
        "Falha ao consultar serviço de aluno e nenhum cache disponível."
      );
    }

    let aluno = this.cache.get(chave);

    // Se não achou no cache, tenta uma sincronização completa (caso especial)
    if (!aluno) {
      console.log(
        `[AlunoService] Discente ${chave} não está no cache, tentando nova sincronização completa...`
      );
      try {
        await this.sincronizarComServicoExterno();
        aluno = this.cache.get(chave);
      } catch (err) {
        console.error(
          "[AlunoService] Erro ao sincronizar após não encontrar discente:",
          err.message || err
        );
      }
    }

    if (!aluno) {
      const error = new Error("Discente não encontrado.");
      error.codigo = "NOT_FOUND";
      throw error;
    }

    return aluno;
  }

  // usado pelo botão "listar alunos"
  async listarTodosLocal() {
    const sql = `
      SELECT id, nome, curso, modalidade, status
      FROM mini_arquitetura.aluno_cache
      ORDER BY id
    `;
    const result = await query(sql);
    return result.rows;
  }
}
