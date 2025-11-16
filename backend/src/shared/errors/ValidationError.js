export class ValidationError extends Error {
  constructor(message = "Dados de entrada inválidos.") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 422;
  }
}