export class ListarDisciplinasUseCase {
  constructor(disciplinaService) {
    this.disciplinaService = disciplinaService;
  }

  async execute() {
    return await this.disciplinaService.listarTodas();
  }
}
