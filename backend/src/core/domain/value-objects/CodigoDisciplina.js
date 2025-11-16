// src/core/domain/value-objects/CodigoDisciplina.js
export class CodigoDisciplina {
  constructor(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("CodigoDisciplina inválido.");
    }
    this.valor = valor;
  }

  toString() {
    return this.valor;
  }
}
