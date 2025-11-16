// src/infra/repositories/LivroCacheRepository.js
import { pool } from "../../config/db.js";

export class LivroCacheRepository {
  async findAll() {
    const result = await pool.query(
      `SELECT id, titulo, autor, ano, status
       FROM mini_arquitetura.livro_cache`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT id, titulo, autor, ano, status
       FROM mini_arquitetura.livro_cache
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async saveOrUpdateMany(livros) {
    for (const l of livros) {
      await pool.query(
        `INSERT INTO mini_arquitetura.livro_cache (id, titulo, autor, ano, status)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id)
         DO UPDATE SET titulo = EXCLUDED.titulo,
                       autor = EXCLUDED.autor,
                       ano = EXCLUDED.ano,
                       status = EXCLUDED.status`,
        [l.id, l.titulo, l.autor, l.ano, l.status]
      );
    }
  }
}
