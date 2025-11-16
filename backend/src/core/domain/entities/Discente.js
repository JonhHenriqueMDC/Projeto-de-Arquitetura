// src/core/domain/entities/Discente.js
export class Discente {
  constructor({ id, nome, curso, modalidade, status }) {
    this.id = id;
    this.nome = nome;
    this.curso = curso;
    this.modalidade = modalidade;
    this.status = status; 
  }

  estaTrancado() {
    if (!this.status) return false;
    return this.status.toLowerCase() === "trancado";
  }
}
