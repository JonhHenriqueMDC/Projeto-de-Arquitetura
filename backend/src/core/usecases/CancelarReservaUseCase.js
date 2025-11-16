import { NotFoundError } from "../../shared/errors/NotFoundError.js";

export class CancelarReservaUseCase {
  constructor(reservaRepository) {
    this.reservaRepository = reservaRepository;
  }

  async execute(idReserva) {
    const reservas = await this.reservaRepository.listarPorDiscente("*"); // mock
    const encontrada = reservas.find((r) => r.id === Number(idReserva));

    if (!encontrada) {
      throw new NotFoundError("Reserva não encontrada.");
    }

    await this.reservaRepository.remover(idReserva);

    return { mensagem: "Reserva removida com sucesso." };
  }
}
