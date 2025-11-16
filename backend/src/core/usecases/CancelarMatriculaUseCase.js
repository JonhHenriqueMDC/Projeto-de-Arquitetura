import { NotFoundError } from "../../shared/errors/NotFoundError.js";

export class CancelarMatriculaUseCase {
  constructor(matriculaRepository) {
    this.matriculaRepository = matriculaRepository;
  }

  async execute(idMatricula) {
    const todas = await this.matriculaRepository.listarPorDiscente("*"); // mock
    const existe = todas.find((m) => m.id === Number(idMatricula));

    if (!existe) {
      throw new NotFoundError("Matrícula não encontrada.");
    }

    await this.matriculaRepository.remover(idMatricula);

    return { mensagem: "Matrícula removida com sucesso." };
  }
}
