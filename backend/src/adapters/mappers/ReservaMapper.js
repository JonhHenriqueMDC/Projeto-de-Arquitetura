import { ReservaDTO } from "../dtos/ReservaDTO.js";

export class ReservaMapper {
  static toDTO(r) {
    return new ReservaDTO({
      id: r.id,
      matriculaDiscente: r.matriculaDiscente,
      codigoLivro: r.codigoLivro,
      dataCriacao: r.dataCriacao,
    });
  }
}
