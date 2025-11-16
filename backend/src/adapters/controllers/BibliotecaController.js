export class BibliotecaController {
  constructor(listarLivrosUseCase) {
    this.listarLivrosUseCase = listarLivrosUseCase;
  }

  async listarLivros(req, res, next) {
    try {
      const livros = await this.listarLivrosUseCase.execute();
      return res.json(livros);
    } catch (error) {
      next(error);
    }
  }
}


//teste no git hub