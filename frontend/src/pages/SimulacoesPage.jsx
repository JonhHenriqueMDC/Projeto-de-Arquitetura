import React, { useState } from "react";
import { PageContainer } from "../components/layout/PageContainer.jsx";
import {
  criarMatricula,
  cancelarMatricula,
  criarReserva,
  cancelarReserva,
} from "../services/simulacaoApi.js";

export function SimulacoesPage() {
  const [aba, setAba] = useState("matriculas");

  return (
    <PageContainer
      title="Simulações"
      description="Gerencie suas simulações de matrículas e reservas."
    >
      <div className="flex gap-3 border-b mb-4">
        <button
          onClick={() => setAba("matriculas")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            aba === "matriculas"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500"
          }`}
        >
          Matrículas
        </button>

        <button
          onClick={() => setAba("reservas")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            aba === "reservas"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500"
          }`}
        >
          Reservas
        </button>
      </div>

      {aba === "matriculas" ? <AbaMatriculas /> : <AbaReservas />}
    </PageContainer>
  );
}

/* ===================== ABA DE MATRÍCULAS ===================== */
function AbaMatriculas() {
  const [form, setForm] = useState({ idAluno: "", idDisciplina: "" });

  async function enviar(e) {
    e.preventDefault();
    try {
      await criarMatricula({
        idDiscente: Number(form.idAluno),
        idDisciplina: Number(form.idDisciplina),
      });

      alert("Matrícula criada!");
      setForm({ idAluno: "", idDisciplina: "" });
    } catch (err) {
      const msg =
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Erro ao criar matrícula.";
      alert(msg);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 max-w-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        Criar nova matrícula
      </h3>

      <form className="flex flex-col gap-3" onSubmit={enviar}>
        <label className="text-sm font-medium text-slate-700">
          ID do discente
          <input
            type="number"
            value={form.idAluno}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idAluno: e.target.value }))
            }
            className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          ID da disciplina
          <input
            type="number"
            value={form.idDisciplina}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idDisciplina: e.target.value }))
            }
            className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
          />
        </label>

        <button
          type="submit"
          className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-blue-700"
        >
          Simular matrícula
        </button>
      </form>
    </div>
  );
}

/* ===================== ABA DE RESERVAS ===================== */
function AbaReservas() {
  const [form, setForm] = useState({ idAluno: "", idLivro: "" });

  async function enviar(e) {
    e.preventDefault();
    try {
      await criarReserva({
        idDiscente: Number(form.idAluno),
        idLivro: Number(form.idLivro),
      });

      alert("Reserva criada!");
      setForm({ idAluno: "", idLivro: "" });
    } catch (err) {
      const msg =
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Erro ao criar reserva.";
      alert(msg);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 max-w-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        Criar nova reserva
      </h3>

      <form className="flex flex-col gap-3" onSubmit={enviar}>
        <label className="text-sm font-medium text-slate-700">
          ID do discente
          <input
            type="number"
            value={form.idAluno}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idAluno: e.target.value }))
            }
            className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          ID do livro
          <input
            type="number"
            value={form.idLivro}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idLivro: e.target.value }))
            }
            className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
          />
        </label>

        <button
          type="submit"
          className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-blue-700"
        >
          Simular reserva
        </button>
      </form>
    </div>
  );
}
