// src/pages/AcervoPage.jsx
import { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer.jsx";
import { listarLivros } from "../services/bibliotecaApi.js";
import { criarReserva } from "../services/simulacaoApi.js";

// 2 linhas x 3 colunas
const ITENS_POR_PAGINA = 6;

export function AcervoPage() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [reservaForm, setReservaForm] = useState({
    aberta: false,
    idLivro: null,
    idAluno: "",
    mensagem: "",
  });

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");
      const lista = await listarLivros();
      setLivros(lista || []);
      setPaginaAtual(1);
    } catch (e) {
      console.error(e);
      setErro("Falha ao carregar acervo.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const livrosFiltrados = livros.filter((l) => {
    const titulo = (l.titulo || "").toLowerCase();
    const buscaOk = titulo.includes(busca.toLowerCase());
    const statusLivro = l.status || "Indisponível";

    const statusOk =
      statusFiltro === "Todos" ||
      (statusFiltro === "Disponível" && statusLivro === "Disponível") ||
      (statusFiltro === "Indisponível" && statusLivro !== "Disponível");

    return buscaOk && statusOk;
  });

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, statusFiltro]);

  // ====== Paginação ======
  const totalRegistros = livrosFiltrados.length;
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

  const livrosPagina = livrosFiltrados.slice(indiceInicio, indiceFim);

  const labelInicio = totalRegistros === 0 ? 0 : indiceInicio + 1;
  const labelFim = Math.min(indiceFim, totalRegistros);

  function mudarPagina(novaPagina) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
  }

  function montarPaginasVisiveis() {
    const pages = [];

    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (paginaSegura > 3) {
      pages.push("...");
    }

    const inicio = Math.max(2, paginaSegura - 1);
    const fim = Math.min(totalPaginas - 1, paginaSegura + 1);

    for (let i = inicio; i <= fim; i++) pages.push(i);

    if (paginaSegura < totalPaginas - 2) {
      pages.push("...");
    }

    pages.push(totalPaginas);

    return pages;
  }

  const paginasVisiveis = montarPaginasVisiveis();

  function abrirReserva(idLivro) {
    setReservaForm({
      aberta: true,
      idLivro,
      idAluno: "",
      mensagem: "",
    });
  }

  function fecharReserva() {
    setReservaForm({
      aberta: false,
      idLivro: null,
      idAluno: "",
      mensagem: "",
    });
  }

  async function enviarReserva(e) {
    e.preventDefault();
    try {
      setReservaForm((prev) => ({ ...prev, mensagem: "" }));

      await criarReserva({
        idDiscente: Number(reservaForm.idAluno),
        idLivro: Number(reservaForm.idLivro),
      });

      await carregar();

      setReservaForm({
        aberta: false,
        idLivro: null,
        idAluno: "",
        mensagem: "Reserva criada com sucesso!",
      });

      alert("Reserva criada com sucesso!");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Falha ao criar reserva.";
      alert(msg);
    }
  }

  return (
    <PageContainer title="Biblioteca">
      {/* FILTROS – mais compactos */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-200">
            Buscar por título
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
            placeholder="Digite o título do livro"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="w-full md:w-56">
          <label className="text-xs font-medium text-slate-200">
            Status
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Disponível">Disponíveis</option>
            <option value="Indisponível">Indisponíveis</option>
          </select>
        </div>
      </div>

      {/* ERRO / LOADING */}
      {erro && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
          <p className="text-xs text-red-200">{erro}</p>
        </div>
      )}

      {carregando && !erro && (
        <div className="py-6 text-center">
          <p className="text-sm text-slate-300">Carregando livros...</p>
        </div>
      )}

      {/* GRID + PAGINAÇÃO */}
      {!carregando && !erro && (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {livrosPagina.map((livro) => (
              <div
                key={livro.id}
                className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md shadow-black/30"
              >
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-slate-50 line-clamp-2">
                    {livro.titulo}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {livro.autor || "Autor não informado"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Ano: {livro.ano ?? "—"}
                  </p>
                </div>

                <div className="mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      livro.status === "Disponível"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-700/60 text-slate-300"
                    }`}
                  >
                    {livro.status === "Disponível"
                      ? "Disponível"
                      : "Indisponível"}
                  </span>
                </div>

                <div className="mt-auto">
                  <button
                    className={`w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      livro.status === "Disponível"
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "cursor-not-allowed bg-slate-800 text-slate-500"
                    }`}
                    type="button"
                    disabled={livro.status !== "Disponível"}
                    onClick={() => abrirReserva(livro.id)}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            ))}

            {livrosPagina.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <p className="text-sm text-slate-400">
                  Nenhum livro encontrado com os filtros atuais.
                </p>
              </div>
            )}
          </div>

          {/* Paginação (igual Disciplinas) */}
          {totalRegistros > 0 && (
            <div className="mt-3 flex flex-col items-center justify-between gap-2 text-xs text-slate-300 md:flex-row">
              <p>
                Mostrando{" "}
                <span className="font-semibold">
                  {labelInicio}-{labelFim}
                </span>{" "}
                de{" "}
                <span className="font-semibold">
                  {totalRegistros}
                </span>{" "}
                livros encontrados.
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
        </>
      )}

      {/* Modal de reserva */}
      {reservaForm.aberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Simular reserva
            </h2>

            <form onSubmit={enviarReserva} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">
                  ID do usuário
                </label>
                <input
                  type="number"
                  value={reservaForm.idAluno}
                  onChange={(e) =>
                    setReservaForm((prev) => ({
                      ...prev,
                      idAluno: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/40"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">
                  ID do livro
                </label>
                <input
                  type="text"
                  value={reservaForm.idLivro ?? ""}
                  disabled
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-300 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={fecharReserva}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/70"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Confirmar reserva
                </button>
              </div>
            </form>

            {reservaForm.mensagem && (
              <p className="mt-3 text-sm text-emerald-300">
                {reservaForm.mensagem}
              </p>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default AcervoPage;
