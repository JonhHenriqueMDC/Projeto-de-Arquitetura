// src/pages/AlunoPage.jsx
import React, { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer.jsx";
import {
  buscarAlunoPorId,
  sincronizarAlunos,
} from "../services/alunoApi.js";

export function AlunoPage() {
  const [id, setId] = useState("");
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncMensagem, setSyncMensagem] = useState("");

  // Ao entrar na página, tenta sincronizar os discentes com a API externa
  useEffect(() => {
    async function sync() {
      try {
        setSyncMensagem("Sincronizando dados dos alunos...");
        await sincronizarAlunos();
        setSyncMensagem("Dados dos alunos atualizados com sucesso ✅");
        setTimeout(() => setSyncMensagem(""), 4000);
      } catch (err) {
        console.error("Falha ao sincronizar discentes:", err);
        setSyncMensagem(
          "Não foi possível atualizar os dados dos alunos. Usando dados locais, se disponíveis."
        );
        setTimeout(() => setSyncMensagem(""), 5000);
      }
    }

    sync();
  }, []);

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    setAluno(null);

    if (!id || id.trim() === "") {
      setErro("Informe o ID do aluno.");
      return;
    }

    try {
      setLoading(true);
      const data = await buscarAlunoPorId(id);
      if (!data) {
        setErro("Aluno não encontrado.");
        setAluno(null);
        return;
      }
      setAluno(data);
    } catch (err) {
      console.error("Erro ao buscar aluno:", err);
      const mensagem =
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        "Não foi possível encontrar o aluno.";
      setErro(mensagem);
      setAluno(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer
      title="Dados do Aluno"
      description="Consulte as informações do aluno a partir do seu ID."
    >
      {/* Mensagem de sincronização */}
      {syncMensagem && (
        <div className="mb-4 bg-sky-50 border border-sky-200 rounded-md px-3 py-2">
          <p className="text-xs text-sky-800">{syncMensagem}</p>
        </div>
      )}

      {/* FORMULÁRIO DE BUSCA */}
      <form
        onSubmit={handleBuscar}
        className="bg-white rounded-lg shadow-sm border p-5 mb-6 flex flex-col gap-4 max-w-md"
      >
        <label className="text-sm font-medium text-slate-700">
          ID do aluno
          <input
            type="number"
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Digite o ID"
          />
        </label>
        <button
          type="submit"
          className="self-start px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar aluno"}
        </button>
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-700">{erro}</p>
          </div>
        )}
      </form>

      {/* RESULTADO */}
      {aluno && !erro && (
        <div className="bg-white rounded-lg shadow-sm border p-5 max-w-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Detalhes do aluno
          </h2>
          <div className="space-y-2">
            <Linha label="ID" valor={aluno.id} />
            <Linha label="Nome" valor={aluno.nome} />
            <Linha label="Curso" valor={aluno.curso} />
            <Linha label="Modalidade" valor={aluno.modalidade} />
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <span className="font-medium text-slate-900">Status:</span>
              <StatusBadge status={aluno.status} />
            </p>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function Linha({ label, valor }) {
  return (
    <p className="text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}:</span>{" "}
      {valor ?? "-"}
    </p>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const isTrancado = normalized === "trancado";

  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
  const cor = isTrancado
    ? "bg-red-100 text-red-700"
    : "bg-emerald-100 text-emerald-700";

  return <span className={`${base} ${cor}`}>{status || "Desconhecido"}</span>;
}

export default AlunoPage;
