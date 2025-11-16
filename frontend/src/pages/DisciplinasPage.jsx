// src/pages/DisciplinasPage.jsx
import React, { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer.jsx";
import { listarDisciplinas } from "../services/disciplinaApi.js";
import { criarMatricula } from "../services/simulacaoApi.js";

const ITENS_POR_PAGINA = 5;

export function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("Todos");
  const [filtroVagas, setFiltroVagas] = useState("todos");

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [matriculaForm, setMatriculaForm] = useState({
    aberta: false,
    idDisciplina: null,
    idAluno: "",
    mensagem: "",
  });

  // ====== Carregar disciplinas do backend ======
  async function carregar() {
    try {
      setLoading(true);
      setErro("");
      const data = await listarDisciplinas();
      setDisciplinas(data || []);
      setPaginaAtual(1); // sempre começa na página 1
    } catch (err) {
      console.error("Erro ao carregar disciplinas:", err);
      setErro("Não foi possível carregar as disciplinas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // ====== Cursos disponíveis (drop-down dinâmico) ======
  const cursos = [
    "Todos",
    ...Array.from(
      new Set(
        (disciplinas || [])
          .map((d) => d.curso)
          .filter((c) => c && c.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b, "pt-BR")),
  ];

  // ====== Filtro principal ======
  const disciplinasFiltradas = (disciplinas || []).filter((disciplina) => {
    const termo = filtroNome.trim().toLowerCase();

    const nomeOk = termo
      ? (disciplina.curso || "").toLowerCase().includes(termo)
      : true;

    const cursoOk =
      filtroCurso === "Todos" || disciplina.curso === filtroCurso;

    let vagasOk = true;
    if (filtroVagas === "com") {
      vagasOk = (disciplina.vagas || 0) > 0;
    } else if (filtroVagas === "sem") {
      vagasOk = !disciplina.vagas || disciplina.vagas <= 0;
    }

    return nomeOk && cursoOk && vagasOk;
  });

  // Sempre que filtro mudar, volta para página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, filtroCurso, filtroVagas]);

  // ====== Paginação ======
  const totalRegistros = disciplinasFiltradas.length;
  const totalPaginas =
    totalRegistros === 0
      ? 1
      : Math.ceil(totalRegistros / ITENS_POR_PAGINA);

  const paginaSegura = Math.min(
    Math.max(paginaAtual, 1),
    totalPaginas
  );

  const indiceInicio = (paginaSegura - 1) * ITENS_POR_PAGINA;
  const indiceFim = indiceInicio + ITENS_POR_PAGINA;

  const disciplinasPagina = disciplinasFiltradas.slice(
    indiceInicio,
    indiceFim
  );

  const labelInicio = totalRegistros === 0 ? 0 : indiceInicio + 1;
  const labelFim = Math.min(indiceFim, totalRegistros);

  function mudarPagina(novaPagina) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
  }

  function montarPaginasVisiveis() {
    const pages = [];

    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (paginaSegura > 3) {
      pages.push("...");
    }

    const inicio = Math.max(2, paginaSegura - 1);
    const fim = Math.min(totalPaginas - 1, paginaSegura + 1);

    for (let i = inicio; i <= fim; i++) {
      pages.push(i);
    }

    if (paginaSegura < totalPaginas - 2) {
      pages.push("...");
    }

    pages.push(totalPaginas);

    return pages;
  }

  const paginasVisiveis = montarPaginasVisiveis();

  // ====== Enviar matrícula (simulação) ======
  async function enviarMatricula(e) {
    e.preventDefault();
    try {
      setMatriculaForm((prev) => ({ ...prev, mensagem: "" }));

      await criarMatricula({
        idDiscente: Number(matriculaForm.idAluno),
        idDisciplina: Number(matriculaForm.idDisciplina),
      });

      // 🔹 Recarrega as disciplinas com vagas atualizadas do backend
      await carregar();

      setMatriculaForm({
        aberta: false,
        idDisciplina: null,
        idAluno: "",
        mensagem: "Matrícula criada com sucesso!",
      });

      alert("Matrícula criada com sucesso!");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Falha ao criar matrícula.";
      alert(msg);
    }
  }

  // ====== Render ======
  return (
    <PageContainer title="Disciplinas disponíveis">
      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        {/* Buscar por nome */}
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-200">
            Buscar por nome
          </label>
          <input
            type="text"
            placeholder="Digite o nome do curso"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
          />
        </div>

        {/* Filtrar por curso */}
        <div className="w-full md:w-1/3">
          <label className="mb-1 block text-sm font-medium text-slate-200">
            Filtrar por curso
          </label>
          <select
            value={filtroCurso}
            onChange={(e) => setFiltroCurso(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
          >
            {cursos.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </div>

        {/* Filtrar por vagas */}
        <div className="w-full md:w-1/4">
          <label className="mb-1 block text-sm font-medium text-slate-200">
            Vagas
          </label>
          <select
            value={filtroVagas}
            onChange={(e) => setFiltroVagas(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
          >
            <option value="todos">Todos</option>
            <option value="com">Somente com vagas</option>
            <option value="sem">Somente sem vagas</option>
          </select>
        </div>
      </div>

      {/* Estado de carregando / erro */}
      {loading && (
        <p className="text-sm text-slate-300">Carregando disciplinas...</p>
      )}
      {erro && (
        <p className="text-sm text-red-400 mb-4">
          {erro}
        </p>
      )}

      {/* Tabela */}
      {!loading && !erro && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Curso
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Vagas
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {disciplinasPagina.map((disciplina) => (
                <tr key={disciplina.id} className="hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-sm text-slate-200">
                    {disciplina.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-100">
                    {disciplina.nome}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {disciplina.curso}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {disciplina.vagas > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                        {disciplina.vagas} vagas
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-300">
                        Sem vagas
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        setMatriculaForm({
                          aberta: true,
                          idDisciplina: disciplina.id,
                          idAluno: "",
                          mensagem: "",
                        })
                      }
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    >
                      Simular matrícula
                    </button>
                  </td>
                </tr>
              ))}

              {disciplinasPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-400"
                  >
                    Nenhuma disciplina encontrada com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {!loading && !erro && totalRegistros > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-slate-300 md:flex-row">
          <p>
            Mostrando{" "}
            <span className="font-semibold">
              {labelInicio}-{labelFim}
            </span>{" "}
            de{" "}
            <span className="font-semibold">
              {totalRegistros}
            </span>{" "}
            disciplinas encontradas.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => mudarPagina(paginaSegura - 1)}
              disabled={paginaSegura === 1}
              className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800/80"
            >
              Anterior
            </button>

            {paginasVisiveis.map((p, index) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => mudarPagina(p)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium ${
                    p === paginaSegura
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => mudarPagina(paginaSegura + 1)}
              disabled={paginaSegura === totalPaginas}
              className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800/80"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* Modal de matrícula */}
      {matriculaForm.aberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 shadow-2xl border border-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Simular matrícula
            </h2>

            <form onSubmit={enviarMatricula} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">
                  Matrícula do aluno
                </label>
                <input
                  type="number"
                  value={matriculaForm.idAluno}
                  onChange={(e) =>
                    setMatriculaForm((prev) => ({
                      ...prev,
                      idAluno: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setMatriculaForm({
                      aberta: false,
                      idDisciplina: null,
                      idAluno: "",
                      mensagem: "",
                    })
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/70"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Confirmar matrícula
                </button>
              </div>
            </form>

            {matriculaForm.mensagem && (
              <p className="mt-3 text-sm text-emerald-300">
                {matriculaForm.mensagem}
              </p>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
