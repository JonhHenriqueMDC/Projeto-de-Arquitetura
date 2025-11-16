// src/core/domain/value-objects/CodigoLivro.js
export class CodigoLivro {
  constructor(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("CodigoLivro inválido.");
    }
    this.valor = valor;
  }

  toString() {
    return this.valor;
  }
}
