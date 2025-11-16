import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import { AlunoPage } from "../pages/AlunoPage.jsx";
import { DisciplinasPage } from "../pages/DisciplinasPage.jsx";
import { AcervoPage } from "../pages/AcervoPage.jsx";
import { SimulacoesPage } from "../pages/SimulacoesPage.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/aluno" element={<AlunoPage />} />
      <Route path="/disciplinas" element={<DisciplinasPage />} />
      <Route path="/acervo" element={<AcervoPage />} />
      <Route path="/simulacoes" element={<SimulacoesPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
