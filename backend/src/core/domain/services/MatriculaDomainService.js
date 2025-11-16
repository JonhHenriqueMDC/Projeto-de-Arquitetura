// src/core/domain/services/MatriculaDomainService.js
import { Matricula } from "../entities/Matricula.js";
import { DomainError } from "../errors/DomainError.js";

export class MatriculaDomainService {
  /**
   * discente: objeto vindo da API/cache de alunos
   * disciplina: objeto vindo da API/cache de disciplinas
   * matriculasAtuais: array de matrículas já existentes para esse discente
   * idDiscente: id/matrícula do aluno (string ou number)
   */
  criarMatricula(discente, disciplina, matriculasAtuais = [], idDiscente) {
    if (!discente || !disciplina) {
      throw new DomainError("Discente e disciplina são obrigatórios.");
    }

    // ---- 1) Regras sobre o discente ----
    const status = (discente.status || "").toUpperCase();

    if (status === "TRANCADO" || status === "TRANCADA") {
      throw new DomainError(
        `Discente ${
          discente.nome ?? discente.id
        } está com matrícula trancada e não pode se matricular.`
      );
    }

    // Limite de disciplinas (exemplo: máximo 5)
    if (Array.isArray(matriculasAtuais) && matriculasAtuais.length >= 5) {
      throw new DomainError("Discente já possui 5 disciplinas matriculadas.");
    }

    // Curso precisa bater (se vier preenchido em ambos)
    if (discente.curso && disciplina.curso && discente.curso !== disciplina.curso) {
      throw new DomainError(
        `Disciplina pertence ao curso "${disciplina.curso}" e o discente é de "${discente.curso}".`
      );
    }

    // ---- 2) Regras sobre a disciplina ----
    const vagas = typeof disciplina.vagas === "number"
      ? disciplina.vagas
      : Number(disciplina.vagas ?? 0);

    if (!Number.isFinite(vagas)) {
      throw new DomainError("Campo 'vagas' da disciplina é inválido.");
    }

    if (vagas <= 0) {
      throw new DomainError("Disciplina sem vagas disponíveis.");
    }

    // ---- 3) Criar a matrícula de domínio ----
    const matricula = new Matricula({
      matriculaDiscente: String(idDiscente ?? discente.id),
      codigoDisciplina: String(disciplina.id),
    });

    return matricula;
  }
}
