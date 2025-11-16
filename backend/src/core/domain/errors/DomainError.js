export class DomainError extends Error {
  /**
   * @param {string} message - mensagem amigável de regra de negócio
   * @param {object} [metadata] - dados extras úteis para log/debug
   */
  constructor(message, metadata = {}) {
    super(message);
    this.name = "DomainError";
    this.metadata = metadata;
  }
}