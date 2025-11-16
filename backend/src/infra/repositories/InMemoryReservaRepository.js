import { IReservaRepository } from "../../core/ports/IReservaRepository.js";

export class InMemoryReservaRepository extends IReservaRepository {
  constructor() {
    super();
    this.reservas = [];
  }

  async listarPorDiscente(matriculaDiscente) {
    if (matriculaDiscente === "*" || matriculaDiscente === undefined) {
      return [...this.reservas];
    }

    return this.reservas.filter(
      (r) => r.matriculaDiscente === matriculaDiscente
    );
  }

  async salvar(reserva) {
    this.reservas.push(reserva);
    return reserva;
  }

  async remover(id) {
    const numericId = Number(id);
    this.reservas = this.reservas.filter((r) => r.id !== numericId);
  }
}
