export class ListarLivrosUseCase {
  constructor(bibliotecaService) {
    this.bibliotecaService = bibliotecaService;
  }

  async execute() {
    return await this.bibliotecaService.listarLivros();
  }
}
