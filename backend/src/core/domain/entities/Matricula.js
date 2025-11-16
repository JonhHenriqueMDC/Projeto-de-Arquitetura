// src/core/domain/entities/Matricula.js
let nextMatriculaId = 1;

export class Matricula {
  constructor({ id, matriculaDiscente, codigoDisciplina, dataCriacao }) {
    this.id = id || nextMatriculaId++;
    this.matriculaDiscente = matriculaDiscente;
    this.codigoDisciplina = codigoDisciplina;
    this.dataCriacao = dataCriacao || new Date();
  }
}
