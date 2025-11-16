import { DiscenteDTO } from "../dtos/DiscenteDTO.js";

export class DiscenteMapper {
  static toDTO(discente) {
    return new DiscenteDTO({
      id: discente.id,
      nome: discente.nome,
      curso: discente.curso,
      modalidade: discente.modalidade,
      status: discente.status,
    });
  }
}
