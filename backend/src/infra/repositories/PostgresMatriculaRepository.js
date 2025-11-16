// src/infra/repositories/PostgresMatriculaRepository.js
import { IMatriculaRepository } from "../../core/ports/IMatriculaRepository.js";
import { Matricula } from "../../core/domain/entities/Matricula.js";
import { query } from "../db/postgresClient.js";

export class PostgresMatriculaRepository extends IMatriculaRepository {
  /**
   * Lista matrículas por discente.
   * Se matriculaDiscente === "*" → lista todas.
   */
  async listarPorDiscente(matriculaDiscente) {
    let sql = `
      SELECT id, matricula_discente, codigo_disciplina, data_criacao
      FROM mini_arquitetura.matricula_simulada
    `;
    const params = [];

    if (matriculaDiscente && matriculaDiscente !== "*") {
      sql += ` WHERE matricula_discente = $1`;
      params.push(matriculaDiscente);
    }

    sql += ` ORDER BY data_criacao DESC;`;

    const result = await query(sql, params);

    return result.rows.map(
      (row) =>
        new Matricula({
          id: row.id,
          matriculaDiscente: row.matricula_discente,
          codigoDisciplina: row.codigo_disciplina,
          dataCriacao: row.data_criacao,
        })
    );
  }

  /**
   * Salva nova matrícula e decrementa vagas da disciplina no disciplina_cache.
   *
   * Tabelas:
   *  - mini_arquitetura.matricula_simulada:
   *      id, matricula_discente, codigo_disciplina, data_criacao
   *  - mini_arquitetura.disciplina_cache:
   *      id, nome, professor, vagas (ou vagas_disponiveis)
   */
  async salvar(matricula) {
    const codigoDisciplinaStr = String(matricula.codigoDisciplina);

    // 1) Inserir na tabela de matrículas
    const insertSql = `
      INSERT INTO mini_arquitetura.matricula_simulada
        (matricula_discente, codigo_disciplina)
      VALUES ($1, $2)
      RETURNING id, matricula_discente, codigo_disciplina, data_criacao;
    `;

    const insertResult = await query(insertSql, [
      matricula.matriculaDiscente,
      codigoDisciplinaStr,
    ]);

    const row = insertResult.rows[0];

    // 2) Atualizar disciplina_cache → diminuir 1 vaga
    //
    // Se no seu banco a coluna se chama "vagas_disponiveis",
    // troque "vagas" por "vagas_disponiveis" abaixo.
    const updateSql = `
      UPDATE mini_arquitetura.disciplina_cache
      SET vagas = vagas - 1
      WHERE id = $1 AND vagas > 0;
    `;
    const updateResult = await query(updateSql, [
      Number(matricula.codigoDisciplina),
    ]);

    if (updateResult.rowCount === 0) {
      console.warn(
        "[PostgresMatriculaRepository] Nenhuma vaga decrementada para disciplina",
        matricula.codigoDisciplina
      );
    }

    return new Matricula({
      id: row.id,
      matriculaDiscente: row.matricula_discente,
      codigoDisciplina: row.codigo_disciplina,
      dataCriacao: row.data_criacao,
    });
  }

  /**
   * Remove matrícula e devolve a vaga para a disciplina.
   */
  async remover(id) {
    const numericId = Number(id);

    // 1) Descobrir qual disciplina estava matriculada
    const selectSql = `
      SELECT codigo_disciplina
      FROM mini_arquitetura.matricula_simulada
      WHERE id = $1;
    `;
    const selectResult = await query(selectSql, [numericId]);
    const codigoDisciplina = selectResult.rows[0]?.codigo_disciplina;

    // 2) Remover matrícula
    const deleteSql = `
      DELETE FROM mini_arquitetura.matricula_simulada
      WHERE id = $1;
    `;
    await query(deleteSql, [numericId]);

    // 3) Se encontrou disciplina, devolve 1 vaga no disciplina_cache
    if (codigoDisciplina) {
      const updateSql = `
        UPDATE mini_Arquitetura.disciplina_cache
        SET vagas = vagas + 1
        WHERE id = $1;
      `;
      await query(updateSql, [Number(codigoDisciplina)]);
    }
  }
}
