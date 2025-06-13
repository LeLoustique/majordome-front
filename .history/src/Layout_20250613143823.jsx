import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col py-6">
        <div className="text-2xl font-bold text-center mb-10">🧥 Majordome</div>
        <nav className="space-y-4 px-6">
          <Link
            to="/"
            className={`block py-2 px-4 rounded ${
              location.pathname === "/" ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/chat"
            className={`block py-2 px-4 rounded ${
              location.pathname === "/chat" ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
          >
            Chat
          </Link>
          <Link
            to="/parametres"
            className={`block py-2 px-4 rounded ${
              location.pathname === "/parametres" ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
          >
            Paramètres
          </Link>
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1">
        <Outlet /> {/* C’est ici que chaque page s'affiche */}
      </main>
    </div>
  );
}

export default Layout;
