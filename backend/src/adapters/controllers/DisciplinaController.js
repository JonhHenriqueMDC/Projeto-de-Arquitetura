export class DisciplinaController {
  constructor(listarDisciplinasUseCase) {
    this.listarDisciplinasUseCase = listarDisciplinasUseCase;
  }

  async listarDisciplinas(req, res, next) {
    try {
      const disciplinas = await this.listarDisciplinasUseCase.execute();
      return res.json(disciplinas);
    } catch (error) {
      next(error);
    }
  }
}
