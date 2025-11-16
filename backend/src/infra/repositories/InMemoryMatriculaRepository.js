import { IMatriculaRepository } from "../../core/ports/IMatriculaRepository.js";

export class InMemoryMatriculaRepository extends IMatriculaRepository {
  constructor() {
    super();
    this.matriculas = [];
  }

  async listarPorDiscente(matriculaDiscente) {
    if (matriculaDiscente === "*" || matriculaDiscente === undefined) {
      // modo "listar tudo", usado em alguns casos de uso
      return [...this.matriculas];
    }

    return this.matriculas.filter(
      (m) => m.matriculaDiscente === matriculaDiscente
    );
  }

  async salvar(matricula) {
    this.matriculas.push(matricula);
    return matricula;
  }

  async remover(id) {
    const numericId = Number(id);
    this.matriculas = this.matriculas.filter((m) => m.id !== numericId);
  }
}
