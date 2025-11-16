import { LivroDTO } from "../dtos/LivroDTO.js";

export class LivroMapper {
  static toDTO(livro) {
    return new LivroDTO({
      id: livro.id,
      titulo: livro.titulo,
      autor: livro.autor,
      ano: livro.ano,
      status: livro.status,
    });
  }
}
