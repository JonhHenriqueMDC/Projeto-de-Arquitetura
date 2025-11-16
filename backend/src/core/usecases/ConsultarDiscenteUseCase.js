
export class ConsultarDiscenteUseCase {
  constructor(alunoService) {
    this.alunoService = alunoService; 
  }

  async execute(matricula) {
    return await this.alunoService.buscarPorMatricula(matricula);
  }
}
