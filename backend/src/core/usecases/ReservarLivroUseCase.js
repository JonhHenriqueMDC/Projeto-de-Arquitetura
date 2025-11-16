export class ReservarLivroUseCase {
  constructor(bibliotecaService, reservaRepository, reservaDomainService) {
    this.bibliotecaService = bibliotecaService;
    this.reservaRepository = reservaRepository;
    this.reservaDomainService = reservaDomainService;
  }

  async execute({ matriculaDiscente, codigoLivro }) {
    const livro = await this.bibliotecaService.buscarPorCodigo(codigoLivro);
    const reservasAtuais = await this.reservaRepository.listarPorDiscente(matriculaDiscente);

    const reserva = this.reservaDomainService.criarReserva(
      { matricula: matriculaDiscente },
      livro,
      reservasAtuais
    );

    await this.reservaRepository.salvar(reserva);

    return reserva;
  }
}
