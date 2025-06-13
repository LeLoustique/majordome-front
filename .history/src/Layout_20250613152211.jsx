import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optionnel pour icônes
import { useAuth } from "./auth/AuthProvider";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-20 top-0 left-0 h-full w-64 bg-blue-700 text-white transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <div className="text-xl font-bold">🧥 Majordome</div>
          <button onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="hidden md:block text-2xl font-bold text-center py-6">🧥 Majordome</div>
        <nav className="space-y-4 px-6 mt-6">
          <Link
            to="/"
            className={`block py-2 px-4 rounded ${
              location.pathname === "/" ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/chat"
            className={`block py-2 px-4 rounded ${
              location.pathname === "/chat" ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            Chat
          </Link>
          <Link
            to="/parametres"
            className={`block py-2 px-4 rounded ${
              location.pathname === "/parametres" ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            Paramètres
          </Link>
                  <button
          onClick={onLogout}
          className="w-full text-left py-2 px-4 rounded hover:bg-red-600 bg-red-500 text-white"
        >
          Déconnexion
        </button>
        </nav>
      </div>

      {/* Page content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Topbar */}
        <div className="md:hidden bg-white shadow px-4 py-3 flex items-center justify-between">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-blue-700" />
          </button>
          <div className="text-blue-700 font-semibold text-lg">Majordome</div>
        </div>

        {/* Outlet: content of current route */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
