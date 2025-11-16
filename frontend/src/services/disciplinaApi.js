// src/services/disciplinaApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 30000, 
});

// Lista TODAS as disciplinas que o backend devolver
export async function listarDisciplinas() {
  const resp = await api.get("/disciplinas");
  return resp.data || [];
}
