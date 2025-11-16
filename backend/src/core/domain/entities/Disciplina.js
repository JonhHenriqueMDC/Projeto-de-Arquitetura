// src/core/domain/entities/Disciplina.js
export class Disciplina {
  constructor({ id, curso, nome, vagas }) {
    this.id = id;
    this.curso = curso;
    this.nome = nome;
    this.vagas = vagas;
  }

  temVagaDisponivel() {
    return this.vagas > 0;
  }
}
