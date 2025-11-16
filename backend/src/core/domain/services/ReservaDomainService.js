// src/core/domain/services/ReservaDomainService.js
import { Reserva } from "../entities/Reserva.js";
import { DomainError } from "../../../shared/errors/DomainError.js";

export class ReservaDomainService {
  criarReserva(discente, livro, reservasAtuais) {
    if (!livro.estaDisponivel()) {
      throw new DomainError("Livro não está disponível para reserva.");
    }

    const jaReservado = reservasAtuais.some(
      (r) =>
        r.matriculaDiscente === discente.matricula &&
        String(r.codigoLivro) === String(livro.id)
    );

    if (jaReservado) {
      throw new DomainError("Discente já possui reserva para este livro.");
    }

    return new Reserva({
      matriculaDiscente: discente.matricula,
      codigoLivro: livro.id, // usa o ID do livro
    });
  }
}
