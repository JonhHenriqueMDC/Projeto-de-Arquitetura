// src/services/bibliotecaApi.js
import axios from "axios";

// Cliente HTTP para falar com o backend da Biblioteca
const apiBiblioteca = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 5000,
});

export async function listarLivros() {
  const resposta = await apiBiblioteca.get("/livros");
  const data = resposta.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.livros)) {
    return data.livros;
  }


  return [];
}
