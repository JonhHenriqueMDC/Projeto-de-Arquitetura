import { httpClient } from "../../config/httpClient.js";

export class AlunoApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

 
  async getDiscenteByMatricula(matricula) {
    const url = `${this.baseUrl}?matricula=${encodeURIComponent(matricula)}`;
    const response = await httpClient.get(url);
    return response.data;
  }
}
