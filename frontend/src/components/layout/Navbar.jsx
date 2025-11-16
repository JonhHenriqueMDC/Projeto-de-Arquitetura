import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors";
const linkInactive = "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
const linkActive = "bg-primary text-white";

export function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            B
          </div>
          <span className="font-semibold text-slate-800">
            Biblioteca – Sistema Acadêmico
          </span>
        </div>
        <nav className="flex gap-2">
          <NavItem to="/">Início</NavItem>
          <NavItem to="/aluno">Aluno</NavItem>
          <NavItem to="/disciplinas">Disciplinas</NavItem>
          <NavItem to="/acervo">Acervo</NavItem>
          <NavItem to="/simulacoes">Simulações</NavItem>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      {children}
    </NavLink>
  );
}
