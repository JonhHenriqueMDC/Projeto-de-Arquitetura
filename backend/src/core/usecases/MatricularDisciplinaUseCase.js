export class MatricularDisciplinaUseCase {
  constructor(alunoService, disciplinaService, matriculaRepository, matriculaDomainService) {
    this.alunoService = alunoService;
    this.disciplinaService = disciplinaService;
    this.matriculaRepository = matriculaRepository;
    this.matriculaDomainService = matriculaDomainService;
  }

  async execute({ idDiscente, idDisciplina }) {
    const discente = await this.alunoService.buscarPorMatricula(idDiscente);
    const disciplina = await this.disciplinaService.buscarPorCodigo(idDisciplina);
    const matriculasAtuais = await this.matriculaRepository.listarPorDiscente(idDiscente);

    const novaMatricula = this.matriculaDomainService.criarMatricula(
      discente,
      disciplina,
      matriculasAtuais,
      idDiscente
    );

    await this.matriculaRepository.salvar(novaMatricula);

    return novaMatricula;
  }
}
