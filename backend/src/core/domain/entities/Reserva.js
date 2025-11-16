// src/core/domain/entities/Reserva.js
let nextReservaId = 1;

export class Reserva {
  constructor({ id, matriculaDiscente, codigoLivro, dataCriacao }) {
    this.id = id || nextReservaId++;
    this.matriculaDiscente = matriculaDiscente;
    this.codigoLivro = codigoLivro;
    this.dataCriacao = dataCriacao || new Date();
  }
}
