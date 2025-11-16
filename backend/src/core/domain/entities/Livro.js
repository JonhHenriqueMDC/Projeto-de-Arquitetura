// src/core/domain/entities/Livro.js
export class Livro {
  constructor({ id, titulo, autor, ano, status }) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
    this.status = status; 
  }

  estaDisponivel() {
    if (!this.status) return false;
    return this.status.toLowerCase() === "disponível";
  }
}
