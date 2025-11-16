// src/infra/repositories/PostgresReservaRepository.js
import { IReservaRepository } from "../../core/ports/IReservaRepository.js";
import { Reserva } from "../../core/domain/entities/Reserva.js";
import { query } from "../db/postgresClient.js";

export class PostgresReservaRepository extends IReservaRepository {
  /**
   * Lista reservas por discente.
   * Se matriculaDiscente === "*" → lista todas.
   */
  async listarPorDiscente(matriculaDiscente) {
    let sql = `
      SELECT id, matricula_discente, codigo_livro, data_criacao
      FROM mini_arquitetura.reserva_simulada
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
        new Reserva({
          id: row.id,
          matriculaDiscente: row.matricula_discente,
          codigoLivro: row.codigo_livro,
          dataCriacao: row.data_criacao,
        })
    );
  }

  /**
   * Salva uma nova reserva e marca o livro como Indisponível no cache.
   *
   * Tabela reserva_simulada:
   *   id, matricula_discente, codigo_livro, data_criacao
   *
   * Tabela livro_cache:
   *   id, titulo, autor, ano, status
   */
  async salvar(reserva) {
    // 1) Inserir na tabela de reservas
    const insertSql = `
      INSERT INTO mini_arquitetura.reserva_simulada
        (matricula_discente, codigo_livro)
      VALUES ($1, $2)
      RETURNING id, matricula_discente, codigo_livro, data_criacao;
    `;

    const codigoLivroStr = String(reserva.codigoLivro);

    const insertResult = await query(insertSql, [
      reserva.matriculaDiscente,
      codigoLivroStr,
    ]);

    const row = insertResult.rows[0];

    // 2) Atualizar livro_cache → status = 'Indisponível'
    const updateSql = `
      UPDATE mini_arquitetura.livro_cache
      SET status = 'Indisponível'
      WHERE id = $1;
    `;
    const updateResult = await query(updateSql, [Number(reserva.codigoLivro)]);

    // (opcional, mas ajuda a detectar erro de id)
    if (updateResult.rowCount === 0) {
      console.warn(
        "[PostgresReservaRepository] Nenhum livro atualizado para id",
        reserva.codigoLivro
      );
    }

    // 3) Retorna a reserva criada
    return new Reserva({
      id: row.id,
      matriculaDiscente: row.matricula_discente,
      codigoLivro: row.codigo_livro,
      dataCriacao: row.data_criacao,
    });
  }

  /**
   * Remove a reserva e volta o livro para 'Disponível'.
   */
  async remover(id) {
    const numericId = Number(id);

    // Buscar o código do livro antes de apagar
    const selectSql = `
      SELECT codigo_livro
      FROM mini_arquitetura.reserva_simulada
      WHERE id = $1;
    `;
    const selectResult = await query(selectSql, [numericId]);
    const codigoLivro = selectResult.rows[0]?.codigo_livro;

    // Remover a reserva
    const deleteSql = `
      DELETE FROM mini_arquitetura.reserva_simulada
      WHERE id = $1;
    `;
    await query(deleteSql, [numericId]);

    // Se achou o livro, marcar como Disponível de novo
    if (codigoLivro) {
      const updateSql = `
        UPDATE mini_arquitetura.livro_cache
        SET status = 'Disponível'
        WHERE id = $1;
      `;
      await query(updateSql, [Number(codigoLivro)]);
    }
  }
}
