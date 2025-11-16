import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer.jsx";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Bem-vindo ao Sistema Biblioteca"
      description="Sua plataforma para consultar alunos, disciplinas, acervo da biblioteca e realizar simulações acadêmicas."
    >
      <div className="grid md:grid-cols-3 gap-4">
        <HomeCard
          titulo="Consulta de Alunos"
          texto="Visualize informações básicas do aluno, como curso, modalidade e status."
          acao={() => navigate("/aluno")}
        />
        <HomeCard
          titulo="Disciplinas"
          texto="Explore a lista de disciplinas disponíveis e simule matrículas."
          acao={() => navigate("/disciplinas")}
        />
        <HomeCard
          titulo="Acervo da Biblioteca"
          texto="Veja os livros disponíveis e simule reservas de forma rápida."
          acao={() => navigate("/acervo")}
        />
      </div>

      <section className="mt-8 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-50 mb-2">
          Planeje seu próximo semestre
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Acesse a área de simulações para gerenciar matrículas e reservas em
          um ambiente seguro e controlado.
        </p>
        <button
          onClick={() => navigate("/simulacoes")}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Acessar Simulação
        </button>
      </section>
    </PageContainer>
  );
}

function HomeCard({ titulo, texto, acao }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-slate-50 mb-1">{titulo}</h2>
        <p className="text-xs text-slate-400">{texto}</p>
      </div>
      <button
        onClick={acao}
        className="mt-4 inline-flex justify-center items-center w-full px-3 py-2 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Acessar
      </button>
    </div>
  );
}
