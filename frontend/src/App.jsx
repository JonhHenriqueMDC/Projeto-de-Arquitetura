import React from "react";
import { AppRouter } from "./routes/router.jsx";
import { SidebarLayout } from "./components/layout/SidebarLayout.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
      {/* “moldura” clara de fundo tipo protótipo da Stitch */}
      <div className="w-full max-w-6xl h-[90vh] bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
        <SidebarLayout>
          <AppRouter />
        </SidebarLayout>
      </div>
    </div>
  );
}
