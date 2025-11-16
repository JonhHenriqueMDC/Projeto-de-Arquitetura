// src/infra/repositories/AlunoCacheRepository.js
import { pool } from "../../config/db.js";

export class AlunoCacheRepository {
  async findById(id) {
    const result = await pool.query(
      `SELECT id, nome, curso, modalidade, status
       FROM mini_arquitetura.aluno_cache
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async saveOrUpdate(aluno) {
    await pool.query(
      `INSERT INTO mini_arquitetura.aluno_cache (id, nome, curso, modalidade, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id)
       DO UPDATE SET nome = EXCLUDED.nome,
                     curso = EXCLUDED.curso,
                     modalidade = EXCLUDED.modalidade,
                     status = EXCLUDED.status`,
      [aluno.id, aluno.nome, aluno.curso, aluno.modalidade, aluno.status]
    );
  }
}
