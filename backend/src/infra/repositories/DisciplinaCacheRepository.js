// src/infra/repositories/DisciplinaCacheRepository.js
import { query } from "../db/postgresClient.js";

export class DisciplinaCacheRepository {
  /**
   * Busca todas as disciplinas do cache (banco).
   * Esta é a fonte de verdade para vagas.
   */
  async findAll() {
    const sql = `
      SELECT id, nome, curso, vagas
      FROM mini_arquitetura.disciplina_cache
      ORDER BY id;
    `;
    const result = await query(sql);
    return result.rows;
  }

  /**
   * Salva ou atualiza várias disciplinas no cache.
   * Usado quando você sincroniza com a API externa.
   */
  async saveOrUpdateMany(disciplinas) {
    const sql = `
      INSERT INTO mini_arquitetura.disciplina_cache (id, nome, curso, vagas)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        nome  = EXCLUDED.nome,
        curso = EXCLUDED.curso,
        vagas = EXCLUDED.vagas;
    `;

    for (const d of disciplinas) {
      await query(sql, [
        Number(d.id),
        d.nome,
        d.curso,
        d.vagas,
      ]);
    }
  }
}
