// src/core/domain/value-objects/IdDiscente.js
export class IdDiscente {
  constructor(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("IdDiscente inválido.");
    }
    this.valor = valor;
  }

  toString() {
    return this.valor;
  }
}
