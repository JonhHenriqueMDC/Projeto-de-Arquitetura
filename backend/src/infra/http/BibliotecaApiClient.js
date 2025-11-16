// src/infra/http/BibliotecaApiClient.js
import { httpClient } from "../../config/httpClient.js";

export class BibliotecaApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lista livros do acervo.
   * GET https://.../acervo/biblioteca
   */
  async getLivros() {
    const url = this.baseUrl;
    const response = await httpClient.get(url);
    return response.data;
  }

  /**
   * Busca livro por código (caso a API suporte).
   * Aqui vou supor query param ?codigo=XYZ.
   */
  async getLivroByCodigo(codigo) {
    const url = `${this.baseUrl}?codigo=${encodeURIComponent(codigo)}`;
    const response = await httpClient.get(url);
    return response.data;
  }
}
