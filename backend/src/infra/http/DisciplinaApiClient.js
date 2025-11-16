// src/infra/http/DisciplinaApiClient.js
import { httpClient } from "../../config/httpClient.js";

export class DisciplinaApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lista todas as disciplinas.
   * GET https://.../discilplinaServico/msDisciplina
   */
  async getTodasDisciplinas() {
    const url = this.baseUrl;
    const response = await httpClient.get(url);
    return response.data;
  }

  /**
   * Busca disciplina por código.
   * Dependendo da API, pode ser:
   *  - query param: ?codigo=SI001
   *  - path: /SI001
   * Aqui vou usar query param, depois você ajusta se precisar.
   */
  async getDisciplinaByCodigo(codigo) {
    const url = `${this.baseUrl}?codigo=${encodeURIComponent(codigo)}`;
    const response = await httpClient.get(url);
    return response.data;
  }
}
