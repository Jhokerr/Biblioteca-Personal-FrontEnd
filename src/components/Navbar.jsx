// src/components/Navbar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenIcon, PlusIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-indigo-800 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo y nombre */}
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="h-8 w-8 text-yellow-400 drop-shadow-md" />
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:text-yellow-300 transition-colors"
          >
            Mi Librería
          </Link>
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7 text-white" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-white" />
          )}
        </button>

        {/* Links principales */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-sm font-medium tracking-wide py-2 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:text-indigo-800"
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>Libros</span>
          </Link>
          <Link
            to="/add"
            className="flex items-center space-x-2 bg-yellow-400 text-indigo-900 font-semibold text-sm py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-300 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Añadir Libro</span>
          </Link>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-indigo-900 text-white px-6 py-4 space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-sm font-medium tracking-wide py-2 px-4 rounded-lg hover:bg-white hover:text-indigo-800 transition"
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>Libros</span>
          </Link>
          <Link
            to="/add"
            className="flex items-center space-x-2 bg-yellow-400 text-indigo-900 font-semibold text-sm py-2 px-4 rounded-lg shadow-md hover:bg-yellow-300 hover:scale-105 transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Añadir Libro</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
