// src/services/alunoApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  // Aumentamos o timeout para 30 segundos
  timeout: 30000,
});

export async function sincronizarAlunos() {
  // Se quiser, você pode logar isso no console para ver o tempo depois
  return api.post("/discentes/sincronizar");
}

export async function buscarAlunoPorId(id) {
  const resp = await api.get(`/discentes/${id}`);
  return resp.data;
}
