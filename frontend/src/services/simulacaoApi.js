// frontend/src/services/simulacaoApi.js
import { httpClient } from "./httpClient.js";

// Todas as rotas de simulação no backend começam com /api/simulacoes
// O httpClient já tem baseURL = "http://localhost:4000/api"
const BASE = "/simulacoes";

export async function criarMatricula({ idDiscente, idDisciplina }) {
  const response = await httpClient.post(`${BASE}/matriculas`, {
    idDiscente,
    idDisciplina,
  });
  return response.data;
}

export async function cancelarMatricula(id) {
  const response = await httpClient.delete(`${BASE}/matriculas/${id}`);
  return response.data;
}

export async function criarReserva({ idDiscente, idLivro }) {
  const response = await httpClient.post(`${BASE}/reservas`, {
    idDiscente,
    idLivro,
  });
  return response.data;
}

export async function cancelarReserva(id) {
  const response = await httpClient.delete(`${BASE}/reservas/${id}`);
  return response.data;
}

export async function obterEstadoSimulacoes() {
  const response = await httpClient.get(`${BASE}/estado`);
  return response.data;
}
