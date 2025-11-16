import { DisciplinaDTO } from "../dtos/DisciplinaDTO.js";

export class DisciplinaMapper {
  static toDTO(disciplina) {
    return new DisciplinaDTO({
      id: disciplina.id,
      nome: disciplina.nome,
      curso: disciplina.curso,
      vagas: disciplina.vagas,
    });
  }
}
