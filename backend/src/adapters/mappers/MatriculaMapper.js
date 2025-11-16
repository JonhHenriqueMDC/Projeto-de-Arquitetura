import { MatriculaDTO } from "../dtos/MatriculaDTO.js";

export class MatriculaMapper {
  static toDTO(m) {
    return new MatriculaDTO({
      id: m.id,
      matriculaDiscente: m.matriculaDiscente,
      codigoDisciplina: m.codigoDisciplina,
      dataCriacao: m.dataCriacao,
    });
  }
}
