import React from "react";
import { NavLink } from "react-router-dom";

export function SidebarLayout({ children }) {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              B
            </div>
            <div>
              <p className="text-sm font-semibold">Biblioteca</p>
              <p className="text-xs text-slate-400">Sistema Acadêmico</p>
            </div>
          </div>
          <nav className="mt-4 px-2 space-y-1">
            <SideLink to="/" label="Início" />
            <SideLink to="/aluno" label="Aluno" />
            <SideLink to="/disciplinas" label="Disciplinas" />
            <SideLink to="/acervo" label="Biblioteca" />
            <SideLink to="/simulacoes" label="Simulações" />
          </nav>
        </div>

        <div className="px-5 py-4 text-xs text-slate-500 border-t border-slate-800">
          © 2025 Jonh Henrique.
        </div>
      </aside>

      {/* Área principal */}
      <div className="flex-1 bg-slate-900 text-slate-50 flex flex-col">
        <header className="px-8 py-4 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-sm font-medium text-slate-300">
            Sistema Biblioteca
          </h1>
          {/* Slot pra ícones no futuro, se quiser */}
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

function SideLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
